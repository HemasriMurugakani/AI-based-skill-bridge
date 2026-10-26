import { z } from 'zod';

// Strict Zod schema for /api/jd-extract
export const JdSkillItemSchema = z.object({
  name: z.string(),
  importance: z.enum(['must', 'nice']),
  category: z.string(),
  why: z.string(),
});

export const JdExtractSchema = z.object({
  role: z.string(),
  company: z.string().optional(),
  requiredSkills: z.array(JdSkillItemSchema),
  softSkills: z.array(z.string()),
  eligibility: z.array(z.string()),
});

export type JdExtractPayload = z.infer<typeof JdExtractSchema>;

// Cached fallback responses for all 3 sample JDs
export const sampleJdPayloads: Record<string, JdExtractPayload> = {
  web_dev: {
    role: "Junior React & Frontend Engineering Intern",
    company: "Vaigai Digital Solutions, Chennai",
    requiredSkills: [
      { name: "Semantic HTML & Accessibility", importance: "must", category: "Core Frontend", why: "Mandatory for WCAG 2.1 AA citizen portal compliance." },
      { name: "Responsive CSS & Flex/Grid", importance: "must", category: "Styling", why: "Layout must scale from 320px mobile to ultra-wide." },
      { name: "JavaScript & DOM Manipulation", importance: "must", category: "Logic", why: "Handling async event loops and debounced search triggers." },
      { name: "React Components & Hooks", importance: "must", category: "UI Architecture", why: "Primary technology stack for all production user interfaces." },
      { name: "REST API & State Caching", importance: "must", category: "State Management", why: "Handling offline cache fallbacks and Zod payload safety." },
      { name: "Git Version Control", importance: "nice", category: "Dev Tools", why: "Collaborating via pull requests and conventional commits." },
      { name: "TypeScript Typing", importance: "nice", category: "Type Safety", why: "Helpful for strict interface contracts across teams." }
    ],
    softSkills: [
      "Bilingual communication (Tamil / English)",
      "Attention to design fidelity",
      "Willingness to explain decisions in code reviews"
    ],
    eligibility: [
      "Diploma or BCA / B.Sc / B.E. graduate (or equivalent self-taught proof)",
      "Evidence-backed portfolio prioritized over formal college tier",
      "Chennai hybrid or local district remote"
    ]
  },
  tailoring: {
    role: "Boutique Sample Tailor & Pattern Assistant",
    company: "Kongu Apparel & Bridal Studio, Tiruppur",
    requiredSkills: [
      { name: "Body Measurement & Ease Allowances", importance: "must", category: "Pattern Prep", why: "Accurate bust, armhole, and 1.5-inch ease calculations." },
      { name: "Katori & 4-Dart Blouse Drafting", importance: "must", category: "Cutting Craft", why: "Drafting paper patterns on fabric grain line with 1/4\" margins." },
      { name: "Lockstitch Sewing & Tension Control", importance: "must", category: "Assembly", why: "Balanced thread tension at 10 stitches per inch without puckering." },
      { name: "Bias Binding & Neckline Piping", importance: "must", category: "Finishing", why: "True 45-degree cord insertion for seamless bridal blouse necks." },
      { name: "Steam Pressing & Seam Opening", importance: "nice", category: "Quality Control", why: "Flattening open seams without shine marks before client delivery." }
    ],
    softSkills: [
      "Eye for fabric tension nuance",
      "Patience for curved seam accuracy",
      "Client measurement hospitality"
    ],
    eligibility: [
      "SSLC or Vocational Skill Mission certificate (or hereditary artisan experience)",
      "Photo portfolio of 3 finished blouse seams and patterns",
      "Tiruppur / Avinashi garment cluster proximity"
    ]
  },
  electrician: {
    role: "Domestic Wireman & Solar Substation Helper",
    company: "Shevaroy Green Energy & Electricals, Salem",
    requiredSkills: [
      { name: "Electrical Safety & PPE (IS 5216)", importance: "must", category: "Safety Standard", why: "Zero-compromise de-energization, insulated tools, and LOTO compliance." },
      { name: "PVC Conduit & Loop-in Wiring", importance: "must", category: "Installation", why: "Correct phase color-coding and staircase two-way switch logic." },
      { name: "Pipe/Plate Earthing & Megger Test", importance: "must", category: "Protection", why: "Earth resistance fall-of-potential verification under 5 ohms." },
      { name: "Single-phase & 3-phase Load Balance", importance: "nice", category: "Calculations", why: "Preventing neutral wire overheating in residential circuits." }
    ],
    softSkills: [
      "Strict adherence to Indian Electricity Rules (IER)",
      "Calm troubleshooting under pressure",
      "Physical agility and safety vigilance"
    ],
    eligibility: [
      "ITI Wireman / Electrician certificate or 1 year field apprenticeship",
      "Photo proof of circuit test board assembly",
      "Salem / Yercaud foothills district resident"
    ]
  }
};

