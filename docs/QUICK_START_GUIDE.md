# SkillBridge AI • Quick-Start & Team Setup Guide
> **Target Audience:** First-year college students, hackathon teammates, and evaluators.  
> **Prerequisites:** Zero prior development experience assumed.

---

## 1. What is SkillBridge AI in 30 Seconds?

**SkillBridge AI (திறன் பாலம்)** is a civic skill-development and career-readiness platform designed for learners in Tamil Nadu. Instead of granting paper certificates for passively watching videos, SkillBridge tests learners through **real, reproducible evidence**:
1. **Live Code & Hands-On Sandboxes**: Real multi-file HTML/CSS/JS challenges.
2. **Vocational Craft Inspection**: Photo-based quality audits (e.g., tailoring seam margins with coin/scale calibration).
3. **AI Oral Defenses (Vivas)**: Spoken answers scored for conceptual depth and confidence in English, Tamil, French, or Hindi.
4. **Verifiable Skill Passport**: Tamper-evident cryptographic credentials with QR codes that employers can verify in 5 seconds.
5. **Workplace Readiness Formula**: 100% transparent arithmetic index showing students exactly why they are ready for a role.

---

## 2. System Requirements

Before running the project on your laptop, ensure you have:
- **Operating System**: macOS, Windows (WSL2 recommended), or Linux.
- **Node.js**: Version `18.0.0` or higher (we recommend Node `v20+` or `v24+`).
  - *How to check*: Open terminal and run `node -v`.
- **npm**: Version `9.0.0` or higher (comes automatically with Node).
  - *How to check*: Run `npm -v`.
- **Modern Web Browser**: Google Chrome, Microsoft Edge, Brave, or Safari (Chrome is recommended for full Web Speech API mic input).
- **Code Editor**: Visual Studio Code or Google Antigravity IDE.

---

## 3. Step-by-Step Installation & Local Run

### Step 1: Open the Terminal
Open your terminal application and navigate to the project directory:
```bash
cd "/Users/mk/Downloads/AI based skill-bridge"
```

### Step 2: Install Dependencies
Download and install all required libraries specified in `package.json`:
```bash
npm install
```
*(This installs React 19, TypeScript, Vite, Tailwind CSS, Zustand, Lucide icons, Framer Motion, and i18next).*

### Step 3: Run the Development Server
Start the local development server:
```bash
npm run dev
```
You will see output similar to:
```text
  VITE v8.3.5  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Your Web Browser
Open your browser and navigate to:
```
http://localhost:5173
```
You should now see the SkillBridge AI homepage with the Deep Blue, Sky Blue, and White design!

---

## 4. Key Commands Cheat Sheet

| Command | Purpose | When to Use |
| :--- | :--- | :--- |
| `npm run dev` | Starts local dev server with hot reload | Every day while coding or practicing demo |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` | Before submission or to verify zero code errors |
| `npm run preview` | Serves the production bundle locally | To test exact production speed and service worker |
| `npm run i18n:check` | Verifies that all 391 keys exist across `en`, `ta`, `fr`, and `hi` | Whenever you edit locale JSON files |

---

## 5. Project Directory Map for Beginners

```text
AI based skill-bridge/
├── index.html              # HTML entry point (fonts, title, meta tags)
├── package.json            # Project dependencies and terminal scripts
├── vite.config.ts          # Vite build config and mock backend plugin (/api/*)
├── src/
│   ├── main.tsx            # Application entry point (mounts React)
│   ├── App.tsx             # Main routing and navigation switch
│   ├── index.css           # Global design system, colors, animations, print CSS
│   ├── components/         # Reusable building blocks (Navbar, Heatmap, Modals, EmptyState)
│   │   ├── GlassNavbar.tsx     # Header bar with language selector and persona picker
│   │   ├── PracticeHeatmap.tsx # 16-week consistency habit tracker
│   │   ├── QuickVivaModal.tsx  # Voice oral defense pop-up
│   │   └── TrustLabel.tsx      # Badges showing "Simulated" vs "Verified"
│   ├── views/              # Full page screens (one for each major feature)
│   │   ├── HomeView.tsx        # Hero landing page and discovery loop
│   │   ├── OnboardingView.tsx  # Intake form for goals and district
│   │   ├── GapAnalysisView.tsx # JD parser and skill delta charts
│   │   ├── RoadmapView.tsx     # Adaptive step-by-step milestones
│   │   ├── ChallengesView.tsx  # Interactive code editor and craft photo submission
│   │   ├── PassportView.tsx    # Digital credential with QR code
│   │   ├── ReadinessView.tsx   # Mathematical score and What-If simulator
│   │   ├── ResumeView.tsx      # ATS-friendly 1-page printable resume
│   │   ├── OpportunitiesView.tsx# District jobs, NAPS apprenticeships, and tracker
│   │   ├── CoachView.tsx       # AI audio mentor
│   │   ├── InterviewView.tsx   # Mock technical interview with speech pacing
│   │   ├── EmployerView.tsx    # Employer hiring portal
│   │   └── InstitutionView.tsx # College/Government NEP analytics dashboard
│   ├── store/
│   │   └── useSkillBridgeStore.ts # Centralized brain where all user state lives
│   ├── services/
│   │   └── api.ts          # Handles API calls with offline fallback data
│   ├── locales/            # Translation dictionary files (en, ta, fr, hi)
│   ├── utils/              # Helper functions (Intl formatters, resume builder, speech)
│   └── types/              # TypeScript blueprints defining data shapes
```

---

## 6. How to Test Without Breaking Anything

1. **Changing Personas**:
   Click the persona chip in the top navigation bar. Switch between **Priya Raman** (Academic IT Student), **Lakshmi Narayanan** (Vocational Artisan Tailor), and **Murugan K** (Electrician). Watch how the entire dashboard dynamically recalibrates for that specific student!
2. **Changing Languages**:
   Click the language dropdown in the top header. Switch between **English**, **தமிழ் (Tamil)**, **Français**, and **हिन्दी (Hindi)**. Notice how every heading, button, and badge changes instantly into that single language without duplicate text.
3. **Simulating Improvements**:
   Go to the **Readiness** page (`/readiness`). Scroll down to the **What-If Simulator**. Check the box *Complete JS Challenge (+8%)*. Watch the progress ring jump from 78% to 86%, and see the exact mathematical formula update in real time!
4. **Triggering the Guided Tour**:
   Press `Shift + D` on your keyboard anywhere in the app to launch the **11-step interactive guided presentation tour**.

---

## 7. Troubleshooting Common Beginner Issues

### Issue 1: `Port 5173 is already in use`
- **Cause**: Another terminal is already running `npm run dev`.
- **Fix**: Either close the old terminal window, or let Vite automatically run on `http://localhost:5174`.

### Issue 2: `command not found: npm` or `command not found: node`
- **Cause**: Node.js is not installed or not in your system PATH.
- **Fix**: Download and install the LTS version of Node.js from [nodejs.org](https://nodejs.org/).

### Issue 3: Microphone not recording in Oral Defense (Viva)
- **Cause**: Browser permissions or non-supported browser.
- **Fix**: Use Google Chrome, click the lock icon next to `localhost:5173` in your browser address bar, and set **Microphone** to **Allow**. You can also click the quick sample fill buttons in the modal.

### Issue 4: Visual changes not appearing
- **Cause**: Browser caching.
- **Fix**: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard-refresh the page.
