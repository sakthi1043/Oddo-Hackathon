from src.model.user_model import User
from src import db
from flask import jsonify
from flask_jwt_extended import create_access_token
import re

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    return True, "Password is valid"

def validate_username(username):
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        return False, "Username can only contain letters, numbers, and underscores"
    return True, "Username is valid"

def signup_user(data):
    # Validate required fields
    required_fields = ['display_name', 'email', 'username', 'password', 'confirm_password']
    for field in required_fields:
        if field not in data or not data[field]:
            return {'error': f'{field} is required'}, 400
    
    # Check if passwords match
    if data['password'] != data['confirm_password']:
        return {'error': 'Passwords do not match'}, 400
    
    # Validate password strength
    is_valid, message = validate_password(data['password'])
    if not is_valid:
        return {'error': message}, 400
    
    # Validate username format
    is_valid, message = validate_username(data['username'])
    if not is_valid:
        return {'error': message}, 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return {'error': 'Email already registered'}, 409
    
    if User.query.filter_by(username=data['username']).first():
        return {'error': 'Username already taken'}, 409
    
    # Create new user
    try:
        new_user = User(
            display_name=data['display_name'],
            email=data['email'],
            username=data['username']
        )
        new_user.password = data['password']
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=new_user.id)
        
        return {
            'message': 'User created successfully',
            'user': new_user.to_dict(),
            'access_token': access_token
        }, 201
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def login_user(data):
    # Validate required fields
    if 'identifier' not in data or not data['identifier']:
        return {'error': 'Email or username is required'}, 400
    if 'password' not in data or not data['password']:
        return {'error': 'Password is required'}, 400
    
    # Find user by email or username
    user = User.query.filter(
        (User.email == data['identifier']) | (User.username == data['identifier'])
    ).first()
    
    if not user:
        return {'error': 'Invalid credentials'}, 401
    
    # Verify password
    if not user.verify_password(data['password']):
        return {'error': 'Invalid credentials'}, 401
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return {
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }, 200