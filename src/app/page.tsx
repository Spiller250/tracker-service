import Faq from "@/components/Faq";
import Header, { Logo } from "@/components/Header";
import { ArrowIcon } from "@/components/Icons";
import SceneLoader from "@/components/scene/SceneLoader";
import TrackingHero from "@/components/TrackingHero";
import { STAGE_LABEL, STAGE_ORDER } from "@/lib/tracking/types";

const STEPS = [
  { t: "Посылка поступает на склад в Китае", d: "Склад принимает посылку и регистрирует её в системе." },
  { t: "Подготавливается к отправке", d: "Посылку готовят к отправке в Казахстан." },
  { t: "Движется по маршруту в Казахстан", d: "В пути статус можно проверять по трек-номеру." },
  { t: "Прибывает в пункт назначения или готовится к выдаче", d: "После прибытия посылка проходит обработку и становится доступна к получению." },
];

const BENEFITS = [
  { t: "Удобная проверка статуса", d: "Один трек-номер — текущий статус посылки без регистрации и лишних шагов." },
  { t: "Понятная история отправления", d: "Все события в одном списке: дата, место и описание каждого этапа." },
  { t: "Доступная поддержка", d: "Если статус непонятен или номер не находится, к вопросу можно вернуться вместе с поддержкой." },
  { t: "Прозрачная информация", d: "Мы показываем только те данные, которые есть в системе, и отмечаем демонстрационные примеры." },
];

