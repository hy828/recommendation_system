# jwt_secret_key = "gumi"

DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'
PASSWORD = 'qwertyuiop123'
HOST = '127.0.0.1'
PORT = '3306'
DATABASE = 'recommendation_system'
SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT,
                                                                       DATABASE)

# DEBUG = True