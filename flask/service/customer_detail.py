from dao.customer import CustomerDAO
from dao.description import DescriptionDAO
from dao.user import UserDAO
from dao.follow_up import FollowUpDAO
from dao.product import ProductDAO
from datetime import datetime

class CustomerDetail:
    @staticmethod
    def get_details(id): # 获取某个id的客户详情
        # 基本信息
        details = CustomerDAO.get_details(id)
        rec_column = ['pid1', 'pid2', 'pid3', 'pid4', 'pid5', 'rec_date'] # 不属于基本信息的字段，即推荐结果
        fields = [column.key for column in CustomerDAO.get_columns() if column.key not in rec_column and column.key != 'id']
        customer_data = {}
        customer_data['id'] = id
        for field in fields:
            # 获取字段解释
            description = DescriptionDAO.get_name(field)
            # 获取字段对应的数据
            data = getattr(details, field)
            if field == 'khjl': data = UserDAO.get_name(data) # 从客户经理id得到名字
            customer_data[description] = data
        
        # 跟进记录
        records = FollowUpDAO.get_records_by_cid(id)
        records_list = []
        for record in records:
            name = UserDAO.get_name(record.uid) # 从用户id得到名字
            product = ProductDAO.get_name(record.pid) # 从产品id得到名字
            date = datetime.now().date()
            if record.result == 0: result = "无意向"
            elif record.result == 1: result = "已购买"
            elif record.result == 2: result = "有意向"
            else:  # result为空的情况
                if record.date < date: result = "待补充" # 未填写结果，但是日期已过
                else: result = "无" 
            record_data = {
                'sid': record.sid,
                'name': name,
                'product': product,
                'content': record.content,
                'date': str(record.date),
                'result': result,
            }
            records_list.append(record_data)

        # 推荐结果
        product1 = ProductDAO.get_name(details.pid1)
        product2 = ProductDAO.get_name(details.pid2)
        product3 = ProductDAO.get_name(details.pid3)
        product4 = ProductDAO.get_name(details.pid4)
        product5 = ProductDAO.get_name(details.pid5)
        rec_data = {
            'pid1': product1,
            'pid2': product2,
            'pid3': product3,
            'pid4': product4,
            'pid5': product5,
            'date': str(details.rec_date),
        }
        return customer_data, records_list, rec_data
    
    @staticmethod
    def update_record(id, key, value): # 更新某个客户的信息
        key = DescriptionDAO.get_id(key)
        CustomerDAO.update(id, key, value)

    @staticmethod
    def get_user(name): # 获取某个用户的详细信息
        user = UserDAO.get_user_by_name(name)
        detail = {
            'name': user.name,
            'gender': user.gender,
            'phone': user.phone,
            'email': user.email,
            'wechatid': user.wechatid,
        }
        return detail