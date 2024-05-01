from dao.customer import CustomerDAO
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
    