# מגדל · חיסכון חכם — Smart Auto-Savings (UI Prototype)

אב‑טיפוס אינטראקטיבי (click‑through) של ממשק **"חיסכון חכם"** של מגדל.
Static HTML/CSS/JS prototype (React 18 + Babel via CDN, RTL Hebrew).

## 🔗 Live
https://muatom.github.io/migdalopenbanking/

בכניסה בוחרים תצוגה — **מחשב** או **מובייל** — ואז עוברים לזרימה המתאימה.
המצב נשמר ב‑localStorage. כפתור "החלף תצוגה" (פינה שמאלית תחתונה) מחזיר לבחירה.

## מבנה / Structure
| קובץ | תיאור |
|---|---|
| `index.html` | מסך בחירת תצוגה (מחשב / מובייל) — נקודת הכניסה |
| `desktop.html` | זרימת **מחשב** — האזור האישי "מגדל שלי" באתר (`styles.css`, `screens-*.jsx`, `chrome.jsx`) |
| `mobile.html` | זרימת **מובייל** — אפליקציית מגדל לאייפון (`mobile.css`, `mobile-screens-*.jsx`, `mobile-chrome.jsx`) |
| `tokens.css` | טוקנים משותפים + גופן Migdal RagSans |
| `assets/`, `fonts/` | לוגואים + 4 משקלי RagSans |

שתי הזרימות מציגות את אותו תהליך בן 10 השלבים (גילוי → הסבר ערך → חיבור בנק → אשף → דשבורד → חודש חזק/R2P דרך אפליקציית הבנק).

## הרצה מקומית / Run locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## עדכון הדף החי / Updating the live page
כל דחיפה ל‑`main` מפרסמת מחדש אוטומטית:
```bash
git add -A && git commit -m "update" && git push
```

---
> Prototype only — fictional banks, working title, and sample figures for illustration.
