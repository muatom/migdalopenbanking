/* Migdal חיסכון חכם — screens B: setup wizard (Floor, Opportunity, Allocation+Approval+Guardrails, Goal+Review) */
const { useState: useStateB } = React;

const WIZ_LABELS = ["רצפה", "הזדמנות", "הקצאה ואישור", "יעד וסיכום"];

function Steps({ sub }) {
  return (
    <div className="wiz-head">
      <div className="steps">
        {WIZ_LABELS.map((l, i) => (
          <div className={"st " + (i < sub ? "done" : i === sub ? "cur" : "")} key={l}>
            <span className="dot">{i < sub ? <Icon name="check" style={{ width: 16, height: 16 }} /> : i + 1}</span>
            {i < WIZ_LABELS.length - 1 && <span className="ln"></span>}
          </div>
        ))}
      </div>
      <div className="step-labels">
        {WIZ_LABELS.map((l, i) => <span key={l} className={i === sub ? "cur" : ""}>{l}</span>)}
      </div>
    </div>
  );
}

function AmountStepper({ value, set, step = 50, min = 0, max = 5000, prefix = "₪" }) {
  return (
    <div>
      <div className="amount">
        <button onClick={() => set(Math.min(max, value + step))}><Icon name="plus" style={{ width: 22, height: 22 }} /></button>
        <div className="val"><small>{prefix}</small>{nf(value)}</div>
        <button onClick={() => set(Math.max(min, value - step))}><Icon name="minus" style={{ width: 22, height: 22 }} /></button>
      </div>
      <input className="slider" type="range" min={min} max={max} step={step} value={value}
        style={{ "--fill": ((value - min) / (max - min) * 100) + "%" }}
        onChange={(e) => set(Number(e.target.value))} />
      <div className="slider-ends"><span>{prefix}{nf(min)}</span><span>{prefix}{nf(max)}</span></div>
    </div>
  );
}

/* ---------- Sub 0: Floor ---------- */
function WizFloor({ wz, upd }) {
  return (
    <div className="card-q">
      <div className="qh">כמה להפקיד כל חודש, בכל מקרה?</div>
      <div className="qs">זו ה<b>רצפה</b> שלך — סכום מינימלי שמופקד אוטומטית בכל חודש, בדומה להוראת קבע. רץ באוטופיילוט, בשקט, בלי שתצטרך לאשר כל פעם.</div>
      <div className="center" style={{ marginBottom: 16 }}>
        <span className="suggested"><Icon name="sparkles" /> ערך מוצע: ₪500</span>
      </div>
      <AmountStepper value={wz.floor} set={(v) => upd({ floor: v })} step={50} min={0} max={3000} />
      <div className="spillover-note" style={{ marginTop: 24 }}>
        <Icon name="shield-check" />
        <div><b>תמיד מוגן.</b><p>אם יתרת העו״ש תרד מתחת לרצפת היתרה שתגדיר בהמשך — נדלג על החודש. לעולם לא ניגע בכסף שאתה צריך.</p></div>
      </div>
    </div>
  );
}

