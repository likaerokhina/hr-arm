(function () {
  'use strict';

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
      setTimeout(function () {
        toast.remove();
      }, 200);
    }, 3200);
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var focusable = modal.querySelector('input, textarea, button, [href]');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!qs('.modal.is-open')) {
      document.body.classList.remove('modal-open');
    }
  }

  function initModals() {
    qsa('[data-mock-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-mock-open'));
      });
    });

    qsa('[data-mock-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeModal(el.closest('.modal'));
      });
    });

    qsa('.modal__overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function () {
        closeModal(overlay.closest('.modal'));
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var open = qs('.modal.is-open');
        if (open) closeModal(open);
      }
    });
  }

  function initVacancyFilters() {
    var list = qs('[data-mock-vacancy-list]');
    if (!list) return;

    var cards = qsa('.vacancy-card[data-status]', list);
    var filters = { status: 'all', stale: false, sort: 'default' };

    function applyFilters() {
      var visible = cards.filter(function (card) {
        var statusOk = filters.status === 'all' || card.getAttribute('data-status') === filters.status;
        var staleOk = !filters.stale || card.getAttribute('data-stale') === 'true';
        return statusOk && staleOk;
      });

      if (filters.sort === 'stale-first') {
        visible.sort(function (a, b) {
          return (b.getAttribute('data-stale') === 'true') - (a.getAttribute('data-stale') === 'true');
        });
      }

      cards.forEach(function (card) {
        card.classList.add('hidden');
      });
      visible.forEach(function (card) {
        card.classList.remove('hidden');
        list.appendChild(card);
      });

      var empty = qs('[data-mock-vacancy-empty]', list.parentElement);
      if (empty) {
        empty.classList.toggle('hidden', visible.length > 0);
      }
    }

    qsa('[data-mock-filter-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qsa('[data-mock-filter-status]').forEach(function (b) {
          b.classList.remove('segmented__btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('segmented__btn--active');
        btn.setAttribute('aria-pressed', 'true');
        filters.status = btn.getAttribute('data-mock-filter-status');
        applyFilters();
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

  function initNewVacancyModal() {
    var form = qs('[data-mock-new-vacancy-form]');
    if (!form) return;

    var textarea = qs('textarea', form);
    var submit = qs('[data-mock-new-vacancy-submit]', form);
    var success = qs('[data-mock-new-vacancy-success]');
    var progressTimer = null;

    function resetAiProgress() {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      var progress = qs('[data-mock-ai-progress]');
      if (!progress) return;
      qsa('.ai-progress__step', progress).forEach(function (step, idx) {
        step.classList.remove('ai-progress__step--done');
        step.classList.toggle('ai-progress__step--active', idx === 0);
      });
    }

    function startAiProgress() {
      resetAiProgress();
      var progress = qs('[data-mock-ai-progress]');
      if (!progress) return;
      var steps = qsa('.ai-progress__step', progress);
      var index = 0;

      progressTimer = setInterval(function () {
        steps[index].classList.remove('ai-progress__step--active');
        steps[index].classList.add('ai-progress__step--done');
        index += 1;
        if (index < steps.length) {
          steps[index].classList.add('ai-progress__step--active');
        } else {
          clearInterval(progressTimer);
          progressTimer = null;
        }
      }, 1600);
    }

    function updateSubmit() {
      var hasText = textarea && textarea.value.trim().length > 0;
      submit.disabled = !hasText;
    }

    if (textarea) {
      textarea.addEventListener('input', updateSubmit);
      updateSubmit();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submit.disabled) return;
      form.classList.add('hidden');
      if (success) success.classList.remove('hidden');
      startAiProgress();
      showToast('AI запускает подбор из банка…');
    });

    var modal = qs('#new-vacancy-modal');
    if (modal) {
      qsa('[data-mock-close]', modal).forEach(function (btn) {
        btn.addEventListener('click', resetAiProgress);
      });
    }
  }

  var CANDIDATES = {
    ivanov: {
      initials: 'АИ',
      avatar: 'avatar--blue',
      name: 'Иванов Алексей',
      short: 'Иванов А.С.',
      role: 'DevOps Engineer · 5 лет',
      score: 87,
      reasons: ['Kubernetes — 4 года', 'FinTech в стеке', 'CI/CD, Ansible'],
      availability: 'На скамье с 18.05',
      english: 'B2 · подтверждён 3 мес. назад',
      feedback: 'СберTech: надёжный инженер, 2024',
      readiness: 'pending',
      stage: 'ai',
      actions: ['review', 'reject']
    },
    petrov: {
      initials: 'КП',
      avatar: 'avatar--violet',
      name: 'Петров Константин',
      short: 'Петров К.В.',
      role: 'SRE · 4 года',
      score: 72,
      reasons: ['Kubernetes — 2 года', 'Terraform в проектах'],
      availability: 'Занят до 01.06',
      english: 'B1 · не подтверждался 9 мес.',
      englishWarn: true,
      feedback: '—',
      readiness: 'pending',
      stage: 'blocked',
      blocked: true,
      actions: ['unblock']
    },
    sidorov: {
      initials: 'МС',
      avatar: 'avatar--teal',
      name: 'Сидоров Михаил',
      short: 'Сидоров М.И.',
      role: 'DevOps / SRE · 6 лет',
      score: 91,
      reasons: ['Kubernetes — 4 года', 'FinTech в стеке', 'CI/CD, Terraform'],
      availability: 'На скамье с 18.05',
      english: 'B2 · подтверждён 3 мес. назад',
      feedback: 'СберTech: сильный DevOps, 2025',
      readiness: 'pending',
      stage: 'review',
      actions: ['resume', 'readiness', 'reject']
    },
    novikov: {
      initials: 'ПН',
      avatar: 'avatar--rose',
      name: 'Новиков Павел',
      short: 'Новиков П.Е.',
      role: 'DevOps · 5 лет',
      score: 88,
      reasons: ['Kubernetes, Helm', 'FinTech опыт'],
      availability: 'На рассмотрении у заказчика',
      english: 'B2 · подтверждён',
      feedback: 'Тинькофф: хорошая коммуникация',
      readiness: 'confirmed',
      stage: 'sent',
      actions: ['history']
    },
    kozlov: {
      initials: 'ДК',
      avatar: 'avatar--amber',
      name: 'Козлов Дмитрий',
      short: 'Козлов Д.А.',
      role: 'DevOps · 3 года',
      score: 0,
      reasons: [],
      availability: 'На скамье',
      english: 'B1',
      feedback: '—',
      readiness: 'confirmed',
      stage: 'sent-reject',
      actions: ['history']
    },
    smirnov: {
      initials: 'СЕ',
      avatar: 'avatar--amber',
      name: 'Смирнов Евгений',
      short: 'Смирнов Е.В.',
      role: 'DevOps · 4 года',
      score: 65,
      reasons: ['Kubernetes базово'],
      availability: 'На скамье',
      english: 'B1',
      feedback: '—',
      readiness: 'pending',
      stage: 'blocked',
      blocked: true,
      actions: []
    }
  };

  function renderDetailPanel(data) {
    var panel = qs('[data-mock-detail-panel]');
    if (!panel || !data) return;

    var readinessHtml = data.readiness === 'confirmed'
      ? '<span class="badge badge--success">Согласован 20.05</span>'
      : '<span class="badge badge--warning" data-mock-readiness-badge>Не проверена</span>';

    var englishClass = data.englishWarn ? ' context-row--warn' : '';

    var actionsHtml = '';
    if (data.actions.indexOf('resume') >= 0) {
      actionsHtml += '<a href="resume.html" class="btn btn-primary">Проверить резюме</a>';
    }
    if (data.actions.indexOf('readiness') >= 0) {
      actionsHtml += '<button type="button" class="btn btn-secondary" data-mock-mark-ready>Отметить готовность</button>';
    }
    if (data.actions.indexOf('review') >= 0) {
      actionsHtml += '<button type="button" class="btn btn-primary" data-mock-take-review>Взять на проверку</button>';
    }
    if (data.actions.indexOf('unblock') >= 0) {
      actionsHtml += '<button type="button" class="btn btn-secondary" data-mock-unblock>Снять блок</button>';
    }
    if (data.actions.indexOf('reject') >= 0) {
      actionsHtml += '<button type="button" class="btn btn-danger" data-mock-reject-candidate>Отказать</button>';
    }
    if (data.actions.indexOf('history') >= 0) {
      actionsHtml += '<a href="vacancy-card.html" class="btn btn-secondary">Статусы →</a>';
    }
    actionsHtml += '<a href="#" class="btn btn-secondary" data-mock-docx>Скачать DOCX</a>';

    var scoreBlock = data.score > 0
      ? '<div class="score-block">' +
        '<span class="badge badge-ai"><svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>AI-подбор</span>' +
        '<div class="score-block__top">' +
        '<div class="score-ring" style="--score: ' + data.score + '"><span>' + data.score + '%</span></div>' +
        '<ul>' + data.reasons.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' +
        '</div></div>'
      : '<p class="detail-note">Отказ заказчика · не подошёл стек</p>';

    panel.innerHTML =
      '<div class="detail-header">' +
      '<div class="avatar avatar--lg ' + data.avatar + '">' + data.initials + '</div>' +
      '<div><h2>' + data.name + '</h2><div class="role">' + data.role + '</div></div>' +
      '</div>' +
      scoreBlock +
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
      '<ul class="mini-activity__list">' +
      '<li><time>10:43</time><span>AI подобрал кандидата</span></li>' +
      '<li><time>11:15</time><span>На проверке — открыли «было → стало»</span></li>' +
      '</ul></div>' +
      '<p class="detail-note">Резюме адаптировано под вакансию.</p>' +
      '<div class="actions" data-mock-detail-actions data-candidate-id="' + (data.id || '') + '">' + actionsHtml + '</div>';

    bindDetailActions(panel, data);
  }

  function bindDetailActions(panel, data) {
    var readyBtn = qs('[data-mock-mark-ready]', panel);
    if (readyBtn) {
      readyBtn.addEventListener('click', function () {
        var cell = qs('[data-mock-readiness-cell]', panel);
        if (cell) {
          cell.innerHTML = '<span class="badge badge--success">Согласован 20.05</span>';
        }
        readyBtn.remove();
        showToast('Готовность сотрудника отмечена');
      });
    }

    var unblockBtn = qs('[data-mock-unblock]', panel);
    if (unblockBtn) {
      unblockBtn.addEventListener('click', function () {
        var card = qs('.candidate-card[data-candidate="petrov"]');
        if (card) {
          card.classList.remove('candidate-card--blocked');
          var tag = qs('.candidate-card__corner-tag', card);
          if (tag) tag.remove();
        }
        showToast('Блок снят — кандидат доступен');
        data.blocked = false;
        data.actions = ['review', 'reject'];
        renderDetailPanel(Object.assign({ id: 'petrov' }, data));
      });
    }

    var rejectBtn = qs('[data-mock-reject-candidate]', panel);
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        showToast('Отказ зафиксирован: не подошёл стек');
      });
    }

    var takeBtn = qs('[data-mock-take-review]', panel);
    if (takeBtn) {
      takeBtn.addEventListener('click', function () {
        showToast('Кандидат переведён на проверку');
      });
    }

    var docxBtn = qs('[data-mock-docx]', panel);
    if (docxBtn) {
      docxBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('DOCX скачан');
      });
    }
  }

  function initDocxButtons() {
    qsa('[data-mock-docx]').forEach(function (btn) {
      if (btn.closest('[data-mock-detail-panel]')) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('DOCX скачан');
      });
    });
  }

  function initFunnel() {
    var pipeline = qs('[data-mock-pipeline]');
    if (!pipeline) return;

    qsa('.candidate-card[data-candidate]', pipeline).forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var id = card.getAttribute('data-candidate');
        qsa('.candidate-card', pipeline).forEach(function (c) {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        var data = CANDIDATES[id];
        if (data) {
          renderDetailPanel(Object.assign({ id: id }, data));
        }
      });
    });

    var defaultId = qs('.candidate-card.selected[data-candidate]', pipeline);
    if (defaultId) {
      var id = defaultId.getAttribute('data-candidate');
      renderDetailPanel(Object.assign({ id: id }, CANDIDATES[id]));
    }
  }

  function initChecklist() {
    var bar = qs('[data-mock-checklist]');
    var sendBtn = qs('[data-mock-send-btn]');
    if (!bar || !sendBtn) return;

    function updateSend() {
      var required = qsa('[data-mock-check-item][data-required="true"]', bar);
      var allChecked = required.every(function (item) {
        return qs('input', item).checked;
      });
      sendBtn.classList.toggle('btn--disabled', !allChecked);
      sendBtn.setAttribute('aria-disabled', allChecked ? 'false' : 'true');
      if (allChecked) {
        sendBtn.removeAttribute('tabindex');
      } else {
        sendBtn.setAttribute('tabindex', '-1');
      }
    }

    qsa('[data-mock-check-item] input', bar).forEach(function (input) {
      input.addEventListener('change', updateSend);
    });

    sendBtn.addEventListener('click', function (e) {
      if (sendBtn.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        showToast('Отметьте обязательные пункты чеклиста');
      }
    });

    updateSend();
  }

  function initResumeEdit() {
    var editBtn = qs('[data-mock-edit-resume]');
    var diffAfter = qs('[data-mock-diff-after]');
    if (!editBtn || !diffAfter) return;

    var textarea = qs('[data-mock-diff-textarea]');
    editBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var editing = diffAfter.classList.toggle('is-editing');
      editBtn.textContent = editing ? 'Готово' : 'Править';
      if (editing && textarea) textarea.focus();
    });
  }

  function initVersionTabs() {
    var tabs = qs('[data-mock-version-tabs]');
    if (!tabs) return;

    qsa('[data-mock-version-tab]', tabs).forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var version = tab.getAttribute('data-mock-version-tab');
        qsa('[data-mock-version-tab]', tabs).forEach(function (t) {
          t.classList.remove('active');
        });
        tab.classList.add('active');
        qsa('[data-mock-diff-version]').forEach(function (block) {
          block.classList.toggle('hidden', block.getAttribute('data-mock-diff-version') !== version);
        });
        var hint = qs('[data-mock-version-hint]');
        if (hint) {
          hint.textContent = version === 'v2'
            ? 'v2 — после фидбека: не хватило FinTech-опыта'
            : 'v1 — первичная адаптация AI';
        }
      });
    });
  }

  function initRejectModal() {
    var form = qs('[data-mock-reject-form]');
    if (!form) return;

    qsa('[data-mock-open-reject]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.sent-card');
        if (card) {
          form.setAttribute('data-target-card-id', card.id || 'novikov');
        }
        openModal('reject-modal');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = qs('input[name="reject-type"]:checked', form);
      var reason = qs('[name="reject-reason"]', form);
      var date = qs('[name="reject-date"]', form);
      if (!type || !reason || !reason.value.trim()) {
        showToast('Укажите тип и причину отказа');
        return;
      }

      var card = document.getElementById('novikov') || qs('.sent-card--active');
      if (card) {
        var pill = qs('.status-pill', card);
        if (pill) {
          pill.className = 'status-pill status-pill--reject';
          pill.innerHTML = '<span class="status-dot"></span>Отказ';
        }
        var note = qs('.sent-card__note', card);
        if (note) note.classList.add('hidden');
        var existing = qs('.sent-card__reject-detail', card);
        if (!existing) {
          existing = document.createElement('p');
          existing.className = 'sent-card__reject-detail';
          card.appendChild(existing);
        }
        existing.textContent = type.value + ' · ' + (date.value || 'сегодня') + ' · ' + reason.value.trim();
        existing.classList.remove('hidden');
        var actions = qs('.sent-card__actions', card);
        if (actions) actions.classList.add('hidden');
      }

      var timeline = qs('[data-mock-timeline]');
      if (timeline) {
        var item = document.createElement('li');
        item.className = 'timeline__item timeline__item--highlight';
        item.setAttribute('data-candidate', 'novikov');
        var now = new Date();
        var timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        item.innerHTML =
          '<div class="timeline__track"><span class="timeline__dot" aria-hidden="true"></span></div>' +
          '<div class="timeline__content">' +
          '<time class="timeline__time">' + timeStr + '</time>' +
          '<div class="timeline__body"><strong>Отказ</strong>' +
          '<span>Новиков П. · ' + reason.value.trim() + '</span></div></div>';
        timeline.insertBefore(item, timeline.firstChild);
      }

      closeModal(qs('#reject-modal'));
      form.reset();
      var today = new Date().toISOString().slice(0, 10);
      var dateInput = qs('[name="reject-date"]', form);
      if (dateInput) dateInput.value = today;
      showToast('Отказ сохранён');
    });
  }

  function initInterviewBtn() {
    qsa('[data-mock-interview]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.sent-card');
        if (!card) return;
        var pill = qs('.status-pill', card);
        if (pill) {
          pill.className = 'status-pill status-pill--interview';
          pill.innerHTML = '<span class="status-dot"></span>Интервью';
        }
        var note = qs('.sent-card__note', card);
        if (note) {
          note.innerHTML = 'Заказчик назначил интервью.';
        }
        showToast('Статус: интервью');
      });
    });
  }

  function initTimelineFilter() {
    var bar = qs('[data-mock-timeline-filter]');
    var timeline = qs('[data-mock-timeline]');
    if (!bar || !timeline) return;

    qsa('[data-mock-timeline-chip]', bar).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.getAttribute('data-mock-timeline-chip');
        qsa('[data-mock-timeline-chip]', bar).forEach(function (c) {
          c.classList.remove('chip--active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('chip--active');
        chip.setAttribute('aria-pressed', 'true');
        qsa('.timeline__item', timeline).forEach(function (item) {
          var cand = item.getAttribute('data-candidate');
          if (filter === 'all') {
            item.classList.remove('hidden');
          } else {
            item.classList.toggle('hidden', cand !== filter);
          }
        });
      });
    });
  }

  function initResubmit() {
    qsa('[data-mock-resubmit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast('Создайте v2 на экране резюме');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initModals();
    initVacancyFilters();
    initNewVacancyModal();
    initFunnel();
    initChecklist();
    initResumeEdit();
    initVersionTabs();
    initRejectModal();
    initInterviewBtn();
    initTimelineFilter();
    initResubmit();
    initDocxButtons();

    var dateInput = qs('[name="reject-date"]');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }
  });
})();
