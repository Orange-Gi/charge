"""应用配置管理"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用基础配置
    APP_NAME: str = "充电分析系统"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # 数据库配置
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/charge_db"
    
    # Redis配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # 文件存储配置
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "charge-files"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    # LLM配置
    LLM_API_KEY: Optional[str] = None
    LLM_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4"
    
    # 流程控制模型配置
    FLOW_MODEL_PATH: str = "./models/flow_model_1.5b"
    
    # RAG配置
    CHROMADB_PATH: str = "./data/chromadb"
    EMBEDDING_MODEL: str = "BAAI/bge-base-zh-v1.5"
    
    # 训练配置
    TRAINING_OUTPUT_DIR: str = "./models/training"
    TRAINING_DEVICE: str = "cuda"  # 或 "cpu"
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

