import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

jwt_secret_key = os.getenv('JWT_SECRET_KEY')

DIALECT = os.getenv('DIALECT')
DRIVER = os.getenv('DRIVER')
USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
HOST = os.getenv('HOST')
PORT = os.getenv('PORT')
DATABASE = os.getenv('DATABASE')

SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
    DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
)

# DEBUG = True