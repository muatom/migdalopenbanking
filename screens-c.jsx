/* Migdal חיסכון חכם — screens C: Confirmation, Dashboard (steady state), Strong-month bank-app push */
const { useState: useStateC, useEffect: useEffectC } = React;

/* ============================================================
   SCREEN 7 — Confirmation / activated
   ============================================================ */
function ConfirmScreen({ go, wz, bank }) {
  const oppCopy = wz.approval.opp === "r2p"
    ? "ובחודש חזק נשלח אליך בקשת הפקדה לאישור — בלי להעיק."
    : "ובחודש חזק נפקיד אוטומטית לפי החוקים שהגדרת — בשקט.";
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם"]} title="חיסכון חכם" />
      <div className="confirm">
        <div className="check"><Icon name="check" /></div>
        <h1>חיסכון חכם פעיל!</h1>
        <p className="lead">מהיום מגדל שמה לב במקומך. הרצפה תרוץ בשקט, {oppCopy}</p>
        <div className="recap">
          <div className="review">
            <div className="rev-row"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{nf(wz.floor)}</span></div>
            <div className="rev-row"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
            <div className="rev-row"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">{wz.goal != null ? "₪" + nf(wz.goal) : "ללא יעד"}</span></div>
            <div className="rev-row"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
          </div>
        </div>
        <div className="stack-cta" style={{ justifyContent: "center" }}>
          <button className="btn btn-green btn-lg" onClick={() => go(8)}>לאזור החיסכון שלי <Icon name="arrow-left" /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Generic confirm dialog ---------- */
function ConfirmDialog({ icon, tone, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  return (
    <div className="of-scrim" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="of-modal" style={{ maxWidth: 440 }}>
        <div className="confirm-dialog">
          <div className={"cd-ico " + (tone || "")}><Icon name={icon} /></div>
          <h3>{title}</h3>
          <div className="cd-body">{body}</div>
          <div className="cd-actions">
            <button className={"btn " + (tone === "danger" ? "btn-danger" : "btn-green")} onClick={onConfirm}>{confirmLabel}</button>
            <button className="btn btn-ghost" onClick={onCancel}>{cancelLabel || "ביטול"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Surplus historical trend (mini bars) ---------- */
function SurplusTrend() {
  const months = [
    { m: "מרץ", v: 38 }, { m: "אפר׳", v: 52 }, { m: "מאי", v: 70 }, { m: "יוני", v: 100 },
  ];
  return (
    <div className="surplus-trend">
      <div className="st-bars">
        {months.map((x, i) => (
          <div className="st-col" key={i}>
            <div className="st-bar" style={{ height: x.v + "%" }}></div>
            <span className="st-m">{x.m}</span>
          </div>
        ))}
      </div>
      <span className="st-delta"><Icon name="trending-up" /> +28% מהחודש שעבר</span>
    </div>
  );
}

/* ---------- Full deposit history modal ---------- */
function HistoryModal({ wz, instant, pushApproved, oppAmt, onClose }) {
  const rows = [];
  (instant || []).forEach((x) => rows.push({ d: x.d || todayHe(), t: "הפקדה מיידית", amt: x.amt, kind: "instant", dest: x.dest }));
  if (pushApproved) rows.push({ d: todayHe(), t: "הזדמנות · חודש חזק", amt: oppAmt, kind: "opp", dest: destFromAlloc(wz.alloc) });
  for (let m = 0; m < 10; m++) {
    rows.push({ d: monthFirst(m), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: m % 3 === 0 ? "פוליסת חיסכון" : "קופת גמל להשקעה" });
    if (m === 1) rows.push({ d: monthDay(1, 18), t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" });
    if (m === 5) rows.push({ d: monthDay(5, 22), t: "הזדמנות · חודש חזק", amt: 900, kind: "opp", dest: "קופת גמל להשקעה" });
  }
  const tag = (k) => k === "opp" ? "אושר באפליקציית הבנק" : k === "instant" ? "מיידי · אושר בבנק" : "אוטופיילוט";
  return (
    <div className="of-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="of-modal" style={{ maxWidth: 560 }}>
        <div className="of-head">
          <div className="of-brand"><Icon name="file" style={{ width: 20, height: 20, color: "var(--mig-green)" }} /> כל ההפקדות</div>
          <div className="of-brand"><span onClick={onClose} style={{ cursor: "pointer", display: "flex" }}><Icon name="x" style={{ width: 18, height: 18 }} /></span></div>
        </div>
        <div className="of-body" style={{ maxHeight: 460, overflowY: "auto", padding: "8px 24px 20px" }}>
          {rows.map((x, i) => (
            <div className="dep" key={i}>
              <span className={"di " + x.kind}><Icon name={x.kind === "opp" ? "zap" : x.kind === "instant" ? "banknote" : "refresh"} /></span>
              <div className="dmid">
                <b>{x.t}</b>
                <small>{x.d} · {x.dest}</small>
                <div><span className={"tag " + x.kind}>{tag(x.kind)}</span></div>
              </div>
              <div className="damt">₪{nf(x.amt)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 8 — Dashboard (steady state)
   ============================================================ */
function Dashboard({ go, wz, pushApproved, paused, setPaused, instant, openDeposit, bank, disconnect, pushDeclined, setPushDeclined, oppAmt, setOppAmt }) {
  const inst = instant || [];
  const instTotal = inst.reduce((s, x) => s + x.amt, 0);
  const baseSaved = 18400;
  const saved = baseSaved + (pushApproved ? oppAmt : 0) + instTotal;
  const hasGoal = wz.goal != null;
  const pct = hasGoal ? Math.min(100, Math.round(saved / wz.goal * 100)) : 0;
  const [animPct, setAnimPct] = useStateC(0);
  useEffectC(() => { const t = setTimeout(() => setAnimPct(pct), 200); return () => clearTimeout(t); }, [pct]);

  const [pausePrompt, setPausePrompt] = useStateC(false);
  const [dcPhase, setDcPhase] = useStateC(null); // null | warn | final
  const [histOpen, setHistOpen] = useStateC(false);
  const [editAmt, setEditAmt] = useStateC(false);

  const oppDest = destFromAlloc(wz.alloc);
  const baseDeps = [
    { d: monthFirst(0), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: monthFirst(1), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "קופת גמל להשקעה" },
    { d: monthDay(1, 18), t: "הזדמנות · חודש חזק", amt: 1200, kind: "opp", dest: "קופת גמל להשקעה" },
    { d: monthFirst(2), t: "רצפה חודשית", amt: wz.floor, kind: "auto", dest: "פוליסת חיסכון" },
  ];
  const instDeps = inst.map((x) => ({ d: x.d || todayHe(), t: "הפקדה מיידית", amt: x.amt, kind: "instant", dest: x.dest }));
  const deps = [
    ...instDeps,
    ...(pushApproved ? [{ d: todayHe(), t: "הזדמנות · חודש חזק", amt: oppAmt, kind: "opp", dest: oppDest }] : []),
    ...baseDeps,
  ];
  const monthDeposited = wz.floor + (pushApproved ? oppAmt : 0) + instTotal;
  const monthParts = ["רצפה ₪" + nf(wz.floor), pushApproved ? "הזדמנות ₪" + nf(oppAmt) : null, instTotal ? "מיידית ₪" + nf(instTotal) : null].filter(Boolean);

  const activeRules = RULE_DEFS.filter((r) => wz.rules[r.id].on);
  const oppApprovalText = wz.approval.opp === "r2p" ? "האישור מתבצע באפליקציית הבנק שלך." : "ההפקדה תתבצע אוטומטית לפי ההגדרות שלך.";

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
              {!paused && <span> · מחובר ל{bank ? bank.n : "הבנק שלך"}</span>}</p>
          </div>
          <div className="dh-r">
            <button className="depnow" onClick={() => openDeposit && openDeposit(null)}>
              <Icon name="zap" /> הפקד עכשיו
            </button>
            <button className="pausebtn" onClick={() => paused ? setPaused(false) : setPausePrompt(true)}>
              <Icon name={paused ? "play" : "pause"} /> {paused ? "המשך הכל" : "עצור הכל"}
            </button>
          </div>
        </div>

        {/* Opportunity prompt — strong month detected */}
        {!pushApproved && !pushDeclined && !paused && (
          <div className="promo" style={{ padding: "28px 36px", marginBottom: 24 }}>
            <div className="promo-txt" style={{ maxWidth: 640 }}>
              <span className="kick"><Icon name="zap" /> זוהה חודש חזק</span>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}>חודש טוב! יש לך תזרים פנוי גדול מהרגיל</h2>
              <p style={{ marginBottom: 18 }}>נשלחה אליך בקשת הפקדה על ₪{nf(oppAmt)} נוספים ל{oppDest}. {oppApprovalText}</p>
              {editAmt && (
                <div className="opp-amt-edit">
                  <span className="oae-l">סכום ההפקדה</span>
                  <div className="amount sm">
                    <button onClick={() => setOppAmt(Math.min(10000, oppAmt + 100))}><Icon name="plus" style={{ width: 18, height: 18 }} /></button>
                    <div className="val"><small>₪</small>{nf(oppAmt)}</div>
                    <button onClick={() => setOppAmt(Math.max(100, oppAmt - 100))}><Icon name="minus" style={{ width: 18, height: 18 }} /></button>
                  </div>
                </div>
              )}
              <div className="opp-actions">
                <button className="btn btn-green" onClick={() => go(9)}>{wz.approval.opp === "r2p" ? "אישור בבנק" : "אישור ההפקדה"} <Icon name="arrow-left" /></button>
                <button className="btn btn-ghost" onClick={() => setEditAmt((v) => !v)}><Icon name="pencil" /> שנה סכום</button>
                <button className="btn btn-ghost" onClick={() => setPushDeclined(true)}>דלג החודש</button>
              </div>
            </div>
            <div className="promo-art">
              <div className="surplus-coin" style={{ width: 170, height: 170 }}>
                <span className="s-lbl">הזדמנות החודש</span>
                <span className="s-num" style={{ fontSize: 34 }}>₪{nf(oppAmt)}</span>
                <span className="s-sub">ממתין לאישורך</span>
              </div>
            </div>
          </div>
        )}

        {/* Skipped this month notice */}
        {!pushApproved && pushDeclined && !paused && (
          <div className="skip-note">
            <span className="sn-ico"><Icon name="check" /></span>
            <div className="sn-txt">
              <b>בחרת לדלג החודש</b>
              <p>לא נבצע את הפקדת ההזדמנות החודש, ולא ננסה שוב עד החודש הבא. הרצפה שלך ממשיכה לרוץ כרגיל.</p>
            </div>
            <button className="sn-undo" onClick={() => setPushDeclined(false)}>ביטול</button>
          </div>
        )}

        {/* Data tiles */}
        <div className="data-tiles">
          <div className="dtile blue">
            <div className="dl"><Icon name="eye" /> עודף שזוהה החודש</div>
            <div><div className="dn"><small>₪</small>2,300</div><SurplusTrend /></div>
          </div>
          <div className="dtile navy">
            <div className="dl"><Icon name="banknote" /> הופקד החודש</div>
            <div><div className="dn"><small>₪</small>{nf(monthDeposited)}</div><div className="dsub">{monthParts.join(" + ")}</div></div>
          </div>
          <div className="dtile green">
            <div className="dl"><Icon name="coins" /> נחסך עד היום</div>
            <div><div className="dn"><small>₪</small>{nf(saved)}</div><div className="dsub">דרך חיסכון חכם · פעיל מאז ספטמבר 2024</div></div>
          </div>
        </div>

        {/* Goal tracker */}
        {hasGoal ? (
          <div className="goal-card">
            <div className="gc-top">
              <h3>היעד שלך · קופת גמל להשקעה</h3>
              <span className="edit" onClick={() => go(6)}><Icon name="pencil" /> ערוך יעד</span>
            </div>
            <div className="progress"><div className="fill" style={{ width: animPct + "%" }}></div></div>
            <div className="progress-meta">
              <span><b>₪{nf(saved)}</b> <span className="muted">נחסכו</span></span>
              <span className="muted">יעד: <b style={{ fontSize: 15 }}>₪{nf(wz.goal)}</b> · {pct}%</span>
            </div>
          </div>
        ) : (
          <div className="goal-card empty">
            <div className="ge-ico"><Icon name="target" /></div>
            <div className="ge-txt"><b>עוד אין יעד</b><p>הגדרת יעד נותנת לעודף משמעות — ותראה את ההתקדמות אליו.</p></div>
            <button className="btn btn-ghost" onClick={() => go(6)}>הגדר יעד</button>
          </div>
        )}

        {/* Two columns */}
        <div className="dash-cols">
          {/* Deposits */}
          <div className="panel">
            <div className="ph"><h3>ההפקדות שלי</h3><a className="lnk" onClick={() => setHistOpen(true)}>הכל ›</a></div>
            {deps.map((x, i) => (
              <div className="dep" key={i}>
                <span className={"di " + x.kind}><Icon name={x.kind === "opp" ? "zap" : x.kind === "instant" ? "banknote" : "refresh"} /></span>
                <div className="dmid">
                  <b>{x.t}</b>
                  <small>{x.d} · {x.dest}</small>
                  <div><span className={"tag " + x.kind}>{x.kind === "opp" ? "אושר באפליקציית הבנק" : x.kind === "instant" ? "אושר באפליקציית הבנק · מיידי" : "אוטופיילוט"}</span></div>
                </div>
                <div className="damt">₪{nf(x.amt)}</div>
              </div>
            ))}
          </div>

          {/* Rules + management */}
          <div>
            <div className="panel">
              <div className="ph"><h3>החוקים שלי</h3><a className="lnk" onClick={() => go(4)}>ערוך</a></div>
              <div className="rule-mini">
                <span className="rmi"><Icon name="banknote" /></span>
                <div className="rmt"><b>רצפה חודשית</b><small>₪{nf(wz.floor)} בכל חודש</small></div>
                <span className={"badge-mode " + (wz.approval.floor === "auto" ? "auto" : "r2p")}>{wz.approval.floor === "auto" ? "אוטופיילוט" : "באישור"}</span>
              </div>
              {activeRules.length === 0 ? (
                <div className="rule-empty">אין חוקי הזדמנות פעילים — <a className="lnk" onClick={() => go(4)}>הוסף חוק</a></div>
              ) : activeRules.map((r) => (
                <div className="rule-mini" key={r.id}>
                  <span className="rmi"><Icon name={r.icon} /></span>
                  <div className="rmt"><b>{r.t}</b><small>חוק הזדמנות</small></div>
                  <span className={"badge-mode " + (wz.approval.opp === "r2p" ? "r2p" : "auto")}>{wz.approval.opp === "r2p" ? "באישור" : "אוטו׳"}</span>
                </div>
              ))}
            </div>
            <div className="panel" style={{ padding: "20px 24px" }}>
              <div className="rule-mini" style={{ cursor: "pointer", borderBottom: "1px solid var(--mig-line-soft)" }} onClick={() => go(3)}>
                <span className="rmi"><Icon name="edit" /></span>
                <div className="rmt"><b>ערוך הגדרות</b><small>רצפה, הקצאה, הגנות</small></div>
                <Icon name="chevron-left" style={{ width: 20, color: "var(--mig-slate-400)" }} />
              </div>
              <div className="rule-mini" style={{ cursor: "pointer" }} onClick={() => setDcPhase("warn")}>
                <span className="rmi" style={{ background: "rgba(182,80,88,.1)", color: "var(--error)" }}><Icon name="unlink" /></span>
                <div className="rmt"><b style={{ color: "var(--error)" }}>נתק וכבה</b><small>ביטול ההסכמה לבנקאות פתוחה</small></div>
                <Icon name="chevron-left" style={{ width: 20, color: "var(--mig-slate-400)" }} />
              </div>
            </div>
          </div>
        </div>

        <p className="disclaimer" style={{ marginTop: 22 }}>
          סיכום חודשי יישלח אליך. אם בקשת ההפקדה לא תאושר תוך 24 שעות או שתידחה (אין מספיק יתרה) — נדלג על החודש ונעדכן אותך, בלי לנסות שוב. אין באמור ייעוץ או המלצה.
        </p>
      </div>

      {/* Pause confirmation */}
      {pausePrompt && (
        <ConfirmDialog icon="pause" tone="" title="לעצור את כל ההפקדות?"
          body={<p>הרצפה והחוקים יושהו עד שתחזיר אותם. ההגדרות נשמרות — אפשר להמשיך בלחיצה אחת בכל רגע.</p>}
          confirmLabel="עצור הכל" onCancel={() => setPausePrompt(false)}
          onConfirm={() => { setPaused(true); setPausePrompt(false); }} />
      )}

      {/* Disconnect — two steps */}
      {dcPhase === "warn" && (
        <ConfirmDialog icon="unlink" tone="danger" title="לנתק את הבנק?"
          body={<ul className="cd-list"><li>ההסכמה לבנקאות פתוחה תבוטל</li><li>הרצפה והחוקים יפסיקו לרוץ</li><li>היסטוריית ההפקדות שלך נשמרת</li></ul>}
          confirmLabel="המשך לניתוק" onCancel={() => setDcPhase(null)}
          onConfirm={() => setDcPhase("final")} />
      )}
      {dcPhase === "final" && (
        <ConfirmDialog icon="unlink" tone="danger" title="לנתק סופית?"
          body={<p>זו פעולה אחרונה. תמיד אפשר לחבר מחדש בעתיד מתוך מגדל שלי.</p>}
          confirmLabel="נתק סופית" onCancel={() => setDcPhase(null)}
          onConfirm={() => { setDcPhase(null); disconnect && disconnect(); }} />
      )}

      {histOpen && <HistoryModal wz={wz} instant={instant} pushApproved={pushApproved} oppAmt={oppAmt} onClose={() => setHistOpen(false)} />}
    </div>
  );
}

/* ============================================================
   SCREEN 9 — Strong month: deposit request approved in the BANK app
   ============================================================ */
function PhoneStatus() {
  return (
    <div className="pstatus">
      <span>19:44</span>
      <span className="ic-r"><Icon name="signal" /><Icon name="wifi" /><Icon name="battery" /></span>
    </div>
  );
}
function StrongMonth({ go, onApprove, bank, wz, oppAmt, setPushDeclined }) {
  const [state, setState] = useStateC("ask"); // ask | done
  function approve() {
    setState("done");
    setTimeout(() => { onApprove(); go(8); }, 1900);
  }
  function decline() { setPushDeclined && setPushDeclined(true); go(8); }
  const bankColor = (bank && bank.c) || "#6a1b9a";
  const bankName = (bank && bank.n) || "הבנק שלך";
  const bankMono = (bank && bank.m) || "ב";
  const dest = destFromAlloc(wz ? wz.alloc : null);
  return (
    <div className="stage">
      <div className="stage-copy">
        <span className="eyebrow"><Icon name="zap" /> רגע ההזדמנות</span>
        <h2>האישור קורה באפליקציית הבנק שלך</h2>
        <p>זוהה חודש חזק. מגדל שולחת בקשת הפקדה דרך הבנקאות הפתוחה — ואתה מאשר אותה ב{bankName}, החשבון שעליו נתת הסכמה.</p>
        <div className="flow-dots">
          <div className={"fd " + (state === "ask" ? "active" : "")}><i>1</i> בקשת ההפקדה מגיעה לאפליקציית הבנק</div>
          <div className={"fd " + (state === "done" ? "active" : "")}><i>2</i> אתה מאשר — הכסף עובר</div>
          <div className="fd"><i>3</i> מגדל זוקפת לחיסכון ומד ההתקדמות מתעדכן</div>
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
                    <div className="src"><span className="ml"><img src={(window.__resources && window.__resources.migdalLogoWhite) || "assets/migdal-logo-white.png"} alt="מגדל" /></span> בקשת הפקדה · מגדל</div>
                    <span>עכשיו</span>
                  </div>
                  <div className="pc-body">
                    <span className="r2p-tag">בקשת הפקדה</span>
                    <h4>חודש טוב! להפקיד עוד?</h4>
                    <div className="pamt"><small>₪</small>{nf(oppAmt)}</div>
                    <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
                    <div className="pdest"><Icon name="trending-up" /> יעד: {dest} במגדל</div>
                  </div>
                  <div className="pc-actions two">
                    <button className="decline" onClick={decline}>לא עכשיו</button>
                    <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
                  </div>
                  <div className="push-secure" style={{ paddingBottom: 14 }}><Icon name="shield-check" /> מאובטח לפי תקן הבנקאות הפתוחה</div>
                </div>
              ) : (
                <div className="ba-done">
                  <div className="bd-check"><Icon name="check" /></div>
                  <h4>ההעברה אושרה</h4>
                  <p>₪{nf(oppAmt)} הועברו למגדל.<br/>מעבירים אותך חזרה לחיסכון שלך…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INSTANT DEPOSIT — on-demand one-off deposit (request via bank app)
   ============================================================ */
function InstantDeposit({ open, onClose, onDone, wz, bank, ctx, setBank }) {
  const presetDest = ctx && ctx.dest;
  const initAlloc = () => presetDest === "פוליסה" ? { gemel: 0, policy: 100 }
    : presetDest === "גמל" ? { gemel: 100, policy: 0 }
    : { gemel: wz.alloc.gemel, policy: wz.alloc.policy };
  const [phase, setPhase] = useStateC("form"); // form | connect | redirect | bank | done
  const [amt, setAmt] = useStateC(1000);
  const [alloc, setAlloc] = useStateC(initAlloc);
  const [sel, setSel] = useStateC(null);
  useEffectC(() => { if (open) { setPhase("form"); setAmt(1000); setAlloc(initAlloc()); setSel(null); } }, [open, presetDest]);
  if (!open) return null;
  const total = alloc.gemel + alloc.policy;
  const bankColor = (bank && bank.c) || "#3d65e3";
  const bankName = (bank && bank.n) || "הבנק שלך";
  const bankMono = (bank && bank.m) || "ב";
  const destText = destFromAlloc(alloc);
  function setA(key, v) {
    const x = Math.max(0, Math.min(100, isNaN(v) ? 0 : v));
    setAlloc(key === "gemel" ? { gemel: x, policy: 100 - x } : { policy: x, gemel: 100 - x });
  }
  function proceed() { setPhase(bank ? "bank" : "connect"); }
  function pickBank(b) { setSel(b); setPhase("redirect"); setTimeout(() => { setBank && setBank(b); setPhase("bank"); }, 1800); }
  function approve() { setPhase("done"); setTimeout(() => onDone({ amt, dest: destText }), 1700); }
  return (
    <div className="of-scrim" onClick={(e) => { if (e.target === e.currentTarget && phase === "form") onClose(); }}>
      <div className="of-modal">
        <div className="of-head">
          <div className="of-brand"><Icon name="zap" style={{ width: 20, height: 20, color: "var(--mig-green)" }} /> הפקדה עכשיו</div>
          <div className="of-brand"><span onClick={onClose} style={{ cursor: "pointer", display: "flex" }}><Icon name="x" style={{ width: 18, height: 18 }} /></span></div>
        </div>

        {phase === "form" && (
          <div className="of-body">
            <h3>כמה תרצה להפקיד עכשיו?</h3>
            <p className="p">הפקדה חד-פעמית מיידית לחיסכון שלך במגדל.</p>
            <div className="amount" style={{ margin: "4px 0 14px" }}>
              <button onClick={() => setAmt((a) => Math.min(50000, a + 100))}><Icon name="plus" style={{ width: 22, height: 22 }} /></button>
              <div className="val"><small>₪</small>{nf(amt)}</div>
              <button onClick={() => setAmt((a) => Math.max(50, a - 100))}><Icon name="minus" style={{ width: 22, height: 22 }} /></button>
            </div>
            <div className="preset-row">
              {[500, 1000, 2300].map((p) => (
                <button key={p} className={"preset" + (amt === p ? " on" : "")} onClick={() => setAmt(p)}>₪{nf(p)}{p === 2300 ? " · כל העודף" : ""}</button>
              ))}
            </div>
            <div className="dep-alloc">
              <div className="alloc-row">
                <span className="ai"><Icon name="trending-up" /></span>
                <div className="an"><b>קופת גמל להשקעה</b><small>45067618</small></div>
                <div className="alloc-pct"><input type="number" value={alloc.gemel} onChange={(e) => setA("gemel", Number(e.target.value))} /><span className="pc">%</span></div>
              </div>
              <div className="alloc-row">
                <span className="ai"><Icon name="shield" /></span>
                <div className="an"><b>פוליסת חיסכון</b><small>8225841</small></div>
                <div className="alloc-pct"><input type="number" value={alloc.policy} onChange={(e) => setA("policy", Number(e.target.value))} /><span className="pc">%</span></div>
              </div>
              <div className="alloc-total">
                <span>סך הקצאה</span>
                {total === 100 ? <span className="ok"><Icon name="check" style={{ width: 18, height: 18 }} /> {total}%</span> : <span className="bad">{total}% — צריך 100%</span>}
              </div>
            </div>
            <button className="btn btn-green btn-block btn-lg" style={{ marginTop: 16 }} disabled={total !== 100 || amt < 50} onClick={proceed}>
              {bank ? "המשך לאישור בבנק" : "המשך לחיבור הבנק"} <Icon name="arrow-left" />
            </button>
          </div>
        )}

        {phase === "connect" && (
          <div className="of-body">
            <h3>קודם מחברים את הבנק</h3>
            <p className="p">כדי לאשר הפקדה דרך הבנקאות הפתוחה צריך לחבר פעם אחת את חשבון העו״ש. בחר את הבנק שלך:</p>
            <div className="bank-grid">
              {BANKS.slice(0, 6).map((b) => (
                <div className="bank-opt" key={b.n} onClick={() => pickBank(b)}>
                  <div className="bank-logo" style={{ background: b.c }}>{b.m}</div>
                  <div className="bn">{b.n}</div>
                </div>
              ))}
            </div>
            <div className="of-foot"><Icon name="shield" /> מאושר ומפוקח לפי תקן הבנקאות הפתוחה בישראל</div>
          </div>
        )}

        {phase === "redirect" && (
          <div className="of-body">
            <div className="of-redirect">
              <div className="spinner"></div>
              <h3>מעבירים אותך ל{sel ? sel.n : "בנק"}…</h3>
              <p className="p">אשרו את ההסכמה באפליקציית הבנק. נחזיר אותך אוטומטית.</p>
            </div>
          </div>
        )}

        {phase === "bank" && (
          <div className="of-body">
            <div className="push-card" style={{ boxShadow: "none", border: "1px solid var(--mig-line-soft)" }}>
              <div className="pc-head" style={{ background: bankColor, color: "#fff", border: "none" }}>
                <div className="src" style={{ color: "#fff" }}><span className="ml" style={{ background: "#fff", color: bankColor, fontFamily: "var(--font-display)", fontWeight: 800 }}>{bankMono}</span> {bankName}</div>
                <Icon name="lock" style={{ width: 16, height: 16 }} />
              </div>
              <div className="pc-body">
                <span className="r2p-tag">בקשת הפקדה מיידית</span>
                <h4>אישור הפקדה למגדל</h4>
                <div className="pamt"><small>₪</small>{nf(amt)}</div>
                <div className="pmeta">מתוך העו״ש שלך · חד-פעמי</div>
                <div className="pdest"><Icon name="trending-up" /> יעד: {destText}</div>
              </div>
              <div className="pc-actions two">
                <button className="decline" onClick={() => setPhase("form")}>חזרה</button>
                <button className="approve" style={{ background: bankColor }} onClick={approve}>אישור והעברה</button>
              </div>
              <div className="push-secure" style={{ paddingBottom: 14 }}><Icon name="shield-check" /> האישור מתבצע באפליקציית הבנק · מאובטח</div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="of-body">
            <div className="of-redirect">
              <div className="check" style={{ width: 84, height: 84, margin: "0 auto 18px", background: "var(--mig-green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" style={{ width: 42, height: 42, color: "var(--mig-ink)" }} /></div>
              <h3>ההפקדה בוצעה!</h3>
              <p className="p">₪{nf(amt)} הופקדו · {destText}. מד ההתקדמות מתעדכן…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ConfirmScreen, Dashboard, StrongMonth, InstantDeposit });
