from dao.customer import CustomerDAO
from dao.description import DescriptionDAO
from dao.user import UserDAO
from dao.follow_up import FollowUpDAO
from dao.product import ProductDAO

class CustomerDetail:
    @staticmethod
    def get_details(id):
        # 基本信息
        details = CustomerDAO.get_details(id)
        rec_column = ['pid1', 'pid2', 'pid3', 'pid4', 'pid5', 'rec_date']
        fields = [column.key for column in CustomerDAO.get_columns() if column.key not in rec_column and column.key != 'id']
        customer_data = {}
        customer_data['id'] = id
        for field in fields:
            # 获取字段解释
            description = DescriptionDAO.get_name(field)
            # 获取字段对应的数据
            data = getattr(details, field)
            if field == 'khjl': data = UserDAO.get_name(data)
            customer_data[description] = data
        
        # 跟进记录
        records = FollowUpDAO.get_records_by_cid(id)
        records_list = []
        for record in records:
            name = UserDAO.get_name(record.uid)
            product = ProductDAO.get_name(record.pid)
            if record.result == 0: result = "无意向"
            elif record.result == 1: result = "已购买"
            else: result = "有意向"
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