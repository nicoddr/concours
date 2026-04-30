const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Japan';
const mdPath = path.join(baseDir, 'DATA (10).md');
const outputPath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1868-1869', startToken: '1868–1869 | Guerre de Boshin', endToken: '1904–1905 | Guerre russo-japonaise', audio: '1868-1869.m4a' },
    { id: '1904-1905', startToken: '1904–1905 | Guerre russo-japonaise', endToken: '1941–1945 | Guerre du Pacifique (WWII)', audio: '1904-1905.m4a' },
    { id: '1941–1945', startToken: '1941–1945 | Guerre du Pacifique (WWII)', endToken: '1947 | Article 9', audio: '1941–1945.m4a' },
    { id: '1947', startToken: '1947 | Article 9', endToken: '2022–2026 | Virage Stratégique Moderne', audio: '1947 (1).m4a' },
    { id: '2022–2026', startToken: '2022–2026 | Virage Stratégique Moderne', endToken: null, audio: '2022-2026.m4a' }
];

const titles = {
    '1868-1869': '1868–1869 | Guerre de Boshin',
    '1904-1905': '1904–1905 | Guerre russo-japonaise',
    '1941–1945': '1941–1945 | Guerre du Pacifique (WWII)',
    '1947': '1947 | Article 9',
    '2022–2026': '2022–2026 | Virage Stratégique Moderne'
};

let result = 'const conflictData = {\n';
conflicts.forEach(c => {
    let startIdx = mdContent.indexOf(c.startToken);
    let endIdx = c.endToken ? mdContent.indexOf(c.endToken) : mdContent.length;
    
    if (startIdx === -1) {
        console.error('Could not find start token: ' + c.startToken);
        return;
    }
    
    let section = mdContent.substring(startIdx, endIdx).trim();
    let lines = section.split('\n');
    
    // The format seems to be:
    // Line 0: Summary line (1868–1869 | ...)
    // Line 1: empty
    // Line 2: # **Title**
    // ... rest is content
    
    // We skip the summary line (line 0) and the empty line (line 1)
    // But we keep the # Title if we want, or skip it. 
    // Let's skip the first 2 lines to start with the first header/paragraph.
    let contentLines = lines.slice(2);
    let content = contentLines.join('\n').replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${titles[c.id]}',\n    audio: '${c.audio}',\n    content: \`\n${content}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
