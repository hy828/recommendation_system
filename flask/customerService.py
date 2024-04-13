from flask import Blueprint, request, jsonify
from models import Service, User, Customer, Product
from exts import db
import jwt
from config import jwt_secret_key
from datetime import datetime

bp = Blueprint('customerService', __name__)

@bp.route('/customerService/queryAllRecords', methods=['POST'])
def queryAllRecords():
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    date = datetime.now().date()
    records = Service.query.filter(Service.uid == id).all()
    record_list = []
    for record in records:
        customer = Customer.query.filter_by(id=record.cid).first()
        product = Product.query.filter_by(id=record.pid).first()
        if record.result == 0: result = "无意向"
        elif record.result == 1: result = "已购买"
        elif record.result == 2: result = "有意向"
        else: 
            if record.date < date: result = "待补充"
            else: result = "无"
        record_data = {
            'sid': record.sid,
            'date': str(record.date),
            'customerName': customer.name,
            'product': product.name,
            'result': result,
        }
        record_list.append(record_data)
    return jsonify({'records': record_list}), 200

@bp.route('/customerService/queryRecord', methods=['GET'])
def queryRecord():
    sid = int(request.args.get('query'))
    record = Service.query.filter(Service.sid == sid).first()
    customer = Customer.query.filter_by(id=record.cid).first()
    product = Product.query.filter_by(id=record.pid).first()
    record_data = {
        'sid': record.sid,
        'date': str(record.date),
        'cid': customer.id,
        'customerName': customer.name,
        'pid': record.pid,
        'product': product.name,
        'content': record.content,
        'result': record.result,
    }
    return jsonify({'record': record_data}), 200

@bp.route('/customerService/updateRecord', methods=['POST'])
def updateRecord():
    data = request.json
    sid = data.get('sid')
    record = Service.query.filter_by(sid=sid).first()
    record.date = data.get('date')
    record.cid = data.get('cid')
    record.pid = data.get('pid')
    record.content = data.get('content')
    record.result = data.get('result')
    db.session.commit()
    return jsonify({'message': '记录已更新'}), 200

@bp.route('/customerService/queryCustomers', methods=['GET'])
def queryCustomers():
    customers = Customer.query.all()
    customers_list = []
    for customer in customers:
        customer_data = {
            'id': customer.id,
            'label': customer.name,
        }
        customers_list.append(customer_data)
    return jsonify({'customers': customers_list}), 200

@bp.route('/customerService/deleteRecord', methods=['POST'])
def deleteRecord():
    data = request.json
    sid = data.get('sid')
    record = Service.query.filter_by(sid=sid).first()
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': '删除记录成功'}), 200

@bp.route('/customerService/addRecord', methods=['POST'])
def addRecord():
    data = request.json
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    newRecord = Service()
    newRecord.date = data.get('date')
    newRecord.cid = data.get('cid')
    newRecord.uid = id
    newRecord.pid = data.get('pid')
    if data.get('content') == '': newRecord.content = None
    else: newRecord.content = data.get('content')
    if data.get('result') == '': newRecord.result = None
    else: newRecord.result = data.get('result')
    db.session.add(newRecord)
    db.session.commit()
    return jsonify({'message': '新记录已添加'}), 200