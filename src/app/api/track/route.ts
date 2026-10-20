import { NextResponse } from "next/server";
import { demoProvider } from "@/lib/tracking/providers/demo";
import { liveProvider, NotConfiguredError } from "@/lib/tracking/providers/live";
import { normalizeTrackingNumber, validateTrackingNumber } from "@/lib/tracking/validate";
import type { TrackingResponse } from "@/lib/tracking/types";

export const dynamic = "force-dynamic";

function reply(body: TrackingResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("number") ?? "";
  const error = validateTrackingNumber(raw);
  if (error) return reply({ ok: false, code: "invalid_format", message: error }, 400);

  const number = normalizeTrackingNumber(raw);
  const provider = process.env.TRACKING_MODE === "live" ? liveProvider : demoProvider;

  try {
    const shipment = await provider.lookup(number);
    if (!shipment)
      return reply({ ok: false, code: "not_found", message: "Данные по этому трек-номеру не найдены." }, 404);
    return reply({ ok: true, shipment });
  } catch (e) {
    if (e instanceof NotConfiguredError)
      return reply({ ok: false, code: "not_configured", message: "Подключение к системе отслеживания ещё не настроено." }, 501);
    return reply({ ok: false, code: "upstream_error", message: "Не удалось получить данные. Попробуйте позже." }, 502);
  }
}
