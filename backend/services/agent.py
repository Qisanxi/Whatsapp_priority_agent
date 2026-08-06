import openai
from config import config

client = openai.OpenAI(base_url=config.BASE_URL, api_key=config.AMD_API_KEY)

TONE_PROMPTS = {
    "URGENT": "immediate, apologetic, action-oriented. Acknowledge severity, offer direct escalation or immediate help. Keep under 3 sentences.",
    "HIGH": "professional, prompt, helpful. Provide clear next steps. Keep under 3 sentences.",
    "NORMAL": "friendly, casual, conversational. Be warm and helpful. Keep under 3 sentences.",
    "LOW": "brief, warm acknowledgment. No need for lengthy response. 1-2 sentences."
}

def classify_priority(content: str) -> str:
    response = client.chat.completions.create(
        model=config.MODEL,
        messages=[{
            "role": "system",
            "content": "You are a WhatsApp Business priority classifier. Classify as exactly one of: URGENT, HIGH, NORMAL, LOW. Reply with ONLY the label, no explanation."
        }, {
            "role": "user",
            "content": content
        }],
        temperature=0.1,
        max_tokens=10
    )
    result = response.choices[0].message.content.strip().upper()
    return result if result in ["URGENT", "HIGH", "NORMAL", "LOW"] else "NORMAL"

def generate_reply(content: str, priority: str) -> str:
    tone = TONE_PROMPTS.get(priority, "professional")
    response = client.chat.completions.create(
        model=config.MODEL,
        messages=[{
            "role": "system",
            "content": f"You are a WhatsApp Business assistant. The customer message is marked {priority} priority. Write a reply with this tone: {tone}"
        }, {
            "role": "user",
            "content": content
        }],
        temperature=0.7,
        max_tokens=150
    )
    return response.choices[0].message.content.strip()
