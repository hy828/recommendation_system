from flask import Blueprint, request, jsonify
from service.data_visualization import DataVisualization

bp = Blueprint('data_visualization', __name__)

@bp.route('/data_visualization/get_chart_data', methods=['GET'])
def get_chart_data(): # 获取某个日期的所有产品统计数据以及某个产品的近期统计数据
    pid = int(request.args.get('pid'))
    result1, result2, dates, products_list = DataVisualization.get_chart_data(pid)
    return jsonify({'result1': result1, 'result2': result2, 'dates': dates, 'products': products_list}), 200