/**
 * Call /api/jd-extract or fall back to cached validated response
 */
export async function extractJobDescription(
  jdText: string,
  isOfflineDemo: boolean = true
): Promise<{ data: JdExtractPayload; isLive: boolean }> {
  // If offline mode is toggled, return cached sample immediately
  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 900)); // natural simulation delay
    const lower = jdText.toLowerCase();
    let sample = sampleJdPayloads.web_dev;
    if (lower.includes('tailor') || lower.includes('stitch') || lower.includes('blouse')) {
      sample = sampleJdPayloads.tailoring;
    } else if (lower.includes('electric') || lower.includes('wire') || lower.includes('conduit')) {
      sample = sampleJdPayloads.electrician;
    }
    const validated = JdExtractSchema.parse(sample);
    return { data: validated, isLive: false };
  }

  // Attempt live API proxy call
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout rule

    const response = await fetch('/api/jd-extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jdText }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = JdExtractSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/jd-extract failed or timed out. Falling back to cached JSON.', err);
    // Determine closest matching sample
    const lower = jdText.toLowerCase();
    let fallback = sampleJdPayloads.web_dev;
    if (lower.includes('tailor') || lower.includes('stitch') || lower.includes('blouse')) {
      fallback = sampleJdPayloads.tailoring;
    } else if (lower.includes('electric') || lower.includes('wire') || lower.includes('conduit')) {
      fallback = sampleJdPayloads.electrician;
    }
    const validated = JdExtractSchema.parse(fallback);
    return { data: validated, isLive: false };
  }
}

// Strict Zod schema for /api/roadmap-adapt
export const RoadmapAdaptSchema = z.object({
  action: z.enum(['insert_node', 'reorder', 'stretch_node']),
  insertedNode: z.object({
    id: z.string(),
    stepNumber: z.number(),
    title: z.string(),
    titleTamil: z.string(),
    activity: z.string(),
    timeEstimate: z.string(),
    whyThisStep: z.string(),
    status: z.enum(['completed', 'current', 'locked', 'adaptive_remedial', 'stretch']),
    adaptiveReason: z.string().optional(),
    lessonContent: z.object({
      overview: z.string(),
      overviewTamil: z.string(),
      keyTakeaways: z.array(z.string()),
      audioTranscript: z.string(),
      audioTranscriptTamil: z.string(),
      handsOnPrompt: z.string()
    })
  }),
  changelogEntry: z.string(),
  reasoning: z.string()
});

export type RoadmapAdaptResponse = z.infer<typeof RoadmapAdaptSchema>;

/**
 * Call /api/roadmap-adapt or fall back to cached validated response
 */
