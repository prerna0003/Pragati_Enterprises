import os
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, redirect, url_for
from config import Config
from models import db, Product

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def home():

    products = Product.query.filter_by(is_new=True).all()

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

        image = request.files["image"]

        filename = ""

        if image and image.filename != "":
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

        product = Product(
            name=request.form["name"],
            category=request.form["category"],
            price=float(request.form["price"]),
            stock=int(request.form["stock"]),
            description=request.form["description"],
            image=filename
        )

        db.session.add(product)
        db.session.commit()

        return redirect(url_for("products"))

    return render_template("admin/add_product.html")
    return render_template("admin/add_product.html")

@app.route("/admin/products")
def products():

    all_products = Product.query.all()

    return render_template(
        "admin/products.html",
        products=all_products
    )

@app.route("/admin/delete-product/<int:id>")
def delete_product(id):

    product = Product.query.get_or_404(id)

    # Delete image if it exists
    if product.image:
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], product.image)
        if os.path.exists(image_path):
            os.remove(image_path)

    db.session.delete(product)
    db.session.commit()

    return redirect(url_for("products"))

@app.route("/admin/edit-product/<int:id>", methods=["GET", "POST"])
def edit_product(id):

    product = Product.query.get_or_404(id)

    if request.method == "POST":

        product.name = request.form["name"]
        product.category = request.form["category"]
        product.price = float(request.form["price"])
        product.stock = int(request.form["stock"])
        product.description = request.form["description"]

        image = request.files["image"]

        if image and image.filename != "":
            # Delete old image
            if product.image:
                old_path = os.path.join(app.config["UPLOAD_FOLDER"], product.image)
                if os.path.exists(old_path):
                    os.remove(old_path)

            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            product.image = filename

        db.session.commit()

        return redirect(url_for("products"))

    return render_template(
        "admin/edit_product.html",
        product=product
    )

if __name__ == "__main__":
    app.run(debug=True)