/**
 * 字體下載腳本
 * 從 Google Fonts 下載 woff2 字體檔案
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'fonts');

// Google Fonts CSS API 會根據 User-Agent 返回不同格式
// 使用現代瀏覽器的 UA 來獲取 woff2
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FONT_CSS_URLS = [
  'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap'
];

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': USER_AGENT }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return fetchURL(response.headers.location).then(resolve).catch(reject);
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(FONTS_DIR, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filename).then(resolve).catch(reject);
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        resolve(stats.size);
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

function extractWoff2URLs(css) {
  const regex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;
  const urls = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function extractFontInfo(css, url) {
  // 解析 font-family 和 font-weight
  const familyMatch = css.match(/font-family:\s*['"]?([^;'"]+)/);
  const weightMatch = css.match(/font-weight:\s*(\d+)/);
  
  const family = familyMatch ? familyMatch[1].trim().replace(/\s+/g, '') : 'Unknown';
  const weight = weightMatch ? weightMatch[1] : '400';
  
  // 從 URL 提取更多信息
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  
  return { family, weight, filename: `${family}-${weight}.woff2` };
}

async function main() {
  console.log('開始下載字體...\n');
  
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }
  
  const downloadedFonts = [];
  
  for (const cssUrl of FONT_CSS_URLS) {
    console.log(`獲取 CSS: ${cssUrl.split('family=')[1].split('&')[0]}`);
    
    try {
      const css = await fetchURL(cssUrl);
      const woff2URLs = extractWoff2URLs(css);
      
      console.log(`  找到 ${woff2URLs.length} 個 woff2 檔案`);
      
      // 解析 CSS 來獲取字體信息
      const fontFaceBlocks = css.split('@font-face');
      
      for (let i = 0; i < woff2URLs.length; i++) {
        const url = woff2URLs[i];
        
        // 從 URL 推斷檔名
        const urlPath = new URL(url).pathname;
        const originalFilename = path.basename(urlPath);
        
        // 嘗試從 CSS 獲取更好的名稱
        let filename = originalFilename;
        if (i + 1 < fontFaceBlocks.length) {
          const block = fontFaceBlocks[i + 1];
          const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)/);
          const weightMatch = block.match(/font-weight:\s*(\d+)/);
          if (familyMatch && weightMatch) {
            const family = familyMatch[1].trim().replace(/\s+/g, '');
            filename = `${family}-${weightMatch[1]}.woff2`;
          }
        }
        
        process.stdout.write(`  下載 ${filename}...`);
        
        try {
          const size = await downloadFile(url, filename);
          const sizeKB = Math.round(size / 1024);
          console.log(` ✓ (${sizeKB} KB)`);
          downloadedFonts.push({ filename, size: sizeKB });
        } catch (err) {
          console.log(` ✗ ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`  ✗ 獲取 CSS 失敗: ${err.message}`);
    }
    
    console.log('');
  }
  
  console.log('=== 下載完成 ===');
  console.log(`總共 ${downloadedFonts.length} 個字體檔案`);
  
  // 列出所有字體
  const files = fs.readdirSync(FONTS_DIR).filter(f => f.endsWith('.woff2'));
  let totalSize = 0;
  files.forEach(f => {
    const stats = fs.statSync(path.join(FONTS_DIR, f));
    const sizeKB = Math.round(stats.size / 1024);
    totalSize += sizeKB;
    console.log(`  ${f} (${sizeKB} KB)`);
  });
  console.log(`總大小: ${totalSize} KB`);
}

main().catch(console.error);
