/* Migdal חיסכון חכם — MOBILE screens C: Confirmation + Dashboard + Strong-month bank push */
const { useState: useStateMC, useEffect: useEffectMC } = React;

/* ============================================================
   SCREEN 7 — CONFIRMATION
   ============================================================ */
function MConfirm({ go, wz, bank }) {
  return (
    <div className="m-scroll">
      <div className="m-confirm">
        <div className="check"><Icon name="check" /></div>
        <h1>חיסכון חכם פעיל!</h1>
        <p className="lead">מהיום מגדל שמה לב במקומך. הרצפה תרוץ בשקט, ובחודש חזק נשלח אליך בקשת אישור — בלי להעיק.</p>
        <div className="m-recap">
          <div className="m-review">
            <div className="m-rev"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{mnf(wz.floor)}</span></div>
            <div className="m-rev"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
            <div className="m-rev"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">₪{mnf(wz.goal)}</span></div>
            <div className="m-rev"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
          </div>
        </div>
        <button className="m-btn m-btn-green" onClick={() => go(8)}>לדשבורד החיסכון שלי <Icon name="arrow-left" /></button>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 8 — DASHBOARD (steady state)
   ============================================================ */
function MDashboard({ go, wz, pushApproved, paused, setPaused }) {
  const baseSaved = 32500;
  const saved = baseSaved + (pushApproved ? 1500 : 0);
  const pct = Math.min(100, Math.round(saved / wz.goal * 100));
  const [animPct, setAnimPct] = useStateMC(0);
  useEffectMC(() => { const t = setTimeout(() => setAnimPct(pct), 220); return () => clearTimeout(t); }, [pct]);

  const baseDeps = [
    { d: "01/06/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "01/05/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "18/04/2026", t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" },
    { d: "01/04/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "פוליסת חיסכון" },
  ];
  const deps = pushApproved
    ? [{ d: "05/06/2026", t: "הזדמנות · חודש חזק", amt: 1500, kind: "opp", dest: "קופת גמל להשקעה" }, ...baseDeps]
    : baseDeps;
  const activeRules = M_RULE_DEFS.filter((r) => wz.rules[r.id].on);

  return (
    <div className="m-scroll">
      <div className="m-band" style={{ paddingBottom: 6 }}>
        <div className="crumbs"><span>מגדל שלי</span><span className="sep">›</span><span className="cur">חיסכון חכם</span></div>
      </div>

      <div className="m-dashhead">
        <div>
          <h2>החיסכון שלך עובד</h2>
          {paused
            ? <div className="paused-l">● מושהה — אף הפקדה לא תתבצע</div>
            : <div className="live"><i></i> פעיל · מחובר לבנק ראשון</div>}
        </div>
        <button className="m-pause" onClick={() => setPaused(!paused)}>
          <Icon name={paused ? "play" : "pause"} /> {paused ? "המשך" : "עצור הכל"}
        </button>
      </div>

      {/* Opportunity prompt */}
      {!pushApproved && !paused && (
        <div className="m-opp">
          <span className="pk"><Icon name="zap" /> זוהה חודש חזק</span>
          <h2>חודש טוב! יש לך תזרים פנוי גדול מהרגיל</h2>
          <div className="opp-amt"><small>₪</small>1,500</div>
          <p>נשלחה אליך בקשת אישור (R2P) להפקיד ₪1,500 נוספים לקופת הגמל. האישור מתבצע באפליקציית הבנק שלך.</p>
          <button className="m-btn m-btn-green" onClick={() => go(9)}>צפה בבקשת ההפקדה <Icon name="arrow-left" /></button>
        </div>
      )}

      {/* data tiles */}
      <div className="m-tiles">
        <div className="m-tile blue">
          <div className="dl"><Icon name="eye" /> עודף שזוהה החודש</div>
          <div><div className="dn"><small>₪</small>2,300</div><div className="dsub">ישב בעו״ש — עכשיו עובד בשבילך</div></div>
        </div>
        <div className="m-tile navy">
          <div className="dl"><Icon name="banknote" /> הופקד החודש</div>
          <div><div className="dn"><small>₪</small>{mnf(pushApproved ? 2000 : 500)}</div><div className="dsub">{pushApproved ? "רצפה ₪500 + הזדמנות ₪1,500" : "רצפה — אוטופיילוט"}</div></div>
        </div>
        <div className="m-tile green span2">
          <div className="dl"><Icon name="coins" /> נחסך עד היום דרך חיסכון חכם</div>
          <div><div className="dn"><small>₪</small>{mnf(saved)}</div></div>
        </div>
      </div>

      {/* goal tracker */}
      <div className="m-goalcard">
        <div className="gc-top">
          <h3>היעד שלך · גמל להשקעה</h3>
          <span className="edit"><Icon name="pencil" /> ערוך</span>
        </div>
        <div className="m-progress"><div className="fill" style={{ width: animPct + "%" }}></div></div>
        <div className="m-progress-meta">
          <span><b>₪{mnf(saved)}</b> נחסכו</span>
          <span>יעד: <b>₪{mnf(wz.goal)}</b> · {pct}%</span>
        </div>
      </div>

      {/* deposits */}
      <div className="m-panel">
        <div className="ph"><h3>ההפקדות שלי</h3><a className="lnk">הכל ›</a></div>
        {deps.map((x, i) => (
          <div className="m-dep" key={i}>
            <span className={"di " + (x.kind === "opp" ? "opp" : "auto")}><Icon name={x.kind === "opp" ? "zap" : "refresh"} /></span>
            <div className="dm">
              <b>{x.t}</b>
              <small>{x.d} · {x.dest}</small>
              <span className={"tag " + x.kind}>{x.kind === "opp" ? "אושר באפליקציית הבנק" : "אוטופיילוט"}</span>
            </div>
            <div className="damt">₪{mnf(x.amt)}</div>
          </div>
        ))}
      </div>

      {/* rules */}
      <div className="m-panel">
        <div className="ph"><h3>החוקים שלי</h3><a className="lnk" onClick={() => go(3)}>ערוך</a></div>
        <div className="m-rulemini">
          <span className="rmi"><Icon name="banknote" /></span>
          <div className="rmt"><b>רצפה חודשית</b><small>₪{mnf(wz.floor)} בכל חודש</small></div>
          <span className="badge-mode auto">אוטופיילוט</span>
        </div>
        {activeRules.map((r) => (
          <div className="m-rulemini" key={r.id}>
            <span className="rmi"><Icon name={r.icon} /></span>
            <div className="rmt"><b>{r.t}</b><small>חוק הזדמנות</small></div>
            <span className="badge-mode r2p">{wz.approval.opp === "r2p" ? "R2P" : "אוטו׳"}</span>
          </div>
        ))}
      </div>

      {/* management */}
      <div className="m-panel">
        <div className="m-rulemini" style={{ cursor: "pointer" }} onClick={() => go(3)}>
          <span className="rmi"><Icon name="edit" /></span>
          <div className="rmt"><b>ערוך הגדרות</b><small>רצפה, הקצאה, גארדריילים</small></div>
          <span className="chev"><Icon name="chevron-left" /></span>
        </div>
        <div className="m-rulemini danger" style={{ cursor: "pointer" }} onClick={() => setPaused(!paused)}>
          <span className="rmi"><Icon name="unlink" /></span>
          <div className="rmt"><b>נתק וכבה</b><small>ביטול ההסכמה לבנקאות פתוחה</small></div>
          <span className="chev"><Icon name="chevron-left" /></span>
        </div>
      </div>

      <p className="m-disc" style={{ margin: "0 16px 8px" }}>
        סיכום חודשי יישלח אליך. אם R2P לא אושר תוך 24 שעות או שנדחה — נדלג על החודש ונעדכן אותך, בלי לנסות שוב. אין באמור ייעוץ או המלצה.
      </p>
    </div>
  );
}

/* ============================================================
   SCREEN 9 — STRONG MONTH: R2P approved in the BANK app (overlay)
   ============================================================ */
function MStrongMonth({ go, onApprove, bank }) {
  const [state, setState] = useStateMC("ask");
  function approve() {
    setState("done");
    setTimeout(() => { onApprove(); go(8); }, 1900);
  }
  const bankColor = (bank && bank.c) || "#6a1b9a";
  const bankName = (bank && bank.n) || "בנק ראשון";
  const bankMono = (bank && bank.m) || "ר";
  return (
    <div className="m-bankoverlay">
      <div className="m-switchbar"><span className="dot"></span> עברת לאפליקציית {bankName} לאישור הבקשה</div>
      <div style={{ background: bankColor }}>
        <div className="m-bank-status">
          <span className="t">19:44</span>
          <span className="r">
            <svg width="18" height="13" viewBox="0 0 18 13" fill="#fff"><rect x="0" y="8.5" width="3" height="4.5" rx=".6"/><rect x="4.5" y="6" width="3" height="7" rx=".6"/><rect x="9" y="3" width="3" height="10" rx=".6"/><rect x="13.5" y="0" width="3" height="13" rx=".6"/></svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="22" height="11" rx="3" stroke="#fff" strokeOpacity=".5"/><rect x="2.5" y="2.5" width="16" height="8" rx="1.6" fill="#fff"/></svg>
          </span>
        </div>
        <div className="m-bank-top">
          <div className="bt-brand"><span className="bt-logo" style={{ color: bankColor }}>{bankMono}</span> {bankName}</div>
          <Icon name="lock" />
        </div>
      </div>
      <div className="m-bank-body" style={{ background: state === "done" ? bankColor : "#f4f5f9" }}>
        {state === "ask" ? (
          <div className="m-push">
            <div className="pc-head">
              <div className="src"><span className="ml"><img src={LOGO_WHITE} alt="מגדל" /></span> בקשת תשלום · מגדל</div>
              <span className="when">עכשיו</span>
            </div>
            <div className="pc-body">
              <span className="r2p-tag">R2P · בקשת הפקדה</span>
              <h4>חודש טוב! להפקיד עוד?</h4>
              <div className="pamt"><small>₪</small>1,500</div>
              <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
              <div className="pdest"><Icon name="trending-up" /> יעד: קופת גמל להשקעה במגדל</div>
            </div>
            <div className="pc-actions">
              <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
              <button className="decline" onClick={() => go(8)}>לא עכשיו</button>
            </div>
            <div className="secure"><Icon name="shield-check" /> מאובטח לפי תקן הבנקאות הפתוחה</div>
          </div>
        ) : (
          <div className="m-bank-done">
            <div className="bd-check" style={{ color: bankColor }}><Icon name="check" /></div>
            <h4>ההעברה אושרה</h4>
            <p>₪1,500 הועברו למגדל.<br/>מחזירים אותך לחיסכון שלך…</p>
            <div className="m-flowdots">
              <div className="fd active"><i><Icon name="check" style={{ width: 13, height: 13 }} /></i> בקשת R2P הגיעה לאפליקציית הבנק</div>
              <div className="fd active"><i><Icon name="check" style={{ width: 13, height: 13 }} /></i> אישרת — הכסף עבר</div>
              <div className="fd active"><i>3</i> מגדל זוקפת לקופה והטראקר מתעדכן</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MConfirm, MDashboard, MStrongMonth });
