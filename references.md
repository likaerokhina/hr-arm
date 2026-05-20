# UX-референсы и visual direction

## Направление: Modern Enterprise + AI-accent

Не клон Huntflow, не «AI wow» — знакомая структура + свой визуальный язык.

## Токены (как в `styles.css`)

| Элемент | Значение | Где используется |
|---------|----------|------------------|
| Шрифт | Plus Jakarta Sans | Весь UI |
| Фон страницы | Warm off-white `#f7f6f4` | Main area |
| Surface | White `#ffffff` | Карточки, sidebar, колонки pipeline |
| Primary | Indigo `#4f46e5` | CTA, active nav, ссылки, AI-акценты |
| Primary soft | `#eef2ff` | Hover/active sidebar, KPI-иконки, badge AI |
| Sidebar | Light `#ffffff`, border-right | Левое меню продукта |
| Sidebar active | `primary-soft` bg + primary text | Текущий пункт навигации |
| AI gradient | `#6366f1` → `#8b5cf6` | Score ring, badge «AI-подбор» |
| Stage colors | violet / amber / green / slate | Top-border колонок воронки |
| Radius | 12px cards, 8px controls | Карточки, кнопки, inputs |

## Платформы-референсы

| Платформа | Что взяли |
|-----------|-----------|
| [Huntflow](https://huntflow.media/preimushchestva-crm-dlya-najma-huntflow/) | 3 колонки: вакансии → воронка → карточка |
| [Ashby](https://docs.ashbyhq.com/candidate-pipeline) | Pipeline stages + count badges |
| SaaS 2026 | Light sidebar, KPI cards, card-list (не dark theme) |

## Экраны (presale)

Скрины — в [образе результата](../obraz-rezultata.md#экраны). Ниже — паттерны по экранам.

**1. Список вакансий**
- KPI-карточки: иконка + colored left border, 3 метрики в ряд
- Список вакансий: card-list с фиксированными колонками (заказчик · статус · счётчик · кнопка)

**2. Воронка**
- 2-pane layout: pipeline (scrollable kanban, колонки 240px) · карточка кандидата (300px)
- Switcher вакансий в topbar (dropdown) — быстрая навигация без боковой колонки
- Pipeline columns: stage color top-border, count badge
- Avatar + AI score ring в правой панели

**3. Резюме**
- Diff двух колонок с вертикальным connector
- Green highlights для изменений
- Sticky action bar внизу

## Presale-nav

Светлая полоска сверху (`#ffffff`, border-bottom) — навигация между экранами прототипа. **Не часть продукта.**

## Скриншоты (`images/`)

| Файл | Экран |
|------|-------|
| `spisok_vakansiy.png` | Список вакансий |
| `voronka.png` | Воронка кандидатов |
| `resume.png` | Адаптация резюме |
