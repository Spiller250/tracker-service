import { demoProvider } from "./providers/demo";
import { normalizeTrackingNumber, validateTrackingNumber } from "./validate";
import type { TrackingResponse } from "./types";

/** Static hosting (GitHub Pages) has no server, so demo lookups run in the browser. */
const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC === "1";

async function lookupLocally(raw: string): Promise<TrackingResponse> {
  const error = validateTrackingNumber(raw);
  if (error) return { ok: false, code: "invalid_format", message: error };
  const shipment = await demoProvider.lookup(normalizeTrackingNumber(raw));
  if (!shipment) return { ok: false, code: "not_found", message: "Данные по этому трек-номеру не найдены." };
  return { ok: true, shipment };
}

/** Browser-side adapter: talks only to our own /api/track endpoint. */
export async function fetchShipment(trackingNumber: string, signal?: AbortSignal): Promise<TrackingResponse> {
  if (STATIC_MODE) return lookupLocally(trackingNumber);
  try {
    const res = await fetch(`/api/track?number=${encodeURIComponent(trackingNumber)}`, { signal, cache: "no-store" });
    return (await res.json()) as TrackingResponse;
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    return { ok: false, code: "network_error", message: "Нет соединения с сервером. Проверьте интернет и повторите попытку." };
  }
}
