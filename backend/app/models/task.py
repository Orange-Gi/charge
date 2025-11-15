"""任务模型"""
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database import Base


class AnalysisTask(Base):
    """分析任务表"""
    __tablename__ = "analysis_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    status = Column(String(20), nullable=False, default='pending', index=True)  # pending, processing, completed, failed
    progress = Column(Integer, default=0)
    result_path = Column(String(500))
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime)
    
    def __repr__(self):
        return f"<AnalysisTask(id={self.id}, file_name={self.file_name}, status={self.status})>"

