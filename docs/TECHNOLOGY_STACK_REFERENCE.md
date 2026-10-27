# SkillBridge AI • Technology Stack Reference & Architecture Cheat Sheet
> **Audience:** First-year college students and technical interviewers.  
> **Purpose:** Plain-English explanations, real codebase evidence, architecture justifications, and beginner analogies for every technology used in SkillBridge AI.

---

## 1. Master Technology Stack Matrix

| Technology | Category | Version | Purpose in SkillBridge AI | Codebase Evidence | Why Chosen Over Alternatives | Top Alternative | Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TypeScript** | Programming Language | `5.9.x` | Static type safety, contract enforcement, and autocomplete across data structures | `tsconfig.json`, `src/types/index.ts` | Prevents runtime `undefined` crashes and documents complex schemas | Vanilla JavaScript, Python | Higher learning curve; requires build compilation step |
| **React** | Frontend Framework | `19.2.x` | Declarative, component-based user interface rendering and reactivity | `package.json`, `src/main.tsx`, `src/App.tsx` | Industry standard; massive ecosystem; seamless component reusability | Vue.js, Svelte, Angular | Virtual DOM overhead; state management complexity if not structured |
| **Vite** | Build Tool & Bundler | `8.3.5` | Instant dev-server startup via native ESM; lightning-fast production bundling | `vite.config.ts`, `package.json` | 10x-50x faster hot module replacement (HMR) than legacy Webpack | Webpack, Parcel, Turbopack | Modern ESM reliance requires careful legacy polyfill handling |
| **Tailwind CSS** | Styling Framework | `3.4.x` | Atomic, utility-first CSS design system with custom brand tokens | `tailwind.config.js`, `src/index.css` | Zero context switching; guaranteed zero CSS file bloat; rapid prototyping | Vanilla CSS, Bootstrap, Material UI | HTML class strings can look cluttered to beginners |
| **Zustand** | State Management | `5.0.x` | Centralized, reactive state store with local persistence for student profiles | `src/store/useSkillBridgeStore.ts` | 90% less boilerplate than Redux; zero context-re-rendering lag; hook-based | Redux Toolkit, MobX, Context API | Minimal built-in structure; discipline needed for state shape |
| **react-i18next** | Internationalization (i18n) | `16.5.x` | Multi-language translation engine for English, Tamil, French, and Hindi | `src/i18n/index.ts`, `src/locales/` | Standard i18n solution with namespaces, fallback handling, and plural rules | FormatJS, LinguiJS | Requires maintaining synchronized JSON locale keys |
| **Native Web Speech API** | Speech Recognition & Synthesis | Browser Built-in | Real-time speech-to-text mic input and text-to-speech audio mentor voice | `src/utils/speech.ts`, `QuickVivaModal.tsx` | Zero cost; zero external network latency; runs directly on device | Whisper API, Google Cloud Speech | Inconsistent browser support (works best in Chromium-based browsers) |
| **Zod** | Schema Validation | `3.25.x` | Runtime schema validation for AI payloads, job parsing, and API responses | `src/services/api.ts` | Eliminates silent bugs by validating AI JSON structures against TypeScript types | Yup, Joi, Valibot | Adds a small bundle size footprint (~12kB) |
| **Lucide React** | Iconography | `1.16.x` | Crisp, scalable, lightweight vector icons matching the UI design system | `package.json`, imported in components | Consistent 24x24 pixel grid; tree-shakeable; accessible SVGs | FontAwesome, Heroicons | Fixed icon style set |
| **Framer Motion** | Micro-Animations | `12.38.x` | Smooth page transitions, modal entrances, and progress ring animations | `src/components/QuickVivaModal.tsx` | Physics-based spring animations with simple JSX syntax | React Spring, GSAP | Adds ~30kB to bundle size; avoid over-animating |
| **qrcode.react** | QR Code Generation | `4.2.x` | Renders dynamic SVG QR codes linking to verifiable digital passports | `src/views/PassportView.tsx`, `ResumeView.tsx` | Pure client-side SVG rendering; no external image server needed | Server-side QR APIs | Only generates QR; verification logic must live in app router |
| **canvas-confetti** | Delight & Gamification | `1.9.x` | Celebratory particle confetti when completing challenges or hiring candidates | `src/views/EmployerView.tsx`, `ChallengesView.tsx` | Lightweight, zero-dependency canvas particle engine | Custom CSS animations | Purely cosmetic; not critical to core logic |
| **Vite PWA Plugin** | Progressive Web App & Offline | `1.2.x` | Generates service worker (`sw.js`) and web app manifest for offline caching | `vite.config.ts`, `dist/sw.js` | Enables installation on mobile phones and offline review of passports | Manual Workbox configuration | Cache invalidation requires careful versioning |

---

## 2. In-Depth Technology Breakdown: Plain English & Analogies

### 1. TypeScript (`5.9.x`)
- **What it is**: A superset of JavaScript that adds **types** (labels telling the computer what kind of data each variable holds).
- **Analogy**: Imagine packing boxes for moving. Plain JavaScript is putting items in unlabeled brown boxes and hoping you don't drop a glass vase when opening them later. TypeScript is writing "FRAGILE GLASSWARE - HANDLE WITH CARE" on the box. If you try to put a bowling ball in it, TypeScript stops you immediately before you tape it shut!
- **Why SkillBridge Uses It**: SkillBridge tracks complex data: personas, pathways, rubric criteria, viva questions, and test scores. TypeScript ensures a `score` is always a `number`, an `id` is always a `string`, and no component tries to read a property that doesn't exist.
- **Code Example**:
  ```typescript
  // src/types/index.ts
  export interface Persona {
    id: string;
    name: string;
    nameTamil: string;
    location: string;
    targetRole: string;
    readinessScore: number; // Guaranteed to be a number!
    streakDays: number;
  }
  ```

