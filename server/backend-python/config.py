import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'asdf#FGSgvasgf$5$WGT'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f"sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI API Keys
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    HUGGINGFACE_API_KEY = os.environ.get('HUGGINGFACE_API_KEY')
    
    # External APIs
    N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL')
    GOOGLE_DRIVE_CREDENTIALS = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
    GOOGLE_SHEETS_CREDENTIALS = os.environ.get('GOOGLE_SHEETS_CREDENTIALS')
    NOTION_API_KEY = os.environ.get('NOTION_API_KEY')
    AIRTABLE_API_KEY = os.environ.get('AIRTABLE_API_KEY')

