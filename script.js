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
    updateUI(data.regions[region], region);
  } catch (error) {
    console.error('載入區域數據失敗:', error);
  }
}

// 動態更新 UI 中的飲品資訊
function updateUI(ranking, regionName) {
  if (!ranking) return;
  
  ranking.slice(0, 5).forEach((item, index) => {
    const num = index + 1;
    document.querySelector(`.L${num}Cname`).textContent = item.cn;
    document.querySelector(`.L${num}Ename`).textContent = item.en;
  });
  
  ranking.forEach((item) => {
    const num = String(item.id).padStart(2, '0');
    document.querySelector(`.R${num}Cname`).textContent = item.cn;
    document.querySelector(`.R${num}Ename`).innerHTML = item.en;
    document.querySelector(`.R${num}price`).textContent = item.price;
    document.querySelector(`.R${num}no`).textContent = String(item.id).padStart(2, '0');
  });
  
  const regionDisplay = document.getElementById('regionDisplay');
  if (regionDisplay) {
    regionDisplay.textContent = regionName;
  }
}

// 區域切換函數
function switchRegion(regionName) {
  localStorage.setItem('selectedRegion', regionName);
  location.reload();
}

// 顯示解析度資訊
function displayResolutionInfo() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio;
  const physicalWidth = width * dpr;
  const physicalHeight = height * dpr;
  
  const resolutionDisplay = document.getElementById('resolutionDisplay');
  if (resolutionDisplay) {
    resolutionDisplay.textContent = `${width}×${height} (DPR: ${dpr}) | 物理: ${Math.round(physicalWidth)}×${Math.round(physicalHeight)}`;
  }
  
  console.log(`視口: ${width}×${height} | DPR: ${dpr} | 物理解析度: ${Math.round(physicalWidth)}×${Math.round(physicalHeight)}`);
}

// 頁面加載時執行
document.addEventListener('DOMContentLoaded', () => {
  loadRegionData();
  displayResolutionInfo();
  window.addEventListener('resize', displayResolutionInfo);
});