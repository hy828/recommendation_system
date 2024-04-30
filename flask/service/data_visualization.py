from exts import db
from sqlalchemy import or_
from collections import Counter
from datetime import datetime, timedelta
from dao.product import ProductDAO
from dao.activation import ActivationDAO

class DataVisualization:
    @staticmethod
    def get_chart_data(date, range_param, pid):
        date = datetime.strptime(date, '%Y-%m-%d')
        records = ActivationDAO.get_records_by_range(date)
        pid_counter = Counter(record.pid for record in records)
        result1 = [
            {'name': '报税', 'value': 0},
            {'name': '发票', 'value': 0},
            {'name': '算薪', 'value': 0},
            {'name': '咨询', 'value': 0}
        ]
        result3 = {'报税': [], '发票': [], '算薪': [], '咨询': []}
        for pid, count in pid_counter.items():
            product = ProductDAO.get_name(pid)
            category = ProductDAO.get_category(pid)
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

        
        result2 = []
        # 获取日期范围
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=range_param)
        current_date = start_date
        while current_date <= end_date:
            # 查询当前日期在 start_date 和 end_date 之间的所有记录
            records = ActivationDAO.get_records_by_range_and_pid(current_date, pid)
            record_data = {
                'name': str(current_date),
                'value': len(records)
            }
            result2.append(record_data)
            # 更新日期为下一天
            current_date += timedelta(days=1)
        return result1, result2, result3
    
    @staticmethod
    def get_product_options():
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)
        return products_list