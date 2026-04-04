const fs = require('fs');
const path = require('path');

const moduleFiles = [
  'mod1_strategie.html',
  'mod2_chine.html',
  'mod3_japon_coree.html',
  'mod4_asean.html',
  'mod5_inde.html',
  'mod6_transversaux.html'
];
const pagesDir = path.join(__dirname, 'pages');

for (const fileName of moduleFiles) {
  const filePath = path.join(pagesDir, fileName);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Add marked.js to head or scripts section if not present
  if (!html.includes('marked.min.js')) {
    html = html.replace(
      '<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.5/dist/mermaid.min.js"></script>',
      '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.5/dist/mermaid.min.js"></script>'
    );
  }
  
  // 2. Replace the inner logic of renderTab
  // Find the start: const currentTab = data.tabs[tabIndex];
  // Find the end: if (currentTab.mermaidData) {
  
  const startMarker = 'const currentTab = data.tabs[tabIndex];';
  const endMarker = 'if (currentTab.mermaidData) {';
  
  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    console.error(`Markers not found in ${fileName}`);
    continue;
  }
  
  const originalBlock = html.substring(startIndex + startMarker.length, endIndex);
  
  const newBlock = `
                    
                    // Utilisation de Marked.js pour le rendu du Markdown propre
                    let htmlParts = marked.parse(currentTab.synthesis);
                    let htmlContent = '<div class="formatted-lesson">' + htmlParts + '</div>';
                    
                    `;
  
  html = html.substring(0, startIndex + startMarker.length) + newBlock + html.substring(endIndex);
  
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`Patched renderTab in ${fileName}`);
}

console.log('All files patched successfully.');
