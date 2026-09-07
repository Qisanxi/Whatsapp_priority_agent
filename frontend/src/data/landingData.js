/* Shared content for the landing page (ported from the original standalone landing.html) */

export const REPO_URL = 'https://github.com/Qisanxi/Whatsapp_priority_agent'

export const TICKER_ITEMS =
  'vLLM · ROCm · AMD Radeon Cloud · FastAPI · PostgreSQL · React 19 · Tailwind v4 · Recharts · SQLAlchemy · OpenAI SDK · multi-turn memory · human-in-the-loop · '

export const SCENARIOS = [
  {
    c: 'Arjun Mehta',
    t: "Server is down, we're losing orders every minute!!",
    p: 'URGENT',
    r: "I've paged the on-call engineer and escalated this as Sev-1. You'll get a status update every 5 minutes until we're back up.",
  },
  {
    c: 'Priya Nair',
    t: 'Payment gateway is declining every UPI transaction',
    p: 'HIGH',
    r: "You're right — the payments team is already on it. Failed charges are auto-refunded and UPI should be back within the hour.",
  },
  {
    c: 'Rahul Verma',
    t: 'How do I get a replacement credit card?',
    p: 'NORMAL',
    r: 'Head to Profile → Cards → Replace card. It ships in 3–5 business days. Shall I raise the request for you?',
  },
  {
    c: 'Sana Khan',
    t: 'Absolutely love the new update, brilliant work team!',
    p: 'LOW',
    r: 'Thank you so much — I have passed this straight to the team. It genuinely made their day.',
  },
  {
    c: 'Dev Sharma',
    t: 'URGENT: API has been returning 500s since 2pm IST',
    p: 'URGENT',
    r: 'Confirmed — we isolated the regression and rolled back the last deploy. Error rates are recovering now.',
  },
  {
    c: 'Meera Iyer',
    t: 'My March invoice has the wrong GST amount',
    p: 'HIGH',
    r: 'Apologies for that — I have flagged the invoice to billing with priority. A corrected copy reaches you today.',
  },
  {
    c: 'Karan Patel',
    t: 'Do you have an office in Bangalore I can visit?',
    p: 'LOW',
    r: 'Yes — we are at Indiranagar 100ft Road, Mon–Sat 10am–7pm. Want me to book you a slot?',
  },
  {
    c: 'Anita Rao',
    t: 'My KYC verification has been stuck for two days',
    p: 'HIGH',
    r: 'Sorry for the delay — I have pushed your KYC to the front of the verification queue. It should clear within a few hours.',
  },
  {
    c: 'Vikram Singh',
    t: 'What are your support hours on weekends?',
    p: 'NORMAL',
    r: 'Weekend support runs 9am–6pm IST on chat, and 24×7 for urgent issues. Anything I can help with right now?',
  },
  {
    c: 'Farah Ali',
    t: 'The export feature keeps timing out on large files',
    p: 'HIGH',
    r: 'Thanks for the report — reproduced and escalated to engineering. Large exports are being retried automatically.',
  },
]

export const AVCOLORS = ['#FF8A65', '#4DB6AC', '#9575CD', '#F06292', '#AED581', '#4FC3F7', '#FFD54F']

export const AUTO = { URGENT: true, HIGH: true, NORMAL: false, LOW: false }

export const PRIO_TEXT = { URGENT: 'text-alert', HIGH: 'text-warn', NORMAL: 'text-accent', LOW: 'text-grayt' }
export const PRIO_CHIP = {
  URGENT: 'text-alert border-alert/60 bg-alert/10',
  HIGH: 'text-warn border-warn/60 bg-warn/10',
  NORMAL: 'text-accent border-accent/60 bg-accent/10',
  LOW: 'text-grayt border-grayt/60 bg-grayt/10',
}
export const PRIO_DOT = { URGENT: 'bg-alert', HIGH: 'bg-warn', NORMAL: 'bg-accent', LOW: 'bg-grayt' }

