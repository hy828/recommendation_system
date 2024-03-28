from flask import Blueprint, request, jsonify
from models import Service, User, Customer, Product
from exts import db
from sqlalchemy import or_

bp = Blueprint('customerService', __name__)

@bp.route('/customerService/queryAllRecords', methods=['GET'])
def queryAllRecords(): # 获取所有用户数据
    records = Service.query.all()
    records_list = []
    for record in records:
        customer = Customer.query.filter_by(id=record.cid).first()
        user = User.query.filter_by(id=record.uid).first()
        product = Product.query.filter_by(id=record.pid).first()
        if record.result == 0: result = "无意向"
        elif record.result == 1: result = "已购买"
        else: result = "有意向"
        record_data = {
            'sid': record.sid,
            'uid': record.uid,
            'date': record.date,
            'customername': customer.name,
            'name': user.name,
            'product': product.name,
            'content': record.content,
            'result': result,
        }
        records_list.append(record_data)
    return jsonify({'records': records_list}), 200

@bp.route('/customerService/updateRecord', methods=['POST'])
def updateRecord(): # 获取所有用户数据
    data = request.json
    sid = data.get('sid')
    record = Service.query.filter_by(sid=sid).first()
    record.date = data.get('date')
    record.cid = data.get('cid')
    record.uid = data.get('uid')
    record.pid = data.get('pid')
    record.content = data.get('content')
    record.result = data.get('result')
    db.session.commit()
    return jsonify({'message': '用户权限已更新'}), 200

@bp.route('/customerService/queryCustomers', methods=['GET'])
def queryCustomers(): # 获取所有用户数据
    customers = Customer.query.all()
    customers_list = []
    for customer in customers:
        customer_data = {
            'id': customer.id,
            'name': customer.name,
        }
        customers_list.append(customer_data)
    return jsonify({'customers': customers_list}), 200