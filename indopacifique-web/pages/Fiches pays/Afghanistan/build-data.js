const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Afghanistan';
const mdFilePath = path.join(baseDir, 'DATA (8).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1979-1989', 
        title: '1979–1989 | Invasion et Guerre Soviétique',
        audio: '1979-1989.m4a',
        startToken: '# **Conflit Historique en Afghanistan (1979–1989) : Analyse Structurelle de l\'Invasion Soviétique et de la Résistance Moudjahidine**', 
        endToken: '2001–2021 |' 
    },
    { 
        id: '2001-2021', 
        title: '2001–2021 | Guerre d\'Afghanistan (Invasion Américaine)',
        audio: '2001-2021.m4a',
        startToken: '# **Conflit en Afghanistan (2001–2021) : De l\'Intervention Internationale au Retour des Talibans**', 
        endToken: '2026–Présent |' 
    },
    { 
        id: '2026-Present', 
        title: '2026–Présent | Guerre Ouverte Afghanistan-Pakistan',
        audio: '2026-Present.m4a',
        startToken: '# **Rapport de Conflit : La Guerre Ouverte Afghanistan-Pakistan (2026–Présent)**', 
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
