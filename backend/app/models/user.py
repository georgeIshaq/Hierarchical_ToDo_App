from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    # Primary key for the User
    id = db.Column(db.Integer, primary_key=True)

    # Username of the User, must be unique and cannot be null
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)

    # Email of the User, must be unique and cannot be null
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    # Hashed password of the User, cannot be null
    password_hash = db.Column(db.String(256), nullable=False)

    # Timestamp when the User was created, defaults to current time
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Timestamp when the User last logged in, can be null
    last_login = db.Column(db.DateTime)

    # Relationship with TodoLists (commented out)
    # todo_lists = db.relationship('TodoList', backref='owner', lazy='dynamic',
    #                             cascade='all, delete-orphan')

    # Constructor to initialize a User object
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    # Method to set the password, hashes the password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check the password, compares the hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Class method to get a User by username
    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    # Class method to get a User by email
    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    # Method to update the last login timestamp
    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()

    # Method to convert the User object to a dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

    # Method to provide a string representation of the User object
    def __repr__(self):
        return f'<User {self.username}>'
