"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../lib/site";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ---------- helpers ---------- */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.18 });
    document.querySelectorAll("[data-r]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
const Split = ({ text, className = "" }) => (
  <span className={`split ${className}`} data-r aria-label={text}>
    {text.split(" ").map((w, i) => (<span className="w" key={i} aria-hidden><span style={{ "--i": i }}>{w}&nbsp;</span></span>))}
  </span>
);
function Count({ n, s }) {
  const ref = useRef(); const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(); const tick = (t) => { const p = Math.min((t - t0) / 1800, 1); setV(Math.round(n * (1 - Math.pow(1 - p, 4)))); p < 1 && requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(ref.current); return () => io.disconnect();
  }, [n]);
  return <span ref={ref}>{v}{s}</span>;
}

/* ---------- hero: pixel-dome wave canvas ---------- */
function Waves() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, x = c.getContext("2d"); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, mx = -1e3, my = -1e3; const t0 = performance.now();
    const size = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const mv = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const draw = (t) => {
      const s = calm ? 0 : (t - t0) / 1000; x.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.5, R = Math.min(w * 0.48, h * 0.62), g = Math.max(7, Math.round(R / 48));
      for (let py = cy - R; py <= cy + R; py += g) for (let px = cx - R; px <= cx + R; px += g) {
        const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy); if (d > R) continue;
        const a = Math.atan2(dy, dx), k = d / R;
        let v = Math.sin(d * 0.04 - s * 1.7 + Math.sin(a * 3 + s * 0.7) * 1.9) * 0.5 + 0.5; // swirling wave
        v *= 0.35 + 0.65 * Math.sin(Math.PI * Math.min(k * 1.05, 1)) ** 0.5;
        const m = Math.hypot(px - mx, py - my), near = Math.max(0, 1 - m / 150); v += near * (0.5 + 0.5 * Math.sin(m * 0.09 - s * 7));
        const rim = Math.max(0, (k - 0.9) / 0.1) * 0.55; const o = Math.min(1, v * 0.7 + rim) ;
        const z = Math.max(1, g * (0.18 + o * 0.78));
        x.fillStyle = `rgba(235,238,245,${(0.06 + o * 0.8).toFixed(3)})`; x.fillRect(px - z / 2, py - z / 2, z, z);
      }
      if (!calm) raf = requestAnimationFrame(draw);
    };
    size(); raf = requestAnimationFrame(draw);
    addEventListener("resize", size); addEventListener("pointermove", mv);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("pointermove", mv); };
  }, []);
  return <canvas ref={ref} className="waves" aria-hidden />;
}

/* ---------- 3D metallic logo ---------- */
function Logo3D() {
  const tilt = useRef();
  useEffect(() => {
    const mv = (e) => {
      const rx = (0.5 - e.clientY / innerHeight) * 22, ry = (e.clientX / innerWidth - 0.5) * 30;
      tilt.current?.style.setProperty("--rx", rx + "deg"); tilt.current?.style.setProperty("--ry", ry + "deg");
    };
    addEventListener("pointermove", mv); return () => removeEventListener("pointermove", mv);
  }, []);
  return (
    <div className="logo3d" style={{ "--logo": `url(${BASE}/logo-mark.png)` }} role="img" aria-label="Immune Studio logo">
      <div className="halo" />
      <div className="tilt" ref={tilt}>
        {Array.from({ length: 16 }, (_, i) => (<i key={i} className="ext" style={{ "--i": i }} />))}
        <i className="face dark" /><i className="face light" /><i className="shine" />
      </div>
    </div>
  );
}

/* ---------- icons ---------- */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS = {
  Facebook: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.7V21z" fill="currentColor" />,
  GitHub: <path transform="translate(2 2) scale(1.25)" fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />,
  YouTube: <g {...P}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" /></g>,
  LinkedIn: <g {...P}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V16M8 8v.01M12 16v-5.5m0 2.5c0-2.8 4-2.8 4 0v3" /></g>,
  Instagram: <g {...P}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></g>,
  Gmail: <g {...P}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></g>,
};
const Social = ({ name, href }) => (
  <a className="soc" href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>{ICONS[name]}</svg><span>{name}</span>
  </a>
);

/* ---------- content ---------- */
const SERVICES = [
  ["Ad Marketing", "Performance-minded campaigns built to stop the scroll and move the numbers."],
  ["Content Creation", "Always-on content systems that keep your brand present and worth following."],
  ["Video Production", "Concept to final cut — spots, reels and brand films with cinematic polish."],
  ["Videography", "On-location shoots with proper lighting, sound and a director's eye."],
  ["Motion Design", "Animated identities, explainers and kinetic type that bring ideas to life."],
  ["Graphic Design & Brand", "Identities, key visuals and promotion that make a brand unmistakable."],
];
const WORK = ["Ad Campaigns", "Brand Films", "Motion Design", "Social Content", "Brand Identity", "Videography"];
const STEPS = [
  ["Discover", "We learn your brand, audience and the single thing that makes you different."],
  ["Strategize", "A clear creative and channel plan — no guesswork, no filler."],
  ["Create", "Shooting, designing and animating until every frame earns its place."],
  ["Launch & Grow", "We publish, promote and refine so the work keeps compounding."],
];
const OFFERS = [
  ["Launch", ["Brand starter visuals", "3 short-form videos", "Social-ready templates"]],
  ["Growth", ["Monthly content engine", "Ad creative + testing", "Motion graphics pack"], true],
  ["Signature", ["Full brand film", "Campaign strategy", "Dedicated creative team"]],
];
const TICKER = ["Ad Marketing", "Content Creation", "Video Production", "Videography", "Motion Design", "Graphic Design", "Brand Promotion"];

