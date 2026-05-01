const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'DATA (12).md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { 
        id: '1947', 
        audio: '1947 (2).m4a',
        startToken: '1947 | Incident du 28 Février', 
        endToken: '1949 | Retraite de la Guerre Civile' 
    },
    { 
        id: '1949', 
        audio: '1949.m4a',
        startToken: '1949 | Retraite de la Guerre Civile', 
        endToken: '"Crises du Détroit de Taïwan 1954–1955' 
    },
    { 
        id: 'Crises_du_Détroit', 
        audio: 'Crises_du_Détroit.m4a',
        startToken: '"Crises du Détroit de Taïwan 1954–1955', 
        endToken: '2022–Présent | Tensions Continues' 
    },
    { 
        id: '2022-Présent', 
        audio: '2022-Présent.m4a',
        startToken: '2022–Présent | Tensions Continues', 
        endToken: null 
    }
];

let result = 'const conflictData = {\n';
conflicts.forEach(c => {
    let startIdx = mdContent.indexOf(c.startToken);
    let endIdx = c.endToken ? mdContent.indexOf(c.endToken) : mdContent.length;
    
    if (startIdx === -1) {
        console.error('Could not find ' + c.startToken);
        return;
    }
    
    let section = mdContent.substring(startIdx, endIdx).trim();
    
    // Extract title from the first line of the section
    let lines = section.split('\n');
    let title = lines[0].trim().replace(/^"|"$/g, ''); // Remove quotes if any
    
    // The content starts after the title and maybe some extra lines
    // In these files, there is usually a # **Title** on line 3
    // Let's just keep everything and let marked handle it, but maybe skip the first summary line
    let content = lines.slice(2).join('\n').trim();
    
    content = content.replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${c.audio}',\n    content: \`\n${content}\n\`\n  },\n`;
});
result += '};\n';

const outputPath = path.join(__dirname, 'data.js');
fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
