const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Indonesie\\Data (3).md', 'utf8');

const conflicts = [
    { id: '1945-1949', startToken: '# **Rapport de Synthèse : La Révolution Nationale Indonésienne (1945-1949)**', endToken: '# **Rapport d\'Analyse Historique' },
    { id: '1948', startToken: '# **Rapport d\'Analyse Historique : L\'Affaire Madiun de 1948**', endToken: '# **Rapport d\'Analyse' },
    { id: '1953-1962', audioId: '1953-1962', startToken: '# **Rapport d\'Analyse : La Rébellion du Darul Islam à Aceh (1953–1962)**', endToken: '# **Crise de l\'État Unitaire' },
    { id: '1958-1961', audioId: '1958-1961', startToken: '# **Crise de l\'État Unitaire : Rapport sur les Rébellions PRRI/Permesta (1958–1961)**', endToken: '# **Rapport Géopolitique' },
    { id: '1963-1966', audioId: '1963-1966 (1)', startToken: '# **Rapport Géopolitique : La Confrontation Indonésie-Malaisie (Konfrontasi), 1963–1966**', endToken: '# **Rapport d\'Analyse' },
    { id: '1965-1966', audioId: '1965-1966', startToken: '# **Rapport d\'Analyse : La Transition vers l\'Ordre Nouveau en Indonésie (1965-1966)**', endToken: '# **Rapport de Synthèse' },
    { id: '1975-1999', audioId: '1975-1999', startToken: '# **Rapport de Synthèse : L\'Occupation Indonésienne du Timor-Leste (1975-1999)**', endToken: '# **Rapport Analytique' },
    { id: '1976-2005', audioId: '1976-2005', startToken: '# **Rapport Analytique : L\'Insurrection du Mouvement pour un Aceh Libre (GAM) (1976–2005)**', endToken: '# **Rapport de Situation' },
    { id: '1960-Present', audioId: '1960-Present', startToken: '# **Rapport de Situation : Le Conflit en Papouasie Occidentale (1960-Présent)**', endToken: null }
];

let result = 'const conflictData = {\n';
conflicts.forEach(c => {
    let startIdx = mdContent.indexOf(c.startToken);
    let endIdx = c.endToken ? mdContent.indexOf(c.endToken, startIdx + c.startToken.length) : mdContent.length;
    if (startIdx === -1) {
        console.error('Could not find ' + c.startToken);
        return;
    }
    let section = mdContent.substring(startIdx, endIdx).trim();
    let lines = section.split('\n');
    lines = lines.slice(1);
    section = lines.join('\n').replace(/`/g, '\\`');

    let title = c.startToken.replace('# **', '').replace('**', '');
    let audioFile = c.audioId ? `${c.audioId}.m4a` : `${c.id}.m4a`;

    result += `  '${c.id}': {\n    title: ${JSON.stringify(title)},\n    audio: '${audioFile}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Indonesie\\data.js', result);
console.log('Indonesie build data successful.');
