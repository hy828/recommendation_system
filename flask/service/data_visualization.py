from collections import Counter
from datetime import datetime, timedelta
from dao.product import ProductDAO
from dao.activation import ActivationDAO

class DataVisualization:
    @staticmethod
    def get_chart_data(date, range_param, pid): # 获取图表数据
        date = datetime.strptime(date, '%Y-%m-%d') # 将日期字符串转换为日期格式
        records = ActivationDAO.get_records_by_range(date)
        pid_counter = Counter(record.pid for record in records) # 统计每个产品的数量
        result1 = [ # 柱状图数据，按照产品类别分类统计
            {'name': '报税', 'value': 0},
            {'name': '发票', 'value': 0},
            {'name': '算薪', 'value': 0},
            {'name': '咨询', 'value': 0}
        ]
        result3 = {'报税': [], '发票': [], '算薪': [], '咨询': []} # 饼图数据，每个产品类别下的产品统计
        for pid, count in pid_counter.items():
            product = ProductDAO.get_name(pid) # 获取产品名称
            category = ProductDAO.get_category(pid) # 获取产品类别
            record_data = {
                'name': product,
                'value': count
            }
            if category == '报税':
                result3['报税'].append(record_data)
                result1[0]['value'] += count
            elif category == '发票':
                result3['发票'].append(record_data)
                result1[1]['value'] += count
            elif category == '算薪':
                result3['算薪'].append(record_data)
                result1[2]['value'] += count
            else:  # 咨询
                result3['咨询'].append(record_data)
                result1[3]['value'] += count

        
        result2 = [] # 折线图数据
        # 获取日期范围
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=range_param)
        current_date = start_date
        while current_date <= end_date: # 查询在 start_date 和 end_date 之间的所有记录
            records = ActivationDAO.get_records_by_range_and_pid(current_date, pid)
            record_data = { # 每天的记录数量
                'name': str(current_date),
                'value': len(records)
            }
            result2.append(record_data)
            current_date += timedelta(days=1) # 更新日期为下一天
        return result1, result2, result3
    
    @staticmethod
    def get_product_options(): # 获取产品选项
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)
        return products_list