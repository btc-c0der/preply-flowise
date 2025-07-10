import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///portal.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLOWISE_API_URL = os.environ.get('FLOWISE_API_URL') or 'http://localhost:3000'
    FLOWISE_API_KEY = os.environ.get('FLOWISE_API_KEY')
