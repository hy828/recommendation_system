from flask import Blueprint, request, jsonify
from service.customer_detail import CustomerDetail

bp = Blueprint('customer_detail', __name__)

@bp.route('/customer_detail/query_details', methods=['GET'])
def query_details(): # 获取某个id的客户详情
    id = int(request.args.get('query'))
    customer_data, records_list, rec_data = CustomerDetail.get_details(id)
    return jsonify({'details': customer_data, 'serviceRecords': records_list, 'recommend': rec_data}), 200

@bp.route('/customer_detail/update_record', methods=['POST'])
def update_record(): # 更新某个id的客户详情
    data = request.json
    id = data.get('id')
    key = data.get('key')
    value = data.get('value')
    CustomerDetail.update_record(id, key, value)
    return jsonify({'message': '记录已更新'}), 200

@bp.route('/customer_detail/query_user', methods=['GET'])
def query_user(): # 获取某个用户的信息
    name = request.args.get('query')
    detail = CustomerDetail.get_user(name)
    return jsonify({'detail': detail}), 200