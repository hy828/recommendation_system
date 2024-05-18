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

@bp.route('/customer_management/query_details', methods=['GET'])
def query_details(): # 获取某个id的客户详情
    id = int(request.args.get('query'))
    customer_data, records_list, rec_data = CustomerManagement.get_details(id)
    return jsonify({'details': customer_data, 'serviceRecords': records_list, 'recommend': rec_data}), 200

@bp.route('/customer_management/update_record', methods=['POST'])
def update_record(): # 更新某个id的客户详情
    data = request.json
    id = data.get('id')
    dict = data.get('data')
    CustomerManagement.update_record(id, dict)
    return jsonify({'message': '更新成功'}), 200

@bp.route('/customer_management/query_user', methods=['GET'])
def query_user(): # 获取某个用户的信息
    name = request.args.get('query')
    detail = CustomerManagement.get_user(name)
    return jsonify({'detail': detail}), 200