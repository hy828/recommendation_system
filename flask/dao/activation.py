from models import Activation, Product

class ActivationDAO:
    @staticmethod
    def get_records_by_range(date):
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date).all()
        return records
    
    @staticmethod
    def get_records_by_range_and_pid(date, pid):
        records = Activation.query.filter(Activation.start_date <= date, Activation.end_date >= date,Activation.pid == pid).all()
        return records