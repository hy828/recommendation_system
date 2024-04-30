from flask import Blueprint, request, jsonify
from service.customer import Customer

bp = Blueprint('customer_management', __name__)

@bp.route('/customer_management/query_all_customers', methods=['GET'])
def query_all_customers():
    customers_list = Customer.get_all_customers()
    return jsonify({'customers': customers_list}), 200

@bp.route('/customer_management/advanced_search', methods=['GET'])
def advanced_search():
    query = request.args.get('query')
    customers_list = Customer.advanced_search(query)
    return jsonify({'customers': customers_list}), 200
