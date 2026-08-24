/**
 * 圖片下載與 Base64 轉換腳本
 * 用途：將 Imgur CDN 圖片下載並轉為 Base64，供離線使用
 * 執行：node scripts/download-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES = {
  logo: 'https://i.imgur.com/m7xnqEo.png',
  Lleaf01: 'https://i.imgur.com/R7brK8S.png',
  Ltea01: 'https://i.imgur.com/7YoJGXP.png',
  Rleaf01: 'https://i.imgur.com/VQoiPLZ.png',
  Lleaf02: 'https://i.imgur.com/Y3DDstp.png',
  Ltea02: 'https://i.imgur.com/ZvIPmGZ.png',
  Rleaf02: 'https://i.imgur.com/20VAs4D.png',
  Lleaf03: 'https://i.imgur.com/qrYlB89.png',
  Ltea03: 'https://i.imgur.com/XvkAzkq.png',
  Rleaf03: 'https://i.imgur.com/WdBACx1.png',
  Lleaf04: 'https://i.imgur.com/piFJe3D.png',
  Ltea04: 'https://i.imgur.com/UQElilL.png',
  Rleaf04: 'https://i.imgur.com/DVVeo5S.png',
  Lleaf05: 'https://i.imgur.com/j4oDo4K.png',
  Ltea05: 'https://i.imgur.com/UTPFuE9.png',
  Rleaf05: 'https://i.imgur.com/4PcTEKD.png',
  icon_tea: 'https://i.imgur.com/jefyVWB.png',
  icon_bubble: 'https://i.imgur.com/sMPtqn2.png',
  icon_flower: 'https://i.imgur.com/2v5oNuM.png',
  icon_passion: 'https://i.imgur.com/2iKWyLF.png',
  icon_redbean: 'https://i.imgur.com/oWT18Dm.png'
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers['content-type'] || 'image/png';
        resolve(`data:${mimeType};base64,${base64}`);
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('開始下載圖片...\n');
  
  const results = {};
  const entries = Object.entries(IMAGES);
  
  for (let i = 0; i < entries.length; i++) {
    const [name, url] = entries[i];
    process.stdout.write(`[${i + 1}/${entries.length}] 下載 ${name}...`);
    
    try {
      const base64 = await downloadImage(url);
      results[name] = base64;
      const sizeKB = Math.round(base64.length / 1024);
      console.log(` ✓ (${sizeKB} KB)`);
    } catch (error) {
      console.log(` ✗ 失敗: ${error.message}`);
      results[name] = '';
    }
  }
  
  const outputPath = path.join(__dirname, '..', 'assets', 'images.js');
  const jsContent = `/**
 * 內嵌圖片資源（Base64 編碼）
 * 自動生成於 ${new Date().toISOString()}
 * 執行 node scripts/download-images.js 可重新生成
 */

const IMAGES = ${JSON.stringify(results, null, 2)};

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IMAGES;
}
`;

  fs.writeFileSync(outputPath, jsContent, 'utf8');
  
  const totalSize = Object.values(results).reduce((sum, s) => sum + s.length, 0);
  console.log(`\n完成！共 ${entries.length} 張圖片`);
  console.log(`總大小: ${Math.round(totalSize / 1024)} KB`);
  console.log(`輸出: ${outputPath}`);
}

main().catch(console.error);
