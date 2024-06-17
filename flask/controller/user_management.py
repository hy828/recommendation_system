from flask import Blueprint, request, jsonify
from service.user_management import UserManagement

bp = Blueprint('user_management', __name__)

@bp.route('/user_management/query_all_users', methods=['POST'])
def query_all_users(): # 获取所有用户数据
    token = request.headers.get('Authorization')
    users_list, rank_month, rank_season = UserManagement.get_all_users(token)
    return jsonify({'users': users_list, 'rank_month': rank_month, 'rank_season': rank_season}), 200

@bp.route('/user_management/update_permission', methods=['POST'])
def update_permission(): # 更新用户权限
    data = request.json
    username = data.get('username')
    UserManagement.update_permission(username)
    return jsonify({'message': '用户权限已更新'}), 200

@bp.route('/user_management/query_users', methods=['POST'])
def query_users(): # 搜索某些用户
    token = request.headers.get('Authorization')
    data = request.json
    keyword = data.get('query')
    users_list = UserManagement.get_users(keyword, token)
    return jsonify({'users': users_list}), 200

@bp.route('/user_management/add_user', methods=['POST'])
def add_user(): # 添加新用户
    data = request.json
    id = data.get('id')
    name = data.get('name')
    gender = int(data.get('gender'))
    phone = data.get('phone')
    email = data.get('email')
    wechatid = data.get('wechatid')
    password = data.get('password').encode('utf-8')
    permission = int(data.get('permission'))
    res = UserManagement.add_user(id, name, gender, phone, email, wechatid, password, permission)
    if res: return jsonify({'message': '用户添加成功'}), 200
    else: return jsonify({'message': '用户添加失败，id已被使用过'}), 400

@bp.route('/user_management/query_user', methods=['GET'])
def query_user(): # 获取某个用户的信息
    id = request.args.get('query')
    detail = UserManagement.get_user(id)
    return jsonify({'detail': detail}), 200