/* ---------- Sub 1: Opportunity rules ---------- */
const RULE_DEFS = [
  { id: "cashflow", icon: "percent", hero: true, t: "% מהתזרים החיובי", d: "בסוף החודש, אחרי הכנסות פחות הוצאות — מפקידים אחוז ממה שבאמת נשאר. הכי נאמן ל״בלי להרגיש״." },
  { id: "ceiling", icon: "scale", hero: true, t: "תקרת הוצאות חודשית", d: "מתחייבים לתקרת הוצאה בקטגוריה. הוצאת פחות מהתקרה? ההפרש עובר לחיסכון." },
  { id: "fixed", icon: "calendar", hero: false, t: "סכום קבוע", d: "סכום נוסף בתאריך קבוע בחודש, מעבר לרצפה." },
  { id: "salary", icon: "zap", hero: false, t: "טריגר משכורת", d: "ברגע שהמשכורת נכנסת — סוויפ של אחוז או סכום מיד." },
];
function WizRules({ wz, upd }) {
  const sel = wz.rules;
  const count = Object.values(sel).filter((r) => r.on).length;
  function toggle(id) {
    const cur = sel[id];
    if (!cur.on && count >= 3) return; // max 3
    upd({ rules: { ...sel, [id]: { ...cur, on: !cur.on } } });
  }
  function setParam(id, key, v) { upd({ rules: { ...sel, [id]: { ...sel[id], [key]: v } } }); }
  return (
    <div className="card-q">
      <div className="qh">ואיך נזהה חודש חזק במיוחד?</div>
      <div className="qs">בחר עד 3 חוקים (מסוגים שונים) שיזהו הזדמנות להפקיד עוד. בחודש חזק נשלח אליך בקשת אישור — אתה תמיד מחליט.</div>
      <div className="rules">
        {RULE_DEFS.map((r) => {
          const on = sel[r.id].on;
          return (
            <div key={r.id}>
              <div className={"rule" + (on ? " sel" : "")} onClick={() => toggle(r.id)}>
                <span className="rico"><Icon name={r.icon} /></span>
                <div className="rtxt">
                  <div className="rt">{r.t}{r.hero && <span className="hero-badge">מומלץ</span>}</div>
                  <div className="rd">{r.d}</div>
                </div>
                <span className="rcheck"><Icon name="check" /></span>
              </div>
              {on && r.id === "cashflow" && (
                <div style={{ padding: "12px 20px 4px" }}>
                  <div className="ar-txt" style={{ marginBottom: 6 }}><b>אחוז מהתזרים: {sel.cashflow.pct}%</b></div>
                  <input className="slider" type="range" min="5" max="50" step="5" value={sel.cashflow.pct}
                    style={{ "--fill": ((sel.cashflow.pct - 5) / 45 * 100) + "%" }}
                    onChange={(e) => setParam("cashflow", "pct", Number(e.target.value))} />
                </div>
              )}
              {on && r.id === "ceiling" && (
                <div style={{ padding: "12px 20px 4px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="ar-txt"><b>תקרת הוצאה חודשית</b></span>
                  <div className="guard-field"><input type="text" value={"₪" + nf(sel.ceiling.cap)}
                    onChange={(e) => setParam("ceiling", "cap", Number(e.target.value.replace(/[^\d]/g, "")) || 0)} /></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="alloc-total" style={{ marginTop: 18 }}>
        <span>{count} מתוך 3 חוקים נבחרו</span>
        <span className="ok"><Icon name="info" style={{ width: 16, height: 16 }} /> אסור שני חוקים מאותו סוג</span>
      </div>
    </div>
  );
}

/* ---------- Sub 2: Allocation + Approval + Guardrails ---------- */
function WizAllocation({ wz, upd }) {
  const a = wz.alloc;
  const total = a.gemel + a.policy;
  function setA(key, v) { upd({ alloc: { ...a, [key]: Math.max(0, Math.min(100, v)) } }); }
  const ap = wz.approval, g = wz.guard;
  return (
    <div>
      {/* Allocation */}
      <div className="card-q">
        <div className="qh">לאן הכסף הולך?</div>
        <div className="qs">חלק את ההפקדה בין מוצרי החיסכון שלך. אם אחד הגיע לתקרה השנתית — נסיט אוטומטית את חלקו, בלי שתצטרך לחשוב על זה.</div>
        <div className="alloc-row">
          <span className="ai"><Icon name="trending-up" /></span>
          <div className="an"><b>קופת גמל להשקעה</b><small>45067618</small></div>
          <div className="alloc-pct">
            <input type="number" value={a.gemel} onChange={(e) => setA("gemel", Number(e.target.value))} />
            <span className="pc">%</span>
          </div>
        </div>
        <div className="alloc-row">
          <span className="ai"><Icon name="shield" /></span>
          <div className="an"><b>פוליסת חיסכון</b><small>POL-22841</small></div>
          <div className="alloc-pct">
            <input type="number" value={a.policy} onChange={(e) => setA("policy", Number(e.target.value))} />
            <span className="pc">%</span>
          </div>
        </div>
        <div className="alloc-total">
          <span>סך הקצאה</span>
          {total === 100
            ? <span className="ok"><Icon name="check" style={{ width: 18, height: 18 }} /> {total}%</span>
            : <span className="bad">{total}% — צריך להגיע ל-100%</span>}
        </div>
        <div className="spillover-note">
          <Icon name="route" />
          <div><b>Cap-aware Spillover.</b><p>קופת הגמל הגיעה לתקרה השנתית? החלק שלה יעבור אוטומטית לפוליסת החיסכון — המשך לחסוך בלי לעצור.</p></div>
        </div>
      </div>

      {/* Approval mode per layer */}
      <div className="card-q">
        <div className="qh">איך לאשר כל הפקדה?</div>
        <div className="qs">בוחרים לכל שכבה בנפרד. הרצפה לרוב באוטופיילוט; ההזדמנות לרוב באישור — כדי שתישאר בשליטה ברגעים הגדולים.</div>
        <div className="approve-row">
          <div className="ar-txt"><b>הרצפה (₪{nf(wz.floor)} בחודש)</b><p>הפקדה קבועה, מתבצעת לבד בתוך הגארדריילים.</p></div>
          <div className="seg green">
            <button className={ap.floor === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "auto" } })}>אוטופיילוט</button>
            <button className={ap.floor === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "r2p" } })}>באישור</button>
          </div>
        </div>
        <div className="approve-row">
          <div className="ar-txt"><b>ההזדמנות (חודש חזק)</b><p>בקשת אישור (R2P) שתאשר באפליקציית הבנק שלך.</p></div>
          <div className="seg">
            <button className={ap.opp === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "auto" } })}>אוטופיילוט</button>
            <button className={ap.opp === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "r2p" } })}>באישור</button>
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="card-q">
        <div className="qh">גארדריילים — הביטחון שלך</div>
        <div className="qs">מומלץ להשאיר דלוקים. אלה הגבולות ששומרים על ״בלי לפגוע ברמת החיים״.</div>
        <div className="guard-row">
          <div className="ar-txt"><b>רצפת יתרה בעו״ש</b><p>מתחת לסכום הזה — לא ניגע בכלום החודש.</p></div>
          <div className="guard-field"><input type="text" value={"₪" + nf(g.balanceFloor)}
            onChange={(e) => upd({ guard: { ...g, balanceFloor: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } })} /></div>
        </div>
        <div className="guard-row">
          <div className="ar-txt"><b>תקרה חודשית כוללת</b><p>סך מקסימלי שיופקד דרך הפיצ׳ר בחודש.</p></div>
          <div className="guard-field"><input type="text" value={"₪" + nf(g.monthlyCap)}
            onChange={(e) => upd({ guard: { ...g, monthlyCap: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } })} /></div>
        </div>
        <div className="guard-row">
          <div className="ar-txt"><b>הגנות פעילות</b><p>שתי ההגנות למעלה דלוקות.</p></div>
          <div className={"switch" + (g.on ? " on" : "")} onClick={() => upd({ guard: { ...g, on: !g.on } })}></div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub 3: Goal + Review ---------- */
