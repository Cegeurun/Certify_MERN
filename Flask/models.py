from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

# Initialize database and encryption
db = SQLAlchemy()
bcrypt = Bcrypt()

# User Table
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    agency_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationship with Booking
    bookings = db.relationship('Booking', backref='user', lazy=True)

# Venue Table (New)
class Venue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    morning_price = db.Column(db.Float, nullable=False)
    afternoon_price = db.Column(db.Float, nullable=False)
    evening_price = db.Column(db.Float, nullable=False)
    
    # Relationship with Booking
    bookings = db.relationship('Booking', backref='venue', lazy=True)

# Booking Table (Updated)
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.id'), nullable=False)
    artist_name = db.Column(db.String(100), nullable=False)
    concert_title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(50), nullable=False)
    amount_expected = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="Paid")
    receipt_id = db.Column(db.String(20), unique=True, nullable=False)
    
    # Relationship with Transaction
    transaction = db.relationship('Transaction', uselist=False, backref='booking')

# Transaction Table (New)
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False, unique=True)
    payment_method = db.Column(db.String(50), nullable=False)  
    amount_paid = db.Column(db.Float, nullable=False)  
    payment_date = db.Column(db.DateTime, default=db.func.current_timestamp())
