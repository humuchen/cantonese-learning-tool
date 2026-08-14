# 粤语学习工具 - Cantonese Learning Tool

## 🎯 功能特性

### 1. 可视化拼音标注
- 输入中文文本，自动转换为 Jyutping 拼音
- 彩色字符卡片，点击即可发音
- 声调颜色标识，一目了然

### 2. 语音合成 (TTS)
- 点击汉字卡片播放粤语发音
- 支持整句播放
- 支持慢速播放（学习模式）
- 基于 Web Speech API + Google Translate TTS 备选

### 3. 声调速查表
- 九声六调完整说明
- 点击示例字听发音

### 4. 数据导出
- 导出 CSV 对照表
- 导出 Anki 牌组

---

## 🚀 快速开始

### 方法一：直接打开 HTML（推荐）
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 方法二：使用本地服务器
```bash
npm start
# 访问 http://localhost:3000
```

---

## 📁 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主界面 |
| `style.css` | 样式表 |
| `app.js` | 应用逻辑 |
| `jyutping_data.js` | 粤语拼音数据 |
| `README.md` | 使用说明 |
| `package.json` | 项目配置 |

---

## 🔊 语音支持

**重要**：语音功能需要系统安装粤语语音包。

### Windows 安装粤语语音
1. 设置 → 时间和语言 → 语音
2. 添加语言 → 选择「中文（香港特别行政区）」
3. 下载语音包

### macOS 安装粤语语音
1. 系统偏好设置 → 语音识别 → 语音
2. 点击「+」添加粤语（广东话）

### Linux
```bash
# Ubuntu/Debian
sudo apt install espeak-ng-data
```

---

## 🎵 声调说明

| 调号 | 调值 | 名称 | 颜色 | 例字 |
|------|------|------|------|------|
| 1 | 55 | 高平调 | 🔴 红 | 诗 si1 |
| 2 | 35 | 高升调 | 🟠 橙 | 史 si2 |
| 3 | 33 | 中平调 | 🟡 黄 | 试 si3 |
| 4 | 21 | 低降调 | 🟢 绿 | 是 si4 |
| 5 | 23 | 低升调 | 🔵 蓝 | 屎 si5 |
| 6 | 22 | 低平调 | 🟣 紫 | 事 si6 |

> **入声字**（-p / -t / -k 结尾）复用 1、3、6 调号，发音短促。

---

## 💻 技术栈

- 纯前端实现（HTML/CSS/JS）
- Web Speech API 语音合成
- Google Translate TTS 备选
- 零依赖，无需构建
- 可离线使用

---

## 📝 使用示例

1. 在输入框输入：`你好我好大家`
2. 点击「分析拼音」
3. 点击任意汉字卡片听发音
4. 点击「整句播放」听完整句子
5. 点击「导出 CSV/Anki」保存数据

---

## 🔧 后端脚本（可选）

如果需要命令行工具：

```bash
# 分析文本
node dist/jyutping_tool.js "我係广州人"

# 导出 CSV
node dist/jyutping_tool.js "啱啱食咗饭未" --csv output.csv

# 生成 Anki 牌组
node dist/anki_generator.js "你好我好大家" --anki deck.csv
```
