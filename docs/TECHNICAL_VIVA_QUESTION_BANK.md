# SkillBridge AI • Technical Viva & Evaluator Question Bank
> **Target Audience:** First-year college students preparing for technical cross-examination, faculty viva voce, and hackathon judge questioning.  
> **Golden Rule:** Never bluff, fabricate statistics, or pretend an unbuilt feature is complete. Confident accuracy beats exaggerated claims every single time.

---

## Section 1: Beginner Questions (Core Concepts & Mission)

### Q1: What is the core problem that SkillBridge AI solves?
- **Beginner-Friendly Explanation**: Most online learning sites give certificates just for watching videos or clicking through multiple-choice questions. Employers know this, so they don't trust these certificates. Students spend months studying but still can't get hired. SkillBridge fixes this by requiring **real, verifiable proof**—like writing working code or speaking an oral defense—before any credential is awarded.
- **Project Evidence**: [README.md](file:///Users/mk/Downloads/AI%20based%20skill-bridge/README.md#L15-L25), `src/views/ChallengesView.tsx`, `src/views/PassportView.tsx`.
- **Likely Follow-Up**: *"How is this different from LeetCode or Coursera?"*
  - **Answer**: *"LeetCode only tests isolated algorithms for software engineers. Coursera tests passive video completion. SkillBridge covers both academic IT tracks and rural vocational trades (like tailoring and electricians), tests real multi-file projects, and includes spoken oral defenses in local languages like Tamil."*

---

### Q2: Why did you choose React and Vite instead of traditional HTML/CSS/JavaScript?
- **Beginner-Friendly Explanation**: In vanilla HTML/JS, whenever a user clicks something (like switching from English to Tamil, or updating a code challenge), the entire page often needs to reload, which feels sluggish. React allows us to split the UI into independent pieces called **components** that re-render instantly without refreshing the page. Vite provides a modern development environment that compiles changes in 20 milliseconds and bundles everything into lightweight files for fast loading.
- **Project Evidence**: `package.json` (`react: ^19.2.0`, `vite: ^8.3.5`), `vite.config.ts`.
- **Likely Follow-Up**: *"Could you have built this with Next.js?"*
  - **Answer**: *"Yes, Next.js is great for server-rendered web applications. However, for a client-first hackathon prototype that needs to function offline as a Progressive Web App (PWA) with instant client-side state transitions, React 19 with Vite provided smaller bundle sizes, faster build times, and zero server deployment overhead."*

---

### Q3: What is Zustand and why did you use it instead of Redux?
- **Beginner-Friendly Explanation**: Zustand is our application's **central memory store**. When Priya finishes a challenge or toggles a What-If simulation, multiple components across the app need to know about it (the navbar XP counter, the passport, the resume, and the readiness ring). Redux requires hundreds of lines of boilerplate code (actions, reducers, dispatchers). Zustand lets us create a reactive store in just a few lines using simple JavaScript hooks.
- **Project Evidence**: `src/store/useSkillBridgeStore.ts`.
- **Likely Follow-Up**: *"Does user data get lost when I refresh the browser?"*
  - **Answer**: *"No. In `useSkillBridgeStore.ts`, we persist the user's active persona, language selection, and challenge records to browser `localStorage`. When the page reloads, Zustand rehydrates the state immediately."*

---

## Section 2: Intermediate Questions (Architecture, State & Logic)

### Q4: Exactly what makes this an "AI" project, and where does the AI actually run?
- **Beginner-Friendly Explanation**: We use AI in three specific places where fixed rules are not flexible enough:
  1. **Job Description Extraction (`/api/jd-extract`)**: Natural Language Processing (NLP) extracts required skills, importance tiers (`must` vs `nice`), and eligibility from raw, unstructured employer job postings.
  2. **Adaptive Roadmap Injection (`/api/roadmap-adapt`)**: Evaluates a student's diagnostic test failures and generates tailored remedial micro-lessons with custom explanations.
  3. **Oral Defense (Viva) Articulation Scoring (`/api/viva/score-answer`)**: Analyzes spoken audio transcripts to evaluate conceptual depth, terminology usage, and explanation clarity.
- **Technical Honesty Note**: *"In our current prototype, we utilize a **dual-tier architecture**. In live mode, requests communicate with LLM endpoints. In development or offline mode, Vite's `apiMockPlugin` and client-side fallbacks use deterministic Zod schemas so the demo never fails during presentations."*
- **Project Evidence**: `src/services/api.ts` lines 100–350, `vite.config.ts`.
- **Likely Follow-Up**: *"What happens if the AI endpoint experiences high latency or times out?"*
  - **Answer**: *"We have an 8-second timeout guard in `src/services/api.ts`. If the network drops or the AI service stalls, the call gracefully catches the error and serves a cached, Zod-validated fallback response with an `{ isLive: false }` badge, ensuring the student never faces a broken UI."*

---

### Q5: How is the Workplace Readiness Score calculated? Is it just a random number?
- **Beginner-Friendly Explanation**: It is **not** a random number or a black-box AI guess. It is a **100% transparent, deterministic weighted arithmetic sum** based on five concrete components:
  $$\text{Readiness} = (S \times 0.30) + (P \times 0.25) + (A \times 0.20) + (C \times 0.15) + (R \times 0.10)$$
  - **Skills ($S$ - 30%)**: Count of verified skills from passed challenge rubrics.
  - **Projects ($P$ - 25%)**: Working multi-file project code submissions.
  - **Assessments ($A$ - 20%)**: Diagnostic quizzes passed with $\ge 70\%$ score.
  - **Communication ($C$ - 15%)**: Oral defense (Viva) scores evaluating articulation.
  - **Requirements ($R$ - 10%)**: Civic and pathway prerequisite milestones fulfilled.
- **Project Evidence**: `src/utils/readinessCalculator.ts`, `src/views/ReadinessView.tsx`.
- **Likely Follow-Up**: *"How does the What-If Simulator work?"*
  - **Answer**: *"The What-If Simulator creates a temporary cloned state in memory. When a student checks 'Complete JS Challenge', the calculator recalculates the formula with the hypothetical passing score ($+8\%$) and updates the UI without modifying their real saved profile in `localStorage`."*

---

### Q6: How does the multi-file code editor work inside the browser without a backend compiler?
- **Beginner-Friendly Explanation**: Modern web browsers are already capable of executing HTML, CSS, and JavaScript. We built a sandboxed client-side workspace. When the student edits `index.html`, `styles.css`, or `app.js`, our component combines them into a single virtual document and injects it into a sandboxed `<iframe>`.
- **Security & Sandboxing**: The `<iframe>` uses strict HTML5 sandboxing attributes (`sandbox="allow-scripts"`) and isolates the preview from the main application's cookies, `localStorage`, and DOM, preventing malicious code execution.
- **Automated Tests**: Our test runner parses the iframe's DOM directly to verify semantic tags (`<header>`, `<main>`, `<skip-link>`), responsive styles, and accessible form labels.
- **Project Evidence**: `src/views/ChallengesView.tsx`, `src/components/ChallengeWorkspace.tsx`.

---

## Section 3: Advanced Questions (Security, Resilience, Scalability & Verification)

### Q7: Why would an employer trust a SkillBridge Digital Passport over a traditional college degree or PDF certificate?
- **Beginner-Friendly Explanation**: A traditional PDF certificate can be easily fabricated or photoshopped in 5 minutes. A SkillBridge Digital Passport contains **cryptographic evidence links**:
  1. **Source Code Inspection**: Employers can click and view the student's actual multi-file code repository and DOM test pass logs.
  2. **Oral Defense Transcripts**: Employers can review the student's spoken audio viva transcript and rubric scores.
  3. **Tamper-Evident SHA-256 Hashes**: Every verified credential entry includes a SHA-256 hash generated from the student's ID, milestone title, mentor verification timestamp, and score.
  4. **Dynamic SVG QR Code**: Anyone can scan the QR code on a printed resume using a standard smartphone to immediately open the live verification ledger.
- **Project Evidence**: `src/views/PassportView.tsx`, `src/utils/resumeTransformer.ts`, `src/views/ResumeView.tsx`.

---

### Q8: How did you implement multi-language support (i18n), and how do you ensure zero text clipping across languages?
- **Beginner-Friendly Explanation**: We integrated `react-i18next` with **13 dedicated namespaces** (`common`, `challenges`, `roadmap`, `readiness`, `passport`, `resume`, etc.) across 4 languages: English (`en`), Tamil (`ta`), French (`fr`), and Hindi (`hi`).
- **Zero Key Discrepancy**: We wrote an automated testing script (`scripts/check-i18n.js`) run via `npm run i18n:check` that asserts 100% key parity (all 391 keys) across all languages before build.
- **Typography & Glyph Resilience**:
  - Tamil and Devanagari (Hindi) scripts have taller glyphs and ascenders/descenders than Latin characters. We imported **Noto Sans Tamil** and **Noto Sans Devanagari** with enhanced line heights (`leading-relaxed` / `1.6`) in `index.css` to prevent vertical clipping.
  - French words are typically 20–30% longer than English equivalents. We implemented CSS `hyphens: auto`, `word-break: break-word`, and fluid flex wrapping to ensure buttons and headers never clip at mobile viewports down to 320px.
- **Project Evidence**: `src/i18n/index.ts`, `scripts/check-i18n.js`, `src/index.css`.

---

### Q9: What are the security vulnerabilities of your current architecture, and how would you harden it for production?
- **Honest Technical Evaluation**:
  1. **Client-Side Secret Storage**: Currently, mock API calls and fallback keys exist in the frontend repository. In production, all AI calls must route through an authenticated backend API gateway (e.g., Node/Express or FastAPI) that stores API keys securely in server-side environment variables.
  2. **LocalStorage State Tampering**: An advanced user could open browser DevTools and manually edit `localStorage.getItem('skillbridge-store')` to change their score. In production, all milestone completions must be signed with JSON Web Tokens (JWT) and validated against a PostgreSQL database.
  3. **Photo QC Verification Limits**: The vocational tailoring photo inspection currently uses client-side simulated scale overlays. In production, this would connect to a computer vision model (e.g., OpenCV / YOLO) trained on textile seam margins to automatically detect stitches-per-inch.
- **Project Evidence**: `src/store/useSkillBridgeStore.ts`, `src/services/api.ts`.

---

## Section 4: Tough Questions & How to Answer Honestly (Chapter 26 Framework)

### Q10: "Did your team actually build the AI model, or are you just calling an API?"
- **Bad Answer (Bluffing)**: *"Yes, we trained our own custom 70-billion-parameter deep learning model from scratch last weekend."* (Judges will immediately recognize this as false and disqualify you).
- **Correct, Professional Answer**:
  > *"We did not train a foundation model from scratch, and in modern software architecture, you shouldn't! Our innovation is in the **civic application architecture, prompt engineering, and deterministic evaluation pipeline**:
  > 1. We designed the **Zod runtime schema contracts** that force unstructured LLM outputs into predictable, type-safe rubric structures.
  > 2. We designed the **dual-tier fallback resilience system** that prevents UI crashes when network connections drop.
  > 3. We built the **mathematical readiness calculator** and the **client-side code sandbox test runner**, which are 100% custom-built by our team."*

---

### Q11: "What did each person on your team actually contribute?"
- **Rule**: Never say *"We all did everything together."* Be specific and praise your teammates.
- **Template**:
  > - *"**[Member 1]** focused on the product vision, persona modeling, onboarding workflows, and the 4-language i18n localization engine."*
  > - *"**[Member 2]** built the interactive multi-file coding workspace, DOM test runner, and the Web Speech API voice viva integration."*
  > - *"**[Member 3]** engineered the AI service integration, Zod schema validations, and the deterministic readiness mathematical formulas."*
  > - *"**[Member 4]** designed the cryptographic Skill Passport, the ATS one-page resume generator, and the employer hiring analytics portal."*

---

### Q12: "What happens if a student tries to cheat on the oral viva by reading from another screen?"
- **Professional Answer**:
  > *"That is an excellent point. In our current prototype, we analyze speech cadence, response latency, and conceptual depth through the viva scoring prompt.
  > However, in a hackathon MVP, we do not have gaze tracking or anti-cheating browser locks. For our production roadmap (Chapter 28), we plan to introduce randomized follow-up viva questions based on the student's specific line-by-line code commits, and randomized parameter variations in the code challenge, making script-reading ineffective."*

---

### Q13: "What is the single biggest limitation of your current implementation?"
- **Professional Answer**:
  > *"The single biggest limitation today is that our backend is client-centric—persisting state in browser `localStorage` and utilizing client-side mock fallbacks.
  > While this makes the application exceptionally fast and offline-capable for demonstrations and rural areas with spotty Wi-Fi, it means multi-device synchronization and tamper-proof server-side audit trails require migrating to a persistent PostgreSQL database with Supabase or Firebase authentication."*

---

## Section 5: "How to Answer When You Don't Know" (Emergency Scripts)

If a judge asks a question about a technology or algorithm you genuinely do not know:

1. **When you don't know the exact answer**:
   > *"That is a thoughtful architectural question. While we haven't implemented that specific mechanism yet in our prototype, our current approach solves this by [mention the closest related feature you actually built]. We would love to explore your suggestion in our post-hackathon roadmap."*

2. **When you forgot a technical term**:
   > *"I'm momentarily blanking on the exact academic terminology, but conceptually how it works in our codebase is [explain the practical mechanism simply]."*

3. **When a judge points out a genuine flaw or bug**:
   > *"You are completely right, and that is a sharp observation. Our current trade-off was to prioritize [e.g. offline client resilience], but that does introduce the exact edge case you identified. Fixing that by [briefly state a logical solution] is on our immediate roadmap."*