export async function adaptRoadmap(
  params: {
    pathwayId: string;
    quizScore: number;
    quizTopic?: string;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: RoadmapAdaptResponse; isLive: boolean }> {
  const score = params.quizScore !== undefined ? params.quizScore : 40;
  const topic = params.quizTopic || 'Flexbox';

  const defaultFallback: RoadmapAdaptResponse = {
    action: 'insert_node',
    insertedNode: {
      id: `remedial-css-layout-${Date.now()}`,
      stepNumber: 2.5,
      title: 'CSS Layout Practice',
      titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      activity: 'Targeted Flexbox sandbox: alignment, axis orientation, and auto-fit responsive patterns.',
      timeEstimate: '35 mins',
      whyThisStep: `Added because you scored ${score}% on ${topic}. Reinforces alignment fundamentals before starting production projects.`,
      status: 'adaptive_remedial',
      adaptiveReason: `Added because you scored ${score}% on ${topic}`,
      lessonContent: {
        overview: 'This targeted practice module reinforces Flexbox alignment, cross-axis distribution, and responsive fluid layouts without media queries.',
        overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
        keyTakeaways: [
          'flex-direction: row sets main axis horizontal; align-items aligns vertical cross axis.',
          'justify-content: space-between spaces child items across main axis.',
          'flex: 1 1 auto allows fluid expansion without overflow.'
        ],
        audioTranscript: 'Welcome to CSS Layout Practice. Let us master Flexbox main and cross axes with interactive hands-on drills.',
        audioTranscriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
        handsOnPrompt: 'Build a 3-item navigation bar using justify-content: space-between and align-items: center.'
      }
    },
    changelogEntry: `Added because you scored ${score}% on ${topic}`,
    reasoning: `Diagnostic score of ${score}% indicates need for foundational Flexbox alignment drills.`
  };

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 800));
    return { data: defaultFallback, isLive: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('/api/roadmap-adapt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = RoadmapAdaptSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/roadmap-adapt failed or timed out. Falling back to cached payload.', err);
    return { data: defaultFallback, isLive: false };
  }
}

// Strict Zod schema for /api/rubric-feedback
export const RubricCriterionSchema = z.object({
  name: z.string(),
  score: z.number(),
  max: z.number(),
  evidence: z.string(),
  fix: z.string()
});

export const RubricFeedbackSchema = z.object({
  criteria: z.array(RubricCriterionSchema),
  overall: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  version: z.number().optional()
});

export type RubricCriterion = z.infer<typeof RubricCriterionSchema>;
export type RubricFeedback = z.infer<typeof RubricFeedbackSchema>;

