from flask import Blueprint, request, send_from_directory, current_app
from src.controller.product_controller import (
    create_product, get_all_products, get_product, 
    update_product, delete_product, delete_product_image,
    set_primary_image
)

product_bp = Blueprint('products', __name__)

@product_bp.route('/products', methods=['POST'])
def add_product():
    data = request.form.to_dict()
    files = request.files
    
    result, status_code = create_product(data, files)
    return result, status_code

@product_bp.route('/products', methods=['GET'])
def get_products():
    result, status_code = get_all_products()
    return result, status_code

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_single_product(product_id):
    result, status_code = get_product(product_id)
    return result, status_code

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_single_product(product_id):
    data = request.form.to_dict()
    files = request.files
    
    result, status_code = update_product(product_id, data, files)
    return result, status_code

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_single_product(product_id):
    result, status_code = delete_product(product_id)
    return result, status_code

@product_bp.route('/products/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    result, status_code = delete_product_image(image_id)
    return result, status_code

@product_bp.route('/products/<int:product_id>/primary-image/<int:image_id>', methods=['PUT'])
def set_primary_image_route(product_id, image_id):
    result, status_code = set_primary_image(product_id, image_id)
    return result, status_code

@product_bp.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)