cat > docs/SPEC.md << 'EOF'
# WhatsApp Priority Agent — Project Specification

## 1. Application Scenario
Small businesses receive hundreds of WhatsApp messages daily. Critical issues (outages, payment failures) get buried under casual chats. This AI agent automatically classifies message urgency and drafts contextual replies, reducing response time from hours to seconds.

## 2. Agent Architecture

┌─────────────────────────────────────────────┐
│           User / WhatsApp Business API      │
│                    │                          │
│         ┌────────▼─────────┐                │
│         │   React Frontend │                │
│         │  (Simulator UI)  │                │
│         └────────┬─────────┘                │
│                  │ HTTP                      │
│    ┌─────────────▼──────────────┐           │
│    │      FastAPI Backend       │           │
│    │  ┌─────────────────────┐   │           │
│    │  │   PostgreSQL        │   │           │
│    │  │  (Messages, Conv)   │   │           │
│    │  └─────────────────────┘   │           │
│    │            │               │           │
│    │    ┌───────▼───────┐      │           │
│    │    │  OpenAI SDK   │      │           │
│    │    │  (Compatible) │      │           │
│    │    └───────┬───────┘      │           │
│    └────────────┼──────────────┘           │
│                 │ HTTP                      │
│    ┌────────────▼──────────────┐           │
│    │  AMD Radeon Cloud vLLM   │           │
│    │  Qwen2.5-7B-Instruct     │           │
│    │  ROCm GPU Inference      │           │
│    └───────────────────────────┘           │
└─────────────────────────────────────────────┘



## 3. Core Capabilities
- **Priority Classification:** LLM analyzes incoming messages and labels URGENT/HIGH/NORMAL/LOW
- **Contextual Reply Generation:** AI drafts replies matched to priority tone (apologetic for urgent, warm for normal)
- **Human-in-the-Loop:** Admin reviews AI replies before sending
- **Multi-turn Memory:** Conversation history stored in PostgreSQL
- **Analytics Dashboard:** Real-time priority distribution charts

## 4. Model & Deployment
- **Model:** Qwen/Qwen2.5-7B-Instruct
- **Inference:** Dedicated vLLM instance on AMD Radeon Cloud (ROCm)
- **API:** OpenAI-compatible endpoint served via vLLM

## 5. AMD Radeon GPU / ROCm Optimization
- Core inference executes on dedicated AMD Radeon GPU via vLLM + ROCm
- Single-GPU deployment optimized for low latency
- Model fits comfortably in VRAM without quantization (7B params)
- Supports future quantization/distillation for edge deployment
