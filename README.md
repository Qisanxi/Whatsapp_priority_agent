**Track 2: Development & Local Deployment of Private AI Agents**  
**AMD AI DevMaster Hackathon 2026**

An AI-powered WhatsApp Business agent that automatically classifies incoming messages by priority (Urgent/High/Normal/Low) and generates contextual replies — running inference on AMD Radeon Cloud with ROCm.

## 🎯 What It Does

| Priority | Action | Example |
|----------|--------|---------|
| 🔴 **URGENT** | **Auto-reply instantly** | "Server down, losing money!" |
| 🟠 **HIGH** | **Auto-reply instantly** | "Payment gateway broken" |
| 🟢 **NORMAL** | Queue for human approval | "How do I get new Creditcard?" |
| ⚪ **LOW** | Queue for human approval | "Love your product!" |

**Result:** Critical issues get handled in seconds. Non-urgent messages wait for human review.

## 🏗️  Stack

- **Frontend:** React 18 + Tailwind CSS v4 + Recharts + Lucide React
- **Backend:** Python 3.11 + FastAPI + SQLAlchemy + OpenAI SDK
- **Database:** PostgreSQL (local dev) / Supabase (cloud)
- **AI Inference:** Dedicated vLLM instance on AMD Radeon Cloud (ROCm)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (local)

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-priority-agent.git
cd whatsapp-priority-agent

cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your AMD Radeon Cloud vLLM credentials

# Start PostgreSQL and create database
sudo service postgresql start
createdb whatsapp_agent

# Run
python main.py
# → Uvicorn running on http://0.0.0.0:8000

cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
# → Vite running on http://localhost:5173

4. Test
Open http://localhost:5173 → Simulate a message → See AI classify and auto-reply.


🔑 AMD Radeon Cloud Setup
See ./docs/DEPLOYMENT.md for full deployment instructions including:
Launching vLLM instances on Radeon Cloud
Deploying to Radeon Cloud Notebook with rc-tunnel
rocm-smi verification




📁 Project Structure

whatsapp-priority-agent/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # SQLAlchemy models
│   ├── schemas.py           # Pydantic validation
│   ├── services/
│   │   └── agent.py         # AI classification + reply generation
│   ├── api/
│   │   └── messages.py      # REST endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main UI component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind v4 styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── SPEC.md              # Project specification
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── architecture.png     # System architecture diagram
└── README.md

Core Capabilities (Track 2 Requirements)
| Requirement                       | Implementation                                            |
| --------------------------------- | --------------------------------------------------------- |
| ✅ Local knowledge retrieval (RAG) | Conversation history in PostgreSQL, fed as context to LLM |
| ✅ Tool invocation                 | `/api/webhook/message` endpoint accepts external triggers |
| ✅ Multi-step task planning        | Classify → Generate → Store → Auto-reply/Queue            |
| ✅ Local multi-turn memory         | Full conversation threads per contact                     |
| ✅ Permission control & privacy    | Human approval gate for NORMAL/LOW messages               |



🎥 Demo Video
 link :


👤 Team
Sandeep Kumar — Full Stack + AI Integration


— Built for AMD AI DevMaster Hackathon 2026



