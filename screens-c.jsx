/* Migdal חיסכון חכם — screens C: Confirmation, Dashboard (steady state), Strong-month bank-app push */
const { useState: useStateC, useEffect: useEffectC } = React;

/* ============================================================
   SCREEN 7 — Confirmation / activated
   ============================================================ */
function ConfirmScreen({ go, wz, bank }) {
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם"]} title="חיסכון חכם" />
      <div className="confirm">
        <div className="check"><Icon name="check" /></div>
        <h1>חיסכון חכם פעיל!</h1>
        <p className="lead">מהיום מגדל שמה לב במקומך. הרצפה תרוץ בשקט, ובחודש חזק נשלח אליך בקשת אישור — בלי להעיק.</p>
        <div className="recap">
          <div className="review">
            <div className="rev-row"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{nf(wz.floor)}</span></div>
            <div className="rev-row"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
            <div className="rev-row"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">₪{nf(wz.goal)}</span></div>
            <div className="rev-row"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
          </div>
        </div>
        <div className="stack-cta" style={{ justifyContent: "center" }}>
          <button className="btn btn-green btn-lg" onClick={() => go(8)}>לדשבורד החיסכון שלי <Icon name="arrow-left" /></button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 8 — Dashboard (steady state)
   ============================================================ */
function Dashboard({ go, wz, pushApproved, paused, setPaused }) {
  const baseSaved = 32500;
  const saved = baseSaved + (pushApproved ? 1500 : 0);
  const pct = Math.min(100, Math.round(saved / wz.goal * 100));
  const [animPct, setAnimPct] = useStateC(0);
  useEffectC(() => { const t = setTimeout(() => setAnimPct(pct), 200); return () => clearTimeout(t); }, [pct]);

  const baseDeps = [
    { d: "01/06/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "01/05/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "18/04/2026", t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" },
    { d: "01/04/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "פוליסת חיסכון" },
  ];
  const deps = pushApproved
    ? [{ d: "05/06/2026", t: "הזדמנות · חודש חזק", amt: 1500, kind: "opp", dest: "קופת גמל להשקעה" }, ...baseDeps]
    : baseDeps;

  const activeRules = RULE_DEFS.filter((r) => wz.rules[r.id].on);

  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם"]} title="חיסכון חכם" />
      <div className="page" style={{ paddingTop: 28 }}>
        <div className="dash-head">
          <div className="dh-l">
            <h2>החיסכון שלך עובד</h2>
            <p>{paused
              ? <span style={{ color: "var(--warning)", fontWeight: 800 }}>● מושהה — אף הפקדה לא תתבצע</span>
              : <span className="live"><i></i> פעיל</span>}
              {!paused && <span> · מחובר ל{ "בנק ראשון" }</span>}</p>
          </div>
          <div className="dh-r">
            <button className="pausebtn" onClick={() => setPaused(!paused)}>
              <Icon name={paused ? "play" : "pause"} /> {paused ? "המשך הכל" : "עצור הכל"}
            </button>
          </div>
        </div>

        {/* Opportunity prompt — strong month detected */}
        {!pushApproved && !paused && (
          <div className="promo" style={{ padding: "28px 36px", marginBottom: 24 }}>
            <div className="promo-txt" style={{ maxWidth: 640 }}>
              <span className="kick"><Icon name="zap" /> זוהה חודש חזק</span>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}>חודש טוב! יש לך תזרים פנוי גדול מהרגיל</h2>
              <p style={{ marginBottom: 18 }}>נשלחה אליך בקשת אישור (R2P) להפקיד ₪1,500 נוספים לקופת הגמל להשקעה. האישור מתבצע באפליקציית הבנק שלך.</p>
              <button className="btn btn-green" onClick={() => go(9)}>צפה בבקשת ההפקדה <Icon name="arrow-left" /></button>
            </div>
            <div className="promo-art">
              <div className="surplus-coin" style={{ width: 170, height: 170 }}>
                <span className="s-lbl">הזדמנות החודש</span>
                <span className="s-num" style={{ fontSize: 34 }}>₪1,500</span>
                <span className="s-sub">ממתין לאישורך</span>
              </div>
            </div>
          </div>
        )}

        {/* Data tiles */}
        <div className="data-tiles">
          <div className="dtile blue">
            <div className="dl"><Icon name="eye" /> עודף שזוהה החודש</div>
            <div><div className="dn"><small>₪</small>2,300</div><div className="dsub">ישב בעו״ש — עכשיו עובד בשבילך</div></div>
          </div>
          <div className="dtile navy">
            <div className="dl"><Icon name="banknote" /> הופקד החודש</div>
            <div><div className="dn"><small>₪</small>{nf(pushApproved ? 2000 : 500)}</div><div className="dsub">{pushApproved ? "רצפה ₪500 + הזדמנות ₪1,500" : "רצפה — אוטופיילוט"}</div></div>
          </div>
          <div className="dtile green">
            <div className="dl"><Icon name="coins" /> נחסך עד היום</div>
            <div><div className="dn"><small>₪</small>{nf(saved)}</div><div className="dsub">דרך חיסכון חכם</div></div>
          </div>
        </div>

        {/* Goal tracker */}
        <div className="goal-card">
          <div className="gc-top">
            <h3>היעד שלך · קופת גמל להשקעה</h3>
            <span className="edit"><Icon name="pencil" /> ערוך יעד</span>
          </div>
          <div className="progress"><div className="fill" style={{ width: animPct + "%" }}></div></div>
          <div className="progress-meta">
            <span><b>₪{nf(saved)}</b> <span className="muted">נחסכו</span></span>
            <span className="muted">יעד: <b style={{ fontSize: 15 }}>₪{nf(wz.goal)}</b> · {pct}%</span>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22, alignItems: "start" }} className="dash-cols">
          {/* Deposits */}
          <div className="panel">
            <div className="ph"><h3>ההפקדות שלי</h3><a className="lnk">הכל ›</a></div>
            {deps.map((x, i) => (
              <div className="dep" key={i}>
                <span className={"di " + (x.kind === "opp" ? "opp" : "auto")}><Icon name={x.kind === "opp" ? "zap" : "refresh"} /></span>
                <div className="dmid">
                  <b>{x.t}</b>
                  <small>{x.d} · {x.dest}</small>
                  <div><span className={"tag " + x.kind}>{x.kind === "opp" ? "אושר באפליקציית הבנק" : "אוטופיילוט"}</span></div>
                </div>
                <div className="damt">₪{nf(x.amt)}</div>
              </div>
            ))}
          </div>

          {/* Rules + management */}
          <div>
            <div className="panel">
              <div className="ph"><h3>החוקים שלי</h3><a className="lnk" onClick={() => go(3)}>ערוך</a></div>
              <div className="rule-mini">
                <span className="rmi"><Icon name="banknote" /></span>
                <div className="rmt"><b>רצפה חודשית</b><small>₪{nf(wz.floor)} בכל חודש</small></div>
                <span className="badge-mode auto">אוטופיילוט</span>
              </div>
              {activeRules.map((r) => (
                <div className="rule-mini" key={r.id}>
                  <span className="rmi"><Icon name={r.icon} /></span>
                  <div className="rmt"><b>{r.t}</b><small>חוק הזדמנות</small></div>
                  <span className="badge-mode r2p">{wz.approval.opp === "r2p" ? "R2P" : "אוטו׳"}</span>
                </div>
              ))}
            </div>
            <div className="panel" style={{ padding: "20px 24px" }}>
              <div className="rule-mini" style={{ cursor: "pointer", borderBottom: "1px solid var(--mig-line-soft)" }} onClick={() => go(3)}>
                <span className="rmi"><Icon name="edit" /></span>
                <div className="rmt"><b>ערוך הגדרות</b><small>רצפה, הקצאה, גארדריילים</small></div>
                <Icon name="chevron-left" style={{ width: 20, color: "var(--mig-slate-400)" }} />
              </div>
              <div className="rule-mini" style={{ cursor: "pointer" }} onClick={() => setPaused(!paused)}>
                <span className="rmi" style={{ background: "rgba(182,80,88,.1)", color: "var(--error)" }}><Icon name="unlink" /></span>
                <div className="rmt"><b style={{ color: "var(--error)" }}>נתק וכבה</b><small>ביטול ההסכמה לבנקאות פתוחה</small></div>
                <Icon name="chevron-left" style={{ width: 20, color: "var(--mig-slate-400)" }} />
              </div>
            </div>
          </div>
        </div>

        <p className="disclaimer" style={{ marginTop: 22 }}>
          סיכום חודשי יישלח אליך. אם R2P לא אושר תוך 24 שעות או שנדחה (אין מספיק יתרה) — נדלג על החודש ונעדכן אותך, בלי לנסות שוב. אין באמור ייעוץ או המלצה.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 9 — Strong month: R2P push approved in the BANK app
   ============================================================ */
function PhoneStatus() {
  return (
    <div className="pstatus">
      <span>9:41</span>
      <span className="ic-r"><Icon name="signal" /><Icon name="wifi" /><Icon name="battery" /></span>
    </div>
  );
}
function StrongMonth({ go, onApprove, bank }) {
  const [state, setState] = useStateC("ask"); // ask | done
  function approve() {
    setState("done");
    setTimeout(() => { onApprove(); go(8); }, 1900);
  }
  const bankColor = (bank && bank.c) || "#6a1b9a";
  const bankName = (bank && bank.n) || "בנק ראשון";
  const bankMono = (bank && bank.m) || "ר";
  return (
    <div className="stage">
      <div className="stage-copy">
        <span className="eyebrow"><Icon name="zap" /> רגע ההזדמנות</span>
        <h2>האישור קורה באפליקציית הבנק שלך</h2>
        <p>זוהה חודש חזק. מגדל שולחת בקשת תשלום (R2P) דרך הבנקאות הפתוחה — ואתה מאשר אותה ב{bankName}, החשבון שעליו נתת הסכמה.</p>
        <div className="flow-dots">
          <div className={"fd " + (state === "ask" ? "active" : "")}><i>1</i> בקשת R2P מגיעה לאפליקציית הבנק</div>
          <div className={"fd " + (state === "done" ? "active" : "")}><i>2</i> אתה מאשר — הכסף עובר</div>
          <div className="fd"><i>3</i> מגדל זוקפת לקופה והטראקר מתעדכן</div>
        </div>
      </div>

      <div className="phone">
        <div className="scr">
          <div className="notch"></div>
          <PhoneStatus />
          <div className="bankapp">
            <div className="ba-top" style={{ background: bankColor }}>
              <div className="ba-brand"><span className="ba-logo" style={{ color: bankColor }}>{bankMono}</span> {bankName}</div>
              <Icon name="lock" style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <div className="ba-body">
              {state === "ask" ? (
                <div className="push-card">
                  <div className="pc-head">
                    <div className="src"><span className="ml"><img src={(window.__resources && window.__resources.migdalLogoWhite) || "assets/migdal-logo-white.png"} alt="מגדל" /></span> בקשת תשלום · מגדל</div>
                    <span>עכשיו</span>
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
                  <div className="push-secure" style={{ paddingBottom: 14 }}><Icon name="shield-check" /> מאובטח לפי תקן הבנקאות הפתוחה</div>
                </div>
              ) : (
                <div className="ba-done">
                  <div className="bd-check"><Icon name="check" /></div>
                  <h4>ההעברה אושרה</h4>
                  <p>₪1,500 הועברו למגדל.<br/>מעבירים אותך חזרה לחיסכון שלך…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConfirmScreen, Dashboard, StrongMonth });
