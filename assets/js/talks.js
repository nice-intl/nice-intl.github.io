(function () {
  'use strict';

  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1MB_q_SRvdxkzgyg2AMdkoc9B5kYzsGMpucBnNgpYL8U/gviz/tq?tqx=out:csv';
  var FALLBACK_URL = 'assets/data/videos.json';
  var SHOW_OPTIONS = [5, 10, 20, 50, 100];
  var DEFAULT_SHOW = 5;
  var filterTalks = window.NiceTalksCore.filterTalks;

  /* ── CSV parser ─────────────────────────────────────────────── */
  function parseCSVLine(line) {
    var result = [], current = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current); current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  function parseCSV(text) {
    var lines = text.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    var headers = parseCSVLine(lines[0]).map(function (h) { return h.trim(); });
    return lines.slice(1).filter(function (l) { return l.trim(); }).map(function (line) {
      var vals = parseCSVLine(line);
      var obj = {};
      headers.forEach(function (h, i) { obj[h] = (vals[i] || '').trim(); });
      return obj;
    });
  }

  /* ── Helpers ────────────────────────────────────────────────── */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Gap filler ─────────────────────────────────────────────── */
  /* Returns { list: [...descending by id...], maxId } where every
     integer from maxId down to 1 has an entry; gaps get a placeholder. */
  function buildFullList(videos) {
    var map = {}, maxId = 0;
    videos.forEach(function (v) {
      var id = parseInt(v.id, 10);
      if (!isNaN(id) && id > 0) {
        map[id] = v;
        if (id > maxId) maxId = id;
      }
    });
    var list = [];
    for (var id = maxId; id >= 1; id--) {
      if (map[id]) {
        list.push(map[id]);
      } else {
        list.push({ id: id, title: 'Missing Information', url: '', speaker: '—', host: '', date: '', tags: '', _missing: true });
      }
    }
    return { list: list, maxId: maxId };
  }

  /* ── Card HTML builder ──────────────────────────────────────── */
  function buildCardHTML(v, delayClass, hostLabel) {
    if (v._missing) {
      return [
        '<a class="talk reveal' + delayClass + '" href="javascript:void(0)"',
        '   style="opacity:0.38;cursor:default;pointer-events:none">',
        '  <span class="t-num">' + esc(String(v.id)) + '</span>',
        '  <div><div class="t-title">' + esc(v.title) + '</div>',
        '  <div class="t-meta"><span class="t-speaker">' + esc(v.speaker) + '</span></div></div>',
        '  <span class="t-date"></span>',
        '</a>'
      ].join('\n');
    }
    var tags     = (v.tags || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var tagsAttr = tags.map(function (t) { return t.toLowerCase(); }).join(',');
    var tagsHtml = tags.map(function (t) { return '<span class="ttag">' + esc(t) + '</span>'; }).join('');
    var tagsDiv  = tagsHtml ? '<div class="t-tags">' + tagsHtml + '</div>' : '';
    var hostHtml = v.host ? '<span class="t-host">' + esc(hostLabel) + esc(v.host) + '</span>' : '';
    return [
      '<a class="talk reveal' + delayClass + '"',
      '   href="' + esc(v.url) + '" target="_blank" rel="noopener"',
      '   data-tags="' + esc(tagsAttr) + '">',
      '  <span class="t-num">' + esc(String(v.id)) + '</span>',
      '  <div>',
      '    <div class="t-title">' + esc(v.title) + '</div>',
      '    <div class="t-meta"><span class="t-speaker">' + esc(v.speaker) + '</span>' + hostHtml + '</div>',
      '    ' + tagsDiv,
      '  </div>',
      '  <span class="t-date">' + formatDate(v.date) + '</span>',
      '</a>'
    ].join('\n');
  }

  function observeReveal(container) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    container.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  }

  /* ── Filter ─────────────────────────────────────────────────── */
  function getActiveTags(section) {
    return Array.prototype.slice.call(section.querySelectorAll('.fc.on'))
      .map(function (c) { return c.dataset.tag || c.textContent.trim().toLowerCase(); });
  }

  /* ── Dynamic filter chips ────────────────────────────────────── */
  var MAX_VISIBLE_CHIPS = 6;

  function renderFilterChips(section, allVideos, onChange) {
    var frow = section.querySelector('.frow');
    if (!frow) return;

    /* Count tag frequencies across real (non-placeholder) entries */
    var freq = {};
    allVideos.forEach(function (v) {
      if (v._missing) return;
      (v.tags || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean).forEach(function (t) {
        freq[t] = (freq[t] || 0) + 1;
      });
    });

    var sortedTags = Object.keys(freq).sort(function (a, b) {
      return (freq[b] - freq[a]) || a.localeCompare(b);
    });

    if (!sortedTags.length) { frow.innerHTML = ''; return; }

    var visible = sortedTags.slice(0, MAX_VISIBLE_CHIPS);
    var hidden  = sortedTags.slice(MAX_VISIBLE_CHIPS);

    /* Build chip elements entirely in JS so we own all listeners */
    frow.innerHTML = '';

    function makeChip(tag) {
      var btn = document.createElement('button');
      btn.className = 'fc';
      btn.textContent = tag;
      btn.dataset.tag = tag.toLowerCase();
      btn.addEventListener('click', function () {
        btn.classList.toggle('on');
        onChange();
      });
      return btn;
    }

    visible.forEach(function (t) { frow.appendChild(makeChip(t)); });

    if (hidden.length) {
      /* Hidden chips — appended but not shown yet */
      var hiddenChips = hidden.map(function (t) {
        var chip = makeChip(t);
        chip.style.display = 'none';
        frow.appendChild(chip);
        return chip;
      });

      /* Toggle button — styled like .fc but acts as meta-control */
      var toggleStyle = 'opacity:.55;font-style:italic;';
      var moreBtn = document.createElement('button');
      moreBtn.className = 'fc';
      moreBtn.style.cssText = toggleStyle;
      moreBtn.textContent = '+' + hidden.length + ' more';
      var expanded = false;
      moreBtn.addEventListener('click', function (e) {
        e.stopPropagation(); /* don't fire applyFilter */
        expanded = !expanded;
        hiddenChips.forEach(function (c) { c.style.display = expanded ? '' : 'none'; });
        moreBtn.textContent = expanded ? 'show less' : ('+' + hidden.length + ' more');
      });
      frow.appendChild(moreBtn);
    }
  }

  /* ── Main render ─────────────────────────────────────────────── */
  function renderTalks(rawVideos) {
    var section = document.getElementById('talks');
    if (!section) return;

    var hostLabel   = section.dataset.hostLabel   || 'Host: ';
    var showingTpl  = section.dataset.showingTpl  || 'Showing {n} of {total} talks';
    var viewAllTpl  = section.dataset.viewAllTpl  || 'View All {total} Talks →';
    var showLessTpl = section.dataset.showLessTpl || 'Show Less ↑';

    var built     = buildFullList(rawVideos);
    var allVideos = built.list;
    var maxId     = built.maxId;

    var list    = section.querySelector('.talks-list');
    var countEl = section.querySelector('.tf-c');
    if (!list) return;

    /* Clone btn-out to strip the original href="#" navigation */
    var toggleBtn = (function () {
      var el = section.querySelector('.btn-out');
      if (!el) return null;
      var fresh = el.cloneNode(true);
      el.parentNode.replaceChild(fresh, el);
      return fresh;
    }());

    var currentShowCount = DEFAULT_SHOW;
    var expanded = false;
    var searchQuery = '';
    var delays   = ['', ' d1', ' d2', ' d3', ' d4', ' d5'];

    /* Build the "Showing [select] of N talks" count element once */
    if (countEl) {
      var totalStr = String(maxId);
      var parts    = showingTpl.replace('{total}', totalStr).split('{n}');
      var prefix   = parts[0] || '';
      var suffix   = parts.length > 1 ? parts[1] : '';
      var optHtml  = SHOW_OPTIONS.map(function (n) {
        return '<option value="' + n + '"' + (n === DEFAULT_SHOW ? ' selected' : '') + '>' + n + '</option>';
      }).join('');
      var selStyle = 'background:transparent;border:1px solid currentColor;border-radius:3px;' +
                     'color:inherit;font:inherit;padding:1px 4px;cursor:pointer;margin:0 2px;';
      countEl.innerHTML = prefix +
        '<select class="talks-per-page" style="' + selStyle + '">' + optHtml + '</select>' +
        suffix;

      var perPageSel = countEl.querySelector('.talks-per-page');
      if (perPageSel) {
        perPageSel.addEventListener('change', function () {
          currentShowCount = parseInt(this.value, 10);
          if (!expanded) {
            showCards(false);
          }
        });
      }
    }

    function showCards(showAll) {
      var matchingVideos = filterTalks(allVideos, searchQuery, getActiveTags(section));
      var subset = showAll ? matchingVideos : matchingVideos.slice(0, currentShowCount);
      list.innerHTML = subset.map(function (v, i) {
        return buildCardHTML(v, delays[Math.min(i, 5)], hostLabel);
      }).join('\n');
      observeReveal(list);

      if (toggleBtn) {
        toggleBtn.textContent = showAll
          ? showLessTpl
          : viewAllTpl.replace('{total}', String(maxId));
      }
    }

    /* "View All / Show Less" toggle */
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        expanded = !expanded;
        showCards(expanded);
      });
    }

    /* Dynamic filter chips derived from actual tag data */
    renderFilterChips(section, allVideos, function () {
      showCards(expanded);
    });

    /* Search */
    var searchInput = section.querySelector('.sf input');
    var searchBtn   = section.querySelector('.sb');
    if (searchInput && searchBtn) {
      var fi = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(fi, searchInput);
      var fb = searchBtn.cloneNode(true);
      searchBtn.parentNode.replaceChild(fb, searchBtn);
      function doSearch() {
        searchQuery = fi.value;
        showCards(expanded);
      }
      fb.addEventListener('click', doSearch);
      fi.addEventListener('keypress', function (e) { if ((e.which || e.keyCode) === 13) doSearch(); });
    }

    /* Initial render — no applyFilter so pre-selected chips don't hide cards */
    showCards(false);
  }

  /* ── Data loading ───────────────────────────────────────────── */
  function normaliseSheetRow(r) {
    return {
      id:      (r.id      || r.ID      || '').trim(),
      title:   (r.title   || r.Title   || '').trim(),
      url:     (r.url     || r.URL     || '').trim(),
      speaker: (r.speaker || r.Speaker || '').trim(),
      host:    (r.host    || r.Host    || '').trim(),
      date:    (r.date    || r.Date    || '').trim(),
      tags:    (r.tags    || r.Tags    || '').trim()
    };
  }

  function normaliseJsonRow(v) {
    return {
      id:      v.id,
      title:   v.title,
      url:     v.url,
      speaker: v.speaker,
      host:    v.host || '',
      date:    v.date,
      tags:    Array.isArray(v.tags) ? v.tags.join(', ') : (v.tags || '')
    };
  }

  function loadTalks() {
    /* Pre-fetch local tags so Sheet rows with an empty tags column still show
       chips — covers the window between adding a talk and tagging it in the Sheet. */
    var localTags = {};
    var tagsReady = fetch(FALLBACK_URL)
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (json) {
        json.forEach(function (v) {
          var t = Array.isArray(v.tags) ? v.tags.join(', ') : (v.tags || '');
          if (t) localTags[String(v.id)] = t;
        });
      });

    function augment(rows) {
      return rows.map(function (r) {
        if (!r.tags && localTags[String(r.id)]) {
          return Object.assign({}, r, { tags: localTags[String(r.id)] });
        }
        return r;
      });
    }

    tagsReady.then(function () {
      fetch(SHEET_URL)
        .then(function (resp) {
          if (!resp.ok) throw new Error('Sheet HTTP ' + resp.status);
          return resp.text();
        })
        .then(function (text) {
          var rows = parseCSV(text).map(normaliseSheetRow).filter(function (v) { return v.id && v.title; });
          renderTalks(augment(rows));
        })
        .catch(function (err) {
          console.warn('[talks] Google Sheet unavailable (' + err.message + '), using local JSON');
          fetch(FALLBACK_URL)
            .then(function (r) {
              if (!r.ok) throw new Error('Local JSON HTTP ' + r.status);
              return r.json();
            })
            .then(function (json) { renderTalks(json.map(normaliseJsonRow)); })
            .catch(function (e) { console.error('[talks] All sources failed:', e.message); });
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTalks);
  } else {
    loadTalks();
  }
})();
