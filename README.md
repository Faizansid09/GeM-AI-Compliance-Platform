
GeM AI Compliance Platform
🚀 AI-powered compliance verification platform designed to automate bidder eligibility assessment for Government e-Marketplace (GeM) procurement workflows.

Project Status
🚧 Prototype | Smart India Hackathon Project

This project demonstrates a scalable architecture for automated bidder compliance verification and can be extended for real-world GeM integrations, cloud deployment, OCR-based document analysis, and AI-assisted compliance evaluation.
Overview
Government procurement officers often spend significant time manually verifying bidder eligibility, compliance documents, and supporting certificates. This project is a full-stack prototype that automates compliance verification using a rule-based engine with AI-assisted recommendations.

The system helps identify missing requirements, assess bidder eligibility, maintain audit trails, and improve transparency in procurement workflows.

Features
Automated Bidder Compliance Verification
AI-Assisted Compliance Recommendations
Rule-Based Eligibility Assessment
Audit Trail & Verification Tracking
Compliance Status Dashboard
Document Validation Workflow
Modular Verification Adapters
Responsive Dashboard Interface
Supported Compliance Checks
GST Verification
PAN Verification
MCA Verification
UDYAM Verification
EPFO Verification
ESIC Verification
NSIC Verification
Startup India Validation
Make In India Validation
Blacklist Verification
Architecture
┌─────────────────────────────┐
│        React Frontend       │
│  TypeScript + Vite + CSS    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
└──────────────┬──────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
     ▼                   ▼
┌───────────┐    ┌────────────────┐
│Rule Engine│    │ AI Recommender │
└───────────┘    └────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Compliance Adapters Layer   │
├─────────────────────────────┤
│ GST                         │
│ PAN                         │
│ MCA                         │
│ UDYAM                       │
│ EPFO                        │
│ ESIC                        │
│ NSIC                        │
│ Startup India               │
│ Make In India               │
│ Blacklist                   │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│       SQLite Database       │
└─────────────────────────────┘
Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Backend
FastAPI
SQLAlchemy
Pydantic
SQLite
Tools
Git
GitHub
Project Structure
SIH/
│
├── src/
├── public/
├── gem-compliance-backend/
│   ├── app/
│   │   ├── adapters/
│   │   ├── engine/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── package.json
├── vite.config.ts
└── README.md
Screenshots
<img width="1915" height="912" alt="Screenshot 2026-10-24 195600" src="https://github.com/user-attachments/assets/d91362a8-01c7-4ccc-823c-5a5d18c4b56f" />
<img width="1912" height="911" alt="Screenshot 2026-10-24 195637" src="https://github.com/user-attachments/assets/8155c5c6-b8bf-487c-b9be-43bbcebeca43" />
<img width="1917" height="913" alt="Screenshot 2026-10-24 195608" src="https://github.com/user-attachments/assets/2df4f095-c823-433a-9af9-26be13c0f88c" />




Local Setup
Frontend
npm install
npm run dev
Frontend:

http://localhost:5173
Backend
cd gem-compliance-backend
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
Backend:

http://127.0.0.1:8000
Future Enhancements
OCR-Based Document Processing
Tender Requirement Extraction
LLM-Powered Compliance Analysis
Cloud Deployment on AWS
Multi-User Authentication
Analytics Dashboard
API Integrations with Compliancekathon
Developed as a prototype solution to improve compliance verification and transparency in Government e-Marketplace (GeM) procurement workflows.

Author
Faizan Siddiqui

B.Tech CSE (Cloud Computing & GenAI)
Lovely Professional University