/* ---------- page ---------- */
export default function Site() {
  useReveal();
  const [work, setWork] = useState(0);
  const [stuck, setStuck] = useState(false);
  const proc = useRef();
  useEffect(() => {
    const on = () => {
      const y = scrollY; setStuck(y > 40);
      document.documentElement.style.setProperty("--sy", Math.min(y / innerHeight, 1));
      const r = proc.current?.getBoundingClientRect();
      if (r) proc.current.style.setProperty("--p", Math.max(0, Math.min(1, (innerHeight * 0.65 - r.top) / r.height)));
    };
    on(); addEventListener("scroll", on, { passive: true }); return () => removeEventListener("scroll", on);
  }, []);

  return (
    <main>
      <header className={`bar ${stuck ? "stuck" : ""}`}>
        <nav>{["Services", "Work", "Process", "Offer", "Contact"].map((n) => (<a key={n} href={`#${n.toLowerCase()}`}>{n}</a>))}</nav>
        <a className="btn solid" href="#contact">Work with us</a>
      </header>

      {/* 1 · HERO — pixel-dome wave + 3D logo */}
      <section className="hero" id="top">
        <Waves />
        <Logo3D />
        <div className="hero-copy">
          <p className="mono">Ads · Content · Video · Motion · Brand</p>
          <h1>Creative that makes brands <em>impossible</em> to ignore.</h1>
        </div>
        <div className="cue mono">Scroll</div>
      </section>

      <div className="ticker" aria-hidden><div>{[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (<span key={i}>{t}<b>✦</b></span>))}</div></div>

      {/* 2 · SERVICES — cards rise in 3D, spotlight follows cursor */}
      <section className="sec" id="services">
        <p className="mono label" data-r>/ What we do</p>
        <h2><Split text="One studio. Every frame of your brand." /></h2>
        <div className="grid">
          {SERVICES.map(([t, d], i) => (
            <article key={t} className="card" data-r style={{ "--i": i }}
              onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px"); e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px"); }}>
              <span className="mono">0{i + 1}</span><h3>{t}</h3><p>{d}</p><i className="arrow">↗</i>
            </article>
          ))}
        </div>
      </section>

      {/* 3 · WORK — index list, lines draw, live preview panel */}
      <section className="sec work" id="work">
        <p className="mono label" data-r>/ Selected work</p>
        <h2><Split text="Built to be seen." /></h2>
        <div className="work-wrap">
          <ul>
            {WORK.map((w, i) => (
              <li key={w} data-r style={{ "--i": i }} onMouseEnter={() => setWork(i)} onFocus={() => setWork(i)} className={work === i ? "on" : ""}>
                <a href="#contact" tabIndex={0}><span className="mono">0{i + 1}</span><b>{w}</b><i>↗</i></a>
              </li>
            ))}
          </ul>
          {/* Swap the gradient for real work: <img src=... /> or <video /> */}
          <div className="preview" aria-hidden>
            {WORK.map((w, i) => (<div key={w} className={`pv ${work === i ? "on" : ""}`} style={{ "--h": i * 18 }}><span className="mono">{w}</span><em>0{i + 1}</em></div>))}
          </div>
        </div>
      </section>

      {/* 4 · PROCESS — line draws as you scroll */}
      <section className="sec" id="process" ref={proc}>
        <p className="mono label" data-r>/ How we work</p>
        <h2><Split text="From first idea to final frame." /></h2>
        <div className="steps"><div className="rail"><i /></div>
          {STEPS.map(([t, d], i) => (<div className="step" key={t} data-r style={{ "--i": i }}><span className="dot" /><span className="mono">Step 0{i + 1}</span><h3>{t}</h3><p>{d}</p></div>))}
        </div>
      </section>

      {/* 5 · NUMBERS — counters + drawing rings */}
      <section className="sec nums">
        <p className="mono label" data-r>/ Our promise</p>
        <h2><Split text="Crafted with care. Made to perform." /></h2>
        <div className="stats">
          {SITE.stats.map((s) => (
            <div key={s.l} data-r>
              <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" /><circle className="ring" cx="50" cy="50" r="46" /></svg>
              <strong><Count n={s.n} s={s.s} /></strong><span className="mono">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · OFFER — cards flip up */}
      <section className="sec" id="offer">
        <p className="mono label" data-r>/ Offers</p>
        <h2><Split text="Pick a starting point." /></h2>
        <div className="offers">
          {OFFERS.map(([t, list, hot], i) => (
            <article key={t} className={`offer ${hot ? "hot" : ""}`} data-r style={{ "--i": i }}>
              {hot && <em className="tag mono">Most popular</em>}
              <h3>{t}</h3><ul>{list.map((l) => (<li key={l}>{l}</li>))}</ul>
              <a className={`btn ${hot ? "solid" : ""}`} href={`mailto:${SITE.email}?subject=${t} offer`}>Claim this offer</a>
            </article>
          ))}
        </div>
      </section>

      {/* 7 · CONTACT FOOTER */}
      <footer className="sec contact" id="contact">
        <p className="mono label" data-r>/ Contact</p>
        <h2 className="big"><Split text="Let's build something unforgettable." /></h2>
        <a className="mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <div className="socials">
          <Social name="Facebook" href={SITE.links.facebook} />
          <Social name="GitHub" href={SITE.links.github} />
          <Social name="YouTube" href={SITE.links.youtube} />
          <Social name="LinkedIn" href={SITE.links.linkedin} />
          <Social name="Instagram" href={SITE.links.instagram} />
          <Social name="Gmail" href={`mailto:${SITE.email}`} />
          <a className="soc pulse" href="#offer">View Offer</a>
        </div>
        <p className="fine mono">© {new Date().getFullYear()} Immune Studio. All rights reserved.</p>
      </footer>
    </main>
  );
}
