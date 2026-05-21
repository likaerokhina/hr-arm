# HR ЛК — HTML-прототип (presale)

Четыре экрана АРМ рекрутера (этап 2). Документация продукта — в соседнем репозитории `arch`.

---

## Порядок чтения для Cursor

1. `../arch/docs/product/obraz-rezultata.md` + эпики
2. `context/kontekst-dlya-interfeisov.md`
3. `context/journeys/*.md` (локальные копии)
4. `context/scope.md`, `context/screen-map.md`

---

## Файлы

| Файл | Экран |
|------|-------|
| `dashboard.html` | Список вакансий |
| `vacancy.html` | Воронка |
| `resume.html` | Было → Стало |
| `vacancy-card.html` | История и отправки |

`references.md` — визуальные референсы. `styles.css` — токены.

---

## Правила

- Не добавлять экраны вне 4 эпиков без согласования с `arch/docs/product/`.
- Journey — контекст; дашборд скамьи и ATS — не в макеты.
- Presale-nav сверху — только навигация прототипа, не продукт.
