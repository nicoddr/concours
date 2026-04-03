document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('#filter-container .btn-glass');
    const cards = Array.from(document.querySelectorAll('.country-card'));
    const grid = document.getElementById('pays-grid');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    let currentFilter = 'all';

    // Helpers function to parse values
    function parsePopulation(text) {
        if (!text) return 0;
        let t = text.trim().toLowerCase().replace('👥 population :', '').replace('~', '').trim();
        t = t.replace(',', '.');
        let multiplier = 1;
        if (t.includes('milliard')) { multiplier = 1000000000; t = t.replace(/milliards?/g, ''); }
        else if (t.includes('million')) { multiplier = 1000000; t = t.replace(/millions?/g, ''); }
        t = t.replace(/\s+/g, '');
        return parseFloat(t) * multiplier;
    }

    function parseArea(text) {
        if (!text) return 0;
        let t = text.trim().toLowerCase().replace('📏 superficie :', '').replace('km²', '').replace(/\s+/g, '').trim();
        return parseInt(t, 10);
    }

    // Attach parsed data to cards for easier filtering/sorting later
    cards.forEach(card => {
        const title = card.querySelector('.country-header').textContent.trim();
        const pTags = card.querySelectorAll('.country-info p');
        
        let areaText = "";
        let popText = "";

        pTags.forEach(p => {
            if (p.textContent.includes('Superficie')) areaText = p.textContent;
            if (p.textContent.includes('Population')) popText = p.textContent;
        });

        card.dataset.name = title;
        card.dataset.area = parseArea(areaText);
        card.dataset.pop = parsePopulation(popText);
    });

    function renderCards() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const sortMode = sortSelect.value;
        
        // 1. Filter
        let visibleCards = cards.filter(card => {
            const matchesCategory = (currentFilter === 'all') || (card.getAttribute('data-region') === currentFilter);
            const matchesSearch = card.dataset.name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        // 2. Sort
        if (sortMode !== 'none') {
            visibleCards.sort((a, b) => {
                if (sortMode === 'name-asc') return a.dataset.name.localeCompare(b.dataset.name);
                if (sortMode === 'name-desc') return b.dataset.name.localeCompare(a.dataset.name);
                if (sortMode === 'pop-asc') return parseFloat(a.dataset.pop) - parseFloat(b.dataset.pop);
                if (sortMode === 'pop-desc') return parseFloat(b.dataset.pop) - parseFloat(a.dataset.pop);
                if (sortMode === 'area-asc') return parseFloat(a.dataset.area) - parseFloat(b.dataset.area);
                if (sortMode === 'area-desc') return parseFloat(b.dataset.area) - parseFloat(a.dataset.area);
                return 0;
            });
        }

        // 3. Update DOM
        grid.innerHTML = '';
        visibleCards.forEach(card => {
            // Ensure display is block/flex as necessary
            card.style.display = 'flex';
            grid.appendChild(card);
        });
    }

    // Event Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-tab'));
            btn.classList.add('active-tab');
            currentFilter = btn.getAttribute('data-filter');
            renderCards();
        });
    });

    searchInput.addEventListener('input', renderCards);
    sortSelect.addEventListener('change', renderCards);
});
