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

class Customer(db.Model):
    __tablename__ = "customer"
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    khlx = db.Column(db.String(20), nullable=False)
    qygmmc = db.Column(db.String(20), nullable=True)
    nsrzt_dm = db.Column(db.String(20), nullable=True)
    out_invoice_high_risk = db.Column(db.String(20), nullable=True)
    out_invoice_avg = db.Column(db.String(20), nullable=True)
    in_invoice_high_risk = db.Column(db.String(20), nullable=True)
    in_invoice_avg = db.Column(db.String(20), nullable=True)
    invoice_suppliers = db.Column(db.String(20), nullable=True)
    vip_type = db.Column(db.String(20), nullable=True)
    monthly_declare_iit_num_last = db.Column(db.String(20), nullable=True)
    scale = db.Column(db.String(20), nullable=True)
    industry_top = db.Column(db.String(20), nullable=True)
    vat_taxpayer_type = db.Column(db.String(20), nullable=True)
    credit_rating = db.Column(db.String(20), nullable=True)
    invoice_customers = db.Column(db.String(20), nullable=True)
    company_tax_risk = db.Column(db.String(20), nullable=True)
    zczb = db.Column(db.Integer, nullable=True)
    established_days = db.Column(db.Integer, nullable=True)
    cyrs = db.Column(db.Integer, nullable=True)
    current_khjl_days = db.Column(db.Integer, nullable=True)
    total_amount_paid = db.Column(db.Double, nullable=True)

class Service(db.Model):
    __tablename__ = "service"
    sid = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(20), nullable=False)
    cid = db.Column(db.Integer, nullable=False)
    pid = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(20), nullable=True)
    date = db.Column(db.Date, nullable=False)
    result = db.Column(db.Integer, nullable=False)

class Recommendation(db.Model):
    __tablename__ = "recommendation"
    cid = db.Column(db.Integer, nullable=False, primary_key=True)
    pid = db.Column(db.Integer, nullable=False, primary_key=True)
    date = db.Column(db.Date, nullable=False)

class Activation(db.Model):
    __tablename__ = "activation"
    cid = db.Column(db.Integer, nullable=False, primary_key=True)
    pid = db.Column(db.Integer, nullable=False, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    