function WizGoal({ wz, upd, bank }) {
  const activeRules = RULE_DEFS.filter((r) => wz.rules[r.id].on);
  return (
    <div>
      <div className="card-q">
        <div className="qh">יעד חיסכון (אופציונלי)</div>
        <div className="qs">הגדר יעד לקופת הגמל להשקעה, ונראה לך את ההתקדמות אליו — העודף הופך להתקדמות מוחשית.</div>
        <div className="goal-amount"><div className="gv"><small>₪</small>{nf(wz.goal)}</div></div>
        <input className="slider" type="range" min="20000" max="300000" step="10000" value={wz.goal}
          style={{ "--fill": ((wz.goal - 20000) / 280000 * 100) + "%", marginTop: 18 }}
          onChange={(e) => upd({ goal: Number(e.target.value) })} />
        <div className="slider-ends"><span>₪20,000</span><span>₪300,000</span></div>
      </div>

      <div className="card-q">
        <div className="qh">סיכום לפני הפעלה</div>
        <div className="review">
          <div className="rev-row"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{nf(wz.floor)} <span className="sm">{wz.approval.floor === "auto" ? "אוטופיילוט" : "באישור"}</span></span></div>
          <div className="rev-row"><span className="rl"><Icon name="sparkles" /> חוקי הזדמנות</span><span className="rv">{activeRules.length ? activeRules.map((r) => r.t).join(" · ") : "—"} <span className="sm">{wz.approval.opp === "auto" ? "אוטופיילוט" : "באישור (R2P)"}</span></span></div>
          <div className="rev-row"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span></div>
          <div className="rev-row"><span className="rl"><Icon name="shield-check" /> גארדריילים</span><span className="rv">{wz.guard.on ? "פעילים" : "כבויים"} <span className="sm">רצפת יתרה ₪{nf(wz.guard.balanceFloor)} · תקרה ₪{nf(wz.guard.monthlyCap)}</span></span></div>
          <div className="rev-row"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">₪{nf(wz.goal)}</span></div>
          <div className="rev-row"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span></div>
        </div>
      </div>
    </div>
  );
}

function WizardScreen({ step, go, wz, upd, bank }) {
  const sub = step - 3; // 0..3
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם", "הגדרה"]} title="חיסכון חכם" />
      <Steps sub={sub} />
      <div className="flow" style={{ paddingTop: 24 }}>
        {sub === 0 && <WizFloor wz={wz} upd={upd} />}
        {sub === 1 && <WizRules wz={wz} upd={upd} />}
        {sub === 2 && <WizAllocation wz={wz} upd={upd} />}
        {sub === 3 && <WizGoal wz={wz} upd={upd} bank={bank} />}
      </div>
      <div className="wiz-foot" style={{ paddingBottom: 80 }}>
        <span className="back" onClick={() => go(step - 1)}><Icon name="chevron-right" /> חזרה</span>
        {sub < 3
          ? <button className="btn btn-green" onClick={() => go(step + 1)}>המשך <Icon name="arrow-left" /></button>
          : <button className="btn btn-green btn-lg" onClick={() => go(7)}>הפעל את חיסכון חכם <Icon name="check" /></button>}
      </div>
    </div>
  );
}

Object.assign(window, { WizardScreen });