---

### 2. React (`19.2.x`)
- **What it is**: A JavaScript library built by Meta for creating user interfaces out of reusable, Lego-like **components**.
- **Analogy**: In a traditional website (pure HTML), if a student finishes a challenge, the entire webpage would have to refresh from scratch. With React, only the specific button and score ring re-render instantly, like a digital scoreboard updating a basketball score without rebuilding the whole stadium!
- **Why SkillBridge Uses It**: Every screen in SkillBridge (the habit heatmap, the code sandbox, the live interview recorder) needs to react instantly when the student interacts with it.
- **Code Example**:
  ```tsx
  // src/components/TrustLabel.tsx
  export const TrustLabel: React.FC<{ type: 'verified' | 'sample-opportunity' }> = ({ type }) => {
    if (type === 'verified') {
      return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Mentor Verified</span>;
    }
    return <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded">Sample · Not a Vacancy</span>;
  };
  ```

---

### 3. Vite (`8.3.5`)
- **What it is**: A blazing-fast development server and build tool created by Evan You (creator of Vue).
- **Analogy**: Old bundlers (like Webpack) were like a chef who bakes an entire 10-course banquet from scratch every time a diner asks for extra salt. Vite is like a master short-order cook who only toasts one piece of bread when you ask for toast!
- **Why SkillBridge Uses It**: Starts up in less than 300 milliseconds. When you change code, the browser updates in 20 milliseconds without a full page reload. It also runs a built-in mock API server (`apiMockPlugin` in `vite.config.ts`) so the entire platform works offline!

---

### 4. Tailwind CSS (`3.4.x`)
- **What it is**: A utility-first CSS framework that provides pre-made styling classes directly inside your HTML/JSX.
- **Analogy**: Instead of hiring a custom tailor to sew a new shirt every time you go out (traditional CSS files), Tailwind is a closet full of perfectly sized collar pins, buttons, and fabrics (`text-sm`, `font-bold`, `bg-white`, `rounded-card`) that you combine in seconds.
- **Why SkillBridge Uses It**: Enables strict adherence to our design system: **Deep Blue (`#173B67`)**, **Sky Blue (`#62B6E8`)**, and **Warm Sand Gold (`#F2B66D`)** with smooth dark mode (`dark:bg-night-card`).

---

### 5. Zustand (`5.0.x`)
- **What it is**: A state-management library that acts as the **central memory** of the application.
- **Analogy**: Think of a shared notebook in a study group. If Priya earns 50 XP in the code challenge, she writes it in the notebook. Instantly, the navbar, the leaderboard, the resume generator, and the readiness calculator read the notebook and show the updated score!
- **Why SkillBridge Uses It**: Eliminates "prop drilling" (passing data through 10 layers of components). All user data persists across page refreshes using `localStorage`.
- **Code Example**:
  ```typescript
  // src/store/useSkillBridgeStore.ts
  export const useSkillBridgeStore = create<SkillBridgeState>()((set, get) => ({
    language: 'en',
    setLanguage: (lang) => {
      localStorage.setItem('skillbridge-language', lang);
      set({ language: lang });
    },
  }));
  ```

---

### 6. react-i18next & Native Intl
- **What it is**: An internationalization framework that swaps out UI strings based on the user's selected language, paired with native browser `Intl` for formatting numbers, dates, and currency.
- **Analogy**: A universal translator earpiece. The application structure remains identical, but all the signs, labels, and explanations adapt to the reader's native tongue (English, Tamil, French, or Hindi).
- **Why SkillBridge Uses It**: Empowering Tamil Nadu rural youth requires eradicating the English-only barrier. SkillBridge offers 100% key parity across all 4 languages.

---

### 7. Native Web Speech API
- **What it is**: A set of browser-native interfaces (`webkitSpeechRecognition` and `speechSynthesis`) that allow the web page to listen through the microphone and speak aloud through speakers.
- **Analogy**: Having an examiner sitting across from you during a college practical exam. The examiner asks a question out loud, listens to your verbal answer, and transcribes your words into text for scoring.
- **Why SkillBridge Uses It**: Proves that the student actually understands their code and didn't just copy-paste it from ChatGPT.

---

### 8. Zod Runtime Schema Validation
- **What it is**: A TypeScript-first library that checks incoming data at runtime against an exact contract.
- **Analogy**: A bouncer at the door of an exclusive club checking government IDs. If an AI endpoint returns `{ score: "eighty" }` instead of `{ score: 80 }`, Zod stops it at the door and prevents the UI from crashing!
- **Code Example**:
  ```typescript
  // src/services/api.ts
  export const VivaScoreResponseSchema = z.object({
    score: z.number().min(0).max(100),
    feedback: z.string(),
    verified: z.boolean(),
  });
  ```

---

## 3. What Happens If You Remove a Technology?

| If You Removed... | What Would Happen? | How We Would Fix It |
| :--- | :--- | :--- |
| **Zustand** | Every page would forget what the student did. Taking a quiz wouldn't update the passport or resume. | We would have to pass state down through React props or rewrite with React Context. |
| **TypeScript** | Code would compile, but spelling mistakes (`persona.nmae` instead of `persona.name`) would cause blank white screens. | We would have to write hundreds of manual `typeof` checks and console logs. |
| **react-i18next** | The app would only display in English. Non-English learners would struggle to navigate. | We would have to manually hardcode ternary operators everywhere. |
| **Vite Dev Mock Plugin** | If Wi-Fi dropped during a presentation, all AI features would fail with a network error. | Without Vite's mock proxy, we would need to run a separate Node/Express backend server locally. |
