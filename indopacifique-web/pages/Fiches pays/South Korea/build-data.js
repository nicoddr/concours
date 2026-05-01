const fs = require('fs');
const path = require('path');

const mdPath = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\South Korea\\DATA (12).md';
const outputPath = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\South Korea\\data.js';

const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { 
        id: '1950-1953', 
        startToken: '1950–1953 | Guerre de Corée', 
        endToken: '1966–1969 | Conflit de la DMZ',
        audio: '1950-1953 (1).m4a',
        title: '1950–1953 | Guerre de Corée'
    },
    { 
        id: '1966-1969', 
        startToken: '1966–1969 | Conflit de la DMZ', 
        endToken: '2010 | ROKS Cheonan & Yeonpyeong',
        audio: '1966–1969.m4a',
        title: '1966–1969 | Conflit de la DMZ'
    },
    { 
        id: '2010', 
        startToken: '2010 | ROKS Cheonan & Yeonpyeong', 
        endToken: 'Déc 2025 | Crise de la Loi Martiale',
        audio: '2010.m4a',
        title: '2010 | ROKS Cheonan & Yeonpyeong'
    },
    { 
        id: '2025', 
        startToken: 'Déc 2025 | Crise de la Loi Martiale', 
        endToken: 'Présent | Maintien des tensions post-DMZ',
        audio: '2025.m4a',
        title: 'Déc 2025 | Crise de la Loi Martiale'
    },
    { 
        id: 'Présent', 
        startToken: 'Présent | Maintien des tensions post-DMZ', 
        endToken: null,
        audio: 'Présent.m4a',
        title: 'Présent | Maintien des tensions'
    }
];

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
    
    // The first line is the token/summary line. The content usually starts after a few lines.
    // However, I should keep everything from the # header onwards if possible, or just skip the first line.
    // In South Korea MD, the summary line is followed by an empty line, then the header.
    // Let's skip the first two lines (summary and empty line).
    if (lines.length > 2) {
        lines = lines.slice(2);
    }
    
    section = lines.join('\n').replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: "${c.title}",\n    audio: "${c.audio}",\n    content: \`\n${section}\n\`\n  },\n`;
});

result += '};\n';

fs.writeFileSync(outputPath, result);
console.log('Build data successful for South Korea.');
