(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'claude-docs-replica-theme';

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  var tabsRoots = document.querySelectorAll('[data-tabs]');
  tabsRoots.forEach(function (tabs) {
    var buttons = tabs.querySelectorAll('.tab');
    var panels = tabs.querySelectorAll('.tab-panel');
    buttons.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
        });
        btn.classList.add('active');
        if (panels[index]) panels[index].classList.add('active');
      });
    });
  });

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.code-block');
      var code = block ? block.querySelector('pre') : null;
      if (!code) return;
      var text = code.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    });
  });

  var copyPage = document.getElementById('copyPage');
  if (copyPage) {
    copyPage.addEventListener('click', function () {
      var article = document.querySelector('.prose');
      if (article && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(article.innerText);
      }
    });
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var headings = tocLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute('href'));
      })
      .filter(Boolean);

    var setActive = function (link) {
      tocLinks.forEach(function (l) {
        l.classList.toggle('active', l === link);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = tocLinks.find(function (l) {
            return l.getAttribute('href') === '#' + entry.target.id;
          });
          if (link) setActive(link);
        });
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }
})();
