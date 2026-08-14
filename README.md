# 粤语学习工具 - Cantonese Learning Tool

粤语 Jyutping 可视化学习工具，点击汉字即可听发音。

## 功能特性

- 🎨 彩色声调卡片 - 直观显示粤语六调
- 🔊 点击发音 - 内置语音合成功能
- 📊 Jyutping 标注 - 自动转换中文文本
- 📥 导出 CSV/Anki - 方便离线学习
- 🎵 声调对照表 - 完整教学参考

## 在线演示

👉 [访问部署版本](https://cantonese-learning.onrender.com)

## 本地运行

```bash
cd jyutoing
npm install
npm start
# 访问 http://localhost:3000
```

## 部署到 Render

详见 [DEPLOY.md](DEPLOY.md)

## 技术栈

- 纯前端实现 (HTML/CSS/JS)
- Web Speech API 语音合成
- Express.js 服务器
- 零依赖，可离线使用
