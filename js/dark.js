// Toggle dark mode and persist preference in localStorage.
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    const key = 'theme';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyDark(isDark) {
        if (isDark) document.body.classList.add('dark'); else document.body.classList.remove('dark');
        if (toggle) toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    // Update the icon inside the toggle button to match the theme.
    function updateToggleIcon(isDark) {
        if (!toggle) return;
        const icon = toggle.querySelector('i.bi');
        if (!icon) return;
        // Use Bootstrap Icons: moon for light, sun for dark
        if (isDark) {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        } else {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
        }
    }

    // Load saved preference, otherwise default to light theme.
    const saved = localStorage.getItem(key);
    const initial = (saved === 'dark');
    applyDark(!!initial);
    updateToggleIcon(!!initial);

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const next = !document.body.classList.contains('dark');
        applyDark(next);
        updateToggleIcon(next);
        localStorage.setItem(key, next ? 'dark' : 'light');
    });
});