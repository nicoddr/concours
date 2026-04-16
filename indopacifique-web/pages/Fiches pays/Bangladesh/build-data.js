const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Bangladesh';
const mdFilePath = path.join(baseDir, 'DATA (3).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1947', 
        title: '1947 | Partition des Indes',
        audio: '1947 (1).m4a',
        startToken: '# **Rapport Historique : La Partition du Bengale (1947) et la Genèse du Bangladesh**', 
        endToken: '| 1971 |' 
    },
    { 
        id: '1971', 
        title: '1971 | Guerre de Libération',
        audio: '1971 (1).m4a',
        startToken: '# **Rapport Historique : La Guerre de Libération du Bangladesh (1971)**', 
        endToken: '| 1977–1997 |' 
    },
    { 
        id: '1977-1997', 
        title: '1977–1997 | Insurrection des Chittagong',
        audio: '1977-1997.m4a',
        startToken: '# **Rapport d\'Analyse Historique : L\'Insurrection des Chittagong Hill Tracts (1977–1997)**', 
        endToken: '| 2017–Présent |' 
    },
    { 
        id: '2017-Present', 
        title: '2017–Présent | Crise des Réfugiés Rohingyas',
        audio: '2017-Present.m4a',
        startToken: '# **Rapport Stratégique : La Crise des Réfugiés Rohingyas au Bangladesh (2017 – Présent)**', 
        endToken: '| 2024 |' 
    },
    { 
        id: '2024', 
        title: '2024 | Soulèvement National de Juillet',
        audio: '2024.m4a',
        startToken: '# **Rapport Analytique : Le Soulèvement National de Juillet 2024 au Bangladesh et la Refonte de l’État**', 
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
