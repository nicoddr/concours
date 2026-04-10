const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'Data (1).md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1941-1945', startToken: '**1941 – 1945**', title: '1941–1945 | Occupation Japonaise', endToken: '**1962**' },
    { id: '1962', startToken: '**1962**', title: '1962 | La Révolte de Brunei', endToken: '**1984**' },
    { id: '1984', startToken: '**1984**', title: '1984 | Souveraineté Totale', endToken: null }
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
    let lines = section.split('\n');
    lines = lines.slice(4); // exclude header lines (token, empty, subheader, empty)
    section = lines.join('\n').replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${c.title}',\n    audio: '${c.id}.m4a',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

const outputPath = path.join(__dirname, 'data.js');
fs.writeFileSync(outputPath, result);
console.log('Build data successful for Brunei.');
