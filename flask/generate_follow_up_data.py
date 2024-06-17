import mysql.connector
from faker import Faker
import random
from datetime import datetime, timedelta

# 创建 Faker 实例
fake = Faker()

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

cursor.execute("SELECT id FROM user WHERE permission != 1")
# 获取结果集中所有id并存入数组
user_ids = [row[0] for row in cursor.fetchall()]

# 生成 follow_up 表数据的函数
def generate_follow_up_data(num_rows):
    for i in range(num_rows):
        # uid = random.choice(user_ids)
        # cursor.execute("SELECT id FROM customer WHERE khjl = %s", (uid,))
        # cids = [row[0] for row in cursor.fetchall()]
        # if not cids:
        #     # 如果没有找到客户ID，跳过本次循环
        #     continue
        # cid = random.choice(cids)
        cid = random.randint(1, 230)
        cursor.execute("SELECT khjl FROM customer WHERE id = %s", (cid,))
        uids = [row[0] for row in cursor.fetchall()]
        uid = random.choice(uids)
        pid = random.randint(1, 30)
        content = fake.text(max_nb_chars=40)
        start_date = datetime.now() - timedelta(days=30)
        end_date = datetime.now() + timedelta(days=30)
        date = fake.date_between(start_date=start_date, end_date=end_date)
        result = random.choice([0, 1, 2, None])
        
        sql = "INSERT INTO follow_up (uid, cid, pid, content, date, result) VALUES (%s, %s, %s, %s, %s, %s)"
        val = (uid, cid, pid, content, date, result)
        cursor.execute(sql, val)

# 生成100条数据
generate_follow_up_data(50)

# 提交事务
mydb.commit()

# 关闭游标和数据库连接
cursor.close()
mydb.close()