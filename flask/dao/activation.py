from models import Activation

class ActivationDAO:
    @staticmethod
    def get_records_by_date(date): # 获取某个日期的所有记录
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date).all()
        return records
    
    @staticmethod
    def get_records_by_date_and_pid(date, pid): # 获取某个日期范围的某个产品的所有记录
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date, Activation.pid == pid).all()
        return records
    
    @staticmethod
    def get_records_between_dates(start_date, end_date): # 获取某个日期范围的所有记录
        records = Activation.query.filter(Activation.start_date.between(start_date, end_date) |
                                           Activation.end_date.between(start_date, end_date)).all()
        return records