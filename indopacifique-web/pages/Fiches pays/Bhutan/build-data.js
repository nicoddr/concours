const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Bhutan\\DATA (3).md', 'utf8');

const conflicts = [
    { id: '1949', startToken: '# **Rapport Stratégique : Le Traité de Paix et d’Amitié Inde-Bhoutan de 1949 et son Évolution**', endToken: '# **Rapport Analytique' },
    { id: '1990-1996', startToken: '# **Rapport Analytique : Le Conflit Lhotshampa au Bhoutan (1990-1996) — Origines, Exil et Conséquences Contemporaines**', endToken: '# **Rapport Stratégique' },
    { id: '2003', startToken: '# **Rapport Stratégique : Opération « All Clear » (2003) — Souveraineté et Sécurité dans l’Himalaya**', endToken: '# **Rapport d’Analyse' },
    { id: '2017', startToken: '# **Rapport d’Analyse : L’Impasse de Doklam (2017) et ses Répercussions Géopolitiques**', endToken: null }
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

    result += `  '${c.id}': {\n    title: ${JSON.stringify(title)},\n    audio: '${c.id}.m4a',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Bhutan\\data.js', result);
console.log('Bhutan build data successful.');
