"""RAG管理API（仅管理员）"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.dependencies import require_admin
from app.models.user import User

router = APIRouter()


@router.get("/knowledge")
async def list_knowledge(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """获取知识库列表"""
    # TODO: 实现知识库列表
    return {"knowledge": []}


@router.post("/knowledge")
async def upload_knowledge(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """上传知识文档"""
    # TODO: 实现知识文档上传
    return {"message": "知识文档上传功能待实现"}

