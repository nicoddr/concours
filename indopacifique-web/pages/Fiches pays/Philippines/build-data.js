const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Philippines\\Data (1).md', 'utf8');

const conflicts = [
    { id: '1946-1954', startToken: '# **Analyse Stratégique de la Rébellion Hukbalahap', endToken: 'Korean War (1950–1953)', audio: '1946-1954.m4a', title: '1946–1954 | Rébellion Hukbalahap' },
    { id: '1950-1953', startToken: '# **Rapport de Mission : Le Contingent PEFTOK', endToken: 'Vietnam War (1964–1973)', audio: '1950–1953.m4a', title: '1950–1953 | Guerre de Corée (PEFTOK)' },
    { id: '1964-1973', startToken: '# **Rapport Stratégique : Évolution des Doctrines Militaires', endToken: 'Communist Insurgency (1969–Present)', audio: '1964–1973.m4a', title: '1964–1973 | Guerre du Vietnam (PHILCAGV)' },
    { id: '1969-Present', startToken: '# **Rapport Analytique : L\'Insurrection Communiste aux Philippines', endToken: 'Moro Conflict (1969–2014)', audio: '1969–Present.m4a', title: '1969–Présent | Insurrection communiste' },
    { id: '1969-2014', startToken: '# **Rapport Analytique : Le Conflit Moro et l\'Instabilité', endToken: 'Zamboanga City Crisis (2013)', audio: '1969–2014.m4a', title: '1969–2014 | Conflit Moro' },
    { id: '2013', startToken: '# **Rapport Analytique : La Crise de Zamboanga', endToken: 'Battle of Marawi (2017)', audio: '2013.m4a', title: '2013 | Crise de Zamboanga' },
    { id: '2017', startToken: '# **Rapport Analytique : La Bataille de Marawi', endToken: null, audio: '2017.m4a', title: '2017 | Bataille de Marawi' }
];

let result = 'const conflictData = {\n';
conflicts.forEach((c) => {
    let startIdx = mdContent.indexOf(c.startToken);
    if (startIdx === -1) {
        console.error('Could not find ' + c.startToken);
        return;
    }
    let endIdx = c.endToken ? mdContent.indexOf(c.endToken, startIdx) : mdContent.length;
    if (endIdx === -1) endIdx = mdContent.length;
    
    let section = mdContent.substring(startIdx, endIdx).trim();
    section = section.replace(/`/g, '\\`');

    result += `  '${c.id}': {\n    title: '${c.title}',\n    audio: '${c.audio}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Philippines\\data.js', result);
console.log('Build data successful.');
