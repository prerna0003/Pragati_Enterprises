from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Product(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    category = db.Column(db.String(50))

    price = db.Column(db.Float)

    stock = db.Column(db.Integer)

    image = db.Column(db.String(255), nullable=True)

    description = db.Column(db.Text)

    is_new = db.Column(db.Boolean, default=True)

class Order(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    customer_name = db.Column(db.String(100))

    phone = db.Column(db.String(20))

    address = db.Column(db.Text)

    total_amount = db.Column(db.Float)

    status = db.Column(db.String(50), default="Pending")


class OrderItem(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey("order.id"))

    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))

    quantity = db.Column(db.Integer)

    price = db.Column(db.Float)