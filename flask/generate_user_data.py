import random
import string
import bcrypt
import mysql.connector

# 连接MySQL数据库
mydb = mysql.connector.connect(
  host="127.0.0.1",
  port="3306",
  user="root",
  password="qwertyuiop123",
  database="recommendation_system"
)

# 创建游标
cursor = mydb.cursor()

# 生成随机密码
def generate_password():
    characters = string.ascii_letters + string.digits + string.punctuation  # 字母、数字和特殊字符
    password = ''.join(random.choices(characters, k=12))  # 随机生成12位密码
    return password

# 生成符合规则的电话号码
def generate_phone_number():
    phone = "1"  # 必须以数字1开头
    phone += str(random.randint(3, 9))  # 第二位数字为3-9之间的数字
    phone += ''.join(random.choices('0123456789', k=9))  # 后面跟着9位数字
    return phone

# 生成并插入数据
def generate_user_data(num_rows):
    for i in range(num_rows):
        id = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz1234567890', 10))
        # 生成随机名字，使用简单的姓氏和两个字的名字组成
        surname = random.choice(['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'])
        given_name = ''.join(random.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2))
        name = surname + given_name

        permission = 0
        phone = generate_phone_number()  # 随机生成11位电话号码
        email = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz', 10)) + "@example.com"
        gender = random.randint(0, 1)
        wechatid = phone  # 通常跟电话号码一样，少数由各种字母和数字组成
        sales_month = random.randint(3000, 100000)
        sales_season = random.randint(10000, 500000)
        password = generate_password()  # 生成随机密码
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()  # 使用bcrypt加密密码

        sql = "INSERT INTO user (id, name, permission, phone, email, gender, wechatid, sales_month, sales_season, password) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (id, name, permission, phone, email, gender, wechatid, sales_month, sales_season, hashed_password)
        cursor.execute(sql, val)


# 调用函数生成数据
generate_user_data(50)  # 生成100条数据

# 提交事务
mydb.commit()

# 关闭游标和数据库连接
cursor.close()
mydb.close()

