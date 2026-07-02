from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Product(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    category = db.Column(db.String(50))

    price = db.Column(db.Float)

    stock = db.Column(db.Integer)

    image = db.Column(db.String(255))

    description = db.Column(db.Text)

    is_new = db.Column(db.Boolean, default=True)