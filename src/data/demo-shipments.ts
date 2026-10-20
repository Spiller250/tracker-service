import type { Shipment } from "@/lib/tracking/types";

/**
 * SAMPLE RECORDS — not real parcels. Dates and places are invented for
 * demonstration only and are flagged with isDemo: true.
 */
export const DEMO_SHIPMENTS: Shipment[] = [
  {
    trackingNumber: "DEMO-TRANSIT-01",
    currentStage: "in_transit",
    origin: "Китай, склад отправителя",
    destination: "Казахстан, пункт выдачи",
    estimatedDelivery: "2026-11-10",
    isDemo: true,
    events: [
      { stage: "accepted", date: "2026-10-12T09:40:00+08:00", location: "Склад в Китае", description: "Посылка принята на складе и зарегистрирована в системе." },
      { stage: "prepared", date: "2026-10-13T15:10:00+08:00", location: "Склад в Китае", description: "Посылка подготовлена к отправке." },
      { stage: "departed", date: "2026-10-14T11:25:00+08:00", location: "Склад в Китае", description: "Посылка покинула склад отправителя." },
      { stage: "in_transit", date: "2026-10-16T08:00:00+06:00", location: "В пути", description: "Посылка следует по международному маршруту в Казахстан." },
    ],
  },
  {
    trackingNumber: "DEMO-READY-02",
    currentStage: "ready",
    origin: "Китай, склад отправителя",
    destination: "Казахстан, пункт выдачи",
    isDemo: true,
    events: [
      { stage: "accepted", date: "2026-09-20T10:05:00+08:00", location: "Склад в Китае", description: "Посылка принята на складе и зарегистрирована в системе." },
      { stage: "prepared", date: "2026-09-21T14:30:00+08:00", location: "Склад в Китае", description: "Посылка подготовлена к отправке." },
      { stage: "departed", date: "2026-09-22T09:15:00+08:00", location: "Склад в Китае", description: "Посылка покинула склад отправителя." },
      { stage: "in_transit", date: "2026-09-24T12:00:00+06:00", location: "В пути", description: "Посылка следует по международному маршруту в Казахстан." },
      { stage: "arrived", date: "2026-10-05T10:20:00+05:00", location: "Казахстан, распределительный центр", description: "Посылка прибыла в Казахстан." },
      { stage: "processing", date: "2026-10-06T13:45:00+05:00", location: "Казахстан, распределительный центр", description: "Посылка проходит обработку." },
      { stage: "ready", date: "2026-10-08T09:30:00+05:00", location: "Казахстан, пункт выдачи", description: "Посылка готова к получению." },
    ],
  },
  {
    trackingNumber: "DEMO-DELIVERED-03",
    currentStage: "delivered",
    origin: "Китай, склад отправителя",
    destination: "Казахстан, пункт выдачи",
    isDemo: true,
    events: [
      { stage: "accepted", date: "2026-08-02T10:00:00+08:00", location: "Склад в Китае", description: "Посылка принята на складе и зарегистрирована в системе." },
      { stage: "prepared", date: "2026-08-03T16:20:00+08:00", location: "Склад в Китае", description: "Посылка подготовлена к отправке." },
      { stage: "departed", date: "2026-08-04T09:00:00+08:00", location: "Склад в Китае", description: "Посылка покинула склад отправителя." },
      { stage: "in_transit", date: "2026-08-06T12:00:00+06:00", location: "В пути", description: "Посылка следует по международному маршруту в Казахстан." },
      { stage: "arrived", date: "2026-08-18T11:10:00+05:00", location: "Казахстан, распределительный центр", description: "Посылка прибыла в Казахстан." },
      { stage: "processing", date: "2026-08-19T10:00:00+05:00", location: "Казахстан, распределительный центр", description: "Посылка проходит обработку." },
      { stage: "ready", date: "2026-08-20T09:00:00+05:00", location: "Казахстан, пункт выдачи", description: "Посылка готова к получению." },
      { stage: "delivered", date: "2026-08-21T14:15:00+05:00", location: "Казахстан, пункт выдачи", description: "Посылка выдана получателю." },
    ],
  },
];
