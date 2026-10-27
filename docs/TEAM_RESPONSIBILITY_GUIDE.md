# SkillBridge AI • Team Responsibility & Role Division Guide
> **Audience:** First-year college students preparing for hackathon presentations and viva examinations.  
> **Mission:** Clear, confident ownership of features, codebase files, live demo segments, and defense questions.

---

## 1. Principles of Effective Team Presentation

1. **Every Team Member Speaks**: Judges penalize teams where one person talks for 5 minutes while others look at the floor. Every person must have a dedicated 45-to-90-second speaking role.
2. **Feature Ownership Over Code Monopolies**: Even if one person wrote more lines of code during the build, every team member must "own" a core pillar of the platform (e.g., Learner Journey, Proof & Code Sandbox, AI & Architecture, Employer & Policy Impact).
3. **Smooth Baton Passes**: Use vocal handoffs:
   - *"Now, I'll pass the microphone to Priya, who will demonstrate our real-time multi-file code sandbox."*
   - *"To explain how our mathematical readiness formula prevents metric inflation, here is Karthik."*
4. **No Contradictions**: If a teammate says, *"Our AI uses cached Zod-validated models for offline hackathon resilience,"* do not interrupt and claim *"We built a 100-billion-parameter neural network from scratch."* Stick to the agreed technical facts!

---

## 2. Team Division Configurations

Depending on how many teammates you have, pick the matching configuration below:

### Configuration A: 4-Member Team (Recommended)

| Member | Title & Role | Core Feature Ownership | Files Owned in Codebase | Live Demo Responsibility | Likely Judge Question to Answer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Product Lead & Presenter** | Vision, Problem Statement, Personas, Onboarding, Localization (i18n) | `HomeView.tsx`, `OnboardingView.tsx`, `GlassNavbar.tsx`, `src/i18n/` | Delivers 30s Hook + Persona Switcher + Language Selector + District Intake | *"Why focus on Tamil Nadu specifically instead of all of India?"* |
| **Member 2** | **Technical Sandbox & Proof Lead** | Code Sandbox, Test Runner, Photo QC Inspection, Oral Defense (Viva) | `ChallengesView.tsx`, `ChallengeWorkspace.tsx`, `QuickVivaModal.tsx`, `speech.ts` | Demonstrates Flexbox challenge, runs live test suite, triggers AI Viva in mic | *"How does the browser test runner evaluate student code securely?"* |
| **Member 3** | **Architecture & Algorithm Lead** | AI API Integration, Dual-Tier Resilience, Mathematical Readiness Formula | `services/api.ts`, `vite.config.ts`, `ReadinessView.tsx`, `readinessCalculator.ts` | Shows What-If Simulator (+8% JS challenge boost) & Explain Formula Disclosures | *"What happens to your application if internet drops or the AI API times out?"* |
| **Member 4** | **Employer, Credential & Impact Lead** | Verifiable Skill Passport, 1-Page Resume, Employer & Institution Portals | `PassportView.tsx`, `ResumeView.tsx`, `EmployerView.tsx`, `InstitutionView.tsx` | Scans QR code with phone, shows ATS-friendly 1-page PDF printout, shows Employer candidate rankings | *"Why would an employer trust a SkillBridge passport over a college degree?"* |

---

### Configuration B: 3-Member Team

| Member | Role & Responsibilities | Demo Walkthrough | Primary Viva Focus |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Frontend & Product Lead**: Problem statement, target personas, onboarding, internationalization, and ATS resume generator. | Introduces problem, switches to Tamil & French, generates 1-page verified resume. | User workflows, UX decisions, localization mechanics, and target demographic. |
| **Member 2** | **Full-Stack & Challenge Lead**: Multi-file code editor, DOM test execution, photo QC measurement, and voice Viva examiner. | Codes a CSS fix, runs automated tests, answers oral Viva questions live. | Sandboxed iframes, Web Speech API integration, multi-modal proof handling. |
| **Member 3** | **Architecture & Data Lead**: AI fallback architecture, Zod validation, mathematical readiness index, employer hiring pipeline. | Toggles What-If simulator, demonstrates formula transparency, shortlists candidate. | API resilience, rule-based vs LLM engines, employer hiring trust, and privacy. |

---

### Configuration C: 2-Member Team

| Member | Role & Responsibilities | Demo Walkthrough |
| :--- | :--- | :--- |
| **Member 1 (Presenter & Product)** | Problem, personas, bilingual design, code challenge, oral viva, and resume. | Introduces project, completes challenge, defends code aloud, prints resume. |
| **Member 2 (Technical & Systems)** | System architecture, Zod schema validation, offline fallbacks, readiness math, and employer portal. | Explains API architecture, toggles What-If simulator, shows QR code verification. |

---

### Configuration D: 5-Member Team

| Member | Focus Area | Specific Demo Action | Codebase Reference |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Team Captain & Problem Lead** | Hook, problem framing, Avvaiyar proverb, persona context | `HomeView.tsx` |
| **Member 2** | **UX & Accessibility Lead** | Onboarding, 4-language i18n, WCAG 2.1 AA compliance, mobile resilience | `OnboardingView.tsx`, `i18n/`, `index.css` |
| **Member 3** | **Core Sandbox Engineer** | Multi-file coding, automated test suite, tailoring photo QC inspection | `ChallengesView.tsx`, `ChallengeWorkspace.tsx` |
| **Member 4** | **AI & Systems Engineer** | Speech API voice viva, dual-tier fallback engine, Zod runtime validation | `QuickVivaModal.tsx`, `services/api.ts`, `vite.config.ts` |
| **Member 5** | **Readiness & Employer Lead** | What-If simulator, verifiable passport QR, employer hiring shortlist | `ReadinessView.tsx`, `PassportView.tsx`, `EmployerView.tsx` |

---

## 3. Rehearsal Checklist (48 Hours Before Presentation)

- [ ] **Run on Localhost**: Ensure `npm run dev` works without any red error banners in terminal or browser console.
- [ ] **Time Your Presentation**: Use a smartphone stopwatch. Keep the main pitch strictly under **4 minutes** so you have at least 2 minutes for judges' questions.
- [ ] **Test Audio/Microphone**: Test the Viva modal mic input in Chrome. If the auditorium has background noise, practice using the quick test fill buttons so the demo doesn't stall.
- [ ] **Test Mobile Responsive View**: Open Chrome DevTools (`F12`), toggle Device Toolbar (`Ctrl+Shift+M`), and show the judges that the interface survives 320px width without clipped words.
- [ ] **Have Passport QR Ready**: Keep a smartphone handy to scan the QR code on the Passport page to show that it opens the verification link live.
- [ ] **Practice the "We Don't Know" Phrasing**: Rehearse Chapter 26 phrases so no team member panics or bluffs when a tough question is asked.