export async function evaluateRubricFeedback(
  params: {
    challengeId: string;
    submission: {
      projectUrl?: string;
      screenshotUrl?: string;
      writtenExplanation?: string;
      audioTranscript?: string;
      version?: number;
    };
  },
  isOfflineDemo: boolean = false
): Promise<{ data: RubricFeedback; isLive: boolean }> {
  const version = params.submission.version || 1;
  const isComm = params.challengeId === 'challenge-comm-intro';

  const defaultFeedback: RubricFeedback = isComm
    ? (version === 1
        ? {
            criteria: [
              {
                name: 'Clarity & Articulation',
                score: 20,
                max: 25,
                evidence: "Spoken delivery is distinct and clear in bilingual Tamil and English, with pleasant greeting ('வணக்கம்').",
                fix: "Eliminate hesitant conversational fillers ('umm', 'basically') in the opening 10 seconds."
              },
              {
                name: 'Relevant Skills & Evidence Citation',
                score: 16,
                max: 30,
                evidence: "Self-identifies as aspiring frontend engineer and tailor, but does not cite any verified rubric scores or project evidence.",
                fix: "Explicitly cite verified SkillBridge proof: 'I scored 92% on responsive CSS and built a live e-commerce catalog for Salem weavers'."
              },
              {
                name: 'Professional Warmth & Cultural Respect',
                score: 21,
                max: 25,
                evidence: "Courteous tone with respectful greeting and confident enthusiasm for local technology solutions.",
                fix: "State in 1 sentence how your technical and craft skills solve real problems for local enterprises or users."
              },
              {
                name: 'Brevity & Actionable Closing',
                score: 15,
                max: 20,
                evidence: "Pitch ran for 62 seconds, exceeding the recommended 45-second target window.",
                fix: "Condense conversational background and end with a crisp call to action: 'I am ready for a frontend engineering apprenticeship in Tamil Nadu'."
              }
            ],
            overall: 72,
            strengths: [
              "Warm, respectful bilingual opening with clear Tamil pronunciation",
              "Demonstrates genuine enthusiasm for craftsmanship and digital products"
            ],
            improvements: [
              "Cite concrete verified rubric scores (92% CSS proof) rather than vague self-ratings",
              "Keep duration strictly under 45 seconds for recruiter screening",
              "Conclude with a specific, actionable career objective"
            ],
            version: 1
          }
        : {
            criteria: [
              {
                name: 'Clarity & Articulation',
                score: 25,
                max: 25,
                evidence: "Crisp 38-second bilingual articulation with zero filler sounds, perfect pacing, and confident projection.",
                fix: "None needed; articulation and cadence are recruiter-ready."
              },
              {
                name: 'Relevant Skills & Evidence Citation',
                score: 28,
                max: 30,
                evidence: "Directly cited: 'I hold verified 92% rubric proof in semantic HTML and responsive CSS, and built an e-commerce catalog for Salem weavers.'",
                fix: "Exemplary evidence backing; connects verifiable proof directly to employer need."
              },
              {
                name: 'Professional Warmth & Cultural Respect',
                score: 25,
                max: 25,
                evidence: "Respectful bilingual greeting ('வணக்கம், I am Priya from Salem') with genuine passion for civic technology.",
                fix: "None needed; demonstrates cultural empathy and polished professional presence."
              },
              {
                name: 'Brevity & Actionable Closing',
                score: 18,
                max: 20,
                evidence: "Finished in exactly 38 seconds with a clear closing: 'I am actively seeking a junior frontend internship in Chennai or remote.'",
                fix: "Superb closing timing; respects interviewer schedule."
              }
            ],
            overall: 96,
            strengths: [
              "Mastered 38-second high-density elevator pitch with zero filler words",
              "Evidence-backed skill claim citing verified 92% rubric proof",
              "Strong cultural grounding and clear civic motivation"
            ],
            improvements: [
              "Fully validated; ready for live recruiter and mentor viva presentations"
            ],
            version: 2
          })
    : (version === 1
        ? {
            criteria: [
              {
                name: 'Semantic Landmarks & Accessibility',
                score: 21,
                max: 25,
                evidence: "Found <header role='banner'> and <main id='content'>. Skip link present but missing visible focus ring.",
                fix: "Add :focus-visible { outline: 3px solid #B8761A; outline-offset: 2px; } to the skip-to-content anchor tag."
              },
              {
                name: 'Responsive Grid & Flexbox Scaling',
                score: 20,
                max: 30,
                evidence: "Flex container used for profile cards, but rigid 'width: 480px' causes layout break on narrow displays.",
                fix: "Replace fixed width with 'flex: 1 1 280px' and add 'min-width: 0' to prevent child elements from expanding beyond parent container."
              },
              {
                name: 'Mobile Viewport & Zero Horizontal Overflow',
                score: 16,
                max: 25,
                evidence: "Horizontal scrollbar triggered on 320px viewport emulation due to 'min-width: 360px' on card inner wrapper.",
                fix: "Remove 'min-width: 360px'; use 'max-width: 100%' and fluid padding 'clamp(12px, 3vw, 24px)'."
              },
              {
                name: 'Focus Visible & High Contrast',
                score: 17,
                max: 20,
                evidence: "Primary headings pass 7:1 contrast. Secondary bio text '#999' on parchment has contrast ratio of 3.2:1 (fails WCAG AA 4.5:1).",
                fix: "Darken secondary text color token to '#5C4033' or '#4A3B32' to guarantee >= 5:1 contrast."
              }
            ],
            overall: 74,
            strengths: [
              "Clean landmark hierarchy without redundant <div> wrappers",
              "Relative REM units used consistently for headings and icons"
            ],
            improvements: [
              "Eliminate horizontal scrollbar on 320px mobile viewport caused by rigid min-width",
              "Upgrade secondary text contrast ratio from 3.2:1 to >= 4.5:1",
              "Make flex child elements fluid using flex: 1 1 280px and min-width: 0"
            ],
            version: 1
          }
        : {
            criteria: [
              {
                name: 'Semantic Landmarks & Accessibility',
                score: 25,
                max: 25,
                evidence: "Accessible skip-link has high-contrast 3px gold focus ring. Landmark tree is complete with ARIA landmarks.",
                fix: "None needed; landmark accessibility is production ready."
              },
              {
                name: 'Responsive Grid & Flexbox Scaling',
                score: 29,
                max: 30,
                evidence: "Fluid flex layout with repeat(auto-fit, minmax(280px, 1fr)) and flex: 1 1 280px scales flawlessly without layout shift.",
                fix: "Optional: add container queries for ultra-wide widescreen monitors."
              },
              {
                name: 'Mobile Viewport & Zero Horizontal Overflow',
                score: 25,
                max: 25,
                evidence: "Verified 0 horizontal overflow across 320px, 375px, 768px, and 1280px viewport tests.",
                fix: "None needed; flawless mobile viewport containment."
              },
              {
                name: 'Focus Visible & High Contrast',
                score: 19,
                max: 20,
                evidence: "All text tokens exceed 5.4:1 contrast ratio. Visible :focus-visible styling on all interactive elements.",
                fix: "Optional: add subtle transition on focus ring appearance."
              }
            ],
            overall: 98,
            strengths: [
              "Eliminated 320px mobile overflow; cards scale smoothly with clamp() and minmax()",
              "Exemplary keyboard navigation with visible focus rings",
              "High-contrast WCAG 2.1 AA certified color tokens across light and dark modes"
            ],
            improvements: [
              "Consider adding subtle micro-interaction transitions on active button states"
            ],
            version: 2
          });

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 900));
    return { data: defaultFeedback, isLive: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('/api/rubric-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = RubricFeedbackSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/rubric-feedback failed or timed out. Falling back to cached payload.', err);
    return { data: defaultFeedback, isLive: false };
  }
}

