from flask import Blueprint, request, jsonify
from models import Service, User, Customer, Product, Description
from exts import db
import jwt
from config import jwt_secret_key
from datetime import datetime

bp = Blueprint('customerDetail', __name__)

@bp.route('/customerDetail/queryDetails', methods=['GET'])
def queryAllRecords():
    id = request.args.get('query')
    # 基本信息
    details = Customer.query.filter(id == id).first()
    fields = [column.key for column in Customer.__table__.columns if column.key != 'id']
    customer_data = {}
    for field in fields:
        # 获取字段解释
        description = Description.query.filter_by(id=field).first()
        # 获取字段对应的数据
        data = getattr(details, field)
        customer_data[description.name] = data
    # 跟进记录
    records = Service.query.filter(Service.cid == id).all()
    records_list = []
    for record in records:
        user = User.query.filter_by(id=record.uid).first()
        product = Product.query.filter_by(id=record.pid).first()
        if record.result == 0: result = "无意向"
        elif record.result == 1: result = "已购买"
        else: result = "有意向"
        record_data = {
            'sid': record.sid,
            'name': user.name,
            'product': product.name,
            'content': record.content,
            'date': str(record.date),
            'result': result,
        }
        records_list.append(record_data)
    return jsonify({'details': customer_data, 'serviceRecords': records_list}), 200