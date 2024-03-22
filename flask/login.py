from flask import Blueprint, request, jsonify
# from util import Result

bp = Blueprint('login', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    # if not data:
        # return Result.error(400, 'post 必须是json数据')
    username = data.get('username')
    password = data.get('password')
    
    # 这里假设用户名为 admin，密码为 12345
    if username == 'admin' and password == '12345':
        # return Result.success(200, '登录成功')
        return jsonify({'message': 'Login successful'}), 200
    else:
        # return Result.success(401, '登录失败，用户名或密码错误')
        return jsonify({'message': 'Invalid username or password'}), 401