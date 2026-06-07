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
function MDashboard({ go, wz, pushApproved, paused, setPaused, instant, openDeposit }) {
  const inst = instant || [];
  const instTotal = inst.reduce((s, x) => s + x.amt, 0);
  const baseSaved = 32500;
  const saved = baseSaved + (pushApproved ? 1500 : 0) + instTotal;
  const pct = Math.min(100, Math.round(saved / wz.goal * 100));
  const [animPct, setAnimPct] = useStateMC(0);
  useEffectMC(() => { const t = setTimeout(() => setAnimPct(pct), 220); return () => clearTimeout(t); }, [pct]);

  const baseDeps = [
    { d: "01/06/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "01/05/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: "18/04/2026", t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" },
    { d: "01/04/2026", t: "רצפה חודשית", amt: 500, kind: "auto", dest: "פוליסת חיסכון" },
  ];
  const instDeps = inst.map((x) => ({ d: x.d || "היום", t: "הפקדה מיידית", amt: x.amt, kind: "instant", dest: x.dest }));
  const deps = [
    ...instDeps,
    ...(pushApproved ? [{ d: "05/06/2026", t: "הזדמנות · חודש חזק", amt: 1500, kind: "opp", dest: "קופת גמל להשקעה" }] : []),
    ...baseDeps,
  ];
  const monthDeposited = 500 + (pushApproved ? 1500 : 0) + instTotal;
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
        <div className="m-dashbtns">
          <button className="m-depnow" onClick={() => openDeposit && openDeposit(null)}><Icon name="zap" /> הפקד</button>
          <button className="m-pause" onClick={() => setPaused(!paused)}>
            <Icon name={paused ? "play" : "pause"} /> {paused ? "המשך" : "עצור"}
          </button>
        </div>
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
          <div><div className="dn"><small>₪</small>{mnf(monthDeposited)}</div><div className="dsub">{["רצפה ₪500", pushApproved ? "הזדמנות ₪1,500" : null, instTotal ? "מיידית ₪" + mnf(instTotal) : null].filter(Boolean).join(" + ")}</div></div>
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
            <span className={"di " + x.kind}><Icon name={x.kind === "opp" ? "zap" : x.kind === "instant" ? "banknote" : "refresh"} /></span>
            <div className="dm">
              <b>{x.t}</b>
              <small>{x.d} · {x.dest}</small>
              <span className={"tag " + x.kind}>{x.kind === "opp" ? "אושר באפליקציית הבנק" : x.kind === "instant" ? "מיידי · אושר בבנק" : "אוטופיילוט"}</span>
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

/* ============================================================
   INSTANT DEPOSIT — on-demand one-off deposit (bottom sheet)
   ============================================================ */
function MInstantDeposit({ open, onClose, onDone, wz, bank, ctx }) {
  const presetDest = ctx && ctx.dest;
  const initAlloc = () => presetDest === "פוליסה" ? { gemel: 0, policy: 100 }
    : presetDest === "גמל" ? { gemel: 100, policy: 0 }
    : { gemel: wz.alloc.gemel, policy: wz.alloc.policy };
  const [phase, setPhase] = useStateMC("form");
  const [amt, setAmt] = useStateMC(1000);
  const [alloc, setAlloc] = useStateMC(initAlloc);
  useEffectMC(() => { if (open) { setPhase("form"); setAmt(1000); setAlloc(initAlloc()); } }, [open, presetDest]);
  if (!open) return null;
  const total = alloc.gemel + alloc.policy;
  const bankColor = (bank && bank.c) || "#6a1b9a";
  const bankName = (bank && bank.n) || "בנק ראשון";
  const bankMono = (bank && bank.m) || "ר";
  const destText = alloc.policy === 100 ? "פוליסת חיסכון" : alloc.gemel === 100 ? "קופת גמל להשקעה" : alloc.gemel + "% גמל · " + alloc.policy + "% פוליסה";
  function setA(key, v) { const x = Math.max(0, Math.min(100, isNaN(v) ? 0 : v)); setAlloc(key === "gemel" ? { gemel: x, policy: 100 - x } : { policy: x, gemel: 100 - x }); }
  function approve() { setPhase("done"); setTimeout(() => onDone({ amt, dest: destText }), 1700); }
  return (
    <div className="m-deposit">
      <div className="m-deposit-scrim" onClick={() => phase === "form" && onClose()}></div>
      <div className="m-sheet2">
        <div className="sh2-grip"></div>
        <div className="sh2-head">
          <div className="sh2-title"><Icon name="zap" /> הפקדה עכשיו</div>
          <span className="sh2-x" onClick={onClose}><Icon name="x" /></span>
        </div>

        {phase === "form" && (
          <div className="sh2-body">
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--mig-ink)", marginBottom: 4 }}>כמה תרצה להפקיד עכשיו?</div>
            <p style={{ fontSize: 13.5, color: "var(--mig-slate-600)", margin: "0 0 12px" }}>הפקדה חד-פעמית מיידית לחיסכון שלך במגדל.</p>
            <div className="m-amount" style={{ margin: "6px 0 10px" }}>
              <button onClick={() => setAmt((a) => Math.max(50, a - 100))}><Icon name="minus" /></button>
              <div className="val"><small>₪</small>{mnf(amt)}</div>
              <button onClick={() => setAmt((a) => Math.min(50000, a + 100))}><Icon name="plus" /></button>
            </div>
            <div className="m-preset-row">
              {[500, 1000, 2300].map((p) => <button key={p} className={"m-preset" + (amt === p ? " on" : "")} onClick={() => setAmt(p)}>₪{mnf(p)}{p === 2300 ? " · כל העודף" : ""}</button>)}
            </div>
            <div className="m-dep-alloc">
              <div className="m-alloc">
                <span className="ai"><Icon name="trending-up" /></span>
                <div className="an"><b>קופת גמל להשקעה</b><small>45067618</small></div>
                <div className="ap"><input type="number" value={alloc.gemel} onChange={(e) => setA("gemel", Number(e.target.value))} /><span className="pc">%</span></div>
              </div>
              <div className="m-alloc">
                <span className="ai"><Icon name="shield" /></span>
                <div className="an"><b>פוליסת חיסכון</b><small>POL-22841</small></div>
                <div className="ap"><input type="number" value={alloc.policy} onChange={(e) => setA("policy", Number(e.target.value))} /><span className="pc">%</span></div>
              </div>
              <div className="m-alloc-total"><span>סך הקצאה</span>{total === 100 ? <span className="ok"><Icon name="check" /> {total}%</span> : <span className="bad">{total}% — צריך 100%</span>}</div>
            </div>
            <button className="m-btn m-btn-green" style={{ marginTop: 14 }} disabled={total !== 100 || amt < 50} onClick={() => setPhase("bank")}>המשך לאישור בבנק <Icon name="arrow-left" /></button>
          </div>
        )}

        {phase === "bank" && (
          <div className="sh2-body">
            <div className="m-push">
              <div className="pc-head" style={{ background: bankColor, color: "#fff", border: "none" }}>
                <div className="src" style={{ color: "#fff" }}><span className="ml" style={{ background: "#fff", color: bankColor, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{bankMono}</span> {bankName}</div>
                <span className="when" style={{ color: "rgba(255,255,255,.85)" }}>עכשיו</span>
              </div>
              <div className="pc-body">
                <span className="r2p-tag">R2P · בקשת הפקדה מיידית</span>
                <h4>אישור הפקדה למגדל</h4>
                <div className="pamt"><small>₪</small>{mnf(amt)}</div>
                <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
                <div className="pdest"><Icon name="trending-up" /> יעד: {destText}</div>
              </div>
              <div className="pc-actions">
                <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
                <button className="decline" onClick={() => setPhase("form")}>חזרה</button>
              </div>
              <div className="secure"><Icon name="shield-check" /> האישור מתבצע באפליקציית הבנק · מאובטח</div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="sh2-body" style={{ textAlign: "center", padding: "26px 20px 40px" }}>
            <div className="m-bigcheck"><Icon name="check" /></div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--mig-ink)", margin: "0 0 6px" }}>ההפקדה בוצעה!</h3>
            <p style={{ fontSize: 14, color: "var(--mig-slate-600)", lineHeight: 1.5 }}>₪{mnf(amt)} הופקדו · {destText}.<br/>הטראקר מתעדכן…</p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MConfirm, MDashboard, MStrongMonth, MInstantDeposit });
