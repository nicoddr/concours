const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'Data (1).md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const conflicts = [
    { id: '1942-1945', header: '"1942–1945\n\nBattle of Timor  \nWorld War II Japanese occupation and strategic warfare."', nextHeader: '"1959' },
    { id: '1959', header: '"1959\n\nViqueque Rebellion  \nSignificant anti-colonial uprising against Portuguese rule."', nextHeader: '"1975\n\nEast' },
    { id: '1975', header: '"1975\n\nEast Timorese Civil War  \nViolent internal conflict between FRETILIN and UDT political factions."', nextHeader: '"1975–1999' },
    { id: '1975-1999', header: '"1975–1999\n\nIndonesian Occupation  \nTwo decades of resistance by FALINTIL against Indonesian integration."', nextHeader: '"1999' },
    { id: '1999', header: '"1999\n\nPost-Referendum Crisis  \nWidespread militia-led violence following the independence vote."', nextHeader: '"2006' },
    { id: '2006', header: '"2006\n\nEast Timorese Crisis  \nInternal military/police mutiny leading to widespread domestic unrest."', nextHeader: null }
];

let result = 'const conflictData = {\n';

conflicts.forEach(c => {
    let startIdx = mdContent.indexOf(c.header);
    if (startIdx === -1) {
        console.error('Could not find header for ' + c.id);
        return;
    }
    
    // We want the content *after* the header quote block.
    startIdx += c.header.length;
    
    let endIdx = c.nextHeader ? mdContent.indexOf(c.nextHeader) : mdContent.length;
    let section = mdContent.substring(startIdx, endIdx).trim();
    
    // Escape backticks in markdown to fit into JS template string
    section = section.replace(/`/g, '\\`');

    let titleMatch = section.match(/# \*\*(.*?)\*\*/);
    let title = titleMatch ? titleMatch[1] : c.id;

    result += `  '${c.id}': {\n    title: '${title.replace(/'/g, "\\'")}',\n    audio: '${c.id}.m4a',\n    content: \`\n${section}\n\`\n  },\n`;
});

result += '};\n';

fs.writeFileSync(path.join(__dirname, 'data.js'), result);
console.log('Build data successful.');
