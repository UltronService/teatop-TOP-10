/**
 * Teatop TOP10 主程式
 * v1.2.0 - 離線優先版本
 */

// ========== 版本配置 ==========
const APP_VERSION = '1.2.0';

// ========== 時序配置（單一真相來源） ==========
const TIMING = {
  itemDuration: 5,
  itemGap: 0.5,
  itemCount: 5,
  
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

const ANIMATION_CYCLE = TIMING.itemCount * (TIMING.itemDuration + TIMING.itemGap);

// ========== Service Worker 註冊 ==========
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[APP] 瀏覽器不支援 Service Worker');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    console.log('[APP] Service Worker 註冊成功');
    
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[APP] 發現新版本，自動更新中...');
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
    
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[APP] 新版本已啟用，重新載入頁面');
        window.location.reload();
      }
    });
  } catch (error) {
    console.error('[APP] Service Worker 註冊失敗:', error);
  }
}

// ========== 版本檢查 ==========
async function checkVersion() {
  const localVersion = localStorage.getItem('app_version');
  
  if (localVersion !== APP_VERSION) {
    console.log(`[APP] 版本更新: ${localVersion || '首次安裝'} → ${APP_VERSION}`);
    localStorage.setItem('app_version', APP_VERSION);
    
    if ('caches' in window && localVersion) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        if (name.startsWith('teatop-') && !name.includes(APP_VERSION)) {
          await caches.delete(name);
          console.log(`[APP] 清除舊快取: ${name}`);
        }
      }
    }
  } else {
    console.log(`[APP] 版本: ${APP_VERSION}（快取命中）`);
  }
}

// ========== 圖片注入 ==========
function injectImages() {
  if (typeof IMAGES === 'undefined') {
    console.warn('[APP] 圖片資源未載入，使用佔位符');
    injectPlaceholders();
    return;
  }
  
  const root = document.documentElement;
  let successCount = 0;
  
  document.querySelectorAll('[data-img]').forEach((el) => {
    const key = el.dataset.img;
    if (IMAGES[key]) {
      el.src = IMAGES[key];
      successCount++;
    } else {
      console.warn(`[APP] 圖片缺失: ${key}`);
    }
  });
  
  try {
    root.style.setProperty('--icon-tea', `url("${IMAGES.icon_tea || 'none'}")`);
    root.style.setProperty('--icon-bubble', `url("${IMAGES.icon_bubble || 'none'}")`);
    root.style.setProperty('--icon-flower', `url("${IMAGES.icon_flower || 'none'}")`);
    root.style.setProperty('--icon-passion', `url("${IMAGES.icon_passion || 'none'}")`);
    root.style.setProperty('--icon-redbean', `url("${IMAGES.icon_redbean || 'none'}")`);
  } catch (error) {
    console.warn('[APP] CSS 變量設置失敗', error);
  }
  
  console.log(`[APP] 圖片注入完成 (${successCount}/${document.querySelectorAll('[data-img]').length})`);
}

function injectPlaceholders() {
  const placeholderSVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23999" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
  
  document.querySelectorAll('[data-img]').forEach((el) => {
    if (!el.src || el.src === '') {
      el.src = placeholderSVG;
    }
  });
  
  console.log('[APP] 佔位符注入完成');
}

// ========== 動畫生成工具函數 ==========
function getStartTime(index) {
  return index * (TIMING.itemDuration + TIMING.itemGap);
}

