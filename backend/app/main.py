"""FastAPI应用入口"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.logging.logger import configure_logging, get_logger
from app.api import auth, analysis, training, rag, logs

# 配置日志
configure_logging()
logger = get_logger("main")

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="智能充电分析系统API"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["充电分析"])
app.include_router(training.router, prefix="/api/v1/training", tags=["训练管理"])
app.include_router(rag.router, prefix="/api/v1/rag", tags=["RAG管理"])
app.include_router(logs.router, prefix="/api/v1/logs", tags=["日志管理"])


@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    logger.info("应用启动", version=settings.APP_VERSION)


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    logger.info("应用关闭")


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}

