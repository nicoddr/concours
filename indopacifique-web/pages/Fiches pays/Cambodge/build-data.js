const fs = require('fs');

const mdContent = fs.readFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Cambodge\\Data (3).md', 'utf8');

const conflicts = [
    { id: '1946-1954', startToken: '# **Rapport Historique : Le Cambodge dans la Première Guerre d\'Indochine (1946–1954)**', endToken: '# **Rapport d\'Analyse Historique' },
    { id: '1967-1975', startToken: '# **Rapport d\'Analyse Historique : La Guerre Civile Cambodgienne (1967–1975)**', endToken: '# **Rapport de Synthèse' },
    { id: '1970-1973', startToken: '# **Rapport de Synthèse : Le Désengagement Militaire des États-Unis au Cambodge et l\'Amendement Case-Church (1970-1973)**', endToken: '# **Rapport Analytique' },
    { id: '1975-1979', startToken: '# **Rapport Analytique : Le Génocide Cambodgien et les Mécanismes de Justice (1975-1979)**', endToken: '# **Rapport Analytique' },
    { id: '1978–1989', audioId: '1978–1989', startToken: '# **Rapport Analytique : Le Conflit Cambodge-Vietnam (1978–1989) — De l\'Invasion à la Transition Diplomatique**', endToken: '# **Rapport Analytique' },
    { id: '1989–1998', audioId: '1989–1998', startToken: '# **Rapport Analytique : Le Conflit Cambodgien et la Transition vers la Paix (1989–1998)**', endToken: null }
];

let result = 'const conflictData = {\n';
conflicts.forEach((c, idx) => {
    let startIdx = mdContent.indexOf(c.startToken);
    let searchStr = c.endToken;
    let endIdx = searchStr ? mdContent.indexOf(searchStr, startIdx + c.startToken.length) : mdContent.length;
    
    if (startIdx === -1) {
        console.error('Could not find ' + c.startToken);
        return;
    }
    
    if (searchStr && endIdx === -1) {
        // Try looking from the end if there are multiple occurrences? Just default to length if not found.
        endIdx = mdContent.length;
    }

    let section = mdContent.substring(startIdx, endIdx).trim();
    let lines = section.split('\n');
    lines = lines.slice(1); // exclude header line
    section = lines.join('\n').replace(/`/g, '\\`');

    let title = c.startToken.replace('# **', '').replace('**', '');
    let audioFile = c.audioId ? `${c.audioId}.m4a` : `${c.id}.m4a`;

    result += `  '${c.id}': {\n    title: ${JSON.stringify(title)},\n    audio: '${audioFile}',\n    content: \`\n${section}\n\`\n  },\n`;
});
result += '};\n';

fs.writeFileSync('C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Cambodge\\data.js', result);
console.log('Cambodge build data successful.');
