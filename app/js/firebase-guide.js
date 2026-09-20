(function () {
    'use strict';
    let pages = [];
    let current = 0;
    let returnFocus;
    const byId = id => document.getElementById(id);

    function buildPages() {
        if (pages.length) return;
        const source = byId('firebaseSetupGuide').querySelector('summary + div');
        let page = document.createElement('section');
        pages.push(page);
        for (const node of source.children) {
            if (node.matches('p') && /^\d+\. /.test(node.textContent.trim())) {
                page = document.createElement('section');
                pages.push(page);
            } else if (node.matches('details') && node.querySelector('summary')?.textContent.includes('Ya usaba Firebase')) {
                page = document.createElement('section');
                pages.push(page);
            }
            page.appendChild(node.cloneNode(true));
        }
        const rules = pages[4].querySelector('textarea');
        if (rules) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn primary';
            button.textContent = 'Copiar las reglas';
            button.addEventListener('click', async () => {
                rules.focus();
                rules.select();
                try {
                    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(rules.value);
                    else if (!document.execCommand('copy')) throw new Error('copy');
                    button.textContent = '✓ Reglas copiadas';
                } catch (_) {
                    button.textContent = 'Seleccionadas: mantén pulsado y elige Copiar, o usa Ctrl+C';
                }
            });
            rules.before(button);
        }
    }

    function render() {
        const content = byId('firebaseWizardContent');
        content.replaceChildren(pages[current]);
        content.scrollTop = 0;
        byId('firebaseWizardProgress').textContent = current === 0 ? 'Antes de empezar' : current === 9 ? 'Ayuda y cuidados' : `Paso ${current} de 8`;
        byId('firebaseWizardBack').disabled = current === 0;
        byId('firebaseWizardNext').textContent = current === 0 ? 'Empezar' : current === 8 ? 'Ver cuidados finales' : current === 9 ? 'Cerrar asistente' : 'Siguiente';
        byId('firebaseWizardProgress').focus();
    }

    window.openFirebaseWizard = function (step) {
        buildPages();
        returnFocus = document.activeElement;
        if (Number.isInteger(step)) current = Math.max(0, Math.min(step, pages.length - 1));
        byId('firebaseWizard').style.display = 'flex';
        render();
    };
    window.closeFirebaseWizard = function () {
        byId('firebaseWizard').style.display = 'none';
        returnFocus?.focus();
    };
    window.moveFirebaseWizard = function (delta) {
        if (current === pages.length - 1 && delta > 0) return window.closeFirebaseWizard();
        current = Math.max(0, Math.min(current + delta, pages.length - 1));
        render();
    };
    byId('firebaseWizard').addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); window.closeFirebaseWizard(); }
        if (event.key !== 'Tab') return;
        const controls = [...byId('firebaseWizard').querySelectorAll('button:not(:disabled), a[href], textarea, summary, [tabindex="0"]')].filter(el => el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === byId('firebaseWizardProgress'))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
}());
