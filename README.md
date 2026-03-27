# Seedance 2.0 AI 视频生成

> 基于字节跳动即梦平台 Seedance 2.0 模型的 AI 视频生成 Web 应用

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v0.0.4-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Docker](https://img.shields.io/badge/Docker-supported-2496ED.svg)

---

## 项目介绍

Seedance 2.0 Web 是一款面向内容创作者、设计师、营销人员的 AI 视频生成工具。用户只需上传 1-5 张参考图片，配合自然语言描述，即可通过即梦（jimeng.jianying.com）平台的 Seedance 2.0 模型生成高质量 AI 视频。

后端直接对接即梦 API，无需依赖 jimeng-free-api 等中间代理服务，架构简洁、部署方便，支持 Docker 一键部署。

**最新功能（v0.0.4）：**
- 用户认证系统：支持邮箱注册、登录、密码修改
- 左侧菜单导航：响应式设计，支持移动端
- 管理员后台：用户管理、积分管理、系统统计
- 积分系统：每日签到、积分充值、生成扣减
- 批量生成：支持多任务并发、定时调度
- 下载管理：批量下载、历史记录、文件夹管理
- Playwright 浏览器代理：自动绕过即梦 shark 反爬机制，通过 bdms SDK 注入 `a_bogus` 签名



 公众号文章：[2026年2月炸场！手把手教你Docker一键部署Seedance 2.0双模型Web应用](https://mp.weixin.qq.com/s/pJxVS84wYI7cBoHxNJ_F_w)

​                        [Sora关闭后，字节Seedance 2.0全球铺路！批量生成视频从此无需等待](https://mp.weixin.qq.com/s/iRk2XOnz3VDHYWNj0p2BXg)

 项目体验地址 https://seedance2.duckcloud.fun/

![image-20260214150856225](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260214150856225.png)

由于 Seedance 2.0 太火爆了，本人积分也有限，需要体验可以设置自己的 Session ID，体验完成后把 Session ID 删除

![image-20260214151003775](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260214151003775.png)

### 核心亮点

- 双模型可选：Seedance 2.0（高质量）/ Seedance 2.0 Fast（快速生成）
- 多图全能参考：最多 5 张参考图，`@1` `@2` 占位符灵活引用
- 异步任务架构：提交即返回，后台生成 + 实时进度反馈
- 视频代理播放：自动绕过 CDN CORS 限制，生成即可预览下载
- 浏览器代理反爬：Playwright 无头浏览器自动注入 `a_bogus` 签名，绕过即梦 shark 反爬机制
- 用户认证系统：邮箱注册登录、积分管理、每日签到
- 左侧菜单导航：桌面端可展开收起，移动端抽屉式响应式
- 管理员后台：用户管理、积分充值、状态控制、系统统计
- 批量生成管理：支持多任务并发、定时调度、进度追踪
- 下载管理系统：批量下载、历史记录、文件夹管理

## 功能清单

| 功能模块 | 功能项 | 优先级 | 说明 |
|---------|------|--------|------|
| 用户认证 | 邮箱注册 | P0 | 支持邮箱验证码注册 |
| 用户认证 | 用户登录 | P0 | 邮箱 + 密码登录 |
| 用户认证 | 修改密码 | P1 | 支持登录后修改密码 |
| 积分系统 | 每日签到 | P1 | 每日签到领积分 |
| 积分系统 | 积分充值 | P1 | 管理员可充值积分 |
| 系统管理 | 用户管理 | P1 | 管理员管理用户 |
| 系统管理 | 系统统计 | P1 | 查看系统运行数据 |
| 图片管理 | 图片上传 | P0 | 支持点击/拖拽上传 1-5 张 |
| 图片管理 | 图片预览 | P0 | 缩略图预览，显示引用索引 |
| 图片管理 | 图片删除 | P0 | 单张删除和全部清除 |
| 提示词 | 文本输入 | P0 | 支持 5000 字符，支持@引用语法 |
| 视频配置 | 参考模式选择 | P0 | 全能参考、首帧参考、尾帧参考 |
| 视频配置 | 画面比例选择 | P0 | 6 种预设比例 |
| 视频配置 | 时长选择 | P0 | 4-15 秒可选 |
| 视频生成 | 异步生成 | P0 | 后台生成，实时进度反馈 |
| 视频展示 | 视频播放 | P0 | 自动播放，循环播放 |
| 视频展示 | 视频下载 | P0 | 一键下载 MP4 格式 |
| 批量生成 | 项目管理 | P1 | 创建项目、任务 |
| 批量生成 | 批量生成 | P1 | 多任务并发执行 |
| 下载管理 | 下载列表 | P1 | 分页展示下载任务 |
| 下载管理 | 批量下载 | P1 | 一键下载多个视频 |
| 下载管理 | 打开文件夹 | P1 | 下载完成后打开文件夹 |
| 系统设置 | SessionID 配置 | P0 | 支持环境变量和界面配置 |
| 系统设置 | 响应式布局 | P0 | 桌面端左右分栏，移动端自适应 |
| 系统设置 | Docker 部署 | P1 | 多阶段构建，docker compose 一键启动 |

## 安装说明

### 环境要求

- **Node.js** >= 18（本地开发）或 **Docker**（容器部署）
- **Chromium 浏览器**（由 Playwright-core 驱动，用于绕过 shark 反爬）
- 有效的即梦平台 **SessionID**（从 `jimeng.jianying.com` Cookie 获取）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/wwwzhouhui/seedance2.0.git
cd seedance

# 2. 安装所有依赖（前端 + 后端）
npm run install:all

# 3. 安装 Chromium（Playwright 无头浏览器，用于绕过反爬）
npx playwright-core install chromium

# 4. 配置环境变量
cp .env.example .env
```

编辑 `.env` 文件：

```env
# jimeng-free-api base URL
#VITE_API_BASE_URL=https://jimeng.duckcloud.fun
# Default jimeng sessionid (optional, can be set in UI)
VITE_DEFAULT_SESSION_ID=aabbddddddddddddddd
# Express proxy port
PORT=3001

# ==================== 邮件服务 (SMTP) ====================
# 163 邮箱 SMTP 配置
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=xxxxx@163.com
SMTP_PASS=xxxxx
SMTP_FROM=xxxx@163.com
SMTP_FROM_NAME=Seedance 2.0
SMTP_TLS_REJECT_UNAUTHORIZED=true
```

## 使用说明

### 快速开始

```bash
# 启动开发模式（同时启动前端 :5173 + 后端 :3001）
npm run dev
```

浏览器访问 `http://localhost:5173`

也可单独启动：

```bash
npm run dev:client   # 仅启动 Vite 前端 (:5173)
npm run dev:server   # 仅启动 Express 后端 (:3001)
```

### 配置说明

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `VITE_DEFAULT_SESSION_ID` | 即梦 sessionid | 空（界面设置） |
| `PORT` | Express 后端端口 | `3001` |

**SessionID 优先级**：请求体中的 `sessionId` > `.env` 中的 `VITE_DEFAULT_SESSION_ID`

### 使用示例

#### 首次使用（注册/登录）

1. 访问登录页面，点击「立即注册」

2. 输入邮箱地址，获取验证码（开发环境下验证码显示在控制台）

3. 设置密码（至少 8 位，包含数字和字母）

4. 注册成功后自动登录

   ![image-20260326204124863](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260326204124863.png)

#### 配置 SessionID

1. 访问 [即梦 AI](https://jimeng.jianying.com/) 并登录账号

2. 按 F12 打开开发者工具

   ![](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260214171018999.png)

3. 进入 Application > Cookies

4. 找到 `sessionid` 的值

5. 在 Seedance 2.0 设置页面中填入 SessionID

   ![获取 sessionid](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/example-0.png)

#### 生成视频

1. 选择模型：Seedance 2.0（高质量）或 Seedance 2.0 Fast（快速）
2. 上传参考图片（至少 1 张，最多 5 张）
3. 在提示词框中描述视频场景，使用 `@1`、`@2` 引用对应图片
4. 选择参考模式、画面比例和视频时长
5. 点击「生成视频」按钮，等待生成完成
6. 生成完成后自动播放，悬停视频右上角可下载

#### 管理员功能

1. 使用管理员账号登录（默认：`admin@seedance.com` / `admin123456`）

2. 点击左侧菜单「管理后台」

3. 查看系统统计、用户列表

4. 对用户进行启用/禁用、积分修改、密码重置等操作

   ![image-20260326205549431](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260326205549431.png)

## 项目结构

```
seedance/
├── package.json                # 前端依赖与脚本
├── vite.config.ts              # Vite 配置（开发代理 /api → :3001）
├── tsconfig.json               # TypeScript 配置（strict 模式）
├── tailwind.config.js          # Tailwind CSS 主题配置
├── postcss.config.js           # PostCSS 配置
├── index.html                  # HTML 入口
├── .env.example                # 环境变量模板
├── Dockerfile                  # Docker 多阶段构建
├── docker-compose.yml          # Docker Compose 编排
├── .dockerignore               # Docker 构建排除
├── server/
│   ├── package.json            # 后端独立依赖
│   ├── index.js                # Express 后端
│   ├── browser-service.js      # 浏览器代理服务
│   ├── database/
│   │   ├── index.js            # 数据库初始化
│   │   └── schema.sql          # 数据库结构
│   └── services/
│       ├── authService.js      # 用户认证服务
│       ├── projectService.js   # 项目 CRUD
│       ├── taskService.js      # 任务 CRUD
│       ├── batchScheduler.js   # 批量任务调度器
│       ├── videoDownloader.js  # 视频下载服务
│       └── videoGenerator.js   # 视频生成核心
├── src/
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件（路由 + 认证 + 布局）
│   ├── types.ts                # 类型定义与常量
│   ├── services/
│   │   ├── authService.ts      # 用户认证服务
│   │   ├── videoService.ts     # 视频生成服务
│   │   ├── projectService.ts   # 项目管理服务
│   │   ├── batchService.ts     # 批量生成服务
│   │   └── downloadService.ts  # 下载管理服务
│   ├── components/
│   │   ├── Sidebar.tsx         # 左侧菜单导航
│   │   ├── VideoPlayer.tsx     # 视频播放组件
│   │   ├── SettingsModal.tsx   # 设置弹窗
│   │   └── Icons.tsx           # SVG 图标组件
│   ├── pages/
│   │   ├── LoginPage.tsx       # 登录页面
│   │   ├── RegisterPage.tsx    # 注册页面
│   │   ├── SingleTaskPage.tsx  # 单任务页面
│   │   ├── BatchManagement.tsx # 批量管理页面
│   │   ├── DownloadManagement.tsx # 下载管理页面
│   │   └── AdminPage.tsx       # 管理员后台页面
│   └── context/
│       └── AppContext.tsx      # 全局状态管理
└── doc/
    ├── PRD.md                  # 产品需求文档
    ├── 概要设计.md              # 概要设计文档
    ├── 详细设计.md              # 详细设计文档
    └── 数据字典.md              # 数据字典
```

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | 前端 UI 框架 |
| TypeScript | 5.6+ | 前端类型系统（strict 模式） |
| Vite | 6 | 前端构建工具 |
| Tailwind CSS | 3.4 | 原子化 CSS 样式方案 |
| Express | 4.21 | 后端 HTTP 服务 |
| Multer | 1.4 | 文件上传中间件 |
| Playwright-core | 1.49+ | 无头浏览器，绕过 shark 反爬 |
| better-sqlite3 | - | SQLite 数据库 |
| Docker | - | 容器化部署 |

## 架构说明

```
用户浏览器                    Express 后端                    即梦 API
     │                          │                              │
     │ 登录/注册请求            │                              │
     │ ────────────────────────>│                              │
     │                          │ 验证用户信息                  │
     │ SessionID                │ 存入数据库                    │
     │ <────────────────────────│                              │
     │                          │                              │
     │ POST /api/generate-video │                              │
     │ (multipart form-data)    │                              │
     │ ────────────────────────>│                              │
     │                          │ 上传图片到 ImageX CDN          │
     │                          │ ────────────────────────────>│
     │                          │                              │
     │      { taskId }          │ 提交生成任务                  │
     │ <────────────────────────│ ─── Playwright 浏览器代理 ──>│
     │                          │  (bdms SDK 自动注入 a_bogus)  │
     │                          │                              │
     │ GET /api/task/:taskId    │ 轮询生成状态                  │
     │ (前端每 3 秒轮询)           │ ────────────────────────────>│
     │ ────────────────────────>│                              │
     │    { status, result }    │ 获取高清视频 URL              │
     │ <────────────────────────│ <────────────────────────────│
     │                          │                              │
     │ GET /api/video-proxy     │ 代理视频流（绕过 CORS）       │
     │ ────────────────────────>│ ────────────────────────────>│
     │     video stream         │                              │
     │ <────────────────────────│                              │
```

## 数据库表结构

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `users` | 用户表 | id, email, password_hash, role, status, credits |
| `sessions` | 会话表 | session_id, user_id, expires_at |
| `check_ins` | 签到记录 | user_id, credits_earned, created_at |
| `projects` | 项目表 | id, name, description, settings_json |
| `tasks` | 任务表 | id, project_id, prompt, status, video_url, download_status |
| `batches` | 批量任务表 | id, project_id, task_ids, status, concurrent_count |
| `settings` | 全局设置 | key, value, updated_at |

## API 接口

### 认证相关

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/auth/password` | PUT | 修改密码 |
| `/api/auth/email-code` | POST | 发送邮箱验证码 |

### 视频生成

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/generate-video` | POST | 提交视频生成任务 |
| `/api/task/:taskId` | GET | 查询任务状态 |
| `/api/video-proxy?url=` | GET | 代理视频流 |

### 批量生成

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/batch/generate` | POST | 创建并启动批量任务 |
| `/api/batch/:batchId/status` | GET | 获取批量任务状态 |
| `/api/batch/:batchId/cancel` | POST | 取消批量任务 |

### 下载管理

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/download/tasks` | GET | 获取下载任务列表 |
| `/api/download/tasks/:id` | POST | 下载单个视频 |
| `/api/download/batch` | POST | 批量下载 |
| `/api/download/tasks/:id/open` | POST | 打开文件夹 |

### 管理员接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/admin/stats` | GET | 系统统计 |
| `/api/admin/users` | GET | 用户列表 |
| `/api/admin/users/:id/status` | PUT | 更新用户状态 |
| `/api/admin/users/:id/credits` | PUT | 修改用户积分 |
| `/api/admin/users/:id/password` | PUT | 重置用户密码 |

## 开发指南

### 本地开发

```bash
# 安装依赖
npm run install:all

# 启动开发服务（前端热更新 + 后端）
npm run dev

# 仅类型检查
npx tsc --noEmit
```

### 构建部署

#### 方式一：直接部署

```bash
# 构建前端
npm run build

# 启动生产服务
npm start
```

生产模式下 Express 监听 `3001` 端口，同时提供 `dist/` 静态文件服务和 API 接口。

#### 方式二：Docker 部署（推荐）

**使用 docker compose：**

```bash
# 配置环境变量
cp .env.example .env

# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

## 常见问题

<details>
<summary>如何获取即梦 SessionID？</summary>

1. 浏览器访问 [jimeng.jianying.com](https://jimeng.jianying.com) 并登录
2. 打开浏览器开发者工具（F12）→ Application → Cookies
3. 找到 `sessionid` 字段，复制其值
4. 填入 `.env` 文件或在界面设置弹窗中粘贴

</details>

<details>
<summary>默认管理员账号是什么？</summary>

- 邮箱：`admin@seedance.com`
- 密码：`admin123456`

**请务必在首次登录后修改密码！**

</details>

<details>
<summary>如何给用户充值积分？</summary>

1. 使用管理员账号登录
2. 进入管理后台
3. 找到目标用户，点击「编辑」
4. 选择操作类型（设置/增加/减少），输入积分数量
5. 点击保存

</details>

<details>
<summary>视频生成失败提示「积分不足」？</summary>

即梦平台生成视频需要消耗积分，请前往 [jimeng.jianying.com](https://jimeng.jianying.com) 官网领取或购买积分后重试。

</details>

## 技术交流群

欢迎加入技术交流群，分享使用心得和创作成果：

![image-20260326222700716](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260326222700716.png)

## 作者联系

- **微信**: laohaibao2025
- **邮箱**: 75271002@qq.com

## 打赏

如果这个项目对你有帮助，欢迎请我喝杯咖啡 ☕

**微信支付**

![微信支付](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20250914152855543.png)

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.0.1 | 2025-02-14 | 初始版本，支持 Seedance 2.0 / Fast 双模型视频生成 |
| v0.0.2 | 2026-02-21 | 修复 shark not pass 反爬拦截：引入 Playwright 无头浏览器代理，通过 bdms SDK 自动注入 `a_bogus` 签名 |
| v0.0.3 | 2026-03-22 | 新增批量生成、下载管理功能；支持多任务并发、定时调度、进度追踪 |
| v0.0.4 | 2026-03-23 | 新增用户认证系统、左侧菜单导航、管理员后台；支持邮箱注册登录、积分管理、每日签到 |

## License

本项目基于 [MIT](LICENSE) 协议开源。

SPDX-License-Identifier: MIT
