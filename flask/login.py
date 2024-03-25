from flask import Blueprint, request, jsonify
from models import User

bp = Blueprint('login', __name__)

@bp.route('/login', methods=['POST'])
def login(): # 处理登录
    data = request.json
    # print(f"用户名和密码: {data}")
    username = data['username']
    user = User.query.filter_by(id=username).first()
    if user is None:
        return jsonify({'message': '用户名不存在'}), 400
    if data['password'] == user.password:
        return jsonify({'message': '登录成功', 'permission': user.permission}), 200
    else:
        return jsonify({'message': '密码错误'}), 400