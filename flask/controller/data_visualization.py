from flask import Blueprint, request, jsonify
from service.data_visualization import DataVisualization

bp = Blueprint('data_visualization', __name__)

@bp.route('/data_visualization/get_chart_data', methods=['GET'])
def get_chart_data():
    date = request.args.get('date')
    range_param = int(request.args.get('range'))
    pid = int(request.args.get('pid'))
    result1, result2, result3 = DataVisualization.get_chart_data(date, range_param, pid)
    return jsonify({'result1': result1, 'result2': result2, 'result3': result3}), 200

@bp.route('/data_visualization/get_product_options', methods=['GET'])
def get_product_options():
    products_list = DataVisualization.get_product_options()
    return jsonify({'products': products_list}), 200