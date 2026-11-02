const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath, override: true });

const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ORDER_ITEMS_FILE = path.join(DATA_DIR, 'order_items.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

// Initial seed products: 18 signature artisan bakery items
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Belgian Chocolate Truffle Cake',
    description: 'Rich layers of moist dark chocolate sponge draped in velvety Belgian ganache and chocolate curls.',
    category: 'Birthday Cakes',
    price: 749.00,
    image_url: 'assets/images/cake-chocolate.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Red Velvet Cream Cheese Cake',
    description: 'Traditional crimson sponge layered with luxurious cream cheese frosting and white chocolate pearls.',
    category: 'Birthday Cakes',
    price: 799.00,
    image_url: 'assets/images/cake-redvelvet.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 3,
    name: 'Classic Vanilla Buttercream Cake',
    description: 'Light and tender golden vanilla sponge infused with real Madagascar vanilla bean and pastel rosettes.',
    category: 'Birthday Cakes',
    price: 649.00,
    image_url: 'assets/images/cake-vanilla.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 4,
    name: 'Mango Passion Fruit Cheesecake',
    description: 'Silky New York baked cheesecake layered with tropical Ratnagiri mango glaze and passion fruit pulp.',
    category: 'Birthday Cakes',
    price: 849.00,
    image_url: 'assets/images/cake-mangopassion.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 5,
    name: 'Salted Caramel Crunch Cupcake',
    description: 'Golden caramel sponge stuffed with liquid caramel and crowned with salted butter fudge swirls.',
    category: 'Cupcakes',
    price: 349.00,
    image_url: 'assets/images/cupcake-caramel.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 6,
    name: 'Blueberry Swirl Cupcake',
    description: 'Fluffy buttermilk cupcake with wild blueberry compote center and lilac vanilla swirl.',
    category: 'Cupcakes',
    price: 380.00,
    image_url: 'assets/images/cupcake-blueberry.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 7,
    name: 'Double Chocolate Fudge Cupcake',
    description: 'Decadent dark cocoa cupcake topped with whipped chocolate silk and dark cocoa nibs.',
    category: 'Cupcakes',
    price: 360.00,
    image_url: 'assets/images/cupcake-chocolate.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 8,
    name: 'Lotus Biscoff Crumble Cupcake',
    description: 'Spiced speculoos sponge infused with molten cookie butter and crowned with crunchy Biscoff biscuit crumble.',
    category: 'Cupcakes',
    price: 399.00,
    image_url: 'assets/images/cupcake-biscoff.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 9,
    name: 'Belgian Choco-Chip Cookies',
    description: 'Golden crisp edges with a gooey, molten chocolate center baked with premium dark chocolate chunks.',
    category: 'Cookies',
    price: 280.00,
    image_url: 'assets/images/cookie-chocochip.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 10,
    name: 'Almond Oat Butter Crisps',
    description: 'Toasted California almonds and wholesome rolled oats infused with golden clarified butter and honey.',
    category: 'Cookies',
    price: 320.00,
    image_url: 'assets/images/cookie-almond.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 11,
    name: 'Pistachio Cranberry Shortbread',
    description: 'Melt-in-mouth golden French butter shortbread studded with Iranian pistachios and tart dried cranberries.',
    category: 'Cookies',
    price: 340.00,
    image_url: 'assets/images/cookie-pistachio.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 12,
    name: 'Fresh Strawberry Glaze Pastry',
    description: 'Airy puff pastry layered with Chantilly cream and crowned with fresh glazed Mahabaleshwar strawberries.',
    category: 'Pastries',
    price: 160.00,
    image_url: 'assets/images/pastry-strawberry.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 13,
    name: 'Black Forest Cherry Pastry',
    description: 'Classic German layers of chocolate genoise, Kirsch-infused cream and sour Amarena cherries.',
    category: 'Pastries',
    price: 180.00,
    image_url: 'assets/images/pastry-blackforest.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 14,
    name: 'Classic Italian Tiramisu Pastry',
    description: 'Espresso-soaked Savoiardi ladyfingers draped in whipped mascarpone custard and dusted with Dutch cocoa.',
    category: 'Pastries',
    price: 210.00,
    image_url: 'assets/images/pastry-tiramisu.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 15,
    name: 'Butter Croissant with Honey Glaze',
    description: 'Flaky, golden 27-layer French laminated pastry baked with pure Normandy butter and light blossom honey.',
    category: 'Pastries',
    price: 190.00,
    image_url: 'assets/images/pastry-croissant.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 16,
    name: 'Sizzling Walnut Fudge Brownie',
    description: 'Chewy, intensely fudgy dark chocolate square packed with roasted Californian walnut halves.',
    category: 'Brownies',
    price: 220.00,
    image_url: 'assets/images/brownie-walnut.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 17,
    name: 'Nutella Overload Brownie',
    description: 'Warm gooey brownie smothered in generous layers of hazelnut Nutella spread and toasted hazelnuts.',
    category: 'Brownies',
    price: 250.00,
    image_url: 'assets/images/brownie-nutella.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 18,
    name: 'Triple Chocolate Salted Brownie',
    description: 'Dense triple chocolate fudge square with milk, dark, and white chocolate chunks finished with Maldon sea salt flakes.',
    category: 'Brownies',
    price: 260.00,
    image_url: 'assets/images/brownie-triplechoc.svg',
    available: 1,
    created_at: '2026-10-12T10:00:00.000Z'
  }
];

