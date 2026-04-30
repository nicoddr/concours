const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\China';
const mdPath = path.join(baseDir, 'DATA (11).md');
const outputPath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1945–1949', startToken: '1945–1949 | Guerre Civile Chinoise', endToken: '1950 | Guerre de Corée & Tibet', audio: '1945-1949 (1).m4a' },
    { id: '1950', startToken: '1950 | Guerre de Corée & Tibet', endToken: '1962 | Guerre Sino-Indienne', audio: '1950.m4a' },
    { id: '1962', startToken: '1962 | Guerre Sino-Indienne', endToken: '1979 | Guerre Sino-Vietnamienne', audio: '1962 (2).m4a' },
    { id: '1979', startToken: '1979 | Guerre Sino-Vietnamienne', endToken: '1996 | Troisième Crise du Détroit de Taïwan', audio: '1979.m4a' },
    { id: '1996', startToken: '1996 | Troisième Crise du Détroit de Taïwan', endToken: '2020–2022 | Escarmouches Récentes', audio: '1995-1996.m4a' },
    { id: '2020–2022', startToken: '2020–2022 | Escarmouches Récentes', endToken: null, audio: '2020-2022.m4a' }
];

const titles = {
    '1945–1949': '1945–1949 | Guerre Civile Chinoise',
    '1950': '1950 | Guerre de Corée & Tibet',
    '1962': '1962 | Guerre Sino-Indienne',
    '1979': '1979 | Guerre Sino-Vietnamienne',
    '1996': '1996 | Troisième Crise du Détroit de Taïwan',
    '2020–2022': '2020–2022 | Escarmouches Récentes'
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
    
    // Skip the first 2 lines (summary and empty line) to start with the first header/paragraph
    let contentLines = lines.slice(2);
    let content = contentLines.join('\n').replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${titles[c.id]}',\n    audio: '${c.audio}',\n    content: \`\n${content}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