// Strict Zod schemas for /api/viva
export const VivaQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  questionTamil: z.string().optional(),
  context: z.string().optional()
});

export const VivaGenerateQuestionsResponseSchema = z.object({
  questions: z.array(VivaQuestionSchema)
});

export const VivaScoreAnswerResponseSchema = z.object({
  score: z.number(),
  note: z.string()
});

export type VivaQuestion = z.infer<typeof VivaQuestionSchema>;
export type VivaGenerateQuestionsResponse = z.infer<typeof VivaGenerateQuestionsResponseSchema>;
export type VivaScoreAnswerResponse = z.infer<typeof VivaScoreAnswerResponseSchema>;

/**
 * Call /api/viva to generate 3 questions tailored to learner's own submitted work
 */
export async function generateVivaQuestions(
  params: {
    challengeId: string;
    submission?: {
      projectUrl?: string;
      screenshotUrl?: string;
      writtenExplanation?: string;
      audioTranscript?: string;
    };
  },
  isOfflineDemo: boolean = false
): Promise<{ data: VivaGenerateQuestionsResponse; isLive: boolean }> {
  const challengeId = params.challengeId;

  // Curated fallbacks matching distinct challenge pathways
  let fallbackQuestions: VivaQuestion[] = [];
  if (challengeId === 'challenge-comm-intro' || challengeId.includes('comm')) {
    fallbackQuestions = [
      {
        id: 'q1',
        question: 'Why did you choose to cite your verified 92% rubric score instead of general credentials?',
        questionTamil: 'பொதுவான தகுதிக்குப் பதிலாக 92% சரிபார்க்கப்பட்ட மதிப்பெண்ணை ஏன் குறிப்பிட்டீர்கள்?',
        context: 'Inspects your evidence-based pitch strategy.'
      },
      {
        id: 'q2',
        question: 'How did you structure the 40-second pacing between greeting, skills, and the closing ask?',
        questionTamil: '40 வினாடிகளுக்குள் வாழ்த்து, திறன்கள், மற்றும் வாய்ப்பு கேட்பதை எவ்வாறு அமைத்தீர்கள்?',
        context: 'Examines your information density and elevator pitch cadence.'
      },
      {
        id: 'q3',
        question: "Why is beginning with a culturally respectful Tamil greeting like 'வணக்கம்' impactful for local employers?",
        questionTamil: "'வணக்கம்' போன்ற மரியாதையான அறிமுகம் உள்ளூர் நிறுவனங்களிடம் ஏற்படுத்தும் தாக்கம் என்ன?",
        context: 'Verifies cultural warmth and civic connection in your communication.'
      }
    ];
  } else if (
    challengeId.includes('tailor') ||
    challengeId.includes('garment') ||
    challengeId.includes('stitch') ||
    challengeId.includes('katori')
  ) {
    fallbackQuestions = [
      {
        id: 'q1',
        question: 'Why did you select a 1.5-inch ease allowance for the chest and armhole curve?',
        questionTamil: 'மார்பு மற்றும் கைவளைவுக்கு 1.5 அங்குல தளர்வு அளவை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        context: 'Verifies your pattern ease calculation for breathing room and drape.'
      },
      {
        id: 'q2',
        question: 'How did you check stitch balance at 10 stitches per inch to avoid seam puckering?',
        questionTamil: 'தையல் சுருக்கம் ஏற்படாமல் இருக்க 10 தையல் அடர்த்தியை எவ்வாறு சோதித்தீர்கள்?',
        context: 'Evaluates needle thread tension calibration on the bobbin.'
      },
      {
        id: 'q3',
        question: 'What method did you use to cut the bias binding tape at an exact 45-degree angle?',
        questionTamil: 'கழுத்து பைப்பிங் நாடாவை சரியான 45 பாகை கோணத்தில் எவ்வாறு வெட்டினீர்கள்?',
        context: 'Confirms true bias fabric stretch for smooth curved necklines.'
      }
    ];
  } else if (challengeId.includes('electric') || challengeId.includes('wire') || challengeId.includes('earthing')) {
    fallbackQuestions = [
      {
        id: 'q1',
        question: 'Why is earth resistance testing with a Megger fall-of-potential test required below 5 ohms?',
        questionTamil: 'புவித் தொடுப்பு மின்தடை 5 ஓம்களுக்கு குறைவாக இருக்க வேண்டும் என்று ஏன் சோதிக்கப்படுகிறது?',
        context: 'Tests compliance with IS 3043 grounding standards.'
      },
      {
        id: 'q2',
        question: 'How did you ensure phase, neutral, and earth wires strictly adhere to IS 5216 color codes?',
        questionTamil: 'மின் கம்பிகளின் வண்ணக் குறியீடுகள் IS 5216 விதிகளுக்கு உட்பட்டு இருப்பதை எவ்வாறு உறுதி செய்தீர்கள்?',
        context: 'Inspects safety wiring color verification.'
      },
      {
        id: 'q3',
        question: 'What safety isolation steps did you follow before tightening terminal connections?',
        questionTamil: 'இணைப்புகளை இறுக்கும் முன் என்ன பாதுகாப்பு நடைமுறைகளைப் பின்பற்றினீர்கள்?',
        context: 'Validates LOTO and de-energized line testing protocol.'
      }
    ];
  } else {
    fallbackQuestions = [
      {
        id: 'q1',
        question: 'Why did you choose flex over grid for the header and navigation links?',
        questionTamil: 'தலைப்பு மற்றும் வழிசெலுத்தல் இணைப்புகளுக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        context: 'Inspects your 1D vs 2D layout choice in the header.'
      },
      {
        id: 'q2',
        question: "How did you ensure the profile layout doesn't horizontally scroll on a 320px mobile viewport?",
        questionTamil: '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல் இருக்க என்ன செய்தீர்கள்?',
        context: 'Examines your clamp() and fluid flex-basis implementation.'
      },
      {
        id: 'q3',
        question: 'What role does the visible :focus-visible skip-link play for accessibility and screen reader users?',
        questionTamil: 'விசைப்பலகை வழிசெலுத்தலில் skip-link இணைப்பின் முக்கிய பங்கு என்ன?',
        context: 'Tests your understanding of WCAG 2.1 AA keyboard accessibility.'
      }
    ];
  }

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 600));
    return { data: { questions: fallbackQuestions }, isLive: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/viva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_questions',
        challengeId: params.challengeId,
        submission: params.submission
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = VivaGenerateQuestionsResponseSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/viva failed or timed out. Falling back to cached payload.', err);
    return { data: { questions: fallbackQuestions }, isLive: false };
  }
}

