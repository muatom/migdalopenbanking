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
        <Icon name="refresh" />
        <div><b>הפקדה קבועה, בכל חודש.</b><p>הרצפה מתבצעת בכל מקרה — סכום חודשי קבוע שאתה קובע, ללא תלות במצב החשבון. ההגנות לפי יתרת העו״ש חלות על הפקדות ההזדמנות הגדולות יותר, שתגדיר בהמשך.</p></div>
      </div>
    </div>
  );
}

/* ---------- Sub 1: Opportunity rules ---------- */
const RULE_DEFS = [
  { id: "income", icon: "coins", t: "אחוז מכל הכנסה לחשבון", d: "אחוז מכל תנועה לזכות בחשבון — לא רק משכורת. נפקיד רק אם הסכום עובר את מינימום ההפקדה." },
  { id: "cashflow", icon: "percent", t: "אחוז מהתזרים החיובי", d: "בסוף החודש, אחרי הכנסות פחות הוצאות — אחוז ממה שבאמת נשאר.", monthly: true },
  { id: "ceiling", icon: "scale", t: "תקרת הוצאה חודשית", d: "מתחייבים לתקרת הוצאה. הוצאת פחות מהתקרה? ההפרש עובר לחיסכון.", monthly: true },
];
function WizRules({ wz, upd }) {
  const sel = wz.rules;
  function toggle(id) {
    const cur = sel[id];
    const on = !cur.on;
    const next = { ...sel, [id]: { ...cur, on } };
    if (on && (id === "cashflow" || id === "ceiling")) {
      const other = id === "cashflow" ? "ceiling" : "cashflow"; // monthly rules are mutually exclusive
      next[other] = { ...sel[other], on: false };
    }
    upd({ rules: next });
  }
  const setP = (id, key, v) => upd({ rules: { ...sel, [id]: { ...sel[id], [key]: v } } });
  const money = (id, key, label, sub) => (
    <div className="rule-field">
      <span className="ar-txt"><b>{label}</b>{sub && <p>{sub}</p>}</span>
      <div className="guard-field"><span className="cur">₪</span><input type="text" value={nf(sel[id][key])}
        onChange={(e) => setP(id, key, Number(e.target.value.replace(/[^\d]/g, "")) || 0)} /></div>
    </div>
  );
  const pct = (id, label) => (
    <div style={{ padding: "10px 20px 4px" }}>
      <div className="ar-txt" style={{ marginBottom: 6 }}><b>{label}: {sel[id].pct}%</b></div>
      <input className="slider" type="range" min="5" max="50" step="5" value={sel[id].pct}
        style={{ "--fill": ((sel[id].pct - 5) / 45 * 100) + "%" }}
        onChange={(e) => setP(id, "pct", Number(e.target.value))} />
    </div>
  );
  return (
    <div className="card-q">
      <div className="qh">ואיך נזהה הזדמנות / חודש חזק?</div>
      <div className="qs">״אחוז מכל הכנסה״ יכול לפעול לבד או יחד עם אחד מחוקי החודש. בין ״אחוז מהתזרים״ ל״תקרת הוצאה״ בוחרים <b>אחד מהשניים</b> — כדי לא ליצור שתי הפקדות חודשיות מקבילות. לכל חוק אפשר לקבוע תקרת מקסימום להפקדה.</div>
      <div className="rules">
        {RULE_DEFS.map((r) => {
          const on = sel[r.id].on;
          return (
            <React.Fragment key={r.id}>
              {r.id === "cashflow" && <div className="rule-or"><span>או — בחרו אחד מחוקי החודש</span></div>}
              {r.id === "ceiling" && <div className="rule-or sm"><span>או</span></div>}
              <div className={"rule" + (on ? " sel" : "")} onClick={() => toggle(r.id)}>
                <span className="rico"><Icon name={r.icon} /></span>
                <div className="rtxt">
                  <div className="rt">{r.t}</div>
                  <div className="rd">{r.d}</div>
                </div>
                <span className="rcheck"><Icon name="check" /></span>
              </div>
              {on && (
                <div className="rule-params">
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

/* ---------- Sub 2: Allocation + Approval + Guardrails ---------- */
function WizAllocation({ wz, upd }) {
  const a = wz.alloc;
  const total = a.gemel + a.policy;
  function setA(key, v) {
    const x = Math.max(0, Math.min(100, isNaN(v) ? 0 : v));
    upd({ alloc: key === "gemel" ? { gemel: x, policy: 100 - x } : { policy: x, gemel: 100 - x } });
  }
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
          <div className="an"><b>פוליסת חיסכון</b><small>8225841</small></div>
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
          <div><b>הגעת לתקרה? ממשיכים לחסוך.</b><p>קופת הגמל הגיעה לתקרה השנתית? החלק שלה יעבור אוטומטית לפוליסת החיסכון — בלי לעצור ובלי שתצטרך לעשות דבר.</p></div>
        </div>
      </div>

      {/* Approval mode per layer */}
      <div className="card-q">
        <div className="qh">איך לאשר כל הפקדה?</div>
        <div className="qs">בוחרים לכל שכבה בנפרד. הרצפה לרוב באוטופיילוט; ההזדמנות לרוב באישור — כדי שתישאר בשליטה ברגעים הגדולים.</div>
        <div className="approve-row">
          <div className="ar-txt"><b>הרצפה (₪{nf(wz.floor)} בחודש)</b><p>הפקדה קבועה שמתבצעת בכל חודש, ללא תלות במצב החשבון.</p></div>
          <div className="seg green">
            <button className={ap.floor === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "auto" } })}>אוטופיילוט</button>
            <button className={ap.floor === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, floor: "r2p" } })}>באישור</button>
          </div>
        </div>
        <div className="approve-row">
          <div className="ar-txt"><b>ההזדמנות (חודש חזק)</b><p>בקשת הפקדה שתאשר באפליקציית הבנק שלך.</p></div>
          <div className="seg">
            <button className={ap.opp === "auto" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "auto" } })}>אוטופיילוט</button>
            <button className={ap.opp === "r2p" ? "on" : ""} onClick={() => upd({ approval: { ...ap, opp: "r2p" } })}>באישור</button>
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="card-q">
        <div className="qh">מנגנוני הגנה — הביטחון שלך</div>
        <div className="qs">מומלץ להשאיר דלוקים. אלה הגבולות ששומרים על ״בלי לפגוע ברמת החיים״ — והם חלים על הפקדות ההזדמנות.</div>
        <div className="guard-row">
          <div className="ar-txt"><b>רצפת יתרה בעו״ש</b><p>מתחת לסכום הזה — לא נבצע הפקדות הזדמנות נוספות החודש. הרצפה תמיד מתבצעת.</p></div>
          <div className="guard-field"><span className="cur">₪</span><input type="text" value={nf(g.balanceFloor)}
            onChange={(e) => upd({ guard: { ...g, balanceFloor: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } })} /></div>
        </div>
        <div className="guard-row">
          <div className="ar-txt"><b>תקרה חודשית כוללת</b><p>סך מקסימלי שיופקד דרך השירות בחודש.</p></div>
          <div className="guard-field"><span className="cur">₪</span><input type="text" value={nf(g.monthlyCap)}
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
function WizGoal({ wz, upd, bank, go }) {
  const activeRules = RULE_DEFS.filter((r) => wz.rules[r.id].on);
  const edit = (n) => <span className="rev-edit" title="ערוך" onClick={() => go(n)}><Icon name="pencil" /></span>;
  return (
    <div>
      <div className="card-q">
        <div className="qh">יעד חיסכון (אופציונלי)</div>
        <div className="qs">הגדר יעד לקופת הגמל להשקעה, ונראה לך את ההתקדמות אליו — העודף הופך להתקדמות מוחשית.</div>
        {wz.goal != null ? (
          <React.Fragment>
            <div className="goal-amount"><div className="gv"><small>₪</small>{nf(wz.goal)}</div></div>
            <input className="slider" type="range" min="20000" max="300000" step="10000" value={wz.goal}
              style={{ "--fill": ((wz.goal - 20000) / 280000 * 100) + "%", marginTop: 18 }}
              onChange={(e) => upd({ goal: Number(e.target.value) })} />
            <div className="slider-ends"><span>₪20,000</span><span>₪300,000</span></div>
            <div className="center" style={{ marginTop: 14 }}>
              <span className="muted-link" style={{ fontSize: 14 }} onClick={() => upd({ goal: null })}>דלג — בלי יעד בינתיים</span>
            </div>
          </React.Fragment>
        ) : (
          <div className="center" style={{ padding: "10px 0 4px" }}>
            <p style={{ color: "var(--mig-slate-600)", fontSize: 15, margin: "0 0 14px" }}>בחרת להמשיך בלי יעד. אפשר להוסיף יעד בכל רגע מאזור החיסכון.</p>
            <button className="btn btn-ghost" onClick={() => upd({ goal: 100000 })}>בעצם, קבע לי יעד</button>
          </div>
        )}
      </div>

      <div className="card-q">
        <div className="qh">סיכום לפני הפעלה</div>
        <div className="review">
          <div className="rev-row"><span className="rl"><Icon name="banknote" /> רצפה חודשית</span><span className="rv">₪{nf(wz.floor)} <span className="sm">{wz.approval.floor === "auto" ? "אוטופיילוט" : "באישור"}</span></span>{edit(3)}</div>
          <div className="rev-row"><span className="rl"><Icon name="sparkles" /> חוקי הזדמנות</span><span className="rv">{activeRules.length ? activeRules.map((r) => r.t).join(" · ") : "ללא חוקים — אפשר להוסיף בהמשך"} <span className="sm">{wz.approval.opp === "auto" ? "אוטופיילוט" : "באישור באפליקציית הבנק"}</span></span>{edit(4)}</div>
          <div className="rev-row"><span className="rl"><Icon name="route" /> הקצאה</span><span className="rv">{wz.alloc.gemel}% גמל · {wz.alloc.policy}% פוליסה</span>{edit(5)}</div>
          <div className="rev-row"><span className="rl"><Icon name="shield-check" /> מנגנוני הגנה</span><span className="rv">{wz.guard.on ? "פעילים" : "כבויים"} <span className="sm">רצפת יתרה ₪{nf(wz.guard.balanceFloor)} · תקרה ₪{nf(wz.guard.monthlyCap)}</span></span>{edit(5)}</div>
          <div className="rev-row"><span className="rl"><Icon name="target" /> יעד</span><span className="rv">{wz.goal != null ? "₪" + nf(wz.goal) : "ללא יעד"}</span></div>
          <div className="rev-row"><span className="rl"><Icon name="link2" /> חשבון מחובר</span><span className="rv">{bank ? bank.n : "—"}</span>{edit(2)}</div>
        </div>
      </div>
    </div>
  );
}

