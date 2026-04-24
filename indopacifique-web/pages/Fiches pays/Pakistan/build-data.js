const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Pakistan';
const mdFilePath = path.join(baseDir, 'DATA (4).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1947-1948', 
        title: '1947–1948 | 1ère Guerre Indo-Pakistanaise (Cachemire)',
        audio: '1947-1948 (2).m4a',
        startToken: '# **Rapport Historique : Le Premier Conflit Indo-Pakistanais sur le Jammu-et-Cachemire (1947–1948)**', 
        endToken: '1971 Third Indo-Pakistani War' 
    },
    { 
        id: '1971', 
        title: '1971 | 3ème Guerre Indo-Pakistanaise',
        audio: '1971 (1).m4a',
        startToken: '# **Rapport Historique et Stratégique : La Troisième Guerre Indo-Pakistanaise de 1971 et l\'Émergence du Bangladesh**', 
        endToken: '1999 Kargil Conflict' 
    },
    { 
        id: '1999', 
        title: '1999 | Conflit de Kargil',
        audio: '1999 (1).m4a',
        startToken: '# **Rapport Stratégique : Le Conflit de Kargil (1999) et l\'Évolution de la Guerre en Haute Altitude**', 
        endToken: '2025–2026 Afghanistan-Pakistan Border Conflicts' 
    },
    { 
        id: '2025-2026', 
        title: '2025–2026 | Conflits Frontaliers & Frappes Aériennes',
        audio: '2025-2026.m4a',
        startToken: '# **Rapport Analytique : Le Pakistan face à l\'Instabilité Régionale et aux Conflits Transfrontaliers (2025–2026)**', 
        endToken: null 
    }
];

let result = 'const conflictData = {\n';

conflicts.forEach(c => {
    let startIdx = mdContent.indexOf(c.startToken);
    if (startIdx === -1) {
        console.error('Could not find start token for ' + c.id + ': ' + c.startToken);
        return;
    }
    
    let endIdx = c.endToken ? mdContent.indexOf(c.endToken) : mdContent.length;
    if (c.endToken && endIdx === -1) {
        console.error('Could not find end token for ' + c.id + ': ' + c.endToken);
        endIdx = mdContent.length;
    }

    let section = mdContent.substring(startIdx, endIdx).trim();
    
    // Escaping backticks for JS template literal
    section = section.replace(/`/g, '\\`');

    const safeTitle = c.title.replace(/'/g, "\\'");
    result += `  '${c.id}': {\n    title: '${safeTitle}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});

result += '};\n';

fs.writeFileSync(outputFilePath, result);
console.log('Build data successful: ' + outputFilePath);