function generateLeftAnimations() {
  const configs = [];
  const o = TIMING.offsets;
  
  for (let i = 0; i < TIMING.itemCount; i++) {
    const num = String(i + 1).padStart(2, '0');
    const s = getStartTime(i);
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
  
  configs.push(
    { selector: '.Lcircle', animation: 'float01 1s infinite linear 0s' },
    { selector: '.Rcircle', animation: 'float02 1s infinite linear 0s' }
  );
  
  return configs;
}

function generateRightAnimations() {
  const configs = [];
  const o = TIMING.offsets;
  
  for (let i = 0; i < TIMING.itemCount; i++) {
    const num = String(i + 1).padStart(2, '0');
    const s = getStartTime(i);
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

const ANIMATION_CONFIG = {
  left: generateLeftAnimations(),
  right: generateRightAnimations()
};

// ========== 區域數據載入 ==========
function getSelectedRegion() {
  const params = new URLSearchParams(window.location.search);
  return params.get('region') || localStorage.getItem('selectedRegion');
}

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
  } catch (error) {
    console.error('[APP] 載入區域數據失敗:', error);
  }
}

function updateUI(ranking, regionName) {
  if (!ranking || !Array.isArray(ranking)) return;
  
  ranking.slice(0, 5).forEach((item, index) => {
    const num = String(index + 1).padStart(2, '0');
    const cnEl = document.querySelector(`.L${num}Cname`);
    const enEl = document.querySelector(`.L${num}Ename`);
    if (cnEl) cnEl.textContent = item.cn;
    if (enEl) enEl.textContent = item.en;
  });
  
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
  
  const regionDisplay = document.getElementById('regionDisplay');
  if (regionDisplay) {
    regionDisplay.textContent = regionName;
  }
}

function switchRegion(regionName) {
  localStorage.setItem('selectedRegion', regionName);
  location.reload();
}

// ========== 動畫控制 ==========
let isResetting = false;
let cachedElements = null;
let fallbackTimerId = null;
let animationsInitialized = false;

function initElementCache() {
  const allConfigs = [...ANIMATION_CONFIG.left, ...ANIMATION_CONFIG.right];
  cachedElements = allConfigs.map(({ selector, animation }) => ({
    el: document.querySelector(selector),
    animation
  })).filter(item => item.el !== null);
}

function resetAllAnimations() {
  if (isResetting) return;
  isResetting = true;
  
  cachedElements.forEach(({ el }) => {
    el.style.animation = 'none';
  });
  
  void document.body.offsetHeight;
  
  cachedElements.forEach(({ el, animation }) => {
    el.style.animation = animation;
  });
  
  resetFallbackTimer();
  setTimeout(() => { isResetting = false; }, 1000);
}

function resetFallbackTimer() {
  if (fallbackTimerId !== null) {
    clearTimeout(fallbackTimerId);
  }
  fallbackTimerId = setTimeout(resetAllAnimations, (ANIMATION_CYCLE + 2) * 1000);
}

function initializeAnimations() {
  if (animationsInitialized) {
    console.log('[APP] 動畫已初始化，跳過');
    return;
  }
  
  const triggerElement = document.querySelector('.L05Ename');
  if (!triggerElement) {
    console.error('[APP] 找不到 .L05Ename 元素');
    return;
  }
  
  animationsInitialized = true;
  initElementCache();
  
  triggerElement.addEventListener('animationend', (event) => {
    if (event.animationName === 'fadeOut') {
      requestAnimationFrame(() => {
        requestAnimationFrame(resetAllAnimations);
      });
    }
  });
  
  resetFallbackTimer();
  console.log('[APP] 動畫初始化完成');
}

// ========== 應用程式啟動 ==========
async function initApp() {
  console.log(`[APP] Teatop TOP10 啟動中... (v${APP_VERSION})`);
  
  try {
    await checkVersion();
  } catch (error) {
    console.warn('[APP] 版本檢查失敗:', error);
  }
  
  try {
    registerServiceWorker();
  } catch (error) {
    console.warn('[APP] Service Worker 註冊失敗:', error);
  }
  
  try {
    injectImages();
  } catch (error) {
    console.error('[APP] 圖片注入失敗:', error);
    injectPlaceholders();
  }
  
  try {
    await loadRegionData();
  } catch (error) {
    console.error('[APP] 區域數據載入失敗:', error);
  }
  
  try {
    initializeAnimations();
  } catch (error) {
    console.error('[APP] 動畫初始化失敗:', error);
  }
  
  console.log('[APP] 啟動完成');
}

document.addEventListener('DOMContentLoaded', initApp);

// 暴露全域函數供 HTML 調用
window.switchRegion = switchRegion;

// 全域錯誤捕捉
window.addEventListener('error', (event) => {
  console.error('[APP] 全域錯誤:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[APP] 未處理的 Promise 拒絕:', event.reason);
});
