const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Myanmar\\Data (3).md', 'utf8');

const conflicts = [
    { id: '2021-Present', startToken: '**2021 – Present**', endToken: '**1948 – Present**', audio: '2021-Present.m4a' },
    { id: '1948-Present', startToken: '**1948 – Present**', endToken: '**1949 – 1961**', audio: '1948-Present.m4a' },
    { id: '1949-1961', startToken: '**1949 – 1961**', endToken: null, audio: '1949-1961.m4a' }
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
    lines = lines.slice(1); // exclude header line (e.g. **2021 – Present**)
    section = lines.join('\n').replace(/`/g, '\\`');

    let titleRaw = section.split('\n').find(l => l.startsWith('# '));
    let title = titleRaw ? titleRaw.replace('# **', '').replace('**', '').replace('# ', '').trim() : c.id;

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Myanmar\\data.js', result);
console.log('Build data successful for Myanmar.');
