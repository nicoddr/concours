const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\India';
const mdFilePath = path.join(baseDir, 'Data (6).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1947-1948', 
        title: '1947–1948 | 1ère Guerre Indo-Pakistanaise (Cachemire)',
        audio: '1947-1948.m4a',
        startToken: '# **Rapport Historique : La Première Guerre du Cachemire (1947–1948)**', 
        endToken: '1962 Sino-Indian War' 
    },
    { 
        id: '1962', 
        title: '1962 | Guerre Sino-Indienne',
        audio: '1962 (1).m4a',
        startToken: '# **Analyse Historique du Conflit Sino-Indien de 1962 : Origines, Ruptures et Héritage Stratégique**', 
        endToken: '1965 Indo-Pakistani War of 1965' 
    },
    { 
        id: '1965', 
        title: '1965 | 2ème Guerre Indo-Pakistanaise',
        audio: '1965.m4a',
        startToken: '# **Rapport d\'Analyse Historique : La Guerre Indo-Pakistanaise de 1965**', 
        endToken: '1971 Indo-Pakistani War of 1971' 
    },
    { 
        id: '1971', 
        title: '1971 | 3ème Guerre Indo-Pakistanaise',
        audio: '1971.m4a',
        startToken: '# **Rapport Analytique : Le Conflit Indo-Pakistanais de 1971 et la Naissance du Bangladesh**', 
        endToken: '1999 Kargil War' 
    },
    { 
        id: '1999', 
        title: '1999 | Guerre de Kargil',
        audio: '1999.m4a',
        startToken: '# **Rapport d\'Analyse Stratégique : Le Conflit de Kargil (1999) — Rupture, Résilience et Réforme**', 
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

    result += `  '${c.id}': {\n    title: '${c.title}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});

result += '};\n';

fs.writeFileSync(outputFilePath, result);
console.log('Build data successful: ' + outputFilePath);
