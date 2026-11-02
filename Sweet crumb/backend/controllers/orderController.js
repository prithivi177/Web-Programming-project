const { pool } = require('../db');

// Helper to generate unique human-readable order reference: e.g. SC-20261012-7842
function generateOrderReference() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SC-${year}${month}${day}-${randomSuffix}`;
}

// POST /api/orders - Public endpoint to create customer order with MySQL transaction
async function createOrder(req, res) {
  let connection;
  try {
    const {
      customer_name,
      phone,
      email,
      product_id,
      quantity,
      order_date,
      fulfilment_type,
      delivery_address,
      additional_instructions
    } = req.body;

    // 1. Validation
    if (!customer_name || customer_name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }

    if (!phone || !/^[0-9+() -]{10,20}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number.' });
    }

    if (email && email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid email address format.' });
    }

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Please select a bakery product.' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 50) {
      return res.status(400).json({ success: false, message: 'Quantity must be between 1 and 50.' });
    }

    if (!order_date) {
      return res.status(400).json({ success: false, message: 'Please select an order date.' });
    }

    const fType = fulfilment_type === 'Delivery' ? 'Delivery' : 'Pickup';
    if (fType === 'Delivery' && (!delivery_address || delivery_address.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Delivery address is required for home delivery.' });
    }

    // Acquire dedicated connection for transaction
    connection = await pool.getConnection();

    // 2. Fetch the verified product details and unit price directly from MySQL
    const [products] = await connection.query(
      'SELECT id, name, price, available FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected product does not exist.' });
    }

    const product = products[0];
    if (!product.available) {
      return res.status(400).json({ success: false, message: `"${product.name}" is currently sold out / unavailable.` });
    }

    // 3. Compute trusted server-side total
    const unitPrice = parseFloat(product.price);
    const subtotal = parseFloat((unitPrice * qty).toFixed(2));
    const totalAmount = subtotal; // Single item order or expandable
    const orderReference = generateOrderReference();

    // 4. Begin Database Transaction
    await connection.beginTransaction();

    // Insert into orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders
        (order_reference, customer_name, phone, email, order_date, fulfilment_type, delivery_address, additional_instructions, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        orderReference,
        customer_name.trim(),
        phone.trim(),
        email && email.trim() !== '' ? email.trim() : null,
        order_date,
        fType,
        fType === 'Delivery' ? delivery_address.trim() : null,
        additional_instructions && additional_instructions.trim() !== '' ? additional_instructions.trim() : null,
        totalAmount
      ]
    );

    const orderId = orderResult.insertId;

    // Insert snapshot into order_items table
    await connection.query(
      `INSERT INTO order_items
        (order_id, product_id, product_name, unit_price, quantity, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, product.id, product.name, unitPrice, qty, subtotal]
    );

    // Commit Transaction
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! Freshly baked with love.',
      data: {
        order_id: orderId,
        order_reference: orderReference,
        customer_name: customer_name.trim(),
        product_name: product.name,
        quantity: qty,
        unit_price: unitPrice,
        total_amount: totalAmount,
        order_date,
        fulfilment_type: fType,
        status: 'Pending'
      }
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rbErr) {
        console.error('Transaction rollback error:', rbErr);
      }
    }
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process order. Please try again.',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
}

// GET /api/admin/orders - Admin view all orders
async function getAllOrders(req, res) {
  try {
    const { search, status } = req.query;
    let sql = `
      SELECT o.*,
             COUNT(oi.id) AS total_items,
             GROUP_CONCAT(CONCAT(oi.product_name, ' (x', oi.quantity, ')') SEPARATOR ', ') AS item_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (o.customer_name LIKE ? OR o.phone LIKE ? OR o.order_reference LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' GROUP BY o.id ORDER BY o.id DESC';

    const [rows] = await pool.query(sql, params);
    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
      error: error.message
    });
  }
}

// GET /api/admin/orders/:id - Get full order details and order items
async function getOrderDetails(req, res) {
  try {
    const { id } = req.params;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    const order = orders[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    order.items = items;

    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details.',
      error: error.message
    });
  }
}

// PATCH /api/admin/orders/:id/status - Update order status
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to "${status}".`
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
};
