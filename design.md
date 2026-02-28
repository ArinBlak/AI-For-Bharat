# Yojana-Setu: System Design Document

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Layer    │    │   Service Layer  │    │   Data Layer    │
│                 │    │                  │    │                 │
│ WhatsApp Bot    │◄──►│ AWS Lambda       │◄──►│ DynamoDB        │
│ IVR System      │    │ (Orchestrator)   │    │ S3 Storage      │
│ Web Dashboard   │    │                  │    │ Knowledge Base  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   AI Services    │
                    │                  │
                    │ Amazon Bedrock   │
                    │ Amazon Q         │
                    │ Transcribe       │
                    │ Polly           │
                    └──────────────────┘
```

## Core Components Design

### 1. The "Brain" - Central Orchestrator

#### AWS Lambda Function (Python)
**File**: `backend/agent.py`

**Responsibilities**:
- Route incoming requests from different channels
- Orchestrate AI service calls
- Maintain conversation context
- Handle error scenarios and fallbacks

**Key Functions**:
```python
def handle_whatsapp_message(event):
    # Process WhatsApp webhook
    
def handle_voice_input(audio_url):
    # Transcribe → Understand → Respond
    
def handle_document_upload(image_url):
    # Vision processing → Validation → Storage
```

#### Amazon Bedrock Integration
**Model**: Claude 3.5 Sonnet

**Prompt Engineering Strategy**:
```
System: You are a government scheme advisor for rural India.
Context: User speaks Hindi/English mix, may be illiterate.
Task: Understand intent, suggest schemes, guide application.
Tools: check_eligibility, scan_document, create_application
```

**Function Calling Schema**:
```json
{
  "check_eligibility": {
    "description": "Check if user qualifies for a scheme",
    "parameters": {
      "scheme_name": "string",
      "user_profile": "object"
    }
  },
  "scan_document": {
    "description": "Extract data from uploaded document",
    "parameters": {
      "document_type": "string",
      "image_url": "string"
    }
  }
}
```

### 2. Knowledge Management System

#### Amazon Q Business Setup
**Knowledge Base Content**:
- 100+ Government scheme PDFs
- Eligibility criteria documents
- Application procedures
- Required documents list

**Indexing Strategy**:
```
Scheme Documents/
├── Housing/
│   ├── PM_Awas_Yojana.pdf
│   └── State_Housing_Schemes.pdf
├── Agriculture/
│   ├── PM_Fasal_Bima.pdf
│   └── Kisan_Credit_Card.pdf
└── Healthcare/
    ├── Ayushman_Bharat.pdf
    └── State_Health_Insurance.pdf
```

**Query Optimization**:
- Semantic search for scheme matching
- Context-aware retrieval
- Multi-language query support

### 3. Multi-Channel Interface Design

#### Channel 1: WhatsApp Bot
**Technology**: WhatsApp Business API (via Twilio for hackathon)

**Message Flow**:
```
User Voice Note → Webhook → Lambda → Transcribe → Bedrock → Response
User Image → Webhook → Lambda → Bedrock Vision → Validation → Response
```

**UI/UX Considerations**:
- Familiar WhatsApp interface
- Voice-first interaction
- Quick reply buttons for common actions
- Rich media support (images, documents)

#### Channel 2: IVR System
**Technology**: Amazon Connect

**Call Flow Design (Inbound & Outbound)**:
```
Inbound: User calls → Connect → AI processes → Voice Response
Outbound: User clicks "Call" on Web → API → Connect → AI initiates call → User answers
```

**Voice Processing Pipeline**:
```
Audio Input → Transcribe → Intent Recognition → Knowledge Retrieval → Response Generation → Polly → Audio Output
```

**New: Outbound Calling (Click-to-Call)**:
1. **Frontend**: User provides mobile number and clicks "Call".
2. **Backend**: Validates number and calls AWS Connect `StartOutboundVoiceContact`.
3. **Telephony**: User's phone rings. On pickup, Connect executes the "Outbound Flow".
4. **AI Handover**: Once answered, the flow hands control to the Bedrock Orchestrator.

#### Channel 3: Web Dashboard (For CSC Agents)
**Technology**: Next.js + React

**Features**:
- Assisted application mode
- Bulk application processing
- Analytics dashboard
- Document verification interface

### 4. Document Processing System

#### Amazon Bedrock Vision Integration
**Supported Documents**:
- Aadhar Card
- Ration Card
- Land Records
- Income Certificate
- Bank Passbook

**Processing Pipeline**:
```python
def process_document(image_url, doc_type):
    # 1. Quality Check
    quality_score = check_image_quality(image_url)
    if quality_score < 0.7:
        return "Please retake photo in better light"
    
    # 2. OCR Extraction
    extracted_data = bedrock_vision_ocr(image_url, doc_type)
    
    # 3. Validation
    is_valid = validate_document_data(extracted_data, doc_type)
    
    # 4. Storage
    if is_valid:
        store_document_data(extracted_data)
        return "Document verified successfully"
    else:
        return "Document appears invalid, please check"
