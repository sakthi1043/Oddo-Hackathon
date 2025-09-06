import os
import uuid
from werkzeug.utils import secure_filename
from src.model.product_model import Product, ProductImage
from src import db
from flask import current_app, jsonify

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_product_images(files, product_id):
    images = []
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    # Create upload folder if it doesn't exist
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    for i, file in enumerate(files):
        if file and allowed_file(file.filename):
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            
            # Save file
            file_path = os.path.join(upload_folder, unique_filename)
            file.save(file_path)
            
            # Create image record
            image = ProductImage(
                product_id=product_id,
                image_url=unique_filename,
                is_primary=(i == 0)  # First image is primary
            )
            images.append(image)
    
    return images

def create_product(data, files):
    try:
        # Create product
        product = Product(
            title=data.get('title'),
            category=data.get('category'),
            description=data.get('description'),
            price=float(data.get('price', 0)),
            quantity=int(data.get('quantity', 1)),
            condition=data.get('condition'),
            year_of_manufacture=data.get('year_of_manufacture'),
            brand=data.get('brand'),
            model=data.get('model'),
            dimensions=data.get('dimensions'),
            weight=data.get('weight'),
            material=data.get('material'),
            color=data.get('color'),
            original_packaging=bool(data.get('original_packaging', False)),
            manual_included=bool(data.get('manual_included', False)),
            working_condition_desc=data.get('working_condition_desc')
        )
        
        db.session.add(product)
        db.session.flush()  # Get product ID without committing
        
        # Save images
        if files:
            image_files = files.getlist('images')
            images = save_product_images(image_files, product.id)
            db.session.add_all(images)
        
        db.session.commit()
        
        return {'message': 'Product created successfully', 'product': product.to_dict()}, 201
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def get_all_products():
    try:
        products = Product.query.all()
        return {'products': [product.to_dict() for product in products]}, 200
    except Exception as e:
        return {'error': str(e)}, 500

def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return {'product': product.to_dict()}, 200
    except Exception as e:
        return {'error': str(e)}, 404

def update_product(product_id, data, files):
    try:
        product = Product.query.get_or_404(product_id)
        
        # Update product fields
        product.title = data.get('title', product.title)
        product.category = data.get('category', product.category)
        product.description = data.get('description', product.description)
        product.price = float(data.get('price', product.price))
        product.quantity = int(data.get('quantity', product.quantity))
        product.condition = data.get('condition', product.condition)
        product.year_of_manufacture = data.get('year_of_manufacture', product.year_of_manufacture)
        product.brand = data.get('brand', product.brand)
        product.model = data.get('model', product.model)
        product.dimensions = data.get('dimensions', product.dimensions)
        product.weight = data.get('weight', product.weight)
        product.material = data.get('material', product.material)
        product.color = data.get('color', product.color)
        product.original_packaging = bool(data.get('original_packaging', product.original_packaging))
        product.manual_included = bool(data.get('manual_included', product.manual_included))
        product.working_condition_desc = data.get('working_condition_desc', product.working_condition_desc)
        
        # Add new images if provided
        if files:
            image_files = files.getlist('images')
            new_images = save_product_images(image_files, product.id)
            db.session.add_all(new_images)
        
        db.session.commit()
        
        return {'message': 'Product updated successfully', 'product': product.to_dict()}, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        # Delete associated images from filesystem
        upload_folder = current_app.config['UPLOAD_FOLDER']
        for image in product.images:
            image_path = os.path.join(upload_folder, image.image_url)
            if os.path.exists(image_path):
                os.remove(image_path)
        
        db.session.delete(product)
        db.session.commit()
        
        return {'message': 'Product deleted successfully'}, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_product_image(image_id):
    try:
        image = ProductImage.query.get_or_404(image_id)
        
        # Delete image from filesystem
        upload_folder = current_app.config['UPLOAD_FOLDER']
        image_path = os.path.join(upload_folder, image.image_url)
        if os.path.exists(image_path):
            os.remove(image_path)
        
        db.session.delete(image)
        db.session.commit()
        
        return {'message': 'Image deleted successfully'}, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def set_primary_image(product_id, image_id):
    try:
        product = Product.query.get_or_404(product_id)
        new_primary = ProductImage.query.get_or_404(image_id)
        
        if new_primary.product_id != product.id:
            return {'error': 'Image does not belong to this product'}, 400
        
        # Remove primary status from all images
        ProductImage.query.filter_by(product_id=product_id).update({'is_primary': False})
        
        # Set new primary image
        new_primary.is_primary = True
        db.session.commit()
        
        return {'message': 'Primary image set successfully'}, 200
        
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500