(function () {
    var savedTheme = localStorage.getItem('theme');
    var theme = savedTheme === 'dark' ? 'dark' : 'light';
    var root = document.documentElement;
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(theme + '-mode');
  })();