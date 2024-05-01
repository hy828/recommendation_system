from models import Activation

class ActivationDAO:
    @staticmethod
    def get_records_by_range(date): # 获取某个日期范围的所有记录
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date).all()
        return records
    
    @staticmethod
    def get_records_by_range_and_pid(date, pid): # 获取某个日期范围的某个产品的所有记录
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date,Activation.pid == pid).all()
        return records