# backend/app/config.py
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///todo.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')  # TODO: Change for submission
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')  # TODO: Change for submission
