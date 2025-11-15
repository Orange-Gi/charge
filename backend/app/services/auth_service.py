"""认证服务"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.utils.security import get_password_hash, verify_password
from app.logging.logger import get_logger

logger = get_logger("auth_service")


class AuthService:
    """认证服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def register(self, username: str, email: str, password: str) -> User | None:
        """用户注册"""
        # 检查用户名是否已存在
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        if result.scalar_one_or_none():
            logger.warning("用户名已存在", username=username)
            return None
        
        # 检查邮箱是否已存在
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        if result.scalar_one_or_none():
            logger.warning("邮箱已存在", email=email)
            return None
        
        # 创建新用户
        user = User(
            username=username,
            email=email,
            password_hash=get_password_hash(password),
            role='user'
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        logger.info("用户注册成功", user_id=str(user.id), username=username)
        return user
    
    async def login(self, username: str, password: str) -> User | None:
        """用户登录"""
        # 查找用户
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.warning("用户不存在", username=username)
            return None
        
        # 验证密码
        if not verify_password(password, user.password_hash):
            logger.warning("密码错误", username=username)
            return None
        
        # 检查用户是否激活
        if not user.is_active:
            logger.warning("用户未激活", username=username)
            return None
        
        logger.info("用户登录成功", user_id=str(user.id), username=username)
        return user
    
    async def get_user_by_id(self, user_id: str) -> User | None:
        """根据ID获取用户"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_username(self, username: str) -> User | None:
        """根据用户名获取用户"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()

