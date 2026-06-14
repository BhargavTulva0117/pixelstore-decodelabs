import sqlite3

conn = sqlite3.connect("pixelstore.db")

cursor = conn.cursor()

cursor.execute("SELECT * FROM products")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()