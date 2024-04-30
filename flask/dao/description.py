from models import Description

class DescriptionDAO:
    @staticmethod
    def get_name(id):
        name = Description.query.filter_by(id=id).first().name
        return name
