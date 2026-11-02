# 🍰 Sweet Crumbs — Artisan Bakery Company Profile Website

> **College Web Programming Examination Project**  
> A complete, full-stack, responsive bakery company profile website demonstrating modern frontend UI/UX design, modular backend REST APIs, session-based authentication, and a real MySQL database.

---

## 🌟 Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Technology Stack](#3-technology-stack)
- [4. Project Folder Structure](#4-project-folder-structure)
- [5. Prerequisites & Software Requirements](#5-prerequisites--software-requirements)
- [6. Step-by-Step Installation & Setup Guide](#6-step-by-step-installation--setup-guide)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Configure Environment Variables (`.env`)](#step-2-configure-environment-variables-env)
  - [Step 3: Initialize the MySQL Database](#step-3-initialize-the-mysql-database)
  - [Step 4: Seed the Administrator Account](#step-4-seed-the-administrator-account)
  - [Step 5: Start the Full-Stack Server](#step-5-start-the-full-stack-server)
- [7. Website Navigation & Page Flow](#7-website-navigation--page-flow)
- [8. Admin Portal & Dashboard Guide](#8-admin-portal--dashboard-guide)
- [9. REST API Endpoints Reference](#9-rest-api-endpoints-reference)
- [10. Testing & Demonstration Checklist](#10-testing--demonstration-checklist)
- [11. Troubleshooting & Common Errors](#11-troubleshooting--common-errors)

---

## 1. Project Overview

**Sweet Crumbs** is an artisan bakery & patisserie web application designed for a college Web Programming examination. It demonstrates a seamless connection between a customer-facing responsive frontend, an Express.js backend API, and a normalized MySQL database (`sweet_crumbs_db`).

Unlike static prototypes, Sweet Crumbs features:
- Dynamic product loading from MySQL.
- Transactional customer order placement with server-side price computation.
- Real customer inquiries stored in the database.
- A secured Admin Dashboard protected by bcrypt password matching and session cookies.

---

## 2. Key Features

### 🎨 Frontend & Design System
- **Warm Bakery Aesthetic**: Crafted with warm creams (`#FFF9F2`), pastel pinks (`#FCEEE9`), caramel gold (`#BC6C25`), and rich chocolates (`#4A2E18`).
- **Responsive Layout**: Designed mobile-first using Bootstrap 5 grid, accessible typography, and smooth CSS hover animations.
- **Aspect Ratio Product Cards**: Rounded cards with category pills, availability badges, and instant prefilled order buttons.
- **Embedded Vector Illustrations**: 17 crisp SVG graphics for cakes, cupcakes, pastries, cookies, brownies, and chef avatars.

### 🛒 Customer Ordering Experience
- **Live Menu Catalog (`products.html`)**: Real-time category filtering (Birthday Cakes, Cupcakes, Cookies, Pastries, Brownies), instant search, and sorting.
- **Interactive Order Form (`order.html`)**:
  - Auto-prefills chosen product if arriving from catalog.
  - Dynamically calculates subtotal and estimated total in real time.
  - Toggles required home delivery address fields when "Home Delivery" is selected.
  - Validates minimum order date (cannot order in the past).
  - Prevents duplicate button submissions with loading spinners.
  - Displays a modal receipt with a unique Order Reference (e.g. `SC-20261012-7842`).

### 🛡️ Admin Suite (`admin-dashboard.html`)
- **Protected by Middleware**: Blocks unauthorized API access via server sessions (`express-session`) and login rate limiting.
- **Live Metrics**: Real-time counts for Total Orders, Pending Orders, Active Products, and Total Revenue.
- **Order Processing**: Search orders by customer name, phone, or reference; view order items breakdown; update order status (`Pending` &rarr; `Confirmed` &rarr; `Preparing` &rarr; `Ready` &rarr; `Completed` &rarr; `Cancelled`).
- **Product Management (CRUD)**: Add new delicacies, edit prices/descriptions, toggle stock availability, and delete items safely.
- **Inquiry Management**: Review customer messages from the contact form and mark them as resolved.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Bootstrap Icons | Semantic markup, responsive UI, client-side interactions |
| **Backend** | Node.js, Express.js | Modular REST API routing, controllers, static file hosting |
| **Database** | MySQL, `mysql2` | Relational tables, foreign key constraints, ACID transactions |
| **Authentication** | `bcryptjs`, `express-session` | Secure password hashing, HTTP-only cookie sessions |
| **Configuration** | `dotenv` | Environment variable isolation |

---

## 4. Project Folder Structure

```text
Sweet crumb/
├── package.json               # Project manifest, dependencies & scripts
├── .env                       # Local environment configuration
├── .env.example               # Template environment configuration
├── README.md                  # Comprehensive setup & execution manual
├── backend/
│   ├── server.js              # Express app entry point & static server
│   ├── db.js                  # MySQL pool connection & error resilience
│   ├── controllers/
│   │   ├── productController.js # Product retrieval & admin CRUD
│   │   ├── orderController.js   # Order transaction & price verification
│   │   ├── enquiryController.js # Customer inquiries handling
│   │   └── adminController.js   # Auth, sessions, and dashboard metrics
│   ├── routes/
│   │   ├── productRoutes.js   # Public product endpoints
│   │   ├── orderRoutes.js     # Public order creation endpoint
│   │   ├── enquiryRoutes.js   # Public contact endpoint
│   │   └── adminRoutes.js     # Protected admin endpoints
│   ├── middleware/
│   │   ├── auth.js            # Admin session verification middleware
│   │   └── rateLimiter.js     # Brute-force protection for admin login
│   └── scripts/
│       ├── init.sql           # Schema creation & 12 sample bakery items
│       ├── setup-db.js        # Automated migration runner
│       ├── create-admin.js    # CLI utility to create/update admin credentials
│       └── generate-assets.js # SVG illustration generator
└── frontend/
    ├── index.html             # Homepage: Hero, featured items, testimonials
    ├── about.html             # About Us: Heritage, bakers, ingredients
    ├── products.html          # Menu: Search, category tabs, catalog cards
    ├── order.html             # Order Online: Form, live calculation, modal receipt
    ├── contact.html           # Contact Us: Location, hours, enquiry form
    ├── admin-login.html       # Admin Portal Login
    ├── admin-dashboard.html   # Admin Dashboard: Stats, orders, menu CRUD
    ├── css/
    │   ├── style.css          # Design system & public website styles
    │   └── admin.css          # Admin portal & dashboard styles
    ├── js/
    │   ├── main.js            # Featured products loader
    │   ├── products.js        # Catalog search & filter handler
    │   ├── order.js           # Order submission & live calculator
    │   ├── contact.js         # Enquiry submission handler
    │   ├── admin-login.js     # Session login handler
    │   └── admin-dashboard.js # Admin operations & CRUD controller
    └── assets/
        └── images/            # 17 bakery SVG assets & brand logo
```

---

## 5. Prerequisites & Software Requirements

1. **Node.js**: Version 18.x, 20.x, or 24.x installed (`node -v`).
2. **NPM**: Version 9.x or higher (`npm -v`).
3. **MySQL Server**: MySQL 8.0, 8.4, or MariaDB (via MySQL Server Installer or XAMPP).
4. **Web Browser**: Any modern browser (Google Chrome, Microsoft Edge, Firefox).

---

## 6. Step-by-Step Installation & Setup Guide

### Step 1: Install Dependencies
Open PowerShell or Command Prompt in the project folder and run:
```bash
npm install
```

### Step 2: Configure Environment Variables (`.env`)
Open `.env` in the root folder and verify your MySQL credentials:
```env
PORT=3000
NODE_ENV=development

# MySQL Database Settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sweet_crumbs_db

# Admin Session Secret
SESSION_SECRET=sweet_crumbs_session_secret_key_college_project_2026
```
> *Note: If your MySQL `root` account has no password (e.g. standard XAMPP), leave `DB_PASSWORD=` blank.*

### Step 3: Initialize the MySQL Database
Run the automated setup script to create `sweet_crumbs_db` and seed the 12 sample bakery products:
```bash
npm run setup-db
```
*Alternatively, you can open MySQL Workbench and run `backend/scripts/init.sql` directly.*

### Step 4: Seed the Administrator Account
To ensure the default admin credentials exist or to set your own, run:
```bash
npm run create-admin
```
- **Default Username**: `admin`
- **Default Password**: `Admin@123`

*(You can also specify custom credentials: `node backend/scripts/create-admin.js myusername mypassword`)*

### Step 5: Start the Full-Stack Server
Launch the Express application:
```bash
npm start
```
You will see the console confirmation:
```text
================================================================
       🍰 SWEET CRUMBS — BAKERY COMPANY PROFILE WEBSITE         
================================================================
✓ Server running at: http://localhost:3000
✓ Home Page:         http://localhost:3000/index.html
✓ About Us:          http://localhost:3000/about.html
✓ Products Catalog:  http://localhost:3000/products.html
✓ Order Online:      http://localhost:3000/order.html
✓ Contact Us:        http://localhost:3000/contact.html
✓ Admin Login:       http://localhost:3000/admin-login.html
✓ Admin Dashboard:   http://localhost:3000/admin-dashboard.html
----------------------------------------------------------------
[Sweet Crumbs DB] ✓ Successfully connected to MySQL database: sweet_crumbs_db
```

---

## 7. Website Navigation & Page Flow

1. **Home (`index.html`)**:
   - High-impact hero section with clear CTAs.
   - Live featured products loaded from `/api/products`.
   - "Why Choose Us" quality highlights.
   - Customer testimonials and newsletter subscription.
2. **About Us (`about.html`)**:
   - Bakery heritage, mission, and vision statements.
   - Quality ingredients breakdown (Belgian chocolate, pure dairy butter).
   - Meet the bakers (Chef Elena Roux, Marco Rossi, Simran Kapoor).
3. **Products (`products.html`)**:
   - Browse 12 delicacies across 5 categories.
   - Real-time search bar & category filter buttons.
   - Clicking "Order Now" on any card navigates to `order.html?product=<id>`.
4. **Order Online (`order.html`)**:
   - Fill in customer name, phone, chosen product, and quantity.
   - Choose Store Pickup or Home Delivery (dynamically reveals address field).
   - Real-time order summary recalculates subtotal as quantity changes.
   - On submission, saves order + snapshot item into MySQL and displays order reference modal.
5. **Contact Us (`contact.html`)**:
   - Displays fictional bakery address, phone, and opening hours.
   - Submits inquiries directly into MySQL `enquiries` table.

---

## 8. Admin Portal & Dashboard Guide

1. Navigate to: `http://localhost:3000/admin-login.html`.
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `Admin@123`
3. Features in **Admin Dashboard (`admin-dashboard.html`)**:
   - **Overview Tab**: Live statistics for Total Orders, Pending Orders, Products, and Revenue.
   - **Orders Tab**:
     - Search by customer name, phone, or reference number.
     - Filter by status (`Pending`, `Confirmed`, `Preparing`, `Ready`, `Completed`, `Cancelled`).
     - Click **"Details"** to inspect customer address, special instructions, and ordered items.
     - Update order status directly.
   - **Products Tab**:
     - Click **"Add New Product"** to create a new cake or pastry.
     - Click **"Edit"** to adjust prices or descriptions.
     - Toggle availability button (In Stock / Sold Out).
     - Delete a product safely (if referenced by orders, protected safely).
   - **Inquiries Tab**: Review messages submitted from the contact form and mark them as `Resolved`.
   - **Log Out**: Securely destroys the session cookie.

---

## 9. REST API Endpoints Reference

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health status check |
| `GET` | `/api/products` | Retrieve all bakery products (optional `?category=...&search=...`) |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/orders` | Place customer order with transaction & server-side price check |
| `POST` | `/api/enquiries` | Submit customer contact inquiry |

### Admin Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Authenticate admin & issue session cookie |
| `POST` | `/api/admin/logout` | Destroy session & clear cookie |
| `GET` | `/api/admin/me` | Check active session identity |

### Protected Admin Endpoints *(Requires Session)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Summary counts & revenue |
| `GET` | `/api/admin/orders` | View all customer orders |
| `GET` | `/api/admin/orders/:id` | View order items and detailed info |
| `PATCH` | `/api/admin/orders/:id/status` | Update status (`Pending`, `Ready`, etc.) |
| `GET` | `/api/admin/enquiries` | View customer inquiries |
| `PATCH` | `/api/admin/enquiries/:id/status` | Mark inquiry as `Resolved` or `Pending` |
| `POST` | `/api/admin/products` | Create new bakery product |
| `PUT` | `/api/admin/products/:id` | Update product details |
| `DELETE` | `/api/admin/products/:id` | Delete product safely |

---

## 10. Testing & Demonstration Checklist

To demonstrate the project during evaluation:

- [x] **Page Navigation**: Click every navbar link (Home, About Us, Products, Order Online, Contact Us) and confirm active styling.
- [x] **Catalog Filtering**: Open `products.html`, type "Chocolate" in search, and click category pills.
- [x] **Order Flow**: Click "Order Now" on a product, verify it is preselected on `order.html`, select quantity 2, choose "Home Delivery", enter an address, and submit. Confirm order reference popup.
- [x] **Inquiry Flow**: Open `contact.html`, fill in the form, and submit.
- [x] **Admin Verification**:
  1. Open `admin-login.html` and sign in with `admin` / `Admin@123`.
  2. In the **Orders tab**, locate your newly submitted order.
  3. Open details, view items, and change status to `Confirmed`.
  4. In the **Inquiries tab**, locate the submitted contact inquiry and click `Resolve`.
  5. In the **Products tab**, add a test product and verify it appears immediately on the public `products.html` page.

---

## 11. Troubleshooting & Common Errors

1. **`ER_ACCESS_DENIED_ERROR`**:
   - **Cause**: The password in `.env` does not match your MySQL `root` account.
   - **Fix**: Open `.env` and update `DB_PASSWORD=your_password`.
2. **`ECONNREFUSED 127.0.0.1:3306`**:
   - **Cause**: MySQL service is not running.
   - **Fix**: Open PowerShell as administrator and start the service: `net start MySQL80` (or click Start in XAMPP Control Panel).
3. **`ER_BAD_DB_ERROR: Unknown database 'sweet_crumbs_db'`**:
   - **Cause**: Database has not been initialized yet.
   - **Fix**: Run `npm run setup-db` in your project folder.
4. **Port 3000 already in use**:
   - **Cause**: Another service is using port 3000.
   - **Fix**: Change `PORT=3001` in `.env`.

---

&copy; 2026 Sweet Crumbs Artisan Bakery. Designed for Web Programming Project Examination.
