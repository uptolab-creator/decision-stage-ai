import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProductsPush — Симулятор Project Manager в IT" },
      {
        name: "description",
        content:
          "Курс Project Management с симулятором реальных рабочих ситуаций. Тесты и практика в офисе. Учись сам, в своём темпе. ProductsPush, Бишкек.",
      },
      { property: "og:title", content: "ProductsPush — Симулятор Project Manager в IT" },
      {
        property: "og:description",
        content: "Курс Project Management с симулятором реальных рабочих ситуаций.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div>
      <style>{`
:root {
  --bg: #FFFFFF;
  --bg-soft: #F5F4FB;
  --ink: #14121C;
  --muted: #6B6680;
  --brand: #5B21FF;
  --brand-2: #7C54FF;
  --brand-soft: #EFEAFF;
  --blue: #4A9EFF;
  --teal: #00C9A7;
  --red: #FF6B6B;
  --orange: #FFB347;
  --purple: #7C6FCD;
  --border: rgba(20, 18, 28, 0.09);
  --card: #FFFFFF;
  --shadow: 0 12px 34px rgba(40, 20, 90, 0.08);
  --shadow-lg: 0 20px 50px rgba(40, 20, 90, 0.12);
  --radius: 16px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--ink); font-family: "Inter", system-ui, sans-serif; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
.mono { font-family: "JetBrains Mono", monospace; }
.container { width: min(1140px, 92vw); margin: 0 auto; }
a { color: inherit; text-decoration: none; }
.logo { display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 800; font-size: 1.15rem; letter-spacing: -0.02em; color: var(--ink); }
.logo img { width: 34px; height: 34px; border-radius: 9px; display: block; }
.logo b { color: var(--brand); font-weight: 800; }
.btn { display: inline-flex; align-items: center; gap: 0.5em; background: var(--brand); color: #fff; font-weight: 600; font-size: 1rem; padding: 0.85em 1.7em; border: none; border-radius: 12px; cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; box-shadow: 0 10px 26px rgba(91, 33, 255, 0.32); }
.btn:hover { transform: translateY(-2px); background: #4a14e0; box-shadow: 0 14px 34px rgba(91, 33, 255, 0.42); }
.btn-ghost { background: #fff; color: var(--ink); border: 1px solid var(--border); box-shadow: var(--shadow); }
.btn-ghost:hover { background: var(--bg-soft); border-color: rgba(91,33,255,0.3); }
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(255, 255, 255, 0.78); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); border-bottom: 1px solid var(--border); }
nav .container { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; }
header.landing-header { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 7rem 0 4rem; overflow: hidden; background: radial-gradient(ellipse 50% 45% at 80% 15%, rgba(91,33,255,0.10), transparent 70%), radial-gradient(ellipse 45% 40% at 10% 90%, rgba(0,201,167,0.08), transparent 70%), var(--bg); }
#hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.hero-inner { position: relative; z-index: 2; max-width: 780px; }
.hero-logo { width: 72px; height: 72px; border-radius: 18px; margin-bottom: 1.5rem; box-shadow: 0 14px 34px rgba(91,33,255,0.35); display: block; }
.badge { display: inline-flex; align-items: center; gap: 0.5em; font-size: 0.82rem; color: var(--brand); background: var(--brand-soft); border: 1px solid rgba(91,33,255,0.18); padding: 0.42em 0.95em; border-radius: 100px; margin-bottom: 1.6rem; font-weight: 500; }
.badge .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--brand); box-shadow: 0 0 10px var(--brand); }
h1 { font-size: clamp(2.5rem, 6vw, 4.6rem); font-weight: 900; line-height: 1.02; letter-spacing: -0.035em; color: var(--ink); margin-bottom: 1.2rem; }
h1 .grad { color: var(--brand); }
.subtitle { font-size: clamp(1.1rem, 2vw, 1.35rem); color: var(--muted); max-width: 580px; margin-bottom: 2.2rem; }
.hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
section.landing-section { position: relative; padding: 6rem 0; }
.section-soft { background: var(--bg-soft); }
.eyebrow { font-family: "JetBrains Mono", monospace; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.9rem; }
.section-title { font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 800; letter-spacing: -0.025em; color: var(--ink); margin-bottom: 1rem; }
.section-sub { color: var(--muted); max-width: 640px; font-size: 1.08rem; }
.card-base { background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow); border-radius: 20px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
.card { padding: 2rem 1.8rem; transition: transform 0.22s ease, box-shadow 0.22s ease; }
.card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.card .ico { font-size: 1.6rem; margin-bottom: 1.1rem; display: inline-grid; place-items: center; width: 54px; height: 54px; border-radius: 15px; background: var(--brand-soft); }
.card h3 { font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 0.6rem; }
.card p { color: var(--muted); font-size: 0.98rem; }
.tracks { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
.track { padding: 2rem; display: flex; flex-direction: column; transition: transform 0.22s ease, box-shadow 0.22s ease; }
.track:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.track .thead { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.5rem; }
.track .tico { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; font-size: 1.4rem; }
.track h3 { font-size: 1.4rem; color: var(--ink); font-weight: 800; }
.track .tdesc { color: var(--muted); margin: 0.4rem 0 1.4rem; }
.track .tlink { margin-top: auto; color: var(--brand); font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.4em; }
.track .tlink:hover { gap: 0.7em; }
.kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.4rem; }
.kcol { background: var(--bg-soft); border: 1px solid var(--border); border-radius: 12px; padding: 0.55rem; min-height: 92px; }
.kcol .ktitle { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.45rem; font-family: "JetBrains Mono", monospace; }
.kcard { background: #fff; border-radius: 8px; padding: 0.4rem 0.5rem; font-size: 0.66rem; margin-bottom: 0.35rem; border-left: 3px solid var(--brand); box-shadow: 0 2px 6px rgba(40,20,90,0.06); }
.kcol:nth-child(2) .kcard { border-left-color: var(--blue); }
.kcol:nth-child(3) .kcard { border-left-color: var(--teal); }
.levels { display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.4rem; }
.lvl { display: flex; align-items: center; gap: 0.7rem; background: var(--bg-soft); border: 1px solid var(--border); border-radius: 12px; padding: 0.6rem 0.8rem; }
.lvl .lnum { width: 27px; height: 27px; flex: none; border-radius: 9px; display: grid; place-items: center; font-size: 0.8rem; font-weight: 800; color: #fff; background: var(--brand); }
.lvl .ltxt { font-size: 0.86rem; }
.lvl.locked { opacity: 0.55; }
.lvl.locked .lnum { background: #C7C3D6; }
.graph-wrap { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; margin-top: 3rem; align-items: stretch; }
.graph-stage { position: relative; overflow: hidden; min-height: 540px; background: radial-gradient(circle at 50% 45%, rgba(91,33,255,0.05), transparent 70%), #fff; }
#skill-graph { width: 100%; height: 100%; display: block; min-height: 540px; }
.graph-hint { position: absolute; bottom: 14px; left: 16px; font-family: "JetBrains Mono", monospace; font-size: 0.72rem; color: var(--muted); opacity: 0.8; pointer-events: none; }
.node { cursor: pointer; }
.node .halo { transition: opacity 0.25s ease; }
.node .core { transition: r 0.22s cubic-bezier(.34,1.56,.64,1), filter 0.22s ease; }
.node .nlabel { font-size: 13px; font-weight: 600; fill: var(--ink); paint-order: stroke; stroke: #fff; stroke-width: 4px; }
.node .emoji { font-size: 22px; pointer-events: none; }
.edge { transition: stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease; }
.node.dim { opacity: 0.28; }
.node.active .core, .node:hover .core { filter: drop-shadow(0 0 14px currentColor); }
.edge.hot { opacity: 1 !important; stroke-width: 2.6 !important; }
.edge.cold { opacity: 0.1; }
.node, .edge { opacity: 0; }
.node.shown { opacity: 1; }
.edge.shown { opacity: 0.55; }
.panel { padding: 1.8rem; display: flex; flex-direction: column; min-height: 540px; }
.panel-empty { color: var(--muted); margin: auto; text-align: center; font-size: 0.95rem; }
.panel-empty .big { font-size: 2.4rem; display: block; margin-bottom: 0.8rem; opacity: 0.5; }
.panel-head { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.4rem; }
.panel-head .pemoji { width: 52px; height: 52px; flex: none; display: grid; place-items: center; border-radius: 14px; font-size: 1.6rem; background: var(--bg-soft); }
.panel h3 { font-size: 1.3rem; color: var(--ink); font-weight: 800; letter-spacing: -0.01em; }
.panel .pdesc { color: var(--muted); margin: 1rem 0 1.4rem; font-size: 1rem; }
.pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pill { font-size: 0.82rem; color: var(--ink); padding: 0.4em 0.85em; border-radius: 100px; border: 1px solid var(--border); background: var(--bg-soft); }
.panel-tag-label { font-family: "JetBrains Mono", monospace; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.7rem; }
.panel.show-anim { animation: panelIn 0.35s ease; }
@keyframes panelIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none; } }
.final-cta .cta-box { text-align: center; padding: 4rem 2rem; border-radius: 28px; color: #fff; background: linear-gradient(135deg, var(--brand), #7C54FF); box-shadow: 0 24px 60px rgba(91,33,255,0.35); }
.final-cta .eyebrow { color: rgba(255,255,255,0.85); }
.final-cta .section-title { color: #fff; margin-bottom: 1.2rem; }
.final-cta .section-sub { color: rgba(255,255,255,0.9); margin: 0 auto 2rem; }
.final-cta .btn { background: #fff; color: var(--brand); box-shadow: 0 10px 26px rgba(0,0,0,0.18); }
.final-cta .btn:hover { background: #f3f0ff; }
.calls-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 3rem; align-items: center; }
.calls-list { display: flex; flex-direction: column; gap: 1rem; }
.call-feat { display: flex; gap: 0.9rem; align-items: flex-start; }
.call-feat .cf-ico { width: 44px; height: 44px; flex: none; border-radius: 12px; display: grid; place-items: center; font-size: 1.25rem; background: var(--brand-soft); }
.call-feat h4 { font-size: 1.02rem; font-weight: 700; color: var(--ink); }
.call-feat p { font-size: 0.92rem; color: var(--muted); margin-top: 0.15rem; }
.zoom-mock { padding: 0; overflow: hidden; }
.zoom-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 1rem; background: #14121c; color: #fff; font-size: 0.78rem; }
.zoom-bar .live { display: inline-flex; align-items: center; gap: 0.4em; color: #00C9A7; }
.zoom-bar .live .pulse { width: 7px; height: 7px; border-radius: 50%; background: #00C9A7; box-shadow: 0 0 8px #00C9A7; }
.zoom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px; background: #0f0e16; }
.ztile { position: relative; aspect-ratio: 16/10; border-radius: 10px; background: linear-gradient(160deg, #211c33, #15121f); display: grid; place-items: center; text-align: center; }
.ztile .zav { font-size: 1.9rem; }
.ztile .zname { font-size: 0.8rem; font-weight: 600; color: #fff; margin-top: 0.2rem; }
.ztile .zrole { font-size: 0.66rem; color: rgba(255,255,255,0.55); }
.ztile .zmood { position: absolute; left: 6px; bottom: 6px; font-size: 0.6rem; padding: 0.12rem 0.4rem; border-radius: 5px; background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.75); }
.zoom-reply { padding: 0.85rem 1rem; background: #14121c; }
.zoom-reply .zr-label { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; font-family: "JetBrains Mono", monospace; }
.zoom-reply .tones { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.zoom-reply .tone { font-size: 0.72rem; padding: 0.3rem 0.6rem; border-radius: 7px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.1); }
.zoom-reply .tone.hot { background: var(--brand); border-color: var(--brand); color: #fff; }
footer.landing-footer { border-top: 1px solid var(--border); padding: 2.5rem 0; color: var(--muted); font-size: 0.9rem; }
footer.landing-footer .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
@media (max-width: 860px) {
  .cards, .tracks { grid-template-columns: 1fr; }
  .graph-wrap { grid-template-columns: 1fr; }
  .calls-wrap { grid-template-columns: 1fr; gap: 1.8rem; }
  .graph-stage, #skill-graph { min-height: 460px; }
  .panel { min-height: auto; }
  nav .btn { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .card, .track, .btn { transition: none; }
  .node, .edge { opacity: 1; }
  .edge { opacity: 0.55; }
}
      `}</style>

      <nav>
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/favicon.png" alt="ProductsPush" />
            Products<b>Push</b>
          </a>
          <Link to="/auth" className="btn">
            Начать бесплатно →
          </Link>
        </div>
      </nav>

      <header className="landing-header">
        <div className="container">
          <div className="hero-inner">
            <img className="hero-logo" src="/assets/favicon.png" alt="ProductsPush" />
            <span className="badge">
              <span className="dot" /> Симулятор · Бишкек · ProductsPush
            </span>
            <h1>
              <span className="grad">Project Management</span> Simulator
            </h1>
            <p className="subtitle">
              Симулятор реальных рабочих ситуаций — быстрее, увереннее и в кайф. Учись сам, в своём
              темпе, без ментора.
            </p>
            <div className="hero-cta">
              <Link to="/course" className="btn">
                Начать бесплатно →
              </Link>
              <a href="#graph" className="btn btn-ghost">
                Посмотреть навыки
              </a>
            </div>
          </div>
        </div>
      </header>

      <Section id="why">
        <div className="eyebrow">// почему симулятор</div>
        <h2 className="section-title">Не курс лекций, а тренажёр</h2>
        <p className="section-sub">
          Ты не смотришь часами видео. Ты попадаешь в рабочие ситуации и принимаешь решения — как
          настоящий PM.
        </p>
        <div className="cards">
          <div className="card card-base">
            <span className="ico">🎮</span>
            <h3>Учишься через практику</h3>
            <p>
              Никакой сухой теории. Сначала минимум контекста, потом — задача, которую нужно решить.
            </p>
          </div>
          <div className="card card-base">
            <span className="ico">⚡</span>
            <h3>Без расписания</h3>
            <p>
              Открываешь когда удобно и проходишь в своём темпе. Никаких созвонов и дедлайнов от
              ментора.
            </p>
          </div>
          <div className="card card-base">
            <span className="ico">🎯</span>
            <h3>Реальные кейсы</h3>
            <p>
              Ситуации из аутсорс-компаний и продуктовых команд Бишкека — то, с чем работаешь каждый
              день.
            </p>
          </div>
        </div>
      </Section>

      <Section id="tracks" className="section-soft">
        <div className="eyebrow">// как устроено</div>
        <h2 className="section-title">Два формата обучения</h2>
        <p className="section-sub">
          Прокачиваешь теорию через тесты и закрепляешь в практике офисных ситуаций.
        </p>
        <div className="tracks">
          <div className="track card-base">
            <div className="thead">
              <div className="tico" style={{ background: "rgba(74,158,255,0.14)" }}>
                🧩
              </div>
              <h3>Тесты</h3>
            </div>
            <p className="tdesc">
              Темы PM в формате канбан-доски: задания едут от To do к Done, за верные ответы —
              иконки и салют.
            </p>
            <div className="kanban">
              <div className="kcol">
                <div className="ktitle">To do</div>
                <div className="kcard">Scrum-роли</div>
                <div className="kcard">Риски</div>
              </div>
              <div className="kcol">
                <div className="ktitle">In progress</div>
                <div className="kcard">User Stories</div>
              </div>
              <div className="kcol">
                <div className="ktitle">Done</div>
                <div className="kcard">Коммуникация ✓</div>
              </div>
            </div>
            <Link to="/course" className="tlink">
              Пройти тесты →
            </Link>
          </div>
          <div className="track card-base">
            <div className="thead">
              <div className="tico" style={{ background: "rgba(0,201,167,0.14)" }}>
                🏢
              </div>
              <h3>Практика в офисе</h3>
            </div>
            <p className="tdesc">
              Отдельный трек по уровням: отвечаешь тимлидам, команде и заказчикам и решаешь задачи
              как настоящий PM.
            </p>
            <div className="levels">
              <div className="lvl">
                <div className="lnum">1</div>
                <div className="ltxt">Онбординг в проект</div>
              </div>
              <div className="lvl">
                <div className="lnum">2</div>
                <div className="ltxt">Спринт и конфликты в команде</div>
              </div>
              <div className="lvl locked">
                <div className="lnum">3</div>
                <div className="ltxt">Защита бюджета перед клиентом</div>
              </div>
            </div>
            <Link to="/course" className="tlink">
              Войти в офис →
            </Link>
          </div>
        </div>
      </Section>

      <Section id="calls">
        <div className="eyebrow">// звонки</div>
        <h2 className="section-title">Звонки с AI-собеседниками</h2>
        <p className="section-sub">
          Отдельный блок: тренируй реальные разговоры проектного менеджера. AI отвечает в роли,
          раскрывает скрытую информацию и оценивает твой управленческий вывод.
        </p>
        <div className="calls-wrap">
          <div className="calls-list">
            <div className="call-feat">
              <div className="cf-ico">🧑‍💼</div>
              <div>
                <h4>Заказчик меняет требования</h4>
                <p>
                  Отрабатывай переговоры о scope, сроках и бюджете, не теряя контроль над проектом.
                </p>
              </div>
            </div>
            <div className="call-feat">
              <div className="cf-ico">👨‍💻</div>
              <div>
                <h4>Тимлид и команда</h4>
                <p>Уточняй статус, снимай блокеры и риски, договаривайся о приоритетах.</p>
              </div>
            </div>
            <div className="call-feat">
              <div className="cf-ico">🎯</div>
              <div>
                <h4>AI оценивает вывод</h4>
                <p>
                  После звонка нужно сформулировать управленческое решение — его проверяет AI по
                  критериям.
                </p>
              </div>
            </div>
            <Link
              to="/course"
              className="btn"
              style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}
            >
              Попробовать звонок →
            </Link>
          </div>
          <div className="card-base zoom-mock">
            <div className="zoom-bar">
              <span>🎥 Zoom · Синк по проекту</span>
              <span className="live">
                <span className="pulse" /> в эфире
              </span>
            </div>
            <div className="zoom-grid">
              <div className="ztile">
                <div>
                  <div className="zav">🧔</div>
                  <div className="zname">Артём</div>
                  <div className="zrole">Тимлид</div>
                </div>
                <span className="zmood">напряжён</span>
              </div>
              <div className="ztile">
                <div>
                  <div className="zav">👩</div>
                  <div className="zname">Мария</div>
                  <div className="zrole">Заказчик</div>
                </div>
                <span className="zmood">торопит</span>
              </div>
              <div className="ztile">
                <div>
                  <div className="zav">🧑‍💻</div>
                  <div className="zname">Денис</div>
                  <div className="zrole">Разработчик</div>
                </div>
              </div>
              <div className="ztile">
                <div>
                  <div className="zav">🙂</div>
                  <div className="zname">Ты</div>
                  <div className="zrole">PM</div>
                </div>
              </div>
            </div>
            <div className="zoom-reply">
              <div className="zr-label">Твоя реплика — выбери тон</div>
              <div className="tones">
                <span className="tone hot">Директивно</span>
                <span className="tone">Поддерживающе</span>
                <span className="tone">Делегирующе</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="graph">
        <div className="eyebrow">// граф навыков</div>
        <h2 className="section-title">Что ты освоишь</h2>
        <p className="section-sub">
          8 ключевых навыков Project Manager и связи между ними. Узлы живут и двигаются — нажми на
          любой, чтобы раскрыть детали.
        </p>
        <SkillGraph />
      </Section>

      <Section id="start" className="final-cta">
        <div className="cta-box">
          <div className="eyebrow" style={{ textAlign: "center" }}>
            // старт
          </div>
          <h2 className="section-title">Готов пройти симулятор?</h2>
          <p className="section-sub">
            Открой первый тест прямо сейчас. Бесплатно, без расписания, в своём темпе.
          </p>
          <Link to="/course" className="btn">
            Начать бесплатно →
          </Link>
        </div>
      </Section>

      <footer className="landing-footer">
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/favicon.png" alt="ProductsPush" />
            Products<b>Push</b>
          </a>
          <div className="mono">Бишкек · Project Management Simulator · © 2026</div>
        </div>
      </footer>

      <HeroCanvas />
    </div>
  );
}

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`landing-section${className ? ` ${className}` : ""}`}>
      <div className="container">{children}</div>
    </section>
  );
}

function SkillGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const NODES_DATA = [
      {
        id: "comm",
        emoji: "💬",
        color: "#7C6FCD",
        label: "Коммуникация",
        x: 200,
        y: 175,
        desc: "Упоминается в 90%+ вакансий. Самый частый пункт.",
        tags: [
          "Объяснять сложное просто",
          "Переговоры с заказчиком",
          "Письменная речь",
          "Фасилитация встреч",
        ],
      },
      {
        id: "tasks",
        emoji: "📋",
        color: "#4A9EFF",
        label: "Управление задачами",
        x: 690,
        y: 415,
        desc: "Планирование, дедлайны, контроль выполнения.",
        tags: ["Scrum / Agile", "Jira / Trello", "Roadmap", "Gantt chart", "Sprint planning"],
      },
      {
        id: "docs",
        emoji: "📄",
        color: "#00C9A7",
        label: "Документация и ТЗ",
        x: 410,
        y: 300,
        desc: "Умение формализовать — ключ к аутсорсу.",
        tags: ["Написание ТЗ", "User Stories", "Use Cases", "Acceptance criteria", "Confluence"],
      },
      {
        id: "risk",
        emoji: "⚠️",
        color: "#FF6B6B",
        label: "Управление рисками",
        x: 865,
        y: 285,
        desc: "Предвидеть проблемы до того как они случились.",
        tags: ["Risk matrix", "Mitigation plan", "Change management", "Эскалация"],
      },
      {
        id: "it",
        emoji: "💻",
        color: "#4A9EFF",
        label: "Понимание IT",
        x: 625,
        y: 175,
        desc: "Не кодить, но понимать как устроена разработка.",
        tags: ["Frontend / Backend", "API / HTTP", "Git basics", "SDLC", "QA процесс"],
      },
      {
        id: "team",
        emoji: "👥",
        color: "#7C6FCD",
        label: "Работа с командой",
        x: 130,
        y: 380,
        desc: "Лидерство без полномочий — типичная ситуация PM.",
        tags: ["Мотивация команды", "Разрешение конфликтов", "1:1 встречи", "Делегирование"],
      },
      {
        id: "money",
        emoji: "💰",
        color: "#00C9A7",
        label: "Бюджет и финансы",
        x: 880,
        y: 510,
        desc: "Смета, P&L проекта, защита бюджета перед клиентом.",
        tags: ["Смета проекта", "Unit-экономика", "Финмодель", "Контроль бюджета"],
      },
      {
        id: "ai",
        emoji: "🤖",
        color: "#FFB347",
        label: "AI-инструменты",
        x: 520,
        y: 520,
        desc: "С 2024 работодатели добавляют в требования явно.",
        tags: ["ChatGPT / Claude", "Автоматизация задач", "Промптинг", "AI для документации"],
      },
    ];
    const EDGES: [string, string][] = [
      ["comm", "team"],
      ["comm", "docs"],
      ["tasks", "risk"],
      ["tasks", "it"],
      ["docs", "it"],
      ["money", "risk"],
      ["ai", "docs"],
      ["ai", "tasks"],
    ];

    const svg = svgRef.current;
    const panel = panelRef.current;
    if (!svg) return;

    const SVGNS = "http://www.w3.org/2000/svg";
    // NOTE: map to the SAME node objects (not copies) — the animation loop
    // writes cx/cy onto NODES_DATA items, and the edges read them back via
    // nodeById. Spreading here would leave cx/cy undefined and spam the
    // console with "<line> attribute x1: Expected length, undefined" errors.
    const nodeById = Object.fromEntries(NODES_DATA.map((n) => [n.id, n]));
    const neighbors: Record<string, Set<string>> = Object.fromEntries(
      NODES_DATA.map((n) => [n.id, new Set()]),
    );
    EDGES.forEach(([a, b]) => {
      neighbors[a].add(b);
      neighbors[b].add(a);
    });

    const edgeEls: SVGLineElement[] = [];
    const nodeEls: Record<string, SVGGElement> = {};
    let selectedId: string | null = null;

    NODES_DATA.forEach((n) => {
      (n as any).bx = n.x;
      (n as any).by = n.y;
      (n as any).cx = n.x;
      (n as any).cy = n.y;
      (n as any).ph = Math.random() * Math.PI * 2;
      (n as any).ph2 = Math.random() * Math.PI * 2;
      (n as any).ax = 12 + Math.random() * 10;
      (n as any).ay = 10 + Math.random() * 10;
      (n as any).sp = 0.25 + Math.random() * 0.25;
    });

    EDGES.forEach(([a, b]) => {
      const n1 = nodeById[a],
        n2 = nodeById[b];
      const line = document.createElementNS(SVGNS, "line") as SVGLineElement;
      line.setAttribute("x1", String(n1.x));
      line.setAttribute("y1", String(n1.y));
      line.setAttribute("x2", String(n2.x));
      line.setAttribute("y2", String(n2.y));
      line.setAttribute("stroke", "rgba(91, 33, 255, 0.28)");
      line.setAttribute("stroke-width", "1.6");
      line.classList.add("edge");
      line.dataset.a = a;
      line.dataset.b = b;
      svg.appendChild(line);
      edgeEls.push(line);
    });

    NODES_DATA.forEach((n) => {
      const g = document.createElementNS(SVGNS, "g") as SVGGElement;
      g.classList.add("node");
      g.setAttribute("transform", `translate(${n.x}, ${n.y})`);
      g.style.color = n.color;
      g.dataset.id = n.id;

      const halo = document.createElementNS(SVGNS, "circle");
      halo.setAttribute("r", "44");
      halo.setAttribute("fill", n.color);
      halo.setAttribute("opacity", "0.14");
      halo.classList.add("halo");

      const core = document.createElementNS(SVGNS, "circle");
      core.setAttribute("r", "30");
      core.setAttribute("fill", n.color);
      core.classList.add("core");

      const emoji = document.createElementNS(SVGNS, "text");
      emoji.setAttribute("text-anchor", "middle");
      emoji.setAttribute("dominant-baseline", "central");
      emoji.setAttribute("y", "1");
      emoji.classList.add("emoji");
      emoji.textContent = n.emoji;

      const label = document.createElementNS(SVGNS, "text");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("y", "58");
      label.classList.add("nlabel");
      label.textContent = n.label;

      g.append(halo, core, emoji, label);
      svg.appendChild(g);
      nodeEls[n.id] = g;

      function highlight(id: string) {
        const keep = new Set([id, ...neighbors[id]]);
        NODES_DATA.forEach((nn) => nodeEls[nn.id].classList.toggle("dim", !keep.has(nn.id)));
        edgeEls.forEach((e) => {
          const hot = e.dataset.a === id || e.dataset.b === id;
          e.classList.toggle("hot", hot);
          e.classList.toggle("cold", !hot);
        });
        setCore(id, 36);
      }
      function clearHighlight() {
        NODES_DATA.forEach((nn) => {
          nodeEls[nn.id].classList.remove("dim");
          setCore(nn.id, 30);
        });
        edgeEls.forEach((e) => e.classList.remove("hot", "cold"));
      }
      function setCore(id: string, r: number) {
        const el = nodeEls[id];
        if (el) {
          el.querySelector(".core")?.setAttribute("r", String(r));
          el.querySelector(".halo")?.setAttribute("r", String(r + 14));
        }
      }
      function selectNode(id: string) {
        selectedId = id;
        NODES_DATA.forEach((nn) => nodeEls[nn.id].classList.toggle("active", nn.id === id));
        highlight(id);
        renderPanel(nodeById[id]);
      }
      function hexA(hex: string, a: number) {
        const h = hex.replace("#", "");
        const r = parseInt(h.slice(0, 2), 16),
          g = parseInt(h.slice(2, 4), 16),
          b = parseInt(h.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      function renderPanel(n: (typeof NODES_DATA)[number]) {
        if (!panel) return;
        panel.classList.remove("show-anim");
        void panel.offsetWidth;
        panel.classList.add("show-anim");
        panel.innerHTML = `
          <div class="panel-head"><div class="pemoji" style="background:${hexA(n.color, 0.16)}">${n.emoji}</div><h3>${n.label}</h3></div>
          <p class="pdesc">${n.desc}</p>
          <div class="panel-tag-label">навыки</div>
          <div class="pills">${n.tags.map((t) => `<span class="pill" style="border-color:${hexA(n.color, 0.35)};background:${hexA(n.color, 0.1)}">${t}</span>`).join("")}</div>`;
      }

      g.addEventListener("mouseenter", () => {
        if (!selectedId) highlight(n.id);
      });
      g.addEventListener("mouseleave", () => {
        if (!selectedId) clearHighlight();
      });
      g.addEventListener("click", () => selectNode(n.id));
    });

    let animId: number;
    const t0 = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function animateGraph(now: number) {
      const t = (now - t0) / 1000;
      NODES_DATA.forEach((n) => {
        const d = n as any;
        d.cx = d.bx + Math.sin(t * d.sp + d.ph) * d.ax;
        d.cy = d.by + Math.cos(t * d.sp * 0.9 + d.ph2) * d.ay;
        nodeEls[n.id]?.setAttribute("transform", `translate(${d.cx}, ${d.cy})`);
      });
      edgeEls.forEach((e) => {
        const a = nodeById[e.dataset.a!],
          b = nodeById[e.dataset.b!];
        if (a && b) {
          e.setAttribute("x1", String((a as any).cx));
          e.setAttribute("y1", String((a as any).cy));
          e.setAttribute("x2", String((b as any).cx));
          e.setAttribute("y2", String((b as any).cy));
        }
      });
      if (!reduceMotion) animId = requestAnimationFrame(animateGraph);
    }
    if (!reduceMotion) animId = requestAnimationFrame(animateGraph);

    function revealGraph() {
      edgeEls.forEach((e, i) => setTimeout(() => e.classList.add("shown"), i * 80));
      const base = edgeEls.length * 80;
      NODES_DATA.forEach((n, i) =>
        setTimeout(() => nodeEls[n.id]?.classList.add("shown"), base + i * 80),
      );
    }
    const graphObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            revealGraph();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    graphObserver.observe(svg);

    return () => {
      graphObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    };
  }, []);

  return (
    <div className="graph-wrap">
      <div className="graph-stage card-base">
        <svg
          ref={svgRef}
          id="skill-graph"
          viewBox="0 0 1000 640"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Граф навыков Project Manager"
        />
        <div className="graph-hint mono">click node → детали · hover → связи</div>
      </div>
      <aside ref={panelRef} className="panel card-base" id="panel">
        <div className="panel-empty" id="panel-empty">
          <span className="big">🕸️</span>
          Выбери навык на графе слева, чтобы увидеть описание и теги.
        </div>
      </aside>
    </div>
  );
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#5B21FF", "#4A9EFF", "#00C9A7"];
    let w: number, h: number, dpr: number;
    let pts: { x: number; y: number; vx: number; vy: number; r: number; c: string }[] = [];
    let animId: number;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 24000);
      pts = Array.from({ length: Math.max(24, Math.min(60, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 2 + 1.1,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x,
            dy = p.y - q.y,
            d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150) {
            const a = (1 - Math.sqrt(d2) / 150) * 0.16;
            ctx!.strokeStyle = `rgba(91, 33, 255, ${a})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.c;
        ctx!.globalAlpha = 0.5;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
      if (!reduce) animId = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}
