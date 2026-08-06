import os
from dotenv import load_dotenv
load_dotenv()

def _get_api_key():
    key = os.getenv("AMD_API_KEY", "")
    if not key or "your_" in key.lower() or "actual" in key.lower():
        raise ValueError("Set your real AMD_API_KEY in backend/.env")
    return key

def _get_base_url():
    return os.getenv("BASE_URL", "https://developer.amd.com.cn/radeon/api/v1")

def _get_model():
    return os.getenv("MODEL", "Qwen/Qwen2.5-7B-Instruct")

def _get_database_url():
    return os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/whatsapp_agent")

# Lazy properties - only evaluated when accessed
class Config:
    @property
    def AMD_API_KEY(self):
        return _get_api_key()
    
    @property
    def BASE_URL(self):
        return _get_base_url()
    
    @property
    def MODEL(self):
        return _get_model()
    
    @property
    def DATABASE_URL(self):
        return _get_database_url()

config = Config()

# Backwards-compatible direct access for database.py
DATABASE_URL = _get_database_url()
