from models import FollowUp
from exts import db

class FollowUpDAO:
    @staticmethod
    def get_records_by_cid(id): # 获取某个客户的所有跟进记录
        records = FollowUp.query.filter_by(cid=id).all()
        return records
    
    @staticmethod
    def get_records_by_uid(id): # 获取某个用户的所有跟进记录
        records = FollowUp.query.filter_by(uid=id).all()
        return records
    
    @staticmethod
    def get_record_by_sid(id): # 获取某个跟进记录的详细信息
        record = FollowUp.query.filter_by(sid=id).first()
        return record
    
    @staticmethod
    def update(id, date, cid, pid, content, result): # 更新某个跟进记录
        record = FollowUp.query.filter_by(sid=id).first()
        record.date = date
        record.cid = cid
        record.pid = pid
        record.content = content
        record.result = result
        db.session.commit()

    @staticmethod
    def delete(id): # 删除某个跟进记录
        record = FollowUp.query.filter_by(sid=id).first()
        db.session.delete(record)
        db.session.commit()

    @staticmethod
    def add(id, date, cid, pid, content, result): # 添加新的跟进记录
        newRecord = FollowUp()
        newRecord.date = date
        newRecord.cid = cid
        newRecord.uid = id
        newRecord.pid = pid
        newRecord.content = content
        newRecord.result = result
        db.session.add(newRecord)
        db.session.commit()