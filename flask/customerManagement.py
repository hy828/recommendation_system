from flask import Blueprint, request, jsonify
from models import Customer
from exts import db
from sqlalchemy import or_, and_, not_

bp = Blueprint('customerManagement', __name__)

@bp.route('/customerManagement/queryAllCustomers', methods=['GET'])
def queryAllCustomers():
    customers = Customer.query.all()
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
    return jsonify({'customers': customers_list}), 200

def getCondition(sql):
    key, value = sql.split('=')
    if '!' in key: cond = not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%'))
    else: cond = getattr(Customer, key).like(f'%{value.strip("'")}%')
    return cond

@bp.route('/customerManagement/advancedSearch', methods=['GET'])
def advancedSearch():
    query = request.args.get('query')
    or_index = query.find('|')
    and_index = query.find('&')
    second_or_index = query.rfind('|')
    second_and_index = query.rfind('&')

    arr = [item for i in query.split('|') for item in i.split('&')]
    conditions = []

    for i in arr:
        conditions.append(getCondition(i))

    if len(arr) == 1:
        sql = conditions[0]
        sql = Customer.query.filter(sql)
    elif len(arr) == 2:
        if or_index == -1: sql = and_(*conditions)
        else: sql = or_(*conditions)
        sql = Customer.query.filter(sql)
    elif len(arr) == 3:
        if or_index == -1 or second_or_index == -1: sql = and_(*conditions)
        elif and_index == -1 or second_and_index == -1: sql = or_(*conditions)
        elif or_index < and_index: sql = and_(or_(conditions[0], conditions[1]), conditions[2])
        else: sql = or_(and_(conditions[0], conditions[1]), conditions[2])
        sql = Customer.query.filter(sql)
    else: sql = Customer.query

    customers = sql.all()
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
    print(customers_list)
    return jsonify({'customers': customers_list}), 200
