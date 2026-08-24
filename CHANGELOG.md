# Changelog

所有對本專案的重要變更都會被記錄在這個檔案中。

本專案遵循 [Semantic Versioning](https://semver.org/lang/zh_TW/) 版本管理。

---

## [1.2.0] - 2026-08-24

### Added
- **離線優先架構**：Service Worker + 智能快取策略
- **版本控制系統**：自動檢測更新、無感更新
- **圖片內嵌**：21 張 Imgur 圖片轉為 Base64（648 KB），完全離線可用
- **manifest.json**：PWA 配置檔案
- **圖片下載腳本**：`scripts/download-images.js`

### Changed
- **移除所有 CDN 依賴**：Bootstrap、jQuery、Google Fonts
- **字體本地化**：改用系統字體堆疊（Segoe UI、Microsoft JhengHei、PingFang TC）
- **CSS 重構**：使用 CSS 變量管理圖片引用
- **HTML 精簡**：移除不必要的 partial 註解

### Performance
- **GPU 加速**：動畫元素添加 `will-change`、`translateZ(0)`
- **減少網路請求**：從 ~25 次降至 5 次（本地資源）
- **首屏加載**：離線時 < 0.5 秒（快取命中）

### Technical
- **Service Worker**：Cache-first 策略、自動清理舊版本快取
- **版本檢查**：localStorage 存儲版本號、啟動時自動比對
- **圖片注入**：JavaScript 動態設置 img[data-img] 和 CSS 變量

### STB 適配
- 支援網路斷線場景
- 降低 CPU/GPU 資源消耗
- 24/7 穩定運行優化

---

## [1.1.0] - 2026-08-24

### Added
- 動畫配置中心化：新增 `TIMING` 配置物件，集中管理所有動畫時間
- 動畫生成工具函式：`generateLeftAnimations()` 和 `generateRightAnimations()`，支援動態生成動畫 CSS
- 提高動畫可維護性：減少硬編碼，支援後續快速調整動畫時間

### Changed
- 重構 `script.js`：使用配置驅動的動畫系統
- 改進飲品資料結構：支援更靈活的門市資料管理
- 優化 CSS 選擇器動態綁定

### Technical
- 新增 `ANIMATION_CYCLE` 計算公式，自動計算總動畫週期
- 新增 `getStartTime()` 工具函式，計算每個 TOP 的動畫起始時間
- 改進代碼可讀性與模組化

---

## [1.0.0] - 2026-08-24

### Added
- 初版發布：Teatop TOP10 門市排行榜展示系統
- 支援三個門市：台北門市、高雄門市、台中門市
- 左側動畫輪播：展示 TOP1~5 飲品
- 右側靜態列表：展示 TOP1~10 飲品及價格
- URL 參數切換門市：`?region=門市名稱`
- 本地存儲記憶使用者選擇的門市
- CSS 動畫效果：飲品圖片降落、旋轉、淡出、同步高亮

### Technical
- HTML5 + CSS3 + JavaScript（原生，無框架）
- Bootstrap 5.3 CDN
- 資料分離架構：`data/regions.json`
- 響應式設計：使用 `clamp()` 單位

---

## 版本發佈紀錄

### 發佈規則

| 版本類型 | 何時增加 | 例子 |
|---------|---------|------|
| **主版本** | 重大功能改變、不兼容變更 | v1 → v2（完全改版 UI） |
| **次版本** | 新功能、新門市、動畫改進 | v1.0 → v1.1（新增西門町） |
| **修訂版本** | bug fix、資料修正、文檔更新 | v1.0.0 → v1.0.1（修正價格） |

### 查詢版本

```bash
# 檢視目前版本
git describe --tags --always

# 檢視所有版本標籤
git tag -l

# 檢視某版本詳細資訊
git show v1.0.0
```

---

## 待優化項目

- [x] ~~動畫時間硬編碼~~ → v1.1.0 配置中心化
- [x] ~~離線支持~~ → v1.2.0 Service Worker + 版本控制
- [x] ~~CDN 依賴~~ → v1.2.0 完全本地化
- [ ] 無單元測試（純靜態）
- [ ] TOP1~5 左側顯示可考慮改為輪播卡片
- [ ] 多語言支持（英文、日文等）
- [ ] 連接 POS 系統動態更新排名
- [ ] 新增移動設備適配（平板菜單展示）

---

## 貢獻指南

請參考 [CONTRIBUTING.md](CONTRIBUTING.md) 瞭解如何貢獻此專案。