export const TIERS = [
  {
    num: 'T-01',
    name: 'Urgent',
    tone: 'text-alert',
    bar: 'bg-alert',
    sla: 'INSTANT',
    instant: true,
    act: "Auto-replied the moment it's classified. The customer never sees a wait.",
    q: "Server down, we're losing money every minute!",
  },
  {
    num: 'T-02',
    name: 'High',
    tone: 'text-warn',
    bar: 'bg-warn',
    sla: 'INSTANT',
    instant: true,
    act: 'Real problems with paying customers on the other end — answered by AI within seconds, grounded in conversation history.',
    q: 'Payment gateway is declining every UPI transaction',
  },
  {
    num: 'T-03',
    name: 'Normal',
    tone: 'text-accent',
    bar: 'bg-accent',
    sla: 'HUMAN-IN-LOOP',
    instant: false,
    act: 'A draft reply is generated and queued. A human approves, edits or rejects — nothing leaves without a signature.',
    q: 'How do I get a replacement credit card?',
  },
  {
    num: 'T-04',
    name: 'Low',
    tone: 'text-grayt',
    bar: 'bg-grayt',
    sla: 'HUMAN-IN-LOOP',
    instant: false,
    act: 'Praise, small talk, general queries. Acknowledged warmly — by a person, when they have a moment.',
    q: 'Absolutely love your product, great job team!',
  },
]

export const STACK_ROWS = [
  {
    layer: 'Frontend',
    tech: 'React 19 · Tailwind CSS v4 · Recharts · Lucide',
    role: 'Operator console, live queue & analytics',
  },
  {
    layer: 'Backend',
    tech: 'Python 3.11 · FastAPI · SQLAlchemy · OpenAI SDK',
    role: 'Webhook intake, classification & routing',
  },
  { layer: 'Database', tech: 'PostgreSQL', role: 'Multi-turn memory — the local RAG store' },
  {
    layer: 'Inference',
    tech: 'vLLM · AMD Radeon Cloud (ROCm)',
    role: 'Private LLM — classification & reply generation',
  },
]

export const CAPABILITIES = [
  {
    id: 'R-01',
    name: 'Local Knowledge Retrieval (RAG)',
    desc: 'Conversation history persisted in PostgreSQL is assembled into the LLM context window on every single turn.',
  },
  {
    id: 'R-02',
    name: 'Tool Invocation',
    desc: '/api/webhook/message accepts external triggers — WhatsApp webhooks, cron jobs, CI smoke tests.',
  },
  {
    id: 'R-03',
    name: 'Multi-step Task Planning',
    desc: 'A fixed four-stage pipeline — classify → generate → store → route — with per-stage and failure handling.',
  },
  {
    id: 'R-04',
    name: 'Local Multi-turn Memory',
    desc: 'Per-contact history is maintained across sessions in Postgres and replayed as context, so replies stay coherent.',
  },
  {
    id: 'R-05',
    name: 'Permission Control & Privacy',
    desc: 'NORMAL and LOW messages are held for human approval — nothing is auto-sent without a rule that says so.',
  },
]

export const QUICKSTART = [
  {
    key: 'setup',
    label: 'Clone repo',
    hint: 'git clone + cd',
    title: '01 — clone the repository',
    lines: [
      ['c', '# clone the repository'],
      ['x', `git clone ${REPO_URL}.git`],
      ['x', 'cd Whatsapp_priority_agent'],
    ],
  },
  {
    key: 'backend',
    label: 'Start backend',
    hint: 'venv · deps · postgres · main.py',
    title: '02 — backend · python 3.11 + fastapi',
    lines: [
      ['c', '# move into the backend'],
      ['x', 'cd backend'],
      ['x', 'python -m venv venv && source venv/bin/activate'],
      ['x', 'pip install -r requirements.txt'],
      ['x', 'cp .env.example .env'],
      ['c', '#   add your AMD Radeon Cloud vLLM credentials to .env'],
      ['x', 'createdb whatsapp_agent'],
      ['x', 'python main.py'],
      ['o', '→ API live at http://0.0.0.0:8000'],
    ],
  },
  {
    key: 'frontend',
    label: 'Start frontend',
    hint: 'npm install · npm run dev',
    title: '03 — frontend · react + vite',
    lines: [
      ['c', '# open a second terminal'],
      ['x', 'cd frontend'],
      ['x', 'npm install'],
      ['x', 'npm run dev'],
      ['o', '→ dashboard live at http://localhost:5173'],
    ],
  },
  {
    key: 'verify',
    label: 'Fire a test',
    hint: 'curl the webhook endpoint',
    title: '04 — simulate an inbound webhook',
    lines: [
      ['c', '# fire a test message at the webhook'],
      ['x', 'curl -X POST http://localhost:8000/api/webhook/message \\'],
      ['x', '  -H "Content-Type: application/json" \\'],
      ['x', `  -d '{"from":"+9198xxxx4821","text":"Payments are failing"}'`],
      ['c', '# → watch it classify, generate and route in the dashboard'],
    ],
  },
]
