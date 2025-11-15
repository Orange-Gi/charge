"""充电分析服务"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import AnalysisTask
from app.agents.charging_agent import ChargingAgent
from app.logging.logger import get_logger
import tempfile
import os
from datetime import datetime

logger = get_logger("analysis_service")


class AnalysisService:
    """充电分析服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.agent = ChargingAgent()
    
    async def create_task(
        self,
        user_id: str,
        file_name: str,
        file_content: bytes
    ) -> AnalysisTask:
        """创建分析任务"""
        # 保存文件到临时目录
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.blf')
        temp_file.write(file_content)
        temp_file.close()
        
        # 创建任务记录
        task = AnalysisTask(
            user_id=user_id,
            file_name=file_name,
            file_path=temp_file.name,
            file_size=len(file_content),
            status='pending'
        )
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        
        logger.info("创建分析任务", task_id=str(task.id), file_name=file_name)
        return task
    
    async def start_analysis(self, task_id: str, user_id: str) -> AnalysisTask | None:
        """开始分析"""
        result = await self.db.execute(
            select(AnalysisTask).where(
                AnalysisTask.id == task_id,
                AnalysisTask.user_id == user_id
            )
        )
        task = result.scalar_one_or_none()
        
        if not task:
            return None
        
        if task.status != 'pending':
            logger.warning("任务状态不正确", task_id=task_id, status=task.status)
            return task
        
        # 更新任务状态
        task.status = 'processing'
        task.progress = 0
        await self.db.commit()
        
        # 异步执行分析（实际应该使用Celery任务队列）
        # 这里简化处理，实际应该提交到任务队列
        logger.info("开始分析任务", task_id=task_id)
        
        return task
    
    async def get_progress(self, task_id: str, user_id: str) -> dict | None:
        """获取分析进度"""
        result = await self.db.execute(
            select(AnalysisTask).where(
                AnalysisTask.id == task_id,
                AnalysisTask.user_id == user_id
            )
        )
        task = result.scalar_one_or_none()
        
        if not task:
            return None
        
        return {
            "task_id": str(task.id),
            "status": task.status,
            "progress": task.progress
        }
    
    async def stream_result(self, task_id: str, user_id: str):
        """流式返回分析结果"""
        # 这里应该从任务队列或缓存中获取流式结果
        # 简化实现
        yield '{"type": "thinking", "content": "正在分析..."}'
        yield '{"type": "response", "content": "分析完成"}'
    
    async def get_report(self, task_id: str, user_id: str) -> dict | None:
        """获取分析报告"""
        result = await self.db.execute(
            select(AnalysisTask).where(
                AnalysisTask.id == task_id,
                AnalysisTask.user_id == user_id
            )
        )
        task = result.scalar_one_or_none()
        
        if not task or task.status != 'completed':
            return None
        
        return {
            "task_id": str(task.id),
            "report_path": task.result_path,
            "summary": {}  # 从结果中解析
        }

