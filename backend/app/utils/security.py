"""安全工具：JWT、密码加密等"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_for_bcrypt(plain: str) -> str:
    """
    将密码按 bcrypt 的 72 字节限制进行截断。
    注意：bcrypt 仅使用前 72 字节；超出部分将被忽略。
    为避免库抛错，这里在入库哈希与校验时统一截断。
    """
    raw = plain.encode("utf-8")
    if len(raw) <= 72:
        return plain
    raw = raw[:72]
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        # 若截断处落在多字节字符中，忽略不完整字节
        return raw.decode("utf-8", errors="ignore")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    safe_plain = _truncate_for_bcrypt(plain_password)
    return pwd_context.verify(safe_plain, hashed_password)


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    safe_plain = _truncate_for_bcrypt(password)
    return pwd_context.hash(safe_plain)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """创建刷新令牌"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """解码令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

