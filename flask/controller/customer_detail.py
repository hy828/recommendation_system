from flask import Blueprint, request, jsonify
from service.customer_detail import CustomerDetail

bp = Blueprint('customer_detail', __name__)

@bp.route('/customer_detail/query_details', methods=['GET'])
def query_details():
    id = int(request.args.get('query'))
    customer_data, records_list, rec_data = CustomerDetail.get_details(id)
    return jsonify({'details': customer_data, 'serviceRecords': records_list, 'recommend': rec_data}), 200