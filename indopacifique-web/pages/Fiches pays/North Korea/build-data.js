const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'DATA (12).md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { 
        id: '1950-1953', 
        audio: '1950–1953.m4a',
        startToken: '1950–1953 | Guerre de Corée', 
        endToken: '1966–1969 | "Seconde Guerre de Corée" (DMZ)' 
    },
    { 
        id: '1966-1969', 
        audio: '1966–1969.m4a',
        startToken: '1966–1969 | "Seconde Guerre de Corée" (DMZ)', 
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
    
    // Extract title from the first line
    let lines = section.split('\n');
    let title = lines[0].trim();
    
    // Content starts after title and summary line
    let content = lines.slice(2).join('\n').trim();
    
    content = content.replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${c.audio}',\n    content: \`\n${content}\n\`\n  },\n`;
});
result += '};\n';

const outputPath = path.join(__dirname, 'data.js');
fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
