'use strict';

// Funciones visuales independientes. Se mantiene como script clásico para
// conservar la compatibilidad cuando la versión web se abre mediante file://.
window.closeSettings = function() {
    const modal = document.getElementById('modalSettings');
    if (modal) modal.style.display = 'none';
};

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('cong_pro_theme', isDark ? 'dark' : 'light');

    const button = document.getElementById('btnTheme');
    if (button) button.innerText = isDark ? '☀️' : '🌙';
};

if (localStorage.getItem('cong_pro_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    setTimeout(() => {
        const button = document.getElementById('btnTheme');
        if (button) button.innerText = '☀️';
    }, 500);
}

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const text = document.createElement('span');
    text.textContent = String(message ?? '');
    toast.replaceChildren(text);
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
};
