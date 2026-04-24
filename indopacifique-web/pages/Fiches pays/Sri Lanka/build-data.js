const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Sri Lanka';
const mdFilePath = path.join(baseDir, 'DATA (3).md');
const outputFilePath = path.join(baseDir, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const conflicts = [
    { 
        id: '1971', 
        title: '1971 | Insurrection du JVP',
        audio: '1971 (3).m4a',
        startToken: '# **Rapport Historique : L\'Insurrection du JVP de 1971 au Sri Lanka**', 
        endToken: '1983–2009 |' 
    },
    { 
        id: '1983-2009', 
        title: '1983–2009 | Guerre Civile du Sri Lanka',
        audio: '1983-2009.m4a',
        startToken: '# **Conflit au Sri Lanka (1983–2009) : Analyse Contextuelle, Dynamiques et Conséquences**', 
        endToken: '2019 |' 
    },
    { 
        id: '2019', 
        title: '2019 | Attentats du Dimanche de Pâques',
        audio: '2019.m4a',
        startToken: '# **Rapport d\'Analyse : Les Attentats du Dimanche de Pâques 2019 au Sri Lanka**', 
        endToken: '2022 |' 
    },
    { 
        id: '2022', 
        title: '2022 | Mouvement "Aragalaya"',
        audio: '2022.m4a',
        startToken: '# **Rapport d\'Analyse : Du Soulèvement « Aragalaya » à la Présidence Dissanayake — La Métamorphose du Sri Lanka**', 
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