/**
 * Call /api/viva to score individual learner viva answer for understanding
 */
export async function scoreVivaAnswer(
  params: {
    challengeId: string;
    questionId: string;
    questionText: string;
    answer: string;
    language?: string;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: VivaScoreAnswerResponse; isLive: boolean }> {
  const answer = (params.answer || '').trim();
  const lower = answer.toLowerCase();

  // Natural evaluation logic fallback
  const isVague =
    lower.length < 15 ||
    lower.includes("don't know") ||
    lower.includes('dunno') ||
    lower.includes('copied') ||
    lower.includes('no idea');

  const fallbackScore: VivaScoreAnswerResponse = isVague
    ? {
        score: 55,
        note: 'Response lacks specific architectural or technical reasoning from your submitted work.'
      }
    : {
        score: 92,
        note: 'Demonstrates authentic understanding of architectural decisions, trade-offs, and implementation.'
      };

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 600));
    return { data: fallbackScore, isLive: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/viva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'score_answer',
        challengeId: params.challengeId,
        questionId: params.questionId,
        questionText: params.questionText,
        answer: params.answer,
        language: params.language
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = VivaScoreAnswerResponseSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/viva (score_answer) failed. Falling back to diagnostic scorer.', err);
    return { data: fallbackScore, isLive: false };
  }
}

