from flask import Flask
from flask_cors import CORS
from exts import db
from controller.personal_center import bp as personal_center_bp
from controller.user_management import bp as user_management_bp
from controller.customer_management import bp as customer_management_bp
from controller.follow_up_management import bp as follow_up_management_bp
from controller.data_visualization import bp as data_visualization_bp
from controller.customer_detail import bp as customer_detail_bp
import config

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(config)
db.init_app(app)

app.register_blueprint(personal_center_bp)
app.register_blueprint(user_management_bp)
app.register_blueprint(customer_management_bp)
app.register_blueprint(follow_up_management_bp)
app.register_blueprint(data_visualization_bp)
app.register_blueprint(customer_detail_bp)

@app.route('/', methods=["GET", "POST"])
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)