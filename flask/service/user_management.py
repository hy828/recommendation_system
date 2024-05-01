from dao.user import UserDAO
import bcrypt

class UserManagement:
    @staticmethod
    def get_all_users(): # 获取所有用户数据
        users = UserDAO.get_all()
        users_list = []
        for user in users:
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
    def update_permission(username): # 更新用户权限
        UserDAO.update_permission(username)

    @staticmethod
    def get_users(keyword): # 搜索某些用户
        users = UserDAO.get_users(keyword)
        users_list = []
        for user in users:
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