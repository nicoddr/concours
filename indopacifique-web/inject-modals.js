const fs = require('fs');
const path = require('path');

const modalHtml = `
    <script src="./data.js"></script>
    
    <!-- Modal Structure -->
    <div id="conflictModal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 sm:p-6 opacity-0 transition-opacity duration-300">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeConflictModal()"></div>
        <div class="relative w-full max-w-4xl max-h-[90vh] glass-card rounded-3xl overflow-hidden flex flex-col transform scale-95 transition-transform duration-300 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,1)]" id="conflictModalContent">
            <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-meae-blue/20 to-meae-red/20 opacity-50"></div>
                <h3 id="modalTitle" class="text-2xl font-display font-bold text-white relative z-10 drop-shadow-md">Titre du conflit</h3>
                <button onclick="closeConflictModal()" class="relative z-10 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="p-4 bg-[#0a0a1a] border-b border-white/5 shadow-inner">
               <audio id="modalAudio" controls class="w-full h-10 rounded-full" controlsList="nodownload">
                   <source src="" type="audio/mp4">
                   Votre navigateur ne supporte pas l'élément audio.
               </audio>
            </div>
            <div id="modalBody" class="p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-[#00b0f0] prose-h1:text-[#00b0f0] prose-a:text-[#00b0f0] hover:prose-a:text-white prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-white/20 prose-th:p-3 prose-th:bg-white/10 prose-td:border prose-td:border-white/10 prose-td:p-3 bg-[#0a0a1a]/90">
                <!-- Dynamic Content -->
            </div>
        </div>
    </div>
    
    <script>
        function openConflictModal(id) {
            const modal = document.getElementById('conflictModal');
            const modalContent = document.getElementById('conflictModalContent');
            const title = document.getElementById('modalTitle');
            const audio = document.getElementById('modalAudio');
            const body = document.getElementById('modalBody');
            
            const data = conflictData[id];
            if (!data) return;
            
            title.innerHTML = data.title;
            audio.innerHTML = '<source src="' + data.audio + '" type="audio/mp4">';
            audio.load();
            
            body.innerHTML = marked.parse(data.content);
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
            
            document.body.style.overflow = 'hidden';
        }

        function closeConflictModal() {
            const modal = document.getElementById('conflictModal');
            const modalContent = document.getElementById('conflictModalContent');
            const audio = document.getElementById('modalAudio');
            
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            
            audio.pause();
            audio.currentTime = 0;
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        }
    </script>
</body>`;

const pages = [
    {
        file: 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Cambodge\\Cambodge.html',
        events: [
            { match: '1946–1954', id: '1946-1954' },
            { match: '1967–1975', id: '1967-1975' },
            { match: 'Opération Menu des États-Unis', id: '1970-1973' }, // This wasn't standalone in HTML, let's just map 1970-1973 if we find something about it, or the 1975-1979 one.
            { match: '1975–1979', id: '1975-1979' },
            { match: '1978–1989', id: '1978–1989' },
            { match: '1989–1998', id: '1989–1998' }
        ]
    },
    {
        file: 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Bhutan\\Bhoutan.html',
        events: [
            { match: '1949', id: '1949' },
            { match: '1990–1996', id: '1990-1996' },
            { match: '2003', id: '2003' },
            { match: '2017', id: '2017' }
        ]
    },
    {
        file: 'C:\\Users\\Nico\\Documents\\MEAE concours\\indopacifique-web\\pages\\Fiches pays\\Indonesie\\Indonesie.html',
        events: [
            { match: '1945–1949', id: '1945-1949' },
            { match: '1948', id: '1948' },
            { match: '1950–1962', id: '1953-1962' },
            { match: '1958–1961', id: '1958-1961' },
            { match: '1963–1966', id: '1963-1966' },
            { match: '1965–1966', id: '1965-1966' },
            { match: '1975–1999', id: '1975-1999' },
            { match: '1976–2005', id: '1976-2005' },
            { match: '1960s–Présent', id: '1960-Present' },
            { match: '1960s-Présent', id: '1960-Present' } // alternate
        ]
    }
];

pages.forEach(page => {
    let html = fs.readFileSync(page.file, 'utf8');

    // Add marked.js if not present
    if (!html.includes('marked.min.js')) {
        html = html.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n</head>');
    }

    // Replace click events
    let lines = html.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('class="relative pl-8 pb-4 cursor-pointer group"')) {
            // Find which event this is by looking ahead up to 5 lines
            let foundEvent = null;
            for (let j = 0; j < 5; j++) {
                if (i+j < lines.length) {
                    for (let ev of page.events) {
                        if (lines[i+j].includes(ev.match)) {
                            foundEvent = ev;
                            break;
                        }
                    }
                    if (foundEvent) break;
                }
            }
            if (foundEvent && !lines[i].includes('onclick=')) {
                lines[i] = lines[i].replace('class="relative pl-8 pb-4 cursor-pointer group"', `class="relative pl-8 pb-4 cursor-pointer group" onclick="openConflictModal('${foundEvent.id}')"`);
            }
        }
    }
    
    html = lines.join('\n');

    // Make sure we didn't inject modal twice
    if (!html.includes('id="conflictModal"')) {
        html = html.replace('</body>', modalHtml);
    }
    
    fs.writeFileSync(page.file, html);
    console.log('Processed', page.file);
});
