document.addEventListener('DOMContentLoaded', () => {
    // 1. Checklist Status Management
    // Data structure: { 'module1': 0, 'module2': 1, 'module3': 2 } (0: todo, 1: prog, 2: done)
    const initChecklist = () => {
        let progress = JSON.parse(localStorage.getItem('indopac_progress') || '{}');
        const modules = document.querySelectorAll('.module-card');
        
        modules.forEach(mod => {
            const modId = mod.dataset.id;
            const status = progress[modId] || 0;
            
            const indicator = mod.querySelector('.status-indicator');
            if(indicator) {
                indicator.className = `status-indicator status-${status}`;
                const textElem = indicator.querySelector('.status-text');
                if(status === 0) textElem.textContent = 'À faire';
                if(status === 1) textElem.textContent = 'En cours';
                if(status === 2) textElem.textContent = 'Terminé';
            }
        });
    };

    initChecklist();

    // 3. Quiz Logic for template pages
    const quizOptions = document.querySelectorAll('.quiz-btn');
    quizOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            // Unselect others in the same question
            const siblings = this.parentElement.querySelectorAll('.quiz-btn');
            siblings.forEach(s => {
                s.classList.remove('correct', 'wrong');
                s.disabled = true; // disable after clicking
            });
            
            const isCorrect = this.dataset.correct === "true";
            if(isCorrect) {
                 this.classList.add('correct');
                 // Play small success animation if needed
                 updateModuleProgress(); // Mark as done when quiz completed successfully
            } else {
                 this.classList.add('wrong');
                 // Show correct answer
                 siblings.forEach(s => {
                     if(s.dataset.correct === "true") s.classList.add('correct');
                 });
            }
        });
    });

    // Helper to auto update progress to 1 (in progress) when opening a page, and 2 when finishing quiz
    window.updateProgress = function(modId, status) {
        let progress = JSON.parse(localStorage.getItem('indopac_progress') || '{}');
        if (progress[modId] !== 2) { // Don't downgrade if already done
             progress[modId] = status;
             localStorage.setItem('indopac_progress', JSON.stringify(progress));
        }
    }
});
