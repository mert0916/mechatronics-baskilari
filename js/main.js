/*
 * Yapılabilir Robotlar — sayfa mantığı
 * Tüm içerik data/projects.js içindeki PROJECTS dizisinden üretilir.
 * Filtre, proje paneli ve proje gezinmesi js/nav.js içinde.
 * Harici kütüphane yok: IntersectionObserver + requestAnimationFrame + CSS geçişleri.
 */
(function () {
  'use strict';

  var PROJECTS = window.PROJECTS || [];
  var CATS = window.CATEGORIES || {};
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP_ICONS = { print: 'i-print', mech: 'i-mech', elec: 'i-elec', soft: 'i-soft', test: 'i-test' };
  var STEP_LABELS = { print: 'Baskı', mech: 'Mekanik montaj', elec: 'Elektronik', soft: 'Yazılım', test: 'Test' };

  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------ yardımcılar */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function sectionId(p) { return 'proje-' + p.id; }
  function money(n) { return '$' + n.toFixed(2); }
  function extLink(url, label, cls) {
    return '<a class="' + (cls || 'link') + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  /* <picture>: WebP + PNG/JPG yedek, sabit en-boy oranı, lazy-load */
  function picture(img, opts) {
    opts = opts || {};
    var base = 'images/' + img.file;
    return '<picture><source type="image/webp" srcset="' + base + '.webp">' +
      '<img src="' + base + '.' + img.ext + '" width="' + img.w + '" height="' + img.h + '" alt="' + esc(img.alt) + '"' +
      ' style="aspect-ratio:' + img.w + ' / ' + img.h + '"' +
      (opts.eager ? '' : ' loading="lazy"') + ' decoding="async"' + (opts.main ? ' data-main' : '') + '></picture>';
  }

  /* BOM toplamı (yalnızca fiyatı verilmiş kalemler) */
  function bomTotal(p) {
    if (!p.bom || !p.bom.priced) return null;
    return p.bom.groups.reduce(function (sum, g) {
      return sum + g.items.reduce(function (s, it) { return s + (typeof it[3] === 'number' ? it[3] : 0); }, 0);
    }, 0);
  }
  function cardCost(p) {
    if (p.card.cost) return p.card.cost;
    if (p.card.costFromBom) { var t = bomTotal(p); return t ? '~' + money(t) + ' (BOM)' : null; }
    return null;
  }

  function difficulty(p, compact) {
    var bars = '';
    for (var i = 1; i <= 5; i++) bars += '<span class="diff__bar' + (i <= p.difficulty ? ' on' : '') + '" style="--i:' + i + '"></span>';
    return '<span class="diff" title="Tahmini zorluk: ' + p.difficulty + '/5' + (p.difficultyNote ? ' — ' + esc(p.difficultyNote) : '') + '">' +
      '<span class="diff__bars" aria-hidden="true">' + bars + '</span>' +
      '<span>' + (compact ? '' : 'Tahmini zorluk ') + p.difficulty + '/5</span></span>';
  }
  function catTag(p) { var c = CATS[p.category]; return '<span class="tag">' + icon(c.icon) + esc(c.label) + '</span>'; }

  /* Görsel yüklenemezse: kategori renginde blueprint SVG illüstrasyonu */
  var ILLUS = {
    air: '<circle cx="110" cy="80" r="42"/><circle cx="290" cy="80" r="42"/><circle cx="110" cy="220" r="42"/><circle cx="290" cy="220" r="42"/><path d="M140 110l40 30M260 110l-40 30M140 190l40-30M260 190l-40-30"/><rect x="175" y="125" width="50" height="50" rx="8"/>',
    arm: '<path d="M110 260h180M140 260v-30h120v30"/><circle cx="200" cy="215" r="16"/><path d="M190 202l-40-90M210 202l-40-90"/><circle cx="160" cy="105" r="14"/><path d="M172 96l110-36M176 114l112-36"/><circle cx="290" cy="70" r="10"/><path d="M298 62l30-14M300 78l30 10"/>',
    ground: '<path d="M70 190v-40l40-40h140l50 40h40v40"/><circle cx="120" cy="200" r="34"/><circle cx="290" cy="200" r="34"/><circle cx="120" cy="200" r="10"/><circle cx="290" cy="200" r="10"/><path d="M160 200h90M120 150h140"/>',
    walk: '<ellipse cx="200" cy="150" rx="70" ry="48"/><path d="M135 128l-50-40-30 50M132 152H75l-25 60M140 175l-35 40v45M265 128l50-40 30 50M268 152h57l25 60M260 175l35 40v45"/>'
  };
  function illustration(cat) {
    return '<svg class="illus" viewBox="0 0 400 300" role="img" aria-label="Proje illüstrasyonu"><defs><pattern id="ig-' + cat + '" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width=".5" opacity=".35"/></pattern></defs>' +
      '<rect width="400" height="300" fill="url(#ig-' + cat + ')"/><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + ILLUS[cat] + '</g></svg>' +
      '<span class="illus-label">illüstrasyon</span>';
  }
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-main')) return;
    var holder = img.closest('picture');
    var cat = img.closest('[data-cat]');
    if (holder && cat) holder.outerHTML = illustration(cat.getAttribute('data-cat'));
  }, true);

  /* ------------------------------------------------------------ render: çipler */
  function renderChips() {
    var count = function (k) { return PROJECTS.filter(function (p) { return p.category === k; }).length; };
    var html = '<button class="chip" type="button" data-filter="all" aria-pressed="true">Tümü<span class="chip__count">' + PROJECTS.length + '</span></button>';
    Object.keys(CATS).forEach(function (k) {
      html += '<button class="chip" type="button" data-filter="' + k + '" data-cat="' + k + '" aria-pressed="false">' + icon(CATS[k].icon) + esc(CATS[k].label) +
        '<span class="chip__count">' + count(k) + '</span></button>';
    });
    $('#chips').innerHTML = html;
  }

  /* ------------------------------------------------------------ render: kartlar */
  function renderGrid() {
    $('#grid').innerHTML = PROJECTS.map(function (p, i) {
      var cost = cardCost(p);
      var meta = '<span>' + icon('i-clock') + esc(p.card.time) + '</span>';
      if (p.card.filament) meta += '<span>' + icon('i-spool') + esc(p.card.filament) + '</span>';
      if (cost) meta += '<span>' + icon('i-coin') + esc(cost) + '</span>';
      return '<article class="card reveal" data-cat="' + p.category + '" data-id="' + p.id + '" style="--d:' + (i % 3) * 90 + 'ms">' +
        '<a class="card__link" href="#' + sectionId(p) + '" aria-label="' + esc(p.name) + ' — ayrıntılara git">' +
        '<div class="card__media">' + picture(p.images[0], { main: true }) +
        '<span class="card__num">' + p.id + '</span><span class="card__go" aria-hidden="true">' + icon('i-arrow') + '</span></div>' +
        '<div class="card__body"><div><h3 class="card__title">' + esc(p.name) + '</h3><p class="card__designer">' + esc(p.designer) + '</p></div>' +
        '<div class="card__row">' + catTag(p) + difficulty(p) + '</div>' +
        '<div class="card__meta">' + meta + '</div></div></a></article>';
    }).join('');
  }

  /* ------------------------------------------------------------ render: detay blokları */
  function blk(cls, title, inner, extraTitle) {
    return '<div class="blk blk--' + cls + ' reveal">' + (title ? '<h3 class="blk__title">' + title + (extraTitle || '') + '</h3>' : '') + inner + '</div>';
  }

  function galleryBlock(p) {
    var slides = p.images.map(function (img, i) {
      return '<span class="gallery__slide' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' + picture(img, { main: i === 0 }) + '</span>';
    }).join('');
    var thumbs = p.images.length > 1 ? '<div class="gallery__thumbs" role="group" aria-label="Galeri küçük görselleri">' + p.images.map(function (img, i) {
      return '<button class="thumb" type="button" data-i="' + i + '" aria-label="Görsel ' + (i + 1) + ': ' + esc(img.alt) + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' + picture(img) + '</button>';
    }).join('') + '</div>' : '';
    return '<div class="blk blk--gallery reveal"><button class="gallery__stage" type="button" aria-label="Görseli büyüt">' + slides +
      '<span class="gallery__hint">' + (p.images.length > 1 ? p.images.length + ' görsel · ' : '') + 'büyüt</span></button>' + thumbs + '</div>';
  }

  function stepsBlock(p) {
    var items = p.steps.map(function (s, i) {
      var sub = '';
      if (s.sub && s.sub.length) {
        var sid = 'sub-' + p.id + '-' + i;
        sub = '<button class="sub-toggle" type="button" aria-expanded="false" aria-controls="' + sid + '">Alt adımlar (' + s.sub.length + ')' + icon('i-chev') + '</button>' +
          '<div class="collapse" id="' + sid + '"><div><ol class="sub-list">' + s.sub.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div></div>';
      }
      return '<li class="step"><span class="step__dot" title="' + STEP_LABELS[s.type] + '">' + icon(STEP_ICONS[s.type]) + '</span>' +
        '<div class="step__body"><span class="step__n">ADIM ' + String(i + 1).padStart(2, '0') + ' · ' + STEP_LABELS[s.type].toUpperCase() + '</span>' +
        '<h4 class="step__title">' + esc(s.title) + '</h4><p class="step__text">' + esc(s.text) + '</p>' + sub + '</div></li>';
    }).join('');
    return blk('steps', 'Nasıl yapılır?', '<div class="timeline"><span class="timeline__track" aria-hidden="true"><span class="timeline__fill"></span></span><ol class="timeline__list">' + items + '</ol></div>');
  }

  function bomBlock(p) {
    var b = p.bom, html = '';
    if (b.missing) {
      html += '<div class="bom-missing">' + icon('i-warn') + '<p><strong>' + (b.partial ? 'Liste eksik — ' : '') + 'Tam liste kaynak sayfada.</strong> ' +
        (b.partial ? 'Aşağıda yalnızca bilinen parçalar var; ' : '') + 'Güncel malzeme listesi için tasarımcının sayfasına bakın.<br>' +
        extLink(b.source.url, esc(b.source.label) + ' ' + icon('i-ext'), 'link') + '</p></div>';
    }
    if (b.note) html += '<p class="note" style="margin:0 0 10px">' + esc(b.note) + '</p>';
    html += b.groups.map(function (g, gi) {
      var gid = 'bom-' + p.id + '-' + gi;
      var rows = g.items.map(function (it) {
        return '<tr><td>' + esc(it[0]) + '</td><td>' + esc(it[1]) + '</td><td>' + esc(it[2] || '') + '</td>' +
          (b.priced ? '<td class="price">' + (typeof it[3] === 'number' ? money(it[3]) : '—') + '</td>' : '') + '</tr>';
      }).join('');
      var open = gi === 0;
      return '<div class="bom-group"><button class="bom-group__head" type="button" aria-expanded="' + open + '" aria-controls="' + gid + '">' +
        '<span>' + esc(g.title) + '<small>' + g.items.length + ' kalem</small></span>' + icon('i-chev') + '</button>' +
        '<div class="collapse' + (open ? ' is-open' : '') + '" id="' + gid + '"><div><table class="bom-table"><thead><tr><th scope="col">Parça</th><th scope="col">Adet</th><th scope="col">Not</th>' +
        (b.priced ? '<th scope="col">Fiyat</th>' : '') + '</tr></thead><tbody>' + rows + '</tbody></table></div></div></div>';
    }).join('');
    var total = bomTotal(p);
    if (total) html += '<div class="bom-total"><span>Tahmini toplam maliyet</span><strong>' + money(total) + '</strong><small>Fiyatı verilen kalemlerin toplamı; karbon çubuklar ve kumanda (verici) dahil değil.</small></div>';
    if (b.source && !b.missing) html += '<p class="bom-source">' + icon('i-ext') + extLink(b.source.url, esc(b.source.label)) + '</p>';
    var copyBtn = b.groups.length ? '<button class="btn" type="button" data-copy="' + p.id + '">' + icon('i-copy') + 'Listeyi kopyala</button>' : '';
    return '<div class="blk blk--bom reveal"><div class="bom__bar"><h3 class="blk__title">BOM (malzeme listesi)</h3>' + copyBtn + '</div>' + html + '</div>';
  }

  function facts(rows) {
    return '<dl class="facts">' + rows.map(function (r) {
      return '<div class="fact"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('') + '</dl>';
  }

  function extraBlock(p) {
    var parts = [];
    if (p.specs) parts.push('<div><h3 class="blk__title">Teknik özellikler</h3>' + facts(p.specs) + '</div>');
    if (p.history) parts.push('<div><h3 class="blk__title">' + esc(p.history.title) + '</h3><ol class="history">' + p.history.items.map(function (h) {
      return '<li><b>' + esc(h[0]) + '</b>' + (h[1] ? '<span>' + esc(h[1]) + '</span>' : '') + (h[2] ? '<p>' + esc(h[2]) + '</p>' : '') + '</li>';
    }).join('') + '</ol></div>');
    var wiring = '';
    if (p.wiring) {
      wiring = '<div class="wiring"><h4>Kablolama</h4><button type="button" data-wiring="' + p.id + '" aria-label="Kablolama şemasını büyüt" style="--ar:' + p.wiring.w + ' / ' + p.wiring.h + '">' + picture(p.wiring) + '</button></div>';
    }
    if (!parts.length && !wiring) return '';
    return '<div class="blk blk--extra reveal"><div class="extra-grid' + (parts.length > 1 ? ' two' : '') + '">' + parts.join('') + '</div>' + wiring + '</div>';
  }

  function videosBlock(p) {
    if (!p.videos.length && !p.channel) return '';
    var vids = p.videos.map(function (v) {
      if (v.noEmbed) {
        // gömülmeye izin verilmeyen video: küçük resim yerine YouTube bağlantısı
        return '<figure class="yt"><div class="yt__frame"><a class="yt__btn yt__btn--link" href="https://www.youtube.com/watch?v=' + encodeURIComponent(v.id) + '" target="_blank" rel="noopener">' +
          '<span class="yt__play">' + icon('i-play') + '</span><span class="yt__open">YouTube\'da aç ' + icon('i-ext') + '</span></a></div>' +
          '<figcaption>' + esc(v.label) + ' <span class="yt__tag">gömülemiyor</span></figcaption></figure>';
      }
      return '<figure class="yt"><div class="yt__frame"><button class="yt__btn" type="button" data-yt="' + esc(v.id) + '" aria-label="Videoyu oynat: ' + esc(p.name + ' — ' + v.label) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">' +
        '<span class="yt__play">' + icon('i-play') + '</span></button></div>' +
        '<figcaption>' + (v.tag ? '<span class="yt__tag">' + esc(v.tag) + '</span>' : '') + esc(v.label) + '</figcaption></figure>';
    }).join('');
    var channel = p.channel ? '<p class="channel">' + esc(p.channel.note) + ' ' + extLink(p.channel.url, esc(p.channel.label) + ' ' + icon('i-ext'), 'btn') + '</p>' : '';
    var title = p.videos.length ? 'Videolar' : 'Video';
    return blk('videos', title, (vids ? '<div class="videos' + (p.videos.length > 2 ? ' many' : '') + '">' + vids + '</div>' : '') + channel);
  }

  function renderProject(p) {
    var c = CATS[p.category];
    var badges = '<span class="badge">' + esc(p.license) + '</span>' + (p.badges || []).map(function (b) { return '<span class="badge badge--win">★ ' + esc(b) + '</span>'; }).join('');
    var related = '';
    if (p.related) {
      related = '<a class="related" href="#proje-' + p.related.id + '">' + esc(p.related.text) + icon('i-arrow') + '</a>';
    }
    var features = '<div class="chips-tech">' + p.highlights.map(function (h, i) { return '<span class="tchip" style="--i:' + i + '">' + esc(h) + '</span>'; }).join('') + '</div>' +
      (p.highlightNote ? '<p class="note">' + esc(p.highlightNote) + '</p>' : '');
    var warn = p.warnings.length ? '<div class="blk blk--warn reveal"><div class="warn" role="note"><h3 class="blk__title">' + icon('i-warn') + 'Dikkat edilecekler</h3><ul>' +
      p.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div></div>' : '';
    var links = blk('links', 'Bağlantılar', '<div class="links">' + p.links.map(function (l) {
      return extLink(l.url, esc(l.label) + icon('i-ext'), 'btn');
    }).join('') + '</div>');

    return '<article class="project" id="' + sectionId(p) + '" data-cat="' + p.category + '" aria-labelledby="t-' + p.id + '">' +
      '<span class="project__num" aria-hidden="true">' + p.id + '</span><div class="wrap">' +
      '<header class="project__head reveal"><p class="project__idx">' + p.id + ' / ' + String(PROJECTS.length).padStart(2, '0') + ' · ' + esc(c.label) + '</p>' +
      '<h2 class="project__title" id="t-' + p.id + '">' + esc(p.fullName) + '</h2>' +
      '<p class="project__by">Tasarımcı: ' + extLink(p.designerUrl, esc(p.designer)) + '</p>' +
      '<div class="project__badges">' + catTag(p) + difficulty(p) + badges + '</div>' + related + '</header>' +
      '<div class="project__layout">' +
      galleryBlock(p) +
      blk('about', 'Bu nedir?', p.summary.map(function (s) { return '<p>' + esc(s) + '</p>'; }).join('')) +
      blk('features', 'Öne çıkan özellikler', features) +
      stepsBlock(p) +
      bomBlock(p) +
      blk('print', 'Baskı bilgisi', facts(p.print)) +
      extraBlock(p) +
      videosBlock(p) + warn + links +
      '</div><nav class="pnav" aria-label="Proje gezinme"><a class="pnav__link pnav__link--prev" data-dir="prev" href="#"></a>' +
      '<a class="pnav__link pnav__link--next" data-dir="next" href="#"></a></nav></div></article>';
  }

  function renderDetails() {
    $('#projeler').innerHTML = '<div class="wrap"><div class="section-head reveal" style="margin-bottom:0"><p class="kicker mono">§ 02 — Projeler</p><h2>Her proje, adım adım</h2>' +
      '<p class="section-head__lead">Ne olduğu, nasıl yapıldığı, neye ihtiyaç duyduğu ve nelere dikkat etmek gerektiği.</p></div></div>' +
      PROJECTS.map(renderProject).join('');
  }

  /* ------------------------------------------------------------ render: tablo, footer, ayırıcılar */
  function renderCompare() {
    $('#compare-table tbody').innerHTML = PROJECTS.map(function (p) {
      var hasVideo = p.videos.length > 0;
      return '<tr data-cat="' + p.category + '"><td><a href="#' + sectionId(p) + '"><span class="num">' + p.id + '</span>' + esc(p.name) + '</a></td>' +
        '<td>' + catTag(p) + '</td><td>' + difficulty(p, true) + '</td><td class="mono">' + esc(p.card.time) + '</td>' +
        '<td class="mono">' + esc(p.card.filament || '—') + '</td><td>' + esc(p.controller) + '</td>' +
        '<td>' + (hasVideo ? '<span class="yes">Var (' + p.videos.length + ')</span>' : '<span class="no">Yok</span>') + '</td></tr>';
    }).join('');
  }

  function renderDesigners() {
    var map = {};
    PROJECTS.forEach(function (p) {
      var key = p.designer.split(' (')[0];
      if (!map[key]) map[key] = { url: p.designerUrl, ids: [] };
      map[key].ids.push(p.id);
    });
    $('#designers').innerHTML = Object.keys(map).map(function (name) {
      return '<li>' + extLink(map[name].url, esc(name)) + '<span>Proje ' + map[name].ids.join(', ') + '</span></li>';
    }).join('');
  }

  function renderDividers() {
    $$('[data-divider]').forEach(function (el) {
      var label = esc(el.getAttribute('data-divider'));
      el.innerHTML = '<svg viewBox="0 0 1000 72" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" opacity=".7">' +
        '<path d="M16 22v28M984 22v28M16 36h968" stroke-dasharray="0"/><path d="M16 36l14-5v10zM984 36l-14-5v10z" fill="currentColor"/>' +
        '<circle cx="500" cy="36" r="9" fill="#F6F4EF"/><path d="M490 36h20M500 26v20"/></g></svg>' +
        '<span class="mono" style="position:absolute;left:50%;top:6px;transform:translateX(-50%);font-size:12px;color:var(--ink-3);background:var(--bg);padding:0 8px">' + label + '</span>';
    });
  }

  /* ------------------------------------------------------------ görünürlük (reveal) */
  function initReveal() {
    var targets = $$('.reveal, .diff, .project');
    if (REDUCE || !('IntersectionObserver' in window)) { targets.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* hero istatistikleri: görünür olunca sayarak artar */
  function initCounters() {
    var values = {
      projects: PROJECTS.length,
      categories: Object.keys(CATS).length,
      videos: PROJECTS.filter(function (p) { return p.videos.length > 0; }).length
    };
    var els = $$('[data-count]');
    function run() {
      els.forEach(function (el) {
        var target = values[el.getAttribute('data-count')];
        if (REDUCE) { el.textContent = target; return; }
        var t0 = performance.now(), dur = 1400;
        (function tick(now) {
          var k = clamp((now - t0) / dur, 0, 1), eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }
    if (!('IntersectionObserver' in window)) return run();
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe($('#stats'));
  }

  /* ------------------------------------------------------------ kaydırma döngüsü */
  function initScroll() {
    var bar = $('.progress__bar'), heroBg = $('.hero__bg'), toTop = $('#to-top');
    var nums = $$('.project__num'), timelines = $$('.timeline');
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      toTop.classList.toggle('is-on', y > vh * 1.2);
      if (REDUCE) { lightAll(); return; }
      if (y < vh * 1.2) heroBg.style.transform = 'translate3d(0,' + (y * 0.28).toFixed(1) + 'px,0)';
      nums.forEach(function (n) {
        var r = n.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        n.style.transform = 'translate3d(0,' + ((r.top - vh * 0.3) * -0.12).toFixed(1) + 'px,0)';
      });
      timelines.forEach(function (tl) {
        var r = tl.getBoundingClientRect();
        if (r.top > vh || r.bottom < -vh) return;
        var progress = clamp((vh * 0.62 - r.top) / r.height, 0, 1);
        tl.querySelector('.timeline__fill').style.transform = 'scaleY(' + progress.toFixed(3) + ')';
        var reach = progress * r.height;
        $$('.step', tl).forEach(function (s) { s.classList.toggle('is-lit', s.offsetTop + 12 <= reach); });
      });
    }
    function lightAll() { $$('.step').forEach(function (s) { s.classList.add('is-lit'); }); }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }); $('.filterbar__logo').focus({ preventScroll: true }); });
    update();
  }

  /* kaydırırken bulunulan projenin kategori çipini vurgula */
  function initCurrentCategory() {
    if (!('IntersectionObserver' in window)) return;
    var chips = $$('#chips .chip');
    function mark(cat) { chips.forEach(function (c) { c.classList.toggle('is-current', !!cat && c.getAttribute('data-filter') === cat); }); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark(en.target.getAttribute('data-cat')); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.project').forEach(function (s) { io.observe(s); });
    var off = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark(null); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['#top', '#genel-bakis', '#karsilastirma'].forEach(function (s) { off.observe($(s)); });
  }

  /* ------------------------------------------------------------ galeri + lightbox */
  var lb = { el: null, img: null, list: [], index: 0, source: null, returnFocus: null };

  function imageUrl(img) { return 'images/' + img.file + '.' + img.ext; }

  function flipFrom(el, fromRect) {
    if (!fromRect || REDUCE) return;
    var to = el.getBoundingClientRect();
    if (!to.width) return;
    el.style.transition = 'none';
    el.style.transform = 'translate(' + (fromRect.left - to.left) + 'px,' + (fromRect.top - to.top) + 'px) scale(' + (fromRect.width / to.width) + ',' + (fromRect.height / to.height) + ')';
    el.getBoundingClientRect();
    el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    el.style.transform = '';
  }

  function showLightboxImage(i, fromRect) {
    var item = lb.list[i];
    lb.index = i;
    var img = document.createElement('img');
    img.className = 'lightbox__img';
    img.src = imageUrl(item);
    img.alt = item.alt;
    img.width = item.w; img.height = item.h;
    if (lb.img) lb.img.replaceWith(img); else $('.lightbox__figure', lb.el).prepend(img);
    lb.img = img;
    $('.lightbox__cap', lb.el).textContent = item.alt + (lb.list.length > 1 ? '  ·  ' + (i + 1) + ' / ' + lb.list.length : '');
    flipFrom(img, fromRect);
  }

  function openLightbox(list, index, sourceEl) {
    lb.list = list; lb.source = sourceEl; lb.returnFocus = document.activeElement;
    lb.el.hidden = false;
    lb.el.classList.toggle('single', list.length < 2);
    document.body.style.overflow = 'hidden';
    showLightboxImage(index, sourceEl ? sourceEl.getBoundingClientRect() : null);
    requestAnimationFrame(function () { lb.el.classList.add('is-open'); });
    $('.lightbox__close', lb.el).focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (lb.el.hidden) return;
    lb.el.classList.remove('is-open');
    var done = function () { lb.el.hidden = true; if (lb.img) { lb.img.remove(); lb.img = null; } };
    var src = lb.source && lb.source.getBoundingClientRect();
    if (!REDUCE && lb.img && src && src.width) {
      var to = lb.img.getBoundingClientRect();
      lb.img.style.transition = 'transform .38s cubic-bezier(.4,0,.2,1), opacity .38s';
      lb.img.style.transform = 'translate(' + (src.left - to.left) + 'px,' + (src.top - to.top) + 'px) scale(' + (src.width / to.width) + ',' + (src.height / to.height) + ')';
      lb.img.style.opacity = '.4';
      setTimeout(done, 380);
    } else done();
    document.body.style.overflow = '';
    if (lb.returnFocus) lb.returnFocus.focus({ preventScroll: true });
  }

  function stepLightbox(d) {
    if (lb.list.length < 2) return;
    showLightboxImage((lb.index + d + lb.list.length) % lb.list.length, null);
  }

  function setSlide(gallery, i) {
    $$('.gallery__slide', gallery).forEach(function (s) { s.classList.toggle('is-active', +s.getAttribute('data-i') === i); });
    $$('.thumb', gallery).forEach(function (t) { t.setAttribute('aria-current', String(+t.getAttribute('data-i') === i)); });
    gallery.setAttribute('data-active', i);
  }

  function initGalleries() {
    lb.el = $('#lightbox');
    var byId = {};
    PROJECTS.forEach(function (p) { byId[p.id] = p; });

    document.addEventListener('click', function (e) {
      var thumb = e.target.closest('.thumb');
      if (thumb) { setSlide(thumb.closest('.blk--gallery'), +thumb.getAttribute('data-i')); return; }
      var stage = e.target.closest('.gallery__stage');
      if (stage) {
        var g = stage.closest('.blk--gallery'), p = byId[stage.closest('.project').id.replace('proje-', '')];
        var i = +(g.getAttribute('data-active') || 0);
        openLightbox(p.images, i, $('.gallery__slide.is-active img', stage) || stage);
        return;
      }
      var wiring = e.target.closest('[data-wiring]');
      if (wiring) { openLightbox([byId[wiring.getAttribute('data-wiring')].wiring], 0, $('img', wiring)); return; }
      if (e.target.closest('[data-close]')) closeLightbox();
    });
    $('.lightbox__prev').addEventListener('click', function () { stepLightbox(-1); });
    $('.lightbox__next').addEventListener('click', function () { stepLightbox(1); });

    document.addEventListener('keydown', function (e) {
      if (lb.el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'ArrowRight') stepLightbox(1);
      else if (e.key === 'Tab') {
        // odak lightbox içinde kalsın
        var f = $$('.lightbox__btn', lb.el).filter(function (b) { return b.offsetParent !== null; });
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  /* ------------------------------------------------------------ açılır paneller */
  function toggleCollapse(btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    var open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
  }
  function initCollapsibles() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.bom-group__head, .sub-toggle');
      if (btn) toggleCollapse(btn);
    });
  }

  /* ------------------------------------------------------------ BOM kopyalama */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2000);
  }
  function bomText(p) {
    var lines = [p.id + ' — ' + p.fullName + ' · BOM (malzeme listesi)', ''];
    p.bom.groups.forEach(function (g) {
      lines.push('[' + g.title + ']');
      g.items.forEach(function (it) {
        var line = '- ' + it[0] + (it[1] && it[1] !== '—' ? ' × ' + it[1] : '');
        if (it[2]) line += ' (' + it[2] + ')';
        if (typeof it[3] === 'number') line += ' — ' + money(it[3]);
        lines.push(line);
      });
      lines.push('');
    });
    var total = bomTotal(p);
    if (total) lines.push('Tahmini toplam: ' + money(total));
    if (p.bom.source) lines.push('Kaynak: ' + p.bom.source.url);
    return lines.join('\n').trim();
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      if (ok) resolve(); else reject(new Error('copy failed'));
    });
  }
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-copy]');
      if (!btn) return;
      var p = PROJECTS.filter(function (x) { return x.id === btn.getAttribute('data-copy'); })[0];
      copyText(bomText(p)).then(function () { toast('Kopyalandı ✓'); }, function () { toast('Kopyalanamadı — tarayıcı izin vermedi'); });
    });
  }

  /* ------------------------------------------------------------ hafif YouTube gömme */
  function initVideos() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-yt]');
      if (!btn) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(btn.getAttribute('data-yt')) + '?autoplay=1';
      iframe.title = btn.getAttribute('aria-label').replace('Videoyu oynat: ', '');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  }

  /* nav.js (filtre, proje paneli) bu yardımcıları kullanır */
  window.SITE = { PROJECTS: PROJECTS, CATS: CATS, REDUCE: REDUCE, $: $, $$: $$, esc: esc, icon: icon, sectionId: sectionId };

  /* ------------------------------------------------------------ başlat */
  renderChips();
  renderGrid();
  renderDetails();
  renderCompare();
  renderDesigners();
  renderDividers();
  initReveal();
  initCounters();
  initScroll();
  initCurrentCategory();
  initGalleries();
  initCollapsibles();
  initCopy();
  initVideos();
})();
