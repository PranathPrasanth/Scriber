# Scriber: Multimodal AI for Handwritten Receipt Intelligence

> **AI-Powered Handwritten Expense Intelligence using Multimodal Large Language Models**

Scriber is an intelligent document understanding system that extracts structured expense information from handwritten bills and receipts using state-of-the-art multimodal Large Language Models (LLMs). It benchmarks multiple vision-capable models based on extraction accuracy and API cost, and demonstrates end-to-end expense automation through Zoho Books integration.

---

## ✨ Features

- 📄 Handwritten bill & receipt understanding
- 🤖 Supports multiple multimodal LLMs
  - Google Gemini
  - OpenAI GPT
  - Anthropic Claude
- 📊 Automated evaluation framework
- 🎯 Field-wise accuracy comparison
- 💰 Cost analysis per model
- 📚 Ground-truth based benchmarking
- 🧾 Automatic expense creation using Zoho Books API
- 📈 Clean reports for model comparison

---

## Problem Statement

Handwritten receipts remain one of the most challenging document understanding problems due to varying handwriting styles, layouts, lighting conditions, and paper quality.

Scriber evaluates modern multimodal LLMs to answer two key questions:

- Which model extracts handwritten expense information most accurately?
- Is the improvement in accuracy worth the additional API cost?

---

## Project Workflow

```
            Handwritten Bill
                    │
                    ▼
        Multimodal Vision LLM
     (Gemini / GPT / Claude)
                    │
                    ▼
        Structured JSON Output
                    │
                    ▼
      Ground Truth Comparison
                    │
                    ▼
      Accuracy & Cost Analysis
                    │
                    ▼
        Zoho Books Integration
```

---

## Project Structure

```
Scriber/

├── bills/
│   ├── images/
│   └── redacted/
│
├── ground_truth/
│
├── outputs/
│   ├── gemini/
│   ├── openai/
│   └── claude/
│
├── reports/
│
├── src/
│   ├── extractors/
│   ├── evaluation/
│   ├── zoho/
│   ├── utils/
│   └── main.py
│
├── .env.example
├── requirements.txt
└── README.md
```

---

## Technologies

- Python
- Google Gemini API
- OpenAI API
- Anthropic Claude API
- Zoho Books API
- Pandas
- RapidFuzz
- Requests

---

## Evaluation Methodology

Each handwritten bill is manually annotated to create a ground-truth dataset.

Every model extracts:

- Vendor Name
- Bill Number
- Date
- Amount
- Currency
- GST / Tax Information

The extracted fields are compared against the ground truth to compute:

- Field-wise Accuracy
- Overall Accuracy
- API Cost
- Cost per 100 Bills

The final recommendation is based on both extraction quality and operational cost.

---

## Sample Output

```json
{
  "vendor": "ABC Medicals",
  "bill_number": "1432",
  "date": "2026-07-31",
  "amount": 99.00,
  "currency": "INR",
  "gst": "5%"
}
```

---

## Future Improvements

- Web interface for receipt upload
- Batch receipt processing
- OCR + LLM hybrid pipeline
- Confidence scoring
- Human-in-the-loop verification
- Support for multilingual handwritten receipts
- Analytics dashboard

---

## Installation

```bash
git clone https://github.com/<your-username>/Scriber.git

cd Scriber

python -m venv .venv

source .venv/bin/activate
# Windows
# .venv\Scripts\activate

pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file using `.env.example`.

```
OPENAI_API_KEY=

GEMINI_API_KEY=

ANTHROPIC_API_KEY=

ZOHO_CLIENT_ID=

ZOHO_CLIENT_SECRET=

ZOHO_REFRESH_TOKEN=

ZOHO_ORGANIZATION_ID=
```

---

## Disclaimer

This project is intended for research and evaluation purposes. Any handwritten receipts used for testing should have personally identifiable information redacted before being processed by external AI services.

---

## License

MIT License

---

## Author

**Pranath Prasanth**

Built as an exploration of multimodal AI for intelligent document understanding and automated expense processing.
