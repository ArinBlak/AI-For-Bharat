import os
import json
import boto3
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class StorageService:
    def __init__(self):
        # AWS DynamoDB Setup
        self.dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'ap-south-1')
        )
        
        # Table labels from .env or defaults
        self.user_table_name = os.getenv('DYNAMODB_TABLE_NAME', 'user_profiles')
        self.sessions_table_name = 'chat_sessions'
        self.messages_table_name = 'chat_messages'
        
        # Attach tables
        self.user_table = self.dynamodb.Table(self.user_table_name)
        self.sessions_table = self.dynamodb.Table(self.sessions_table_name)
        self.messages_table = self.dynamodb.Table(self.messages_table_name)
        
        print(f"📦 Cloud Storage Service Initialized (DynamoDB: {self.user_table_name})")

    def get_user_sessions(self, user_id):
        """Retrieves all chat sessions for a specific user from DynamoDB."""
        try:
            # Query the sessions table where user_id is the partition key (requires GSI or scan if user_id is not PK)
            # Assuming we use a GSI on user_id for sessions table
            # For simplicity, if user_id is not the primary key, we might need to scan or use a GSI.
            # Let's assume user_id is an attribute and we query by it.
            # In a real app, you'd add a GSI on 'user_id' in chat_sessions.
            from boto3.dynamodb.conditions import Key
            
            # Using Scan for now if GSI isn't confirmed, but Query is better if PK is user_id
            response = self.sessions_table.scan(
                FilterExpression=Key('user_id').eq(user_id)
            )
            items = response.get('Items', [])
            
            # Sort by updated_at descending
            items.sort(key=lambda x: x.get('updated_at', ''), reverse=True)
            return items
        except Exception as e:
            print(f"Error fetching user sessions: {e}")
            return []

    def get_session_messages(self, session_id):
        """Retrieves all messages for a specific session."""
        try:
            from boto3.dynamodb.conditions import Key
            response = self.messages_table.query(
                KeyConditionExpression=Key('session_id').eq(session_id)
            )
            items = response.get('Items', [])
            # Sort by created_at ascending (Query usually returns sorted by SK if it's there)
            items.sort(key=lambda x: x.get('created_at', ''))
            return [{"role": item["role"], "content": item["content"]} for item in items]
        except Exception as e:
            print(f"Error fetching session messages: {e}")
            return []

    def save_chat_message(self, session_id, user_id, title, role, content):
        """Saves a chat message and updates session metadata in DynamoDB."""
        try:
            now = datetime.now().isoformat()
            
            # 1. Update/Put Session
            self.sessions_table.put_item(
                Item={
                    'session_id': session_id,
                    'user_id': user_id,
                    'title': title,
                    'updated_at': now
                }
            )
            
            # 2. Add Message
            message_id = f"{session_id}_{int(time.time() * 1000)}"
            self.messages_table.put_item(
                Item={
                    'session_id': session_id,
                    'created_at': now,
                    'role': role,
                    'content': content,
                    'message_id': message_id
                }
            )
        except Exception as e:
            print(f"Chat save error (DynamoDB): {e}")

    def get_user_profile(self, phone_number):
        """Retrieves user profile from DynamoDB."""
        try:
            response = self.user_table.get_item(Key={'user_id': phone_number})
            item = response.get('Item')
            if item:
                # DynamoDB might store as attributes directly or as JSON string
                # Our previous save_user_profile saved the whole dict
                return item
            return {}
        except Exception as e:
            print(f"!!! DynamoDB Read Error: {e}")
            return {}

    def save_user_profile(self, profile):
        """Saves/Updates user profile in DynamoDB."""
        try:
            user_id = profile.get('user_id') or profile.get('phone')
            if not user_id:
                print("❌ Cannot save profile: No user_id/phone found.")
                return False
                
            profile['user_id'] = user_id
            # Clean up empty strings if DynamoDB version is old (newer allows them)
            # But let's keep it simple
            
            self.user_table.put_item(Item=profile)
            return True
        except Exception as e:
            print(f"Error saving user profile to DynamoDB: {e}")
            return False

    def upload_to_s3(self, file_content, file_name, content_type='audio/mpeg'):
        """Uploads audio/images to S3 for processing (unchanged)."""
        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                region_name=os.getenv('AWS_REGION', 'ap-south-1')
            )
            bucket = os.getenv('S3_BUCKET_NAME')
            if not bucket:
                return None
            s3_client.put_object(
                Bucket=bucket,
                Key=file_name,
                Body=file_content,
                ContentType=content_type
            )
            return f"s3://{bucket}/{file_name}"
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            return None
