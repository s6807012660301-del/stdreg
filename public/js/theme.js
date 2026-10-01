const btn = document.getElementById('themeToggle');
const label = () => btn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️ Day' : '🌙 Dark';
label();
btn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  label();
});
