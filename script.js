// ========== 時序配置（單一真相來源） ==========
const TIMING = {
  itemDuration: 5,      // 單一飲品展示時長（秒）
  itemGap: 0.5,         // 飲品之間的過場間隔（秒）
  itemCount: 5,         // 左側展示的飲品數量
  
  // 內部時序偏移（相對於每個 TOP 的開始時間）
  offsets: {
    slideIn: 0,
    slideOut: 5,
    rotate: { in: 0, out: 5 },
    leafDrop: 1,
    leafFloat: 1.5,
    leafFadeOut: 4.9,
    cnameIn: 1.7,
    cnameOut: 4.7,
    enameIn: 2,
    enameOut: 5,
    rowHighlightIn: 0.5,
    rowHighlightOut: 5.3
  }
};

// 計算總週期（自動計算，無需手動維護）
const ANIMATION_CYCLE = TIMING.itemCount * (TIMING.itemDuration + TIMING.itemGap);

// ========== 動畫生成工具函數 ==========

// 計算每個 TOP 的開始時間
function getStartTime(index) {
  return index * (TIMING.itemDuration + TIMING.itemGap);
}

// 生成左側 TOP 動畫配置
function generateLeftAnimations() {
  const configs = [];
  const o = TIMING.offsets;
  
  for (let i = 0; i < TIMING.itemCount; i++) {
    const num = String(i + 1).padStart(2, '0');
    const s = getStartTime(i);
    
    // 交替使用 float03/float04（視覺變化）
    const floatL = i % 2 === 0 ? 'float04' : 'float03';
    const floatR = i % 2 === 0 ? 'float03' : 'float04';
    
    configs.push(
      { selector: `.Ltop${num}`, animation: `slideIn 0.5s 1 linear ${s + o.slideIn}s forwards, slideOut 0.5s 1 linear ${s + o.slideOut}s forwards` },
      { selector: `.Ltea${num}`, animation: `rotate01 1s 1 ease-out ${s + o.rotate.in}s forwards, rotate02 1s 1 ease-out ${s + o.rotate.out}s forwards` },
      { selector: `.Lleaf${num}`, animation: `drop 0.5s 1 ease-in ${s + o.leafDrop}s forwards, ${floatL} 1s infinite linear ${s + o.leafFloat}s, fadeOut 0.1s 1 linear ${s + o.leafFadeOut}s forwards` },
      { selector: `.Rleaf${num}`, animation: `drop 0.5s 1 ease-in ${s + o.leafDrop}s forwards, ${floatR} 1s infinite linear ${s + o.leafFloat}s, fadeOut 0.1s 1 linear ${s + o.leafFadeOut}s forwards` },
      { selector: `.L${num}Cname`, animation: `fadeIn 0.3s 1 linear ${s + o.cnameIn}s forwards, fadeOut 0.3s 1 linear ${s + o.cnameOut}s forwards` },
      { selector: `.L${num}Ename`, animation: `fadeIn 0.3s 1 linear ${s + o.enameIn}s forwards, fadeOut 0.3s 1 linear ${s + o.enameOut}s forwards` }
    );
  }
  
  // 背景圓圈（持續漂浮）
  configs.push(
    { selector: '.Lcircle', animation: 'float01 1s infinite linear 0s' },
    { selector: '.Rcircle', animation: 'float02 1s infinite linear 0s' }
  );
  
  return configs;
}

// 生成右側列表高亮動畫配置
function generateRightAnimations() {
  const configs = [];
  const o = TIMING.offsets;
  
  for (let i = 0; i < TIMING.itemCount; i++) {
    const num = String(i + 1).padStart(2, '0');
    const s = getStartTime(i);
    
    // 奇偶行使用不同的背景色動畫
    const bgAnim = i % 2 === 0 ? 'bgcolorlof' : 'bgcolorlof';
    
    configs.push(
      { selector: `.Rrow${num}`, animation: `${bgAnim} 0.1s linear ${s + o.rowHighlightIn}s 1 forwards, bgcolorof 0.1s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.Rrow${num} .large`, animation: `bgcolorbo 0.1s linear ${s + o.rowHighlightIn}s 1 forwards, bgcolorbo 0.1s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.R${num}no`, animation: `colorfo 0.1s linear ${s + o.rowHighlightIn}s 1 forwards, colorfo 0.1s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.R${num}price`, animation: `colorfo 0.1s linear ${s + o.rowHighlightIn}s 1 forwards, colorfo 0.1s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.R${num}moneysign`, animation: `colorbo 0.1s linear ${s + o.rowHighlightIn}s 1 forwards, colorbo 0.1s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.R${num}Cname`, animation: `filtero 0.05s linear ${s + o.rowHighlightIn}s 1 forwards, filtero 0.05s linear ${s + o.rowHighlightOut}s 1 reverse forwards` },
      { selector: `.R${num}Ename`, animation: `filtero 0.05s linear ${s + o.rowHighlightIn}s 1 forwards, filtero 0.05s linear ${s + o.rowHighlightOut}s 1 reverse forwards` }
    );
  }
  
  return configs;
}

