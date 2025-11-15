"""Redis缓存工具"""
import redis
import json
from typing import Optional, Any
from app.config import settings

# 创建Redis连接
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True
)


def get_cache(key: str) -> Optional[Any]:
    """获取缓存"""
    value = redis_client.get(key)
    if value:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return None


def set_cache(key: str, value: Any, expire: int = 3600) -> bool:
    """设置缓存"""
    try:
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return redis_client.setex(key, expire, value)
    except Exception:
        return False


def delete_cache(key: str) -> bool:
    """删除缓存"""
    return redis_client.delete(key) > 0


def exists_cache(key: str) -> bool:
    """检查缓存是否存在"""
    return redis_client.exists(key) > 0

