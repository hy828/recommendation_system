from models import Customer
from sqlalchemy import or_, and_, not_

class CustomerDAO:
    @staticmethod
    def get_details(id):
        details = Customer.query.filter(Customer.id == id).first()
        return details
    
    @staticmethod
    def get_columns():
        columns =  Customer.__table__.columns
        return columns
    
    @staticmethod
    def get_all():
        customers = Customer.query.all()
        return customers
    
    @staticmethod
    def get_customers(sql):
        customers = Customer.query.filter(sql).all()
        return customers
    
    @staticmethod
    def get_cond(i):
        key, value = i.split('=')
        if '!' in key: cond = not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%'))
        else: cond = getattr(Customer, key).like(f'%{value.strip("'")}%')
        return cond
    
    @staticmethod
    def get_name(id):
        name = Customer.query.filter_by(id=id).first().name
        return name

    
        
        