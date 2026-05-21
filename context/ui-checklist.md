# UI checklist (presale)

Перед правкой HTML:

1. [scope.md](./scope.md) — не выходим за этап 2
2. [screen-map.md](./screen-map.md) — какой файл за какой эпик
3. `../arch/docs/product/epics/` — US и интерфейс
4. [kontekst-dlya-interfeisov.md](./kontekst-dlya-interfeisov.md) + `journeys/` — только подписи и поля, без новых экранов

После изменений UI — обновить PNG в `arch/docs/product/mockups/images/` (если менялся видимый layout).

## Экспорт скриншотов

| PNG | HTML | Viewport (ширина) | Заметки |
|-----|------|-------------------|---------|
| `spisok_vakansiy.png` | `dashboard.html` | 1280px | KPI + список вакансий |
| `voronka.png` | `vacancy.html` | **1680px** | **Шире остальных** — 4 колонки воронки + правая панель; при 1280–1440px kanban тесный |
| `resume.png` | `resume.html` | 1280px | Две колонки diff + sticky bar |
| `history.png` | `vacancy-card.html` | 1280px | Отправки + лента |

Общее: высота по контенту, presale-nav сверху можно оставить или скрыть (не часть продукта — см. [references.md](../references.md)). Скрипт экспорта: `node scripts/export-screenshots.mjs` (нужен Chrome и `npm install --no-save puppeteer-core`).
