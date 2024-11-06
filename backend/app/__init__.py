from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    # Create Flask application instance
    app = Flask(__name__)
    
    # Load configuration from the specified class
    app.config.from_object(config_class)

    # Initialize extensions with the app instance
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints (we'll create these later)
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Create database tables within the application context
    with app.app_context():
        db.create_all()

    return app