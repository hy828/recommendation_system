from models import User
from exts import db
import bcrypt

class UserDAO:
    @staticmethod
    def get_name(id): # 获取某个用户的名字
        name = User.query.filter_by(id=id).first().name
        return name
    
    @staticmethod
    def get_all(): # 获取所有用户信息
        users = User.query.all()
        return users
    
    @staticmethod
    def update_permission(username): # 更新某个用户的权限
        user = User.query.filter_by(id=username).first()
        if user.permission == 0: user.permission = 1
        else: user.permission = 0
        db.session.commit()
    
    @staticmethod
    def get_users(keyword): # 模糊搜索，获取所有符合条件的用户
        users = User.query.filter(User.id.like(f'%{keyword}%') | User.name.like(f'%{keyword}%') | User.phone.like(f'%{keyword}%') | User.email.like(f'%{keyword}%') | User.wechatid.like(f'%{keyword}%')).all()
        return users
    
    @staticmethod
    def add_user(id, name, gender, phone, email, wechatid, password, permission): # 添加新用户
        existing_user = User.query.filter_by(id=id).first()
        if existing_user: return 0
        new_user = User()
        new_user.id = id
        new_user.name = name
        new_user.gender = gender
        new_user.phone = phone
        new_user.email = email
        new_user.wechatid = wechatid
        new_user.password = password
        new_user.permission = permission
        db.session.add(new_user)
        db.session.commit()
        return 1

    @staticmethod
    def get_user(id): # 获取某个用户的详细信息
        user = User.query.filter_by(id=id).first()
        return user
    
    @staticmethod
    def update(id, name, gender, phone, email, wechatid): # 更新某个用户的信息
        user = User.query.filter_by(id=id).first()
        user.name = name
        user.gender = gender
        user.phone = phone
        user.email = email
        user.wechatid = wechatid
        db.session.commit()

    @staticmethod
    def get_user_by_name(name): # 通过用户名字获取用户信息
        user = User.query.filter_by(name=name).first()
        return user
    
    @staticmethod
    def change_password(id, oldPassword, newPassword):
        user = User.query.filter_by(id=id).first()
        if bcrypt.checkpw(oldPassword.encode("utf-8"), user.password.encode("utf-8")): # 检查原密码是否正确
            password = newPassword.encode('utf-8')
            encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt()) # 加密新密码
            user.password = encrypted_password;
            db.session.commit()
            # print('密码修改成功')
            return 1
        else:
            # print('密码修改失败，原密码错误')
            return 0