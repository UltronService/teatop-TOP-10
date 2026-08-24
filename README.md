# 🍵 Teatop TOP10 門市排行榜

![HTML](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

靜態網頁展示 **Teatop 茶飲連鎖** 的門市 TOP10 熱銷飲品排行榜，支援多門市切換、動畫展示和自動化部署。

## 🎯 功能特色

### 左側動畫輪播
- 展示 TOP1~5 飲品的動畫輪播
- 飲品圖片動畫效果：降落、旋轉、淡出
- 27 秒完整循環，無限重複

### 右側靜態列表
- 展示 TOP1~10 完整排行榜
- 包含中文名稱、英文名稱、價格（大杯）
- 與左側動畫同步高亮

### 多門市支援
- 支援三個門市：**台北門市**、**高雄門市**、**台中門市**
- URL 參數切換：`?region=台北門市`
- 本地存儲記憶用戶選擇

### 自動化部署
- **GitHub Actions CI/CD**：自動驗證和部署
- **Staging 環境**：develop 分支 → 測試部署
- **Production 環境**：main 分支 → 正式部署
- **Firebase Hosting**：全球 CDN 加速

---

## 🚀 快速開始

### 本地運行

```bash
# 1. 複製倉庫
git clone https://github.com/UltronService/teatop-TOP-10.git
cd "Teatop TOP10"

# 2. 啟動本地伺服器（選擇一種）
# 方式 A：使用 VSCode Live Server 插件
# 右鍵點擊 index.html → Open with Live Server

# 方式 B：使用 Node http-server
npx http-server -p 5500

# 3. 訪問網頁
open http://localhost:5500/?region=台北門市
```

### URL 參數

```
# 台北門市
http://localhost:5500/?region=台北門市

# 高雄門市
http://localhost:5500/?region=高雄門市

# 台中門市
http://localhost:5500/?region=台中門市
```

---

## 📁 專案結構

```
Teatop TOP10/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD 配置
├── data/
│   └── regions.json                # 門市資料（JSON 格式）
├── index.html                      # 主頁面
├── style.css                       # 動畫與排版樣式
├── script.js                       # 資料載入與動畫邏輯
├── firebase.json                   # Firebase 配置
├── AGENTS.md                       # 專案概述與技術棧
├── CHANGELOG.md                    # 版本變更日誌
├── CONTRIBUTING.md                 # 貢獻指南
├── DEPLOYMENT.md                   # 部署指南
└── README.md                       # 本檔案
```

---

## 💾 資料管理

所有門市飲品資料存放在 **`data/regions.json`**：

```json
{
  "version": "1.0.0",
  "regions": {
    "台北門市": {
      "ranking": [
        { "id": 1, "cn": "招牌高山青", "en": "Taiwan Light Oolong Tea", "price": 40 },
        { "id": 2, "cn": "108茶王", "en": "108 Roasted Oolong Tea", "price": 50 },
        // ... 更多飲品
      ]
    },
    "高雄門市": { /* ... */ },
    "台中門市": { /* ... */ }
  }
}
```

**修改方式：**
- 無需改動 HTML/CSS/JS
- 直接編輯 `data/regions.json`
- 提交 PR 或直接推送到 `develop` 分支

---

## 🔄 版本管理與部署

### GitFlow 工作流

```
main (正式環境) ← release/v版本號
  ↑
develop (測試環境)
  ↑
feature/* (開發分支)
```

### 發佈流程

1. 開發完成，提 PR 到 `develop`
2. 自動部署至 [Staging](https://teatop-top10-staging.web.app) 測試
3. Merge 到 `main` 時自動部署至 [Production](https://teatop-top10.web.app)
4. 建立 Git Tag（如 `v1.1.0`）

### 常見修改需求

| 需求 | 方式 | 檔案 |
|------|------|------|
| 修改飲品價格 | 編輯 JSON | `data/regions.json` |
| 新增門市 | 新增 JSON 物件 | `data/regions.json` |
| 調整動畫時長 | 修改秒數 | `style.css` 或 `script.js` |
| 修改配色 | 改色值 | `style.css` |

詳見 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [DEPLOYMENT.md](DEPLOYMENT.md)。

---

## 📚 文檔

- **[AGENTS.md](AGENTS.md)** - 專案概述、技術棧、功能說明
- **[CHANGELOG.md](CHANGELOG.md)** - 版本變更日誌、Semantic Versioning 說明
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 完整部署指南、GitFlow 工作流、常見問題
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - 開發指南、代碼標準、提交規範

---

## 🛠️ 技術棧

- **前端**：HTML5 + CSS3 + JavaScript（原生，無框架）
- **樣式庫**：Bootstrap 5.3 (CDN)
- **字體**：Google Fonts (Noto Sans TC、Montserrat、Funnel Display)
- **圖片**：Imgur CDN
- **部署**：Firebase Hosting
- **CI/CD**：GitHub Actions

---

## 🌐 線上展示

| 環境 | URL | 用途 |
|------|-----|------|
| **Staging** | https://teatop-top10-staging.web.app | 功能測試 |
| **Production** | https://teatop-top10.web.app | 正式展示 |

---

## 📋 版本歷史

### v1.1.0 (2026-08-24)
- **動畫配置中心化**：新增 `TIMING` 配置物件，集中管理所有動畫時間參數
- **動畫生成工具化**：`generateLeftAnimations()` 和 `generateRightAnimations()` 動態生成動畫 CSS
- **提高可維護性**：減少硬編碼，支援後續快速調整動畫時間和效果
- **改進代碼結構**：新增 `ANIMATION_CYCLE` 計算和 `getStartTime()` 工具函式
- **優化飲品資料管理**：支援更靈活的多門市資料結構

### v1.0.0 (2026-08-24)
- 初版發布
- 支援三個門市（台北、高雄、台中）
- 動畫輪播 + 靜態列表展示
- GitHub Actions 自動化部署
- 完整的文檔和版本管理

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下流程：

1. **Fork 此倉庫**
2. **建立特性分支**：`git checkout -b feature/你的功能`
3. **提交變更**：遵循 [Conventional Commits](https://www.conventionalcommits.org/zh_TW/)
4. **推送到遠端**：`git push origin feature/你的功能`
5. **建立 Pull Request**

詳見 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📞 聯絡方式

- **GitHub Issues**：報告 bug 或建議功能
- **GitHub Discussions**：討論設計或改進方案

---

## 📄 授權

此專案屬於 Teatop 茶飲連鎖內部專案。

---

## 🎨 設計靈感

- 精簡設計：專注於展示核心資訊
- 響應式佈局：適配不同螢幕尺寸
- 動畫吸引力：視覺效果提升用戶體驗
- 自動化運維：最小化手動操作

---

**最後更新**：2026-08-24  
**版本**：1.1.0
