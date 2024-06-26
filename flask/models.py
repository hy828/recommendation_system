from exts import db

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(20), nullable=False, primary_key=True)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    permission = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.Integer, nullable=False)
    wechatid = db.Column(db.String(20), nullable=False)
    sales_month = db.Column(db.Integer, nullable=False)
    sales_season = db.Column(db.Integer, nullable=False)

class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    requirement = db.Column(db.String(20), nullable=True)
    description = db.Column(db.String(200), nullable=False)

class Customer(db.Model):
    __tablename__ = "customer"
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    khlx = db.Column(db.String(20), nullable=False)
    qygmmc = db.Column(db.String(20), nullable=True)
    nsrzt_dm = db.Column(db.String(20), nullable=True)
    out_invoice_high_risk = db.Column(db.String(20), nullable=True)
    out_invoice_avg = db.Column(db.Integer, nullable=True)
    in_invoice_high_risk = db.Column(db.String(20), nullable=True)
    in_invoice_avg = db.Column(db.Integer, nullable=True)
    invoice_suppliers = db.Column(db.Integer, nullable=True)
    vip_type = db.Column(db.String(20), nullable=True)
    monthly_declare_iit_num_last = db.Column(db.Integer, nullable=True)
    scale = db.Column(db.Integer, nullable=True)
    industry_top = db.Column(db.String(20), nullable=True)
    vat_taxpayer_type = db.Column(db.String(20), nullable=True)
    credit_rating = db.Column(db.String(20), nullable=True)
    invoice_customers = db.Column(db.Integer, nullable=True)
    company_tax_risk = db.Column(db.String(20), nullable=True)
    zczb = db.Column(db.Integer, nullable=True)
    established_days = db.Column(db.Integer, nullable=True)
    cyrs = db.Column(db.Integer, nullable=True)
    current_khjl_days = db.Column(db.Integer, nullable=True)
    total_amount_paid = db.Column(db.Double, nullable=True)
    pid1 = db.Column(db.Integer, nullable=True)
    pid2 = db.Column(db.Integer, nullable=True)
    pid3 = db.Column(db.Integer, nullable=True)
    pid4 = db.Column(db.Integer, nullable=True)
    pid5 = db.Column(db.Integer, nullable=True)
    rec_date = db.Column(db.Date, nullable=True)
    khjl = db.Column(db.String(20), nullable=False)

class FollowUp(db.Model):
    __tablename__ = "follow_up"
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
    
class Description(db.Model):
    __tablename__ = "description"
    id = db.Column(db.String(20), nullable=False, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
