/** Carrier-independent shipment model. The UI depends only on these types. */

export type ShipmentStage =
  | "accepted" // Принято на складе в Китае
  | "prepared" // Подготовлено к отправке
  | "departed" // Покинуло склад отправителя
  | "in_transit" // В международном пути
  | "arrived" // Прибыло в Казахстан
  | "processing" // Проходит обработку
  | "ready" // Готово к получению
  | "delivered"; // Доставлено

export interface TrackingEvent {
  stage: ShipmentStage;
  /** ISO 8601 timestamp */
  date: string;
  location: string;
  description: string;
}

export interface Shipment {
  trackingNumber: string;
  /** Current stage; corresponds to the latest event. */
  currentStage: ShipmentStage;
  origin: string;
  destination: string;
  /** ISO date. Only set when supplied by reliable data. */
  estimatedDelivery?: string;
  /** Events, oldest first. */
  events: TrackingEvent[];
  /** True for sample records that do not describe a real parcel. */
  isDemo: boolean;
}

export type TrackingErrorCode =
  | "invalid_format"
  | "not_found"
  | "not_configured"
  | "upstream_error"
  | "network_error";

export type TrackingResponse =
  | { ok: true; shipment: Shipment }
  | { ok: false; code: TrackingErrorCode; message: string };

/** Implement this to connect a real carrier / logistics backend. */
export interface TrackingProvider {
  readonly name: string;
  /** Resolve to null when the number is unknown. */
  lookup(trackingNumber: string): Promise<Shipment | null>;
}

export const STAGE_ORDER: ShipmentStage[] = [
  "accepted",
  "prepared",
  "departed",
  "in_transit",
  "arrived",
  "processing",
  "ready",
  "delivered",
];

export const STAGE_LABEL: Record<ShipmentStage, string> = {
  accepted: "Принято на складе в Китае",
  prepared: "Подготовлено к отправке",
  departed: "Покинуло склад отправителя",
  in_transit: "В международном пути",
  arrived: "Прибыло в Казахстан",
  processing: "Проходит обработку",
  ready: "Готово к получению",
  delivered: "Доставлено",
};
