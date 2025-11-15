# 充电分析系统 - 前端

基于 Expo Router 的 React Native 应用。

## 项目结构

```
frontend/
├── app/                    # Expo Router 文件系统路由
│   ├── _layout.tsx        # 根布局
│   ├── (tabs)/            # 标签页路由组
│   │   ├── _layout.tsx    # 标签页布局
│   │   ├── index.tsx      # 首页
│   │   ├── explore.tsx    # 对话
│   │   ├── guidance.tsx   # 充电分析
│   │   ├── rag.tsx        # RAG管理
│   │   ├── training.tsx   # 训练管理
│   │   ├── logs.tsx       # 日志管理
│   │   └── modal.tsx      # 模态页面
│   ├── login.tsx          # 登录页
│   └── register.tsx       # 注册页
├── src/                    # 源代码
│   ├── components/        # 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # API 服务
│   ├── store/             # Redux 状态管理
│   └── types/             # TypeScript 类型
├── assets/                 # 静态资源
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 运行平台

- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

## 技术栈

- **Expo Router**: 文件系统路由
- **React Native**: 跨平台框架
- **Redux Toolkit**: 状态管理
- **TypeScript**: 类型安全
- **React Native Paper**: UI 组件库

## 路由说明

- `/(tabs)/index` - 首页
- `/(tabs)/explore` - 对话
- `/(tabs)/guidance` - 充电分析
- `/(tabs)/rag` - RAG管理（仅管理员）
- `/(tabs)/training` - 训练管理（仅管理员）
- `/(tabs)/logs` - 日志管理（仅管理员）
- `/login` - 登录
- `/register` - 注册

