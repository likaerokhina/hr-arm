(function () {
  'use strict';

  var DATA = window.MOCK_DATA;
  var toastTimer;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function showToast(message) {
    var container = qs('[data-mock-toast-root]');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-root';
      container.setAttribute('data-mock-toast-root', '');
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.remove(); }, 200);
    }, 3200);
  }

  function getCandidate(id) {
    if (!DATA || !DATA.candidates) return null;
    return DATA.candidates[id];
  }

  function getStageNote(data) {
    if (data.statusNote) return data.statusNote;
    var map = {
      ai: 'AI подобрал · адаптации нет',
      review: 'Ждёт проверки на экране «было → стало»',
      ready: 'DOCX готов к отправке',
      sent: 'Отправлено заказчику',
      reject: data.rejectReason || 'Отказ',
      blocked: 'Заблокирован'
    };
    return map[data.stage] || '';
  }

  function buildDocxAction(type) {
    if (type === 'adapted') {
      return '<button type="button" class="btn btn-secondary" data-mock-docx data-docx-type="adapted">Скачать адаптированный DOCX</button>';
    }
    if (type === 'original') {
      return '<button type="button" class="btn btn-link" data-mock-docx data-docx-type="original">Исходник из банка</button>';
    }
    return '';
  }

  function buildActionsHtml(data) {
    var html = '';
    var a = data.actions || [];

    if (a.indexOf('review') >= 0) {
      html += '<button type="button" class="btn btn-primary" data-mock-take-review>Взять на проверку</button>';
    }
    if (a.indexOf('resume') >= 0) {
      html += '<a href="resume.html" class="btn btn-primary">Проверить резюме</a>';
    }
    if (a.indexOf('send') >= 0) {
      html += '<a href="vacancy-card.html" class="btn btn-primary">Отправить заказчику</a>';
    }
    if (a.indexOf('return-review') >= 0) {
      html += '<button type="button" class="btn btn-secondary" data-mock-return-review>Вернуть на проверку</button>';
    }
    if (a.indexOf('readiness') >= 0) {
      html += '<button type="button" class="btn btn-secondary" data-mock-mark-ready>Отметить готовность</button>';
    }
    if (a.indexOf('unblock') >= 0) {
      html += '<button type="button" class="btn btn-secondary" data-mock-unblock>Снять блок</button>';
    }
    if (a.indexOf('reject') >= 0) {
      html += '<button type="button" class="btn btn-danger" data-mock-reject-candidate>Отказать</button>';
    }
    if (a.indexOf('history') >= 0) {
      html += '<a href="vacancy-card.html" class="btn btn-secondary">Статусы →</a>';
    }
    if (a.indexOf('docx') >= 0) {
      html += buildDocxAction('adapted');
    }
    if (a.indexOf('restore') >= 0) {
      html += '<button type="button" class="btn btn-secondary" data-mock-restore>Подобрать снова</button>';
    }

    var secondary = '';
    if (a.indexOf('original') >= 0) {
      secondary += buildDocxAction('original');
    }
    if (secondary) {
      html += '<div class="detail-actions-secondary">' + secondary + '</div>';
    }
    return html;
  }

  function renderDrawerContent(data) {
    var panel = qs('[data-mock-drawer-content]');
    if (!panel || !data) return;

    var readinessHtml = data.readiness === 'confirmed'
      ? '<span class="badge badge--success">Согласован 20.05</span>'
      : '<span class="badge badge--warning">Не проверена</span>';

    var englishClass = data.englishWarn ? ' context-row--warn' : '';

    var scoreBlock = data.score > 0
      ? '<div class="score-block">' +
        '<span class="badge badge-ai"><svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>AI-подбор</span>' +
        '<div class="score-block__top">' +
        '<div class="score-ring" style="--score: ' + data.score + '"><span>' + data.score + '%</span></div>' +
        '<ul>' + (data.reasons || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        (data.matchHint ? '<p class="score-block__hint">' + data.matchHint + ' · топ-3 совпадения</p>' : '') +
        '</div>'
      : '<p class="detail-note">' + (data.rejectReason || 'Отказ') + '</p>';

    var activityHtml = (data.activity || []).map(function (ev) {
      return '<li><time>' + ev.time + '</time><span>' + ev.text + '</span></li>';
    }).join('');

    panel.innerHTML =
      '<div class="detail-panel">' +
      '<div class="detail-panel__scroll">' +
      '<div class="detail-header">' +
      '<div class="avatar avatar--lg ' + data.avatar + '">' + data.initials + '</div>' +
      '<div><h2>' + data.name + '</h2><div class="role">' + data.role + '</div></div>' +
      '</div>' +
      scoreBlock +
      '<p class="detail-note detail-note--stage">' + getStageNote(data) + '</p>' +
      '<div class="context-block">' +
      '<h3 class="context-block__title">Контекст для решения</h3>' +
      '<dl class="context-list">' +
      '<div class="context-row"><dt>Доступность</dt><dd>' + data.availability + '</dd></div>' +
      '<div class="context-row' + englishClass + '"><dt>Английский</dt><dd>' + data.english + '</dd></div>' +
      '<div class="context-row"><dt>Фидбек</dt><dd>' + data.feedback + '</dd></div>' +
      '<div class="context-row"><dt>Готовность</dt><dd data-mock-readiness-cell>' + readinessHtml + '</dd></div>' +
      '</dl></div>' +
      '<div class="mini-activity">' +
      '<div class="mini-activity__head"><h3>Последние шаги</h3>' +
      '<a href="vacancy-card.html" class="mini-activity__link">Вся история →</a></div>' +
      '<ul class="mini-activity__list">' + activityHtml + '</ul></div>' +
      '</div>' +
      '<div class="detail-panel__foot actions" data-mock-detail-actions data-candidate-id="' + data.id + '">' +
      buildActionsHtml(data) +
      '</div></div>';

    bindDrawerActions(panel, data);
  }

  function openDrawer(data) {
    var drawer = qs('[data-mock-drawer]');
    var overlay = qs('[data-mock-drawer-overlay]');
    if (!drawer) return;
    renderDrawerContent(data);
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('is-open');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    var drawer = qs('[data-mock-drawer]');
    var overlay = qs('[data-mock-drawer-overlay]');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    qsa('.candidate-card.selected').forEach(function (c) { c.classList.remove('selected'); });
  }

  function bindDrawerActions(panel, data) {
    var readyBtn = qs('[data-mock-mark-ready]', panel);
    if (readyBtn) {
      readyBtn.addEventListener('click', function () {
        showToast('Готовность сотрудника отмечена');
        readyBtn.remove();
      });
    }

    var unblockBtn = qs('[data-mock-unblock]', panel);
    if (unblockBtn) {
      unblockBtn.addEventListener('click', function () {
        showToast('Блок снят — кандидат доступен');
        data.blocked = false;
        data.actions = ['review', 'reject', 'original'];
        data.stage = 'ai';
        renderDrawerContent(data);
      });
    }

    qsa('[data-mock-reject-candidate]', panel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('Отказ зафиксирован');
      });
    });

    qsa('[data-mock-take-review]', panel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('Кандидат переведён на проверку');
      });
    });

    qsa('[data-mock-return-review]', panel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('Возвращено на проверку');
      });
    });

    qsa('[data-mock-restore]', panel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('Кандидат возвращён в подбор AI');
      });
    });

    qsa('[data-mock-docx]', panel).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var type = btn.getAttribute('data-docx-type');
        showToast(type === 'original'
          ? 'Скачан файл из банка (без правок)'
          : 'DOCX для заказчика скачан');
      });
    });
  }

  function buildCandidateCardHtml(id, data) {
    var blocked = data.blocked ? ' candidate-card--blocked' : '';
    var reject = data.stage === 'reject' ? ' candidate-card--reject' : '';
    var tag = '';
    if (data.cornerTag) {
      tag = '<span class="candidate-card__corner-tag candidate-card__corner-tag--' + data.cornerTag.type + '">' + data.cornerTag.text + '</span>';
    }
    if (data.stage === 'reject' && data.rejectReason) {
      tag = '<span class="candidate-card__corner-tag candidate-card__corner-tag--reject">Отказ</span>';
    }

    var scoreHtml = data.scoreWaiting
      ? '<div class="score score--waiting">' + data.scoreWaiting + '</div>'
      : (data.score > 0
        ? '<div class="score"><span class="score-value">' + data.score + '%</span></div>' +
          (data.reasons && data.reasons.length
            ? '<ul class="candidate-card__reasons">' + data.reasons.slice(0, 2).map(function (r) {
              return '<li>' + r + '</li>';
            }).join('') + '</ul>'
            : '')
        : '<div class="candidate-card__reject-label">' + (data.rejectReason || 'Отказ') + '</div>');

    var stageTime = data.stageTime ? '<div class="candidate-stage-time">' + data.stageTime + '</div>' : '';

    return '<div class="candidate-card' + blocked + reject + '" data-candidate="' + id + '" tabindex="0" role="button">' +
      tag +
      '<div class="candidate-card__row">' +
      '<div class="avatar ' + data.avatar + '">' + data.initials + '</div>' +
      '<div><div class="name">' + data.short + '</div>' + scoreHtml + stageTime + '</div>' +
      '</div></div>';
  }

  function buildPickMoreButton() {
    return '<button type="button" class="btn btn-primary btn-sm" data-mock-pick-more aria-label="Подобрать кандидатов из банка">' +
      '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>' +
      '<circle cx="9" cy="7" r="4"/>' +
      '<path d="M19 8v6M22 11h-6"/>' +
      '</svg>' +
      'Подбор</button>';
  }

  var FUNNEL_COLUMNS_KEY = 'hr-lk-mock-funnel-columns';

  function getFunnelColumnVisibility() {
    try {
      var raw = localStorage.getItem(FUNNEL_COLUMNS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (err) { /* ignore */ }
    var defaults = {};
    DATA.pipelineColumns.forEach(function (col) {
      defaults[col.id] = col.defaultVisible !== false;
    });
    return defaults;
  }

  function saveFunnelColumnVisibility(map) {
    localStorage.setItem(FUNNEL_COLUMNS_KEY, JSON.stringify(map));
  }

  function getVisiblePipelineColumns() {
    var visibility = getFunnelColumnVisibility();
    return DATA.pipelineColumns.filter(function (col) {
      return visibility[col.id] !== false;
    });
  }

  function updateFunnelColumnsSummary(mount) {
    var el = mount && qs('.funnel-columns-menu__summary', mount);
    if (!el || !DATA) return;
    var visible = getVisiblePipelineColumns().length;
    el.textContent = 'Показано ' + visible + ' из ' + DATA.pipelineColumns.length + ' этапов';
  }

  var funnelColumnsOutsideCloseBound = false;

  function initFunnelColumnsOutsideClose() {
    if (funnelColumnsOutsideCloseBound) return;
    funnelColumnsOutsideCloseBound = true;
    document.addEventListener('click', function (e) {
      var mount = qs('[data-mock-funnel-toolbar]');
      if (!mount) return;
      var menu = qs('.funnel-columns-menu', mount);
      if (!menu || !menu.hasAttribute('open')) return;
      if (menu.contains(e.target)) return;
      menu.removeAttribute('open');
    });
  }

  function renderFunnelToolbar() {
    var mount = qs('[data-mock-funnel-toolbar]');
    if (!mount || !DATA) return;

    var visibility = getFunnelColumnVisibility();
    var visibleColumns = getVisiblePipelineColumns();
    var checkboxes = DATA.pipelineColumns.map(function (col) {
      var checked = visibility[col.id] !== false;
      var hint = col.subtitle
        ? '<span class="funnel-columns-menu__hint">' + col.subtitle + '</span>'
        : '';
      return '<label class="funnel-columns-menu__item">' +
        '<input type="checkbox" data-mock-funnel-col="' + col.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="funnel-columns-menu__text">' +
        '<span class="funnel-columns-menu__name">' + col.title + '</span>' +
        hint +
        '</span></label>';
    }).join('');

    mount.innerHTML =
      buildPickMoreButton() +
      '<details class="funnel-columns-menu">' +
      '<summary class="btn btn-secondary btn-sm funnel-columns-menu__trigger">' +
      '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="14" rx="2"/>' +
      '<path d="M9 5v14"/>' +
      '<path d="M15 5v14"/>' +
      '</svg>' +
      'Колонки</summary>' +
      '<div class="funnel-columns-menu__panel" role="group" aria-label="Видимость колонок воронки">' +
      '<p class="funnel-columns-menu__summary">Показано ' + visibleColumns.length + ' из ' + DATA.pipelineColumns.length + ' этапов</p>' +
      checkboxes +
      '</div></details>';

    qsa('[data-mock-funnel-col]', mount).forEach(function (input) {
      input.addEventListener('change', function () {
        var colId = input.getAttribute('data-mock-funnel-col');
        var next = getFunnelColumnVisibility();
        var checkedCount = qsa('[data-mock-funnel-col]:checked', mount).length;
        if (!input.checked && checkedCount === 0) {
          input.checked = true;
          showToast('Должна остаться хотя бы одна колонка');
          return;
        }
        next[colId] = input.checked;
        saveFunnelColumnVisibility(next);
        renderPipeline();
        updateFunnelColumnsSummary(mount);
      });
    });

    initPickMore();
  }

  function renderFunnelView() {
    renderFunnelToolbar();
    renderPipeline();
  }

  function renderPipeline() {
    var pipeline = qs('[data-mock-pipeline-render]');
    if (!pipeline || !DATA) return;

    var byColumn = {};
    DATA.pipelineColumns.forEach(function (col) { byColumn[col.id] = []; });

    Object.keys(DATA.candidates).forEach(function (id) {
      var c = DATA.candidates[id];
      var col = c.column || 'ai';
      if (byColumn[col]) byColumn[col].push({ id: id, data: c });
    });

    var html = '';
    getVisiblePipelineColumns().forEach(function (col) {
      var items = byColumn[col.id] || [];

      html += '<div class="pipeline-col ' + col.class + '" data-pipeline-col="' + col.id + '">' +
        '<div class="pipeline-col__head">' +
        '<div class="pipeline-col__head-row">' +
        '<h3 class="pipeline-col__title hint-tooltip hint-tooltip--below" data-tooltip="' + col.title + '">' + col.title + '</h3>' +
        '<span class="count-badge">' + items.length + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="pipeline-col__body">';

      if (items.length === 0) {
        html += '<div class="pipeline-empty-state"><p>Нет кандидатов</p></div>';
      } else {
        items.forEach(function (item) {
          html += buildCandidateCardHtml(item.id, item.data);
        });
      }
      html += '</div></div>';
    });

    if (!html) {
      html = '<div class="pipeline-empty-state pipeline-empty-state--board"><p>Нет видимых колонок. Откройте «Колонки» и включите этапы.</p></div>';
    }

    pipeline.innerHTML = html;
    initFunnelCards(pipeline);
  }

  function initFunnelCards(root) {
    qsa('.candidate-card[data-candidate]', root).forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var id = card.getAttribute('data-candidate');
        qsa('.candidate-card', root).forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var data = getCandidate(id);
        if (data) openDrawer(Object.assign({}, data, { id: id }));
      });
    });
  }

  function initDrawer() {
    var overlay = qs('[data-mock-drawer-overlay]');
    var closeBtn = qs('[data-mock-drawer-close]');
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (qs('.drawer.is-open')) closeDrawer();
        var modal = qs('.modal.is-open');
        if (modal) modal.classList.remove('is-open');
      }
    });
  }

  function initPickMore() {
    qsa('[data-mock-pick-more]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('AI подбирает ещё кандидатов из банка…');
      });
    });
  }

  function initLegacyFunnel() {
    var pipeline = qs('[data-mock-pipeline]');
    if (!pipeline || qs('[data-mock-pipeline-render]')) return;

    qsa('.candidate-card[data-candidate]', pipeline).forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var id = card.getAttribute('data-candidate');
        qsa('.candidate-card', pipeline).forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var data = getCandidate(id) || legacyCandidate(id);
        if (data) openDrawer(Object.assign({ id: id }, data));
      });
    });
  }

  function legacyCandidate(id) {
    return getCandidate(id);
  }

  function renderVacancyList() {
    var list = qs('[data-mock-vacancy-list-render]');
    if (!list || !DATA) return;

    var statusMap = DATA.statusPills;
    var html = DATA.vacancies.map(function (v) {
      var pill = statusMap[v.status] || statusMap.open;
      var highlight = v.stale ? ' vacancy-card--highlight' : '';
      var urgent = v.urgent ? '<span class="badge--urgent">Срочно</span>' : '';
      var stale = v.stale ? '<span class="label-stale">Давно без движения</span>' : '';
      var timingClass = v.status === 'waiting' ? ' vacancy-card__timing--waiting' : (v.stale ? '' : ' vacancy-card__timing--muted');

      return '<article class="vacancy-card' + highlight + '" data-status="' + v.status + '" data-stale="' + v.stale + '" data-needs-response="' + (v.needsResponse ? 'true' : 'false') + '">' +
        '<div class="vacancy-card__main">' +
        '<div class="vacancy-card__title-line">' +
        '<a href="vacancy.html" class="title">' + v.title + '</a>' + stale + urgent +
        '</div>' +
        '<div class="tags">' + v.tags + ' · ' + v.client + '</div>' +
        '<div class="vacancy-card__brief"><span>Старт: ' + v.start + '</span>' +
        (v.deadline ? '<span>Профили до: ' + v.deadline + '</span>' : '') + '</div>' +
        (v.timing ? '<div class="vacancy-card__timing' + timingClass + '">' + v.timing + '</div>' : '') +
        '</div>' +
        '<div class="vacancy-card__status">' +
        '<span class="status-pill ' + pill.class + '"><span class="status-dot"></span>' + pill.text + '</span></div>' +
        '<div class="vacancy-card__actions">' +
        '<a href="vacancy.html" class="btn btn-secondary btn-sm">Воронка</a>' +
        '<a href="vacancy-card.html" class="btn btn-accent btn-sm">История</a></div></article>';
    }).join('');

    list.innerHTML = html;
    initVacancyFilters();
  }

  function initVacancyFilters() {
    var list = qs('[data-mock-vacancy-list]') || qs('[data-mock-vacancy-list-render]');
    if (!list) return;

    var cards = qsa('.vacancy-card[data-status]', list);
    var filters = { status: 'all', stale: false, sort: 'default' };

    function applyFilters() {
      var visible = cards.filter(function (card) {
        var st = card.getAttribute('data-status');
        var statusOk;
        if (filters.status === 'response-due') {
          statusOk = card.getAttribute('data-needs-response') === 'true';
        } else if (filters.status === 'all') {
          statusOk = true;
        } else if (filters.status === 'open') {
          statusOk = st === 'open' || st === 'pick';
        } else {
          statusOk = st === filters.status;
        }
        var staleOk = !filters.stale || card.getAttribute('data-stale') === 'true';
        return statusOk && staleOk;
      });

      if (filters.sort === 'stale-first') {
        visible.sort(function (a, b) {
          return (b.getAttribute('data-stale') === 'true') - (a.getAttribute('data-stale') === 'true');
        });
      }

      cards.forEach(function (card) { card.classList.add('hidden'); });
      visible.forEach(function (card) {
        card.classList.remove('hidden');
        list.appendChild(card);
      });

      var empty = qs('[data-mock-vacancy-empty]', list.parentElement);
      if (empty) empty.classList.toggle('hidden', visible.length > 0);
    }

    function setStatusFilter(status) {
      qsa('.segmented__btn[data-mock-filter-status]').forEach(function (b) {
        b.classList.remove('segmented__btn--active');
        b.setAttribute('aria-pressed', 'false');
      });

      qsa('.segmented__btn[data-mock-filter-status="' + status + '"]').forEach(function (b) {
        b.classList.add('segmented__btn--active');
        b.setAttribute('aria-pressed', 'true');
      });

      filters.status = status;
      applyFilters();
    }

    qsa('.segmented__btn[data-mock-filter-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setStatusFilter(btn.getAttribute('data-mock-filter-status'));
      });
    });

    var staleToggle = qs('[data-mock-filter-stale]');
    if (staleToggle) {
      staleToggle.addEventListener('change', function () {
        filters.stale = staleToggle.checked;
        applyFilters();
      });
    }

    var sortSelect = qs('[data-mock-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        filters.sort = sortSelect.value;
        applyFilters();
      });
    }
  }

  function initWizardForm() {
    qsa('[data-mock-wizard-form]').forEach(function (form) {
      var submit = qs('[type="submit"]', form);
      var required = qsa('[required]', form);
      function update() {
        var ok = required.every(function (el) { return el.value.trim().length > 0; });
        if (submit) submit.disabled = !ok;
      }
      required.forEach(function (el) { el.addEventListener('input', update); });
      update();
    });

    var ta = qs('[data-mock-vacancy-text]');
    var btn = qs('[data-mock-wizard-next]');
    if (ta && btn) {
      ta.addEventListener('input', function () {
        btn.disabled = ta.value.trim().length === 0;
      });
    }
  }

  function initResumeComment() {
    var resumeData = window.MOCK_RESUME_BALAKIREV;
    var beforeEl = qs('#resume-before');
    var afterEl = qs('#resume-after');
    var afterBox = qs('#resume-after-box');
    var loaderEl = qs('#resume-loader');
    var commentEl = qs('[data-resume-comment]');
    var regenBtn = qs('[data-mock-ai-regenerate]');
    var btnLabel = qs('[data-resume-btn-label]');

    if (resumeData && beforeEl && afterEl) {
      if (resumeData.meta) {
        var titleEl = qs('[data-resume-title]');
        var breadcrumbEl = qs('[data-resume-breadcrumb]');
        var chipEl = qs('[data-resume-chip]');
        var docxHintEl = qs('[data-resume-docx-hint]');
        if (titleEl) titleEl.textContent = resumeData.meta.name;
        if (breadcrumbEl) breadcrumbEl.textContent = resumeData.meta.breadcrumb;
        if (chipEl) chipEl.textContent = resumeData.meta.chip;
        if (docxHintEl) docxHintEl.textContent = resumeData.meta.docxHint;
      }
      beforeEl.innerHTML = resumeData.beforeHtml;
      afterEl.innerHTML = resumeData.afterHtml;
    }

    function setLoading(isLoading) {
      if (!afterBox || !loaderEl) return;
      afterBox.classList.toggle('diff-box--loading', isLoading);
      loaderEl.setAttribute('aria-busy', isLoading ? 'true' : 'false');
      if (afterEl) afterEl.classList.toggle('is-faded', isLoading);
      if (regenBtn) {
        regenBtn.disabled = isLoading;
        regenBtn.classList.toggle('is-loading', isLoading);
      }
      if (commentEl) commentEl.disabled = isLoading;
      if (btnLabel) {
        btnLabel.textContent = isLoading ? 'Генерация…' : 'Сгенерировать резюме';
      }
    }

    if (regenBtn && afterEl && resumeData) {
      regenBtn.addEventListener('click', function () {
        var comment = commentEl ? commentEl.value.trim() : '';
        if (!comment) {
          showToast('Введите комментарий по тексту');
          if (commentEl) commentEl.focus();
          return;
        }

        setLoading(true);

        setTimeout(function () {
          afterEl.style.opacity = '0';
          setTimeout(function () {
            afterEl.innerHTML = resumeData.afterRegeneratedHtml;
            afterEl.style.opacity = '';
            setLoading(false);
            if (commentEl) commentEl.value = '';
            showToast('Резюме обновлено с учётом замечаний');
          }, 180);
        }, 1800);
      });
    }

    var readyBtn = qs('[data-mock-mark-ready-resume]');
    if (readyBtn) {
      readyBtn.addEventListener('click', function () {
        showToast('Кандидат переведён в «Готово к отправке»');
      });
    }

    qsa('[data-mock-docx-resume]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Адаптированный DOCX скачан');
      });
    });
  }

  function initTimelineFilter(timeline) {
    var select = qs('[data-mock-timeline-select]');
    timeline = timeline || qs('[data-mock-timeline-render]');
    if (!select || !timeline) return;

    var rejectToggle = qs('[data-mock-show-rejects]');
    var showRejects = false;

    function apply() {
      var filter = select.value;
      qsa('.timeline__item', timeline).forEach(function (item) {
        var cand = item.getAttribute('data-candidate');
        var isReject = item.getAttribute('data-reject') === 'true';
        if (!showRejects && isReject) {
          item.classList.add('hidden');
          return;
        }
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          item.classList.toggle('hidden', cand !== filter && cand !== 'all');
        }
      });
    }

    select.addEventListener('change', apply);
    if (rejectToggle) {
      rejectToggle.addEventListener('change', function () {
        showRejects = rejectToggle.checked;
        apply();
      });
    }
    apply();
  }

  function timelineItemClass(ev) {
    if (ev.reject) return ' timeline__item--reject';
    if (ev.type === 'highlight') return ' timeline__item--highlight';
    if (/AI/i.test(ev.title)) return ' timeline__item--ai';
    return '';
  }

  function renderHistoryStats() {
    var el = qs('[data-mock-history-stats]');
    if (!el || !DATA || !DATA.historyStats) return;

    var stats = DATA.historyStats;
    el.innerHTML = [
      renderSendStatCard(stats.sent, 'отправлено', 'total'),
      renderSendStatCard(stats.waiting, 'ждём ответ', 'waiting'),
      renderSendStatCard(stats.reject, 'отказ', 'reject')
    ].join('');
  }

  function renderTimeline() {
    var timeline = qs('[data-mock-timeline-render]');
    if (!timeline || !DATA) return;

    var events = DATA.timelineEvents || [];
    timeline.innerHTML = events.map(function (ev) {
      return '<li class="timeline__item' + timelineItemClass(ev) + '" data-candidate="' + ev.candidate + '" data-reject="' + (ev.reject ? 'true' : 'false') + '">' +
        '<div class="timeline__track"><span class="timeline__dot" aria-hidden="true"></span></div>' +
        '<div class="timeline__content">' +
        '<time class="timeline__time" datetime="' + ev.datetime + '">' + ev.time + '</time>' +
        '<div class="timeline__body"><strong>' + ev.title + '</strong><span>' + ev.text + '</span></div>' +
        '</div></li>';
    }).join('');

    var countEl = qs('[data-mock-timeline-count]');
    if (countEl) {
      countEl.textContent = events.length + ' ' + ruPlural(events.length, 'событие', 'события', 'событий') + ' · отказы скрыты по умолчанию';
    }

    renderHistoryStats();
    initTimelineFilter(timeline);
  }

  function bankStatusLabel(status) {
    if (status === 'free') return 'Свободен';
    if (status === 'busy') return 'Занят';
    if (status === 'overload') return 'Перегруз';
    return 'Частично';
  }

  function bankStatusPillClass(status) {
    if (status === 'free') return 'status-pill--open';
    if (status === 'busy') return 'status-pill--sent';
    if (status === 'overload') return 'status-pill--reject';
    return 'status-pill--waiting';
  }

  function findBankPerson(id) {
    if (!DATA || !DATA.bankPeople) return null;
    var person = DATA.bankPeople.find(function (p) { return p.id === id; });
    if (person) return person;
    return DATA.bankPeople[0] || null;
  }

  function ruPlural(n, one, few, many) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  function renderSendStatCard(value, label, mod) {
    return '<div class="send-stat send-stat--' + mod + '">' +
      '<span class="send-stat__value">' + value + '</span>' +
      '<span class="send-stat__label">' + label + '</span>' +
      '</div>';
  }

  function sendStatusPillClass(status) {
    var map = {
      reject: 'status-pill--reject',
      waiting: 'status-pill--waiting',
      sent: 'status-pill--sent',
      interview: 'status-pill--interview'
    };
    return map[status] || 'status-pill--sent';
  }

  function parseBankWeekLoad(text) {
    if (!text || text === '—') return null;
    var match = String(text).match(/(\d+)\s*%/);
    if (match) return parseInt(match[1], 10);
    return 100;
  }

  function bankWeekLoadClass(load) {
    if (load == null) return 'bank-cell-free';
    if (load > 100) return 'bank-cell-load bank-cell-load--overload';
    if (load >= 80) return 'bank-cell-load bank-cell-load--high';
    if (load >= 50) return 'bank-cell-load bank-cell-load--moderate';
    return 'bank-cell-load bank-cell-load--partial';
  }

  function renderBankWeekCell(text) {
    if (text === '—') return '<td class="bank-cell-free">—</td>';
    var load = parseBankWeekLoad(text);
    return '<td><span class="' + bankWeekLoadClass(load) + '">' + text + '</span></td>';
  }

  function renderBankPersonPage() {
    var root = qs('[data-mock-bank-person]');
    if (!root || !DATA) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id') || 'p1';
    var person = findBankPerson(id);
    if (!person) return;

    var extras = (DATA.bankPersonExtras && DATA.bankPersonExtras[person.id]) || {};
    var facts = extras.facts || ['Профиль в банке · данные актуальны'];
    var sendHistory = extras.sendHistory || [];

    document.title = person.name + ' — банк резюме';

    var title = qs('[data-mock-bank-person-name]');
    if (title) title.textContent = person.name;

    var sub = qs('[data-mock-bank-person-sub]');
    if (sub) sub.textContent = person.group + ' · ' + person.role;

    var pill = qs('[data-mock-bank-person-status]');
    if (pill) {
      pill.className = 'status-pill ' + bankStatusPillClass(person.status);
      pill.innerHTML = '<span class="status-dot"></span>' + bankStatusLabel(person.status);
    }

    var load = qs('[data-mock-bank-person-load]');
    if (load) load.textContent = person.load + '%';

    var free = qs('[data-mock-bank-person-free]');
    if (free) free.textContent = person.freeFrom;

    var stack = qs('[data-mock-bank-person-stack]');
    if (stack) stack.textContent = person.stack;

    var factsEl = qs('[data-mock-bank-person-facts]');
    if (factsEl) {
      factsEl.innerHTML = facts.map(function (f, i) {
        var warn = f.indexOf('Не отправлялся') >= 0 || f.indexOf('провер') >= 0;
        return '<li class="' + (warn ? 'is-warn' : '') + '">' + f + '</li>';
      }).join('');
    }

    var weeksEl = qs('[data-mock-bank-person-weeks]');
    if (weeksEl && DATA.bankWeeks) {
      var head = DATA.bankWeeks.map(function (w) { return '<th>' + w.label + '</th>'; }).join('');
      var cells = person.weeks.map(renderBankWeekCell).join('');
      weeksEl.innerHTML = '<thead><tr>' + head + '</tr></thead><tbody><tr>' + cells + '</tr></tbody>';
    }

    var sendEl = qs('[data-mock-bank-person-sends]');
    var sendSummaryEl = qs('[data-mock-bank-person-send-summary]');
    if (sendEl) {
      if (!sendHistory.length) {
        sendEl.innerHTML = '<tr><td colspan="6" class="bank-person-send-empty">Отправок в presale-mock нет</td></tr>';
      } else {
        sendEl.innerHTML = sendHistory.map(function (s) {
          var vacancy = s.vacancy || '—';
          var client = s.client || '—';
          var status = s.status || 'sent';
          var statusLabel = s.statusLabel || s.result || '—';
          var detail = s.detail || (s.result && s.result.indexOf('·') >= 0 ? s.result.split('·').slice(1).join('·').trim() : '');
          var match = s.match || '—';
          return '<tr>' +
            '<td><time datetime="' + s.date + '">' + s.date + '</time></td>' +
            '<td><strong>' + vacancy + '</strong></td>' +
            '<td>' + client + '</td>' +
            '<td class="bank-person-send-match">' + match + '</td>' +
            '<td><span class="status-pill status-pill--compact ' + sendStatusPillClass(status) + '"><span class="status-dot"></span>' + statusLabel + '</span></td>' +
            '<td class="bank-person-send-detail">' + (detail || '—') + '</td>' +
            '</tr>';
        }).join('');
      }
    }

    if (sendSummaryEl && sendHistory.length) {
      var total = sendHistory.length;
      var waiting = sendHistory.filter(function (s) { return s.status === 'waiting'; }).length;
      var rejects = sendHistory.filter(function (s) { return s.status === 'reject'; }).length;
      var interviews = sendHistory.filter(function (s) { return s.status === 'interview'; }).length;
      var cards = [renderSendStatCard(total, ruPlural(total, 'отправка', 'отправки', 'отправок'), 'total')];
      if (waiting) {
        cards.push(renderSendStatCard(waiting, ruPlural(waiting, 'ожидает ответа', 'ожидают ответа', 'ожидают ответа'), 'waiting'));
      }
      if (rejects) {
        cards.push(renderSendStatCard(rejects, ruPlural(rejects, 'отказ', 'отказа', 'отказов'), 'reject'));
      }
      if (interviews) {
        cards.push(renderSendStatCard(interviews, ruPlural(interviews, 'интервью', 'интервью', 'интервью'), 'interview'));
      }
      sendSummaryEl.innerHTML = cards.join('');
    } else if (sendSummaryEl) {
      sendSummaryEl.innerHTML = '<div class="send-stat send-stat--empty"><span class="send-stat__label">Отправок пока нет</span></div>';
    }
  }

  function renderBankKpi() {
    var row = qs('[data-mock-bank-kpi-row]');
    if (!row || !DATA || !DATA.bankKpi) return;
    var k = DATA.bankKpi;
    qsa('[data-mock-bank-kpi]', row).forEach(function (el) {
      var key = el.getAttribute('data-mock-bank-kpi');
      if (k[key] != null) el.textContent = String(k[key]);
    });
  }

  function renderDashboardMetrics() {
    if (!DATA || !DATA.kpi) return;
    var k = DATA.kpi;

    qsa('[data-mock-kpi]').forEach(function (el) {
      var key = el.getAttribute('data-mock-kpi');
      if (k[key] != null) el.textContent = String(k[key]);
    });

    var waitingHint = qs('[data-mock-kpi-hint="waiting"]');
    if (waitingHint && k.waitingVacancies != null && k.waitingCandidates != null) {
      waitingHint.textContent =
        ruPlural(k.waitingVacancies, 'вакансия', 'вакансии', 'вакансий') +
        ' · ' +
        ruPlural(k.waitingCandidates, 'кандидат', 'кандидата', 'кандидатов');
    }

    qsa('[data-mock-plan-count]').forEach(function (el) {
      var key = el.getAttribute('data-mock-plan-count');
      if (key === 'review' && k.reviewResumes != null) el.textContent = String(k.reviewResumes);
      if (key === 'response-due' && k.responsesDue != null) el.textContent = String(k.responsesDue);
    });

    var planSubtitle = qs('[data-mock-plan-subtitle]');
    if (planSubtitle && k.queueToday != null) {
      planSubtitle.textContent = ruPlural(k.queueToday, 'задача', 'задачи', 'задач') + ' до конца дня';
    }

    if (DATA.planNav) {
      qsa('[data-mock-plan-link]').forEach(function (el) {
        var key = el.getAttribute('data-mock-plan-link');
        if (DATA.planNav[key]) el.setAttribute('href', DATA.planNav[key]);
      });
    }
  }

  function initPlanDeepLink() {
    var params = new URLSearchParams(window.location.search);
    var col = params.get('col');

    if (col && qs('[data-mock-pipeline-render]')) {
      var colEl = qs('[data-pipeline-col="' + col + '"]');
      if (colEl) {
        colEl.classList.add('pipeline-col--plan-focus');
        requestAnimationFrame(function () {
          colEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        var firstCard = qs('.candidate-card[data-candidate]', colEl);
        if (firstCard) {
          window.setTimeout(function () { firstCard.click(); }, 450);
        }
      }
    }
  }

  function renderBankCalendar() {
    var tbody = qs('[data-mock-bank-calendar-body]');
    if (!tbody || !DATA) return;

    var groups = {};
    DATA.bankPeople.forEach(function (p) {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    });

    var html = '';
    Object.keys(groups).forEach(function (group) {
      html += '<tr class="bank-group-row"><td colspan="' + (6 + DATA.bankWeeks.length) + '">' + group + '</td></tr>';
      groups[group].forEach(function (p) {
        var overload = p.load > 100 ? ' is-overload' : '';
        var weeks = p.weeks.map(renderBankWeekCell).join('');
        html += '<tr data-bank-id="' + p.id + '" data-bank-status="' + p.status + '" data-bank-name="' + p.name.toLowerCase() + '">' +
          '<td>' + p.name + '</td>' +
          '<td>' + p.role + '</td>' +
          '<td class="bank-load' + overload + '">' + p.load + '%</td>' +
          '<td>' + p.freeFrom + '</td>' +
          '<td>' + p.stack + '</td>' +
          weeks + '</tr>';
      });
    });
    tbody.innerHTML = html;
    initBankFilters();
  }

  function renderBankList() {
    var tbody = qs('[data-mock-bank-list-body]');
    if (!tbody || !DATA) return;

    tbody.innerHTML = DATA.bankPeople.map(function (p) {
      return '<tr data-bank-id="' + p.id + '" data-bank-status="' + p.status + '" data-bank-name="' + p.name.toLowerCase() + '">' +
        '<td><strong>' + p.name + '</strong><br><span style="color:var(--text-muted);font-size:12px">' + p.group + '</span></td>' +
        '<td>' + p.role + '</td>' +
        '<td>' + p.stack + '</td>' +
        '<td>' + p.load + '%</td>' +
        '<td>' + p.freeFrom + '</td>' +
        '<td>' + bankStatusLabel(p.status) + '</td>' +
        '<td><a href="resume-bank-person.html?id=' + p.id + '" class="btn btn-secondary btn-xs">Карточка</a></td></tr>';
    }).join('');
    initBankFilters();
  }

  function initBankFilters() {
    var segment = qs('[data-mock-bank-segment]');
    var search = qs('[data-mock-bank-search]');
    var rows = qsa('[data-bank-status]');

    function apply() {
      var status = segment ? segment.querySelector('.segmented__btn--active') : null;
      var filter = status ? status.getAttribute('data-bank-filter') : 'all';
      var q = search ? search.value.trim().toLowerCase() : '';
      rows.forEach(function (row) {
        var st = row.getAttribute('data-bank-status');
        var name = row.getAttribute('data-bank-name') || '';
        var statusOk = filter === 'all' || st === filter ||
          (filter === 'free' && (st === 'free' || st === 'partial')) ||
          (filter === 'busy' && (st === 'busy' || st === 'overload' || st === 'partial'));
        var searchOk = !q || name.indexOf(q) >= 0;
        row.classList.toggle('hidden', !(statusOk && searchOk));
      });
    }

    if (segment) {
      qsa('[data-bank-filter]', segment).forEach(function (btn) {
        btn.addEventListener('click', function () {
          qsa('[data-bank-filter]', segment).forEach(function (b) {
            b.classList.remove('segmented__btn--active');
          });
          btn.classList.add('segmented__btn--active');
          apply();
        });
      });
    }
    if (search) search.addEventListener('input', apply);
  }

  function initModals() {
    qsa('[data-mock-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-mock-open'));
        if (modal) {
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
        }
      });
    });
    qsa('[data-mock-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        var modal = el.closest('.modal');
        if (modal) {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!DATA) {
      console.warn('mock-data.js not loaded');
      return;
    }
    initDrawer();
    initFunnelColumnsOutsideClose();
    renderVacancyList();
    renderDashboardMetrics();
    if (qs('[data-mock-pipeline-render]')) renderFunnelView();
    else renderPipeline();
    renderTimeline();
    initPlanDeepLink();
    renderBankKpi();
    renderBankCalendar();
    renderBankList();
    renderBankPersonPage();
    initLegacyFunnel();
    if (!qs('[data-mock-vacancy-list-render]')) initVacancyFilters();
    initWizardForm();
    initResumeComment();
    initModals();

    if (document.body.classList.contains('drawer--open')) {
      var sid = DATA.candidates.sidorov;
      if (sid) {
        renderDrawerContent(Object.assign({ id: 'sidorov' }, sid));
        var card = qs('[data-candidate="sidorov"]');
        if (card) card.classList.add('selected');
      }
    }
  });
})();
