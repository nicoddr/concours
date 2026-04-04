const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Vietnam\\Data.md', 'utf8');

const conflicts = [
    { id: '1945-1954', startToken: '#### **First Indochina War**', endToken: '1955–1975' },
    { id: '1955-1975', startToken: '#### **Vietnam War (Second Indochina War)**', endToken: '1978–1989' },
    { id: '1978-1989', startToken: '#### **Cambodian–Vietnamese War**', endToken: '1979\n' },
    { id: '1979', startToken: '#### **Sino-Vietnamese War**', endToken: '1988\n' },
    { id: '1988', startToken: '#### **Johnson South Reef Skirmish**', endToken: 'Present\n' },
    { id: 'Present', startToken: '#### **Maritime Tensions**', endToken: null }
];

const titles = {
    '1945-1954': "1945–1954 | Première Guerre d'Indochine",
    '1955-1975': "1955–1975 | Guerre du Viêt Nam (2e G. d'Indochine)",
    '1978-1989': "1978–1989 | Guerre Cambodge-Viêt Nam",
    '1979': "1979 | Guerre Sino-Vietnamienne",
    '1988': "1988 | Escarmouche du Récif Johnson South",
    'Present': "Présent | Tensions Maritimes & Récifs"
};

const audioMap = {
    '1945-1954': "1945-1954.m4a",
    '1955-1975': "1955–1975.m4a",
    '1978-1989': "1978–1989.m4a",
    '1979': "1979.m4a",
    '1988': "1988.m4a",
    'Present': "Present.m4a"
};

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

    let title = titles[c.id];
    let audio = audioMap[c.id];

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Vietnam\\data.js', result);
console.log('Build data successful.');
