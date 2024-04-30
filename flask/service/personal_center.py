from models import User
from exts import db
import jwt
import bcrypt
from config import jwt_secret_key
from dao.user import UserDAO

class PersonalCenter:
    @staticmethod
    def login(username, password):
        user = UserDAO.get_user(username)

    @staticmethod
    def change_password(token, oldPassword, newPassword):
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        user = UserDAO.get_user(id)
        if bcrypt.checkpw(oldPassword.encode("utf-8"), user.password.encode("utf-8")):
            password = newPassword.encode('utf-8')
            encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt())
            user.password = encrypted_password;
            db.session.commit()
            print('密码修改成功')
            return True
        else:
            print('密码修改失败，原密码错误')
            return False
    
    @staticmethod
    def get_personal_info(token):
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        user = UserDAO.get_user(id)
        record_data = {
            'id': user.id,
            'name': user.name,
            'permission': user.permission,
            'phone_no': user.phone_no,
            'email': user.email,
            'gender': user.gender,
            'wechatid': user.wechatid,
        }
        return record_data
    
    @staticmethod
    def update_info(token, name, gender, phone_no, email, wechatid):
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        UserDAO.update(id, name, gender, phone_no, email, wechatid)