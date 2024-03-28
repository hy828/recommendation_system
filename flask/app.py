from flask import Flask
from flask_cors import CORS
from exts import db
from login import bp as login_bp
from permission import bp as permission_bp
from customerManagement import bp as customerManagement_bp
from customerService import bp as customerService_bp
import config

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(config)
db.init_app(app)

app.register_blueprint(login_bp)
app.register_blueprint(permission_bp)
app.register_blueprint(customerManagement_bp)
app.register_blueprint(customerService_bp)

@app.route('/', methods=["GET", "POST"])
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)