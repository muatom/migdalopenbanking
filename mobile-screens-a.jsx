/* Migdal חיסכון חכם — MOBILE screens A: Home (discovery) + Education (aha) */
const { useState: useStateMA, useEffect: useEffectMA } = React;

/* ============================================================
   SCREEN 0 — HOME (discovery)
   ============================================================ */
function MHome({ go, activated, openDeposit }) {
  return (
    <div className="m-scroll">
      {/* greeting */}
      <div className="m-greet" style={{ padding: "12px 22px 8px" }}>
        <span style={{ fontSize: 15, color: "var(--mig-slate-600)", fontWeight: 600 }}>ערב טוב, תום</span>
      </div>

      {/* navy balance hero — real-app feel */}
      <div className="m-hero">
        <div className="hero-coins">
          <svg viewBox="0 0 120 100" fill="none" stroke="#fff" strokeWidth="2">
            <ellipse cx="42" cy="74" rx="34" ry="11"/><path d="M8 74v10c0 6 15 11 34 11s34-5 34-11V74"/>
            <ellipse cx="80" cy="50" rx="28" ry="9"/><path d="M52 50v9c0 5 12 9 28 9s28-4 28-9v-9"/>
          </svg>
        </div>
        <div className="h-prod">
          <span className="nav-a"><Icon name="chevron-right" /></span>
          גמל להשקעה
          <span className="nav-a"><Icon name="chevron-left" /></span>
        </div>
        <div className="h-big"><small>₪</small>{mnf(159455)}</div>
        <div className="h-cap">יתרת הכספים בחשבון</div>
      </div>

      {/* discovery promo — bold at launch */}
      <div className="m-promo">
        <span className="pk"><Icon name="sparkles" /> חדש באזור האישי</span>
        <h2>החודש נשאר לך עודף.<br/>בוא נדאג ש<em>יעבוד בשבילך</em>.</h2>
        <p>מגדל שמה לב במקומך: מזהה את העודף האמיתי שלך בכל חודש ומפקידה אותו אוטומטית לחיסכון — בלי לפגוע ברמת החיים.</p>
        <div className="coinrow">
          <div className="coin">
            <span className="c-l">העודף שלך החודש</span>
            <span className="c-n">₪2,300</span>
            <span className="c-s">ישב בעו״ש בלי לעבוד</span>
          </div>
        </div>
        <button className="pbtn" onClick={() => go(1)}>גלו את חיסכון חכם <Icon name="arrow-left" /></button>
        <button className="plater" onClick={() => go(1)}>איך זה עובד?</button>
      </div>

      {/* personal savings products */}
      <div className="m-sec-label">החיסכון האישי שלי</div>
      <div style={{ background: "#fff", borderRadius: 20, margin: "0 16px 6px", overflow: "hidden", border: "1px solid var(--mig-line-soft)" }}>
        <div className="m-prodrow" onClick={() => activated ? go(8) : go(1)}>
          <div className="pr-r">
            <b>מגדל גמל להשקעה</b>
            <small>45067618</small>
            {activated && <div className="pr-active"><Icon name="check" /> חיסכון חכם פעיל</div>}
            <button className="m-rowdep" onClick={(e) => { e.stopPropagation(); openDeposit && openDeposit({ dest: "גמל" }); }}><Icon name="zap" /> הפקד עכשיו</button>
          </div>
          <div className="pr-l"><span className="chev"><Icon name="chevron-left" /></span><small>₪</small>{mnf(159455)}</div>
        </div>
        <div className="m-prodrow" onClick={() => activated ? go(8) : go(1)}>
          <div className="pr-r">
            <b>פוליסת חיסכון</b>
            <small>8225841</small>
            {activated && <div className="pr-active"><Icon name="check" /> חיסכון חכם פעיל</div>}
            <button className="m-rowdep" onClick={(e) => { e.stopPropagation(); openDeposit && openDeposit({ dest: "פוליסה" }); }}><Icon name="zap" /> הפקד עכשיו</button>
          </div>
          <div className="pr-l"><span className="chev"><Icon name="chevron-left" /></span><small>₪</small>88,120</div>
        </div>
      </div>
      <p className="m-discnote" style={{ textAlign: "right", margin: "8px 22px 12px" }}>המידע מעודכן ליום עסקים קודם.</p>
    </div>
  );
}

/* ============================================================
   SCREEN 1 — EDUCATION (aha)
   ============================================================ */
