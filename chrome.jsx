/* Migdal חיסכון חכם — shared chrome + inline icon set */
const { useState, useEffect, useRef } = React;

/* ---------- Inline icon set (single-weight line, ~1.7 stroke) ---------- */
const PATHS = {
  "chevron-down": <polyline points="6 9 12 15 18 9" />,
  "chevron-left": <polyline points="15 18 9 12 15 6" />,
  "chevron-right": <polyline points="9 18 15 12 9 6" />,
  "arrow-left": <g><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></g>,
  "arrow-right": <g><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></g>,
  "bell": <g><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g>,
  "sparkles": <g><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"/></g>,
  "shield": <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  "shield-check": <g><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></g>,
  "eye-off": <g><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/><path d="M6.61 6.61A18.5 18.5 0 0 0 2 12s3 8 10 8a9.12 9.12 0 0 0 5.39-1.61"/></g>,
  "unlink": <g><path d="M18.84 12.25l1.72-1.71a4.5 4.5 0 0 0-6.36-6.37l-1.71 1.72"/><path d="M5.17 11.75l-1.72 1.71a4.5 4.5 0 0 0 6.36 6.37l1.71-1.72"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="22" x2="16" y2="19"/><line x1="19" y1="16" x2="22" y2="16"/></g>,
  "trending-up": <g><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></g>,
  "wallet": <g><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></g>,
  "target": <g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></g>,
  "piggy": <g><path d="M19 7c0-1.1-.9-2-2-2H8a6 6 0 0 0-6 6c0 2 1 3.5 2.5 4.5V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h3v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2.2c.9-.8 1.5-1.8 1.7-2.8H21a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1.2A5 5 0 0 0 19 7z"/><line x1="9" y1="9" x2="13" y2="9"/><circle cx="16.5" cy="10.5" r=".6" fill="currentColor"/></g>,
  "check": <polyline points="20 6 9 17 4 12" />,
  "check-bold": <polyline points="20 6 9 17 4 12" />,
  "pause": <g><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></g>,
  "edit": <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></g>,
  "plus": <g><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g>,
  "minus": <line x1="5" y1="12" x2="19" y2="12" />,
  "lock": <g><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>,
  "percent": <g><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></g>,
  "calendar": <g><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></g>,
  "zap": <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  "info": <g><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></g>,
  "x": <g><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></g>,
  "banknote": <g><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></g>,
  "gift": <g><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></g>,
  "scale": <g><path d="M12 3v18"/><path d="M5 7h14"/><path d="M6 7l-3 6a3 3 0 0 0 6 0z"/><path d="M18 7l-3 6a3 3 0 0 0 6 0z"/><path d="M7 21h10"/></g>,
  "lightbulb": <g><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></g>,
  "wifi": <g><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></g>,
  "battery": <g><rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><rect x="4" y="9" width="13" height="6" rx="1" fill="currentColor" stroke="none"/></g>,
  "signal": <g><rect x="2" y="14" width="3" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="7" y="10" width="3" height="10" rx="1" fill="currentColor" stroke="none"/><rect x="12" y="6" width="3" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="3" width="3" height="17" rx="1" fill="currentColor" stroke="none"/></g>,
  "building": <g><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><path d="M9 22v-4h6v4"/></g>,
  "link2": <g><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></g>,
  "coins": <g><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88l.7.71-2.82 2.82"/></g>,
  "file": <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></g>,
  "message": <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  "route": <g><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></g>,
  "gavel": <g><path d="M14 13l-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10"/><path d="M16 6l-4 4"/><path d="M14 4l6 6"/><path d="M18 8l3-3"/></g>,
  "eye": <g><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></g>,
  "play": <polygon points="6 4 20 12 6 20 6 4" />,
  "refresh": <g><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></g>,
  "pencil": <g><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></g>,
};

/* ---------- Shared demo helpers (dates, allocation destination) ---------- */
const heDate = (d) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
const todayHe = () => heDate(new Date());
const monthFirst = (back) => { const t = new Date(); return heDate(new Date(t.getFullYear(), t.getMonth() - back, 1)); };
const monthLastDay = (back) => { const t = new Date(); return heDate(new Date(t.getFullYear(), t.getMonth() - back + 1, 0)); };
const monthDay = (back, day) => { const t = new Date(); return heDate(new Date(t.getFullYear(), t.getMonth() - back, day)); };
const lastVisitHe = () => heDate(new Date(Date.now() - 4 * 864e5));
const prevMonthName = () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString("he-IL", { month: "long" });
const destFromAlloc = (a) => !a ? "קופת גמל להשקעה"
  : a.gemel >= 100 ? "קופת גמל להשקעה"
  : a.policy >= 100 ? "פוליסת חיסכון"
  : a.gemel + "% גמל · " + a.policy + "% פוליסה";

function Icon({ name, className, style }) {
  const p = PATHS[name];
  if (!p) return null;
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {p}
    </svg>
  );
}

/* ---------- Header (faithful to portal screenshots) ---------- */
const NAV = [
  { t: "פעולות" }, { t: "שירותים" }, { t: "תביעות" }, { t: "ביטוחים", caret: true },
  { t: "חיסכון פנסיוני", caret: true }, { t: "חיסכון אישי והשקעות", active: true },
];
function Header({ onHome }) {
  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="hdr-pill">שלום תום | <b>התנתק</b></div>
        <div className="hdr-lang">
          <a>עברית <Icon name="chevron-down" className="cv" /></a>
          <a>כניסה לפורטלים <Icon name="chevron-down" className="cv" /></a>
        </div>
      </div>
      <nav className="hdr-nav">
        {NAV.map((n) => (
          <a key={n.t} className={n.active ? "is-active" : ""}>{n.t}{n.caret && <Icon name="chevron-down" className="cv" />}</a>
        ))}
        <img className="hdr-logo" src={(window.__resources && window.__resources.migdalLogo) || "assets/migdal-logo.png"} alt="מגדל" onClick={onHome} />
      </nav>
    </header>
  );
}

const SUBNAV = ["המוצרים שלי", "פעולות", "הפקדות ותשלומים", "הלוואות", "תביעות", "מידע ודוחות"];
function SubNav({ active }) {
  return (
    <div className="subnav">
      <div className="subnav-note">
        <span className="bell"><Icon name="bell" /></span>
        ביקורך האחרון {lastVisitHe()}
      </div>
      <nav className="subnav-links">
        {SUBNAV.map((s) => <a key={s} className={s === active ? "active" : ""}>{s}</a>)}
      </nav>
    </div>
  );
}

/* Hero band with breadcrumb + big blue title */
function Band({ crumbs, title }) {
  return (
    <div className="band">
      <div className="band-inner">
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">›</span>}
              <span className={i === crumbs.length - 1 ? "cur" : ""}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <h1>{title}</h1>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Header, SubNav, Band, heDate, todayHe, monthFirst, monthLastDay, monthDay, lastVisitHe, prevMonthName, destFromAlloc });
