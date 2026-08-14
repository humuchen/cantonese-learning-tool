# 部署到 Render - 完整指南

## 📋 部署前准备

### 1. 创建 GitHub 仓库

```bash
# 在项目根目录执行
cd C:\Users\Administrator\Documents\HermesChat

# 添加 GitHub 远程仓库（替换为你的用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/cantonese-learning-tool.git

# 推送代码
git push -u origin master
```

### 2. 在 Render 创建服务

#### 步骤 1：注册/登录
- 访问 https://render.com
- 使用 GitHub 账号登录

#### 步骤 2：创建 Web Service
1. 点击 **New +** → **Public Web Service**
2. 选择刚才创建的仓库
3. 配置服务：

| 配置项 | 值 |
|--------|-----|
| Name | `cantonese-learning` |
| Root Directory | `jyutoing` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` |

4. 点击 **Create Web Service**

#### 步骤 3：等待部署
- 部署通常需要 2-5 分钟
- 完成后会显示绿色 ✓ 状态
- 访问生成的链接：`https://cantonese-learning.onrender.com`

---

## 🔧 替代方案

### 方案 A：使用 Render CLI（推荐）

```bash
# 安装 Render CLI
npm install -g @rendercloud/cli

# 登录
render login

# 创建服务
render init

# 部署
render up
```

### 方案 B：使用 Vercel（更简单）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目根目录部署
cd C:\Users\Administrator\Documents\HermesChat\jyutoing
vercel --prod
```

### 方案 C：使用 Netlify

1. 访问 https://app.netlify.com/drop
2. 拖拽整个 `jyutoing` 文件夹
3. 自动获得 HTTPS 链接

---

## 📝 Render 配置详情

### render.yaml
```yaml
services:
  - type: web
    name: cantonese-learning
    env: node
    buildCommand: npm install
    startCommand: npm start
    rootDir: jyutoing
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### package.json（已配置）
```json
{
  "name": "cantonese-learning-tool",
  "version": "2.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## ✅ 验证部署

部署完成后检查：
- [ ] 页面正常加载
- [ ] 输入中文能显示 Jyutping 拼音
- [ ] 彩色卡片正确显示声调颜色
- [ ] 点击汉字能播放发音（需要语音包）
- [ ] 导出 CSV/Anki 功能正常
- [ ] 示例文本可正常分析

---

## 🚨 常见问题

### Q: 部署失败怎么办？
**检查日志：**
1. 登录 Render 仪表板
2. 点击服务 → **Logs**
3. 查看错误信息

常见错误：
- `Cannot find module 'express'` → 检查 package.json
- `PORT environment variable not set` → Render 会自动设置
- `EADDRINUSE` → 端口已被占用

### Q: 语音无法播放？
这是**预期行为**，原因：
1. 云服务器没有粤语语音包
2. 浏览器安全策略限制自动播放

**解决方案：**
- 用户端安装粤语语音包
- 使用在线 TTS 备选方案（已实现）

### Q: 如何绑定自定义域名？
1. Render → 服务 → **Settings**
2. **Custom Domains** → 添加域名
3. 在 DNS 服务商添加 CNAME 记录

---

## 📊 免费额度

Render 免费层：
- ✅ 512 MB 内存
- ✅ 0.1 CPU 核心
- ✅ 每月 1000 小时运行时间
- ✅ 自动 HTTPS
- ✅ 自定义域名

适合个人项目、演示、测试。

---

## 🎯 快速部署命令

```bash
# 1. 初始化 Git（如果还没做）
cd C:\Users\Administrator\Documents\HermesChat
git init
git add -A
git commit -m "feat: 粤语学习工具 v2.0"

# 2. 创建 GitHub 仓库并推送
git remote add origin https://github.com/YOUR_USERNAME/cantonese-learning.git
git push -u origin master

# 3. 在 Render 创建服务（网页操作）
# 访问 https://dashboard.render.com/new
# 选择上面的仓库，按配置填写即可
```
