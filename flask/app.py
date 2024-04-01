from flask import Flask
from flask_cors import CORS
from exts import db
from users import bp as users_bp
from permission import bp as permission_bp
from customerManagement import bp as customerManagement_bp
from customerService import bp as customerService_bp
from dataVisualization import bp as dataVisualization_bp
from customerDetail import bp as customerDetail_bp
import config

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(config)
db.init_app(app)

app.register_blueprint(users_bp)
app.register_blueprint(permission_bp)
app.register_blueprint(customerManagement_bp)
app.register_blueprint(customerService_bp)
app.register_blueprint(dataVisualization_bp)
app.register_blueprint(customerDetail_bp)

@app.route('/', methods=["GET", "POST"])
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)