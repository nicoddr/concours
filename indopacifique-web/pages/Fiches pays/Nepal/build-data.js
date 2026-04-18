const fs = require('fs');
const path = require('path');

const mdFilePath = path.join(__dirname, 'DATA (3).md');
const jsFilePath = path.join(__dirname, 'data.js');

const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const events = [
  { id: '1951', title: '1951 | Révolution de 1951', audio: '1951.m4a' },
  { id: '1960', title: '1960 | Coup d\'État Royal', audio: '1960.m4a' },
  { id: '1990', title: '1990 | Premier Mouvement Populaire', audio: '1990.m4a' },
  { id: '1996–2006', title: '1996–2006 | Guerre Civile (Insurrection Maoïste)', audio: '1996–2006.m4a' },
  { id: '2006', title: '2006 | Second Mouvement Populaire', audio: '2006 (1).m4a' },
  { id: '2025', title: '2025 | Soulèvement de Septembre (Gen Z)', audio: '2025-09.m4a' }
];

let result = 'const conflictData = {\n';

events.forEach((event, index) => {
    const escapedId = event.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Pattern to find the start of the event block: "YEAR |
    const startPattern = new RegExp(`"${escapedId} \\|`, 'g');
    const startMatch = startPattern.exec(mdContent);

    if (startMatch) {
        let blockContent = '';
        
        // Find the start of the next event to determine the end of the current block
        let nextIndex = mdContent.length;
        for (let j = 0; j < events.length; j++) {
            if (events[j].id === event.id) continue;
            const nextEscapedId = events[j].id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const nextPattern = new RegExp(`"${nextEscapedId} \\|`, 'g');
            const nextMatch = nextPattern.exec(mdContent);
            if (nextMatch && nextMatch.index > startMatch.index && nextMatch.index < nextIndex) {
                nextIndex = nextMatch.index;
            }
        }

        blockContent = mdContent.substring(startMatch.index, nextIndex).trim();

        // Remove the CSV-like header: everything from the first " to the closing "
        // Example: "1951 | Title \n Description"
        blockContent = blockContent.replace(/^"[\s\S]*?"/, '').trim();

        // Escape backticks for the template literal
        const safeContent = blockContent.replace(/`/g, '\\`');
        
        // Escape single quotes for the title string
        const safeTitle = event.title.replace(/'/g, "\\'");

        result += `  '${event.id}': {\n    title: '${safeTitle}',\n    audio: '${event.audio}',\n    content: \`\n${safeContent}\n\`\n  },\n`;
    } else {
        console.warn(`Could not find data for event: ${event.id}`);
    }
});

result += '};\n';

fs.writeFileSync(jsFilePath, result);
console.log('Build data successful: data.js generated.');
