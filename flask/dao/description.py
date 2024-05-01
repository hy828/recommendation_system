from models import Description

class DescriptionDAO:
    @staticmethod
    def get_name(id): # 获取客户表某个列名的名字
        name = Description.query.filter_by(id=id).first().name
        return name
    
    @staticmethod
    def get_id(name): # 获取客户表某个列名的id
        id = Description.query.filter_by(name=name).first().id
        return id
