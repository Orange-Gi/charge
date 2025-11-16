"""FastAPI应用入口"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config import settings
from app.logging.logger import configure_logging, get_logger
from app.database import engine, Base
from app.api import auth, analysis, training, rag, logs
import traceback

# 配置日志
configure_logging()
logger = get_logger("main")

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="智能充电分析系统API"
)

# CORS中间件 - 必须在其他中间件之前
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 开发服务器
        "http://localhost:3000",  # 备用端口
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
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
    # 初始化数据库表（如不存在）
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("数据库初始化完成（建表）")
    except Exception as e:
        logger.error("数据库初始化失败", error=str(e))


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


# 全局异常处理
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理器，确保所有错误都包含 CORS 头"""
    logger.error("未处理的异常", error=str(exc), traceback=traceback.format_exc())
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "内部服务器错误",
            "error": str(exc) if settings.DEBUG else "服务器内部错误"
        },
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """HTTP 异常处理器"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """请求验证异常处理器"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

