const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Maldives';
const mdFilePath = path.join(baseDir, 'DATA (5).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1953', 
        title: '1953 | Proclamation de la Première République',
        audio: '1953.m4a',
        startToken: '# **Analyse Historique : L\'Échec de la Première République des Maldives (1953)**', 
        endToken: '1959–1963 |' 
    },
    { 
        id: '1959-1963', 
        title: '1959–1963 | Sécession de Suvadive',
        audio: '1959-1963.m4a',
        startToken: '# **Rapport Historique : La Sécession de la République Unie de Suvadive (1959–1963) et ses Conséquences**', 
        endToken: '1965 et 1968 |' 
    },
    { 
        id: '1965-1968', 
        title: '1965–1968 | Indépendance & Seconde République',
        audio: '1965-1968.m4a',
        startToken: '# **Rapport Historique : La Transition Souveraine des Maldives (1965–1968)**', 
        endToken: '1988 |' 
    },
    { 
        id: '1988', 
        title: '1988 | Opération Cactus',
        audio: '1988.m4a',
        startToken: '# **Rapport d\'Analyse : L\'Opération Cactus et la Tentative de Coup d\'État de 1988 aux Maldives**', 
        endToken: '2008–2018 |' 
    },
    { 
        id: '2008-2018', 
        title: '2008–2018 | Instabilité Chronique',
        audio: '2008-2018.m4a',
        startToken: '# **L\u2019Archipel de l\u2019Instabilité : Analyse du Contexte de Conflit aux Maldives (2008–2018)**', 
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
