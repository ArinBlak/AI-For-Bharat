import boto3
import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

class VoiceService:
    def __init__(self):
        self.transcribe = boto3.client(
            'transcribe',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('TRANSCRIBE_REGION', 'ap-south-1')
        )
        self.polly = boto3.client(
            'polly',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('POLLY_REGION', 'ap-south-1')
        )
        self.s3_bucket = os.getenv('S3_BUCKET_NAME')

    def speech_to_text(self, s3_uri, language_code='hi-IN'):
        """
        Converts speech from S3 to text using Amazon Transcribe.
        Supports Hindi ('hi-IN'), Bengali ('bn-IN'), Tamil ('ta-IN'), etc.
        """
        job_name = f"transcription_job_{int(time.time())}"
        
        try:
            self.transcribe.start_transcription_job(
                TranscriptionJobName=job_name,
                Media={'MediaFileUri': s3_uri},
                MediaFormat='mp3', # Should be dynamically determined
                LanguageCode=language_code
            )

            while True:
                status = self.transcribe.get_transcription_job(TranscriptionJobName=job_name)
                job_status = status['TranscriptionJob']['TranscriptionJobStatus']
                
                if job_status in ['COMPLETED', 'FAILED']:
                    break
                print(f"Waiting for transcription... (Status: {job_status})")
                time.sleep(2)

            if job_status == 'COMPLETED':
                response = requests.get(status['TranscriptionJob']['Transcript']['TranscriptFileUri'])
                data = response.json()
                return data['results']['transcripts'][0]['transcript']
            else:
                return None
        except Exception as e:
            print(f"Error in Transcribe: {e}")
            return None

    def text_to_speech(self, text, language_code='hi-IN', voice_id='Aditi'):
        """
        Converts text back to speech using Amazon Polly.
        """
        try:
            response = self.polly.synthesize_speech(
                Text=text,
                OutputFormat='mp3',
                VoiceId=voice_id,
                LanguageCode=language_code,
                Engine='neural'
            )
            
            # For hackathon, we can return the audio stream or save to local file
            if "AudioStream" in response:
                return response['AudioStream'].read()
            return None
        except Exception as e:
            print(f"Error in Polly: {e}")
            return None
