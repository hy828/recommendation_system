from dao.user import UserDAO
import jwt
import bcrypt
from config import jwt_secret_key

class UserManagement:
    @staticmethod
    def get_all_users(token): # 获取所有用户数据
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256']) 
        permission = token_decode["user_permission"]
        id = token_decode["user_id"]
        users = UserDAO.get_all()
        users_list = []
        for user in users:
            if (permission == 0 and user.permission != 0) or user.id == id: # 如果用户为客户经理，则不显示管理员信息，也不显示用户自己的信息
                continue
            user_data = {
                'username': user.id,
                'name': user.name,
                'permission': user.permission,
                'phone': user.phone,
                'email': user.email,
                'gender': user.gender,
                'wechatid': user.wechatid,
            }
            users_list.append(user_data)

        sales_month = UserDAO.get_all_sales_month() # 获取月度销售额
        rank_month = sorted(sales_month, key=lambda x: x['sales'], reverse=True)[:5] # 大到小排序，获取前五名
        # print(rank_month)
        sales_season = UserDAO.get_all_sales_season() # 获取季度销售额
        rank_season = sorted(sales_season, key=lambda x: x['sales'], reverse=True)[:5] # 大到小排序，获取前五名
        return users_list, rank_month, rank_season
    
    @staticmethod
    def update_permission(username): # 更新用户权限
        UserDAO.update_permission(username)

    @staticmethod
    def get_users(keyword, token): # 搜索某些用户
        token_decode = jwt.decode(token, jwt_secret_key, algorithms=['HS256']) 
        permission = token_decode["user_permission"]
        id = token_decode["user_id"]
        users = UserDAO.get_users(keyword)
        users_list = []
        for user in users:
            if (permission == 0 and user.permission != 0) or user.id == id:
                continue
            user_data = {
                'username': user.id,
                'name': user.name,
                'permission': user.permission,
                'phone': user.phone,
                'email': user.email,
                'gender': user.gender,
                'wechatid': user.wechatid,
            }
            users_list.append(user_data)
        return users_list
    
    @staticmethod
    def add_user(id, name, gender, phone, email, wechatid, password, permission): # 添加新用户
        encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt())
        res = UserDAO.add_user(id, name, gender, phone, email, wechatid, encrypted_password, permission)
        return res
    
    @staticmethod
    def get_user(id): # 获取某个用户的详细信息
        user = UserDAO.get_user(id)
        detail = {
            'name': user.name,
            'gender': user.gender,
            'phone': user.phone,
            'email': user.email,
            'wechatid': user.wechatid,
        }
        return detail