```

**Quality Checks**:
- Blur detection
- Brightness/contrast validation
- Text readability assessment
- Document completeness check

### 5. Data Architecture

#### DynamoDB Table Design

**Users Table**:
```json
{
  "phone_number": "string (PK)",
  "name": "string",
  "language": "string",
  "state": "string",
  "profile_data": {
    "age": "number",
    "income": "number",
    "land_ownership": "boolean",
    "family_size": "number"
  },
  "created_at": "timestamp",
  "last_interaction": "timestamp"
}
```

**Applications Table**:
```json
{
  "application_id": "string (PK)",
  "user_phone": "string (GSI)",
  "scheme_name": "string",
  "status": "string", // draft, submitted, approved, rejected
  "documents": ["array of document objects"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Conversations Table**:
```json
{
  "conversation_id": "string (PK)",
  "user_phone": "string",
  "messages": ["array of message objects"],
  "context": "object", // conversation state
  "ttl": "number" // auto-expire after 24 hours
}
```

#### S3 Storage Structure
```
yojana-setu-documents/
├── user-uploads/
│   ├── {phone_number}/
│   │   ├── aadhar/
│   │   ├── income_cert/
│   │   └── land_records/
├── processed-documents/
│   └── {application_id}/
└── scheme-pdfs/
    └── knowledge-base/
```

## Integration Patterns

### 1. Event-Driven Architecture
```
WhatsApp Webhook → API Gateway → Lambda → EventBridge → Processing Lambda
IVR Call → Connect → Lambda → EventBridge → Processing Lambda
```

### 2. Async Processing Pattern
```python
# For heavy operations like document processing
def handle_document_async(image_url):
    # Send to SQS for async processing
    sqs.send_message(
        QueueUrl=DOCUMENT_QUEUE,
        MessageBody=json.dumps({
            'image_url': image_url,
            'user_phone': user_phone,
            'timestamp': datetime.now().isoformat()
        })
    )
    return "Document received, processing..."
```

### 3. Circuit Breaker Pattern
```python
# For external API calls
@circuit_breaker(failure_threshold=5, timeout=30)
def call_bedrock_api(prompt):
    try:
        response = bedrock.converse(prompt)
        return response
    except Exception as e:
        # Fallback to cached response or simple rule-based logic
        return fallback_response(prompt)
```

## User Experience Design

### Conversation Flow Design

#### Discovery Flow
```
AI: "Namaste! Main aapki madad kar sakta hun. Aap kya problem face kar rahe hain?"
User: "Mera ghar toot gaya hai" (My house collapsed)
AI: "Samjha. PM Awas Yojana ke through aapko ghar banane ke liye paisa mil sakta hai. Kya aap eligible hain check karte hain?"
User: "Haan" (Yes)
AI: "Aapki monthly income kitni hai?"
```

#### Document Collection Flow
```
AI: "Aadhar card ki photo bhejiye"
User: [Uploads blurry photo]
AI: "Photo thoda blur hai. Light mein clear photo leke bhejiye"
User: [Uploads clear photo]
AI: "Perfect! Aadhar verify ho gaya. Ab income certificate chahiye"
```

#### Application Completion Flow
```
AI: "Sab documents complete hain. Application submit kar dun?"
User: "Haan"
AI: "Application submit ho gayi. Reference number: #889. SMS aayega updates ke liye"
```

### Error Handling Design

#### Graceful Degradation
```python
def handle_transcription_failure(audio_url):
    # Try primary transcription
    try:
        text = transcribe_with_bedrock(audio_url)
    except:
        # Fallback to basic transcription
        try:
            text = transcribe_with_whisper(audio_url)
        except:
            # Ultimate fallback
            return "Audio samjh nahi aaya. Text mein type kar sakte hain?"
```

#### Context Recovery
```python
def recover_conversation_context(user_phone):
    # Get last 5 messages from DynamoDB
    recent_messages = get_recent_messages(user_phone, limit=5)
    
    # Reconstruct context
    context = {
        'current_scheme': extract_scheme_from_messages(recent_messages),
        'collected_documents': extract_documents(recent_messages),
        'user_profile': get_user_profile(user_phone)
    }
    return context
```

## Security and Privacy Design

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: IAM roles with least privilege
- **Data Retention**: Auto-delete personal data after 90 days
- **Audit Logging**: All interactions logged for compliance

### Privacy by Design
- **Minimal Data Collection**: Only collect necessary information
- **User Consent**: Explicit consent for data processing
- **Data Portability**: Users can export their data
- **Right to Deletion**: Users can delete their account

## Performance and Scalability Design

### Caching Strategy
```python
# Redis for conversation context
def get_conversation_context(user_phone):
    cached = redis.get(f"context:{user_phone}")
    if cached:
        return json.loads(cached)
    
    # Fetch from DynamoDB if not cached
    context = dynamodb.get_item(Key={'phone': user_phone})
    redis.setex(f"context:{user_phone}", 3600, json.dumps(context))
    return context
```

### Auto-Scaling Configuration
```yaml
# Lambda concurrency limits
ReservedConcurrency: 100
ProvisionedConcurrency: 10

# DynamoDB auto-scaling
ReadCapacityUnits: 5-100 (auto-scale)
WriteCapacityUnits: 5-100 (auto-scale)
```

### Cost Optimization
- **Bedrock**: Use on-demand pricing, optimize prompt length
- **Transcribe**: Batch processing for non-real-time requests
- **S3**: Intelligent tiering for document storage
- **Lambda**: Right-size memory allocation based on usage patterns

## Monitoring and Observability

### Key Metrics
- **Response Time**: P95 < 3 seconds
- **Success Rate**: > 95% successful interactions
- **User Satisfaction**: Track completion rates
- **Cost per Transaction**: Monitor AWS spend

### Alerting Strategy
```python
# CloudWatch alarms
- Lambda error rate > 5%
- DynamoDB throttling events
- Bedrock API failures
- High response latency (> 5 seconds)
```

### Logging Design
```python
import structlog

logger = structlog.get_logger()

def log_interaction(user_phone, intent, response_time):
    logger.info(
        "user_interaction",
        user_phone=user_phone,
        intent=intent,
        response_time_ms=response_time,
        timestamp=datetime.now().isoformat()
    )
```

## Low-Cost Implementation Architecture

### Cost-Optimized System Design
This section outlines how to implement Yojana-Setu using open-source and low-cost alternatives while maintaining production-quality standards.

### Alternative Architecture Stack

#### Core Infrastructure
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Layer    │    │   Service Layer  │    │   Data Layer    │
│                 │    │                  │    │                 │
│ WhatsApp Cloud  │◄──►│ Railway/Vercel   │◄──►│ Supabase        │
│ Twilio IVR      │    │ FastAPI/Express  │    │ Cloudinary      │
│ Next.js Web     │    │                  │    │ FAISS Vector DB │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   AI Services    │
                    │                  │
                    │ Ollama + Llama3  │
                    │ Whisper (Local)  │
                    │ TesseractOCR     │
                    │ gTTS/Coqui TTS   │
                    └──────────────────┘
```

### Component-wise Low-Cost Design

#### 1. AI Services Layer (Open Source)

**Local LLM Setup with Ollama**
```python
# backend/llm_service.py
import ollama

class LocalLLMService:
    def __init__(self):
        # Pull Llama 3 model (free)
        ollama.pull('llama3:8b')
    
    def generate_response(self, prompt, context):
        response = ollama.chat(
            model='llama3:8b',
            messages=[
                {'role': 'system', 'content': 'You are a government scheme advisor for rural India.'},
                {'role': 'user', 'content': f"{context}\n\nUser: {prompt}"}
            ]
        )
        return response['message']['content']
```

**Voice Processing with Whisper**
```python
# backend/voice_service.py
import whisper
import gtts
import io

class VoiceService:
    def __init__(self):
        # Load Whisper model (free, runs locally)
        self.whisper_model = whisper.load_model("base")
    
    def speech_to_text(self, audio_file):
        result = self.whisper_model.transcribe(audio_file)
        return result["text"]
    
    def text_to_speech(self, text, lang='hi'):
        tts = gtts.gTTS(text=text, lang=lang)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        return audio_buffer.getvalue()
```

**Document OCR with TesseractOCR**
```python
# backend/ocr_service.py
import pytesseract
from PIL import Image
import cv2

class DocumentOCR:
    def __init__(self):
        # Configure Tesseract for Hindi + English
        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
    
    def extract_text(self, image_path):
        # Preprocess image for better OCR
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Extract text in Hindi and English
        text = pytesseract.image_to_string(
            gray, 
            lang='hin+eng',
            config='--oem 3 --psm 6'
        )
        return text
    
    def validate_document(self, text, doc_type):
        # Simple validation logic
        if doc_type == 'aadhar':
            return len(text.replace(' ', '')) >= 12
        return True
```

#### 2. Knowledge Base with FAISS

**Vector Database Setup**
```python
# backend/knowledge_base.py
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class LocalKnowledgeBase:
    def __init__(self):
        # Use free sentence transformer model
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = faiss.IndexFlatIP(384)  # 384 is embedding dimension
        self.documents = []
    
    def add_documents(self, docs):
        # Encode documents and add to FAISS index
        embeddings = self.encoder.encode(docs)
        self.index.add(embeddings.astype('float32'))
        self.documents.extend(docs)
    
    def search(self, query, k=5):
        query_embedding = self.encoder.encode([query])
        scores, indices = self.index.search(query_embedding.astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            results.append({
                'document': self.documents[idx],
                'score': scores[0][i]
            })
        return results
```

#### 3. Backend with FastAPI (Free)

**Main Application**
```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Yojana-Setu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/whatsapp/webhook")
async def whatsapp_webhook(message: dict):
    # Process WhatsApp message
    response = await process_message(message)
    return response

@app.post("/voice/process")
async def process_voice(audio: UploadFile = File(...)):
    # Process voice input
    text = voice_service.speech_to_text(audio.file)
    response = llm_service.generate_response(text, context="")
    audio_response = voice_service.text_to_speech(response)
    return {"text": response, "audio": audio_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 4. Database with Supabase (Free Tier)

**Database Schema**
```sql
-- Users table
CREATE TABLE users (
    phone_number VARCHAR(15) PRIMARY KEY,
    name VARCHAR(100),
    language VARCHAR(10) DEFAULT 'hi',
    state VARCHAR(50),
    profile_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_phone VARCHAR(15) REFERENCES users(phone_number),
    scheme_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    documents JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table (with TTL)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_phone VARCHAR(15),
    messages JSONB,
    context JSONB,
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);
```

**Supabase Client Setup**
```python
# backend/database.py
from supabase import create_client, Client
import os

class DatabaseService:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_ANON_KEY")
        self.supabase: Client = create_client(url, key)
    
    def create_user(self, phone, name, language="hi"):
        data = {
            "phone_number": phone,
            "name": name,
            "language": language
        }
        result = self.supabase.table("users").insert(data).execute()
        return result.data
    
    def get_user_applications(self, phone):
        result = self.supabase.table("applications")\
            .select("*")\
            .eq("user_phone", phone)\
            .execute()
        return result.data
```

#### 5. Frontend with Next.js (Free)

**WhatsApp Simulator Component**
```tsx
// components/WhatsAppSimulator.tsx
import { useState } from 'react';

export default function WhatsAppSimulator() {
    const [messages, setMessages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    const sendVoiceMessage = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        const response = await fetch('/api/voice/process', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        setMessages(prev => [...prev, 
            { type: 'user', content: 'Voice message', audio: audioBlob },
            { type: 'ai', content: result.text, audio: result.audio }
        ]);
    };

    return (
        <div className="max-w-md mx-auto bg-green-50 h-screen">
            {/* WhatsApp-like header */}
            <div className="bg-green-600 text-white p-4">
                <h1>Yojana-Setu</h1>
                <p className="text-sm">Government Scheme Assistant</p>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${
                            msg.type === 'user' ? 'bg-green-500 text-white' : 'bg-white'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Input area */}
            <div className="p-4 bg-gray-100">
                <VoiceRecorder onSend={sendVoiceMessage} />
            </div>
        </div>
    );
}
```

#### 6. Deployment with Railway (Free Tier)

**railway.toml**
```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"

[[services]]
name = "backend"
source = "./backend"

[[services]]
name = "frontend"
source = "./frontend"
```

**Docker Configuration**
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-hin \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cost Monitoring and Optimization

#### Resource Usage Tracking
```python
# backend/monitoring.py
import psutil
import time
from functools import wraps

def monitor_resources(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = psutil.virtual_memory().used
        
        result = func(*args, **kwargs)
        
        end_time = time.time()
        end_memory = psutil.virtual_memory().used
        
        # Log resource usage
        print(f"Function: {func.__name__}")
        print(f"Time: {end_time - start_time:.2f}s")
        print(f"Memory: {(end_memory - start_memory) / 1024 / 1024:.2f}MB")
        
        return result
    return wrapper
```

#### Caching Strategy
```python
# backend/cache.py
import redis
import json
from functools import wraps

# Use Redis free tier or in-memory cache
cache = redis.Redis(host='localhost', port=6379, db=0)

def cache_response(expiry=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached = cache.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.setex(cache_key, expiry, json.dumps(result))
            return result
        return wrapper
    return decorator
```

### Scaling Strategy

#### Horizontal Scaling with Load Balancer
```python
# Multiple Railway instances behind load balancer
# Auto-scale based on CPU/memory usage
# Use Railway's built-in metrics for monitoring
```

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_applications_user ON applications(user_phone);
CREATE INDEX idx_conversations_phone ON conversations(user_phone);

-- Partition large tables
CREATE TABLE conversations_2024 PARTITION OF conversations
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

This low-cost implementation provides the same core functionality as the AWS-based solution while keeping costs minimal, making it accessible for startups and government pilots with limited budgets.

## Deployment Architecture

### Environment Strategy
- **Dev**: Single region, minimal resources
- **Staging**: Production-like, limited scale
- **Production**: Multi-AZ, auto-scaling enabled

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
1. Code commit → GitHub
2. Run tests (pytest, jest)
3. Build Docker images
4. Deploy to staging
5. Run integration tests
6. Deploy to production (with approval)
```

### Infrastructure as Code
```python
# AWS CDK stack
class YojanaSetu(Stack):
    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)
        
        # Lambda functions
        self.orchestrator = Function(...)
        
        # DynamoDB tables
        self.users_table = Table(...)
        
        # API Gateway
        self.api = RestApi(...)
```

This design provides a comprehensive foundation for building Yojana-Setu as a scalable, secure, and user-friendly AI-powered government scheme assistant.