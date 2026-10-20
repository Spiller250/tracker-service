"use client";

import { useState } from "react";
import { PlusIcon } from "./Icons";

const ITEMS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Где найти трек-номер?",
    a: "Трек-номер обычно указан в подтверждении отправки от продавца или отправителя. Если вы его не нашли, уточните номер у отправителя.",
  },
  {
    q: "Почему статус не появляется сразу?",
    a: "Данные обновляются по мере того, как посылку регистрируют на складах и в пунктах маршрута. После отправки информация может появиться не сразу — попробуйте проверить номер позже.",
  },
  {
    q: "Как понимать обновления в истории?",
    a: "История показывает события от новых к старым: дата, место и описание. Отмеченные этапы уже пройдены, текущий этап выделен, а следующие этапы показаны как ожидаемые. Набор этапов зависит от данных, которые получает система отслеживания.",
  },
  {
    q: "Что делать, если трек-номер не распознан?",
    a: "Проверьте, что номер введён без лишних символов (допустимы латинские буквы, цифры и дефис). Если ошибка повторяется, обратитесь к отправителю за уточнением номера или напишите в поддержку.",
  },
  {
    q: "Как связаться с поддержкой?",
    a: (
      <>
        Контакты поддержки указаны в <a href="#contacts">разделе «Контакты» внизу страницы</a>. Укажите там трек-номер и опишите вопрос.
      </>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {ITEMS.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="faq-item">
            <h3>
              <button
                type="button"
                className="faq-q"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{it.q}</span>
                <span className="faq-icon">
                  <PlusIcon width={18} height={18} />
                </span>
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-panel" data-open={isOpen} inert={!isOpen}>
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
