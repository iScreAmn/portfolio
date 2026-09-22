# Portfolio

A modern and responsive portfolio built with **React** and **Next.js** (App Router).
The project showcases a clean and interactive design, optimized for performance and
user experience.

## Features

- **Responsive Design**: Adapts seamlessly to different screen sizes and devices.
- **Modern UI/UX**: A visually appealing interface with smooth transitions and animations.
- **Dynamic Components**: Built with reusable React components for easy scalability.
- **Server rendering**: Pages are prerendered by Next.js, with per-page metadata for SEO.
- **Optimized Performance**: Ensures quick load times and efficient resource management.

## Technologies Used

- **Next.js 16 (App Router)**: Routing, server rendering and the production build.
- **React 19**: Building reusable and scalable components.
- **CSS**: Plain stylesheets per component — Flexbox, Grid, custom properties for theming.
- **Own Express API**: Analytics ingest, contact forms and admin auth — see `NEXT_PUBLIC_API_URL`.

## Project structure

```
src/
  app/            # маршруты App Router: серверные обёртки page.jsx + layout
    (site)/       # общий каркас — Header, main, Footer, SidePanel
    (admin)/      # /admin, без каркаса сайта
  views/          # компоненты страниц (бывший src/pages)
  components/     # переиспользуемые блоки и виджеты
  data/           # локальный контент, русская и английская версии
  analytics/      # провайдер трекера, подключён в корневом layout
  lib/            # apiClient + трекер + запросы админки
  hooks/ context/ utils/
  assets/         # картинки и шрифты, попадают в бандл
public/           # то, что отдаётся как есть: резюме в PDF
```

## Scripts

```bash
npm run dev     # дев-сервер на http://localhost:3333
npm run build   # продакшн-сборка (output: standalone)
npm run start   # запуск собранного приложения
npm run lint    # eslint
```

## Environment

Скопируйте `.env.example` в `.env` и заполните значения. Всё, что нужно браузеру,
должно начинаться с `NEXT_PUBLIC_`.

В dev-режиме запросы на `/api/*` проксируются через `rewrites()` из
`next.config.mjs` на `API_PROXY_TARGET` (по умолчанию `http://127.0.0.1:5050`).

## Deploy

Push в `main` собирает Docker-образ в GitHub Actions, пушит его в GHCR и
обновляет контейнер на сервере. Сам сервер ничего не собирает.

Важно: `NEXT_PUBLIC_API_URL` вшивается в клиентский бандл **на этапе сборки**
(build-аргумент в `.github/workflows/deploy.yml`), поэтому менять адрес API
в `.env` на сервере бесполезно — нужна пересборка образа.

Пошаговая настройка сервера — в репозитории бэкенда, `deploy/README-deploy.md`.

Требуется Node 20.9+ (см. `.nvmrc`).
