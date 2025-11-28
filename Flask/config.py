import os

class Config:
    SECRET_KEY = 'your_secret_key'  # Change this to a strong key
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
