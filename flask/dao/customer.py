from models import Customer
from sqlalchemy import or_, and_, not_
from exts import db

class CustomerDAO:
    @staticmethod
    def get_details(id): # 获取某个客户的详细信息
        details = Customer.query.filter(Customer.id == id).first()
        return details
    
    @staticmethod
    def get_columns(): # 获取客户表的所有列名
        columns =  Customer.__table__.columns
        return columns
    
    @staticmethod
    def get_all(): # 获取所有客户信息
        customers = Customer.query.all()
        return customers
    
    @staticmethod
    def get_customers(sql): # 高级搜索
        customers = Customer.query.filter(sql).all()
        return customers
    
    @staticmethod
    def get_cond(i): # 高级搜索，将字符串转换为sqlalchemy的查询条件
        key, value = i.split('=')
        if '!' in key: cond = not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%'))
        else: cond = getattr(Customer, key).like(f'%{value.strip("'")}%')
        return cond
    
    @staticmethod
    def get_name(id): # 获取某个客户的名字
        name = Customer.query.filter_by(id=id).first().name
        return name

    @staticmethod
    def update(id, key, value): # 更新某个客户的信息
        customer = Customer.query.filter_by(id=id).first()
        customer.__setattr__(key, value)
        db.session.commit()
    
        
        