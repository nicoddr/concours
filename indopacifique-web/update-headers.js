/**
 * Script to update all HTML headers:
 * - Replace "Portail Indopacifique" with the page name
 * - Replace navigation buttons with a dropdown menu
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Recursively find all HTML files
function findHtmlFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findHtmlFiles(full));
        } else if (entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

// Extract a readable page name from the <title> tag
function getPageName(html, filePath) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch) return path.basename(filePath, '.html');
    
    let title = titleMatch[1].trim();
    
    // Clean up common patterns
    // "Indopacifique | Dynamiques & Stratégies" -> "Portail Indopacifique"
    if (title === 'Indopacifique | Dynamiques & Stratégies') return 'Leçons';
    // "Indopacifique | Module" -> "Module"
    if (title === 'Indopacifique | Module') return 'Module';
    // "Glossaire des Enjeux Indopacifiques" -> "Glossaire"
    if (title.includes('Glossaire')) return 'Glossaire';
    // "Fiches Pays - Asie | Portail Indopacifique" -> "Fiches Pays"
    if (title.includes('Fiches Pays')) return 'Fiches Pays';
    // "Annales | Portail Indopacifique" -> "Annales"
    if (title.includes('Annales')) return 'Annales';
    // "Afghanistan : Dossier Géopolitique & Économique" -> "Afghanistan"
    const colonMatch = title.match(/^([^:]+)\s*:/);
    if (colonMatch) return colonMatch[1].trim();
    
    return title;
}

// Compute relative path from file to root
function getRelativeToRoot(filePath) {
    const dir = path.dirname(filePath);
    return path.relative(dir, ROOT).replace(/\\/g, '/');
}

// Compute relative path from file to pages directory
function getRelativeToPages(filePath) {
    const dir = path.dirname(filePath);
    const pagesDir = path.join(ROOT, 'pages');
    return path.relative(dir, pagesDir).replace(/\\/g, '/');
}

function processFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Process files that have either the old header OR were already modified (to fix paths)
    const hasOldHeader = html.includes('Portail Indopacifique') || html.includes('Portail Indochine');
    const hasNewDropdown = html.includes('dropdownNav');
    if (!hasOldHeader && !hasNewDropdown) {
        return false;
    }
    
    const pageName = getPageName(html, filePath);
    const relToRoot = getRelativeToRoot(filePath);
    const relToPages = getRelativeToPages(filePath);
    
    // Build path prefixes — handle empty string (same directory) correctly
    const rootPrefix = relToRoot.length > 0 ? `${relToRoot}/` : '';
    const pagesPrefix = relToPages.length > 0 ? `${relToPages}/` : '';
    
    // Determine paths
    const logoPath = `${rootPrefix}images/Logo.png`;
    const homePath = `${rootPrefix}../index.html`; // Point to root portal
    const leconPath = `${rootPrefix}lecon.html`; // Point to lessons dashboard
    const paysAsiePath = `${pagesPrefix}pays-asie.html`;
    const glossairePath = `${pagesPrefix}glossaire.html`;
    const annalesPath = `${pagesPrefix}Annales/Annales.html`;
    
    // Module pages relative to this file
    const mod1Path = `${pagesPrefix}mod1_strategie.html`;
    const mod2Path = `${pagesPrefix}mod2_chine.html`;
    const mod3Path = `${pagesPrefix}mod3_japon_coree.html`;
    const mod4Path = `${pagesPrefix}mod4_asean.html`;
    const mod5Path = `${pagesPrefix}mod5_inde.html`;
    const mod6Path = `${pagesPrefix}mod6_transversaux.html`;

    // Build new header HTML
    // This header works for BOTH the main style.css pages AND the Tailwind country pages
    const isTailwindPage = html.includes('cdn.tailwindcss.com') || html.includes('site-header');
    
    const newHeaderContent = `
        <div class="${isTailwindPage ? 'logo-container' : 'logo-container'}" style="display:flex; align-items:center; gap:15px;">
            <a href="${homePath}" style="display:flex; align-items:center; gap:15px; text-decoration:none; color:inherit;">
                <img src="${logoPath}" alt="Logo Indopacifique" style="height: 40px; width: auto; object-fit: contain;">
                <span>${pageName}</span>
            </a>
        </div>
        <div class="controls" style="position:relative;">
            <button class="btn-glass" id="menuToggleBtn" onclick="document.getElementById('dropdownNav').classList.toggle('dropdown-visible')" style="cursor:pointer;">
                ☰ Menu
            </button>
            <div id="dropdownNav" class="dropdown-menu">
                <div class="mobile-menu-header">
                    <span>MENU NAVIGATION</span>
                    <button class="close-menu" onclick="event.stopPropagation(); document.getElementById('dropdownNav').classList.remove('dropdown-visible')">✕</button>
                </div>
                <div class="dropdown-items-wrapper">
                    <a href="${homePath}" class="dropdown-item">🏠 Accueil</a>
                    <a href="${leconPath}" class="dropdown-item">📚 Leçons</a>
                    <a href="${paysAsiePath}" class="dropdown-item">🌏 Fiches Pays</a>
                    <a href="${glossairePath}" class="dropdown-item">📖 Glossaire & Organigrammes</a>
                    <a href="${annalesPath}" class="dropdown-item">📑 Annales</a>
                </div>
                <div class="mobile-menu-footer">
                    <p>© 2026 Nicolas Didier</p>
                    <div class="mobile-socials">
                        <a href="https://www.linkedin.com/in/nicolas-didier-france/" target="_blank">LinkedIn</a>
                        <a href="mailto:nicolas.didier2001@gmail.com">Contact</a>
                    </div>
                </div>
            </div>
        </div>`;

    // CSS for the dropdown - needs to be injected into <head> or <style>
    const dropdownCSS = `
/* ===== DROPDOWN MENU ===== */
.dropdown-menu {
    display: none;
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    min-width: 280px;
    background: rgba(10, 10, 40, 0.98);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 12px;
    z-index: 500;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,176,240,0.15);
    animation: dropdownFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-menu.dropdown-visible {
    display: flex;
    flex-direction: column;
}
.mobile-menu-header, .mobile-menu-footer { display: none; }

