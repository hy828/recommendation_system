from flask import Flask
from flask_cors import CORS
from exts import db
from login import bp as login_bp
import config

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(config)
# db.init_app(app)

app.register_blueprint(login_bp)

@app.route('/', methods=["GET", "POST"])
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, request, jsonify

# app = Flask(__name__)

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')

#     # 进行登录验证，这里简单起见就直接判断用户名和密码是否正确
#     if username == 'admin' and password == 'password':
#         return jsonify({'message': 'Login successful'}), 200
#     else:
#         return jsonify({'message': 'Invalid username or password'}), 401

# if __name__ == '__main__':
#     app.run(debug=True)
