# 貢獻指南

感謝你對 Teatop TOP10 專案的貢獻！本指南將幫助你理解開發流程和程式碼標準。

---

## 開發前的準備

### 1. Fork & Clone

```bash
# Fork 此倉庫（GitHub UI）

# 複製你的 Fork
git clone https://github.com/你的用戶名/teatop-TOP-10.git
cd "Teatop TOP10"

# 新增上游遠端
git remote add upstream https://github.com/原始倉庫/teatop-TOP-10.git
```

### 2. 建立開發分支

```bash
# 更新 develop 分支
git fetch upstream
git checkout develop
git rebase upstream/develop

# 建立特性分支
git checkout -b feature/你的功能名稱
```

---

## 提交規範 (Conventional Commits)

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 類型 (type)

| 類型 | 用途 | 例子 |
|------|------|------|
| `feat` | 新功能或新門市 | `feat: 新增西門町門市` |
| `fix` | bug 修正 | `fix: 修正高雄門市價格` |
| `docs` | 文檔更新 | `docs: 更新部署指南` |
| `style` | 程式碼風格（不影響邏輯） | `style: 調整縮排` |
| `refactor` | 程式碼重構 | `refactor: 簡化動畫邏輯` |
| `perf` | 效能改進 | `perf: 優化 JSON 載入` |
| `chore` | 構建、工具、依賴 | `chore: 更新 Firebase 配置` |
| `test` | 測試相關 | `test: 新增單元測試` |

### 範例

```bash
# 簡單提交
git commit -m "feat: 新增西門町門市"

# 詳細提交
git commit -m "feat: 新增西門町門市

- 添加 10 款飲品排行資料
- 更新對應的英文名稱和價格
- 測試通過：所有動畫效果正常

Fixes #123"
```

---

## 程式碼標準

### HTML/CSS/JavaScript

遵循 [Teatop 業務域規則](https://example.com/teatop-domain.mdc)：

**語言約定：**
- UI 文本：繁體中文（飲品名稱、描述）
- 程式碼註解：繁體中文（解釋業務邏輯）
- HTML/CSS/JS 標識符：英文（類名、變數名）

**命名規範：**
- CSS 類名：`.L01Cname`（英文駝峰）
- JavaScript 變數：`regionName`（駝峰）
- 日期格式：ISO 8601（`2026-08-24`）

### JSON 資料格式

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-08-24",
  "regions": {
    "台北門市": {
      "ranking": [
        { "id": 1, "cn": "飲品名", "en": "Drink Name", "price": 50 }
      ]
    }
  }
}
```

**檢驗 JSON 格式：**

```bash
python3 -m json.tool data/regions.json
```

---

## 修改飲品資料的檢查清單

新增或修改門市資料時，確保更新以下三處：

### 1. HTML (index.html)

- 左側 TOP1~5：`.L01 ~ .L05` 中的 `.LCname`、`.LEname`
- 右側 TOP1~10：`.Rrow01 ~ .Rrow10` 中的 `.RCname`、`.REname`、`.Rprice`

### 2. CSS (style.css)

- 若改變順序：檢查 TOP 對應的背景色是否邏輯正確
- TOP1/3/5 及其他偶數行的背景色定義

### 3. JavaScript (script.js)

- 對應 TOP 的選擇器與動畫時間是否一致

### 4. 資料檔案 (data/regions.json)

```json
{
  "id": 1,
  "cn": "招牌高山青",
  "en": "Taiwan Light Oolong Tea",
  "price": 40
}
```

---

## 測試清單

提交前確認：

- [ ] 本地運行無錯誤：`npx http-server -p 5500`
- [ ] 在所有支援的瀏覽器測試（Chrome、Safari、Firefox）
- [ ] 在不同螢幕尺寸測試（桌面、平板、手機）
- [ ] JSON 格式有效：`python3 -m json.tool data/regions.json`
- [ ] 動畫流暢度正常（無卡頓）
- [ ] 門市切換功能正常：點擊各門市按鈕
- [ ] URL 參數切換正常：`?region=台北門市`

---

## Pull Request 流程

### 1. 推送分支

```bash
git push origin feature/你的功能名稱
```

### 2. 建立 PR

在 GitHub 上建立 PR，說明：

- **Title**（簡潔）：`feat: 新增西門町門市`
- **Description**（詳細）：

```markdown
## 描述
新增西門町門市的 TOP10 飲品排行榜資料。

## 變更內容
- 新增西門町門市 JSON 資料
- 測試通過：所有門市切換功能正常
- 驗證 JSON 格式正確

## 相關 Issue
Fixes #123

## 檢查清單
- [x] 本地測試無誤
- [x] JSON 格式驗證通過
- [x] 跨瀏覽器測試
- [x] CHANGELOG.md 已更新
```

### 3. 自動檢查

GitHub Actions 會自動：
- ✅ 驗證 JSON 格式
- ✅ 部署至 Staging 環境
- 👥 等待審核

### 4. Review & Merge

- 維護者檢查程式碼
- 反饋改進建議
- 獲得 Approve 後，可自行 merge 或由維護者 merge

---

## 常見修改場景

### 場景 1：新飲品上市，插入 TOP3

1. 原 TOP3 ~ TOP10 順序往下移
2. 更新 `data/regions.json` 中的排序
3. HTML/CSS/JS 無需改動（動態讀取資料）
4. 本地測試
5. 提 PR

### 場景 2：停售飲品，刪除 TOP7

1. 從 `data/regions.json` 移除該項
2. 其他項自動遞補
3. HTML/CSS/JS 無需改動
4. 本地測試
5. 提 PR

### 場景 3：只改價格，無排名變化

1. 修改 `data/regions.json` 中的 `price` 欄位
2. 提 PR（無需改動其他檔案）

### 場景 4：改動動畫或樣式

若修改涉及 `style.css` 或 `script.js`：

1. 在 **Staging 環境完整測試**
2. 確認在各瀏覽器、各螢幕尺寸下無問題
3. 在 PR 中詳細說明改動理由
4. 提供前後對比（截圖或影片）
5. 等待審核

---

## 分支命名規範

| 分支類型 | 命名規則 | 例子 |
|---------|---------|------|
| 特性 | `feature/功能名稱` | `feature/ximen-store` |
| 修復 | `bugfix/問題描述` | `bugfix/price-error` |
| 發布 | `release/v版本號` | `release/v1.1.0` |
| 緊急修復 | `hotfix/問題描述` | `hotfix/critical-price` |

---

## 常見問題 (FAQ)

### Q：我應該從哪個分支開始？

**A：** 永遠從 `develop` 開始：

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/...
```

### Q：如何保持我的分支與 develop 同步？

**A：** 定期 rebase：

```bash
git fetch upstream
git rebase upstream/develop
git push origin feature/... -f
```

### Q：PR 被拒絕了怎麼辦？

**A：** 不用重新建立 PR，在原分支修改即可：

```bash
# 修改程式碼
git add .
git commit -m "修正意見"
git push origin feature/...
```

PR 會自動更新。

### Q：如何撤銷已推送的提交？

**A：** 建立新的 revert 提交：

```bash
git revert <commit-hash>
git push origin feature/...
```

不要使用 `git reset --hard`（會改寫歷史）。

---

## 獲得幫助

- 📖 閱讀 [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- 📝 閱讀 [CHANGELOG.md](CHANGELOG.md) - 版本紀錄
- 🐛 提交 Issue（GitHub）
- 💬 在 PR 中提出問題

---

感謝你的貢獻！ 🎉
