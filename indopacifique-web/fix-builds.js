const fs = require('fs');

const dirs = [
    'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Cambodge',
    'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Bhutan',
    'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Indonesie'
];

dirs.forEach(dir => {
    let scriptPath = dir + '\\build-data.js';
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Replace title string writing 
    // from: title: '${title}'
    // to: title: ${JSON.stringify(title)}
    
    scriptContent = scriptContent.replace(/title: '\$\{title\}',/g, 'title: ${JSON.stringify(title)},');
    
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('Fixed', scriptPath);
});