export default function Page() {
  return (
    <>
      <a href="#main" className="skip-link">Перейти к содержимому</a>
      <Header />
      <main id="main">
        <TrackingHero scene={<SceneLoader />} />

        {/* A. How it works */}
        <section id="how" className="section how" aria-labelledby="how-title">
          <div className="container">
            <p className="eyebrow">КАК РАБОТАЕТ</p>
            <h2 id="how-title" className="section-title" style={{ marginTop: 16 }}>Путь посылки из Китая в Казахстан</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.t} className="step">
                  <span className="step-num num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* B. Tracking explainer */}
        <section className="section" aria-labelledby="explain-title">
          <div className="container explain-grid">
            <div>
              <p className="eyebrow">ТРЕК-НОМЕР</p>
              <h2 id="explain-title" className="section-title" style={{ marginTop: 16 }}>Где найти трек-номер и как его ввести</h2>
              <ul className="explain-list">
                <li>
                  <span className="bullet" aria-hidden="true">1</span>
                  <div>
                    <strong>Найдите номер</strong>
                    <span>Он указан в подтверждении отправки от продавца или отправителя.</span>
                  </div>
                </li>
                <li>
                  <span className="bullet" aria-hidden="true">2</span>
                  <div>
                    <strong>Введите его в поле</strong>
                    <span>Допустимы латинские буквы, цифры и дефис. Пробелы по краям мы уберём сами.</span>
                  </div>
                </li>
                <li>
                  <span className="bullet" aria-hidden="true">3</span>
                  <div>
                    <strong>Нажмите «Отследить посылку»</strong>
                    <span>Вы увидите текущий статус и историю перемещения.</span>
                  </div>
                </li>
              </ul>
              <a href="#track" className="btn" style={{ marginTop: 32 }}>
                Перейти к форме <ArrowIcon />
              </a>
            </div>
            <div className="label-card" aria-hidden="true">
              <div className="label-row"><span>ОТПРАВЛЕНИЕ</span><span>КИТАЙ → КАЗАХСТАН</span></div>
              <div className="label-code">TRACK-000000</div>
              <div className="label-row"><span>Трек-номер — образец оформления</span></div>
              <div className="barcode" />
              <p className="label-note">Иллюстрация. Внешний вид накладной зависит от отправителя.</p>
            </div>
          </div>
        </section>

        {/* C. Delivery journey */}
        <section className="section journey on-dark" aria-labelledby="journey-title">
          <div className="container">
            <p className="eyebrow">МАРШРУТ</p>
            <h2 id="journey-title" className="section-title" style={{ marginTop: 16 }}>Какие статусы вы можете увидеть</h2>
            <p className="section-lead">Схема маршрута и возможные статусы отправления. Набор статусов зависит от данных, которые передаёт система отслеживания.</p>
            <svg className="route-svg" viewBox="0 0 1000 150" aria-hidden="true" focusable="false">
              <path d="M 40 110 C 220 10, 360 130, 520 70 S 800 10, 960 90" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 40 110 C 220 10, 360 130, 520 70 S 800 10, 960 90" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14" />
              <circle cx="40" cy="110" r="14" fill="#fff" />
              <circle cx="40" cy="110" r="6" fill="#d40511" />
              <circle cx="960" cy="90" r="14" fill="#fff" />
              <circle cx="960" cy="90" r="6" fill="#d40511" />
              <text x="40" y="146" fill="#fff" fontFamily="var(--font-heading)" fontWeight="800" fontSize="18" textAnchor="start">КИТАЙ</text>
              <text x="960" y="130" fill="#fff" fontFamily="var(--font-heading)" fontWeight="800" fontSize="18" textAnchor="end">КАЗАХСТАН</text>
            </svg>
            <ol className="status-grid" style={{ marginTop: 24 }}>
              {STAGE_ORDER.map((s, i) => (
                <li key={s}>
                  <span className="n num">{i + 1}</span>
                  {STAGE_LABEL[s]}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* D. Benefits */}
        <section className="section" aria-labelledby="benefits-title">
          <div className="container benefit-grid">
            <header>
              <p className="eyebrow">ПРЕИМУЩЕСТВА СЕРВИСА</p>
              <h2 id="benefits-title" className="section-title" style={{ marginTop: 16 }}>Информация о посылке — просто и открыто</h2>
            </header>
            <ul className="benefit-list">
              {BENEFITS.map((b, i) => (
                <li key={b.t}>
                  <span className="big num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{b.t}</h3>
                    <p>{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tariffs */}
        <section id="tariffs" className="section tariffs" aria-labelledby="tariffs-title">
          <div className="container">
            <p className="eyebrow">ТАРИФЫ</p>
            <h2 id="tariffs-title" className="section-title" style={{ marginTop: 16 }}>Стоимость доставки</h2>
            <div className="placeholder-box">
              <p>
                <span className="todo">Для владельца сервиса</span> Здесь будут размещены тарифы. Пока они не опубликованы, уточнить стоимость доставки можно в поддержке.
              </p>
              <a href="#contacts" className="btn btn-ghost">Контакты поддержки</a>
            </div>
          </div>
        </section>

        {/* E. FAQ / support */}
        <section id="support" className="section" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <header>
              <p className="eyebrow">ПОДДЕРЖКА</p>
              <h2 id="faq-title" className="section-title" style={{ marginTop: 16 }}>Частые вопросы</h2>
              <p className="section-lead">Не нашли ответ? Контакты поддержки — в самом низу страницы.</p>
            </header>
            <Faq />
          </div>
        </section>
      </main>

      {/* F. Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p className="footer-about">Отслеживание посылок и грузов на пути из Китая в Казахстан.</p>
            </div>
            <nav aria-label="Навигация в подвале">
              <h2>Навигация</h2>
              <ul>
                <li><a href="#top">Главная</a></li>
                <li><a href="#track">Отследить посылку</a></li>
                <li><a href="#how">Как работает</a></li>
                <li><a href="#tariffs">Тарифы</a></li>
                <li><a href="#support">Поддержка</a></li>
              </ul>
            </nav>
            <div id="contacts">
              <h2>Контакты</h2>
              <ul>
                <li><span className="todo">Телефон: [укажите номер]</span></li>
                <li><span className="todo">E-mail: [укажите адрес]</span></li>
                <li><span className="todo">Часы работы: [укажите]</span></li>
                <li><span className="todo">Адрес: [укажите]</span></li>
              </ul>
            </div>
            <div>
              <h2>О сервисе</h2>
              <ul>
                <li>Сейчас сайт работает в демо-режиме: результаты отслеживания — примеры.</li>
                <li><span className="todo">Политика конфиденциальности: [ссылка будет добавлена]</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} [CARGO BRAND]</span>
            <span>Жёлтым отмечены данные, которые должен указать владелец сервиса.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
