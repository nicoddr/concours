const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Thailand\\DATA (3).md', 'utf8');

const conflicts = [
    { id: '1947', startToken: '**1947:**', endToken: '**1950–1953:**', audio: '1947.m4a' },
    { id: '1950-1953', startToken: '**1950–1953:**', endToken: '**1965–1982:**', audio: '1950-1953.m4a' },
    { id: '1965-1982', startToken: '**1965–1982:**', endToken: '**1965–1972:**', audio: '1965-1982.m4a' },
    { id: '1965-1972', startToken: '**1965–1972:**', endToken: '**1976:**', audio: '1965-1972.m4a' },
    { id: '1976', startToken: '**1976:**', endToken: '**1992:**', audio: '1976.m4a' },
    { id: '1992', startToken: '**1992:**', endToken: '**2004–Present:**', audio: '1992.m4a' },
    { id: '2004-Present', startToken: '**2004–Present:**', endToken: '**2006:**', audio: '2024-Present.m4a' }, // Note: mapped to 2024-Present.m4a
    { id: '2006', startToken: '**2006:**', endToken: '**2008–2011:**', audio: '2006.m4a' },
    { id: '2008-2011', startToken: '**2008–2011:**', endToken: '**2014:**', audio: '2008-2011.m4a' },
    { id: '2014', startToken: '**2014:**', endToken: null, audio: '2014.m4a' }
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
    lines = lines.slice(1); // exclude header line (e.g. **1947:** ...)
    section = lines.join('\n').replace(/`/g, '\\`');

    let titleRaw = section.split('\n').find(l => l.startsWith('# '));
    let title = titleRaw ? titleRaw.replace('# **', '').replace('**', '').replace('# ', '').trim() : c.id;

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Thailand\\data.js', result);
console.log('Build data successful for Thailand.');
