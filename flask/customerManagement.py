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
    print(customers_list)
    return jsonify({'customers': customers_list}), 200

@bp.route('/customerManagement/advancedSearch', methods=['GET'])
def advancedSearch():
    query = request.args.get('query')
    or_index = query.find('|')
    and_index = query.find('&')
    second_or_index = query.rfind('|')
    second_and_index = query.rfind('&')

    arr = [item for i in query.split('|') for item in i.split('&')]
    
    key, value = arr[0].split('=')
    if '!' in key: sql = Customer.query.filter(not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%')))
    else: sql = Customer.query.filter(getattr(Customer, key).like(f'%{value.strip("'")}%'))
    if len(arr) > 1:
        key, value = arr[1].split('=')
        if '!' in key: condition = not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%'))
        else: condition = getattr(Customer, key).like(f'%{value.strip("'")}%')
        if or_index == -1 or (or_index > and_index and and_index != -1):
            sql = sql.filter(and_(condition))
        else:
            sql = sql.filter(or_(condition))
    if len(arr) > 2:
        key, value = arr[2].split('=')
        if '!' in key: condition = not_(getattr(Customer, key.replace('!', '')).like(f'%{value.strip("'")}%'))
        else: condition = getattr(Customer, key).like(f'%{value.strip("'")}%')
        if second_or_index == -1 or second_or_index < second_and_index:
            sql = sql.filter(and_(condition))
        else:
            sql = sql.filter(or_(condition))
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
