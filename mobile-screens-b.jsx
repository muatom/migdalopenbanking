/* Migdal חיסכון חכם — MOBILE screens B: Connect bank (Open Finance sheet) + Setup wizard */
const { useState: useStateMB } = React;

const MBANKS = [
  { n: "בנק ראשון", c: "#6a1b9a", m: "ר" },
  { n: "בנק מרכז", c: "#1565c0", m: "מ" },
  { n: "בנק גשר", c: "#2e7d32", m: "ג" },
  { n: "בנק ים", c: "#00838f", m: "י" },
  { n: "בנק שדרה", c: "#c62828", m: "ש" },
  { n: "בנק גליל", c: "#ef6c00", m: "ג" },
];

/* ============================================================
   SCREEN 2 — CONNECT BANK
   ============================================================ */
function MConnect({ go, setBank }) {
  const [phase, setPhase] = useStateMB("choose");
  const [sel, setSel] = useStateMB(null);
  function choose(b) {
    setSel(b); setBank(b); setPhase("redirect");
    setTimeout(() => setPhase("done"), 2100);
  }
  return (
    <div className="m-scroll">
      <div className="m-band">
        <div className="crumbs"><span>חיסכון חכם</span><span className="sep">›</span><span className="cur">חיבור בנק</span></div>
      </div>
      <div className="m-of-intro">
        <span className="m-eyebrow"><Icon name="link2" /> שלב 1 מתוך 2 · חיבור מאובטח</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--mig-ink)", margin: "6px 0 8px", lineHeight: 1.15 }}>מחברים את חשבון העו״ש</h1>
        <p style={{ fontSize: 15, color: "var(--mig-slate-600)", lineHeight: 1.5, margin: 0 }}>החיבור מתבצע דרך ספק הבנקאות הפתוחה (Open Finance) — תקן מאובטח ומפוקח. מגדל לא רואה ולא שומרת את נתוני הבנק שלך.</p>
      </div>

      <div className="m-sheet">
        <div className="sh-grip"></div>
        <div className="sh-head">
          <div className="sh-brand"><Icon name="link2" /> Open Finance</div>
          <span className="sh-secure"><Icon name="lock" /> חיבור מוצפן</span>
        </div>
        <div className="sh-body">
          {phase === "choose" && (
            <React.Fragment>
              <h3>בחרו את הבנק שלכם</h3>
              <p className="p">תועברו לאפליקציית הבנק לאישור ההסכמה, ותחזרו לכאן אוטומטית.</p>
              <div className="m-banks">
                {MBANKS.map((b) => (
                  <div className={"m-bank" + (sel === b ? " sel" : "")} key={b.n} onClick={() => choose(b)}>
                    <div className="bk-logo" style={{ background: b.c }}>{b.m}</div>
                    <div className="bk-n">{b.n}</div>
                  </div>
                ))}
              </div>
              <div className="sh-foot"><Icon name="shield" /> מאושר ומפוקח לפי תקן הבנקאות הפתוחה בישראל</div>
            </React.Fragment>
          )}
          {phase === "redirect" && (
            <div className="m-redirect">
              <div className="m-spinner"></div>
              <h3>מעבירים אותך ל{sel?.n}…</h3>
              <p className="p">אשרו את ההסכמה באפליקציית הבנק. נחזיר אותך אוטומטית למגדל.</p>
            </div>
          )}
          {phase === "done" && (
            <div className="m-redirect">
              <div className="m-bigcheck"><Icon name="check" /></div>
              <h3>החיבור הושלם</h3>
              <p className="p">ההסכמה ל{sel?.n} פעילה. אפשר לנתק בכל רגע מתוך מגדל שלי.</p>
              <button className="m-btn m-btn-green" style={{ marginTop: 18 }} onClick={() => go(3)}>ממשיכים להגדרה <Icon name="arrow-left" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WIZARD — shared bits
   ============================================================ */
const M_WIZ_LABELS = ["רצפה", "הזדמנות", "הקצאה", "יעד"];
function MSteps({ sub }) {
  return (
    <div className="m-steps">
      <div className="st-track">
        {M_WIZ_LABELS.map((l, i) => (
          <React.Fragment key={l}>
            <div className={"st-dot " + (i < sub ? "done" : i === sub ? "cur" : "")}>
              {i < sub ? <Icon name="check" /> : i + 1}
            </div>
            {i < M_WIZ_LABELS.length - 1 && <div className={"st-line" + (i < sub ? " done" : "")}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="st-labels">
        {M_WIZ_LABELS.map((l, i) => <span key={l} className={i === sub ? "cur" : ""}>{l}</span>)}
      </div>
    </div>
  );
}

function MAmount({ value, set, step = 50, min = 0, max = 3000, prefix = "₪" }) {
  return (
    <div>
      <div className="m-amount">
        <button onClick={() => set(Math.max(min, value - step))}><Icon name="minus" /></button>
        <div className="val"><small>{prefix}</small>{mnf(value)}</div>
        <button onClick={() => set(Math.min(max, value + step))}><Icon name="plus" /></button>
      </div>
      <input className="m-slider" type="range" min={min} max={max} step={step} value={value}
        style={{ "--fill": ((value - min) / (max - min) * 100) + "%" }}
        onChange={(e) => set(Number(e.target.value))} />
      <div className="m-slider-ends"><span>{prefix}{mnf(min)}</span><span>{prefix}{mnf(max)}</span></div>
    </div>
  );
}

/* ---- Sub 0: Floor ---- */
function MWizFloor({ wz, upd }) {
  return (
    <div className="m-q">
      <div className="qh">כמה להפקיד כל חודש, בכל מקרה?</div>
      <div className="qs">זו ה<b>רצפה</b> שלך — סכום מינימלי שמופקד אוטומטית בכל חודש, בדומה להוראת קבע. רץ באוטופיילוט, בלי שתצטרך לאשר כל פעם.</div>
      <div className="m-center" style={{ marginBottom: 4 }}>
        <span className="m-suggested"><Icon name="sparkles" /> ערך מוצע: ₪500</span>
      </div>
      <MAmount value={wz.floor} set={(v) => upd({ floor: v })} step={50} min={0} max={3000} />
      <div className="m-note green">
        <Icon name="refresh" />
        <div><b>הפקדה קבועה, בכל חודש.</b><p>הרצפה מתבצעת בכל מקרה — סכום חודשי קבוע שאתה קובע, ללא תלות במצב החשבון. ההגנות לפי יתרת העו״ש חלות על הפקדות ההזדמנות הגדולות יותר, שתגדיר בהמשך.</p></div>
      </div>
    </div>
  );
}

/* ---- Sub 1: Opportunity rules ---- */
const M_RULE_DEFS = [
  { id: "income", icon: "coins", t: "אחוז מכל הכנסה לחשבון", d: "אחוז מכל תנועה לזכות — לא רק משכורת. נפקיד רק אם הסכום עובר את מינימום ההפקדה." },
  { id: "cashflow", icon: "percent", t: "אחוז מהתזרים החיובי", d: "בסוף החודש, אחרי הכנסות פחות הוצאות — אחוז ממה שבאמת נשאר.", monthly: true },
  { id: "ceiling", icon: "scale", t: "תקרת הוצאה חודשית", d: "מתחייבים לתקרת הוצאה. הוצאת פחות מהתקרה? ההפרש עובר לחיסכון.", monthly: true },
];
function MWizRules({ wz, upd }) {
  const sel = wz.rules;
  function toggle(id) {
    const cur = sel[id];
    const on = !cur.on;
    const next = { ...sel, [id]: { ...cur, on } };
    if (on && (id === "cashflow" || id === "ceiling")) {
      const other = id === "cashflow" ? "ceiling" : "cashflow"; // monthly rules mutually exclusive
      next[other] = { ...sel[other], on: false };
    }
    upd({ rules: next });
  }
  const setP = (id, key, v) => upd({ rules: { ...sel, [id]: { ...sel[id], [key]: v } } });
  const money = (id, key, label, sub) => (
    <div className="m-capfield">
      <span className="pl">{label}{sub && <em>{sub}</em>}</span>
      <div className="fld"><input type="text" value={"₪" + mnf(sel[id][key])}
        onChange={(e) => setP(id, key, Number(e.target.value.replace(/[^\d]/g, "")) || 0)} /></div>
    </div>
  );
  const pct = (id, label) => (
    <div className="m-rule-param">
      <div className="pl">{label}: {sel[id].pct}%</div>
      <input className="m-slider" type="range" min="5" max="50" step="5" value={sel[id].pct}
        style={{ "--fill": ((sel[id].pct - 5) / 45 * 100) + "%" }}
        onChange={(e) => setP(id, "pct", Number(e.target.value))} />
    </div>
  );
  return (
    <div className="m-q">
      <div className="qh">ואיך נזהה הזדמנות / חודש חזק?</div>
      <div className="qs">״אחוז מכל הכנסה״ יכול לפעול לבד או יחד עם אחד מחוקי החודש. בין ״אחוז מהתזרים״ ל״תקרת הוצאה״ בוחרים <b>אחד מהשניים</b>, כדי לא ליצור שתי הפקדות חודשיות מקבילות. לכל חוק אפשר לקבוע תקרת מקסימום.</div>
      <div className="m-rules">
        {M_RULE_DEFS.map((r) => {
          const on = sel[r.id].on;
          return (
            <React.Fragment key={r.id}>
              {r.id === "cashflow" && <div className="m-rule-or"><span>או — אחד מחוקי החודש</span></div>}
              {r.id === "ceiling" && <div className="m-rule-or"><span>או</span></div>}
              <div className={"m-rule" + (on ? " sel" : "")} onClick={() => toggle(r.id)}>
                <span className="r-ic"><Icon name={r.icon} /></span>
                <div style={{ flex: 1 }}>
                  <div className="r-t">{r.t}</div>
                  <div className="r-d">{r.d}</div>
                </div>
                <span className="r-check"><Icon name="check" /></span>
              </div>
              {on && (
                <div className="m-rule-params">
                  {(r.id === "income" || r.id === "cashflow") && pct(r.id, r.id === "income" ? "אחוז מכל הכנסה" : "אחוז מהתזרים")}
                  {r.id === "income" && money("income", "min", "מינימום הפקדה", "נפקיד רק אם הסכום עובר את הרף.")}
                  {r.id === "ceiling" && money("ceiling", "cap", "תקרת הוצאה חודשית")}
                  {money(r.id, "max", "תקרת מקסימום להפקדה", "לא יופקד יותר מהסכום הזה דרך החוק.")}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Sub 2: Allocation + Approval + Guardrails ---- */
function MWizAllocation({ wz, upd }) {
  const a = wz.alloc; const total = a.gemel + a.policy;
  function setA(key, v) { upd({ alloc: { ...a, [key]: Math.max(0, Math.min(100, v)) } }); }
  const ap = wz.approval, g = wz.guard;
  return (
    <div>
      <div className="m-q">
        <div className="qh">לאן הכסף הולך?</div>
        <div className="qs">חלק את ההפקדה בין מוצרי החיסכון שלך. אם אחד הגיע לתקרה — נסיט אוטומטית את חלקו.</div>
        <div className="m-alloc">
          <span className="ai"><Icon name="trending-up" /></span>
          <div className="an"><b>קופת גמל להשקעה</b><small>45067618</small></div>
          <div className="ap"><input type="number" value={a.gemel} onChange={(e) => setA("gemel", Number(e.target.value))} /><span className="pc">%</span></div>
        </div>
        <div className="m-alloc">
          <span className="ai"><Icon name="shield" /></span>
          <div className="an"><b>פוליסת חיסכון</b><small>POL-22841</small></div>
          <div className="ap"><input type="number" value={a.policy} onChange={(e) => setA("policy", Number(e.target.value))} /><span className="pc">%</span></div>
        </div>
        <div className="m-alloc-total">
          <span>סך הקצאה</span>
          {total === 100
            ? <span className="ok"><Icon name="check" /> {total}%</span>
            : <span className="bad">{total}% — צריך 100%</span>}
        </div>
        <div className="m-note">
          <Icon name="route" />
          <div><b>Cap-aware Spillover.</b><p>קופת הגמל הגיעה לתקרה השנתית? החלק שלה יעבור אוטומטית לפוליסת החיסכון — בלי לעצור.</p></div>
        </div>
      </div>

      <div className="m-q">
        <div className="qh">איך לאשר כל הפקדה?</div>
        <div className="qs">בוחרים לכל שכבה בנפרד. הרצפה לרוב באוטופיילוט; ההזדמנות לרוב באישור.</div>
        <div className="m-approve">
          <div className="ar-t"><b>הרצפה (₪{mnf(wz.floor)} בחודש)</b><p>הפקדה קבועה שמתבצעת בכל חודש, ללא תלות במצב החשבון.</p></div>
          <div className="m-seg green">
            <button className={ap.floor === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "auto" } })}>אוטופיילוט</button>
            <button className={ap.floor === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "r2p" } })}>באישור</button>
          </div>
        </div>
        <div className="m-approve">
          <div className="ar-t"><b>ההזדמנות (חודש חזק)</b><p>בקשת אישור (R2P) שתאשר באפליקציית הבנק שלך.</p></div>
          <div className="m-seg">
            <button className={ap.opp === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "auto" } })}>אוטופיילוט</button>
            <button className={ap.opp === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "r2p" } })}>באישור</button>
          </div>
        </div>
      </div>

      <div className="m-q">
        <div className="qh">גארדריילים — הביטחון שלך</div>
        <div className="qs">מומלץ להשאיר דלוקים. אלה הגבולות ששומרים על ״בלי לפגוע ברמת החיים״.</div>
        <div className="m-guard">
          <div className="gr-t"><b>רצפת יתרה בעו״ש</b><p>מתחת לסכום הזה — לא נבצע הפקדות הזדמנות נוספות החודש. הרצפה תמיד מתבצעת.</p></div>
          <div className="gr-field"><input type="text" value={"₪" + mnf(g.balanceFloor)}
            onChange={(e) => upd({ guard: { ...g, balanceFloor: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } })} /></div>
        </div>
        <div className="m-guard">
          <div className="gr-t"><b>תקרה חודשית כוללת</b><p>סך מקסימלי שיופקד דרך הפיצ׳ר בחודש.</p></div>
          <div className="gr-field"><input type="text" value={"₪" + mnf(g.monthlyCap)}
            onChange={(e) => upd({ guard: { ...g, monthlyCap: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } })} /></div>
        </div>
        <div className="m-guard">
          <div className="gr-t"><b>הגנות פעילות</b><p>שתי ההגנות למעלה דלוקות.</p></div>
          <div className={"m-switch" + (g.on ? " on" : "")} onClick={() => upd({ guard: { ...g, on: !g.on } })}></div>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub 3: Goal + Review ---- */
function MWizGoal({ wz, upd, bank }) {
  const activeRules = M_RULE_DEFS.filter((r) => wz.rules[r.id].on);
  return (
    <div>
      <div className="m-q">
        <div className="qh">יעד חיסכון (אופציונלי)</div>
        <div className="qs">הגדר יעד לקופת הגמל להשקעה, ונראה לך את ההתקדמות אליו.</div>
        <div className="m-goal-amt"><div className="gv"><small>₪</small>{mnf(wz.goal)}</div></div>
        <input className="m-slider" type="range" min="20000" max="300000" step="10000" value={wz.goal}
          style={{ "--fill": ((wz.goal - 20000) / 280000 * 100) + "%", marginTop: 18 }}
          onChange={(e) => upd({ goal: Number(e.target.value) })} />
        <div className="m-slider-ends"><span>₪20,000</span><span>₪300,000</span></div>
      </div>

      <div className="m-q">
        <div className="qh">סיכום לפני הפעלה</div>
        <div className="m-review">
          <div className="m-rev"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{mnf(wz.floor)}<span className="sm">{wz.approval.floor === "auto" ? "אוטופיילוט" : "באישור"}</span></span></div>
          <div className="m-rev"><span className="rl"><Icon name="sparkles" /> חוקי הזדמנות</span><span className="rv">{activeRules.length ? activeRules.map((r) => r.t).join(" · ") : "—"}<span className="sm">{wz.approval.opp === "auto" ? "אוטופיילוט" : "באישור (R2P)"}</span></span></div>
          <div className="m-rev"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
          <div className="m-rev"><span className="rl"><Icon name="shield-check" /> גארדריילים</span><span className="rv">{wz.guard.on ? "פעילים" : "כבויים"}<span className="sm">יתרה ₪{mnf(wz.guard.balanceFloor)} · תקרה ₪{mnf(wz.guard.monthlyCap)}</span></span></div>
          <div className="m-rev"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">₪{mnf(wz.goal)}</span></div>
          <div className="m-rev"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
        </div>
      </div>
    </div>
  );
}

function MWizard({ step, go, wz, upd, bank }) {
  const sub = step - 3;
  return (
    <React.Fragment>
      <div className="m-scroll">
        <div className="m-band" style={{ paddingBottom: 10 }}>
          <div className="crumbs"><span>חיסכון חכם</span><span className="sep">›</span><span className="cur">הגדרה</span></div>
        </div>
        <MSteps sub={sub} />
        <div style={{ paddingTop: 16 }}>
          {sub === 0 && <MWizFloor wz={wz} upd={upd} />}
          {sub === 1 && <MWizRules wz={wz} upd={upd} />}
          {sub === 2 && <MWizAllocation wz={wz} upd={upd} />}
          {sub === 3 && <MWizGoal wz={wz} upd={upd} bank={bank} />}
        </div>
      </div>
      <div className="m-wizfoot">
        <button className="back" onClick={() => go(step - 1)}><Icon name="chevron-right" /> חזרה</button>
        {sub < 3
          ? <button className="m-btn m-btn-green" onClick={() => go(step + 1)}>המשך <Icon name="arrow-left" /></button>
          : <button className="m-btn m-btn-green" onClick={() => go(7)}>הפעל את חיסכון חכם <Icon name="check" /></button>}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { MConnect, MWizard, MBANKS, M_RULE_DEFS });
