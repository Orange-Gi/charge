#!/bin/bash
# 本地运行后端服务（不使用 Docker）

echo "🚀 启动后端服务（本地模式）..."

# 检查 Python 版本
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python3，请先安装 Python 3.11+"
    exit 1
fi

# 进入后端目录
cd "$(dirname "$0")"

# 创建虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📥 安装依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 创建必要的目录
mkdir -p models data/chromadb

# 启动服务
echo "✅ 启动 FastAPI 服务..."
echo "📍 API 地址: http://localhost:8000"
echo "📍 API 文档: http://localhost:8000/docs"
echo ""
echo "⚠️  注意：此模式需要本地安装 PostgreSQL、Redis 和 MinIO"
echo "   或者修改配置使用云服务/远程服务"
echo ""

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

