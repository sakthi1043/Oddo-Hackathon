from flask import Blueprint, request, jsonify
from src.controller.auth_controller import signup_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    result, status_code = signup_user(data)
    return jsonify(result), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    result, status_code = login_user(data)
    return jsonify(result), status_code