from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/consulta_judicial"
    
    # Seguridad
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # RabbitMQ
    RABBITMQ_URL: str = "amqp://admin:password@localhost:5672/"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@consultajudicial.com"
    
    # Entorno
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # RPA
    RAMA_JUDICIAL_URL: str = "https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion"
    HEADLESS_BROWSER: bool = True
    SELENIUM_TIMEOUT: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
