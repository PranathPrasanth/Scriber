# Scriber

An AI-powered handwritten receipt extraction system that automatically extracts structured expense information from receipt images using multiple Vision Language Models (VLMs), evaluates extraction accuracy against ground truth, and records validated expenses into Zoho Books.

---

## Features

- Extracts handwritten receipt information from images
- Supports multiple Vision Language Models:
  - Gemini 2.5 Flash
  - Google Gemma (via OpenRouter)
  - NVIDIA Nemotron Nano VL (via OpenRouter)
- Automatic batch processing
- Ground truth evaluation
- Accuracy report generation
- Zoho Books integration
- Retry mechanism for transient API failures
- Modular architecture for adding new models

---

## Project Structure

```
Scriber/
│
├── bills/
│   └── images/
│
├── ground_truth/
│
├── outputs/
│   ├── gemini/
│   ├── gemma/
│   └── nemotron/
│
├── reports/
│   └── evaluation.txt
│
├── src/
│   ├── evaluation/
│   ├── extractors/
│   ├── prompts/
│   ├── utils/
│   ├── zoho/
│   ├── config.py
│   ├── main.py
│   └── models.py
│
├── requirements.txt
├── .env.example
└── README.md
```

---

# Models Used

| Model | Provider |
|--------|----------|
| Gemini 2.5 Flash | Google AI Studio |
| Gemma 4 27B | OpenRouter |
| Nemotron Nano VL | OpenRouter |

---

# Extracted Fields

The system extracts the following fields:

- Vendor
- Bill Number
- Date
- Amount
- Currency
- GST

Example Output

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

# Installation

Clone the repository

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

Install dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file.

```
GEMINI_API_KEY=

OPENROUTER_API_KEY=

ZOHO_CLIENT_ID=

ZOHO_CLIENT_SECRET=

ZOHO_REFRESH_TOKEN=

ZOHO_ORGANIZATION_ID=

ZOHO_EXPENSE_ACCOUNT_ID=
```

---

# Running Extraction

## Gemini

```bash
python -m src.main --model gemini
```

## Gemma

```bash
python -m src.main --model gemma
```

## Nemotron

```bash
python -m src.main --model nemotron
```

The extracted JSON files are stored inside

```
outputs/
```

---

# Evaluation

Compare extracted outputs against ground truth.

```bash
python -m src.evaluation.evaluator
```

Evaluation report is generated at

```
reports/evaluation.txt
```

Example

```
Gemini

Overall Accuracy : 100%
Success Rate : 100%

Gemma

Overall Accuracy : 100%
Success Rate : 100%

Nemotron

Overall Accuracy : 96.67%
Success Rate : 33.33%
```

---

# Zoho Books Integration

The project supports automatic expense creation in Zoho Books.

Workflow

1. Extract receipt
2. Convert to structured JSON
3. Validate extracted fields
4. Create expense in Zoho Books using OAuth 2.0
5. Store expense in the configured expense account

---

# Technologies Used

- Python
- Google Gemini API
- OpenRouter API
- Pydantic
- Requests
- python-dotenv
- Zoho Books API

---

# Error Handling

The application automatically retries on

- API rate limits
- Temporary network failures
- Connection timeout
- Resource exhaustion

Already processed receipts are skipped automatically.

---

# Results

| Model | Accuracy |
|--------|----------|
| Gemini | 100% |
| Gemma | 100% |
| Nemotron | 96.67% |

---

# Future Improvements

- OCR-free document understanding
- Automatic expense categorization
- Support additional VLMs
- Receipt image enhancement
- Web dashboard
- Docker deployment
- Multi-language receipt support

---

# Author

Pranath Prasanth

B.Tech Computer Science & Engineering
