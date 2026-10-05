# 🚀 WhatsApp Priority Agent

**Track 2: Development & Local Deployment of Private AI Agents**  
**AMD AI DevMaster Hackathon 2026**

An AI-powered WhatsApp Business agent that automatically classifies incoming messages by priority (**Urgent / High / Normal / Low**) and generates contextual replies using an LLM running on **AMD Radeon Cloud (ROCm)**.

---

# 🎯 What It Does

| Priority | Action | Example |
|----------|--------|---------|
| 🔴 **URGENT** | Auto-reply instantly | "Server down, losing money!" |
| 🟠 **HIGH** | Auto-reply instantly | "Payment gateway broken" |
| 🟢 **NORMAL** | Queue for human approval | "How do I get a new credit card?" |
| ⚪ **LOW** | Queue for human approval | "Love your product!" |

### Result

Critical issues receive AI-generated responses within seconds, while non-urgent conversations remain in the approval queue for human review.

---
# 🎥 Demo Video

> **Video Link** : (https://youtube.com/shorts/BaivNCcSk3M?feature=share)


---

# 🗺️ System Architecture

The system is organized into four tiers. On the client side, inbound WhatsApp traffic enters through the webhook while admins work in the React dashboard. The FastAPI backend hosts both the webhook endpoint and the agent services (priority classification + reply generation), calling a dedicated vLLM instance running **Qwen2.5-7B-Instruct** on an **AMD Radeon GPU (ROCm)** through an OpenAI-compatible API. PostgreSQL persists every message together with its conversation history, which provides the multi-turn memory used for context.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontSize":"18px","primaryTextColor":"#1E293B","lineColor":"#94A3B8","clusterBkg":"#F8FAFC","clusterBorder":"#E2E8F0"},"flowchart":{"curve":"basis","padding":32,"nodeSpacing":80,"rankSpacing":80,"htmlLabels":true,"wrappingWidth":280}}}%%
flowchart LR
    subgraph CLIENTS["Clients"]
        direction TB
        WA["WhatsApp Business<br/>customer messages"]
        UI["Admin Dashboard<br/>React 18 + Vite :5173"]
    end

    subgraph BE["FastAPI Backend :8000"]
        direction TB
        HOOK["Webhook<br/>POST /api/webhook/message"]
        AGENT["Agent Services<br/>classify_priority()<br/>generate_reply()"]
        ADMIN["Inbox · Threads<br/>Approve · Stats APIs"]
    end

    subgraph AMD["AMD Radeon Cloud"]
        direction TB
        VLLM["vLLM on ROCm GPU<br/>Qwen2.5-7B-Instruct<br/>OpenAI-compatible API"]
    end

    subgraph DB["Data Layer"]
        direction TB
        PG[("PostgreSQL<br/>messages · conversation<br/>history")]
    end

    WA -->|"inbound message"| HOOK
    HOOK --> AGENT
    AGENT -->|"chat.completions"| VLLM
    HOOK -->|"persist"| PG
    UI --> ADMIN
    ADMIN -->|"read / update"| PG

    classDef client fill:#EFF6FF,stroke:#3B82F6,color:#1E293B
    classDef api fill:#F8FAFC,stroke:#64748B,color:#0F172A
    classDef ai fill:#FEF2F2,stroke:#DC2626,color:#7F1D1D
    classDef store fill:#F0FDF4,stroke:#10B981,color:#064E3B
    class WA,UI client
    class HOOK,AGENT,ADMIN api
    class VLLM ai
    class PG store
```

> A static reference diagram is also available at [`docs/architecture.png`](./docs/architecture.png).

---

# 🔄 Message Processing Flow

Every inbound message follows the same pipeline: the webhook triggers a low-temperature LLM call to classify priority, a tone-matched reply is generated, and the message is routed based on its label. **URGENT** and **HIGH** messages are answered instantly by the AI, while **NORMAL** and **LOW** messages are held in the approval queue until an admin approves, edits, or rejects the draft. Every outcome — sent, rejected, or pending — is written to PostgreSQL so the conversation history stays complete.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontSize":"18px","primaryTextColor":"#1E293B","lineColor":"#94A3B8"},"flowchart":{"curve":"basis","padding":32,"nodeSpacing":80,"rankSpacing":80,"htmlLabels":true,"wrappingWidth":280}}}%%
flowchart TD
    A["Inbound WhatsApp message<br/>POST /api/webhook/message"] --> B["classify_priority()<br/>LLM call · temperature 0.1"]
    B --> D["generate_reply()<br/>priority-aware tone prompt"]
    D --> F{"Priority?"}
    F -->|"URGENT / HIGH"| G["Auto-reply sent instantly<br/>status = replied"]
    F -->|"NORMAL / LOW"| H["Queued for human approval<br/>status = pending"]
    H --> I{"Admin decision"}
    I -->|"Approve / edit"| J["Reply sent<br/>status = replied"]
    I -->|"Reject"| K["Draft discarded<br/>status = rejected"]
    G --> L[("PostgreSQL<br/>message + conversation history")]
    J --> L
    K --> L

    classDef step fill:#EFF6FF,stroke:#3B82F6,color:#1E293B
    classDef decision fill:#FFF7ED,stroke:#F59E0B,color:#78350F
    classDef replied fill:#F0FDF4,stroke:#10B981,color:#064E3B
    classDef human fill:#F5F3FF,stroke:#7C3AED,color:#4C1D95
    classDef rejected fill:#FEF2F2,stroke:#DC2626,color:#7F1D1D
    classDef store fill:#F0FDF4,stroke:#10B981,color:#064E3B
    class A,B,D step
    class F,I decision
    class G,J replied
    class H human
    class K rejected
    class L store
```

---

# 🏗️ Tech Stack

### Frontend
- React 18
- Tailwind CSS v4
- Recharts
- Lucide React

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- OpenAI SDK

### Database
- PostgreSQL (Local Development)
- AMD Radeon Cloud/Supabase


### AI Inference
- Dedicated vLLM Instance on AMD Radeon Cloud (ROCm)

---

# 🚀 Quick Start

## Prerequisites

Before starting, install:

- Python 3.11+
- Node.js 18+
- PostgreSQL

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-priority-agent.git
cd whatsapp-priority-agent
```

---

## 2️⃣ Backend Setup

Move into the backend folder.

```bash
cd backend
```

### Create a Virtual Environment

**Linux/macOS**

```bash
python -m venv venv
source venv/bin/activate
```

**Windows**

```powershell
python -m venv venv
venv\Scripts\activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Configure Environment Variables

```bash
cp .env.example .env
```

Update `.env` with your AMD Radeon Cloud vLLM credentials.

---

### Create PostgreSQL Database

Start PostgreSQL.

```bash
sudo service postgresql start
```

Create the database.

```bash
createdb whatsapp_agent
```

---

### Run the Backend

```bash
python main.py
```

Backend will start at:

```
http://0.0.0.0:8000
```

---

## 3️⃣ Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 4️⃣ Test the Application

Open:

```
http://localhost:5173
```

Then:

1. Simulate an incoming WhatsApp message.
2. Let the AI classify the priority.
3. Observe the generated response.
4. Verify whether the message is auto-replied or queued.

---

# 🔑 AMD Radeon Cloud Setup

See the deployment guide:

```
docs/DEPLOYMENT.md
```

It contains instructions for:

- Launching vLLM instances
- Deploying with Radeon Cloud Notebook
- Using rc-tunnel
- ROCm verification using `rocm-smi`

---

# 📁 Project Structure

```text
whatsapp-priority-agent/
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── schemas.py
│   ├── services/
│   │   └── agent.py
│   ├── api/
│   │   └── messages.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── PipelineDemo.jsx
│   │   │   └── Dashboard.jsx
│   │   └── data/
│   │       └── landingData.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── SPEC.md
│   ├── DEPLOYMENT.md
│   └── architecture.png
│
└── README.md
```

---

# 🎨 Landing Page

The app ships with a built-in marketing landing page — a Tailwind CSS rewrite of the original design, fully integrated into the React frontend:

- **`/`** — landing page: hero, live triage simulation, priority rules, system architecture, quickstart terminal, capabilities
- Clicking **Get started** (or **Launch app**) routes you to **`/app`** — the live simulation dashboard
- The dashboard header has an **← About** button to return to the landing page

Routing is handled by `react-router-dom`, so deep links like `/app` survive a page refresh (the FastAPI catch-all serves `index.html` for any path in production).

---

# ✅ Core Capabilities (Track 2 Requirements)

| Requirement | Implementation |
|-------------|----------------|
| ✅ Local Knowledge Retrieval (RAG) | Conversation history stored in PostgreSQL and provided as LLM context |
| ✅ Tool Invocation | `/api/webhook/message` endpoint accepts external triggers |
| ✅ Multi-step Task Planning | Classify → Generate → Store → Auto-reply / Queue |
| ✅ Local Multi-turn Memory | Conversation history maintained for each contact |
| ✅ Permission Control & Privacy | Human approval required for NORMAL and LOW priority messages |

---

# 👤 Team

**Sandeep Kumar**  
*Full Stack Development & AI Integration*

---

## 🏆 AMD AI DevMaster Hackathon 2026

Built for **Track 2 – Development & Local Deployment of Private AI Agents** using **AMD Radeon Cloud**.