// 動畫定義表（動態生成）
const ANIMATION_CONFIG = {
  left: generateLeftAnimations(),
  right: generateRightAnimations()
};

// 獲取 URL 參數中的區域，或使用本地存儲
function getSelectedRegion() {
  const params = new URLSearchParams(window.location.search);
  return params.get('region') || localStorage.getItem('selectedRegion');
}

// 載入區域數據
async function loadRegionData() {
  try {
    const response = await fetch('./data/regions.json');
    const data = await response.json();
    const region = getSelectedRegion() || data.defaultRegion;
    
    localStorage.setItem('selectedRegion', region);
    const regionData = data.regions[region];
    if (regionData && regionData.ranking) {
      updateUI(regionData.ranking, region);
    }
    initializeAnimations();
  } catch (error) {
    console.error('載入區域數據失敗:', error);
    initializeAnimations();
  }
}

// 動態更新 UI 中的飲品資訊
function updateUI(ranking, regionName) {
  if (!ranking || !Array.isArray(ranking)) return;
  
  // 更新左側 TOP1-5
  ranking.slice(0, 5).forEach((item, index) => {
    const num = String(index + 1).padStart(2, '0');
    const cnEl = document.querySelector(`.L${num}Cname`);
    const enEl = document.querySelector(`.L${num}Ename`);
    if (cnEl) cnEl.textContent = item.cn;
    if (enEl) enEl.textContent = item.en;
  });
  
  // 更新右側 TOP1-10
  ranking.forEach((item) => {
    const num = String(item.id).padStart(2, '0');
    const cnEl = document.querySelector(`.R${num}Cname`);
    const enEl = document.querySelector(`.R${num}Ename`);
    const priceEl = document.querySelector(`.R${num}price`);
    const noEl = document.querySelector(`.R${num}no`);
    if (cnEl) cnEl.textContent = item.cn;
    if (enEl) enEl.innerHTML = item.en;
    if (priceEl) priceEl.textContent = item.price;
    if (noEl) noEl.textContent = String(item.id).padStart(2, '0');
  });
  
  // 更新區域顯示
  const regionDisplay = document.getElementById('regionDisplay');
  if (regionDisplay) {
    regionDisplay.textContent = regionName;
  }
}

// 區域切換函數（供 UI 調用）
function switchRegion(regionName) {
  localStorage.setItem('selectedRegion', regionName);
  location.reload();
}

// 防抖 flag：防止 animationend 與 setInterval 同時觸發
let isResetting = false;

// DOM 元素快取（初始化時填充，避免重複查詢）
let cachedElements = null;

// 初始化 DOM 快取
function initElementCache() {
  const allConfigs = [...ANIMATION_CONFIG.left, ...ANIMATION_CONFIG.right];
  cachedElements = allConfigs.map(({ selector, animation }) => ({
    el: document.querySelector(selector),
    animation
  })).filter(item => item.el !== null);
}

// 重置所有動畫（使用快取的 DOM 引用）
function resetAllAnimations() {
  // 防抖：1 秒內不重複執行
  if (isResetting) return;
  isResetting = true;
  
  // 步驟 1：清除所有動畫
  cachedElements.forEach(({ el }) => {
    el.style.animation = 'none';
  });
  
  // 步驟 2：強制瀏覽器重新計算佈局（觸發 reflow）
  void document.body.offsetHeight;
  
  // 步驟 3：重新賦值所有動畫
  cachedElements.forEach(({ el, animation }) => {
    el.style.animation = animation;
  });
  
  // 重置備用計時器（確保下次 fallback 時間正確）
  resetFallbackTimer();
  
  // 1 秒後解除防抖鎖定
  setTimeout(() => { isResetting = false; }, 1000);
}

// 備用計時器 ID
let fallbackTimerId = null;

// 重置備用計時器
function resetFallbackTimer() {
  if (fallbackTimerId !== null) {
    clearTimeout(fallbackTimerId);
  }
  // 設定下一次備用觸發（動畫週期 + 2 秒緩衝）
  fallbackTimerId = setTimeout(resetAllAnimations, (ANIMATION_CYCLE + 2) * 1000);
}

// 初始化動畫邏輯
function initializeAnimations() {
  const triggerElement = document.querySelector('.L05Ename');
  if (!triggerElement) {
    console.error('找不到 .L05Ename 元素，動畫循環無法初始化');
    return;
  }
  
  // 初始化 DOM 快取
  initElementCache();
  
  // 監聽最後一個動畫元素的 fadeOut 結束事件
  // 使用雙層 requestAnimationFrame 確保瀏覽器完成當前幀渲染後再重置
  triggerElement.addEventListener('animationend', (event) => {
    if (event.animationName === 'fadeOut') {
      requestAnimationFrame(() => {
        requestAnimationFrame(resetAllAnimations);
      });
    }
  });
  
  // 啟動備用計時器（僅在 animationend 未觸發時作為 fallback）
  resetFallbackTimer();
}

// 頁面加載時執行
document.addEventListener('DOMContentLoaded', () => {
  loadRegionData();
});