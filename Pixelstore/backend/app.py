import sqlite3

from flask import Flask, jsonify, request

from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# -------------------------
# DATABASE
# -------------------------

def get_db_connection():

    conn = sqlite3.connect("pixelstore.db")

    conn.row_factory = sqlite3.Row

    return conn


# -------------------------
# MEMORY STORAGE
# -------------------------

cart = []

orders = []




# -------------------------
# HOME
# -------------------------

@app.route("/")
def home():

    return "PixelStore Backend Running 🚀"


# -------------------------
# HEALTH CHECK
# -------------------------

@app.route("/health")
def health():

    return jsonify({

        "status": "running",

        "server": "PixelStore API"

    })


# -------------------------
# PRODUCTS
# -------------------------

@app.route("/products")
def get_products():

    conn = get_db_connection()

    products = conn.execute(
        "SELECT * FROM products"
    ).fetchall()

    conn.close()

    return jsonify(
        [dict(product) for product in products]
    )


@app.route("/products/<int:id>")
def get_product(id):

    conn = get_db_connection()

    product = conn.execute(

        "SELECT * FROM products WHERE id=?",

        (id,)

    ).fetchone()

    conn.close()

    if product:

        return jsonify(dict(product))

    return jsonify({
        "message": "Product not found"
    }), 404


# -------------------------
# SEARCH PRODUCTS
# -------------------------

@app.route("/search")
def search_products():

    query = request.args.get(
        "q",
        ""
    )

    conn = get_db_connection()

    products = conn.execute(

        """
        SELECT * FROM products
        WHERE name LIKE ?
        """,

        (f"%{query}%",)

    ).fetchall()

    conn.close()

    return jsonify(

        [dict(product) for product in products]

    )


# -------------------------
# CATEGORY FILTER
# -------------------------

@app.route("/category/<category>")
def category_products(category):

    conn = get_db_connection()

    products = conn.execute(

        """
        SELECT * FROM products
        WHERE category = ?
        """,

        (category,)

    ).fetchall()

    conn.close()

    return jsonify(

        [dict(product) for product in products]

    )


# -------------------------
# PRODUCT STATS
# -------------------------

@app.route("/stats")
def stats():

    conn = get_db_connection()

    total_products = conn.execute(

        "SELECT COUNT(*) FROM products"

    ).fetchone()[0]

    total_categories = conn.execute(

        """
        SELECT COUNT(DISTINCT category)
        FROM products
        """

    ).fetchone()[0]

    conn.close()

    return jsonify({

        "totalProducts": total_products,

        "totalCategories": total_categories

    })


# -------------------------
# CATEGORY COUNT
# -------------------------

@app.route("/category-count")
def category_count():

    conn = get_db_connection()

    rows = conn.execute(

        """
        SELECT category,
               COUNT(*) as count

        FROM products

        GROUP BY category
        """

    ).fetchall()

    conn.close()

    result = {}

    for row in rows:

        result[row["category"]] = row["count"]

    return jsonify(result)


# -------------------------
# FEATURED PRODUCTS
# -------------------------

@app.route("/featured")
def featured_products():

    conn = get_db_connection()

    products = conn.execute(

        """
        SELECT * FROM products
        LIMIT 4
        """

    ).fetchall()

    conn.close()

    return jsonify(

        [dict(product) for product in products]

    )


# -------------------------
# PRICE FILTER
# -------------------------

@app.route("/price")
def price_filter():

    max_price = request.args.get(
        "max",
        type=float
    )

    if max_price is None:

        return jsonify({

            "message":
            "Provide max price"

        }), 400

    conn = get_db_connection()

    products = conn.execute(

        """
        SELECT * FROM products
        WHERE price <= ?
        """,

        (max_price,)

    ).fetchall()

    conn.close()

    return jsonify(

        [dict(product) for product in products]

    )


# -------------------------
# ADD PRODUCT
# -------------------------

@app.route("/products", methods=["POST"])
def add_product():

    data = request.json

    conn = get_db_connection()

    conn.execute(

        """
        INSERT INTO products

        (
            name,
            price,
            category,
            image,
            description
        )

        VALUES
        (
            ?,?,?,?,?
        )
        """,

        (

            data["name"],
            data["price"],
            data["category"],
            data["image"],
            data["description"]

        )

    )

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Product added"

    }), 201


