# Implementation Plan: Yojana-Setu (Scheme-Bridge)
## *The Voice-First AI Caseworker for Rural India*

# 🎯 Goal Description
Build a "Phygital" (Physical + Digital) AI agent that helps rural citizens apply for government schemes using the technology they already have: **WhatsApp (Tier 1)** and **Feature Phones (Tier 2/3)**.
The goal is to win the "AI for Bharat" hackathon by demonstrating **Technical Excellence** (deep AWS integration) and **Social Impact**.

## 🏗️ System Architecture & Tech Stack

### 1. The "Brain" (Core Logic)
*   **Orchestrator**: **AWS Lambda** (Python). Acts as the central controller.
*   **Reasoning Engine**: **Amazon Bedrock** (Claude 3.5 Sonnet).
    *   *Role*: Understands mixed-language intent ("Mujhe ghar banana hai" -> `intent: housing_loan`).
    *   *Role*: Decides which tool to call (`check_eligibility`, `scan_document`).
*   **Knowledge Base**: **Amazon Q Business** (or Bedrock Knowledge Base).
    *   *Content*: Index of 10+ PDF Schemes (PM Awas Yojana, Ayushman Bharat).
    *   *Role*: RAG (Retrieval Augmented Generation) to answer specific questions accurately.

### 2. Tier 1: WhatsApp Bot (Smartphones)
*   **Interface**: **WhatsApp Business API** (via Twilio sandbox for Hackathon ease).
*   **Media Handling**: Users send Voice Notes and Images.
*   **Voice Processing**: **Amazon Transcribe** (Audio -> Text).
*   **Image Processing**: **Amazon Bedrock (Claude 3 Vision)**.
    *   *Task*: OCR and Document Verification (e.g., "Is this a valid Aadhar?").

### 3. Tier 2/3: IVR System (Feature Phones)
*   **Telephony**: **Amazon Connect** or **Exotel** (Mock integration).
    *   *Flow*: User gives Missed Call -> System Calls Back -> Voice Bot speaks.
*   **Text-to-Speech**: **Amazon Polly** (Neural Engine - Hindi/Regional).
    *   *Role*: Converts the AI's text response into a human-like voice.

### 4. Database (User Profile)
*   **Primary DB**: **Amazon DynamoDB**.
    *   *Table 1: Users* (Phone, Name, Language, State).
    *   *Table 2: Applications* (SchemeID, Status, MissingDocs).

---

## 🔄 Data Flow Diagrams

### Flow A: The WhatsApp "Voice Note" Journey
1.  **User**: Sends Voice Note in Hindi: *"Mera fasal kharab ho gaya."*
2.  **Twilio/Webhook**: Receives media URL -> Sends to **AWS Lambda**.
3.  **Lambda**: Downloads Audio -> Sends to **Amazon Transcribe**.
4.  **Transcribe**: Returns Text: *"My crop is ruined."*
5.  **Bedrock Agent**:
    *   Analyzes Text.
    *   Queries **Knowledge Base**: "What scheme covers crop loss?"
    *   Response: "PM Fasal Bima Yojana."
    *   Generates Hindi Reply: *"Ji, Pradhan Mantri Fasal Bima Yojana is available. Send photo of land record."*
6.  **Lambda**: Sends Text to WhatsApp API.

### Flow B: The Document Verification (Vision)
1.  **User**: Uploads photo of Land Record.
2.  **Bedrock Vision**:
    *   Prompt: *"Extract Name, Land Area, and Survey Number. Return JSON."*
3.  **Lambda**: Saves JSON to **DynamoDB**.
4.  **Bedrock**: *"Verification Successful. Application Drafted #889."*

---

## 🛠️ Hackathon Execution Strategy (The "Mock" Build)
Since setting up real WhatsApp/IVR APIs takes time/money, we will build a **High-Fidelity Web Simulator** that *looks* exactly like the mobile experience.

### Component 1: The "WhatsApp Simulator" (Frontend)
*   **Tech**: Next.js (Mobile View).
*   **UI**: A chat window that perfectly mimics WhatsApp.
*   **Features**:
    *   **Mic Button**: Records real audio from browser -> Sends to backend.
    *   **Camera Button**: Uploads image -> Backend processes it.
    *   **Green Bubbles**: displayed responses from the AI.

### Component 2: The "IVR Dashboard" (Frontend)
*   **UI**: A simple "Phone Dialer" screen.
*   **Action**: Click "Call" -> AI speaks (Polly Audio plays in browser).
*   **Visualizer**: A "Debug Log" showing what the AI is thinking ("Retrieving Scheme...", "Translating...").

---

## 📅 Step-by-Step Implementation Plan

### Phase 1: The Core Brain (Python/FastAPI Backend)
*   [NEW] `backend/server.py`: Main FastAPI app.
*   [NEW] `backend/agent.py`: Bedrock orchestration logic.
*   [NEW] `backend/knowledge_base.py`: Mock RAG or real Bedrock KB connector.

### Phase 2: The Frontend Simulator (Next.js)
*   [NEW] `app/page.tsx`: The "Home Screen" (Choose Tier 1 or Tier 3).
*   [NEW] `app/whatsapp/page.tsx`: The WhatsApp UI clone.
*   [NEW] `app/ivr/page.tsx`: The Call Simulator.

### Phase 3: Integration & "Wow" Features
*   [ ] Implement **Multilingual Support** (Hindi/English).
*   [ ] Implement **Document OCR** (Mocked or Real Bedrock Vision).

## Verification Plan
### Automated Tests
*   Run backend unit tests to ensure Bedrock returns valid JSON for scheme eligibility.
### Manual Verification
*   **The "Grandma Test"**: Can a user complete the flow using *only* the Microphone button?
