import { DEMO_SHIPMENTS } from "@/data/demo-shipments";
import type { TrackingProvider } from "../types";

export const demoProvider: TrackingProvider = {
  name: "demo",
  async lookup(trackingNumber) {
    // Small artificial delay so the loading state is visible in demo mode.
    await new Promise((r) => setTimeout(r, 700));
    return DEMO_SHIPMENTS.find((s) => s.trackingNumber === trackingNumber) ?? null;
  },
};
