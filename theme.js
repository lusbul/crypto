(() => {
  const file = decodeURIComponent(location.pathname.split('/').pop() || '');
  const match = file.match(/^(?:theme|mission|topic)[-_]?(\d+)\.html$/i) || file.match(/^(\d+)\.html$/);
  const query = new URLSearchParams(location.search).get('theme');
  const number = match ? Number(match[1]) : query === null ? 1 : Number(query);
  const groups = window.CRYPTO_COURSE || [];
  const groupIndex = groups.findIndex(group => group.themes.some(theme => theme.number === number));
  if (groupIndex < 0) {
    document.title = 'Тему не знайдено — Криптографія';
    document.getElementById('theme-title').textContent = 'Тему не знайдено';
    document.getElementById('theme-description').textContent = 'Оберіть тему на головній сторінці.';
    document.getElementById('art-number').textContent = '—';
    document.getElementById('theme-label').textContent = 'Подорож у часі';
    return;
  }
  const group = groups[groupIndex];
  const theme = group.themes.find(theme => theme.number === number);
  const padded = String(number).padStart(2, '0');
  document.title = `${theme.title} — Криптографія`;
  document.getElementById('chapter-label').textContent = `Розділ ${groupIndex + 1} · ${group.title}`;
  document.getElementById('theme-label').textContent = `Тема ${padded}`;
  document.getElementById('theme-title').textContent = theme.title;
  document.getElementById('theme-description').textContent = theme.description;
  document.getElementById('art-number').textContent = padded;
  document.getElementById('back').href = `index.html#chapter-${groupIndex + 1}`;
})();
