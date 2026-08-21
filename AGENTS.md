# Teatop TOP10 門市排行榜

## 專案概述

靜態網頁展示 Teatop 茶飲品牌的 TOP10 熱銷飲品排行榜，包含中英文名稱、店內價格與動畫展示效果。

## 技術棧

- **前端框架**：HTML5 + CSS3 + JavaScript（原生）
- **樣式庫**：Bootstrap 5.3 (CDN)
- **字體**：Google Fonts（Noto Sans TC、Montserrat、Funnel Display）
- **圖片資源**：Imgur CDN
- **依賴管理**：無（純靜態，無構建步驟）

## 專案結構

```
D:/Cursor/Teatop TOP10/
├── index.html          # 主頁面（TOP1~TOP5 左側、TOP1~TOP10 右側列表）
├── style.css           # 動畫與排版樣式
├── script.js           # 動畫循環與重置邏輯
├── .env                # API key（勿提交）
├── .gitignore          # Git 忽略清單
└── AGENTS.md           # 本檔案
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

## 環境變數

目前僅用於示範，實際代碼未使用：
- `ANTHROPIC_API_KEY`：存放在 `.env`（禁止提交）

## 常見修改需求

| 需求 | 檔案 | 說明 |
|------|------|------|
| 修改飲品名稱、價格 | `index.html` | 更新 `.LCname`、`.REname`、`.Rprice` 等文本 |
| 調整動畫時長 | `style.css` 或 `script.js` | 修改 `animation` 中的秒數（0s、5s、27s 等） |
| 替換飲品圖片 | `index.html` `style.css` | 更新 Imgur URL 或上傳新圖片 |
| 修改配色 | `style.css` | 更改 `#ec6f09`（橙色）、`#0c2f54`（深藍）等色值 |
| 新增 TOP11+ 飲品 | `index.html` + `style.css` + `script.js` | 複製 TOP10 結構，調整動畫時間 |

## 開發指引

### 運行
- 直接用瀏覽器開啟 `index.html`（推薦用 Live Server 避免 CORS）
- 無需編譯或構建過程

### 代碼風格
- HTML：繁體中文類名（.LCname）與英文 CSS 選擇器並用
- CSS：使用 flexbox 佈局，響應式設計（clamp()）
- JS：原生 DOM API，無框架依賴

### 提交規範
- 禁止提交 `.env`、`.git`（已在 .gitignore）
- 修改超過 2 個檔案前，需向 Claude 確認計畫
- 回覆使用繁體中文，程式代碼使用英文

## 待優化項目

- 動畫時間硬編碼在 CSS 與 JS 中，缺乏配置表
- 無單元測試（純靜態）
- 無自動化部署流程
- TOP1~5 左側顯示可考慮改為輪播卡片 / 不同佈局

## 相關連結

- GitHub Repo：https://github.com/UltronService/teatop-TOP-10
- 線上展示：（待部署）
