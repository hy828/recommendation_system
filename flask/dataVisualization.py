from flask import Blueprint, request, jsonify
from models import Activation, Product
from exts import db
from sqlalchemy import or_
from collections import Counter
from datetime import datetime, timedelta

bp = Blueprint('dataVisualization', __name__)

@bp.route('/dataVisualization/getChartData', methods=['GET'])
def getChartData():
    date = request.args.get('date')
    date = datetime.strptime(date, '%Y-%m-%d')
    records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date).all()
    pid_counter = Counter(record.pid for record in records)
    result1 = [
        {'name': '报税', 'value': 0},
        {'name': '发票', 'value': 0},
        {'name': '算薪', 'value': 0},
        {'name': '咨询', 'value': 0}
    ]
    result3 = {'报税': [], '发票': [], '算薪': [], '咨询': []}
    for pid, count in pid_counter.items():
        product = Product.query.filter_by(id=pid).first()
        record_data = {
            'name': product.name,
            'value': count
        }
        if product.category == '报税':
            result3['报税'].append(record_data)
            result1[0]['value'] += count
        elif product.category == '发票':
            result3['发票'].append(record_data)
            result1[1]['value'] += count
        elif product.category == '算薪':
            result3['算薪'].append(record_data)
            result1[2]['value'] += count
        else:  # 咨询
            result3['咨询'].append(record_data)
            result1[3]['value'] += count

    range_param = int(request.args.get('range'))
    pid = int(request.args.get('pid'))
    result2 = []
    # 获取日期范围
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=range_param)
    current_date = start_date
    while current_date <= end_date:
        # 查询当前日期在 start_date 和 end_date 之间的所有记录
        records = Activation.query.filter(
            Activation.start_date <= current_date,
            Activation.end_date >= current_date,
            Activation.pid == pid
        ).all()
        record_data = {
            'name': str(current_date),
            'value': len(records)
        }
        result2.append(record_data)
        # 更新日期为下一天
        current_date += timedelta(days=1)
    # print(result1)
    # print(result2)
    return jsonify({'result1': result1, 'result2': result2, 'result3': result3}), 200

@bp.route('/dataVisualization/getProductOptions', methods=['GET'])
def getProductOptions():
    products = Product.query.all()
    products_list = []
    for product in products:
        product_data = {
            'id': product.id,
            'label': product.name,
        }
        products_list.append(product_data)
    return jsonify({'products': products_list}), 200