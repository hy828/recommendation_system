from exts import db

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(20), nullable=False, primary_key=True)
    password = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    permission = db.Column(db.Integer, nullable=False)

class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    requirement = db.Column(db.String(20), nullable=True)