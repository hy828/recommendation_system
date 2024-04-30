from models import Product

class ProductDAO:
    @staticmethod
    def get_name(id):
        name = Product.query.filter_by(id=id).first().name
        return name
    
    @staticmethod
    def get_all():
        products = Product.query.all()
        return products
    
    @staticmethod
    def get_category(id):
        category = Product.query.filter_by(id=id).first().category
        return category