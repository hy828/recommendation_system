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

cursor.execute("SELECT id FROM user WHERE permission != 1")
# 获取结果集中所有id并存入数组
user_ids = [row[0] for row in cursor.fetchall()]

# 生成并插入数据
def generate_customer_data(num_rows):
    for i in range(131, 131 + num_rows):
        name = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=5)) + "公司"
        zczb = random.randint(100000, 1000000)
        established_days = random.randint(365, 3650)  # 公司成立天数范围为1年到10年
        cyrs = random.randint(10, 1000)
        current_khjl_days = random.randint(1, 365)
        total_amount_paid = round(random.uniform(10000, 1000000), 2)
        company_tax_risk = random.choice(['其他异常', '表间关系不一致', '企税贡献率异常', '免税收入异常'])
        credit_rating = random.choice(['B', 'A', 'D', 'C', 'M'])
        in_invoice_avg = random.randint(1, 100)
        in_invoice_high_risk = random.choice(['发票未认证被红冲', '发票抬头不一致', '发票未认证被作废', '专票项目不齐', '发票认证被红冲', '分类编码有误', '备注内容信息有误', '进项税额转出为负', '发票认证被作废', '失控票'])
        industry_top = random.choice(['批发零售业', '制造业', '房地产业', '交通运输业', '金融保险业', '科研技术业', '生活服务业', '农、林、牧、渔业', '建筑安装业', '商务服务业', '住宿餐饮业', '文体娱乐业', '公共设施管理业', '采矿业', '电热水器供应业', '信息技术业', '教育产业', '卫生社保业', '机关与社团业', '国际组织'])
        invoice_customers = random.randint(1, 1000)
        invoice_suppliers = random.randint(1, 1000)
        
        khjl = random.choice(user_ids)  # 从user表中随机选取
        khlx = random.choice(['单位用户', '个人代理'])
        monthly_declare_iit_num_last = random.randint(1, 100)
        nsrzt_dm = random.choice(['03', '07', '99'])
        out_invoice_avg = random.randint(1, 100)
        out_invoice_high_risk = random.choice(['税率有误', '分类编码有误', '专票项目不齐', '备注内容信息有误', '红票金额异常', '红票份数异常', '发票作废金额较大', '私营有限责任公司', '其他有限责任公司'])
        qygmmc = random.choice(['大型企业', '中型企业', '微型企业', '小型企业'])
        scale = random.randint(1, 100)
        vat_taxpayer_type = random.choice(['一般纳税人', '小规模纳税人'])
        vip_type = random.choice(['VIP', '非VIP', '过期VIP'])
        rec_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        pid1 = random.randint(1, 30)
        pid2 = random.randint(1, 30)
        pid3 = random.randint(1, 30)
        pid4 = random.randint(1, 30)
        pid5 = random.randint(1, 30)

        sql = "INSERT INTO customer (id, name, company_tax_risk, credit_rating, current_khjl_days, cyrs, established_days, in_invoice_avg, in_invoice_high_risk, industry_top, invoice_customers, invoice_suppliers, khjl, khlx, monthly_declare_iit_num_last, nsrzt_dm, out_invoice_avg, out_invoice_high_risk, qygmmc, scale, total_amount_paid, vat_taxpayer_type, vip_type, zczb, pid1, pid2, pid3, pid4, pid5, rec_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (i, name, company_tax_risk, credit_rating, current_khjl_days, cyrs, established_days, in_invoice_avg, in_invoice_high_risk, industry_top, invoice_customers, invoice_suppliers, khjl, khlx, monthly_declare_iit_num_last, nsrzt_dm, out_invoice_avg, out_invoice_high_risk, qygmmc, scale, total_amount_paid, vat_taxpayer_type, vip_type, zczb, pid1, pid2, pid3, pid4, pid5, rec_date)
        cursor.execute(sql, val)

# 调用函数生成数据
generate_customer_data(100)  # 生成100条数据

# 提交事务
mydb.commit()

# 关闭游标和数据库连接
cursor.close()
mydb.close()

