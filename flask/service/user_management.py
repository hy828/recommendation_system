from dao.user import UserDAO
import bcrypt

class UserManagement:
    @staticmethod
    def get_all_users():
        users = UserDAO.get_all()
        users_list = []
        for user in users:
            user_data = {
                'username': user.id,
                'name': user.name,
                'permission': user.permission,
                'phone_number': user.phone_no,
                'email': user.email,
                'gender': user.gender,
                'wechatid': user.wechatid,
            }
            users_list.append(user_data)
        return users_list
    
    @staticmethod
    def update_permission(username):
        UserDAO.update_permission(username)

    @staticmethod
    def get_users(keyword):
        users = UserDAO.get_users(keyword)
        users_list = []
        for user in users:
            user_data = {
                'username': user.id,
                'name': user.name,
                'permission': user.permission,
                'phone_number': user.phone_no,
                'email': user.email,
                'gender': user.gender,
                'wechatid': user.wechatid,
            }
            users_list.append(user_data)
        return users_list
    
    @staticmethod
    def add_user(id, name, password, permission):
        encrypted_password = bcrypt.hashpw(password, bcrypt.gensalt())
        UserDAO.add_user(id, name, encrypted_password, permission)