.dropdown-item {
    display: block;
    padding: 12px 18px;
    color: #e0e0e0 !important;
    text-decoration: none !important;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.25s ease;
    white-space: nowrap;
    margin-bottom: 4px;
}
.dropdown-item:last-child { margin-bottom: 0; }
.dropdown-item:hover {
    background: rgba(0, 176, 240, 0.2);
    color: #ffffff !important;
    transform: translateX(6px);
    box-shadow: inset 0 0 10px rgba(0, 176, 240, 0.1);
}

@keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== MOBILE DROPDOWN OVERLAY ===== */
@media (max-width: 768px) {
    .dropdown-menu {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        border: none;
        padding: 0;
        margin: 0;
        background: radial-gradient(circle at top right, rgba(20, 20, 60, 0.99), rgba(5, 5, 20, 0.99));
        justify-content: space-between;
        animation: mobileMenuFade 0.4s ease-out;
    }
    
    @keyframes mobileMenuFade {
        from { opacity: 0; transform: scale(1.05); }
        to { opacity: 1; transform: scale(1); }
    }

    .mobile-menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 30px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .mobile-menu-header span {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 3px;
        color: var(--meae-cyan);
        opacity: 0.8;
    }
    .close-menu {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        transition: 0.3s;
    }
    .close-menu:active { transform: scale(0.9); background: rgba(225, 0, 15, 0.2); }

    .dropdown-items-wrapper {
        display: flex;
        flex-direction: column;
        padding: 30px;
        gap: 15px;
        flex-grow: 1;
        justify-content: center;
    }
    
    .dropdown-item {
        font-size: 1.3rem;
        padding: 16px 24px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.05);
        text-align: center;
        white-space: normal;
        margin: 0;
        animation: itemSlideUp 0.5s ease backwards;
    }
    /* Stagger delay for items */
    .dropdown-item:nth-child(1) { animation-delay: 0.1s; }
    .dropdown-item:nth-child(2) { animation-delay: 0.15s; }
    .dropdown-item:nth-child(3) { animation-delay: 0.2s; }
    .dropdown-item:nth-child(4) { animation-delay: 0.25s; }
    .dropdown-item:nth-child(5) { animation-delay: 0.3s; }

    @keyframes itemSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .mobile-menu-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 30px;
        gap: 15px;
        border-top: 1px solid rgba(255,255,255,0.08);
        background: rgba(0,0,0,0.2);
    }
    .mobile-menu-footer p {
        margin: 0; font-size: 0.8rem; opacity: 0.5;
    }
    .mobile-socials {
        display: flex; gap: 20px;
    }
    .mobile-socials a {
        font-size: 0.9rem;
        color: var(--meae-cyan);
        font-weight: 600;
        padding: 8px 16px;
        background: rgba(0, 210, 255, 0.1);
        border-radius: 20px;
    }
}
`;

    // Script to close dropdown on outside click
    const dropdownScript = `
