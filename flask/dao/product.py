from models import Product

class ProductDAO:
    @staticmethod
    def get_name(id): # 获取某个产品的名字
        name = Product.query.filter_by(id=id).first().name
        return name
    
    @staticmethod
    def get_all(): # 获取所有产品信息
        products = Product.query.all()
        return products
    
    @staticmethod
    def get_category(id): # 获取某个产品的类别
        category = Product.query.filter_by(id=id).first().category
        return category