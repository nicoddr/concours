const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Malaysia\\Malaysia.md', 'utf8');

const conflicts = [
    {id: '1948-1960', startToken: '#### **1948–1960 | Malayan Emergency**', endToken: '#### **1963–1966'},
    {id: '1963-1966', startToken: '#### **1963–1966 | Konfrontasi**', endToken: '#### **1968–1989'},
    {id: '1968-1989', startToken: '#### **1968–1989 | Communist Insurgency**', endToken: '#### **2013 | Lahad Datu'},
    {id: '2013', startToken: '#### **2013 | Lahad Datu Standoff**', endToken: null}
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
    lines = lines.slice(4); // exclude header lines
    section = lines.join('\n').replace(/`/g, '\\`');
    
    // Extract title
    let title = c.startToken.replace('#### **', '').replace('**', '');
    
    result += `  '${c.id}': {\n    title: '${title}',\n    audio: '${c.id}.m4a',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Malaysia\\data.js', result);
console.log('Build data successful.');