<script>
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('dropdownNav');
    const btn = document.getElementById('menuToggleBtn');
    if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('dropdown-visible');
    }
});
</script>`;

    // Now replace the header in the HTML
    // Pattern 1: Pages using style.css (header tag directly)
    // Pattern 2: Country pages using .site-header class
    
    // Replace the entire <header>...</header> block
    const headerRegex = /<header[^>]*>[\s\S]*?<\/header>/i;
    const headerMatch = html.match(headerRegex);
    
    if (!headerMatch) {
        console.log(`  ⚠ No header found in: ${filePath}`);
        return false;
    }
    
    // Detect header class
    const headerTag = headerMatch[0].match(/<header([^>]*)>/)?.[1] || '';
    const headerClass = headerTag.includes('site-header') ? ' class="site-header"' : '';
    
    const newHeader = `<header class="site-header">${newHeaderContent}
    </header>`;
    
    html = html.replace(headerRegex, newHeader);
    
    // Inject or Update dropdown CSS
    const cssStartTag = '/* START_DROPDOWN_CSS */';
    const cssEndTag = '/* END_DROPDOWN_CSS */';
    const fullCssBlock = `\n${cssStartTag}${dropdownCSS}${cssEndTag}\n`;

    if (html.includes(cssStartTag) && html.includes(cssEndTag)) {
        // Update existing tagged block
        const regex = new RegExp(cssStartTag.replace(/\*/g, '\\*') + '[\\s\\S]*?' + cssEndTag.replace(/\*/g, '\\*'), 'g');
        html = html.replace(regex, fullCssBlock.trim());
    } else if (html.includes('.dropdown-menu')) {
        // Replace old untagged block (from previous script version)
        // We look for the block starting with /* ===== DROPDOWN MENU ===== */ and ending with /* Close dropdown when clicking outside */
        // or just the block containing .dropdown-menu inside <style>
        const oldCssRegex = /\/\* ===== DROPDOWN MENU ===== \*\/[\s\S]*?\/\* Close dropdown when clicking outside \*\//g;
        if (oldCssRegex.test(html)) {
            html = html.replace(oldCssRegex, fullCssBlock.trim());
        } else {
            // Fallback: if we can't find the specific comments, we don't want to double inject
            // but in our case we know they are there or we add them
            if (html.includes('</style>')) {
                const lastStyleClose = html.lastIndexOf('</style>');
                html = html.substring(0, lastStyleClose) + fullCssBlock + html.substring(lastStyleClose);
            }
        }
    } else {
        // New injection
        if (html.includes('</style>')) {
            const lastStyleClose = html.lastIndexOf('</style>');
            html = html.substring(0, lastStyleClose) + fullCssBlock + html.substring(lastStyleClose);
        } else if (html.includes('</head>')) {
            html = html.replace('</head>', `<style>${fullCssBlock}</style>\n</head>`);
        }
    }
    
    // Build new footer HTML
    const newFooterContent = `
    <!-- START_FOOTER -->
    <footer class="glass-panel" style="margin: 6rem auto 2rem; max-width: 1200px; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">© 2026 Nicolas Didier</p>
        <div style="display: flex; gap: 24px; align-items: center;">
            <a href="https://www.linkedin.com/in/nicolas-didier-france/" target="_blank" style="display: flex; align-items: center; gap: 8px; color: var(--meae-cyan); font-size: 0.85rem; text-decoration: none; transition: 0.3s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
            </a>
            <a href="mailto:nicolas.didier2001@gmail.com" style="display: flex; align-items: center; gap: 8px; color: var(--meae-cyan); font-size: 0.85rem; text-decoration: none; transition: 0.3s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Me contacter
            </a>
        </div>
    </footer>
    <!-- END_FOOTER -->`;

    // Inject or Update Footer
    if (html.includes('<!-- START_FOOTER -->')) {
        const footerRegex = /<!-- START_FOOTER -->[\s\S]*?<!-- END_FOOTER -->/g;
        html = html.replace(footerRegex, newFooterContent.trim());
    } else {
        // Try to inject before first <script> or before </body>
        if (html.includes('</body>')) {
            html = html.replace('</body>', `${newFooterContent}\n</body>`);
        }
    }
    
    // Inject or Update close-on-outside-click script
    const jsStartTag = '// START_DROPDOWN_JS';
    const jsEndTag = '// END_DROPDOWN_JS';
    const fullJsBlock = `\n<script>\n${jsStartTag}\n${dropdownScript.replace('<script>', '').replace('</script>', '').trim()}\n${jsEndTag}\n</script>\n`;

    if (html.includes(jsStartTag) && html.includes(jsEndTag)) {
        const regex = new RegExp(jsStartTag + '[\\s\\S]*?' + jsEndTag, 'g');
        html = html.replace(regex, jsStartTag + '\n' + dropdownScript.replace('<script>', '').replace('</script>', '').trim() + '\n' + jsEndTag);
    } else if (html.includes('dropdownNav') && html.includes('document.addEventListener')) {
        // Replace old untagged script
        const oldJsRegex = /<script>\s*document\.addEventListener\('click'[\s\S]*?<\/script>/g;
        html = html.replace(oldJsRegex, fullJsBlock.trim());
    } else {
        if (html.includes('</body>')) {
            html = html.replace('</body>', `${fullJsBlock}\n</body>`);
        }
    }
    
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`  ✅ Updated: ${path.relative(ROOT, filePath)} → "${pageName}"`);
    return true;
}

// Main
const files = findHtmlFiles(ROOT);
console.log(`Found ${files.length} HTML files.\n`);

let updated = 0;
for (const f of files) {
    if (processFile(f)) updated++;
}

console.log(`\n✅ Done! Updated ${updated} files.`);
