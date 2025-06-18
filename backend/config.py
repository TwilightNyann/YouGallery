import os
from typing import Optional, List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@postgres:5432/yougallery")
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # MinIO
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "minio:9000")
    MINIO_EXTERNAL_ENDPOINT: str = os.getenv("MINIO_EXTERNAL_ENDPOINT", "localhost:9000")
    MINIO_ROOT_USER: str = os.getenv("MINIO_ROOT_USER", "minioadmin")
    MINIO_ROOT_PASSWORD: str = os.getenv("MINIO_ROOT_PASSWORD", "minioadmin123")
    MINIO_BUCKET_NAME: str = os.getenv("MINIO_BUCKET_NAME", "yougallery")
    MINIO_SECURE: bool = os.getenv("MINIO_SECURE", "false").lower() == "true"
    
    # API Base URL - важливо для генерації правильних URL зображень
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://127.0.0.1:3000",
    ]
    
    # Optional ngrok URL
    NGROK_URL: Optional[str] = os.getenv("NGROK_URL")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Add ngrok URLs if present
        if self.NGROK_URL:
            self.CORS_ORIGINS.extend([
                self.NGROK_URL,
                self.NGROK_URL.replace("http://", "https://"),
                self.NGROK_URL.replace("https://", "http://")
            ])

settings = Settings()
