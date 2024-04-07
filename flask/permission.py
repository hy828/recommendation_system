from flask import Blueprint, request, jsonify
from models import User
from exts import db
from sqlalchemy import or_
import bcrypt

bp = Blueprint('permission', __name__)

@bp.route('/permission/queryAllUsers', methods=['GET'])
def queryAllUsers(): # 获取所有用户数据
    users = User.query.all()
    users_list = []
    for user in users:
        user_data = {
            'username': user.id,
            'name': user.name,
            'permission': user.permission,
            'phone_number': user.phone_no,
            'email': user.email,
        }
        users_list.append(user_data)
    return jsonify({'users': users_list}), 200

@bp.route('/permission/updatePermission', methods=['POST'])
def updatePermission():
    data = request.json
    username = data.get('username')
    user = User.query.filter_by(id=username).first()
    if user.permission == 0: user.permission = 1
    else: user.permission = 0
    db.session.commit()
    return jsonify({'message': '用户权限已更新'}), 200

@bp.route('/permission/queryUser', methods=['GET'])
def queryUser():
    keyword = request.args.get('query')
    # print(keyword)
    users = User.query.filter(or_(User.id.like(f"%{keyword}%"), User.name.like(f"%{keyword}%"))).all()
    users_list = []
    for user in users:
        user_data = {
            'username': user.id,
            'name': user.name,
            'permission': user.permission,
        }
        users_list.append(user_data)
    # print(users_list)
    return jsonify({'users': users_list}), 200

@bp.route('/permission/addUser', methods=['POST'])
def addUser():
    data = request.json
    # print(data)
    # 创建一个新的用户对象并赋值
    new_user = User()
    new_user.id = data.get('id')
    new_user.name = data.get('name')
    password = data.get('password').encode('utf-8')
    encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt())
    print(encrypted_password)
    new_user.password = encrypted_password
    new_user.permission = int(data.get('permission'))
    # 将新用户对象添加到数据库中
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': '用户添加成功'}), 200