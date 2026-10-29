/*
 * Gezinme: kategori filtresi (tüm sayfayı süzer), soldaki proje paneli
 * ve her projenin sonundaki önceki/sonraki bağlantıları.
 * main.js'in window.SITE ile paylaştığı yardımcıları kullanır.
 */
(function () {
  'use strict';

  var S = window.SITE;
  if (!S) return;
  var PROJECTS = S.PROJECTS, CATS = S.CATS, REDUCE = S.REDUCE, $ = S.$, $$ = S.$$, esc = S.esc, icon = S.icon;
  var BAR = 60;                         // yapışkan çubuğun yüksekliği (--bar-h)
  var state = { filter: 'all' };

  function inFilter(cat) { return state.filter === 'all' || cat === state.filter; }
  function scrollToEl(el) {
    var top = el.getBoundingClientRect().top + window.scrollY - BAR + 1;
    window.scrollTo({ top: top, behavior: REDUCE ? 'auto' : 'smooth' });
  }
  function docRect(el) { var r = el.getBoundingClientRect(); return { left: r.left + window.scrollX, top: r.top + window.scrollY }; }

  /* ------------------------------------------------------------ ızgara: FLIP ile süzülme */
  function filterGrid(done) {
    var cards = $$('#grid .card');
    var show = function (c) { return inFilter(c.getAttribute('data-cat')); };
    if (REDUCE) { cards.forEach(function (c) { c.classList.toggle('is-hidden', !show(c)); }); return done(); }

    var first = new Map();
    cards.forEach(function (c) { if (!c.classList.contains('is-hidden')) first.set(c, docRect(c)); });
    var leaving = cards.filter(function (c) { return !show(c) && !c.classList.contains('is-hidden'); });
    leaving.forEach(function (c) { c.classList.add('is-leaving'); });

    setTimeout(function () {
      leaving.forEach(function (c) { c.classList.add('is-hidden'); c.classList.remove('is-leaving'); });
      cards.forEach(function (c) { if (show(c)) c.classList.remove('is-hidden'); });
      done();                           // diğer bölümler de bu karede değişir
      cards.forEach(function (c) {
        if (c.classList.contains('is-hidden')) return;
        var last = docRect(c), f = first.get(c);
        c.style.transition = 'none';
        if (f) c.style.transform = 'translate(' + (f.left - last.left) + 'px,' + (f.top - last.top) + 'px)';
        else { c.style.opacity = '0'; c.style.transform = 'translateY(18px) scale(.96)'; }
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          cards.forEach(function (c, i) {
            c.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1) ' + (first.has(c) ? 0 : i % 3 * 50) + 'ms, opacity .45s ease';
            c.style.transform = ''; c.style.opacity = '';
          });
        });
      });
    }, leaving.length ? 230 : 0);
  }

  /* ------------------------------------------------------------ sayfa geneli süzme */
  function applySections(noAnim) {
    var details = $('#projeler');
    $$('.project').forEach(function (s) { s.classList.toggle('is-filtered', !inFilter(s.getAttribute('data-cat'))); });
    $$('#compare-table tbody tr').forEach(function (r) { r.hidden = !inFilter(r.getAttribute('data-cat')); });
    $$('#drawer-list a[data-cat]').forEach(function (a) { a.classList.toggle('is-out', !inFilter(a.getAttribute('data-cat'))); });

    var n = PROJECTS.filter(function (p) { return inFilter(p.category); }).length;
    var label = state.filter === 'all' ? '' : CATS[state.filter].label;
    $('#filter-status').innerHTML = state.filter === 'all'
      ? 'Tüm kategoriler · <b>' + n + ' proje</b>'
      : '<b>' + esc(label) + '</b> kategorisi · ' + n + ' proje gösteriliyor <button class="link-btn" type="button" data-filter-reset>Tümünü göster</button>';
    $('#grid-empty').hidden = n > 0;

    if (!REDUCE && !noAnim) {        // detay bölümleri yumuşakça yeniden belirsin
      details.classList.remove('is-refresh');
      void details.offsetWidth;
      details.classList.add('is-refresh');
    }
    updateProjectNav();
    window.dispatchEvent(new Event('scroll'));   // ilerleme çubuğu ve zaman çizelgeleri yeniden hesaplansın
  }

  function setFilter(filter, opts) {
    opts = opts || {};
    if (!CATS[filter]) filter = 'all';
    var changed = filter !== state.filter;
    state.filter = filter;
    $$('#chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === filter)); });
    try {
      var url = new URL(window.location.href);
      if (filter === 'all') url.searchParams.delete('kategori'); else url.searchParams.set('kategori', filter);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (err) { /* file:// gibi ortamlarda URL güncellenemeyebilir */ }

    if (!changed && !opts.force) { if (opts.scroll) scrollToEl($('#genel-bakis')); return; }
    filterGrid(function () {
      applySections();
      if (opts.scroll) scrollToEl($('#genel-bakis'));
    });
  }

  /* hedef proje filtre dışındaysa önce filtreyi kaldır, sonra kaydır */
  function goToProject(id) {
    var target = document.getElementById(id);
    if (!target) return;
    if (target.classList.contains('is-filtered')) {
      state.filter = 'all';
      $$('#grid .card').forEach(function (c) { c.classList.remove('is-hidden'); });
      $$('#chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === 'all')); });
      try { history.replaceState(null, '', window.location.pathname); } catch (err) { /* yok say */ }
      applySections(true);   // animasyonsuz: hedefin konumu hemen doğru ölçülsün
    }
    scrollToEl(target);
    try { history.replaceState(null, '', window.location.pathname + window.location.search + '#' + id); } catch (err) { /* yok say */ }
  }

  /* ------------------------------------------------------------ proje sonu önceki / sonraki */
  function updateProjectNav() {
    var visible = $$('.project').filter(function (s) { return !s.classList.contains('is-filtered'); });
    visible.forEach(function (s, i) {
      [['prev', visible[i - 1]], ['next', visible[i + 1]]].forEach(function (pair) {
        var link = $('.pnav__link[data-dir="' + pair[0] + '"]', s), other = pair[1];
        if (!other) { link.hidden = true; return; }
        var p = PROJECTS.filter(function (x) { return S.sectionId(x) === other.id; })[0];
        link.hidden = false;
        link.href = '#' + other.id;
        link.innerHTML = (pair[0] === 'prev' ? icon('i-arrow', 'flip') : '') +
          '<span><small>' + (pair[0] === 'prev' ? 'Önceki proje' : 'Sonraki proje') + '</small>' + p.id + ' · ' + esc(p.name) + '</span>' +
          (pair[0] === 'next' ? icon('i-arrow') : '');
      });
    });
  }

  /* ------------------------------------------------------------ sol proje paneli */
  var drawer = { el: null, btn: null, returnFocus: null, timer: 0 };

  function renderDrawer() {
    $('#drawer-list').innerHTML = PROJECTS.map(function (p, i) {
      return '<li style="--i:' + i + '"><a href="#' + S.sectionId(p) + '" data-cat="' + p.category + '">' +
        '<span class="drawer__num">' + p.id + '</span><span class="drawer__name">' + esc(p.name) +
        '<small>' + icon(CATS[p.category].icon) + esc(CATS[p.category].label) + '</small></span></a></li>';
    }).join('');
  }

  function openDrawer() {
    clearTimeout(drawer.timer);
    drawer.returnFocus = document.activeElement;
    drawer.el.hidden = false;
    void drawer.el.offsetWidth;
    drawer.el.classList.add('is-open');
    drawer.btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var current = $('#drawer-list a[aria-current="true"]') || $('#drawer-list a');
    current.focus({ preventScroll: true });
  }

  function closeDrawer(restoreFocus) {
    if (drawer.el.hidden) return;
    drawer.el.classList.remove('is-open');
    drawer.btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    drawer.timer = setTimeout(function () { drawer.el.hidden = true; }, REDUCE ? 0 : 380);
    if (restoreFocus !== false && drawer.returnFocus) drawer.returnFocus.focus({ preventScroll: true });
  }

  /* paneldeki bağlantılarda bulunulan projeyi işaretle */
  function initDrawerCurrent() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('#drawer-list a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.project').forEach(function (s) { io.observe(s); });
  }

  function initDrawer() {
    drawer.el = $('#drawer');
    drawer.btn = $('#menu-btn');
    renderDrawer();
    initDrawerCurrent();
    drawer.btn.addEventListener('click', function () {
      if (drawer.el.hidden) openDrawer(); else closeDrawer();
    });
    drawer.el.addEventListener('click', function (e) {
      if (e.target.closest('[data-drawer-close]')) { closeDrawer(); return; }
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      closeDrawer(false);
      var id = link.getAttribute('href').slice(1);
      if (id.indexOf('proje-') === 0) goToProject(id); else scrollToEl(document.getElementById(id));
    });
    document.addEventListener('keydown', function (e) {
      if (drawer.el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); }
      else if (e.key === 'Tab') {        // odak panel içinde kalsın
        var f = $$('a, button', $('.drawer__panel'));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  /* ------------------------------------------------------------ başlat */
  function init() {
    initDrawer();
    $('#chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) setFilter(chip.getAttribute('data-filter'), { scroll: true });
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-filter-reset]')) { setFilter('all', { scroll: true }); return; }
      // sayfa içi proje bağlantıları (kartlar, tablo, önceki/sonraki, ilgili proje)
      var link = e.target.closest('a[href^="#proje-"]');
      if (!link || link.closest('#drawer')) return;
      e.preventDefault();
      goToProject(link.getAttribute('href').slice(1));
    });

    // ?kategori=arm gibi paylaşılan bağlantılar filtreyle açılır
    var initial = 'all';
    try { initial = new URL(window.location.href).searchParams.get('kategori') || 'all'; } catch (err) { /* yok say */ }
    if (CATS[initial]) {
      state.filter = initial;
      $$('#grid .card').forEach(function (c) { c.classList.toggle('is-hidden', !inFilter(c.getAttribute('data-cat'))); });
      $$('#chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === initial)); });
    }
    applySections(true);
    if (window.location.hash.indexOf('#proje-') === 0) {
      // fontlar ve görseller yerleşince hedefe git
      var jump = function () { goToProject(window.location.hash.slice(1)); };
      if (document.readyState === 'complete') setTimeout(jump, 60); else window.addEventListener('load', function () { setTimeout(jump, 60); });
    }
  }

  init();
})();
