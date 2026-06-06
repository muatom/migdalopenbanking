/* Migdal חיסכון חכם — MOBILE chrome: device frame, status bar, Migdal app header, bottom nav.
   Reuses the Icon set from chrome.jsx (loaded before this file). */

const TOWER_SRC = (window.__resources && window.__resources.migdalTower) || "assets/migdal-tower.png";
const LOGO_WHITE = (window.__resources && window.__resources.migdalLogoWhite) || "assets/migdal-logo-white.png";

/* ---------- iOS status bar (white-on-navy) ---------- */
function StatusBar({ time = "19:43" }) {
  return (
    <div className="m-status">
      <div className="st-time">
        {time}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></svg>
      </div>
      <div className="st-right">
        {/* cellular */}
        <svg width="18" height="13" viewBox="0 0 18 13" fill="#fff"><rect x="0" y="8.5" width="3" height="4.5" rx=".6"/><rect x="4.5" y="6" width="3" height="7" rx=".6"/><rect x="9" y="3" width="3" height="10" rx=".6"/><rect x="13.5" y="0" width="3" height="13" rx=".6" fillOpacity=".4"/></svg>
        {/* wifi */}
        <svg width="17" height="13" viewBox="0 0 17 13" fill="#fff"><path d="M8.5 2.5C11 2.5 13.3 3.5 15 5.1l1.3-1.4C14.3 1.8 11.5.6 8.5.6S2.7 1.8.7 3.7L2 5.1C3.7 3.5 6 2.5 8.5 2.5z"/><path d="M8.5 6.6c1.3 0 2.5.5 3.4 1.4l1.3-1.4c-1.2-1.2-2.9-2-4.7-2s-3.5.8-4.7 2l1.3 1.4c.9-.9 2.1-1.4 3.4-1.4z"/><circle cx="8.5" cy="10.8" r="1.6"/></svg>
        {/* battery */}
        <span className="st-batt">
          <span className="bnum">46</span>
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="22" height="11" rx="3" stroke="#fff" strokeOpacity=".45"/><rect x="2.5" y="2.5" width="9.6" height="8" rx="1.6" fill="#fff"/><path d="M24.5 4.5v4c.7-.3 1.2-1 1.2-2s-.5-1.7-1.2-2z" fill="#fff" fillOpacity=".5"/></svg>
        </span>
      </div>
    </div>
  );
}

/* ---------- Migdal app header (navy) ---------- */
function MHeader({ left = "back", onLeft, onHome }) {
  return (
    <div className="m-head">
      {left === "back" ? (
        <div className="m-circ" onClick={onLeft}><Icon name="arrow-right" /></div>
      ) : left === "mail" ? (
        <div className="m-circ" onClick={onLeft}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>
        </div>
      ) : (
        <div style={{ width: 56 }}></div>
      )}
      <div className="h-title" onClick={onHome}>
        <b>מגדל שלי</b>
        <img src={TOWER_SRC} alt="" />
      </div>
      <div className="m-circ hamb" onClick={onHome}><i></i><i></i><i></i></div>
    </div>
  );
}

/* ---------- Bottom nav (3 floating circles) ---------- */
function BottomNav() {
  const items = [
    { t: "תביעות", icon: "gavel" },
    { t: "פעולות", icon: "actions" },
    { t: "בקשות", icon: "requests" },
  ];
  const customIcon = (k) => {
    if (k === "actions") return (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <line x1="3" y1="7" x2="17" y2="7"/><line x1="3" y1="14" x2="17" y2="14"/><line x1="3" y1="21" x2="17" y2="21"/>
        <circle cx="22.5" cy="7" r="1.4" fill="currentColor" stroke="none"/><circle cx="22.5" cy="14" r="1.4" fill="currentColor" stroke="none"/><circle cx="22.5" cy="21" r="1.4" fill="currentColor" stroke="none"/>
      </svg>
    );
    if (k === "requests") return (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <rect x="8" y="4" width="13" height="17" rx="2"/><path d="M8 7H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1"/>
        <line x1="11" y1="9" x2="18" y2="9"/><line x1="11" y1="13" x2="18" y2="13"/><line x1="11" y1="17" x2="15" y2="17"/>
      </svg>
    );
    return <Icon name="gavel" />;
  };
  return (
    <div className="m-bottomnav">
      {items.map((it) => (
        <div className="m-bn" key={it.t}>
          <div className="bn-c">{customIcon(it.icon)}</div>
          <span className="bn-l">{it.t}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- White band: breadcrumb + title + optional subtitle ---------- */
function MBand({ crumbs, title, sub }) {
  return (
    <div className="m-band">
      {crumbs && (
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">›</span>}
              <span className={i === crumbs.length - 1 ? "cur" : ""}>{c}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1>{title}</h1>
      {sub && <p className="b-sub">{sub}</p>}
    </div>
  );
}

const mnf = (n) => Number(n).toLocaleString("en-US");

Object.assign(window, { StatusBar, MHeader, BottomNav, MBand, TOWER_SRC, LOGO_WHITE, mnf });
