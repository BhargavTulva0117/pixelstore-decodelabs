import sqlite3

conn = sqlite3.connect("pixelstore.db")

cursor = conn.cursor()

# =========================
# PRODUCTS TABLE
# =========================

cursor.execute("""

CREATE TABLE IF NOT EXISTS products(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    price REAL NOT NULL,

    category TEXT,

    image TEXT,

    description TEXT

)

""")

# =========================
# REVIEWS TABLE
# =========================

cursor.execute("""

CREATE TABLE IF NOT EXISTS reviews(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    product_id INTEGER,

    review TEXT

)

""")

# =========================
# ORDERS TABLE
# =========================

cursor.execute("""

CREATE TABLE IF NOT EXISTS orders(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    total REAL

)

""")

# =========================
# INSERT SAMPLE PRODUCTS
# =========================

cursor.execute("""
INSERT INTO products
(name,price,category,image,description)
VALUES
(
'Wireless Headphones',
120,
'Audio',
'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
'Premium wireless headphones'
)
""")

cursor.execute("""
INSERT INTO products
(name,price,category,image,description)
VALUES
(
'Gaming Laptop',
950,
'Laptop',
'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
'High performance gaming laptop'
)
""")

cursor.execute("""
INSERT INTO products
(name,price,category,image,description)
VALUES
(
'Smart Watch',
180,
'Wearable',
'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
'Track fitness and notifications'
)
""")

cursor.execute("""
INSERT INTO products
(name,price,category,image,description)
VALUES
(
'Bluetooth Speaker',
90,
'Audio',
'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
'Portable speaker'
)
""")

# =========================
# SAVE CHANGES
# =========================

conn.commit()

conn.close()

print("Database Created Successfully")