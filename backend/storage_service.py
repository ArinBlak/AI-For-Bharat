import boto3
import os
from dotenv import load_dotenv

load_dotenv()

class StorageService:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'ap-south-1')
        )
        self.dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'ap-south-1')
        )
        self.bucket_name = os.getenv('S3_BUCKET_NAME')
        self.table_name = os.getenv('DYNAMODB_TABLE_NAME', 'user_profiles')

    def upload_to_s3(self, file_content, file_name, content_type='audio/mpeg'):
        """
        Uploads audio/images to S3 for processing.
        """
        try:
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
        """
        Retrieves user profile from DynamoDB.
        """
        try:
            table = self.dynamodb.Table(self.table_name)
            # Fetching by user_id as partition key
            response = table.get_item(Key={'user_id': phone_number})
            return response.get('Item', {})
        except Exception as e:
            print(f"!!! DynamoDB Access Error: {e}")
            # Fallback: Return a default profile so the AI doesn't crash during hackathon demo
            return {"user_id": phone_number, "note": "Database fallback active"}

    def save_user_profile(self, profile):
        """
        Saves/Updates user profile in DynamoDB.
        """
        try:
            table = self.dynamodb.Table(self.table_name)
            # Ensure user_id is the primary key and phone_number is an attribute
            profile['user_id'] = profile.get('user_id') or profile.get('phone_number')
            table.put_item(Item=profile)
            return True
        except Exception as e:
            print(f"Error saving user profile: {e}")
            return False
