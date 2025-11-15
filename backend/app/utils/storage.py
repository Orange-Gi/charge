"""文件存储工具（MinIO）"""
from datetime import timedelta
from minio import Minio
from minio.error import S3Error
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("storage")

# 创建MinIO客户端
minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False  # 生产环境应使用True
)


def ensure_bucket(bucket_name: str = None):
    """确保存储桶存在"""
    bucket = bucket_name or settings.MINIO_BUCKET
    try:
        if not minio_client.bucket_exists(bucket):
            minio_client.make_bucket(bucket)
            logger.info("创建存储桶", bucket=bucket)
    except S3Error as e:
        logger.error("存储桶操作失败", error=str(e))
        raise


def upload_file(file_path: str, object_name: str, bucket_name: str = None) -> str:
    """上传文件"""
    bucket = bucket_name or settings.MINIO_BUCKET
    ensure_bucket(bucket)
    
    try:
        minio_client.fput_object(bucket, object_name, file_path)
        logger.info("文件上传成功", object_name=object_name, bucket=bucket)
        return object_name
    except S3Error as e:
        logger.error("文件上传失败", error=str(e))
        raise


def download_file(object_name: str, file_path: str, bucket_name: str = None):
    """下载文件"""
    bucket = bucket_name or settings.MINIO_BUCKET
    try:
        minio_client.fget_object(bucket, object_name, file_path)
        logger.info("文件下载成功", object_name=object_name)
    except S3Error as e:
        logger.error("文件下载失败", error=str(e))
        raise


def delete_file(object_name: str, bucket_name: str = None):
    """删除文件"""
    bucket = bucket_name or settings.MINIO_BUCKET
    try:
        minio_client.remove_object(bucket, object_name)
        logger.info("文件删除成功", object_name=object_name)
    except S3Error as e:
        logger.error("文件删除失败", error=str(e))
        raise


def get_file_url(object_name: str, bucket_name: str = None, expires: int = 3600) -> str:
    """获取文件访问URL"""
    bucket = bucket_name or settings.MINIO_BUCKET
    try:
        url = minio_client.presigned_get_object(bucket, object_name, expires=timedelta(seconds=expires))
        return url
    except S3Error as e:
        logger.error("获取文件URL失败", error=str(e))
        raise