// ============================================================================
// /api/interview-score schema and service
// ============================================================================
export const InterviewScoreResponseSchema = z.object({
  clarity: z.number(),
  confidence: z.number(),
  relevance: z.number(),
  overallScore: z.number().default(85),
  paceWpm: z.number(),
  fillerWordCount: z.number(),
  matchedFillers: z.array(z.string()).optional(),
  tips: z.array(z.string()),
  disclaimer: z.string().optional(),
});

export type InterviewScoreResponse = z.infer<typeof InterviewScoreResponseSchema>;

export interface InterviewScoreRequest {
  roleId: string;
  roleTitle: string;
  question: string;
  transcript: string;
  language: 'en' | 'ta' | 'hi';
  durationSeconds: number;
}

export async function scoreInterviewTranscript(
  params: InterviewScoreRequest,
  isOfflineDemo: boolean = false
): Promise<{ data: InterviewScoreResponse; isLive: boolean }> {
  const words = (params.transcript || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationMin = Math.max(0.2, (params.durationSeconds || 30) / 60);
  const paceWpm = Math.round(wordCount / durationMin);

  // Fallback calculation for offline / resilience
  const fallbackScore: InterviewScoreResponse = {
    clarity: wordCount < 10 ? 68 : 88,
    confidence: 84,
    relevance: 90,
    overallScore: 87,
    paceWpm: paceWpm || 122,
    fillerWordCount: Math.max(1, Math.min(4, Math.round(wordCount * 0.05))),
    matchedFillers: ['um', 'like'],
    tips: [
      `Pacing (${paceWpm || 122} WPM): Maintained an accessible conversational rhythm close to the 120 WPM benchmark.`,
      "Linguistic Clarity: Aim to replace filler sounds with a deliberate 1-second pause before introducing technical tradeoffs.",
      `Evidence Citation: Strengthen your response for ${params.roleTitle} by mentioning your verified rubric score and hands-on portfolio proof.`
    ],
    disclaimer: 'Confidence scoring is derived strictly from linguistic transcript structure and assertive vocabulary. It is not a psychological assessment or judgment of the person.'
  };

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 750));
    return { data: fallbackScore, isLive: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/interview-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    const validated = InterviewScoreResponseSchema.parse(json);
    return { data: validated, isLive: true };
  } catch (err) {
    console.warn('API call to /api/interview-score failed. Falling back to diagnostic scorer.', err);
    return { data: fallbackScore, isLive: false };
  }
}




