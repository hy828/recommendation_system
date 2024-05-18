import random
import datetime
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

# 查询已存在的主键组合
def check_existing_keys(cid, pid):
    sql = "SELECT * FROM activation WHERE cid = %s AND pid = %s"
    val = (cid, pid)
    cursor.execute(sql, val)
    result = cursor.fetchone()
    return result is not None

# 生成并插入数据
def generate_activation_data(num_rows):
    for _ in range(num_rows):
        cid = random.randint(1, 230)
        pid = random.randint(1, 30)
        
        # 检查主键是否重复，如果重复则重新生成
        while check_existing_keys(cid, pid):
            cid = random.randint(1, 10)
            pid = random.randint(1, 30)
        
        start_date = datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 30))
        end_date = start_date + datetime.timedelta(days=random.randint(1, 30))
        
        # 插入数据
        sql = "INSERT INTO activation (cid, pid, start_date, end_date) VALUES (%s, %s, %s, %s)"
        val = (cid, pid, start_date, end_date)
        cursor.execute(sql, val)

# 调用函数生成数据
generate_activation_data(200)  # 生成100条数据

# 提交事务
mydb.commit()

# 关闭游标和数据库连接
cursor.close()
mydb.close()

