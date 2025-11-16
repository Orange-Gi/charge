"""认证API"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.utils.security import create_access_token, create_refresh_token
from app.api.dependencies import get_current_user
from app.models.user import User
from datetime import timedelta
from app.config import settings

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """用户注册"""
    try:
        service = AuthService(db)
        user = await service.register(
            username=request.username,
            email=request.email,
            password=request.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名或邮箱已存在"
            )
        
        # 生成令牌
        access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            user_id=str(user.id),
            username=user.username,
            role=user.role,
            token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    except HTTPException:
        raise
    except Exception as e:
        from app.logging.logger import get_logger
        logger = get_logger("auth_api")
        logger.error("注册失败", error=str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"注册失败: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """用户登录"""
    service = AuthService(db)
    user = await service.login(
        username=request.username,
        password=request.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    # 生成令牌
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        user_id=str(user.id),
        username=user.username,
        role=user.role,
        token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return UserResponse(
        id=str(current_user.id),
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
        is_active=current_user.is_active
    )

