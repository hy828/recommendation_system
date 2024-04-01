from flask import Blueprint, request, jsonify
from models import Service, User, Customer, Product
from exts import db
import jwt
from config import jwt_secret_key
from datetime import datetime

bp = Blueprint('customerService', __name__)

@bp.route('/customerService/queryAllRecords', methods=['POST'])
def queryAllRecords(): # 获取所有用户数据
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    date = datetime.now().date()
    records = Service.query.filter(Service.uid == id).all()
    future_list = []
    history_list = []
    for record in records:
        customer = Customer.query.filter_by(id=record.cid).first()
        user = User.query.filter_by(id=record.uid).first()
        product = Product.query.filter_by(id=record.pid).first()
        if record.result == 0: result = "无意向"
        elif record.result == 1: result = "已购买"
        else: result = "有意向"
        record_data = {
            'sid': record.sid,
            'username': user.name,
            'date': str(record.date),
            'cid': customer.id,
            'customerName': customer.name,
            'pid': record.pid,
            'product': product.name,
            'content': record.content,
            'result': result,
        }
        if record.date < date: history_list.append(record_data)
        else: future_list.append(record_data)
    return jsonify({'future': future_list, 'history': history_list}), 200

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

@bp.route('/customerService/deleteRecord', methods=['POST'])
def deleteRecord(): # 获取所有用户数据
    data = request.json
    sid = data.get('sid')
    record = Service.query.filter_by(sid=sid).first()
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': '删除记录成功'}), 200

