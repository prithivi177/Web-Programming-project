-- ====================================================================
-- Sweet Crumbs Bakery Database Initialization Script
-- Database: sweet_crumbs_db
-- Non-destructive: preserves existing tables and product data
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `sweet_crumbs_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sweet_crumbs_db`;

-- --------------------------------------------------------------------
-- Table: admins
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- Table: products
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `available` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_available` (`available`)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- Table: orders
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_reference` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NULL,
  `order_date` DATE NOT NULL,
  `fulfilment_type` ENUM('Pickup', 'Delivery') NOT NULL DEFAULT 'Pickup',
  `delivery_address` TEXT NULL,
  `additional_instructions` TEXT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- Table: order_items
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  CONSTRAINT `fk_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- Table: enquiries
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Pending', 'Resolved') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_enquiry_status` (`status`)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- Seed Data: Initial Administrator (if not already existing)
-- Default credentials: username 'admin', password 'Admin@123'
-- Hash generated via bcrypt (10 rounds)
-- --------------------------------------------------------------------
INSERT IGNORE INTO `admins` (`username`, `password_hash`) VALUES
('admin', '$2a$10$o8k1e3R0eU6P9ZkfvO5vauZgWfG0W4W5rGkX.u2D1G5/5F6w1nC3e');

-- --------------------------------------------------------------------
-- Seed Data: Sample Bakery Products (12 items across 5 categories)
-- Non-destructive: INSERT IGNORE skips items already present
-- --------------------------------------------------------------------
INSERT IGNORE INTO `products` (`name`, `description`, `category`, `price`, `image_url`, `available`) VALUES
('Belgian Chocolate Truffle Cake', 'Rich layers of moist dark chocolate sponge draped in velvety Belgian ganache and chocolate curls.', 'Birthday Cakes', 749.00, 'assets/images/cake-chocolate.svg', 1),
('Red Velvet Cream Cheese Cake', 'Traditional crimson sponge layered with luxurious cream cheese frosting and white chocolate pearls.', 'Birthday Cakes', 799.00, 'assets/images/cake-redvelvet.svg', 1),
('Classic Vanilla Buttercream Cake', 'Light and tender golden vanilla sponge infused with real Madagascar vanilla bean and pastel rosettes.', 'Birthday Cakes', 649.00, 'assets/images/cake-vanilla.svg', 1),
('Salted Caramel Crunch Cupcake', 'Golden caramel sponge stuffed with liquid caramel and crowned with salted butter fudge swirls.', 'Cupcakes', 349.00, 'assets/images/cupcake-caramel.svg', 1),
('Blueberry Swirl Cupcake', 'Fluffy buttermilk cupcake with wild blueberry compote center and lilac vanilla swirl.', 'Cupcakes', 380.00, 'assets/images/cupcake-blueberry.svg', 1),
('Double Chocolate Fudge Cupcake', 'Decadent dark cocoa cupcake topped with whipped chocolate silk and dark cocoa nibs.', 'Cupcakes', 360.00, 'assets/images/cupcake-chocolate.svg', 1),
('Belgian Choco-Chip Cookies', 'Golden crisp edges with a gooey, molten chocolate center baked with premium dark chocolate chunks.', 'Cookies', 280.00, 'assets/images/cookie-chocochip.svg', 1),
('Almond Oat Butter Crisps', 'Toasted California almonds and wholesome rolled oats infused with golden clarified butter and honey.', 'Cookies', 320.00, 'assets/images/cookie-almond.svg', 1),
('Fresh Strawberry Glaze Pastry', 'Airy puff pastry layered with Chantilly cream and crowned with fresh glazed Mahabaleshwar strawberries.', 'Pastries', 160.00, 'assets/images/pastry-strawberry.svg', 1),
('Black Forest Cherry Pastry', 'Classic German layers of chocolate genoise, Kirsch-infused cream and sour Amarena cherries.', 'Pastries', 180.00, 'assets/images/pastry-blackforest.svg', 1),
('Sizzling Walnut Fudge Brownie', 'Chewy, intensely fudgy dark chocolate square packed with roasted Californian walnut halves.', 'Brownies', 220.00, 'assets/images/brownie-walnut.svg', 1),
('Nutella Overload Brownie', 'Warm gooey brownie smothered in generous layers of hazelnut Nutella spread and toasted hazelnuts.', 'Brownies', 250.00, 'assets/images/brownie-nutella.svg', 1);
