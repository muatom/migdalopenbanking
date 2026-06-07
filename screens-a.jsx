/* Migdal חיסכון חכם — screens A: Home (discovery), Education (aha), Connect bank */
const { useState: useStateA, useEffect: useEffectA } = React;
const nf = (n) => Number(n).toLocaleString("en-US");

/* ============================================================
   SCREEN 0 — Portal home with discovery banner
   ============================================================ */
function HomeScreen({ go, activated, surplus, openDeposit }) {
  const tiles = [
    { t: "התביעות שלי", icon: "gavel" },
    { t: "הבקשות שלי", icon: "route" },
    { t: "ההודעות שלי", icon: "message" },
    { t: "הדוחות והאישורים שלי", icon: "file" },
  ];
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי"]} title="מגדל שלי" />
      <div className="page">
        {/* Discovery banner — prominent at launch */}
        <div className="promo">
          <div className="promo-txt">
            <span className="kick"><Icon name="sparkles" /> חדש באזור האישי</span>
            <h2>החודש נשאר לך עודף.<br/>בוא נדאג ש<em>יעבוד בשבילך</em>.</h2>
            <p>מגדל שמה לב במקומך: מזהה את העודף האמיתי שלך בכל חודש ומפקידה אותו אוטומטית לחיסכון שלך — בלי לפגוע ברמת החיים.</p>
            <div className="promo-cta">
              <button className="btn btn-green btn-lg" onClick={() => go(1)}>
                גלו את חיסכון חכם <Icon name="arrow-left" />
              </button>
              <span className="later" onClick={() => go(1)}>איך זה עובד?</span>
            </div>
          </div>
          <div className="promo-art">
            <div className="surplus-coin">
              <span className="s-lbl">העודף שלך החודש</span>
              <span className="s-num">₪{nf(surplus)}</span>
              <span className="s-sub">ישב בעו״ש בלי לעבוד</span>
            </div>
          </div>
        </div>
        <p className="discover-note">בהשקה מוצג כבאנר בולט. לאחר מכן: פריט עדין בתפריט + טריגר נקודתי כשמזוהה הזדמנות.</p>

        <div className="hello">
          <h2>היי תום!</h2>
          <p>ביקורך האחרון 31/05/2026</p>
        </div>

        <div className="tiles">
          {tiles.map((t) => (
            <div className="lip" key={t.t}>
              <div className="tile">
                <span className="chev"><Icon name="chevron-left" /></span>
                <span className="lbl"><b>{t.t}</b></span>
                <span className="ic"><Icon name={t.icon} /></span>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"><span>חסכון אישי</span></div>
        <div className="prods">
          <div className="pcard">
            <h3>גמל להשקעה</h3>
            <div className="bal">יתרת כספים עדכנית: <b>₪{nf(159455)}</b></div>
            {activated && <div className="suggested" style={{marginTop:14}}><Icon name="check" /> חיסכון חכם פעיל</div>}
            <div className="pcard-cta">
              <button className="cta-fill" onClick={() => activated ? go(8) : go(1)}>לפרטי החשבון</button>
              <button className="card-dep" onClick={() => openDeposit && openDeposit({ dest: "גמל" })}><Icon name="zap" /> הפקד עכשיו</button>
            </div>
          </div>
          <div className="pcard">
            <h3>פוליסת חיסכון</h3>
            <div className="bal">יתרת כספים עדכנית: <b>₪{nf(88120)}</b></div>
            {activated && <div className="suggested" style={{marginTop:14}}><Icon name="check" /> חיסכון חכם פעיל</div>}
            <div className="pcard-cta">
              <button className="cta-out" onClick={() => activated ? go(8) : go(1)}>לפרטי החשבון</button>
              <button className="card-dep" onClick={() => openDeposit && openDeposit({ dest: "פוליסה" })}><Icon name="zap" /> הפקד עכשיו</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 1 — Education / value (the aha)
   ============================================================ */
function GrowthChart() {
  const [grown, setGrown] = useStateA(false);
  useEffectA(() => { const t = setTimeout(() => setGrown(true), 250); return () => clearTimeout(t); }, []);
  // illustrative units: principal (cumulative deposits) + tax benefit; scenario band on top (illustration only)
  const years = [
    { y: "שנה 1", principal: 24, tax: 5, scn: 4, top: "₪9,500" },
    { y: "שנה 5", principal: 50, tax: 11, scn: 12, top: "₪58,000" },
    { y: "שנה 10", principal: 70, tax: 15, scn: 29, top: "₪138,000" },
  ];
  const maxTotal = Math.max(...years.map((b) => b.principal + b.tax + b.scn));
  const MAXH = 94; // % of chart area for tallest bar
  return (
    <div className="chart">
      <div className="bars">
        {years.map((b) => {
          const total = b.principal + b.tax + b.scn;
          const barH = (total / maxTotal) * MAXH;
          const pct = (v) => (v / total * 100) + "%";
          return (
            <div className="bar-col" key={b.y}>
              <div className="bar" style={{ height: grown ? barH + "%" : "0%" }}>
                <span className="bar-top">{b.top}</span>
                <div className="seg-scn" style={{ height: pct(b.scn) }}></div>
                <div className="seg-tax" style={{ height: pct(b.tax) }}></div>
                <div className="seg-principal" style={{ height: pct(b.principal) }}></div>
              </div>
              <span className="bar-yr">{b.y}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EducationScreen({ go }) {
  const trust = [
    { icon: "eye-off", t: "מגדל לא שומרת את נתוני הבנק", p: "הנתונים נשארים אצל ספק הבנקאות הפתוחה. אנחנו רואים רק את ההפקדות שביצענו." },
    { icon: "unlink", t: "אפשר לנתק בכל רגע", p: "השליטה תמיד אצלך. עצירה, עריכה וניתוק זמינים תמיד, בלחיצה אחת." },
    { icon: "shield-check", t: "רק עודף אמיתי", p: "לעולם לא נעביר כסף שאתה עלול להזדקק לו החודש. רצפת יתרה מגינה עליך." },
  ];
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם"]} title="חיסכון חכם" />
      <div className="flow">
        <span className="eyebrow"><Icon name="sparkles" /> חוסכים בלי להרגיש</span>
        <h1 className="t">החיסכון שהופך מהחלטה חוזרת<br/>ל<em>מצב ברירת מחדל</em></h1>
        <p className="lead">לקוחות רבים יכולים לחסוך יותר — אבל העודף יושב בעו״ש בלי שמים לב. חיסכון חכם הופך את הבלתי-נראה לנראה, ומעביר רק את מה שבאמת נשאר.</p>

        {/* Stage 1 — emotional hook */}
        <div className="aha-hook">
          <p className="small">החודש זיהינו שנשאר לך עודף של</p>
          <div className="big">₪<span>2,300</span></div>
          <p className="cap">שישב בעו״ש בלי לעבוד בשבילך. דמיין שזה קורה כל חודש.</p>
          <div className="underline-art"></div>
        </div>

        {/* Stage 2 — growth illustration */}
        <div className="growth">
          <h3>ולאן זה יכול לצמוח?</h3>
          <p className="sub">בהפקדה חודשית ממוצעת לקופת גמל להשקעה — הקרן שנצברת והטבת המס, להמחשה.</p>
          <GrowthChart />
          <div className="legend">
            <span><i style={{background:"var(--mig-blue)"}}></i> הקרן שתפקיד</span>
            <span><i style={{background:"var(--mig-green)"}}></i> הטבת מס</span>
            <span><i style={{background:"#d7def0"}}></i> טווח תשואה אפשרי (להמחשה)</span>
          </div>
          <p className="disclaimer">
            <b>חשוב:</b> בניגוד לפיקדון בריבית קבועה, התשואה במוצרי החיסכון אינה ידועה מראש. המספרים המוצגים הם הקרן הצפויה והטבת המס; טווח התשואה הוא להמחשה בלבד ואינו מהווה הבטחה, ייעוץ או המלצה. אין באמור משום ייעוץ פנסיוני.
          </p>
        </div>

        {/* Trust */}
        <div className="trust">
          {trust.map((t) => (
            <div className="t" key={t.t}>
              <span className="ico"><Icon name={t.icon} /></span>
              <b>{t.t}</b>
              <p>{t.p}</p>
            </div>
          ))}
        </div>

        <div className="stack-cta">
          <button className="btn btn-green btn-lg" onClick={() => go(2)}>
            מתחברים בצורה מאובטחת <Icon name="arrow-left" />
          </button>
          <span className="muted-link" onClick={() => go(0)}>אולי אחר כך</span>
        </div>
        <p className="disclaimer" style={{marginTop:18, background:"transparent", padding:0}}>
          השלב הבא: חיבור מאובטח דרך ספק הבנקאות הפתוחה. החיבור אינו מאפשר למגדל לבצע פעולות בחשבונך — רק לזהות את העודף.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 2 — Connect bank (Open Finance hosted)
   ============================================================ */
const BANKS = [
  { n: "בנק ראשון", c: "#6a1b9a", m: "ר" },
  { n: "בנק מרכז", c: "#1565c0", m: "מ" },
  { n: "בנק גשר", c: "#2e7d32", m: "ג" },
  { n: "בנק ים", c: "#00838f", m: "י" },
  { n: "בנק שדרה", c: "#c62828", m: "ש" },
  { n: "בנק גליל", c: "#ef6c00", m: "ג" },
];
function ConnectScreen({ go, setBank }) {
  const [phase, setPhase] = useStateA("choose"); // choose | redirect | done
  const [sel, setSel] = useStateA(null);

  function choose(b) {
    setSel(b);
    setBank(b);
    setPhase("redirect");
    setTimeout(() => setPhase("done"), 2200);
  }
  return (
    <div>
      <Band crumbs={["דף הבית", "מגדל שלי", "חיסכון חכם", "חיבור בנק"]} title="חיסכון חכם" />
      <div className="flow" style={{ minHeight: 360 }}>
        <span className="eyebrow"><Icon name="link2" /> שלב 1 מתוך 2 · חיבור מאובטח</span>
        <h1 className="t">מחברים את חשבון העו״ש</h1>
        <p className="lead">החיבור מתבצע דרך ספק הבנקאות הפתוחה (Open Finance) — תקן מאובטח ומפוקח. מגדל לא רואה ולא שומרת את נתוני הבנק שלך.</p>
      </div>

      {/* OF hosted modal */}
      <div className="of-scrim">
        <div className="of-modal">
          <div className="of-head">
            <div className="of-brand">
              <Icon name="link2" style={{ width: 20, height: 20, color: "var(--mig-green)" }} />
              Open Finance
            </div>
            <div className="of-brand"><span className="secure"><Icon name="lock" /> חיבור מוצפן</span></div>
          </div>

          {phase === "choose" && (
            <div className="of-body">
              <h3>בחרו את הבנק שלכם</h3>
              <p className="p">תועברו לאפליקציית הבנק לאישור ההסכמה, ותחזרו לכאן אוטומטית.</p>
              <div className="bank-grid">
                {BANKS.map((b) => (
                  <div className={"bank-opt" + (sel === b ? " sel" : "")} key={b.n} onClick={() => choose(b)}>
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
                <h3>מעבירים אותך ל{sel?.n}…</h3>
                <p className="p">אשרו את ההסכמה באפליקציית הבנק. נחזיר אותך אוטומטית למגדל.</p>
              </div>
            </div>
          )}

          {phase === "done" && (
            <div className="of-body">
              <div className="of-redirect">
                <div className="confirm" style={{ padding: 0, margin: 0 }}>
                  <div className="check" style={{ width: 84, height: 84, marginBottom: 18 }}><Icon name="check" style={{ width: 42, height: 42 }} /></div>
                </div>
                <h3>החיבור הושלם</h3>
                <p className="p">ההסכמה ל{sel?.n} פעילה. אפשר לנתק בכל רגע מתוך מגדל שלי.</p>
                <button className="btn btn-green btn-block btn-lg" onClick={() => go(3)} style={{ marginTop: 8 }}>
                  ממשיכים להגדרה <Icon name="arrow-left" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, EducationScreen, ConnectScreen, nf, BANKS });
