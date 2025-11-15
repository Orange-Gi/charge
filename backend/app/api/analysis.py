"""充电分析API"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.task import AnalysisTask
from app.services.analysis_service import AnalysisService
import uuid
from app.logging.logger import get_logger

logger = get_logger("analysis_api")
router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """上传BLF文件"""
    # 验证文件类型
    if not file.filename.endswith('.blf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只支持BLF文件"
        )
    
    service = AnalysisService(db)
    task = await service.create_task(
        user_id=current_user.id,
        file_name=file.filename,
        file_content=await file.read()
    )
    
    return {
        "task_id": str(task.id),
        "file_name": task.file_name,
        "file_size": task.file_size,
        "status": task.status
    }


@router.post("/start/{task_id}")
async def start_analysis(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """开始分析"""
    service = AnalysisService(db)
    task = await service.start_analysis(task_id, current_user.id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    
    return {
        "task_id": str(task.id),
        "status": task.status
    }


@router.get("/{task_id}/progress")
async def get_progress(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取分析进度"""
    service = AnalysisService(db)
    progress = await service.get_progress(task_id, current_user.id)
    
    if progress is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    
    return progress


@router.get("/{task_id}/result/stream")
async def get_result_stream(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取分析结果（流式）"""
    service = AnalysisService(db)
    
    async def generate():
        async for chunk in service.stream_result(task_id, current_user.id):
            yield f"data: {chunk}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )


@router.get("/{task_id}/report")
async def get_report(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取分析报告"""
    service = AnalysisService(db)
    report = await service.get_report(task_id, current_user.id)
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="报告不存在"
        )
    
    return report

