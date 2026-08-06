
---

## Overview

This guide covers deploying the WhatsApp Priority Agent on AMD Radeon Cloud, including:
1. Launching a dedicated vLLM instance for AI inference
2. Deploying the full-stack app on a Radeon Cloud Notebook
3. Exposing the app via `rc-tunnel`

---

## Step 1: Launch vLLM Instance (AI Brain)

### 1.1 Create Template
1. Go to `https://radeon-global.anruicloud.com/profile`
2. Click **Add Template**
3. Configure:
   - **Title:** `vllm-agent`
   - **Deploy Type:** `vLLM Model API`
   - **Serve Command:**
     ```
     vllm serve Qwen/Qwen2.5-7B-Instruct --host 0.0.0.0 --port 8000
     ```
   - **Storage:** Persistent (PVC)
   - **SSH Access:** ON
4. Click **Add Template**

### 1.2 Launch & Get Credentials
1. In **My Templates**, click **Launch** on `vllm-agent`
2. Wait for **"Your workspace is ready (100%)"** (~5-10 min for model download)
3. Click into instance details
4. Copy:
   - **Base URL:** `https://.../spaces/<id>/8000/v1`
   - **API Key:** `amd_...`

### 1.3 Verify GPU Utilization
```bash
ssh <user>@<host> -p <port>
rocm-smi
You should see GPU memory usage and active processes.


Step 2: Deploy Full-Stack App

   2.1 Launch Notebook Instance
        Add Template:
        Title: hackathon-fullstack
        Container Image: Ubuntu + ROCm or PyTorch ROCm
        Storage: Persistent (PVC)
        SSH Access: ON
        Launch and wait for ready

   2.2 Upload Code
        Option A: Git Clone
        git clone https://github.com/YOUR_USERNAME/whatsapp-priority-agent.git
        cd whatsapp-priority-agent
        Option B: ZIP Upload
        ZIP project locally, upload via JupyterLab file browser, unzip

   2.3 Install Dependencies

        # System packages
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib nodejs npm

        # Start local Postgres
        sudo service postgresql start
        sudo -u postgres psql -c "CREATE DATABASE whatsapp_agent;"
        sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Backend
      cd backend
      python -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt

# Configure .env
      cat > .env << 'ENV'
      AMD_API_KEY=your_vllm_api_key_here
      BASE_URL=https://your-base-url/spaces/xxx/8000/v1
      MODEL=Qwen/Qwen2.5-7B-Instruct
      DATABASE_URL=postgresql://postgres:postgres@localhost/whatsapp_agent
ENV


# Frontend
      cd ../frontend
      npm install
      npm run build

   2.4 Start Application

# Terminal 1: Backend
      cd backend
      source venv/bin/activate
      python main.py &

# Note the PID
# Backend now serves the built frontend from ../frontend/dist

2.5 Expose to Internet


# In Notebook terminal

   /var/run/secrets/frp-self-service/install
   rc-tunnel expose --port 8000
   Output:
   plain
   https://rc-abc123.radeon.firstdg.ai
   Your app is live. Open the URL in any browser.

