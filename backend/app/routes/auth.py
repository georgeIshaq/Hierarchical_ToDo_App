# backend/app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime
from app import db
from app.models.user import User
from app.utils.validators import validate_password1, validate_email1, validate_username1


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate input formats
    is_valid, error_msg = validate_username1(data['username'])
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    is_valid, error_msg = validate_email1(data['email'])
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    is_valid, error_msg = validate_password1(data['password'])
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    # Check if username or email already exists
    if User.get_by_username(data['username']):
        return jsonify({'error': 'Username already taken'}), 409
    if User.get_by_email(data['email']):
        return jsonify({'error': 'Email already registered'}), 409

    # Create new user
    try:
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(user)
        db.session.commit()

        # Create access token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not all(field in data for field in ['username', 'password']):
        return jsonify({'error': 'Missing username or password'}), 400

    # Find user by username
    user = User.get_by_username(data['username'])
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401

    # Update last login time
    user.update_last_login()

    # Create access token
    access_token = create_access_token(identity=user.id)

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Invalidate the token by adding it to a blacklist (if implemented)
    jti = get_jwt()['jti']
    # Add the token to the blacklist (implementation depends on your setup)
    # For now, we'll just return success as the frontend will handle token removal
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200


@auth_bp.route('/validate-username', methods=['POST'])
def validate_username():
    """Check if username is available"""
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username is required'}), 400

    user_exists = User.get_by_username(username) is not None
    return jsonify({'available': not user_exists})


@auth_bp.route('/validate-email', methods=['POST'])
def validate_email():
    """Check if email is available"""
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    email_exists = User.get_by_email(email) is not None
    return jsonify({'available': not email_exists})
