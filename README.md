# Scriber

> AI-powered handwritten receipt extraction using Vision Language Models with automatic Zoho Books integration.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Production-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-7E57C2)

---

## 🚀 Live Demo

**Frontend**

https://scriber-omega.vercel.app

**Backend API**

https://scriber-5mvl.onrender.com

**API Documentation**

https://scriber-5mvl.onrender.com/docs

---

## Overview

Scriber is a full-stack AI application that extracts structured expense information from handwritten receipts using multiple Vision Language Models (VLMs), compares model performance, and automatically creates expenses inside Zoho Books.

Unlike traditional OCR pipelines, Scriber leverages modern Vision Language Models for end-to-end document understanding.

---

## Features

- AI-powered handwritten receipt extraction
- Multiple Vision Language Models
  - Gemini 2.5 Flash
  - Google Gemma
  - NVIDIA Nemotron Nano VL
- Modern React dashboard
- Automatic expense creation in Zoho Books
- Model evaluation dashboard
- Accuracy comparison between VLMs
- Batch receipt processing
- Retry mechanism for transient API failures
- Production deployment
- REST API with FastAPI

---

## Screenshots

> Add screenshots here after deployment.

### Landing Page

```
docs/images/home.png
```

### Dashboard

```
docs/images/dashboard.png
```

### Zoho Books Integration

```
docs/images/zoho.png
```

---

# Architecture

```
                React Frontend
               (TanStack Start)
                      │
                      ▼
               FastAPI Backend
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Gemini         Gemma       Nemotron
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
             Structured Expense Data
                      │
                      ▼
               Zoho Books API
```

---

# Project Structure

```
Scriber/

├── frontend/
│
├── bills/
│
├── outputs/
│
├── reports/
│
├── src/
│   ├── evaluation/
│   ├── extractors/
│   ├── prompts/
│   ├── utils/
│   ├── zoho/
│   ├── api.py
│   ├── config.py
│   ├── main.py
│   └── models.py
│
├── requirements.txt
├── .env.example
└── README.md
```

---

# Models

| Model | Provider |
|---------|----------|
| Gemini 2.5 Flash | Google AI Studio |
| Gemma 4 27B | OpenRouter |
| Nemotron Nano VL | OpenRouter |

---

# Extracted Fields

- Vendor
- Bill Number
- Date
- Amount
- Currency
- GST

Example

```json
{
    "vendor": "Sai Auto Parts",
    "bill_number": "620",
    "date": "2026-07-29",
    "amount": 424.80,
    "currency": "INR",
    "gst": "18%"
}
```

---

# Tech Stack

### Frontend

- React 19
- TypeScript
- TanStack Start
- Tailwind CSS

### Backend

- FastAPI
- Python
- Pydantic
- Requests

### AI

- Gemini API
- OpenRouter
- Gemma
- Nemotron

### Deployment

- Vercel
- Render

### Accounting

- Zoho Books API

---

# Installation

```bash
git clone <repository-url>

cd Scriber
```

Create virtual environment

```bash
python -m venv .venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Install

```bash
pip install -r requirements.txt
```

Frontend

```bash
cd frontend

npm install

npm run dev
```

Backend

```bash
python -m uvicorn src.api:app --reload
```

---

# Environment Variables

Backend

```env
GEMINI_API_KEY=

OPENROUTER_API_KEY=

ZOHO_CLIENT_ID=

ZOHO_CLIENT_SECRET=

ZOHO_REFRESH_TOKEN=

ZOHO_ORGANIZATION_ID=

ZOHO_EXPENSE_ACCOUNT_ID=
```

Frontend

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

# REST API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/extract` | Extract receipt |
| POST | `/zoho/expenses` | Create expense |
| GET | `/evaluation` | Model evaluation |
| GET | `/docs` | Swagger UI |

---

# Evaluation Results

| Model | Accuracy |
|---------|-----------|
| Gemini | 100% |
| Gemma | 100% |
| Nemotron | 96.67% |

---

# Error Handling

Automatically retries on

- API rate limits
- Connection failures
- Resource exhaustion
- Temporary network failures

Previously processed receipts are skipped automatically.

---

# Future Improvements

- Docker support
- User authentication
- Expense analytics
- Automatic expense categorization
- Receipt enhancement
- Multi-language receipts
- Additional Vision Language Models

---

# Author

**Pranath Prasanth**

B.Tech Computer Science & Engineering
