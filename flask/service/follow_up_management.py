from dao.customer import CustomerDAO
from dao.follow_up import FollowUpDAO
from dao.product import ProductDAO
import jwt
from config import jwt_secret_key
from datetime import datetime

class FollowUpManagement:
    @staticmethod
    def get_all_records(token): # 获取某个用户的所有跟进记录
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        date = datetime.now().date()
        records = FollowUpDAO.get_records_by_uid(id)
        record_list = []
        for record in records:
            customer = CustomerDAO.get_name(record.cid) # 从客户id得到名字
            product = ProductDAO.get_name(record.pid) # 从产品id得到名字
            if record.result == 0: result = "无意向"
            elif record.result == 1: result = "已购买"
            elif record.result == 2: result = "有意向"
            else: # result为空的情况
                if record.date < date: result = "待补充" # 未填写结果，但是日期已过
                else: result = "无"
            record_data = {
                'sid': record.sid,
                'date': str(record.date),
                'result': result,
                'title': customer + ': ' + product
            }
            record_list.append(record_data)
        return record_list
    
    @staticmethod
    def get_record(sid): # 获取某个id的跟进记录
        record = FollowUpDAO.get_record_by_sid(sid)
        customer = CustomerDAO.get_name(record.cid) # 从客户id得到名字
        product = ProductDAO.get_name(record.pid) # 从产品id得到名字
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
    def update_record(id, date, cid, pid, content, result): # 更新跟进记录
        FollowUpDAO.update(id, date, cid, pid, content, result)

    @staticmethod
    def get_all_customers(): # 获取客户选项，所有客户的id和名字
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
    def delete_record(id): # 删除某个跟进记录
        FollowUpDAO.delete(id)

    @staticmethod
    def add_record(token, date, cid, pid, content, result): # 添加跟进记录
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        if content == '': content = None
        if result == '': result = None
        FollowUpDAO.add(id, date, cid, pid, content, result)

    @staticmethod
    def get_product_options(): # 获取产品选项
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)
        return products_list