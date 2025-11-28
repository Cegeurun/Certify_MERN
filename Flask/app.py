from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate  # Import Flask-Migrate
from config import Config
from models import db, bcrypt

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize database and encryption
db.init_app(app)
bcrypt.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)  # This enables flask db commands

# Import routes (must be after app initialization)
from routes import *

if __name__ == '__main__':
    app.run(debug=True)
