"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { fetchShipment } from "@/lib/tracking/client";
import type { Shipment } from "@/lib/tracking/types";
import { normalizeTrackingNumber, validateTrackingNumber } from "@/lib/tracking/validate";
import { AlertIcon } from "./Icons";
import TrackingResult from "./TrackingResult";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; shipment: Shipment };

const DEMO_NUMBERS = ["DEMO-TRANSIT-01", "DEMO-READY-02", "DEMO-DELIVERED-03"];

export default function TrackingHero({ scene }: { scene: ReactNode }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const abort = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    if (state.kind === "success") {
      resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  async function run(raw: string) {
    const problem = validateTrackingNumber(raw);
    if (problem) {
      setState({ kind: "error", message: problem });
      inputRef.current?.focus();
      return;
    }
    const number = normalizeTrackingNumber(raw);
    setValue(number);
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    setState({ kind: "loading" });
    try {
      const res = await fetchShipment(number, ctrl.signal);
      setState(res.ok ? { kind: "success", shipment: res.shipment } : { kind: "error", message: res.message });
    } catch {
      /* superseded by a newer request */
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(value);
  }

  const loading = state.kind === "loading";
  const invalid = state.kind === "error";

  return (
    <>
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow rise" style={{ ["--i" as string]: 0 }}>ДОСТАВКА ИЗ КИТАЯ В КАЗАХСТАН</p>
            <h1 id="hero-title" className="rise" style={{ ["--i" as string]: 1 }}>
              Твоя посылка. <em>Под полным контролем.</em>
            </h1>
            <p className="hero-lead rise" style={{ ["--i" as string]: 2 }}>
              Введите трек-номер, чтобы увидеть текущий статус посылки и историю её перемещения на пути из Китая в Казахстан.
            </p>

            <div id="track" className="track-card rise" style={{ ["--i" as string]: 3 }}>
              <form onSubmit={onSubmit} noValidate>
                <label htmlFor="tracking-number" className="track-label">
                  Трек-номер
                </label>
                <div className="track-row">
                  <input
                    ref={inputRef}
                    id="tracking-number"
                    name="tracking-number"
                    className="track-input"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="Введите трек-номер"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby="track-help track-status"
                  />
                  <button type="submit" className="btn track-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Ищем…
                      </>
                    ) : (
                      "Отследить посылку"
                    )}
                  </button>
                </div>
                <p id="track-help" className="track-help">
                  Трек-номер указан в подтверждении отправки от продавца или отправителя.
                </p>
                <div id="track-status" className={`track-msg ${invalid ? "error" : "info"}`} role={invalid ? "alert" : "status"} aria-live="polite">
                  {invalid && (
                    <>
                      <AlertIcon style={{ flex: "none", marginTop: 2 }} />
                      <span>{state.message}</span>
                    </>
                  )}
                  {loading && "Запрашиваем данные…"}
                  {state.kind === "success" && "Данные найдены — результат ниже."}
                </div>
              </form>

              <div className="demo-row">
                <span>Демо-режим, примеры номеров:</span>
                {DEMO_NUMBERS.map((n) => (
                  <button key={n} type="button" className="chip" disabled={loading} onClick={() => void run(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-stage rise" style={{ ["--i" as string]: 2 }}>
            {scene}
          </div>
        </div>
      </section>

      {state.kind === "success" && (
        <section className="result-section" aria-label="Результат отслеживания">
          <div className="container">
            <TrackingResult ref={resultRef} shipment={state.shipment} />
          </div>
        </section>
      )}
    </>
  );
}
