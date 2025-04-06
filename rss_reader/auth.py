from typing import Optional
from rss_reader.db import connect
from flask_login import LoginManager, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

login_manager = LoginManager()
login_manager.login_view = 'app.get_login'

class User(UserMixin):
    def __init__(self, id: int, email: str, password_hash: str):
        self.id = id
        self.email = email
        self.password_hash = password_hash

    @staticmethod
    def get_by_email(email: str) -> Optional['User']:
        """Get a user by email"""
        db = connect()
        row = db.execute(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            [email]
        ).fetchone()
        if row is None:
            return None
        return User(row['id'], row['email'], row['password_hash'])

    @staticmethod
    def get_by_id(user_id: int) -> Optional['User']:
        """Get a user by ID"""
        db = connect()
        row = db.execute(
            "SELECT id, email, password_hash FROM users WHERE id = ?",
            [user_id]
        ).fetchone()
        if row is None:
            return None
        return User(row['id'], row['email'], row['password_hash'])

    @staticmethod
    def create(email: str, password: str) -> Optional['User']:
        """Create a new user"""
        db = connect()
        password_hash = generate_password_hash(password)
        try:
            cursor = db.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                [email, password_hash]
            )
            return User(cursor.lastrowid, email, password_hash)
        except sqlite3.IntegrityError:
            return None

    def check_password(self, password: str) -> bool:
        """Check if the given password matches the hash"""
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id: str) -> Optional[User]:
    if not user_id:
        return None
    return User.get_by_id(int(user_id))


__all__ = ['User', 'login_manager']
