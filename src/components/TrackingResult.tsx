import { forwardRef } from "react";
import { STAGE_LABEL, STAGE_ORDER, type Shipment } from "@/lib/tracking/types";
import { AlertIcon, BoxIcon, CheckIcon } from "./Icons";

const TZ = "Asia/Almaty";
const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ });

const TrackingResult = forwardRef<HTMLElement, { shipment: Shipment }>(function TrackingResult({ shipment }, ref) {
  const { events, currentStage } = shipment;
  const last = events[events.length - 1];
  const reached = new Set(events.map((e) => e.stage));
  const upcoming = STAGE_ORDER.slice(STAGE_ORDER.indexOf(currentStage) + 1).filter((s) => !reached.has(s));
  const delivered = currentStage === "delivered";

  return (
    <article ref={ref} className="result" tabIndex={-1} aria-labelledby="result-title">
      {shipment.isDemo && (
        <div className="demo-banner" role="note">
          <AlertIcon style={{ flex: "none", marginTop: 2 }} />
          <span>Демо-режим: это пример отслеживания, а не данные реальной посылки.</span>
        </div>
      )}

      <div className="result-head">
        <div>
          <p className="result-kicker">ТРЕК-НОМЕР</p>
          <h2 id="result-title" className="result-number">
            {shipment.trackingNumber}
          </h2>
        </div>
        <div className={`status-pill${delivered ? " done" : ""}`}>
          {delivered ? <CheckIcon /> : <BoxIcon />}
          <span>
            <span style={{ opacity: 0.85, fontWeight: 600, fontSize: "0.8125rem", display: "block", lineHeight: 1.2 }}>Статус</span>
            {STAGE_LABEL[currentStage]}
          </span>
        </div>
      </div>

      <dl className="meta">
        <div>
          <dt>Маршрут</dt>
          <dd>
            {shipment.origin} <span aria-label="в">→</span> {shipment.destination}
          </dd>
        </div>
        <div>
          <dt>Последнее обновление</dt>
          <dd className="num">
            {dateTimeFmt.format(new Date(last.date))}
            <span className="sub">{last.location}</span>
          </dd>
        </div>
        {shipment.estimatedDelivery && (
          <div>
            <dt>Ожидаемая дата доставки</dt>
            <dd className="num">{dateFmt.format(new Date(shipment.estimatedDelivery))}</dd>
          </div>
        )}
      </dl>

      <div className="timeline-wrap">
        <h3 className="timeline-title">История перемещения</h3>
        <ol className="tl">
          {[...events].reverse().map((e, i) => {
            const isActive = i === 0 && !delivered;
            return (
              <li key={e.date + e.stage} className={`tl-item ${isActive ? "active" : "done"}`} aria-current={isActive ? "step" : undefined}>
                <span className="tl-dot">{!isActive && <CheckIcon width={16} height={16} />}</span>
                <div className="tl-body">
                  <span className={`tl-state${isActive ? "" : " muted"}`}>{isActive ? "Текущий статус" : "Выполнено"}</span>
                  <p className="tl-name">{STAGE_LABEL[e.stage]}</p>
                  <p className="tl-meta">
                    {dateTimeFmt.format(new Date(e.date))} · {e.location}
                  </p>
                  <p className="tl-desc">{e.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {upcoming.length > 0 && (
          <>
            <h3 className="timeline-title" style={{ marginTop: 28 }}>Следующие этапы</h3>
            <ol className="tl">
              {upcoming.map((s) => (
                <li key={s} className="tl-item upcoming">
                  <span className="tl-dot" />
                  <div className="tl-body">
                    <span className="tl-state muted">Ожидается</span>
                    <p className="tl-name">{STAGE_LABEL[s]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
        <p className="tz-note">События — от новых к старым. Время указано по Алматы (UTC+5).</p>
      </div>
    </article>
  );
});

export default TrackingResult;
