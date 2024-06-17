from flask import Blueprint, request, jsonify
from service.data_visualization import DataVisualization

bp = Blueprint('data_visualization', __name__)

@bp.route('/data_visualization/get_chart_data1', methods=['GET'])
def get_chart_data1(): # 获取某个产品的近30天统计数据
    pid = int(request.args.get('pid'))
    result = DataVisualization.get_chart_data1(pid)
    return jsonify({'result': result}), 200

@bp.route('/data_visualization/get_chart_data2', methods=['GET'])
def get_chart_data2(): # 获取产品四个类别近30天销售数据
    result, product_list = DataVisualization.get_chart_data2()
    return jsonify({'result': result, 'products': product_list}), 200