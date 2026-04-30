const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Mongolia';
const mdPath = path.join(baseDir, 'DATA (9).md');
const outputPath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1945', startToken: '1945 | Guerre Soviéto-Japonaise', endToken: '1946–1948 | Incident de Peitashan' },
    { id: '1946-1948', startToken: '1946–1948 | Incident de Peitashan', endToken: '2003–2021 | Missions Internationales' },
    { id: '2003–2021', startToken: '2003–2021 | Missions Internationales', endToken: '2022–2026 | Virage Stratégique Moderne' }
];

const titles = {
    '1945': '1945 | Guerre Soviéto-Japonaise',
    '1946-1948': '1946–1948 | Incident de Peitashan',
    '2003–2021': '2003–2021 | Missions Internationales'
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
    
    // Skip the summary line and the following header lines
    // Line 0: Summary (1945 | ...)
    // Line 1: empty
    // Line 2: # **Title**
    // Line 3: empty
    let contentLines = lines.slice(4);
    let content = contentLines.join('\n').replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${titles[c.id]}',\n    audio: '${c.id}.m4a',\n    content: \`\n${content}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
