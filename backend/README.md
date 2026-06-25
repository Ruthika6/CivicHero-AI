# CivicHero AI FastAPI Backend Engine

This directory contains the production-ready Python backend representing the intelligent core of CivicHero AI – the Hyperlocal Community Problem Solver.

## Core Architecture

CivicHero AI utilizes a **Unified Multi-Agent Coordination Pipeline (Ensemble Core)** of 6 background agents coupled with a 7th **Community Health Agent** and a **Semantic Router**. It is constructed entirely in Python using **FastAPI**, **Pydantic** for typed data contracts, and **Firebase Firestore** for durable cloud storage.

### The 7 Agents Implementation

1. **Vision Analysis Agent (`agents.py`)**: Uses image analysis via Gemini Vision models to automatically discover damage characteristics on upload material, determine concrete depth, and identify visible hazards.
2. **Issue Classification Agent (`agents.py`)**: Distills raw, vernacular description streams or transcription elements into formal registered headers and indexes them within standard municipal databases.
3. **Duplicate Detection Agent (`agents.py`)**: Processes geospatial coordinates (latitude/longitude) and parses summaries to determine if reported claims have already been registered nearby, prompting structural complaint mergers and preventing double entry.
4. **Impact Prediction Agent (`agents.py`)**: Predicts short-term community risk tiers, assesses structural integrity drop deadlines, and forecasts the human transit volume impact.
5. **Priority Scoring Agent (`agents.py`)**: Dynamically weighs Severity + Community Upvotes + Risk Impacts over Issue Lifespan into a single priority score (1 to 100).
6. **Resolution Planning Agent (`agents.py`)**: Generates instant repair blueprints featuring material recommendations, temporary protection mitigations, local contractor cost buffers, and target resolution timelines.
7. **Community Health Agent (`agents.py`)**: Evaluates cumulative issue registers in neighborhood sectors to calculate safety, transit, water, lighting, and environmental grades, returning strategic locality health diagrams.

---

## Directory Structure

```text
backend/
├── main.py            # FastAPI main router, routes definitions, and CORS config
├── schemas.py         # Pydantic data schemas validating incoming/outgoing REST boundaries
├── db.py              # Firestore Database API wrapper (includes high-fidelity mock RAM backup)
├── agents.py          # Google GenAI python integration & system prompt definitions
└── requirements.txt   # Complete python library dependencies list
```

---

## Installation & Setup

### 1. Requirements Validation
Ensure Python 3.10+ is installed on your development host machine.

### 2. Sandbox Installation
Create a clean Python virtual environment and install the required modules:

```bash
# Create environment
python -m venv venv

# Activate on Linux/macOS
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate

# Install libraries
pip install -r requirements.txt
```

### 3. Setup Credentials & Configuration
Create a `.env` file in the root directory:

```env
GEMINI_API_KEY="YOUR_OFFICIAL_SECURE_GEMINI_API_KEY"
FIREBASE_CREDENTIALS_PATH="path/to/your/firebase-credentials.json"
```

*Note: If no Firebase Credentials json path is provided, the engine will run in a super-resilient High-Fidelity Local DB mode so you can test API structures without cloud locks out-of-the-box!*

---

## Running the Servers

Start the FastAPI development service with code hot-reloading:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server launches at `http://localhost:8000`. You can inspect interactive API endpoints visually directly via standard OpenAPI docs at:  
👉 **`http://localhost:8000/docs`**

---

## Core Prompts & Systems Engineering

Our system prompts leverage structured JSON schemas to prompt Gemini to behave as clean deterministic micro-services. By combining Pydantic type shapes on endpoints and setting Gemini's temperature parameter to `0.1`, we achieve high reliability with minimal latency.
