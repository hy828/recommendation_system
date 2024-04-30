from flask import Blueprint, request, jsonify
from models import User
from exts import db
import jwt
import bcrypt
from config import jwt_secret_key
from service.personal_center import PersonalCenter

bp = Blueprint('personal_center', __name__)

@bp.route('/personal_center/login', methods=['POST'])
def login(): # 处理登录
    data = request.json
    print(f"登录-用户名和密码: {data}")
    username = data.get('username')
    password = data.get('password')
    PersonalCenter.login(username, password)
    user = User.query.filter_by(id=username).first()
    if user is None:
        print('登录失败，用户名不存在')
        return jsonify({'message': '用户名不存在'}), 400
    
    if bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        headers = {
            "alg": "HS256",
            "typ": "JWT"
        }
        payload = {
            "user_id": username,
        }
        token = jwt.encode(payload=payload, key=jwt_secret_key, algorithm='HS256', headers=headers)
        print('登录成功')
        return jsonify({'message': '登录成功', 'token': token, "userPermission": user.permission, "name": user.name}), 200
    else:
        print('登录失败，密码错误')
        return jsonify({'message': '密码错误'}), 400

@bp.route('/personal_center/change_password', methods=['POST'])
def change_password():
    data = request.json
    token = request.headers.get('Authorization')
    oldPassword = data.get('oldPassword')
    newPassword = data.get('newPassword')
    result = PersonalCenter.change_password(token, oldPassword, newPassword)
    if result:
        return jsonify({'message': '密码修改成功'}), 200
    else:    
        return jsonify({'message': '原密码错误'}), 400
    

@bp.route('/personal_center/query_personal_info', methods=['POST'])
def query_personal_info():
    token = request.headers.get('Authorization')
    record_data = PersonalCenter.get_personal_info(token)
    return jsonify({'record': record_data}), 200

@bp.route('/personal_center/update_info', methods=['POST'])
def update_info():
    data = request.json
    token = request.headers.get('Authorization')
    name = data.get('name')
    gender = data.get('gender')
    phone_no = data.get('phone_no')
    email = data.get('email')
    wechatid = data.get('wechatid')
    PersonalCenter.update_info(token, name, gender, phone_no, email, wechatid)
    return jsonify({'message': '更新成功'}), 200