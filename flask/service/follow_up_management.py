from dao.customer import CustomerDAO
from dao.follow_up import FollowUpDAO
from dao.product import ProductDAO
import jwt
from config import jwt_secret_key
from datetime import datetime

class FollowUpManagement:
    @staticmethod
    def get_all_records(token):
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        date = datetime.now().date()
        records = FollowUpDAO.get_records_by_uid(id)
        record_list = []
        for record in records:
            customer = CustomerDAO.get_name(record.cid)
            product = ProductDAO.get_name(record.pid)
            if record.result == 0: result = "无意向"
            elif record.result == 1: result = "已购买"
            elif record.result == 2: result = "有意向"
            else: 
                if record.date < date: result = "待补充"
                else: result = "无"
            record_data = {
                'sid': record.sid,
                'date': str(record.date),
                'customerName': customer,
                'product': product,
                'result': result,
            }
            record_list.append(record_data)
        return record_list
    
    @staticmethod
    def get_record(sid):
        record = FollowUpDAO.get_record_by_sid(sid)
        customer = CustomerDAO.get_name(record.cid)
        product = ProductDAO.get_name(record.pid)
        record_data = {
            'sid': record.sid,
            'date': str(record.date),
            'cid': record.cid,
            'customerName': customer,
            'pid': record.pid,
            'product': product,
            'content': record.content,
            'result': record.result,
        }
        return record_data
    
    @staticmethod
    def update_record(id, date, cid, pid, content, result):
        FollowUpDAO.update(id, date, cid, pid, content, result)

    @staticmethod
    def get_all_customers():
        customers = CustomerDAO.get_all()
        customers_list = []
        for customer in customers:
            customer_data = {
                'id': customer.id,
                'label': customer.name,
            }
            customers_list.append(customer_data)
        return customers_list
    
    @staticmethod
    def delete_record(id):
        FollowUpDAO.delete(id)

    @staticmethod
    def add_record(token, date, cid, pid, content, result):
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        if content == '': content = None
        if result == '': result = None
        FollowUpDAO.add(id, date, cid, pid, content, result)

    @staticmethod
    def get_product_options():
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)
        return products_list