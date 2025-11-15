"""训练管理API（仅管理员）"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.dependencies import require_admin
from app.models.user import User

router = APIRouter()


@router.get("/datasets")
async def list_datasets(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """获取数据集列表"""
    # TODO: 实现数据集列表
    return {"datasets": []}


@router.post("/datasets")
async def upload_dataset(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """上传数据集"""
    # TODO: 实现数据集上传
    return {"message": "数据集上传功能待实现"}


@router.get("/tasks")
async def list_training_tasks(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """获取训练任务列表"""
    # TODO: 实现训练任务列表
    return {"tasks": []}

