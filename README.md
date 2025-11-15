# 充电分析系统

基于React Native前端和LangGraph Python后端的智能充电分析平台。

## 项目结构

```
charge/
├── backend/          # Python后端
├── frontend/          # React Native前端
└── docs/             # 文档
```

## 功能特性

- ✅ 用户注册登录
- ✅ 充电分析（基于LangGraph Agent）
- ✅ RAG知识管理（ChromaDB + BGE）
- ✅ 训练管理（1.5B流程控制模型）
- ✅ 日志管理
- ✅ 权限控制（管理员/普通用户）

## 快速开始

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 前端

```bash
cd frontend
npm install
npm start
```

## 文档

- [系统架构文档](docs/01-系统架构文档.md)
- [系统设计文档](docs/02-系统设计文档.md)
- [模块实现文档](docs/03-模块实现文档.md)

## 技术栈

### 后端
- FastAPI
- LangGraph
- ChromaDB
- PostgreSQL
- Redis
- MinIO

### 前端
- React Native
- Redux Toolkit
- React Navigation
- React Native Paper

