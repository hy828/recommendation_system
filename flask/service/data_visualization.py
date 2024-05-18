from collections import Counter
from datetime import datetime, timedelta
from dao.product import ProductDAO
from dao.activation import ActivationDAO

class DataVisualization:
    @staticmethod
    def get_chart_data(pid): # 获取图表数据

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        # 获取30天内每个日期组成的数组
        date = start_date
        dates = []
        while date <= end_date:
            dates.append(str(date))
            date += timedelta(days=1)

        # 获取所有产品id和产品名
        products = ProductDAO.get_all()
        products_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'label': product.name,
            }
            products_list.append(product_data)

        # 获取折线图1的数据 - 某个产品近30天销售情况
        result1 = []
        current_date = start_date
        while current_date <= end_date: # 查询在 start_date 和 end_date 之间的所有记录
            records = ActivationDAO.get_records_by_date_and_pid(current_date, pid)
            record_data = {
                'name': ProductDAO.get_name(pid),
                'value': len(records)
            }
            result1.append(record_data)
            current_date += timedelta(days=1) # 更新日期为下一天
        
        # 获取折线图2的数据 - 产品各个类别近30天销售情况
        data = {'报税': [], '发票': [], '算薪': [], '咨询': []} # 折线图2数据，按照产品类别分类统计
        current_date = start_date
        while current_date <= end_date:
            records = ActivationDAO.get_records_by_date(current_date)
            category_counter = Counter(ProductDAO.get_category(record.pid) for record in records) # 统计每个产品的数量
            # print(category_counter)
            for category, count in category_counter.items():
                data[category].append(count)
            current_date += timedelta(days=1)
        result2 = []
        for key, value in data.items():
            result2.append({ 'name': key, 'type': 'line', 'data': value })
        

        return result1, result2, dates, products_list