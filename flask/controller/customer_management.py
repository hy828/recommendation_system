from flask import Blueprint, request, jsonify
from service.customer_management import CustomerManagement

bp = Blueprint('customer_management', __name__)

@bp.route('/customer_management/query_all_customers', methods=['GET'])
def query_all_customers(): # 获取所有客户信息
    customers_list = CustomerManagement.get_all_customers()
    return jsonify({'customers': customers_list}), 200

@bp.route('/customer_management/advanced_search', methods=['GET'])
def advanced_search(): # 高级搜索
    query = request.args.get('query')
    customers_list = CustomerManagement.advanced_search(query)
    return jsonify({'customers': customers_list}), 200
