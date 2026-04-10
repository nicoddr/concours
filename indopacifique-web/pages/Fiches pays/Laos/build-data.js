const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'Data (2).md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1946-1954', titleFr: "Première Guerre d'Indochine (1946–1954)", startToken: '#### **First Indochina War (1946–1954)**', endToken: '#### **Laotian Civil War' },
    { id: '1953-1975', titleFr: 'Guerre Civile Laotienne / "Guerre Secrète" (1953–1975)', startToken: '#### **Laotian Civil War / "Secret War" (1953–1975)**', endToken: '#### **Vietnam War' },
    { id: '1964-1973', titleFr: 'Guerre du Vietnam / Bombardements Américains (1964–1973)', startToken: '#### **Vietnam War / U.S. Bombing (1964–1973)**', endToken: '#### **Thai-Laotian Border War' },
    { id: '1987-1988', titleFr: 'Guerre Frontalière Thaï-Lao (1987–1988)', startToken: '#### **Thai-Laotian Border War (1987–1988)**', endToken: null }
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
    
    // For Laos, let's strip the first header line from the content
    lines.shift(); 
    section = lines.join('\n').trim().replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: ${JSON.stringify(c.titleFr)},\n    audio: '${c.id}.m4a',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

const outputPath = path.join(__dirname, 'data.js');
fs.writeFileSync(outputPath, result);
console.log('Build data successful: ' + outputPath);
