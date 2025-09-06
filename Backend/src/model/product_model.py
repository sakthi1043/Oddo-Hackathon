from src import db
from datetime import datetime
from sqlalchemy.orm import validates
from flask import current_app

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    condition = db.Column(db.String(50), nullable=False)  # New, Used, Refurbished
    year_of_manufacture = db.Column(db.Integer, nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    model = db.Column(db.String(100), nullable=True)
    dimensions = db.Column(db.String(100), nullable=True)  # "LxWxH format"
    weight = db.Column(db.Float, nullable=True)  # in kg
    material = db.Column(db.String(100), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    original_packaging = db.Column(db.Boolean, default=False)
    manual_included = db.Column(db.Boolean, default=False)
    working_condition_desc = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with product images
    images = db.relationship('ProductImage', backref='product', cascade='all, delete-orphan', lazy=True)
    
    @validates('price')
    def validate_price(self, key, price):
        if price <= 0:
            raise ValueError('Price must be greater than 0')
        return price
    
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        if quantity < 0:
            raise ValueError('Quantity cannot be negative')
        return quantity
    
    def to_dict(self):
        base_url = f"{current_app.config['PREFERRED_URL_SCHEME']}://{current_app.config['SERVER_NAME']}"
        
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'condition': self.condition,
            'year_of_manufacture': self.year_of_manufacture,
            'brand': self.brand,
            'model': self.model,
            'dimensions': self.dimensions,
            'weight': self.weight,
            'material': self.material,
            'color': self.color,
            'original_packaging': self.original_packaging,
            'manual_included': self.manual_included,
            'working_condition_desc': self.working_condition_desc,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'images': [image.to_dict() for image in self.images]
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        base_url = f"{current_app.config['PREFERRED_URL_SCHEME']}://{current_app.config['SERVER_NAME']}"
        
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': f"{base_url}/api/uploads/{self.image_url}",
            'filename': self.image_url,  # Keep original filename for reference
            'is_primary': self.is_primary,
            'created_at': self.created_at.isoformat()
        }