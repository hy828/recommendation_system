import jwt
import bcrypt
from config import jwt_secret_key
from dao.user import UserDAO

class PersonalCenter:
    @staticmethod
    def login(username, password): # 登录
        user = UserDAO.get_user(username) 
        if user is None:
            # print('登录失败，用户名不存在')
            return -1, None, None, None
        
        if bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")): # 检查密码是否正确
            headers = { # JWT 头部
                "alg": "HS256",
                "typ": "JWT"
            }
            payload = { # JWT 载荷
                "user_id": username,
            }
            token = jwt.encode(payload=payload, key=jwt_secret_key, algorithm='HS256', headers=headers) # 生成 token
            # print('登录成功')
            return 1, token, user.permission, user.name
        else:
            # print('登录失败，密码错误')
            return 0, None, None, None

    @staticmethod
    def change_password(token, oldPassword, newPassword): # 修改密码
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256']) 
        id = token_decode["user_id"]
        res = UserDAO.change_password(id, oldPassword, newPassword)
        return res
    
    @staticmethod
    def get_personal_info(token): # 获取个人信息
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        user = UserDAO.get_user(id)
        record_data = {
            'id': user.id,
            'name': user.name,
            'permission': user.permission,
            'phone': user.phone,
            'email': user.email,
            'gender': user.gender,
            'wechatid': user.wechatid,
        }
        return record_data
    
    @staticmethod
    def update_info(token, name, gender, phone, email, wechatid): # 更新个人信息
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        id = token_decode["user_id"]
        UserDAO.update(id, name, gender, phone, email, wechatid)