// Initial seed admin (admin / Admin@123)
const INITIAL_ADMINS = [
  {
    id: 1,
    username: 'admin',
    password_hash: '$2a$10$xROjOCk7.pQp0N7CgLzK0uHdRZhAQwSwvRtOT.iszntNVWreOhXaa',
    created_at: '2026-10-12T10:00:00.000Z'
  }
];

// File I/O Helpers
function readJson(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultValue;
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// Ensure database files are seeded
function initStore() {
  if (!fs.existsSync(PRODUCTS_FILE) || readJson(PRODUCTS_FILE, []).length === 0) {
    writeJson(PRODUCTS_FILE, INITIAL_PRODUCTS);
  }
  if (!fs.existsSync(ADMINS_FILE) || readJson(ADMINS_FILE, []).length === 0) {
    writeJson(ADMINS_FILE, INITIAL_ADMINS);
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    writeJson(ORDERS_FILE, []);
  }
  if (!fs.existsSync(ORDER_ITEMS_FILE)) {
    writeJson(ORDER_ITEMS_FILE, []);
  }
  if (!fs.existsSync(ENQUIRIES_FILE)) {
    writeJson(ENQUIRIES_FILE, []);
  }
}

initStore();

// Universal Query Interpreter for controllers
const pool = {
  async query(sql, params = []) {
    initStore();
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    // -------------------------------------------------------------
    // PRODUCTS QUERIES
    // -------------------------------------------------------------
    if (/^SELECT .* FROM products/i.test(cleanSql)) {
      const products = readJson(PRODUCTS_FILE, []);

      // SELECT COUNT(*) FROM products
      if (/COUNT\(\*\)/i.test(cleanSql)) {
        return [[{ total: products.length }]];
      }

      // SELECT ... WHERE id = ?
      if (/WHERE id\s*=\s*\?/i.test(cleanSql)) {
        const id = parseInt(params[0], 10);
        const match = products.filter(p => p.id === id);
        return [match];
      }

      // SELECT with filters
      let result = [...products];

      // Check category filter
      if (/category\s*=\s*\?/i.test(cleanSql)) {
        const catIdx = cleanSql.indexOf('category = ?');
        // determine param position
        const catVal = params.find(p => ['Birthday Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Brownies'].includes(p));
        if (catVal && catVal !== 'All') {
          result = result.filter(p => p.category === catVal);
        }
      }

      // Check search filter: name LIKE ? OR description LIKE ?
      if (/LIKE/i.test(cleanSql)) {
        const termParam = params.find(p => typeof p === 'string' && p.startsWith('%') && p.endsWith('%'));
        if (termParam) {
          const rawTerm = termParam.replace(/%/g, '').toLowerCase();
          result = result.filter(p =>
            (p.name && p.name.toLowerCase().includes(rawTerm)) ||
            (p.description && p.description.toLowerCase().includes(rawTerm)) ||
            (p.category && p.category.toLowerCase().includes(rawTerm))
          );
        }
      }

      // Check available filter: available = ?
      if (/available\s*=\s*\?/i.test(cleanSql)) {
        const availVal = params[params.length - 1];
        const numAvail = availVal === 1 || availVal === '1' || availVal === true ? 1 : 0;
        result = result.filter(p => (p.available == 1 ? 1 : 0) === numAvail);
      }

      // Sorting
      result.sort((a, b) => a.id - b.id);
      return [result];
    }

    if (/^INSERT INTO products/i.test(cleanSql)) {
      const products = readJson(PRODUCTS_FILE, []);
      const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const [name, description, category, price, image_url, available] = params;
      const newProduct = {
        id: nextId,
        name,
        description,
        category,
        price: parseFloat(price),
        image_url: image_url || 'assets/images/cake-chocolate.svg',
        available: available !== undefined ? (available ? 1 : 0) : 1,
        created_at: new Date().toISOString()
      };
      products.push(newProduct);
      writeJson(PRODUCTS_FILE, products);
      return [{ insertId: nextId, affectedRows: 1 }];
    }

    if (/^UPDATE products/i.test(cleanSql)) {
      const products = readJson(PRODUCTS_FILE, []);
      if (/SET available\s*=\s*0 WHERE id\s*=\s*\?/i.test(cleanSql)) {
        const id = parseInt(params[0], 10);
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
          products[idx].available = 0;
          writeJson(PRODUCTS_FILE, products);
        }
        return [{ affectedRows: idx !== -1 ? 1 : 0 }];
      }

      const id = parseInt(params[params.length - 1], 10);
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        const [name, description, category, price, image_url, available] = params;
        products[idx] = {
          ...products[idx],
          name: name !== undefined ? name : products[idx].name,
          description: description !== undefined ? description : products[idx].description,
          category: category !== undefined ? category : products[idx].category,
          price: price !== undefined ? parseFloat(price) : products[idx].price,
          image_url: image_url !== undefined ? image_url : products[idx].image_url,
          available: available !== undefined ? (available ? 1 : 0) : products[idx].available
        };
        writeJson(PRODUCTS_FILE, products);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    if (/^DELETE FROM products/i.test(cleanSql)) {
      let products = readJson(PRODUCTS_FILE, []);
      const id = parseInt(params[0], 10);
      const initialLen = products.length;
      products = products.filter(p => p.id !== id);
      writeJson(PRODUCTS_FILE, products);
      return [{ affectedRows: initialLen - products.length }];
    }

    // -------------------------------------------------------------
    // ORDERS QUERIES
    // -------------------------------------------------------------
    if (/^SELECT .* FROM orders/i.test(cleanSql)) {
      const orders = readJson(ORDERS_FILE, []);
      const orderItems = readJson(ORDER_ITEMS_FILE, []);

      // SELECT COUNT(*) FROM orders WHERE status = "Pending"
      if (/COUNT\(\*\).*WHERE status\s*=\s*["']Pending["']/i.test(cleanSql)) {
        const count = orders.filter(o => o.status === 'Pending').length;
        return [[{ total: count }]];
      }

      // SELECT COUNT(*) FROM orders
      if (/COUNT\(\*\)/i.test(cleanSql)) {
        return [[{ total: orders.length }]];
      }

      // SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != "Cancelled"
      if (/SUM\(total_amount\)/i.test(cleanSql)) {
        const sum = orders
          .filter(o => o.status !== 'Cancelled')
          .reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);
        return [[{ total: sum.toFixed(2) }]];
      }

      // SELECT WHERE id = ?
      if (/WHERE o?\.?id\s*=\s*\?/i.test(cleanSql)) {
        const id = parseInt(params[0], 10);
        const match = orders.filter(o => o.id === id);
        return [match];
      }

      // Recent orders limit 5
      if (/ORDER BY id DESC LIMIT 5/i.test(cleanSql)) {
        const sorted = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);
        return [sorted];
      }

      // Admin all orders with items summary
      let filtered = [...orders];
      if (/status\s*=\s*\?/i.test(cleanSql)) {
        const statusVal = params.find(p => ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].includes(p));
        if (statusVal && statusVal !== 'All') {
          filtered = filtered.filter(o => o.status === statusVal);
        }
      }

      if (/LIKE/i.test(cleanSql)) {
        const term = params.find(p => typeof p === 'string' && p.startsWith('%'))?.replace(/%/g, '').toLowerCase();
        if (term) {
          filtered = filtered.filter(o =>
            (o.customer_name && o.customer_name.toLowerCase().includes(term)) ||
            (o.phone && o.phone.toLowerCase().includes(term)) ||
            (o.order_reference && o.order_reference.toLowerCase().includes(term))
          );
        }
      }

      const rows = filtered.map(o => {
        const items = orderItems.filter(oi => oi.order_id === o.id);
        const summary = items.map(it => `${it.product_name} (x${it.quantity})`).join(', ');
        return {
          ...o,
          total_items: items.length,
          item_summary: summary || 'No items'
        };
      });

      rows.sort((a, b) => b.id - a.id);
      return [rows];
    }

    if (/^INSERT INTO orders/i.test(cleanSql)) {
      const orders = readJson(ORDERS_FILE, []);
      const nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
      const [
        order_reference,
        customer_name,
        phone,
        email,
        order_date,
        fulfilment_type,
        delivery_address,
        additional_instructions,
        total_amount,
        status = 'Pending'
      ] = params;

      const newOrder = {
        id: nextId,
        order_reference,
        customer_name,
        phone,
        email: email || null,
        order_date,
        fulfilment_type: fulfilment_type || 'Pickup',
        delivery_address: delivery_address || null,
        additional_instructions: additional_instructions || null,
        total_amount: parseFloat(total_amount),
        status: status || 'Pending',
        created_at: new Date().toISOString()
      };
      orders.push(newOrder);
      writeJson(ORDERS_FILE, orders);
      return [{ insertId: nextId, affectedRows: 1 }];
    }

    if (/^UPDATE orders/i.test(cleanSql)) {
      const orders = readJson(ORDERS_FILE, []);
      const [status, id] = params;
      const oId = parseInt(id, 10);
      const idx = orders.findIndex(o => o.id === oId);
      if (idx !== -1) {
        orders[idx].status = status;
        writeJson(ORDERS_FILE, orders);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // -------------------------------------------------------------
    // ORDER ITEMS QUERIES
    // -------------------------------------------------------------
    if (/^SELECT .* FROM order_items/i.test(cleanSql)) {
      const items = readJson(ORDER_ITEMS_FILE, []);
      if (/COUNT\(\*\).*WHERE product_id\s*=\s*\?/i.test(cleanSql)) {
        const pId = parseInt(params[0], 10);
        const count = items.filter(it => it.product_id === pId).length;
        return [[{ count }]];
      }
      if (/WHERE order_id\s*=\s*\?/i.test(cleanSql)) {
        const oId = parseInt(params[0], 10);
        const orderItems = items.filter(it => it.order_id === oId);
        return [orderItems];
      }
      return [items];
    }

    if (/^INSERT INTO order_items/i.test(cleanSql)) {
      const items = readJson(ORDER_ITEMS_FILE, []);
      const nextId = items.length > 0 ? Math.max(...items.map(it => it.id)) + 1 : 1;
      const [order_id, product_id, product_name, unit_price, quantity, subtotal] = params;
      const newItem = {
        id: nextId,
        order_id: parseInt(order_id, 10),
        product_id: parseInt(product_id, 10),
        product_name,
        unit_price: parseFloat(unit_price),
        quantity: parseInt(quantity, 10),
        subtotal: parseFloat(subtotal)
      };
      items.push(newItem);
      writeJson(ORDER_ITEMS_FILE, items);
      return [{ insertId: nextId, affectedRows: 1 }];
    }

    // -------------------------------------------------------------
    // ENQUIRIES QUERIES
    // -------------------------------------------------------------
    if (/^SELECT .* FROM enquiries/i.test(cleanSql)) {
      const enquiries = readJson(ENQUIRIES_FILE, []);

      // Pending enquiries count
      if (/COUNT\(\*\).*WHERE status\s*=\s*["']Pending["']/i.test(cleanSql)) {
        const count = enquiries.filter(e => e.status === 'Pending').length;
        return [[{ total: count }]];
      }

      // Total count
      if (/COUNT\(\*\)/i.test(cleanSql)) {
        return [[{ total: enquiries.length }]];
      }

      let filtered = [...enquiries];
      if (/status\s*=\s*\?/i.test(cleanSql)) {
        const s = params[0];
        if (s && s !== 'All') {
          filtered = filtered.filter(e => e.status === s);
        }
      }
      filtered.sort((a, b) => b.id - a.id);
      return [filtered];
    }

    if (/^INSERT INTO enquiries/i.test(cleanSql)) {
      const enquiries = readJson(ENQUIRIES_FILE, []);
      const nextId = enquiries.length > 0 ? Math.max(...enquiries.map(e => e.id)) + 1 : 1;
      const [name, email, subject, message, status = 'Pending'] = params;
      const newEnquiry = {
        id: nextId,
        name,
        email,
        subject,
        message,
        status: status || 'Pending',
        created_at: new Date().toISOString()
      };
      enquiries.push(newEnquiry);
      writeJson(ENQUIRIES_FILE, enquiries);
      return [{ insertId: nextId, affectedRows: 1 }];
    }

    if (/^UPDATE enquiries/i.test(cleanSql)) {
      const enquiries = readJson(ENQUIRIES_FILE, []);
      const [status, id] = params;
      const eId = parseInt(id, 10);
      const idx = enquiries.findIndex(e => e.id === eId);
      if (idx !== -1) {
        enquiries[idx].status = status;
        writeJson(ENQUIRIES_FILE, enquiries);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // -------------------------------------------------------------
    // ADMINS QUERIES
    // -------------------------------------------------------------
    if (/^SELECT .* FROM admins/i.test(cleanSql)) {
      const admins = readJson(ADMINS_FILE, []);
      if (/WHERE username\s*=\s*\?/i.test(cleanSql)) {
        const username = params[0];
        const match = admins.filter(a => a.username.toLowerCase() === String(username).toLowerCase());
        return [match];
      }
      return [admins];
    }

    if (/^UPDATE admins/i.test(cleanSql)) {
      const admins = readJson(ADMINS_FILE, []);
      const [password_hash, username] = params;
      const idx = admins.findIndex(a => a.username.toLowerCase() === String(username).toLowerCase());
      if (idx !== -1) {
        admins[idx].password_hash = password_hash;
        writeJson(ADMINS_FILE, admins);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    if (/^INSERT INTO admins/i.test(cleanSql)) {
      const admins = readJson(ADMINS_FILE, []);
      const [username, password_hash] = params;
      const nextId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
      admins.push({
        id: nextId,
        username,
        password_hash,
        created_at: new Date().toISOString()
      });
      writeJson(ADMINS_FILE, admins);
      return [{ insertId: nextId, affectedRows: 1 }];
    }

    // Fallback for generic queries
    return [[]];
  },

  async getConnection() {
    return {
      query: (sql, params) => pool.query(sql, params),
      execute: (sql, params) => pool.query(sql, params),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {}
    };
  }
};

async function testConnection() {
  initStore();
  const products = readJson(PRODUCTS_FILE, []);
  console.log(`[Sweet Crumbs DB] ✓ JSON Data Engine ready. ${products.length} artisan sweets loaded.`);
  return true;
}

module.exports = {
  pool,
  testConnection,
  DATA_DIR
};
