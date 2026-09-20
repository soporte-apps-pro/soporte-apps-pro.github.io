(function () {
    'use strict';
    const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

    for (const id of ['qPersona', 's21Search']) {
        const input = document.getElementById(id);
        if (!input) continue;
        const box = document.createElement('div');
        box.className = 'name-suggestions';
        box.id = `${id}Suggestions`;
        box.hidden = true;
        const list = document.createElement('div');
        list.id = `${id}Options`;
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-label', 'Nombres sugeridos');
        const status = document.createElement('div');
        status.className = 'name-suggestions-status';
        status.setAttribute('role', 'status');
        box.append(list, status);
        (id === 'qPersona' ? input.parentElement : input).after(box);
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-controls', list.id);
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-label', id === 'qPersona' ? 'Buscar miembro para editar' : 'Buscar persona');
        let active = -1;
        let matches = [];
        const close = () => {
            box.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            active = -1;
        };
        const select = name => {
            input.value = name;
            close();
            input.focus({ preventScroll: true });
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };
        const render = () => {
            const query = normalize(input.value);
            if (!query) return close();
            const names = [...new Set(Array.from(document.getElementById('pList')?.options || [], option => option.value))];
            const found = names.filter(name => query.split(/\s+/).every(part => normalize(name).includes(part)));
            matches = found.slice(0, 5);
            active = -1;
            input.removeAttribute('aria-activedescendant');
            list.replaceChildren(...matches.map((name, index) => {
                const option = document.createElement('div');
                option.id = `${id}Option${index}`;
                option.className = 'name-suggestion';
                option.setAttribute('role', 'option');
                option.setAttribute('aria-selected', 'false');
                option.textContent = name;
                option.addEventListener('pointerdown', event => {
                    // Mantener el campo enfocado para poder seguir escribiendo.
                    if (event.pointerType === 'mouse') event.preventDefault();
                });
                option.addEventListener('click', () => select(name));
                return option;
            }));
            status.textContent = found.length > 5 ? 'Hay más nombres. Sigue escribiendo para afinar la búsqueda.' : found.length ? 'Toca un nombre o sigue escribiendo.' : 'No hay coincidencias. Prueba con otro nombre o apellido.';
            box.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        };
        input.addEventListener('input', render);
        input.addEventListener('focus', render);
        input.addEventListener('keydown', event => {
            if (event.key === 'Escape') { close(); return; }
            if (event.key === 'Tab') { close(); return; }
            if (box.hidden || !matches.length) return;
            if (event.key === 'Enter' && active >= 0) {
                event.preventDefault();
                select(matches[active]);
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                active = (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
                Array.from(list.children).forEach((option, index) => option.setAttribute('aria-selected', String(index === active)));
                input.setAttribute('aria-activedescendant', list.children[active].id);
                list.children[active].scrollIntoView({ block: 'nearest' });
            }
        });
        document.addEventListener('pointerdown', event => {
            if (event.target !== input && !box.contains(event.target)) close();
        });
    }
}());
