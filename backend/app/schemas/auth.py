"""认证相关的Pydantic模式"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    """注册请求"""
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    """登录请求"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """令牌响应"""
    user_id: str
    username: str
    role: str
    token: str
    refresh_token: str
    expires_in: int


class UserResponse(BaseModel):
    """用户信息响应"""
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True

