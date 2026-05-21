# Контекст для интерфейсов (АРМ presale)

> **Статус:** Draft  
> **Создан:** 2026-05-20

Шпаргалка для дизайна, HTML-макетов и Cursor. **Правило:** сначала [эпик](../../product/epics/epic_1_vakansii.md) и [образ результата](../../product/obraz-rezultata.md), потом journey.

Дубликат для mockups: `hr-lk-mockups/context/kontekst-dlya-interfeisov.md`.

---

## Journey → экран

| Journey | Экраны / поля | Этап |
|---------|---------------|------|
| [zapros-do-otpravki-cv](./journeys/zapros-do-otpravki-cv.md) | dashboard, vacancy, resume, vacancy-card | АРМ + задел (бриф, тех. апрув — **не** в 4 экранах) |
| [hr-v-autstafe](./journeys/hr-v-autstafe.md) | Подписи, KPI, боли — **не** новые экраны | Copy |
| [ai-ot-zaprosa-do-cv](./journeys/ai-ot-zaprosa-do-cv.md) | vacancy (% AI, причины, блокировки), resume (подсветка) | АРМ ≈ эпики 2–3 |
| [upravlenie-skamey](./journeys/upravlenie-skamey.md) | Только «занят до», блокировка в воронке | **Future** |

---

## Паттерн → макет

| Паттерн | Макет (HTML) |
|---------|----------------|
| KPI, «N дн. в статусе», застой | `dashboard.html` |
| Воронка, %, причины, «занят», «уже отправляли» | `vacancy.html` |
| Было → стало, DOCX | `resume.html` |
| Лента, статусы ответа, история отправок | `vacancy-card.html` |

Путь mockups: `/Users/kts/Desktop/hr-lk-mockups/`.

---

## Не переносим без нового эпика

- Дашборд скамьи, прогноз 60 дней
- Умная форма брифа, парсинг из мессенджера
- Тех. апрув тимлиду, уведомления сотруднику
- AI-агенты, питч, follow-up AM
- Полноценный модуль «Банк резюме» (sidebar остаётся заглушкой)

---

## Связанные документы

- [mvp-scope-map.md](./mvp-scope-map.md)
- [screen-map.md](./screen-map.md)
