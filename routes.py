from flask import render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Booking, Venue, Transaction, bcrypt
from app import app
import uuid
import datetime
from sqlalchemy import case
from datetime import date

# Initialize Login Manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Home Page (Upcoming Events)
@app.route('/')
def home():
    sort_by = request.args.get('sort', 'date')

    sort_options = {
        "date": Booking.date.asc(),
        "time_slot": case(
            (Booking.time_slot == "Morning", 1),
            (Booking.time_slot == "Afternoon", 2),
            (Booking.time_slot == "Evening", 3),
            else_=4
        ),
        "venue": Venue.name.asc(),
        "agency": User.agency_name.asc()
    }
    sort_field = sort_options.get(sort_by, Booking.date.asc())

    # Get today's date
    today = date.today()

    # Show all bookings if "All" is selected, otherwise hide past bookings
    if sort_by == "all":
        events = (
            db.session.query(Booking)
            .join(Venue)
            .join(User, Booking.user_id == User.id)
            .filter(Booking.status == "Paid")
            .order_by(sort_field)
            .all()
        )
    else:
        events = (
            db.session.query(Booking)
            .join(Venue)
            .join(User, Booking.user_id == User.id)
            .filter(Booking.status == "Paid", Booking.date >= today)  # Hide past bookings
            .order_by(sort_field)
            .all()
        )

    venues = Venue.query.all()
    return render_template('home.html', events=events, venues=venues, today=today)

# Signup Route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        agency_name = request.form['agency_name']
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if User.query.filter_by(username=username).first():
            flash("Error: Username already exists.", "danger")
            return redirect(url_for('signup'))

        if password != confirm_password:
            flash("Error: Passwords do not match.", "danger")
            return redirect(url_for('signup'))

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(agency_name=agency_name, username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful!", "success")
        return redirect(url_for('login'))

    return render_template('signup.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            flash("Error: Invalid login credentials.", "danger")
            return redirect(url_for('login'))

        login_user(user)
        flash("Login successful.", "success")
        return redirect(url_for('dashboard'))

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logged out successfully.", "success")
    return redirect(url_for('login'))

# Dashboard Route
@app.route('/dashboard')
@login_required
def dashboard():
    sort_by = request.args.get('sort', 'date')

    sort_options = {
        "date": Booking.date.asc(),
        "artist": Booking.artist_name.asc(),
        "venue": Venue.name.asc(),
        "time_slot": case(
            (Booking.time_slot == "Morning", 1),
            (Booking.time_slot == "Afternoon", 2),
            (Booking.time_slot == "Evening", 3),
            else_=4
        ),
        "agency": User.agency_name.asc()
    }
    sort_field = sort_options.get(sort_by, Booking.date.asc())

    user_bookings = (
        db.session.query(Booking)
        .join(Venue)
        .join(User, Booking.user_id == User.id)
        .filter(Booking.user_id == current_user.id)
        .order_by(sort_field)
        .all()
    )

    venues = Venue.query.all()

    return render_template('dashboard.html', bookings=user_bookings, venues=venues,
                           agency_name=current_user.agency_name, username=current_user.username)

# Booking Route
@app.route('/book', methods=['POST'])
@login_required
def book():
    artist_name = request.form['artist_name']
    concert_title = request.form['concert_title']
    venue_name = request.form['venue']
    date_str = request.form['date']
    time_slot = request.form['time_slot']
    payment_method = request.form['payment_method']

    try:
        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        flash("Error: Invalid date format.", "danger")
        return redirect(url_for('dashboard'))

    today = datetime.date.today()
    if date_obj < today:
        flash("Error: You cannot book past dates!", "danger")
        return redirect(url_for('dashboard'))

    venue = Venue.query.filter_by(name=venue_name).first()
    if not venue:
        flash("Error: Invalid venue selection.", "danger")
        return redirect(url_for('dashboard'))

    price_mapping = {
        "Morning": venue.morning_price,
        "Afternoon": venue.afternoon_price,
        "Evening": venue.evening_price
    }
    expected_price = price_mapping.get(time_slot, 0)

    existing_booking = Booking.query.filter_by(venue_id=venue.id, date=date_obj, time_slot=time_slot, status="Paid").first()
    if existing_booking:
        flash(f"Error: {venue_name} is already booked for {time_slot} on {date_obj}.", "danger")
        return redirect(url_for('dashboard'))

    receipt_id = str(uuid.uuid4())[:8].upper()

    new_booking = Booking(
        user_id=current_user.id,
        venue_id=venue.id,
        artist_name=artist_name,
        concert_title=concert_title,
        date=date_obj,
        time_slot=time_slot,
        amount_expected=expected_price,
        status="Paid",
        receipt_id=receipt_id
    )
    db.session.add(new_booking)
    db.session.commit()

    new_transaction = Transaction(
        booking_id=new_booking.id,
        payment_method=payment_method,
        amount_paid=expected_price
    )
    db.session.add(new_transaction)
    db.session.commit()

    flash(f"Booking confirmed! Your receipt number is {receipt_id}.", "success")
    return redirect(url_for('dashboard'))

# Cancel Booking Route
@app.route('/cancel_booking/<int:booking_id>', methods=['POST'])
@login_required
def cancel_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if booking and booking.user_id == current_user.id:
        booking.status = "Cancelled"
        db.session.commit()
        flash("Booking has been cancelled.", "info")
    else:
        flash("Error: Booking not found or unauthorized.", "danger")
    return redirect(url_for('dashboard'))

# View Receipt Route
@app.route('/view_receipt/<int:booking_id>')
@login_required
def view_receipt(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking or booking.user_id != current_user.id:
        flash("Error: Unauthorized access.", "danger")
        return redirect(url_for('dashboard'))
    return render_template('receipt.html', booking=booking)

# Profile Page
@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

# ✅ New Venue Route
@app.route('/venues')
def venues():
    venue_list = Venue.query.all()
    return render_template('venue.html', venues=venue_list)
