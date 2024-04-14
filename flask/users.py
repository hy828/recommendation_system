from flask import Blueprint, request, jsonify
from models import User
from exts import db
import jwt
import bcrypt
from config import jwt_secret_key

bp = Blueprint('users', __name__)

@bp.route('/users/login', methods=['POST'])
def login(): # 处理登录
    data = request.json
    print(f"登录-用户名和密码: {data}")
    username = data['username']
    user = User.query.filter_by(id=username).first()
    if user is None:
        print('登录失败，用户名不存在')
        return jsonify({'message': '用户名不存在'}), 400
    
    if bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
        headers = {
            "alg": "HS256",
            "typ": "JWT"
        }
        payload = {
            "user_id": data['username'],
        }
        token = jwt.encode(payload=payload, key=jwt_secret_key, algorithm='HS256', headers=headers)
        print('登录成功')
        return jsonify({'message': '登录成功', 'token': token, "userPermission": user.permission, "name": user.name}), 200
    else:
        print('登录失败，密码错误')
        return jsonify({'message': '密码错误'}), 400

@bp.route('/users/changePassword', methods=['POST'])
def changePassword():
    data = request.json
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    print(f"修改密码-用户名: {id}")
    print(f"修改密码-旧密码和新密码: {data}")
    oldPassword = data['oldPassword']
    newPassword = data['newPassword']
    user = User.query.filter_by(id=id).first()
    if bcrypt.checkpw(oldPassword.encode("utf-8"), user.password.encode("utf-8")):
        password = newPassword.encode('utf-8')
        encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt())
        user.password = encrypted_password;
        db.session.commit()
        print('密码修改成功')
        return jsonify({'message': '密码修改成功'}), 200
    else:
        print('密码修改失败，原密码错误')
        return jsonify({'message': '原密码错误'}), 400

@bp.route('/users/queryPersonalInformation', methods=['POST'])
def queryPersonalInformation():
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    user = User.query.filter_by(id=id).first()
    record_data = {
        'id': user.id,
        'name': user.name,
        'permission': user.permission,
        'phone_no': user.phone_no,
        'email': user.email,
        'gender': user.gender,
        'wechatid': user.wechatid,
    }
    return jsonify({'record': record_data}), 200

@bp.route('/users/updateInformation', methods=['POST'])
def updateInformation():
    data = request.json
    token = request.headers.get('Authorization')
    token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
    id = token_decode["user_id"]
    user = User.query.filter_by(id=id).first()
    user.name = data['name']
    user.phone_no = data['phone_no']
    user.email = data['email']
    # user.gender
    user.wechatid = data['wechatid']
    db.session.commit()
    return jsonify({'message': '更新成功'}), 200