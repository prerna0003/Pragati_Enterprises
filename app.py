from flask import Flask, render_template, request, redirect, url_for
from config import Config
from models import db, Product

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def home():

    products = Product.query.all()

    return render_template(
        "index.html",
        products=products
        )

@app.route("/admin")
def admin():

    total_products = Product.query.count()

    return render_template(
        "admin/dashboard.html",
        total_products=total_products
    )

@app.route("/admin/add-product", methods=["GET", "POST"])
def add_product():

    if request.method == "POST":

        product = Product(
            name=request.form["name"],
            category=request.form["category"],
            price=float(request.form["price"]),
            stock=int(request.form["stock"]),
            description=request.form["description"]
        )

        db.session.add(product)
        db.session.commit()

        return redirect(url_for("admin"))

    return render_template("admin/add_product.html")

@app.route("/admin/products")
def products():

    all_products = Product.query.all()

    return render_template(
        "admin/products.html",
        products=all_products
    )

if __name__ == "__main__":
    app.run(debug=True)