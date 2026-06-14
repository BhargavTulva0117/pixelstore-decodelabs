import sqlite3

conn = sqlite3.connect("pixelstore.db")

cursor = conn.cursor()

products = [

(
"Wireless Headphones",
120,
"Audio",
'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
"Premium wireless headphones with noise cancellation."
),

(
"Gaming Laptop",
950,
"Laptop",
"https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
"High-performance gaming laptop for professionals."
),

(
"Smart Watch",
180,
"Wearable",
"https://images.unsplash.com/photo-1523275335684-37898b6baf30",
"Track fitness, health, and notifications."
),

(
"Bluetooth Speaker",
90,
"Audio",
"https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
"Portable speaker with rich sound quality."
)

]

cursor.executemany("""

INSERT INTO products
(name,price,category,image,description)

VALUES(?,?,?,?,?)

""", products)

conn.commit()

conn.close()

print("Products Added")