function WizardScreen({ step, go, wz, upd, bank }) {
  const sub = step - 3; // 0..3
  const allocOk = wz.alloc.gemel + wz.alloc.policy === 100;
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם", "הגדרה"]} title="חיסכון חכם" />
      <Steps sub={sub} />
      <div className="flow" style={{ paddingTop: 24 }}>
        {sub === 0 && <WizFloor wz={wz} upd={upd} />}
        {sub === 1 && <WizRules wz={wz} upd={upd} />}
        {sub === 2 && <WizAllocation wz={wz} upd={upd} />}
        {sub === 3 && <WizGoal wz={wz} upd={upd} bank={bank} go={go} />}
      </div>
      <div className="wiz-foot" style={{ paddingBottom: 80 }}>
        <span className="back" onClick={() => go(step - 1)}><Icon name="chevron-right" /> חזרה</span>
        {sub < 3
          ? <button className="btn btn-green" disabled={sub === 2 && !allocOk} onClick={() => go(step + 1)}>המשך <Icon name="arrow-left" /></button>
          : <button className="btn btn-green btn-lg" disabled={!allocOk} onClick={() => go(7)}>הפעל את חיסכון חכם <Icon name="check" /></button>}
      </div>
    </div>
  );
}

Object.assign(window, { WizardScreen });
