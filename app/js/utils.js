'use strict';

// Utilidades puras compartidas. Este archivo es clásico (no ES module) para
// conservar la compatibilidad cuando la versión web se abre mediante file://.
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

function normalizePersonName(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
        .replace(/[^a-z0-9ñ]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}

function safeInlineId(value) {
    return encodeURIComponent(String(value ?? ''));
}

function ymKey(year, month) {
    return `${year}-${String(month).padStart(2, '0')}`;
}

function getPreviousMonthKey(date = new Date()) {
    const previous = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return ymKey(previous.getFullYear(), previous.getMonth() + 1);
}

function compareAppVersions(left, right) {
    const a = String(left || '0').split('.').map(value => Number(value) || 0);
    const b = String(right || '0').split('.').map(value => Number(value) || 0);
    for (let index = 0; index < Math.max(a.length, b.length, 3); index++) {
        if ((a[index] || 0) > (b[index] || 0)) return 1;
        if ((a[index] || 0) < (b[index] || 0)) return -1;
    }
    return 0;
}

function parseDate(value) {
    if (!value) return '';
    if (typeof value === 'number') {
        const date = new Date(Math.round((value - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    }
    return String(value).trim();
}
