/* eslint-disable no-unused-vars */
(function (global) {
  'use strict';

  var MOCK_DATA = {
    vacancies: [
      { id: 'devops', title: 'DevOps Engineer', client: 'СберTech', tags: 'FinTech, Kubernetes', status: 'review', stale: true, urgent: true, start: 'ASAP', deadline: '24.05', meta: '5 подобрано · 3 на проверке · 2 отправлено · 1 отказ', timing: '3 дн. в статусе · 2 дн. без изменений' },
      { id: 'java', title: 'Senior Java Developer', client: 'Альфа-Банк', tags: 'Spring, микросервисы', status: 'pick', stale: false, needsResponse: true, start: 'через 2 нед.', deadline: '28.05', meta: '2 ответа · проставить статус', timing: 'Ответ заказчика · не внесён' },
      { id: 'qa', title: 'QA Automation', client: 'Тинькофф', tags: 'Python, Selenium', status: 'waiting', stale: true, needsResponse: true, start: 'гибко', meta: '2 отправлено · ответ в почте', timing: 'Ответ заказчика · не внесён' },
      { id: 'analyst', title: 'System Analyst', client: 'Газпромнефть', tags: 'BPMN, SQL', status: 'waiting', stale: false, start: 'через месяц', meta: '3 отправлено · ждём ответ', timing: 'Ждём ответ 1 дн.' },
      { id: 'frontend', title: 'Senior Frontend', client: 'VK Tech', tags: 'React, TypeScript', status: 'review', stale: false, start: 'ASAP', deadline: '22.05', meta: '6 подобрано · 2 на проверке', timing: '1 дн. в статусе' },
      { id: 'data', title: 'Data Engineer', client: 'X5 Tech', tags: 'Spark, Airflow', status: 'waiting', stale: false, start: '01.06', meta: '1 отправлено · ждём ответ', timing: 'Ждём ответ 3 дн.' },
      { id: 'pm', title: 'Project Manager', client: 'Ростелеком', tags: 'Agile, Jira', status: 'waiting', stale: false, needsResponse: true, start: 'гибко', meta: '1 отправлено · ответ в почте', timing: 'Ответ заказчика · не внесён' },
      { id: 'go', title: 'Go Developer', client: 'Ozon', tags: 'Go, Kafka', status: 'open', stale: false, start: 'ASAP', meta: 'новая · AI запускается', timing: 'только создана' },
      { id: 'ba', title: 'Business Analyst', client: 'МТС', tags: 'UML, SQL', status: 'review', stale: true, start: '15.06', meta: '4 подобрано · 1 отказ', timing: '4 дн. без движения' },
      { id: 'sec', title: 'Security Engineer', client: 'СберTech', tags: 'SIEM, SOC', status: 'pick', stale: false, start: 'ASAP', meta: '2 подобрано', timing: '1 дн. в статусе' }
    ],

    kpi: {
      open: 10,
      sentToday: 2,
      waitingVacancies: 4,
      waitingCandidates: 6,
      reviewResumes: 8,
      responsesDue: 3,
      queueToday: 11
    },

    planNav: {
      review: 'vacancy.html?col=review',
      responseDue: 'vacancy.html?col=sent'
    },

    statusLabels: {
      all: 'Все',
      open: 'Подбор',
      pick: 'Подбор',
      review: 'На проверке',
      waiting: 'Ждём ответа'
    },

    statusPills: {
      open: { class: 'status-pill--open', text: 'Подбор' },
      pick: { class: 'status-pill--open', text: 'Подбор' },
      review: { class: 'status-pill--review', text: 'На проверке' },
      waiting: { class: 'status-pill--sent', text: 'Ждём ответа' }
    },

    candidates: {
      ivanov: {
        id: 'ivanov', initials: 'АИ', avatar: 'avatar--blue', name: 'Иванов Алексей', short: 'Иванов А.С.',
        role: 'DevOps Engineer · 5 лет', score: 87, matchHint: '9 из 12 требований',
        reasons: ['Kubernetes — 4 года', 'FinTech в стеке', 'CI/CD, Ansible'],
        availability: 'На скамье с 18.05', english: 'B2 · подтверждён 3 мес. назад', feedback: 'СберTech: надёжный инженер, 2024',
        readiness: 'pending', stage: 'ai', column: 'ai',
        cornerTag: { type: 'warning', text: 'На другой позиции' },
        actions: ['review', 'reject', 'original'],
        statusNote: 'AI подобрал · адаптации нет',
        activity: [{ time: '10:43', text: 'AI подобрал кандидата' }]
      },
      petrov: {
        id: 'petrov', initials: 'КП', avatar: 'avatar--violet', name: 'Петров Константин', short: 'Петров К.В.',
        role: 'SRE · 4 года', score: 72, matchHint: '7 из 12 требований',
        reasons: ['Kubernetes — 2 года', 'Terraform в проектах'],
        availability: 'Занят до 01.06', english: 'B1 · не подтверждался 9 мес.', englishWarn: true, feedback: '—',
        readiness: 'pending', stage: 'blocked', column: 'ai', blocked: true,
        cornerTag: { type: 'busy', text: 'Занят до 01.06' },
        actions: ['unblock'],
        statusNote: 'Заблокирован — занят на проекте',
        activity: [{ time: '10:44', text: 'AI подобрал · блок «занят»' }]
      },
      smirnov: {
        id: 'smirnov', initials: 'СЕ', avatar: 'avatar--amber', name: 'Смирнов Евгений', short: 'Смирнов Е.В.',
        role: 'DevOps · 4 года', score: 65, matchHint: '6 из 12 требований',
        reasons: ['Kubernetes базово', 'Terraform'],
        availability: 'На скамье', english: 'B1', feedback: '—',
        readiness: 'pending', stage: 'blocked', column: 'ai', blocked: true,
        cornerTag: { type: 'sent-before', text: 'Уже отправляли · 12.05' },
        actions: [],
        statusNote: 'Заблокирован — уже отправляли заказчику',
        activity: [{ time: '10:44', text: 'Предупреждение: повторная отправка' }]
      },
      volkov: {
        id: 'volkov', initials: 'ДВ', avatar: 'avatar--teal', name: 'Волков Дмитрий', short: 'Волков Д.С.',
        role: 'DevOps · 6 лет', score: 84, matchHint: '8 из 12 требований',
        reasons: ['K8s + Helm', 'FinTech', 'GitOps'],
        availability: 'Свободен с 25.05', english: 'B2', feedback: 'Альфа: сильный CI/CD',
        readiness: 'pending', stage: 'ai', column: 'ai',
        actions: ['review', 'reject', 'original'],
        statusNote: 'AI подобрал · адаптации нет',
        activity: [{ time: '10:45', text: 'AI подобрал кандидата' }]
      },
      sidorov: {
        id: 'sidorov', initials: 'МС', avatar: 'avatar--teal', name: 'Сидоров Михаил', short: 'Сидоров М.И.',
        role: 'DevOps / SRE · 6 лет', score: 91, matchHint: '11 из 12 требований',
        reasons: ['Kubernetes — 4 года', 'FinTech в стеке', 'CI/CD, Terraform'],
        availability: 'На скамье с 18.05', english: 'B2 · подтверждён 3 мес. назад', feedback: 'СберTech: сильный DevOps, 2025',
        readiness: 'pending', stage: 'review', column: 'review',
        cornerTag: { type: 'warning', text: 'FinTech (2× отказ)' },
        stageTime: '5 дн. на стадии',
        actions: ['resume', 'reject', 'original'],
        statusNote: 'Ждёт проверки на экране «было → стало»',
        activity: [
          { time: '10:43', text: 'AI подобрал кандидата' },
          { time: '11:15', text: 'Взяли на проверку' }
        ]
      },
      lebedev: {
        id: 'lebedev', initials: 'АЛ', avatar: 'avatar--blue', name: 'Лебедев Алексей', short: 'Лебедев А.В.',
        role: 'SRE · 5 лет', score: 89, matchHint: '10 из 12 требований',
        reasons: ['Terraform', 'FinTech', 'Monitoring'],
        availability: 'На скамье', english: 'B2', feedback: '—',
        readiness: 'pending', stage: 'review', column: 'review',
        stageTime: '1 дн. на стадии',
        actions: ['resume', 'reject', 'original'],
        statusNote: 'Ждёт проверки на экране «было → стало»',
        activity: [{ time: '09:20', text: 'Взяли на проверку' }]
      },
      morozov: {
        id: 'morozov', initials: 'ИМ', avatar: 'avatar--violet', name: 'Морозов Иван', short: 'Морозов И.П.',
        role: 'DevOps · 7 лет', score: 93, matchHint: '12 из 12 требований',
        reasons: ['K8s, Helm', 'PCI DSS', 'IaC'],
        availability: 'На скамье', english: 'C1', feedback: 'Тинькофф: топ-кандидат',
        readiness: 'confirmed', stage: 'ready', column: 'ready',
        actions: ['send', 'docx', 'return-review'],
        statusNote: 'DOCX готов к отправке',
        activity: [
          { time: '11:20', text: 'DOCX утверждён' },
          { time: '11:15', text: 'Проверка «было → стало» завершена' }
        ]
      },
      novikov: {
        id: 'novikov', initials: 'ПН', avatar: 'avatar--rose', name: 'Новиков Павел', short: 'Новиков П.Е.',
        role: 'DevOps · 5 лет', score: 88, matchHint: '9 из 12 требований',
        reasons: ['Kubernetes, Helm', 'FinTech опыт'],
        availability: 'На рассмотрении у заказчика', english: 'B2 · подтверждён', feedback: 'Тинькофф: хорошая коммуникация',
        readiness: 'confirmed', stage: 'sent', column: 'sent',
        scoreWaiting: 'Ждём ответ 4 дн.',
        actions: ['history', 'docx'],
        statusNote: 'Отправлено заказчику · ждём ответ',
        activity: [
          { time: '14:05', text: 'Отправлено заказчику · DOCX v1' },
          { time: '11:20', text: 'DOCX готов' }
        ]
      },
      orlov: {
        id: 'orlov', initials: 'СО', avatar: 'avatar--rose', name: 'Орлов Сергей', short: 'Орлов С.К.',
        role: 'DevOps · 4 года', score: 86, matchHint: '8 из 12 требований',
        reasons: ['Docker, K8s', 'Yandex Cloud'],
        availability: 'Интервью 23.05', english: 'B2', feedback: '—',
        readiness: 'confirmed', stage: 'sent', column: 'sent',
        actions: ['history', 'docx'],
        statusNote: 'Заказчик назначил интервью',
        activity: [{ time: '16:30', text: 'Статус: интервью' }]
      },
      kozlov: {
        id: 'kozlov', initials: 'ДК', avatar: 'avatar--amber', name: 'Козлов Дмитрий', short: 'Козлов Д.А.',
        role: 'DevOps · 3 года', score: 0, matchHint: '',
        reasons: [], availability: 'На скамье', english: 'B1', feedback: '—',
        readiness: 'confirmed', stage: 'reject', column: 'reject',
        rejectReason: '12 мая · не подошёл стек',
        actions: ['restore'],
        statusNote: 'Отказ · не подошёл стек',
        activity: [{ time: '12 мая', text: 'Отказ заказчика' }]
      },
      fedorov: {
        id: 'fedorov', initials: 'ЕФ', avatar: 'avatar--amber', name: 'Фёдоров Евгений', short: 'Фёдоров Е.Н.',
        role: 'Junior DevOps · 2 года', score: 0, matchHint: '',
        reasons: [], availability: 'На скамье', english: 'A2', feedback: '—',
        readiness: 'pending', stage: 'reject', column: 'reject',
        rejectReason: '18 мая · рекрутер отказал',
        actions: ['restore'],
        statusNote: 'Отказ · недостаточный опыт',
        activity: [{ time: '18 мая', text: 'Отказ рекрутёра' }]
      }
    },

    pipelineColumns: [
      { id: 'ai', title: 'Подобрано AI', class: 'pipeline-col--ai', subtitle: 'Кандидаты из банка после AI-подбора' },
      { id: 'review', title: 'На проверке', class: 'pipeline-col--review', subtitle: 'Резюме на проверке рекрутером' },
      { id: 'ready', title: 'Готово к отправке', class: 'pipeline-col--ready', subtitle: 'Проверено · ещё не отправлено заказчику' },
      { id: 'sent', title: 'Отправлено', class: 'pipeline-col--sent', subtitle: 'CV у заказчика · ждём ответ' },
      { id: 'reject', title: 'Отказ', class: 'pipeline-col--reject', subtitle: 'Отказы и неактуальные кандидаты', defaultVisible: false }
    ],

    historyStats: { sent: 3, waiting: 1, reject: 2 },

    timelineEvents: [
      { time: '16:30', datetime: '2026-05-20T16:30', candidate: 'sidorov', type: 'default', title: 'Статус: интервью', text: 'Sidorov M. — ответ заказчика', reject: false },
      { time: '14:05', datetime: '2026-05-20T14:05', candidate: 'novikov', type: 'highlight', title: 'Отправлено заказчику', text: 'Novikov P. · DOCX скачан', reject: false },
      { time: '11:20', datetime: '2026-05-20T11:20', candidate: 'novikov', type: 'default', title: 'DOCX готов', text: 'Novikov P. — адаптация утверждена', reject: false },
      { time: '11:15', datetime: '2026-05-20T11:15', candidate: 'sidorov', type: 'default', title: 'На проверке', text: 'Sidorov M. — открыли «было → стало»', reject: false },
      { time: '10:43', datetime: '2026-05-20T10:43', candidate: 'all', type: 'default', title: 'AI подобрал 5 кандидатов', text: 'Топ: Sidorov 91%, Novikov 88%', reject: false },
      { time: '10:42', datetime: '2026-05-20T10:42', candidate: 'all', type: 'default', title: 'Вакансия создана', text: 'Импорт DOCX от SberTech', reject: false },
      { time: '09:30', datetime: '2026-05-19T09:30', candidate: 'lebedev', type: 'default', title: 'Взяли на проверку', text: 'Lebedev A.', reject: false },
      { time: '18:00', datetime: '2026-05-18T18:00', candidate: 'fedorov', type: 'default', title: 'Отказ', text: 'Fedorov E. · недостаточный опыт', reject: true },
      { time: '15:10', datetime: '2026-05-17T15:10', candidate: 'morozov', type: 'default', title: 'Готово к отправке', text: 'Morozov I. — DOCX проверен', reject: false },
      { time: '12:00', datetime: '2026-05-16T12:00', candidate: 'ivanov', type: 'default', title: 'AI подобрал', text: 'Ivanov A. · 87%', reject: false },
      { time: '11:00', datetime: '2026-05-15T11:00', candidate: 'petrov', type: 'default', title: 'Блок «занят»', text: 'Petrov K. · до 01.06', reject: false },
      { time: '10:00', datetime: '2026-05-14T10:00', candidate: 'volkov', type: 'default', title: 'AI подобрал', text: 'Volkov D. · 84%', reject: false },
      { time: '12 мая', datetime: '2026-05-12T09:00', candidate: 'kozlov', type: 'default', title: 'Отказ', text: 'Kozlov D. · не подошёл стек', reject: true },
      { time: '08:45', datetime: '2026-05-11T08:45', candidate: 'orlov', type: 'default', title: 'Отправлено заказчику', text: 'Orlov S.', reject: false },
      { time: '17:20', datetime: '2026-05-10T17:20', candidate: 'smirnov', type: 'default', title: 'Предупреждение', text: 'Smirnov E. · уже отправляли', reject: false }
    ],

    bankWeeks: [
      { label: '28.04–04.05', short: 'W1' },
      { label: '05.05–11.05', short: 'W2' },
      { label: '12.05–18.05', short: 'W3' },
      { label: '19.05–25.05', short: 'W4' },
      { label: '26.05–01.06', short: 'W5' }
    ],

    bankPeople: [
      { id: 'p1', group: 'DevOps', name: 'Калюжный Артём', role: 'DevOps', stack: 'K8s, Terraform', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p2', group: 'DevOps', name: 'Бортников Константин', role: 'SRE', stack: 'K8s, Ansible', load: 100, freeFrom: '01.06', status: 'busy', weeks: ['SberTech 80%', 'SberTech 100%', 'SberTech 100%', 'SberTech 100%', '—'] },
      { id: 'p3', group: 'DevOps', name: 'Лаптев Михаил', role: 'DevOps', stack: 'K8s, FinTech', load: 32, freeFrom: 'частично', status: 'partial', weeks: ['—', '—', 'VK 32%', 'VK 32%', 'VK 32%'] },
      { id: 'p4', group: 'DevOps', name: 'Озёрнов Иван', role: 'DevOps', stack: 'Helm, PCI', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p5', group: 'DevOps', name: 'Дубинин Дмитрий', role: 'SRE', stack: 'GitOps', load: 80, freeFrom: '25.05', status: 'busy', weeks: ['—', 'Alfa 80%', 'Alfa 80%', 'Alfa 80%', '—'] },
      { id: 'p6', group: 'Backend', name: 'Шувалов Сергей', role: 'Java', stack: 'Spring, Kafka', load: 118, freeFrom: '—', status: 'overload', weeks: ['X5 100%', 'X5 118%', 'X5 118%', 'X5 100%', 'X5 80%'] },
      { id: 'p7', group: 'Backend', name: 'Каменская Анна', role: 'Java', stack: 'Microservices', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p8', group: 'Backend', name: 'Платонов Никита', role: 'Go', stack: 'Go, gRPC', load: 50, freeFrom: '01.06', status: 'partial', weeks: ['—', 'Ozon 50%', 'Ozon 50%', 'Ozon 50%', '—'] },
      { id: 'p9', group: 'QA', name: 'Маркова Мария', role: 'QA Auto', stack: 'Python, Selenium', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p10', group: 'QA', name: 'Черных Олег', role: 'QA', stack: 'API, Postman', load: 100, freeFrom: '15.06', status: 'busy', weeks: ['Tinkoff', 'Tinkoff', 'Tinkoff', 'Tinkoff', 'Tinkoff'] },
      { id: 'p11', group: 'Frontend', name: 'Власова Елена', role: 'React', stack: 'TS, Redux', load: 40, freeFrom: 'частично', status: 'partial', weeks: ['—', 'VK 40%', 'VK 40%', '—', '—'] },
      { id: 'p12', group: 'Frontend', name: 'Терехов Артём', role: 'Frontend', stack: 'Vue, Nuxt', load: 0, freeFrom: 'с 28.05', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p13', group: 'PM', name: 'Беляева Алёна', role: 'PM', stack: 'Agile', load: 60, freeFrom: '01.06', status: 'partial', weeks: ['Corp AI 60%', 'Corp AI 60%', '—', '—', '—'] },
      { id: 'p14', group: 'PM', name: 'Дмитриева Анастасия', role: 'PM', stack: 'Scrum', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p15', group: 'Analyst', name: 'Рунова Ольга', role: 'System Analyst', stack: 'BPMN', load: 100, freeFrom: '01.07', status: 'busy', weeks: ['GPN', 'GPN', 'GPN', 'GPN', 'GPN'] },
      { id: 'p16', group: 'Analyst', name: 'Шатров Павел', role: 'BA', stack: 'SQL, UML', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p17', group: 'DevOps', name: 'Яровой Дмитрий', role: 'DevOps', stack: 'Linux', load: 0, freeFrom: 'сейчас', status: 'free', weeks: ['—', '—', '—', '—', '—'] },
      { id: 'p18', group: 'Backend', name: 'Гущин Денис', role: 'Python', stack: 'Django, FastAPI', load: 90, freeFrom: '10.06', status: 'busy', weeks: ['—', 'MTS 90%', 'MTS 90%', 'MTS 90%', '—'] }
    ],

    bankKpi: { total: 18, free: 7, busy: 8, soon: 3 },

    bankPersonExtras: {
      p1: {
        facts: [
          'Senior · 6 лет коммерческого опыта · FinTech, e-commerce',
          'Английский B2 — подтверждён 10.05.2026',
          'GMT+3 · удалёнка · готов к выезду на интервью',
          'Повторная отправка в СберTech не рекомендуется — отказ в январе 2026'
        ],
        sendHistory: [
          {
            date: '14.04.2026',
            vacancy: 'DevOps Engineer',
            client: 'Альфа-Банк',
            status: 'reject',
            statusLabel: 'Отказ',
            detail: 'не подошёл грейд',
            match: '76%'
          },
          {
            date: '02.03.2026',
            vacancy: 'DevOps Engineer',
            client: 'VK',
            status: 'waiting',
            statusLabel: 'Ждём ответ',
            detail: '3 дня без ответа',
            match: '82%'
          },
          {
            date: '15.01.2026',
            vacancy: 'DevOps Engineer',
            client: 'СберTech',
            status: 'reject',
            statusLabel: 'Отказ',
            detail: 'отказ до интервью · стек',
            match: '71%'
          },
          {
            date: '20.11.2025',
            vacancy: 'DevOps Engineer',
            client: 'Ozon',
            status: 'interview',
            statusLabel: 'Интервью',
            detail: 'прошёл тех. интервью',
            match: '88%'
          }
        ]
      }
    }
  };

  var MOCK_RESUME_BALAKIREV = {
    meta: {
      name: 'Балакирев М. — Senior QA Engineer Fullstack (Java)',
      breadcrumb: 'Тинькофф / QA Automation · FinTech',
      chip: '88% · 10 из 12 требований',
      docxHint: 'Корпоративный шаблон DOCX · FinTech QA'
    },
    beforeHtml:
      '<div class="cv-header">' +
        '<p class="cv-name"><strong>Балакирев Максим Михайлович</strong></p>' +
        '<p>Senior QA Engineer Fullstack (Java)</p>' +
        '<p class="cv-meta">31.12.1995 · maks1m.ff@yandex.ru · +7 933 113-64-84</p>' +
        '<p class="cv-meta">GMT+3 (РФ, Москва) · Готов выйти на проект с 08.04.2026</p>' +
      '</div>' +
      '<h4>Краткая информация о специалисте на соответствие вакансии</h4>' +
      '<ul class="cv-list">' +
        '<li>Автоматизировал регресс тестирование API-эндпойнтов</li>' +
        '<li>Разработал сценарии для интеграционного и E2E тестирования</li>' +
        '<li>Обеспечил покрытие автотестами ключевых платёжных сценариев</li>' +
        '<li>Выявил дефекты в логике проверки хэшей и обработки данных</li>' +
        '<li>Покрыл автотестами 70% API-эндпойнтов своей команды</li>' +
        '<li>Автоматизировал интеграции с внешними системами через SWIFT Adapter</li>' +
        '<li>Создал 90% тестовой документации на проекте DNS</li>' +
        '<li>Разработал сценарии для проверки API управления DNS-записями</li>' +
      '</ul>' +
      '<h4>Технические навыки</h4>' +
      '<p>Java, SQL, Rest Assured, GitLab, Allure, Docker, Kibana, JUnit 5, Insomnia, HTTP, GitHub, Git, Kafka, Selenium, Retrofit, Postman, Cucumber, JUnit, Jira, Selenide, TestNG, PostgreSQL, REST, IntelliJ IDEA, Redis, Jenkins, Postgres, CI</p>' +
      '<h4>Профессиональный опыт</h4>' +
      '<div class="cv-job">' +
        '<p><strong>Т1</strong> · Октябрь 2025 — Февраль 2026</p>' +
        '<p class="cv-job-desc">Проект «Антифрод» — система для операторов мобильной связи, мониторинг телефонных номеров и предотвращение мошенничества.</p>' +
        '<p><strong>Senior QA Engineer Fullstack (Java)</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация регрессионного тестирования системы</li>' +
          '<li>Автоматизация тестирования API антифрод-системы</li>' +
          '<li>Исследовательское тестирование антифрод-логики</li>' +
          '<li>Поиск и документирование дефектов в логике проверки хэшей</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, Rest Assured, Postman, PostgreSQL, GitLab, Kafka, Git</p>' +
      '</div>' +
      '<div class="cv-job">' +
        '<p><strong>Сбер</strong> · Ноябрь 2024 — Октябрь 2025</p>' +
        '<p class="cv-job-desc">Адаптер SWIFT и Blockchain — платёжные сообщения и межбанковские расчёты.</p>' +
        '<p><strong>Старший инженер по тестированию</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация тестирования API-эндпойнтов и интеграций (Kafka, БД)</li>' +
          '<li>Ручное E2E-тестирование платёжных цепочек SWIFT</li>' +
          '<li>Тестирование платёжных сценариев: приём, валидация, маршрутизация, статусы</li>' +
          '<li>Покрыл автотестами 70% API-эндпойнтов команды</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, PostgreSQL, Insomnia, Jenkins, Kafka, ArtemisMQ, Git</p>' +
      '</div>' +
      '<div class="cv-job">' +
        '<p><strong>EdgeЦентр</strong> · Февраль 2023 — Ноябрь 2024</p>' +
        '<p class="cv-job-desc">DNS — система DNS-резолвинга, API, управление зонами и записями, UI администрирования.</p>' +
        '<p><strong>Fullstack QA Engineer</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Создание тестовой документации для DNS-системы</li>' +
          '<li>Автоматизация проверки API управления DNS-записями</li>' +
          '<li>UI/UX- и кроссбраузерное тестирование интерфейса администрирования</li>' +
          '<li>End-to-end тестирование сквозных сценариев DNS-системы</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, Selenide, PostgreSQL, Kafka, GitLab, Allure, Git</p>' +
      '</div>' +
      '<h4>Дополнительная информация</h4>' +
      '<p><strong>Образование:</strong> РГУ им. С.А. Есенина, Социология (2017)</p>' +
      '<p><strong>Языки:</strong> Русский — Proficiency · Английский — Intermediate</p>',

    afterHtml:
      '<div class="cv-header">' +
        '<p class="cv-name"><strong>Балакирев Максим Михайлович</strong></p>' +
        '<p>Senior QA Engineer Fullstack (Java)<span class="diff-ins"> · FinTech / платёжные системы</span></p>' +
        '<p class="cv-meta">31.12.1995 · maks1m.ff@yandex.ru · +7 933 113-64-84</p>' +
        '<p class="cv-meta">GMT+3 (РФ, Москва) · Готов выйти на проект с 08.04.2026</p>' +
      '</div>' +
      '<h4>Краткая информация о специалисте на соответствие вакансии</h4>' +
      '<ul class="cv-list">' +
        '<li>Автоматизировал регресс тестирование API-эндпойнтов<span class="diff-ins"> в high-load FinTech-контуре</span></li>' +
        '<li>Разработал сценарии для интеграционного и E2E тестирования</li>' +
        '<li>Обеспечил покрытие автотестами ключевых платёжных сценариев<span class="diff-ins"> (SWIFT, блокчейн-расчёты)</span></li>' +
        '<li>Выявил дефекты в логике проверки хэшей и обработки данных</li>' +
        '<li><span class="diff-del">Покрыл автотестами 70%</span><span class="diff-ins">Довёл покрытие API до 85%</span> API-эндпойнтов команды</li>' +
        '<li>Автоматизировал интеграции с внешними системами через SWIFT Adapter</li>' +
        '<li class="diff-del">Создал 90% тестовой документации на проекте DNS</li>' +
        '<li>Разработал сценарии для проверки API<span class="diff-ins"> платёжных шлюзов и </span>управления DNS-записями</li>' +
        '<li class="diff-ins">Стабилизировал E2E-прогоны, сократив время регресса на 20 минут</li>' +
      '</ul>' +
      '<h4>Технические навыки</h4>' +
      '<p>Java, SQL, Rest Assured, GitLab, Allure, Docker, Kibana, JUnit 5, Insomnia, HTTP, GitHub, Git, Kafka, Selenium, Retrofit, Postman, Cucumber, JUnit, Jira, Selenide, TestNG, PostgreSQL, REST, IntelliJ IDEA, Redis, Jenkins, Postgres, CI<span class="diff-ins">, ArtemisMQ, SWIFT</span></p>' +
      '<h4>Профессиональный опыт</h4>' +
      '<div class="cv-job">' +
        '<p><strong>Т1</strong> · Октябрь 2025 — Февраль 2026</p>' +
        '<p class="cv-job-desc"><span class="diff-del">Проект «Антифрод» — система для операторов мобильной связи, мониторинг телефонных номеров и предотвращение мошенничества.</span><span class="diff-ins">Антифрод-платформа для операторов связи: мониторинг номеров, выявление мошенничества, high-load API.</span></p>' +
        '<p><strong>Senior QA Engineer Fullstack (Java)</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация регрессионного тестирования системы</li>' +
          '<li>Автоматизация тестирования API антифрод-системы<span class="diff-ins"> для верификации телефонных номеров</span></li>' +
          '<li>Исследовательское тестирование антифрод-логики</li>' +
          '<li>Поиск и документирование дефектов в логике проверки хэшей<span class="diff-ins"> и обработке некорректных данных</span></li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, Rest Assured, Postman, PostgreSQL, GitLab, Kafka, Git</p>' +
      '</div>' +
      '<div class="cv-job">' +
        '<p><strong>Сбер</strong> · Ноябрь 2024 — Октябрь 2025</p>' +
        '<p class="cv-job-desc">Адаптер SWIFT и Blockchain — <span class="diff-ins">приём, обработка и маршрутизация </span>платёжные сообщения и межбанковские расчёты.</p>' +
        '<p><strong>Старший инженер по тестированию</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация тестирования API-эндпойнтов и интеграций (Kafka, БД)</li>' +
          '<li>Ручное E2E-тестирование платёжных цепочек SWIFT</li>' +
          '<li>Тестирование платёжных сценариев: приём, валидация, маршрутизация, статусы<span class="diff-ins">, обработка ошибок</span></li>' +
          '<li><span class="diff-del">Покрыл автотестами 70%</span><span class="diff-ins">Довёл покрытие до 85%</span> API-эндпойнтов команды</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, PostgreSQL, Insomnia, Jenkins, Kafka, ArtemisMQ, Git</p>' +
      '</div>' +
      '<div class="cv-job">' +
        '<p><strong>EdgeЦентр</strong> · Февраль 2023 — Ноябрь 2024</p>' +
        '<p class="cv-job-desc"><span class="diff-mod">DNS-сервис: API управления зонами и записями, регрессионное тестирование.</span></p>' +
        '<p><strong>Fullstack QA Engineer</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Создание тестовой документации для DNS-системы</li>' +
          '<li>Автоматизация проверки API управления DNS-записями</li>' +
          '<li class="diff-del">UI/UX- и кроссбраузерное тестирование интерфейса администрирования</li>' +
          '<li>End-to-end тестирование сквозных сценариев DNS-системы</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, Selenide, PostgreSQL, Kafka, GitLab, Allure, Git</p>' +
      '</div>' +
      '<h4>Дополнительная информация</h4>' +
      '<p><strong>Образование:</strong> РГУ им. С.А. Есенина, Социология (2017)</p>' +
      '<p><strong>Языки:</strong> Русский — Proficiency · Английский — Intermediate<span class="diff-ins"> (тех. документация, API)</span></p>',

    afterRegeneratedHtml:
      '<div class="cv-header">' +
        '<p class="cv-name"><strong>Балакирев Максим Михайлович</strong></p>' +
        '<p>Senior QA Engineer Fullstack (Java) · FinTech / платёжные системы</p>' +
        '<p class="cv-meta">31.12.1995 · maks1m.ff@yandex.ru · +7 933 113-64-84</p>' +
        '<p class="cv-meta">GMT+3 (РФ, Москва) · Готов выйти на проект с 08.04.2026</p>' +
      '</div>' +
      '<h4>Краткая информация о специалисте на соответствие вакансии</h4>' +
      '<ul class="cv-list">' +
        '<li>Автоматизировал регресс тестирование API-эндпойнтов в high-load FinTech-контуре</li>' +
        '<li>Разработал сценарии для интеграционного и E2E тестирования</li>' +
        '<li>Обеспечил покрытие автотестами ключевых платёжных сценариев (SWIFT, блокчейн-расчёты)</li>' +
        '<li>Выявил дефекты в логике проверки хэшей и обработки данных<span class="diff-ins">, предотвратив ложные срабатывания антифрод-логики</span></li>' +
        '<li>Довёл покрытие API до 85% API-эндпойнтов команды</li>' +
        '<li>Автоматизировал интеграции с внешними системами через SWIFT Adapter</li>' +
        '<li>Разработал сценарии для проверки API платёжных шлюзов</li>' +
        '<li>Стабилизировал E2E-прогоны, сократив время регресса на 20 минут</li>' +
        '<li class="diff-ins">Подготовил инструкции по получению доступов к контурам DEV и ПСИ на антифрод-проекте</li>' +
      '</ul>' +
      '<h4>Технические навыки</h4>' +
      '<p>Java, SQL, Rest Assured, GitLab, Allure, Docker, Kibana, JUnit 5, Insomnia, HTTP, GitHub, Git, Kafka, Selenium, Retrofit, Postman, Cucumber, JUnit, Jira, Selenide, TestNG, PostgreSQL, REST, IntelliJ IDEA, Redis, Jenkins, Postgres, CI, ArtemisMQ, SWIFT</p>' +
      '<h4>Профессиональный опыт</h4>' +
      '<div class="cv-job">' +
        '<p><strong>Т1</strong> · Октябрь 2025 — Февраль 2026</p>' +
        '<p class="cv-job-desc">Антифрод-платформа для операторов связи: мониторинг номеров, выявление мошенничества, high-load API<span class="diff-ins">, верификация телефонных номеров через REST API</span>.</p>' +
        '<p><strong>Senior QA Engineer Fullstack (Java)</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация регрессионного тестирования системы</li>' +
          '<li>Автоматизация тестирования API антифрод-системы для верификации телефонных номеров</li>' +
          '<li>Исследовательское тестирование антифрод-логики<span class="diff-ins">: ключевые сценарии блокировки и whitelist</span></li>' +
          '<li>Поиск и документирование дефектов в логике проверки хэшей и обработке некорректных данных</li>' +
          '<li class="diff-ins">Подготовил инструкции по доступам к контурам DEV и ПСИ</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, Rest Assured, Postman, PostgreSQL, GitLab, Kafka, Git</p>' +
      '</div>' +
      '<div class="cv-job">' +
        '<p><strong>Сбер</strong> · Ноябрь 2024 — Октябрь 2025</p>' +
        '<p class="cv-job-desc">Адаптер SWIFT и Blockchain — приём, обработка и маршрутизация платёжных сообщений и межбанковских расчётов.</p>' +
        '<p><strong>Старший инженер по тестированию</strong></p>' +
        '<ul class="cv-list">' +
          '<li>Автоматизация тестирования API-эндпойнтов и интеграций (Kafka, БД)</li>' +
          '<li>Ручное E2E-тестирование платёжных цепочек SWIFT</li>' +
          '<li>Тестирование платёжных сценариев: приём, валидация, маршрутизация, статусы, обработка ошибок</li>' +
          '<li>Довёл покрытие до 85% API-эндпойнтов команды</li>' +
        '</ul>' +
        '<p class="cv-tech">Java, JUnit 5, Retrofit, PostgreSQL, Insomnia, Jenkins, Kafka, ArtemisMQ, Git</p>' +
      '</div>' +
      '<p class="diff-del cv-job-removed"><strong>EdgeЦентр</strong> · Февраль 2023 — Ноябрь 2024 — блок сокращён по запросу HR</p>' +
      '<h4>Дополнительная информация</h4>' +
      '<p><strong>Образование:</strong> РГУ им. С.А. Есенина, Социология (2017)</p>' +
      '<p><strong>Языки:</strong> Русский — Proficiency · Английский — Intermediate (тех. документация, API)</p>'
  };

  global.MOCK_DATA = MOCK_DATA;
  global.MOCK_RESUME_BALAKIREV = MOCK_RESUME_BALAKIREV;
})(typeof window !== 'undefined' ? window : globalThis);
