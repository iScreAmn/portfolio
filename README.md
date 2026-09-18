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
- **Supabase**: Analytics (RPC `track_events`) and the admin panel auth.

## Project structure

```
src/
  app/            # маршруты App Router: серверные обёртки page.jsx + layout
    (site)/       # общий каркас — Header, main, Footer, SidePanel
    (admin)/      # /admin, без каркаса сайта
  views/          # компоненты страниц (бывший src/pages)
  components/     # переиспользуемые блоки и виджеты
  data/           # локальный контент, русская и английская версии
  hooks/ context/ lib/ utils/
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

## Deploy (свой сервер, Node за nginx)

Сборка идёт в режиме `output: 'standalone'`, поэтому на сервер достаточно
положить три вещи:

```bash
npm ci
npm run build

# standalone-сервер не копирует статику сам
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

PORT=3000 node .next/standalone/server.js
```

Требуется Node 20.9+ (см. `.nvmrc`).
