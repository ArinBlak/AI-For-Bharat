import os
import sqlite3
import json
import boto3
from dotenv import load_dotenv

load_dotenv()

class StorageService:
    def __init__(self):
        # S3 Setup still exists for files if needed
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'ap-south-1')
        )
        self.bucket_name = os.getenv('S3_BUCKET_NAME')
        
        # Local SQLite Setup (No AWS needed for DB!)
        self.db_path = "yojana_setu.db"
        self._init_db()

    def _init_db(self):
        """Initializes the local SQLite database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id TEXT PRIMARY KEY,
                profile_json TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                role TEXT,
                content TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
        print(f"📦 Local Database Initialized at {self.db_path}")

    def get_user_sessions(self, user_id):
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT session_id, title, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC", (user_id,))
            rows = cursor.fetchall()
            conn.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print(e)
            return []

    def get_session_messages(self, session_id):
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
            rows = cursor.fetchall()
            conn.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print(e)
            return []

    def save_chat_message(self, session_id, user_id, title, role, content):
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("INSERT OR IGNORE INTO chat_sessions (session_id, user_id, title) VALUES (?, ?, ?)", (session_id, user_id, title))
            cursor.execute("UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?", (session_id,))
            cursor.execute("INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)", (session_id, role, content))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Chat save error: {e}")

    def upload_to_s3(self, file_content, file_name, content_type='audio/mpeg'):
        """Uploads audio/images to S3 for processing."""
        try:
            if not self.bucket_name:
                print("⚠️ AWS S3 not configured, skipping upload.")
                return None
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=file_name,
                Body=file_content,
                ContentType=content_type
            )
            return f"s3://{self.bucket_name}/{file_name}"
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            return None

    def get_user_profile(self, phone_number):
        """Retrieves user profile from local SQLite."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT profile_json FROM user_profiles WHERE user_id = ?", (phone_number,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return json.loads(row[0])
            return {}
        except Exception as e:
            print(f"!!! Database Read Error: {e}")
            return {}

    def save_user_profile(self, profile):
        """Saves/Updates user profile in local SQLite."""
        try:
            user_id = profile.get('user_id') or profile.get('phone')
            if not user_id:
                print("❌ Cannot save profile: No user_id/phone found.")
                return False
                
            profile['user_id'] = user_id
            profile_json = json.dumps(profile)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO user_profiles (user_id, profile_json) VALUES (?, ?)",
                (user_id, profile_json)
            )
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error saving user profile to SQLite: {e}")
            return False
