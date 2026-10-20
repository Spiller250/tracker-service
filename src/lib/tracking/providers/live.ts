import type { Shipment, TrackingProvider } from "../types";

/**
 * Template for a real integration. Runs on the server only.
 *
 * 1. Set TRACKING_MODE=live, TRACKING_API_URL and TRACKING_API_KEY.
 * 2. Adjust the request below to match your carrier API.
 * 3. Implement mapCarrierResponse() to convert the carrier payload to `Shipment`.
 *
 * Until step 3 is done the provider reports "not configured" instead of
 * returning invented data.
 */
export class NotConfiguredError extends Error {}

function mapCarrierResponse(_payload: unknown): Shipment | null {
  throw new NotConfiguredError("mapCarrierResponse() is not implemented");
}

export const liveProvider: TrackingProvider = {
  name: "live",
  async lookup(trackingNumber) {
    const base = process.env.TRACKING_API_URL;
    const key = process.env.TRACKING_API_KEY;
    if (!base || !key) throw new NotConfiguredError("TRACKING_API_URL / TRACKING_API_KEY missing");

    const res = await fetch(`${base.replace(/\/$/, "")}/${encodeURIComponent(trackingNumber)}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
    return mapCarrierResponse(await res.json());
  },
};
