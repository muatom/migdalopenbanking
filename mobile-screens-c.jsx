/* Migdal חיסכון חכם — MOBILE screens C: Confirmation + Dashboard + Strong-month bank push */
const { useState: useStateMC, useEffect: useEffectMC, useRef: useRefMC } = React;

/* ============================================================
   SCREEN 7 — CONFIRMATION
   ============================================================ */
function MConfirm({ go, wz, bank }) {
  const oppCopy = wz.approval.opp === "r2p"
    ? "ובחודש חזק נשלח אליך בקשת הפקדה לאישור — בלי להעיק."
    : "ובחודש חזק נפקיד אוטומטית לפי החוקים שהגדרת.";
  return (
    <div className="m-scroll">
      <div className="m-confirm">
        <div className="check"><Icon name="check" /></div>
        <h1>חיסכון חכם פעיל!</h1>
        <p className="lead">מהיום מגדל שמה לב במקומך. הרצפה תרוץ בשקט, {oppCopy}</p>
        <div className="m-recap">
          <div className="m-review">
            <div className="m-rev"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{mnf(wz.floor)}</span></div>
            <div className="m-rev"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
            <div className="m-rev"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">{wz.goal != null ? "₪" + mnf(wz.goal) : "ללא יעד"}</span></div>
            <div className="m-rev"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
          </div>
        </div>
        <button className="m-btn m-btn-green" onClick={() => go(8)}>לאזור החיסכון שלי <Icon name="arrow-left" /></button>
      </div>
    </div>
  );
}

