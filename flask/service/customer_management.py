from dao.customer import CustomerDAO
from sqlalchemy import or_, and_, not_

class CustomerManagement:
    @staticmethod
    def get_all_customers():
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
    def advanced_search(query):
        or_index = query.find('|')
        and_index = query.find('&')
        second_or_index = query.rfind('|')
        second_and_index = query.rfind('&')

        arr = [item for i in query.split('|') for item in i.split('&')]
        conditions = []

        conditions = []
        for i in arr:
            cond = CustomerDAO.get_cond(i)
            conditions.append(cond)

        if len(arr) == 1:
            sql = conditions[0]
            customers = CustomerDAO.get_customers(sql)
        elif len(arr) == 2:
            if or_index == -1: sql = and_(*conditions)
            else: sql = or_(*conditions)
            customers = CustomerDAO.get_customers(sql)
        elif len(arr) == 3:
            if or_index == -1 or second_or_index == -1: sql = and_(*conditions)
            elif and_index == -1 or second_and_index == -1: sql = or_(*conditions)
            elif or_index < and_index: sql = and_(or_(conditions[0], conditions[1]), conditions[2])
            else: sql = or_(and_(conditions[0], conditions[1]), conditions[2])
            customers = CustomerDAO.get_customers(sql)
        else: customers = CustomerDAO.get_all()

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
    