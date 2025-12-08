//navigate site pages
(function () {
  const pages = [
    'index.html',
    'early.html',
    'wars-modern.html',
    'concepts.html',
    'quiz.html',
    'references.html',
    'about.html'
  ];

  function currentFilename() {
    const path = window.location.pathname;
    const name = path.split('/').pop() || 'index.html';
    return name;
  }

  function updateButtons() {
    const backBtn = document.querySelector('.btn--back');
    const forwardBtn = document.querySelector('.btn--forward');
    const current = currentFilename();
    const idx = pages.indexOf(current);

    if (backBtn) backBtn.disabled = idx <= 0;
    if (forwardBtn) forwardBtn.disabled = idx === -1 || idx >= pages.length - 1;
  }

  function goToRelative(offset) {
    const current = currentFilename();
    const idx = pages.indexOf(current);
    if (idx === -1) return; // unknown page
    const targetIdx = idx + offset;
    if (targetIdx < 0 || targetIdx >= pages.length) return; // out of range
    window.location.href = pages[targetIdx];
  }

  document.addEventListener('DOMContentLoaded', function () {
    const backBtn = document.querySelector('.btn--back');
    const forwardBtn = document.querySelector('.btn--forward');
    const reloadBtn = document.querySelector('.btn--reload');

    if (backBtn) backBtn.addEventListener('click', function () { goToRelative(-1); });
    if (forwardBtn) forwardBtn.addEventListener('click', function () { goToRelative(1); });
    if (reloadBtn) reloadBtn.addEventListener('click', function () { window.location.reload(); });

    updateButtons();
  });
})();
