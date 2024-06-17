from collections import defaultdict, Counter
from datetime import datetime, timedelta
from dao.product import ProductDAO
from dao.activation import ActivationDAO

def date_range(start_date, end_date):
    for n in range((end_date - start_date).days + 1):
        yield start_date + timedelta(n)

class DataVisualization:
    @staticmethod
    def get_chart_data1(pid): # 获取折线图1的数据 - 某个产品近30天销售情况
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        result = []
        current_date = start_date
        while current_date <= end_date: # 查询在 start_date 和 end_date 之间的所有记录
            records = ActivationDAO.get_records_by_date_and_pid(current_date, pid)
            record_data = {
                'name': ProductDAO.get_name(pid),
                'value': len(records)
            }
            result.append(record_data)
            current_date += timedelta(days=1) # 更新日期为下一天        

        return result
    
    @staticmethod
    def get_chart_data2(): # 获取图表数据
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        # 获取所有产品id和产品名
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)

        data = {'报税': defaultdict(int), '发票': defaultdict(int), '算薪': defaultdict(int), '咨询': defaultdict(int)}
        product_categories = ProductDAO.get_all_categories()
        category_map = {product.id: product.category for product in product_categories}
        # 遍历每一天，统计每个产品类别的记录数量
        current_date = start_date
        while current_date <= end_date:
            # 获取当天的记录
            today_records = ActivationDAO.get_records_by_date(current_date)
            for record in today_records:
                category = category_map.get(record.pid)
                data[category][current_date] += 1
            current_date += timedelta(days=1)

        # 将数据格式化为折线图需要的格式
        result = [{'name': category, 'type': 'line', 'data': list(counts.values())} for category, counts in data.items()]

        return result, products_list