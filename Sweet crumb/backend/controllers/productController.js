const { pool } = require('../db');

// GET /api/products (and /api/sweets) - Get all products with optional filters
async function getProducts(req, res) {
  try {
    const { category, search, available } = req.query;
    let sql = 'SELECT id, name, description, category, price, image_url, available, created_at FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (available !== undefined && available !== '') {
      sql += ' AND available = ?';
      params.push(available === 'true' || available === '1' ? 1 : 0);
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products from database:', error.message);
    let message = 'Failed to retrieve bakery products from database.';
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      message = 'MySQL connection failed: Access denied. Please verify DB_USER and DB_PASSWORD in your .env file.';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      message = 'Database "sweet_crumbs_db" not found. Run "npm run setup-db" to create it.';
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      message = 'Table "products" does not exist in database. Run "npm run setup-db" to initialize tables.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      message = 'Cannot reach MySQL database server. Ensure MySQL service is running on port 3306.';
    }

    return res.status(500).json({
      success: false,
      message,
      error: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}

// GET /api/products/:id - Get single product
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, description, category, price, image_url, available, created_at FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching product by id:', error.message);
    let message = 'Failed to retrieve product details.';
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      message = 'MySQL access denied: Check DB_PASSWORD in .env';
    } else if (error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_NO_SUCH_TABLE') {
      message = 'Database or products table not initialized. Run "npm run setup-db".';
    } else if (error.code === 'ECONNREFUSED') {
      message = 'MySQL server is unreachable.';
    }
    return res.status(500).json({
      success: false,
      message,
      error: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}

// POST /api/admin/products - Add a new product
async function createProduct(req, res) {
  try {
    const { name, description, category, price, image_url, available } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and price are required.'
      });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number.'
      });
    }

    const validCategories = ['Birthday Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Brownies'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const finalImage = image_url && image_url.trim() !== '' ? image_url.trim() : 'assets/images/cake-chocolate.svg';
    const isAvailable = available !== undefined ? (available ? 1 : 0) : 1;

    const [result] = await pool.query(
      'INSERT INTO products (name, description, category, price, image_url, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), description.trim(), category, numPrice, finalImage, isAvailable]
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: error.message
    });
  }
}

// PUT /api/admin/products/:id - Update product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, price, image_url, available } = req.body;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const current = existing[0];
    const newName = name !== undefined ? name.trim() : current.name;
    const newDesc = description !== undefined ? description.trim() : current.description;
    const newCat = category !== undefined ? category : current.category;
    const newPrice = price !== undefined ? parseFloat(price) : current.price;
    const newImg = image_url !== undefined && image_url.trim() !== '' ? image_url.trim() : current.image_url;
    const newAvail = available !== undefined ? (available ? 1 : 0) : current.available;

    if (isNaN(newPrice) || newPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number.'
      });
    }

    await pool.query(
      'UPDATE products SET name = ?, description = ?, category = ?, price = ?, image_url = ?, available = ? WHERE id = ?',
      [newName, newDesc, newCat, newPrice, newImg, newAvail, id]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: error.message
    });
  }
}

// DELETE /api/admin/products/:id - Delete product safely
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Check if referenced in order_items
    const [orderRefs] = await pool.query('SELECT COUNT(*) AS count FROM order_items WHERE product_id = ?', [id]);
    if (orderRefs[0].count > 0) {
      // Rather than breaking foreign relations or customer order history, mark unavailable
      await pool.query('UPDATE products SET available = 0 WHERE id = ?', [id]);
      return res.json({
        success: true,
        message: `Product is referenced in ${orderRefs[0].count} historical order(s). It has been marked as unavailable (deactivated) to protect order history integrity.`
      });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Product deleted permanently.'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message
    });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
