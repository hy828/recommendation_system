from models import User
from exts import db

class UserDAO:
    @staticmethod
    def get_name(id):
        name = User.query.filter_by(id=id).first().name
        return name
    
    @staticmethod
    def get_all():
        users = User.query.all()
        return users
    
    @staticmethod
    def update_permission(username):
        user = User.query.filter_by(id=username).first()
        if user.permission == 0: user.permission = 1
        else: user.permission = 0
        db.session.commit()
    
    @staticmethod
    def get_users(keyword):
        users = User.query.filter(User.id.like(f'%{keyword}%') | User.name.like(f'%{keyword}%') | User.phone_no.like(f'%{keyword}%') | User.email.like(f'%{keyword}%') | User.wechatid.like(f'%{keyword}%')).all()
        return users
    
    @staticmethod
    def add_user(id, name, password, permission):
        new_user = User()
        new_user.id = id
        new_user.name = name
        new_user.password = password
        new_user.permission = permission
        db.session.add(new_user)
        db.session.commit()

    @staticmethod
    def get_user(id):
        user = User.query.filter_by(id=id).first()
        return user
    
    @staticmethod
    def update(id, name, gender, phone_no, email, wechatid):
        user = User.query.filter_by(id=id).first()
        user.name = name
        user.gender = gender
        user.phone_no = phone_no
        user.email = email
        user.wechatid = wechatid
        db.session.commit()
    