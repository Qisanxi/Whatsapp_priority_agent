# 🚀 Deployment Guide

This guide explains how to deploy the **WhatsApp Priority Agent** on **AMD Radeon Cloud**, including:

1. Launching a dedicated **vLLM** instance for AI inference.
2. Deploying the full-stack application on an **AMD Radeon Cloud Notebook**.
3. Exposing the application to the internet using **rc-tunnel**.

---

# 📋 Prerequisites

Before deploying, ensure you have:

- An AMD Radeon Cloud account
- Access to Radeon Cloud Notebook
- Git installed
- Python 3.11+
- Node.js 18+
- PostgreSQL
- SSH enabled on your cloud workspace

---

# Step 1: Launch the vLLM Instance (AI Brain)

## 1.1 Create a Template

1. Visit:

   ```
   https://radeon-global.anruicloud.com/profile
   ```

2. Click **Add Template**.

3. Configure the template:

   - **Title**

     ```
     vllm-agent
     ```

   - **Deploy Type**

     ```
     vLLM Model API
     ```

   - **Serve Command**

     ```bash
     vllm serve Qwen/Qwen2.5-7B-Instruct \
       --host 0.0.0.0 \
       --port 8000
     ```

   - **Storage**

     ```
     Persistent (PVC)
     ```

   - **SSH Access**

     ```
     ON
     ```

4. Click **Add Template**.

---

## 1.2 Launch the Instance

1. Navigate to **My Templates**.
2. Click **Launch** on **vllm-agent**.
3. Wait until the status shows:

   ```
   Your workspace is ready (100%)
   ```

> The initial model download may take **5–10 minutes**.

---

## 1.3 Obtain API Credentials

Open the instance details and copy:

- **Base URL**

  ```
  https://.../spaces/<id>/8000/v1
  ```

- **API Key**

  ```
  amd_xxxxxxxxxxxxxxxxx
  ```

Keep these values—you'll use them later in the `.env` file.

---

## 1.4 Verify GPU Utilization

SSH into your instance.

```bash
ssh <user>@<host> -p <port>
```

Run:

```bash
rocm-smi
```

You should see:

- GPU memory usage
- GPU utilization
- Active inference processes

---

# Step 2: Deploy the Full-Stack Application

## 2.1 Launch a Notebook Instance

Create another template with the following configuration.

| Setting | Value |
|---------|-------|
| Title | `hackathon-fullstack` |
| Container Image | Ubuntu + ROCm (or PyTorch ROCm) |
| Storage | Persistent (PVC) |
| SSH Access | ON |

Launch the notebook and wait until it is ready.

---

## 2.2 Upload the Project

### Option A — Clone from GitHub

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-priority-agent.git

cd whatsapp-priority-agent
```

### Option B — Upload ZIP

1. Compress the project locally.
2. Upload the ZIP through the JupyterLab file browser.
3. Extract the archive.

---

## 2.3 Install Dependencies

### Install System Packages

```bash
sudo apt update

sudo apt install -y \
    postgresql \
    postgresql-contrib \
    nodejs \
    npm
```

---

### Configure PostgreSQL

Start PostgreSQL.

```bash
sudo service postgresql start
```

Create the database.

```bash
sudo -u postgres psql -c "CREATE DATABASE whatsapp_agent;"
```

Set the PostgreSQL password.

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

---

### Configure Environment Variables

Create the `.env` file.

```bash
cat > .env << 'ENV'
AMD_API_KEY=your_vllm_api_key_here
BASE_URL=https://your-base-url/spaces/xxx/8000/v1
MODEL=Qwen/Qwen2.5-7B-Instruct
DATABASE_URL=postgresql://postgres:postgres@localhost/whatsapp_agent
ENV
```

Replace the placeholder values with the credentials obtained in **Step 1**.

---

### Frontend Setup

```bash
cd ../frontend

npm install

npm run build
```

---

## 2.4 Start the Application

### Start the Backend

```bash
cd backend

source venv/bin/activate

python main.py &
```

The backend will serve the production frontend located in:

```
../frontend/dist
```

---

# Step 3: Expose the Application

Run the Radeon Cloud installation script.

```bash
/var/run/secrets/frp-self-service/install
```

Expose port **8000**.

```bash
rc-tunnel expose --port 8000
```

Example output:

```text
https://rc-abc123.radeon.firstdg.ai
```

Your application is now publicly accessible.

Open the generated URL in any web browser to access the deployed application.

---

# ✅ Deployment Checklist

- [ ] vLLM template created
- [ ] vLLM instance running
- [ ] API key copied
- [ ] Base URL copied
- [ ] Notebook instance launched
- [ ] Repository uploaded or cloned
- [ ] PostgreSQL configured
- [ ] Backend dependencies installed
- [ ] Frontend built
- [ ] `.env` configured
- [ ] Backend started
- [ ] `rc-tunnel` enabled
- [ ] Public deployment URL verified

---

# 🎉 Deployment Complete

Your **WhatsApp Priority Agent** is now running on **AMD Radeon Cloud**, powered by a dedicated **vLLM** inference server and publicly accessible through **rc-tunnel**.