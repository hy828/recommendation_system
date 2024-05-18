from dao.customer import CustomerDAO
from dao.description import DescriptionDAO
from dao.user import UserDAO
from dao.follow_up import FollowUpDAO
from dao.product import ProductDAO
from datetime import datetime
from sqlalchemy import or_, and_

class CustomerManagement:
    @staticmethod
    def get_all_customers(): # 获取所有客户信息
        customers = CustomerDAO.get_all()
        customers_list = []
        for customer in customers:
            customer_data = {
                'id': customer.id,
                'name': customer.name,
                'khlx': customer.khlx,
                'qygmmc': customer.qygmmc,
                'scale': customer.scale,
                'industry_top': customer.industry_top,
            }
            customers_list.append(customer_data)
        return customers_list

    @staticmethod
    def advanced_search(query): # 高级搜索
        or_index = query.find('|') # 找到第一个或的位置
        and_index = query.find('&') # 找到第一个与的位置
        second_or_index = query.rfind('|') # 找到最后一个或的位置
        second_and_index = query.rfind('&') # 找到最后一个与的位置

        arr = [item for i in query.split('|') for item in i.split('&')] # 将查询条件分割成数组
        conditions = []

        conditions = []
        for i in arr:
            cond = CustomerDAO.get_cond(i) # 获取查询条件
            conditions.append(cond)

        if len(arr) == 1: # 只有一个查询条件
            sql = conditions[0]
            customers = CustomerDAO.get_customers(sql) # 获取符合条件的客户信息
        elif len(arr) == 2: # 有两个查询条件，有两种情况，即两个查询条件之间是与还是或
            if or_index == -1: sql = and_(*conditions) # 与
            else: sql = or_(*conditions) # 或
            customers = CustomerDAO.get_customers(sql) # 获取符合条件的客户信息
        elif len(arr) == 3: # 有三个查询条件，最多只有三个查询条件，有四种情况，‘与或’，‘或与’，‘与与’，‘或或’
            if or_index == -1 or second_or_index == -1: sql = and_(*conditions) # 与与
            elif and_index == -1 or second_and_index == -1: sql = or_(*conditions) # 或或
            elif or_index < and_index: sql = and_(or_(conditions[0], conditions[1]), conditions[2]) # 或与
            else: sql = or_(and_(conditions[0], conditions[1]), conditions[2]) # 与或
            customers = CustomerDAO.get_customers(sql) # 获取符合条件的客户信息
        else: customers = CustomerDAO.get_all() # 查询条件为空，返回所有客户信息

        customers_list = []
        for customer in customers:
            customer_data = {
                'id': customer.id,
                'name': customer.name,
                'khlx': customer.khlx,
                'qygmmc': customer.qygmmc,
                'scale': customer.scale,
                'industry_top': customer.industry_top,
            }
            customers_list.append(customer_data)
        # print(customers_list)
        return customers_list
    
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
        rec_data = {
            'pid1': { 'name': ProductDAO.get_name(details.pid1), 'description': ProductDAO.get_description(details.pid1), 'similarity': '85%', 'similarity2': '95%' },
            'pid2': { 'name': ProductDAO.get_name(details.pid2), 'description': ProductDAO.get_description(details.pid2), 'similarity': '76%', 'similarity2': '89%' },
            'pid3': { 'name': ProductDAO.get_name(details.pid3), 'description': ProductDAO.get_description(details.pid3), 'similarity': '74%', 'similarity2': '83%' },
            'pid4': { 'name': ProductDAO.get_name(details.pid4), 'description': ProductDAO.get_description(details.pid4), 'similarity': '70%', 'similarity2': '80%' },
            'pid5': { 'name': ProductDAO.get_name(details.pid5), 'description': ProductDAO.get_description(details.pid5), 'similarity': '68%', 'similarity2': '75%' },
            'date': str(details.rec_date),
        }
        # print(rec_data)
        return customer_data, records_list, rec_data
    
    @staticmethod
    def update_record(id, dict): # 更新某个客户的信息
        for key, value in dict.items():
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
    