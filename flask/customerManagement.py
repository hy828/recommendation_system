from flask import Blueprint, request, jsonify
from models import Customer
from exts import db
from sqlalchemy import or_

bp = Blueprint('customerManagement', __name__)

@bp.route('/customerManagement/queryAllCustomers', methods=['GET'])
def queryAllCustomers(): # 获取所有用户数据
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
    return jsonify({'customers': customers_list}), 200

@bp.route('/customerManagement/queryDetail', methods=['GET'])
def queryDetail(): # 获取所有用户数据
    data = request.json
    id = data.get('id')
    detail = Customer.query.filter_by(id=id).first()
    return jsonify({'detail': detail}), 200