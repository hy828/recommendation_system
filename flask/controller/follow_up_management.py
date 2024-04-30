from flask import Blueprint, request, jsonify
from service.follow_up_management import FollowUpManagement

bp = Blueprint('follow_up_management', __name__)

@bp.route('/follow_up_management/query_all_records', methods=['POST'])
def query_all_records():
    token = request.headers.get('Authorization')
    record_list = FollowUpManagement.get_all_records(token)    
    return jsonify({'records': record_list}), 200

@bp.route('/follow_up_management/query_record', methods=['GET'])
def query_record():
    sid = int(request.args.get('query'))
    record_data = FollowUpManagement.get_record(sid)
    return jsonify({'record': record_data}), 200

@bp.route('/follow_up_management/update_record', methods=['POST'])
def update_record():
    data = request.json
    sid = data.get('sid')
    date = data.get('date')
    cid = data.get('cid')
    pid = data.get('pid')
    content = data.get('content')
    result = data.get('result')
    FollowUpManagement.update_record(sid, date, cid, pid, content, result)
    return jsonify({'message': '记录已更新'}), 200

@bp.route('/follow_up_management/query_customers', methods=['GET'])
def query_customers():
    customer_list = FollowUpManagement.get_all_customers()
    return jsonify({'customers': customer_list}), 200

@bp.route('/follow_up_management/delete_record', methods=['POST'])
def delete_record():
    data = request.json
    sid = data.get('sid')
    FollowUpManagement.delete_record(sid)
    return jsonify({'message': '删除记录成功'}), 200

@bp.route('/follow_up_management/add_record', methods=['POST'])
def add_record():
    data = request.json
    date = data.get('date')
    cid = data.get('cid')
    pid = data.get('pid')
    content = data.get('content')
    result = data.get('result')
    token = request.headers.get('Authorization')
    FollowUpManagement.add_record(token, date, cid, pid, content, result)
    return jsonify({'message': '新记录已添加'}), 200

@bp.route('/follow_up_management/get_product_options', methods=['GET'])
def get_product_options():
    product_list = FollowUpManagement.get_product_options()
    return jsonify({'products': product_list}), 200