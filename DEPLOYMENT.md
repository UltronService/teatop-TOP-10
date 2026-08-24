# 部署指南

本文檔說明如何開發、測試和發布 Teatop TOP10 門市排行榜。

---

## 開發環境設置

### 前置條件
- Node.js 16+
- Git
- Firebase CLI (`npm install -g firebase-tools`)
- GitHub 帳號（推送代碼）

### 本地運行

```bash
# 1. 複製專案
git clone <repository-url>
cd "Teatop TOP10"

# 2. 安裝依賴（可選，此專案為純靜態）
npm install

# 3. 啟動本地伺服器
# 選項 A：使用 VSCode Live Server 插件
# 右鍵 index.html → Open with Live Server

# 選項 B：使用 Node http-server
npx http-server -p 5500

# 訪問
open http://localhost:5500/?region=台北門市
```

---

## 開發流程（GitFlow）

### 1. 新增功能或修正門市資料

```bash
# 建立特性分支
git checkout develop
git checkout -b feature/新門市名稱

# 編輯 data/regions.json
# 本地測試：http://localhost:5500/?region=新門市名稱

# 提交變更
git add data/regions.json
git commit -m "feat: 新增○○門市資料

- 添加 10 款飲品排行
- 更新對應價格"

git push origin feature/新門市名稱
```

### 2. 提交 Pull Request

1. 在 GitHub 上建立 PR：`feature/新門市名稱` → `develop`
2. 自動觸發 GitHub Actions：驗證 JSON 格式
3. 自動部署至 Staging 環境進行測試
4. 團隊 review，確認無誤
5. **Approve & Merge** 到 `develop`

### 3. 發佈新版本

```bash
# 檢出 develop 分支
git checkout develop
git pull origin develop

# 建立發布分支
git checkout -b release/v1.1.0

# 編輯 CHANGELOG.md，記錄此版本變更
# 更新 data/regions.json 的 version 欄位

git add CHANGELOG.md data/regions.json
git commit -m "chore: 準備發布 v1.1.0"

# 合併到 main（正式環境）
git checkout main
git pull origin main
git merge release/v1.1.0

# 建立版本標籤
git tag -a v1.1.0 -m "新增西門町門市"

# 推送到遠端
git push origin main
git push origin develop
git push origin v1.1.0
```

**此時自動化流程會：**
- ✅ 驗證 JSON 格式
- ✅ 自動部署至 Firebase Hosting（正式環境）
- ✅ 在 GitHub Releases 建立版本記錄

### 4. 緊急修復（Hotfix）

若正式環境出現緊急問題（e.g., 價格錯誤）：

```bash
# 直接從 main 建立 hotfix 分支
git checkout main
git checkout -b hotfix/修復內容

# 修正問題
git add data/regions.json
git commit -m "fix: 修正西門町飲品價格"

# 合併回 main + develop
git checkout main
git merge hotfix/修復內容
git tag -a v1.1.1 -m "修正西門町飲品價格"

git checkout develop
git merge hotfix/修復內容

# 推送
git push origin main develop v1.1.1
```

---

## 環境配置

### Staging 環境（測試用）

```
URL: https://teatop-top10-staging.web.app
自動部署：develop 分支
用途：功能測試、QA 驗收
```

### Production 環境（正式用）

```
URL: https://teatop-top10.web.app
自動部署：main 分支
用途：線上展示、客戶使用
```

---

## 手動部署（若需要）

### 本地部署到 Firebase

```bash
# 登入 Firebase
firebase login

# 選擇正確的 Firebase 專案
firebase use --add

# 部署到 Staging
firebase deploy --only hosting:staging

# 部署到 Production
firebase deploy --only hosting:prod
```

### 檢視部署狀態

```bash
# 查詢發佈歷史
firebase hosting:channel:list

# 回滾到前一個版本
firebase hosting:rollback
```

---

## 版本管理

### 查詢版本

```bash
# 檢視目前版本
cat data/regions.json | grep version

# 檢視所有 Git 標籤
git tag -l

# 檢視某版本的提交歷史
git log v1.0.0..v1.1.0
```

### 版本號規則（Semantic Versioning）

格式：`v主.次.修`

- **主版本 (major)**：重大改變（e.g., 完全改版 UI）
- **次版本 (minor)**：新功能或新門市
- **修訂版本 (patch)**：bug fix 或資料修正

例：
- `v1.0.0` → 初版
- `v1.1.0` → 新增西門町門市
- `v1.1.1` → 修正價格
- `v2.0.0` → 全面改版

---

## 常見問題 (FAQ)

### Q：修改資料後怎麼線上看？

**A：** 只需修改 `data/regions.json`，自動流程會：
1. 驗證 JSON 格式
2. 部署至 Staging（develop 分支）
3. 部署至 Production（main 分支）

無需改動 HTML/CSS/JS。

### Q：如何撤銷發布？

**A：** Firebase Hosting 支援一鍵回滾：

```bash
firebase hosting:rollback
```

或在 [Firebase Console](https://console.firebase.google.com/) 手動回滾。

### Q：如何預覽未發布的功能？

**A：** 修改推送到 develop 分支後，自動部署至 Staging：

```
https://teatop-top10-staging.web.app/?region=新門市名稱
```

### Q：多人協作時如何避免衝突？

**A：** 遵循 GitFlow：
- 每個人開自己的 `feature/` 分支
- 提 PR 前拉取最新 develop
- 解決衝突後再 merge

---

## 監控與維護

### 監控清單

- [ ] 正式環境定期檢查（手機、平板、電腦）
- [ ] 門市資料準確性（價格、排序）
- [ ] 動畫流暢度（特別是老舊設備）
- [ ] Firebase 配額使用率

### 定期維護

- **每月一次**：檢查 Firebase 儲存配額
- **每季一次**：檢視 Staging 環境日誌，確認無錯誤
- **發佈前**：在 Staging 完整測試一遍

---

## 相關文檔

- [CHANGELOG.md](CHANGELOG.md) - 版本變更日誌
- [CONTRIBUTING.md](CONTRIBUTING.md) - 貢獻指南
- [AGENTS.md](AGENTS.md) - 專案概述與技術棧