/* ---------- Mobile bottom-sheet dialog ---------- */
function MSheetDialog({ icon, tone, title, children, onClose }) {
  return (
    <div className="m-deposit">
      <div className="m-deposit-scrim" onClick={onClose}></div>
      <div className="m-sheet2">
        <div className="sh2-grip"></div>
        <div className="sh2-head">
          <div className="sh2-title"><Icon name={icon} /> {title}</div>
          <span className="sh2-x" onClick={onClose}><Icon name="x" /></span>
        </div>
        <div className="sh2-body">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 8 — DASHBOARD (steady state)
   ============================================================ */
function MDashboard({ go, wz, pushApproved, paused, setPaused, instant, openDeposit, bank, disconnect, pushDeclined, setPushDeclined, oppAmt, setOppAmt }) {
  const inst = instant || [];
  const instTotal = inst.reduce((s, x) => s + x.amt, 0);
  const baseSaved = 18400;
  const saved = baseSaved + (pushApproved ? oppAmt : 0) + instTotal;
  const hasGoal = wz.goal != null;
  const pct = hasGoal ? Math.min(100, Math.round(saved / wz.goal * 100)) : 0;
  const [animPct, setAnimPct] = useStateMC(0);
  useEffectMC(() => { const t = setTimeout(() => setAnimPct(pct), 220); return () => clearTimeout(t); }, [pct]);

  const [dlg, setDlg] = useStateMC(null); // null | pause | dc1 | dc2 | hist
  const [editAmt, setEditAmt] = useStateMC(false);

  const oppDest = mDestFromAlloc(wz.alloc);
  const baseDeps = [
    { d: mMonthFirst(0), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: mMonthFirst(1), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: mMonthDay(1, 18), t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" },
    { d: mMonthFirst(2), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "פוליסת חיסכון" },
  ];
  const instDeps = inst.map((x) => ({ d: x.d || mTodayHe(), t: "הפקדה מיידית", amt: x.amt, kind: "instant", dest: x.dest }));
  const deps = [
    ...instDeps,
    ...(pushApproved ? [{ d: mTodayHe(), t: "הזדמנות · חודש חזק", amt: oppAmt, kind: "opp", dest: oppDest }] : []),
    ...baseDeps,
  ];
  const monthDeposited = wz.floor + (pushApproved ? oppAmt : 0) + instTotal;
  const monthParts = ["רצפה ₪" + mnf(wz.floor), pushApproved ? "הזדמנות ₪" + mnf(oppAmt) : null, instTotal ? "מיידית ₪" + mnf(instTotal) : null].filter(Boolean);
  const activeRules = M_RULE_DEFS.filter((r) => wz.rules[r.id].on);

  const histRows = [];
  inst.forEach((x) => histRows.push({ d: x.d || mTodayHe(), t: "הפקדה מיידית", amt: x.amt, kind: "instant", dest: x.dest }));
  if (pushApproved) histRows.push({ d: mTodayHe(), t: "הזדמנות · חודש חזק", amt: oppAmt, kind: "opp", dest: oppDest });
  for (let m = 0; m < 10; m++) {
    histRows.push({ d: mMonthFirst(m), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: m % 3 === 0 ? "פוליסת חיסכון" : "קופת גמל להשקעה" });
    if (m === 1) histRows.push({ d: mMonthDay(1, 18), t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" });
    if (m === 5) histRows.push({ d: mMonthDay(5, 22), t: "הזדמנות · חודש חזק", amt: 900, kind: "opp", dest: "קופת גמל להשקעה" });
  }
  const tagFor = (k) => k === "opp" ? "אושר באפליקציית הבנק" : k === "instant" ? "מיידי · אושר בבנק" : "אוטופיילוט";

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
            : <div className="live"><i></i> פעיל · מחובר ל{bank ? bank.n : "הבנק שלך"}</div>}
        </div>
        <div className="m-dashbtns">
          <button className="m-depnow" onClick={() => openDeposit && openDeposit(null)}><Icon name="zap" /> הפקד</button>
          <button className="m-pause" onClick={() => paused ? setPaused(false) : setDlg("pause")}>
            <Icon name={paused ? "play" : "pause"} /> {paused ? "המשך" : "עצור"}
          </button>
        </div>
      </div>

      {/* Opportunity prompt */}
      {!pushApproved && !pushDeclined && !paused && (
        <div className="m-opp">
          <span className="pk"><Icon name="zap" /> זוהה חודש חזק</span>
          <h2>חודש טוב! יש לך תזרים פנוי גדול מהרגיל</h2>
          <div className="opp-amt"><small>₪</small>{mnf(oppAmt)}</div>
          <p>נשלחה אליך בקשת הפקדה על ₪{mnf(oppAmt)} נוספים ל{oppDest}. {wz.approval.opp === "r2p" ? "האישור מתבצע באפליקציית הבנק." : "ההפקדה תתבצע אוטומטית."}</p>
          {editAmt && (
            <div className="m-opp-amt-edit">
              <span className="oae-l">סכום</span>
              <div className="m-amount sm">
                <button onClick={() => setOppAmt(Math.max(100, oppAmt - 100))}><Icon name="minus" /></button>
                <div className="val"><small>₪</small>{mnf(oppAmt)}</div>
                <button onClick={() => setOppAmt(Math.min(10000, oppAmt + 100))}><Icon name="plus" /></button>
              </div>
            </div>
          )}
          <div className="m-opp-actions">
            <button className="m-btn m-btn-green" onClick={() => go(9)}>{wz.approval.opp === "r2p" ? "אישור בבנק" : "אישור"} <Icon name="arrow-left" /></button>
            <div className="m-opp-sub">
              <button className="m-btn-text2" onClick={() => setEditAmt((v) => !v)}><Icon name="pencil" /> שנה סכום</button>
              <button className="m-btn-text2" onClick={() => setPushDeclined(true)}>דלג החודש</button>
            </div>
          </div>
        </div>
      )}

      {/* Skipped this month */}
      {!pushApproved && pushDeclined && !paused && (
        <div className="m-skip">
          <span className="ms-ico"><Icon name="check" /></span>
          <div className="ms-txt"><b>בחרת לדלג החודש</b><p>לא נבצע הפקדת הזדמנות החודש ולא ננסה שוב עד החודש הבא. הרצפה ממשיכה כרגיל.</p></div>
          <button className="ms-undo" onClick={() => setPushDeclined(false)}>ביטול</button>
        </div>
      )}

      {/* data tiles */}
      <div className="m-tiles">
        <div className="m-tile blue">
          <div className="dl"><Icon name="eye" /> עודף שזוהה החודש</div>
          <div><div className="dn"><small>₪</small>2,300</div>
            <div className="m-strend">
              {[40, 55, 72, 100].map((v, i) => <span key={i} className="mst-bar" style={{ height: v + "%" }}></span>)}
              <span className="mst-d">+28%</span>
            </div>
          </div>
        </div>
        <div className="m-tile navy">
          <div className="dl"><Icon name="banknote" /> הופקד החודש</div>
          <div><div className="dn"><small>₪</small>{mnf(monthDeposited)}</div><div className="dsub">{monthParts.join(" + ")}</div></div>
        </div>
        <div className="m-tile green span2">
          <div className="dl"><Icon name="coins" /> נחסך עד היום דרך חיסכון חכם</div>
          <div><div className="dn"><small>₪</small>{mnf(saved)}</div><div className="dsub">פעיל מאז ספטמבר 2024</div></div>
        </div>
      </div>

      {/* goal tracker */}
      {hasGoal ? (
        <div className="m-goalcard">
          <div className="gc-top">
            <h3>היעד שלך · גמל להשקעה</h3>
            <span className="edit" onClick={() => go(6)}><Icon name="pencil" /> ערוך</span>
          </div>
          <div className="m-progress"><div className="fill" style={{ width: animPct + "%" }}></div></div>
          <div className="m-progress-meta">
            <span><b>₪{mnf(saved)}</b> נחסכו</span>
            <span>יעד: <b>₪{mnf(wz.goal)}</b> · {pct}%</span>
          </div>
        </div>
      ) : (
        <div className="m-goalcard empty">
          <div className="ge-ico"><Icon name="target" /></div>
          <div className="ge-txt"><b>עוד אין יעד</b><p>הגדרת יעד נותנת לעודף משמעות.</p></div>
          <button className="m-btn-ghost2" onClick={() => go(6)}>הגדר יעד</button>
        </div>
      )}

      {/* deposits */}
      <div className="m-panel">
        <div className="ph"><h3>ההפקדות שלי</h3><a className="lnk" onClick={() => setDlg("hist")}>הכל ›</a></div>
        {deps.map((x, i) => (
          <div className="m-dep" key={i}>
            <span className={"di " + x.kind}><Icon name={x.kind === "opp" ? "zap" : x.kind === "instant" ? "banknote" : "refresh"} /></span>
            <div className="dm">
              <b>{x.t}</b>
              <small>{x.d} · {x.dest}</small>
              <span className={"tag " + x.kind}>{tagFor(x.kind)}</span>
            </div>
            <div className="damt">₪{mnf(x.amt)}</div>
          </div>
        ))}
      </div>

      {/* rules */}
      <div className="m-panel">
        <div className="ph"><h3>החוקים שלי</h3><a className="lnk" onClick={() => go(4)}>ערוך</a></div>
        <div className="m-rulemini">
          <span className="rmi"><Icon name="banknote" /></span>
          <div className="rmt"><b>רצפה חודשית</b><small>₪{mnf(wz.floor)} בכל חודש</small></div>
          <span className={"badge-mode " + (wz.approval.floor === "auto" ? "auto" : "r2p")}>{wz.approval.floor === "auto" ? "אוטופיילוט" : "באישור"}</span>
        </div>
        {activeRules.length === 0 ? (
          <div className="m-rule-empty">אין חוקי הזדמנות פעילים — <a className="lnk" onClick={() => go(4)}>הוסף חוק</a></div>
        ) : activeRules.map((r) => (
          <div className="m-rulemini" key={r.id}>
            <span className="rmi"><Icon name={r.icon} /></span>
            <div className="rmt"><b>{r.t}</b><small>חוק הזדמנות</small></div>
            <span className={"badge-mode " + (wz.approval.opp === "r2p" ? "r2p" : "auto")}>{wz.approval.opp === "r2p" ? "באישור" : "אוטו׳"}</span>
          </div>
        ))}
      </div>

      {/* management */}
      <div className="m-panel">
        <div className="m-rulemini" style={{ cursor: "pointer" }} onClick={() => go(3)}>
          <span className="rmi"><Icon name="edit" /></span>
          <div className="rmt"><b>ערוך הגדרות</b><small>רצפה, הקצאה, הגנות</small></div>
          <span className="chev"><Icon name="chevron-left" /></span>
        </div>
        <div className="m-rulemini danger" style={{ cursor: "pointer" }} onClick={() => setDlg("dc1")}>
          <span className="rmi"><Icon name="unlink" /></span>
          <div className="rmt"><b>נתק וכבה</b><small>ביטול ההסכמה לבנקאות פתוחה</small></div>
          <span className="chev"><Icon name="chevron-left" /></span>
        </div>
      </div>

      <p className="m-disc" style={{ margin: "0 16px 8px" }}>
        סיכום חודשי יישלח אליך. אם בקשת ההפקדה לא תאושר תוך 24 שעות או שתידחה — נדלג על החודש ונעדכן אותך, בלי לנסות שוב. אין באמור ייעוץ או המלצה.
      </p>

      {/* Pause confirm */}
      {dlg === "pause" && (
        <MSheetDialog icon="pause" title="לעצור את כל ההפקדות?" onClose={() => setDlg(null)}>
          <p style={{ fontSize: 14, color: "var(--mig-slate-600)", lineHeight: 1.5, marginBottom: 16 }}>הרצפה והחוקים יושהו עד שתחזיר אותם. ההגדרות נשמרות — אפשר להמשיך בלחיצה אחת.</p>
          <button className="m-btn m-btn-green" onClick={() => { setPaused(true); setDlg(null); }}>עצור הכל</button>
          <button className="m-btn-text" onClick={() => setDlg(null)}>ביטול</button>
        </MSheetDialog>
      )}

      {/* Disconnect step 1 */}
      {dlg === "dc1" && (
        <MSheetDialog icon="unlink" tone="danger" title="לנתק את הבנק?" onClose={() => setDlg(null)}>
          <ul className="m-cd-list"><li>ההסכמה לבנקאות פתוחה תבוטל</li><li>הרצפה והחוקים יפסיקו לרוץ</li><li>היסטוריית ההפקדות נשמרת</li></ul>
          <button className="m-btn m-btn-danger" onClick={() => setDlg("dc2")}>המשך לניתוק</button>
          <button className="m-btn-text" onClick={() => setDlg(null)}>ביטול</button>
        </MSheetDialog>
      )}
      {/* Disconnect step 2 */}
      {dlg === "dc2" && (
        <MSheetDialog icon="unlink" tone="danger" title="לנתק סופית?" onClose={() => setDlg(null)}>
          <p style={{ fontSize: 14, color: "var(--mig-slate-600)", lineHeight: 1.5, marginBottom: 16 }}>זו פעולה אחרונה. תמיד אפשר לחבר מחדש בעתיד מתוך מגדל שלי.</p>
          <button className="m-btn m-btn-danger" onClick={() => { setDlg(null); disconnect && disconnect(); }}>נתק סופית</button>
          <button className="m-btn-text" onClick={() => setDlg(null)}>ביטול</button>
        </MSheetDialog>
      )}

      {/* Full history */}
      {dlg === "hist" && (
        <MSheetDialog icon="file" title="כל ההפקדות" onClose={() => setDlg(null)}>
          <div style={{ maxHeight: "60vh", overflowY: "auto", margin: "0 -4px" }}>
            {histRows.map((x, i) => (
              <div className="m-dep" key={i}>
                <span className={"di " + x.kind}><Icon name={x.kind === "opp" ? "zap" : x.kind === "instant" ? "banknote" : "refresh"} /></span>
                <div className="dm"><b>{x.t}</b><small>{x.d} · {x.dest}</small><span className={"tag " + x.kind}>{tagFor(x.kind)}</span></div>
                <div className="damt">₪{mnf(x.amt)}</div>
              </div>
            ))}
          </div>
        </MSheetDialog>
      )}
    </div>
  );
}

/* ============================================================
   SCREEN 9 — STRONG MONTH: deposit request approved in the BANK app (overlay)
   ============================================================ */
function MStrongMonth({ go, onApprove, bank, wz, oppAmt, setPushDeclined }) {
  const [state, setState] = useStateMC("ask");
  const timer = useRefMC(null);
  useEffectMC(() => () => clearTimeout(timer.current), []);
  function approve() {
    setState("done");
    timer.current = setTimeout(() => { onApprove(); go(8); }, 1900);
  }
  function decline() { setPushDeclined && setPushDeclined(true); go(8); }
  const bankColor = (bank && bank.c) || "#3d65e3";
  const bankName = (bank && bank.n) || "הבנק שלך";
  const bankMono = (bank && bank.m) || "ב";
  const dest = mDestFromAlloc(wz ? wz.alloc : null);
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
              <div className="src"><span className="ml"><img src={LOGO_WHITE} alt="מגדל" /></span> בקשת הפקדה · מגדל</div>
              <span className="when">עכשיו</span>
            </div>
            <div className="pc-body">
              <span className="r2p-tag">בקשת הפקדה</span>
              <h4>חודש טוב! להפקיד עוד?</h4>
              <div className="pamt"><small>₪</small>{mnf(oppAmt)}</div>
              <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
              <div className="pdest"><Icon name="trending-up" /> יעד: {dest} במגדל</div>
            </div>
            <div className="pc-actions two">
              <button className="decline" onClick={decline}>לא עכשיו</button>
              <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
            </div>
            <div className="secure"><Icon name="shield-check" /> מאובטח לפי תקן הבנקאות הפתוחה</div>
          </div>
        ) : (
          <div className="m-bank-done">
            <div className="bd-check" style={{ color: bankColor }}><Icon name="check" /></div>
            <h4>ההעברה אושרה</h4>
            <p>₪{mnf(oppAmt)} הועברו למגדל.<br/>מחזירים אותך לחיסכון שלך…</p>
            <div className="m-flowdots">
              <div className="fd active"><i><Icon name="check" style={{ width: 13, height: 13 }} /></i> בקשת ההפקדה הגיעה לאפליקציית הבנק</div>
              <div className="fd active"><i><Icon name="check" style={{ width: 13, height: 13 }} /></i> אישרת — הכסף עבר</div>
              <div className="fd active"><i>3</i> מגדל זוקפת לחיסכון ומד ההתקדמות מתעדכן</div>
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
function MInstantDeposit({ open, onClose, onDone, wz, bank, ctx, setBank }) {
  const presetDest = ctx && ctx.dest;
  const initAlloc = () => presetDest === "פוליסה" ? { gemel: 0, policy: 100 }
    : presetDest === "גמל" ? { gemel: 100, policy: 0 }
    : { gemel: wz.alloc.gemel, policy: wz.alloc.policy };
  const [phase, setPhase] = useStateMC("form"); // form | connect | redirect | bank | done
  const [amt, setAmt] = useStateMC(1000);
  const [alloc, setAlloc] = useStateMC(initAlloc);
  const [sel, setSel] = useStateMC(null);
  const timer = useRefMC(null);
  useEffectMC(() => { if (open) { setPhase("form"); setAmt(1000); setAlloc(initAlloc()); setSel(null); clearTimeout(timer.current); } }, [open, presetDest]);
  useEffectMC(() => () => clearTimeout(timer.current), []);
  if (!open) return null;
  const total = alloc.gemel + alloc.policy;
  const bankColor = (bank && bank.c) || "#3d65e3";
  const bankName = (bank && bank.n) || "הבנק שלך";
  const bankMono = (bank && bank.m) || "ב";
  const destText = mDestFromAlloc(alloc);
  function setA(key, v) { const x = Math.max(0, Math.min(100, isNaN(v) ? 0 : v)); setAlloc(key === "gemel" ? { gemel: x, policy: 100 - x } : { policy: x, gemel: 100 - x }); }
  function proceed() { setPhase(bank ? "bank" : "connect"); }
  function pickBank(b) { setSel(b); setPhase("redirect"); timer.current = setTimeout(() => { setBank && setBank(b); setPhase("bank"); }, 1700); }
  function approve() { setPhase("done"); timer.current = setTimeout(() => onDone({ amt, dest: destText }), 1700); }
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
                <div className="an"><b>פוליסת חיסכון</b><small>8225841</small></div>
                <div className="ap"><input type="number" value={alloc.policy} onChange={(e) => setA("policy", Number(e.target.value))} /><span className="pc">%</span></div>
              </div>
              <div className="m-alloc-total"><span>סך הקצאה</span>{total === 100 ? <span className="ok"><Icon name="check" /> {total}%</span> : <span className="bad">{total}% — צריך 100%</span>}</div>
            </div>
            <button className="m-btn m-btn-green" style={{ marginTop: 14 }} disabled={total !== 100 || amt < 50} onClick={proceed}>{bank ? "המשך לאישור בבנק" : "המשך לחיבור הבנק"} <Icon name="arrow-left" /></button>
          </div>
        )}

        {phase === "connect" && (
          <div className="sh2-body">
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--mig-ink)", marginBottom: 4 }}>קודם מחברים את הבנק</div>
            <p style={{ fontSize: 13, color: "var(--mig-slate-600)", margin: "0 0 12px" }}>כדי לאשר הפקדה צריך לחבר פעם אחת את חשבון העו״ש. בחר את הבנק שלך:</p>
            <div className="m-banks">
              {MBANKS.map((b) => (
                <div className="m-bank" key={b.n} onClick={() => pickBank(b)}>
                  <div className="bk-logo" style={{ background: b.c }}>{b.m}</div>
                  <div className="bk-n">{b.n}</div>
                </div>
              ))}
            </div>
            <div className="sh-foot" style={{ marginTop: 14 }}><Icon name="shield" /> מאושר ומפוקח לפי תקן הבנקאות הפתוחה</div>
          </div>
        )}

        {phase === "redirect" && (
          <div className="sh2-body">
            <div className="m-redirect">
              <div className="m-spinner"></div>
              <h3>מעבירים אותך ל{sel ? sel.n : "בנק"}…</h3>
              <p className="p">אשרו את ההסכמה באפליקציית הבנק. נחזיר אותך אוטומטית.</p>
            </div>
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
                <span className="r2p-tag">בקשת הפקדה מיידית</span>
                <h4>אישור הפקדה למגדל</h4>
                <div className="pamt"><small>₪</small>{mnf(amt)}</div>
                <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
                <div className="pdest"><Icon name="trending-up" /> יעד: {destText}</div>
              </div>
              <div className="pc-actions two">
                <button className="decline" onClick={() => setPhase("form")}>חזרה</button>
                <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
              </div>
              <div className="secure"><Icon name="shield-check" /> האישור מתבצע באפליקציית הבנק · מאובטח</div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="sh2-body" style={{ textAlign: "center", padding: "26px 20px 40px" }}>
            <div className="m-bigcheck"><Icon name="check" /></div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--mig-ink)", margin: "0 0 6px" }}>ההפקדה בוצעה!</h3>
            <p style={{ fontSize: 14, color: "var(--mig-slate-600)", lineHeight: 1.5 }}>₪{mnf(amt)} הופקדו · {destText}.<br/>מד ההתקדמות מתעדכן…</p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MConfirm, MDashboard, MStrongMonth, MInstantDeposit });