function MGrowthChart() {
  const [grown, setGrown] = useStateMA(false);
  useEffectMA(() => { const t = setTimeout(() => setGrown(true), 280); return () => clearTimeout(t); }, []);
  const years = [
    { y: "שנה 1", principal: 24, tax: 5, scn: 4, top: "₪9,500" },
    { y: "שנה 5", principal: 50, tax: 11, scn: 12, top: "₪58,000" },
    { y: "שנה 10", principal: 70, tax: 15, scn: 29, top: "₪138,000" },
  ];
  const maxTotal = Math.max(...years.map((b) => b.principal + b.tax + b.scn));
  const MAXH = 92;
  return (
    <div className="m-chart">
      <div className="m-bars">
        {years.map((b) => {
          const total = b.principal + b.tax + b.scn;
          const barH = (total / maxTotal) * MAXH;
          const pct = (v) => (v / total * 100) + "%";
          return (
            <div className="m-bcol" key={b.y}>
              <div className="m-bar" style={{ height: grown ? barH + "%" : "0%" }}>
                <span className="b-top">{b.top}</span>
                <div className="s-s" style={{ height: pct(b.scn) }}></div>
                <div className="s-t" style={{ height: pct(b.tax) }}></div>
                <div className="s-p" style={{ height: pct(b.principal) }}></div>
              </div>
              <span className="m-byr">{b.y}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MEducation({ go }) {
  const trust = [
    { icon: "eye-off", t: "מגדל לא שומרת את נתוני הבנק", p: "הנתונים נשארים אצל ספק הבנקאות הפתוחה. אנחנו רואים רק את ההפקדות שביצענו." },
    { icon: "unlink", t: "אפשר לנתק בכל רגע", p: "השליטה תמיד אצלך. עצירה, עריכה וניתוק זמינים תמיד, בלחיצה אחת." },
    { icon: "shield-check", t: "רק עודף אמיתי", p: "הפקדות ההזדמנות מוגנות ברצפת יתרה — לא נבצע הפקדה נוספת כשהעו״ש נמוך. הרצפה החודשית היא סכום קבוע שאתה קובע." },
  ];
  return (
    <div className="m-scroll">
      <div className="m-band">
        <div className="crumbs"><span>מגדל שלי</span><span className="sep">›</span><span className="cur">חיסכון חכם</span></div>
      </div>
      <div className="m-flow">
        <span className="m-eyebrow"><Icon name="sparkles" /> חוסכים בלי להרגיש</span>
        <h1 className="t">החיסכון שהופך מהחלטה חוזרת<br/>ל<em>מצב ברירת מחדל</em></h1>
        <p className="lead">לקוחות רבים יכולים לחסוך יותר — אבל העודף יושב בעו״ש בלי שמים לב. חיסכון חכם הופך את הבלתי-נראה לנראה, ומעביר רק את מה שבאמת נשאר.</p>

        {/* stage 1 — emotional hook */}
        <div className="m-hook">
          <p className="sm">החודש זיהינו שנשאר לך עודף של</p>
          <div className="big">₪2,300</div>
          <p className="cap">שישב בעו״ש בלי לעבוד בשבילך.<br/>דמיין שזה קורה כל חודש.</p>
        </div>

        {/* stage 2 — growth */}
        <div className="m-growth">
          <h3>ולאן זה יכול לצמוח?</h3>
          <p className="gsub">בהפקדה חודשית ממוצעת לקופת גמל להשקעה — הקרן שנצברת והטבת המס, להמחשה.</p>
          <MGrowthChart />
          <div className="m-legend">
            <span><i style={{ background: "var(--mig-blue)" }}></i> הקרן שתפקיד</span>
            <span><i style={{ background: "var(--mig-green)" }}></i> הטבת מס</span>
            <span><i style={{ background: "#d7def0" }}></i> טווח תשואה (להמחשה)</span>
          </div>
        </div>
        <p className="m-disc">
          <b>חשוב:</b> בניגוד לפיקדון בריבית קבועה, התשואה במוצרי החיסכון אינה ידועה מראש. המספרים הם הקרן הצפויה והטבת המס; טווח התשואה הוא להמחשה בלבד ואינו מהווה הבטחה, ייעוץ או המלצה.
        </p>

        {/* trust */}
        <div className="m-trust">
          {trust.map((t) => (
            <div className="tr" key={t.t}>
              <span className="ti"><Icon name={t.icon} /></span>
              <div className="tt"><b>{t.t}</b><p>{t.p}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="m-actions">
        <button className="m-btn m-btn-green" onClick={() => go(2)}>מתחברים בצורה מאובטחת <Icon name="arrow-left" /></button>
        <button className="m-btn-text" onClick={() => go(0)}>אולי אחר כך</button>
      </div>
    </div>
  );
}

Object.assign(window, { MHome, MEducation });