# -------------------------
# UPDATE PRODUCT
# -------------------------

@app.route("/products/<int:id>", methods=["PUT"])
def update_product(id):

    data = request.json

    conn = get_db_connection()

    conn.execute(

        """
        UPDATE products

        SET

        name=?,
        price=?,
        category=?,
        image=?,
        description=?

        WHERE id=?
        """,

        (

            data["name"],
            data["price"],
            data["category"],
            data["image"],
            data["description"],
            id

        )

    )

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Product updated"

    })


# -------------------------
# DELETE PRODUCT
# -------------------------

@app.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):

    conn = get_db_connection()

    conn.execute(

        """
        DELETE FROM products
        WHERE id=?
        """,

        (id,)

    )

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Product deleted"

    })


# -------------------------
# CART
# -------------------------

@app.route("/cart", methods=["POST"])
def add_to_cart():

    data = request.json

    cart.append(data)

    return jsonify({

        "message":
        "Product added to cart",

        "cart":
        cart

    }), 201


@app.route("/cart", methods=["GET"])
def get_cart():

    return jsonify(cart)


@app.route("/cart", methods=["DELETE"])
def clear_cart():

    global cart

    cart = []

    return jsonify({

        "message":
        "Cart cleared"

    })


@app.route("/cart/<int:index>", methods=["DELETE"])
def delete_cart_item(index):

    if index < 0 or index >= len(cart):

        return jsonify({

            "message":
            "Item not found"

        }), 404

    removed_item = cart.pop(index)

    return jsonify({

        "message":
        "Item removed",

        "item":
        removed_item

    })


# -------------------------
# CART SUMMARY
# -------------------------

@app.route("/cart-summary")
def cart_summary():

    total_items = len(cart)

    total_price = sum(

        item.get("price", 0)

        for item in cart

    )

    return jsonify({

        "items":
        total_items,

        "total":
        total_price

    })


# -------------------------
# CHECKOUT
# -------------------------

@app.route("/checkout", methods=["POST"])
def checkout():

    global cart

    if len(cart) == 0:

        return jsonify({
            "message": "Cart is empty"
        }), 400

    total = sum(

        item.get("price", 0)

        for item in cart

    )

    order = {
    "items": cart.copy(),
    "total": total
}
    # SAVE ORDER TO DATABASE

    conn = get_db_connection()

    conn.execute(

        """
        INSERT INTO orders(total)

        VALUES(?)
        """,

        (total,)

    )

    conn.commit()

    conn.close()

    cart = []

    return jsonify({

        "message": "Order placed successfully",

        "order": order

    })


# -------------------------
# ORDERS
# -------------------------

@app.route("/orders")
def get_orders():

    conn = get_db_connection()

    orders = conn.execute(

        "SELECT * FROM orders"

    ).fetchall()

    conn.close()

    return jsonify(
        [dict(order) for order in orders]
    )


# -------------------------
# REVIEWS
# -------------------------

@app.route("/reviews", methods=["POST"])
def add_review():

    data = request.json

    conn = get_db_connection()

    conn.execute(
        """
        INSERT INTO reviews
        (product_id, review)
        VALUES (?, ?)
        """,
        (
            data["product_id"],
            data["review"]
        )
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Review added"
    })


@app.route("/reviews", methods=["GET"])
def get_all_reviews():

    conn = get_db_connection()

    reviews = conn.execute(
        "SELECT * FROM reviews"
    ).fetchall()

    conn.close()

    return jsonify(
        [dict(review) for review in reviews]
    )


@app.route("/reviews/<int:id>")
def get_reviews(id):

    conn = get_db_connection()

    reviews = conn.execute(
        """
        SELECT *
        FROM reviews
        WHERE product_id = ?
        """,
        (id,)
    ).fetchall()

    conn.close()

    return jsonify(
        [dict(review) for review in reviews]
    )




# -------------------------
# RUN SERVER
# -------------------------

if __name__ == "__main__":

    app.run(debug=True)