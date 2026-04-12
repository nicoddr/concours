const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Singapore\\Data (3).md', 'utf8');

const conflicts = [
    { id: '1948-1960', startToken: '#### **Malayan Emergency**', endToken: '#### **Konfrontasi (Indonesian Confrontation)**', audio: '1948–1960.m4a' },
    { id: '1963-1966', startToken: '#### **Konfrontasi (Indonesian Confrontation)**', endToken: '#### **National Separation & SAF Establishment**', audio: '1963-1966.m4a' },
    { id: '1965', startToken: '#### **National Separation & SAF Establishment**', endToken: '#### **Five Power Defence Arrangements (FPDA)**', audio: '1965.m4a' },
    { id: '1971', startToken: '#### **Five Power Defence Arrangements (FPDA)**', endToken: '#### **Operation Snatch**', audio: '1971.m4a' },
    { id: '1991', startToken: '#### **Operation Snatch**', endToken: '#### **International Peacekeeping**', audio: '1991.m4a' },
    { id: '2000-Present', startToken: '#### **International Peacekeeping**', endToken: null, audio: '2000–Present.m4a' }
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
    lines = lines.slice(1); // exclude header lines (title itself)
    // Actually wait, let's keep the title if we want, or re-parse it
    section = lines.join('\n').replace(/`/g, '\\`');

    // Extract title
    let title = c.startToken.replace('#### **', '').replace('**', '');

    result += `  '${c.id}': {\n    title: '${title}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Singapore\\data.js', result);
console.log('Build data successful.');
