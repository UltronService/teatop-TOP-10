# Teatop TOP10 門市排行榜

## 專案概述

靜態網頁展示 Teatop 茶飲品牌的 TOP10 熱銷飲品排行榜，包含中英文名稱、店內價格與動畫展示效果。

## 技術棧

- **前端框架**：HTML5 + CSS3 + JavaScript（原生）
- **樣式庫**：Bootstrap 5.3 (CDN)
- **字體**：Google Fonts（Noto Sans TC、Montserrat、Funnel Display）
- **圖片資源**：Imgur CDN
- **依賴管理**：無（純靜態，無構建步驟）
- **部署**：Firebase Hosting + GitHub Actions

## 專案結構

```
D:/Cursor/Teatop TOP10/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD 工作流
├── data/
│   └── regions.json            # 門市資料（支援多門市切換）
├── index.html                  # 主頁面（TOP1~TOP5 左側、TOP1~TOP10 右側列表）
├── style.css                   # 動畫與排版樣式
├── script.js                   # 動畫循環、資料載入邏輯
├── AGENTS.md                   # 本檔案
├── CHANGELOG.md                # 版本變更日誌
├── DEPLOYMENT.md               # 部署指南
├── CONTRIBUTING.md             # 貢獻指南
├── firebase.json               # Firebase 配置
└── .gitignore                  # Git 忽略清單
```

## 功能說明

### 左側區域（.L）
- 展示 TOP1~5 飲品的動畫輪播
- 每個飲品 5 秒展示一次，共需 27 秒完整循環
- 飲品圖片（茶杯、葉片）動畫降落、旋轉、淡出

### 右側區域（.R）
- 靜態列表：TOP1~TOP10 飲品編號、中文名、英文名、價格
- 與左側動畫同步：當左側展示該 TOP 時，右側對應列表行變色

### 動畫細節
- 使用 CSS @keyframes + JavaScript 重置
- 監聽最後一個元素（.L05Ename）的 fadeOut 動畫結束
- 動畫結束後 500ms 重置所有動畫（無限循環）

### 多門市切換
- URL 參數控制：`?region=台北門市`、`?region=高雄門市` 等
- 本地存儲記憶用戶選擇
- 資料分離架構：所有門市資料存放在 `data/regions.json`

## 環境變數

目前僅用於示範，實際代碼未使用：
- `ANTHROPIC_API_KEY`：存放在 `.env`（禁止提交）

## 常見修改需求

| 需求 | 檔案 | 說明 |
|------|------|------|
| 修改飲品名稱、價格 | `data/regions.json` | 更新對應門市的 `cn`、`en`、`price` 欄位（無需改 HTML/CSS/JS） |
| 新增門市資料 | `data/regions.json` | 在 `regions` 物件中新增門市物件與排行陣列 |
| 調整動畫時長 | `style.css` 或 `script.js` | 修改 `animation` 中的秒數（0s、5s、27s 等） |
| 替換飲品圖片 | `index.html` `style.css` | 更新 Imgur URL 或上傳新圖片 |
| 修改配色 | `style.css` | 更改 `#ec6f09`（橙色）、`#0c2f54`（深藍）等色值 |
| 新增 TOP11+ 飲品 | `data/regions.json` + `index.html` + `style.css` + `script.js` | 新增資料，複製 TOP10 HTML 結構，調整動畫時間 |

## 開發指引

### 運行
- 直接用瀏覽器開啟 `index.html`（推薦用 Live Server 避免 CORS）
- 無需編譯或構建過程

### 代碼風格
- HTML：繁體中文類名（.LCname）與英文 CSS 選擇器並用
- CSS：使用 flexbox 佈局，響應式設計（clamp()）
- JS：原生 DOM API，無框架依賴

### 提交規範
- 遵循 [Conventional Commits](https://www.conventionalcommits.org/zh_TW/) 規範
- 禁止提交 `.env`、`.git`（已在 .gitignore）
- 提交前請閱讀 [CONTRIBUTING.md](CONTRIBUTING.md)

## 版本管理

本專案遵循 **Semantic Versioning** 與 **GitFlow** 工作流程。

### 版本號規則

格式：`v主.次.修`

| 版本類型 | 何時增加 | 例子 |
|---------|---------|------|
| **主版本** | 重大改變（不兼容變更、完全改版 UI） | v1 → v2 |
| **次版本** | 新功能或新門市 | v1.0 → v1.1（新增西門町） |
| **修訂版本** | bug fix、資料修正 | v1.0.0 → v1.0.1（修正價格） |

### 分支策略

```
main (正式環境)
  ↑
release/v1.x.x
  ↑
develop (測試環境)
  ↑
feature/*, bugfix/*, hotfix/*
```

- `develop`：開發主線，整合所有功能
- `feature/*`：新功能分支
- `release/*`：發布準備分支
- `hotfix/*`：緊急修復分支
- `main`：正式發布版本

### 發佈流程

1. 開發完成，提 PR 到 `develop`
2. 自動部署至 Staging 環境測試
3. Merge 到 `develop`（可省略）
4. 建立 `release/v版本號` 分支
5. Merge 到 `main`，建立 Tag
6. 自動部署至 Production 環境

詳見 [DEPLOYMENT.md](DEPLOYMENT.md)

## CI/CD 自動化

使用 **GitHub Actions** 自動化部署流程：

| 分支 | 觸發條件 | 動作 |
|------|---------|------|
| `develop` | push | 驗證 JSON → 部署 Staging 環境 |
| `main` | push | 驗證 JSON → 部署 Production 環境 |
| `pull_request` | 向 develop 提 PR | 驗證 JSON 格式 |

## 待優化項目

- [ ] 動畫時間硬編碼，未來考慮配置表
- [ ] 無單元測試（純靜態）
- [ ] TOP1~5 左側顯示可考慮改為輪播卡片
- [ ] 多語言支持（英文、日文等）
- [ ] 連接 POS 系統動態更新排名
- [ ] 新增移動設備適配（平板菜單展示）

## 相關文檔

- [CHANGELOG.md](CHANGELOG.md) - 版本變更日誌
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- [CONTRIBUTING.md](CONTRIBUTING.md) - 貢獻指南

## 相關連結

- GitHub Repo：https://github.com/UltronService/teatop-TOP-10
- Firebase Hosting：https://teatop-top10.web.app
- Staging 環境：https://teatop-top10-staging.web.app
