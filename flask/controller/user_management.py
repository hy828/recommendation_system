from flask import Blueprint, request, jsonify
from service.user_management import UserManagement

bp = Blueprint('user_management', __name__)

@bp.route('/user_management/query_all_users', methods=['GET'])
def query_all_users(): # 获取所有用户数据
    users_list = UserManagement.get_all_users()
    return jsonify({'users': users_list}), 200

@bp.route('/user_management/update_permission', methods=['POST'])
def update_permission():
    data = request.json
    username = data.get('username')
    UserManagement.update_permission(username)
    return jsonify({'message': '用户权限已更新'}), 200

@bp.route('/user_management/query_user', methods=['GET'])
def query_user():
    keyword = request.args.get('query')
    users_list = UserManagement.get_users(keyword)
    return jsonify({'users': users_list}), 200

@bp.route('/user_management/add_user', methods=['POST'])
def add_user():
    data = request.json
    id = data.get('id')
    name = data.get('name')
    password = data.get('password').encode('utf-8')
    permission = int(data.get('permission'))
    UserManagement.add_user(id, name, password, permission)
    return jsonify({'message': '用户添加成功'}), 200