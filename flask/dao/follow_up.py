from models import FollowUp
from exts import db

class FollowUpDAO:
    @staticmethod
    def get_records_by_cid(id):
        records = FollowUp.query.filter_by(cid=id).all()
        return records
    
    @staticmethod
    def get_records_by_uid(id):
        records = FollowUp.query.filter_by(uid=id).all()
        return records
    
    @staticmethod
    def get_record_by_sid(id):
        record = FollowUp.query.filter_by(sid=id).first()
        return record
    
    @staticmethod
    def update(id, date, cid, pid, content, result):
        record = FollowUp.query.filter_by(sid=id).first()
        record.date = date
        record.cid = cid
        record.pid = pid
        record.content = content
        record.result = result
        db.session.commit()

    @staticmethod
    def delete(id):
        record = FollowUp.query.filter_by(sid=id).first()
        db.session.delete(record)
        db.session.commit()

    @staticmethod
    def add(id, date, cid, pid, content, result):
        newRecord = FollowUp()
        newRecord.date = date
        newRecord.cid = cid
        newRecord.uid = id
        newRecord.pid = pid
        newRecord.content = content
        newRecord.result = result
        db.session.add(newRecord)
        db.session.commit()