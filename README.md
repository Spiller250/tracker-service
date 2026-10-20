# [CARGO BRAND] — трекинг посылок Китай → Казахстан

Next.js 15 (App Router) · TypeScript · Three.js + @react-three/fiber · без CSS-фреймворка (токены в `src/app/globals.css`).

```bash
npm install
npm run dev      # разработка
npm run build && npm start
```

> Нужен TypeScript 6 (`typescript@^6`): Next.js 15 не поддерживает TypeScript 7.

## Структура
- `src/components/scene/` — `ChinaKazakhstanScene` (3D, lazy, `ssr:false`), `SceneCanvas` (R3F), `SceneFallback` (SVG без WebGL).
  Анимация отключается при `prefers-reduced-motion` и когда сцена вне экрана.
- `src/lib/tracking/` — модель (`types.ts`), валидация, клиентский адаптер, провайдеры (`providers/demo.ts`, `providers/live.ts`).
- `src/app/api/track/route.ts` — `GET /api/track?number=…` → `{ ok, shipment | code, message }`.
- `src/data/demo-shipments.ts` — **демонстрационные** записи.

## Демо-режим (по умолчанию)
Работает без внешних сервисов. Примеры номеров: `DEMO-TRANSIT-01`, `DEMO-READY-02`, `DEMO-DELIVERED-03`.
Результаты помечены баннером «Демо-режим». Реальных данных о посылках нет.

## Подключение реального трекинга
1. Скопируйте `.env.example` в `.env.local`, задайте `TRACKING_MODE=live`, `TRACKING_API_URL`, `TRACKING_API_KEY`
   (только серверные переменные, без префикса `NEXT_PUBLIC_`).
2. В `src/lib/tracking/providers/live.ts` подстройте запрос под API перевозчика и реализуйте
   `mapCarrierResponse()` — преобразование ответа в тип `Shipment`. UI от формата перевозчика не зависит.
   Пока функция не реализована, API отвечает `501 not_configured`, вымышленные данные не отдаются.
3. Ожидаемая дата (`estimatedDelivery`) показывается только если пришла из источника.

## Заполнить владельцу сервиса
Отмечено жёлтым: контакты поддержки, тарифы, политика конфиденциальности, название бренда (`[CARGO BRAND]`).
