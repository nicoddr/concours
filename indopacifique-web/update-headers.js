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
    // "Indopacifique | Dynamiques & Stratégies" -> "Accueil"
    if (title === 'Indopacifique | Dynamiques & Stratégies') return 'Accueil';
    // "Indopacifique | Module" -> "Module"
    if (title === 'Indopacifique | Module') return 'Module';
    // "Glossaire des Enjeux Indopacifiques" -> "Glossaire"
    if (title.includes('Glossaire')) return 'Glossaire';
    // "Fiches Pays - Asie | Portail Indopacifique" -> "Fiches Pays"
    if (title.includes('Fiches Pays')) return 'Fiches Pays';
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
    const indexPath = `${rootPrefix}index.html`;
    const paysAsiePath = `${pagesPrefix}pays-asie.html`;
    const glossairePath = `${pagesPrefix}glossaire.html`;
    
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
            <a href="${indexPath}" style="display:flex; align-items:center; gap:15px; text-decoration:none; color:inherit;">
                <img src="${logoPath}" alt="Logo Indopacifique" style="height: 40px; width: auto; object-fit: contain;">
                <span>${pageName}</span>
            </a>
        </div>
        <div class="controls" style="position:relative;">
            <button class="btn-glass" id="menuToggleBtn" onclick="document.getElementById('dropdownNav').classList.toggle('dropdown-visible')" style="cursor:pointer;">
                ☰ Menu
            </button>
            <div id="dropdownNav" class="dropdown-menu">
                <a href="${indexPath}" class="dropdown-item">🏠 Accueil</a>
                <a href="${paysAsiePath}" class="dropdown-item">🌏 Fiches Pays</a>
                <a href="${glossairePath}" class="dropdown-item">📚 Glossaire & Organigrammes</a>
                <div class="dropdown-separator"></div>
                <span class="dropdown-label">Modules</span>
                <a href="${mod1Path}" class="dropdown-item">1. Stratégie Indopacifique</a>
                <a href="${mod2Path}" class="dropdown-item">2. L'Émergence de la Chine</a>
                <a href="${mod3Path}" class="dropdown-item">3. Japon & Corée</a>
                <a href="${mod4Path}" class="dropdown-item">4. ASEAN & Asie du SE</a>
                <a href="${mod5Path}" class="dropdown-item">5. Asie du Sud & Inde</a>
                <a href="${mod6Path}" class="dropdown-item">6. Enjeux Transversaux</a>
            </div>
        </div>`;

    // CSS for the dropdown - needs to be injected into <head> or <style>
    const dropdownCSS = `
/* ===== DROPDOWN MENU ===== */
.dropdown-menu {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 280px;
    background: rgba(10, 10, 40, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 8px;
    z-index: 200;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,176,240,0.1);
    animation: dropdownFadeIn 0.2s ease;
}
.dropdown-menu.dropdown-visible {
    display: block;
}
.dropdown-item {
    display: block;
    padding: 10px 16px;
    color: #e0e0e0 !important;
    text-decoration: none !important;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
}
.dropdown-item:hover {
    background: rgba(0, 176, 240, 0.15);
    color: #ffffff !important;
    transform: translateX(4px);
}
.dropdown-separator {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 6px 12px;
}
.dropdown-label {
    display: block;
    padding: 6px 16px 2px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(0, 176, 240, 0.7);
}
@keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes dropdownSlideDown {
    from { opacity: 0; transform: translateY(-100%); }
    to { opacity: 1; transform: translateY(0); }
}
/* ===== MOBILE DROPDOWN ===== */
@media (max-width: 768px) {
    .dropdown-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-width: unset;
        width: 100%;
        height: 100vh;
        border-radius: 0;
        border: none;
        padding: 20px 16px;
        padding-top: 70px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        animation: dropdownSlideDown 0.25s ease;
        box-shadow: none;
    }
    .dropdown-item {
        padding: 14px 18px;
        font-size: 1rem;
        white-space: normal;
        border-radius: 12px;
    }
    .dropdown-item:active {
        background: rgba(0, 176, 240, 0.25);
        color: #ffffff !important;
    }
    .dropdown-separator {
        margin: 10px 16px;
    }
    .dropdown-label {
        padding: 10px 18px 4px;
        font-size: 0.75rem;
    }
    #menuToggleBtn {
        z-index: 300;
        position: relative;
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
    
    const newHeader = `<header${headerClass}>${newHeaderContent}
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
