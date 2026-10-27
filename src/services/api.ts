import { z } from 'zod';
import { Language, Persona } from '../types';
import i18n from '../i18n';
import {
  extractJobDescriptionWithGemini,
  getGeminiCoachAnswer,
  isGeminiConfigured,
  scoreInterviewWithGemini
} from './gemini';

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
 * Localize JD extract payload soft skills and eligibility for chosen language
 */
function localizeJdPayload(payload: JdExtractPayload, lang: Language): JdExtractPayload {
  if (lang === 'ta') {
    return {
      ...payload,
      softSkills: [
        "இருமொழி தொடர்புத் திறன் (தமிழ் / ஆங்கிலம்)",
        "வடிவமைப்பு நுணுக்கங்களில் துல்லியம்",
        "குறியீட்டு முடிவுகளை விவரிக்கும் திறன்"
      ],
      eligibility: [
        "டிப்ளமோ அல்லது BCA / B.Sc / B.E. பட்டதாரி (அல்லது சுயகற்றல் சான்று)",
        "கல்லூரி அடுக்குக்கு பதிலாக சான்றளிக்கப்பட்ட போர்ட்ஃபோலியோ முன்னுரிமை",
        "சென்னை ஹைபிரிட் அல்லது மாவட்ட அளவிலான தொலைதூரப் பணி"
      ]
    };
  }
  if (lang === 'fr') {
    return {
      ...payload,
      softSkills: [
        "Communication bilingue claire et professionnelle",
        "Sens du détail et fidélité au design",
        "Capacité à expliquer ses choix techniques lors des revues de code"
      ],
      eligibility: [
        "Diplôme universitaire ou équivalent autodidacte vérifiable",
        "Portfolio prouvé par des réalisations concrètes priorisé",
        "Travail hybride ou à distance"
      ]
    };
  }
  if (lang === 'hi') {
    return {
      ...payload,
      softSkills: [
        "द्विभाषी संचार और टीम समन्वय",
        "डिजाइन विवरण और सटीकता पर ध्यान",
        "कोड समीक्षा में तकनीकी निर्णयों को समझाने की क्षमता"
      ],
      eligibility: [
        "डिप्लोमा, बीसीए, बी.एससी, बी.ई. या समकक्ष स्व-अध्ययन प्रमाण",
        "कॉलेज टियर के बजाय सत्यापित प्रोजेक्ट पोर्टफोलियो को प्राथमिकता",
        "हाइब्रिड या दूरस्थ कार्य विकल्प"
      ]
    };
  }
  return payload;
}

/**
 * Call /api/jd-extract or fall back to cached validated response
 */
export async function extractJobDescription(
  jdText: string,
  isOfflineDemo: boolean = true,
  language?: Language
): Promise<{ data: JdExtractPayload; isLive: boolean }> {
  const currentLang: Language = language || (i18n.language as Language) || 'en';

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
    const validated = JdExtractSchema.parse(localizeJdPayload(sample, currentLang));
    return { data: validated, isLive: false };
  }

  // Attempt live API proxy call
  try {
    if (isGeminiConfigured) {
      const data = await extractJobDescriptionWithGemini(jdText, currentLang);
      return { data, isLive: true };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout rule

    const response = await fetch('/api/jd-extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jdText, language: currentLang }),
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
    const validated = JdExtractSchema.parse(localizeJdPayload(fallback, currentLang));
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
    language?: Language;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: RoadmapAdaptResponse; isLive: boolean }> {
  const currentLang: Language = params.language || (i18n.language as Language) || 'en';
  const score = params.quizScore !== undefined ? params.quizScore : 40;
  const topic = params.quizTopic || 'Flexbox';

  const localizedDetails: Record<Language, {
    title: string;
    titleTamil: string;
    activity: string;
    whyThisStep: string;
    overview: string;
    overviewTamil: string;
    transcript: string;
    transcriptTamil: string;
    prompt: string;
    takeaways: string[];
    changelog: string;
    reasoning: string;
  }> = {
    en: {
      title: 'CSS Layout Practice',
      titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      activity: 'Targeted Flexbox sandbox: alignment, axis orientation, and auto-fit responsive patterns.',
      whyThisStep: `Added because you scored ${score}% on ${topic}. Reinforces alignment fundamentals before starting production projects.`,
      overview: 'This targeted practice module reinforces Flexbox alignment, cross-axis distribution, and responsive fluid layouts without media queries.',
      overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
      transcript: 'Welcome to CSS Layout Practice. Let us master Flexbox main and cross axes with interactive hands-on drills.',
      transcriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
      prompt: 'Build a 3-item navigation bar using justify-content: space-between and align-items: center.',
      takeaways: [
        'flex-direction: row sets main axis horizontal; align-items aligns vertical cross axis.',
        'justify-content: space-between spaces child items across main axis.',
        'flex: 1 1 auto allows fluid expansion without overflow.'
      ],
      changelog: `Added remedial practice because you scored ${score}% on ${topic}`,
      reasoning: `Diagnostic score of ${score}% indicates need for foundational Flexbox alignment drills.`
    },
    ta: {
      title: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      activity: 'Flexbox பயிற்சி: சீரமைப்பு, அச்சு திசை மற்றும் தானியங்கி பதிலளிப்பு முறைகள்.',
      whyThisStep: `${topic} தேர்வில் நீங்கள் ${score}% பெற்றதால் சேர்க்கப்பட்டது. அச்சு சீரமைப்பை வலுப்படுத்துகிறது.`,
      overview: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
      overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
      transcript: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
      transcriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
      prompt: 'justify-content: space-between மற்றும் align-items: center பயன்படுத்தி 3-உறுப்பு வழிசெலுத்தல் பட்டியை உருவாக்கவும்.',
      takeaways: [
        'flex-direction: row முதன்மை அச்சை கிடைமட்டமாக்குகிறது; align-items செங்குத்து அச்சை சீரமைக்கிறது.',
        'justify-content: space-between உறுப்புகளுக்கு இடையே சம இடைவெளி அமைக்கிறது.',
        'flex: 1 1 auto வழிதல் இன்றி இயல்பான விரிவை அனுமதிக்கிறது.'
      ],
      changelog: `${topic} தேர்வில் ${score}% பெற்றதால் சிறப்புப் பயிற்சி சேர்க்கப்பட்டது`,
      reasoning: `${score}% மதிப்பெண் அடிப்படை Flexbox பயிற்சி அவசியத்தை காட்டுகிறது.`
    },
    fr: {
      title: 'Pratique de mise en page CSS',
      titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      activity: 'Atelier ciblé Flexbox : alignement, orientation des axes et motifs réactifs auto-fit.',
      whyThisStep: `Ajouté car votre score est de ${score}% sur ${topic}. Renforce les fondamentaux d'alignement.`,
      overview: 'Ce module ciblé renforce l\'alignement Flexbox, la distribution transversale et les mises en page fluides.',
      overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
      transcript: 'Bienvenue dans la pratique Flexbox. Maîtrisons les axes principal et transversal avec des exercices.',
      transcriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
      prompt: 'Créez une barre de navigation à 3 éléments avec justify-content: space-between et align-items: center.',
      takeaways: [
        'flex-direction: row définit l\'axe principal horizontal ; align-items gère l\'axe transversal.',
        'justify-content: space-between espace harmonieusement les éléments enfants.',
        'flex: 1 1 auto permet une expansion fluide sans débordement.'
      ],
      changelog: `Module de rattrapage ajouté suite au score de ${score}% sur ${topic}`,
      reasoning: `Le score diagnostic de ${score}% indique un besoin d'exercices d'alignement Flexbox.`
    },
    hi: {
      title: 'CSS लेआउट विशेष अभ्यास',
      titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
      activity: 'लक्षित Flexbox अभ्यास: अलाइनमेंट, अक्ष ओरिएंटेशन और ऑटो-फिट रिस्पॉन्सिव पैटर्न।',
      whyThisStep: `${topic} पर आपका स्कोर ${score}% होने के कारण जोड़ा गया। बुनियादी अलाइनमेंट को मजबूत करता है।`,
      overview: 'यह मॉड्यूल Flexbox अलाइनमेंट, क्रॉस-अक्ष वितरण और फ्लुइड लेआउट को सुदृढ़ करता है।',
      overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
      transcript: 'CSS लेआउट अभ्यास में आपका स्वागत है। आइए Flexbox अक्षों पर व्यावहारिक अभ्यास करें।',
      transcriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
      prompt: 'justify-content: space-between और align-items: center का उपयोग करके 3-आइटम नेवबार बनाएं।',
      takeaways: [
        'flex-direction: row मुख्य अक्ष को क्षैतिज करता है; align-items ऊर्ध्वाधर अक्ष को संरेखित करता है।',
        'justify-content: space-between चाइल्ड आइटम्स को मुख्य अक्ष पर समान दूरी देता है।',
        'flex: 1 1 auto बिना ओवरफ्लो के सहज विस्तार प्रदान करता है।'
      ],
      changelog: `${topic} पर ${score}% स्कोर के कारण सुधारात्मक अभ्यास जोड़ा गया`,
      reasoning: `${score}% का नैदानिक स्कोर बुनियादी Flexbox अलाइनमेंट अभ्यास की आवश्यकता दर्शाता है।`
    }
  };

  const chosen = localizedDetails[currentLang] || localizedDetails.en;

  const defaultFallback: RoadmapAdaptResponse = {
    action: 'insert_node',
    insertedNode: {
      id: `remedial-css-layout-${Date.now()}`,
      stepNumber: 2.5,
      title: chosen.title,
      titleTamil: chosen.titleTamil,
      activity: chosen.activity,
      timeEstimate: '35 mins',
      whyThisStep: chosen.whyThisStep,
      status: 'adaptive_remedial',
      adaptiveReason: chosen.changelog,
      lessonContent: {
        overview: chosen.overview,
        overviewTamil: chosen.overviewTamil,
        keyTakeaways: chosen.takeaways,
        audioTranscript: chosen.transcript,
        audioTranscriptTamil: chosen.transcriptTamil,
        handsOnPrompt: chosen.prompt
      }
    },
    changelogEntry: chosen.changelog,
    reasoning: chosen.reasoning
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
      body: JSON.stringify({ ...params, language: currentLang }),
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
    language?: Language;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: RubricFeedback; isLive: boolean }> {
  const currentLang: Language = params.language || (i18n.language as Language) || 'en';
  const version = params.submission.version || 1;
  const isComm = params.challengeId === 'challenge-comm-intro';

  const localizedCommStrengths: Record<Language, string[]> = {
    en: [
      "Warm, respectful bilingual opening with clear Tamil pronunciation",
      "Demonstrates genuine enthusiasm for craftsmanship and digital products"
    ],
    ta: [
      "தெளிவான உச்சரிப்புடன் கூடிய மரியாதையான தொடக்கம்",
      "தொழில்நுட்பம் மற்றும் கைவினைக் கலை மீதான உண்மையான ஆர்வம்"
    ],
    fr: [
      "Ouverture chaleureuse et respectueuse avec une élocution nette",
      "Enthousiasme manifeste pour l'artisanat et les produits numériques"
    ],
    hi: [
      "स्पष्ट उच्चारण के साथ सम्मानजनक और आत्मविश्वास से भरी शुरुआत",
      "शिल्पकला और डिजिटल उत्पादों के प्रति वास्तविक उत्साह"
    ]
  };

  const localizedCommImprovements: Record<Language, string[]> = {
    en: [
      "Cite concrete verified rubric scores (92% CSS proof) rather than vague self-ratings",
      "Keep duration strictly under 45 seconds for recruiter screening",
      "Conclude with a specific, actionable career objective"
    ],
    ta: [
      "பொதுவான கூற்றுக்கு பதிலாக சரிபார்க்கப்பட்ட மதிப்பெண்களை (92% CSS சான்று) குறிப்பிடவும்",
      "45 வினாடிகளுக்குள் பேச்சை முடிக்கவும்",
      "தெளிவான தொழில் இலக்குடன் முடிக்கவும்"
    ],
    fr: [
      "Citez des scores vérifiés de grille d'évaluation (ex: preuve CSS 92%) plutôt que des auto-évaluations",
      "Maintenez la durée strictement sous 45 secondes pour le tri recruteur",
      "Concluez par un objectif professionnel clair et précis"
    ],
    hi: [
      "सामान्य दावों के बजाय ठोस सत्यापित रूब्रिक स्कोर (92% CSS प्रमाण) का उल्लेख करें",
      "अवधि को 45 सेकंड के भीतर सीमित रखें",
      "एक स्पष्ट और केंद्रित करियर लक्ष्य के साथ समापन करें"
    ]
  };

  const localizedTechStrengths: Record<Language, string[]> = {
    en: [
      "Eliminated 320px mobile overflow; cards scale smoothly with clamp() and minmax()",
      "Exemplary keyboard navigation with visible focus rings",
      "High-contrast WCAG 2.1 AA certified color tokens across light and dark modes"
    ],
    ta: [
      "320 பிக்சல் மொபைல் வழிதல் நீக்கப்பட்டது; அட்டைகள் சீராக அளவிடப்படுகின்றன",
      "தெளிவான ஃபோகஸ் வளையங்களுடன் கூடிய சிறந்த விசைப்பலகை வழிசெலுத்தல்",
      "WCAG 2.1 AA தரநிலைக்கு ஏற்ப உயர் மாறுபட்ட வண்ண அமைப்புகள்"
    ],
    fr: [
      "Suppression du débordement mobile à 320px ; cartes fluides avec clamp() et minmax()",
      "Navigation au clavier exemplaire avec anneaux de focus visibles",
      "Jetons de couleurs certifiés WCAG 2.1 AA à fort contraste"
    ],
    hi: [
      "320px मोबाइल ओवरफ्लो समाप्त किया गया; कार्ड clamp() और minmax() के साथ सुचारू रूप से स्केल होते हैं",
      "दिखने वाले फोकस रिंग्स के साथ अनुकरणीय कीबोर्ड नेविगेशन",
      "लाइट और डार्क मोड में उच्च-कंट्रास्ट WCAG 2.1 AA प्रमाणित रंग टोकन"
    ]
  };

  const localizedTechImprovements: Record<Language, string[]> = {
    en: [
      "Consider adding subtle micro-interaction transitions on active button states"
    ],
    ta: [
      "செயல்பாட்டு பொத்தான் நிலைகளில் மென்மையான அனிமேஷன்களைச் சேர்க்கலாம்"
    ],
    fr: [
      "Envisagez d'ajouter de subtiles micro-animations sur les états de boutons actifs"
    ],
    hi: [
      "सक्रिय बटन स्थितियों पर सूक्ष्म माइक्रो-इंटरैक्शन ट्रांज़िशन जोड़ने पर विचार करें"
    ]
  };

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
            strengths: localizedCommStrengths[currentLang] || localizedCommStrengths.en,
            improvements: localizedCommImprovements[currentLang] || localizedCommImprovements.en,
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
            strengths: localizedCommStrengths[currentLang] || localizedCommStrengths.en,
            improvements: [
              currentLang === 'ta'
                ? "முழுமையாக சரிபார்க்கப்பட்டது; நேரடி நேர்காணலுக்கு தயார் நிலை"
                : currentLang === 'fr'
                ? "Totalement validé ; prêt pour les entretiens de recrutement"
                : currentLang === 'hi'
                ? "पूरी तरह से मान्य; लाइव भर्ती साक्षात्कारों के लिए तैयार"
                : "Fully validated; ready for live recruiter and mentor viva presentations"
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
                fix: "Add :focus-visible { outline: 3px solid #62B6E8; outline-offset: 2px; } to the skip-to-content anchor tag."
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
                evidence: "Primary headings pass 7:1 contrast. Secondary bio text '#999' on white surface has contrast ratio of 3.2:1 (fails WCAG AA 4.5:1).",
                fix: "Darken secondary text color token to '#526174' or '#173B67' to guarantee >= 5:1 contrast."
              }
            ],
            overall: 74,
            strengths: localizedTechStrengths[currentLang] || localizedTechStrengths.en,
            improvements: localizedTechImprovements[currentLang] || localizedTechImprovements.en,
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
            strengths: localizedTechStrengths[currentLang] || localizedTechStrengths.en,
            improvements: localizedTechImprovements[currentLang] || localizedTechImprovements.en,
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
      body: JSON.stringify({ ...params, language: currentLang }),
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
    language?: Language;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: VivaGenerateQuestionsResponse; isLive: boolean }> {
  const currentLang: Language = params.language || (i18n.language as Language) || 'en';
  const challengeId = params.challengeId;

  // Curated fallbacks matching distinct challenge pathways
  let fallbackQuestions: VivaQuestion[] = [];
  if (challengeId === 'challenge-comm-intro' || challengeId.includes('comm')) {
    fallbackQuestions = [
      {
        id: 'q1',
        question:
          currentLang === 'ta'
            ? 'பொதுவான தகுதிக்குப் பதிலாக 92% சரிபார்க்கப்பட்ட மதிப்பெண்ணை ஏன் குறிப்பிட்டீர்கள்?'
            : currentLang === 'fr'
            ? 'Pourquoi avoir choisi de citer votre score de 92% certifié plutôt que des diplômes généraux ?'
            : currentLang === 'hi'
            ? 'सामान्य क्रेडेंशियल्स के बजाय आपने अपने सत्यापित 92% रूब्रिक स्कोर को क्यों चुना?'
            : 'Why did you choose to cite your verified 92% rubric score instead of general credentials?',
        questionTamil: 'பொதுவான தகுதிக்குப் பதிலாக 92% சரிபார்க்கப்பட்ட மதிப்பெண்ணை ஏன் குறிப்பிட்டீர்கள்?',
        context: 'Inspects your evidence-based pitch strategy.'
      },
      {
        id: 'q2',
        question:
          currentLang === 'ta'
            ? '40 வினாடிகளுக்குள் வாழ்த்து, திறன்கள், மற்றும் வாய்ப்பு கேட்பதை எவ்வாறு அமைத்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Comment avez-vous structuré le rythme de 40 secondes entre salutation, compétences et conclusion ?'
            : currentLang === 'hi'
            ? 'आपने अभिवादन, कौशल और अंतिम मांग के बीच 40-सेकंड की गति को कैसे संरचित किया?'
            : 'How did you structure the 40-second pacing between greeting, skills, and the closing ask?',
        questionTamil: '40 வினாடிகளுக்குள் வாழ்த்து, திறன்கள், மற்றும் வாய்ப்பு கேட்பதை எவ்வாறு அமைத்தீர்கள்?',
        context: 'Examines your information density and elevator pitch cadence.'
      },
      {
        id: 'q3',
        question:
          currentLang === 'ta'
            ? "'வணக்கம்' போன்ற மரியாதையான அறிமுகம் உள்ளூர் நிறுவனங்களிடம் ஏற்படுத்தும் தாக்கம் என்ன?"
            : currentLang === 'fr'
            ? "Quel impact apporte une salutation respectueuse et authentique auprès des employeurs régionaux ?"
            : currentLang === 'hi'
            ? "'नमस्ते' जैसे सांस्कृतिक रूप से सम्मानजनक अभिवादन का स्थानीय नियोक्ताओं पर क्या प्रभाव पड़ता है?"
            : "Why is beginning with a culturally respectful Tamil greeting like 'வணக்கம்' impactful for local employers?",
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
        question:
          currentLang === 'ta'
            ? 'மார்பு மற்றும் கைவளைவுக்கு 1.5 அங்குல தளர்வு அளவை ஏன் தேர்ந்தெடுத்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Pourquoi avoir choisi une aisance de 1,5 pouce pour la courbe de poitrine et d\'emmanchure ?'
            : currentLang === 'hi'
            ? 'आपने छाती और आर्महोल वक्र के लिए 1.5 इंच की ईज अलाउंस क्यों चुनी?'
            : 'Why did you select a 1.5-inch ease allowance for the chest and armhole curve?',
        questionTamil: 'மார்பு மற்றும் கைவளைவுக்கு 1.5 அங்குல தளர்வு அளவை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        context: 'Verifies your pattern ease calculation for breathing room and drape.'
      },
      {
        id: 'q2',
        question:
          currentLang === 'ta'
            ? 'தையல் சுருக்கம் ஏற்படாமல் இருக்க 10 தையல் அடர்த்தியை எவ்வாறு சோதித்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Comment avez-vous contrôlé l\'équilibre à 10 points par pouce pour éviter les fronces ?'
            : currentLang === 'hi'
            ? 'सीम सिकुड़न से बचने के लिए आपने 10 टांके प्रति इंच पर सिलाई संतुलन की जांच कैसे की?'
            : 'How did you check stitch balance at 10 stitches per inch to avoid seam puckering?',
        questionTamil: 'தையல் சுருக்கம் ஏற்படாமல் இருக்க 10 தையல் அடர்த்தியை எவ்வாறு சோதித்தீர்கள்?',
        context: 'Evaluates needle thread tension calibration on the bobbin.'
      },
      {
        id: 'q3',
        question:
          currentLang === 'ta'
            ? 'கழுத்து பைப்பிங் நாடாவை சரியான 45 பாகை கோணத்தில் எவ்வாறு வெட்டினீர்கள்?'
            : currentLang === 'fr'
            ? 'Quelle méthode avez-vous utilisée pour couper le biais à un angle exact de 45 degrés ?'
            : currentLang === 'hi'
            ? 'सटीक 45 डिग्री के कोण पर बायस बाइंडिंग टेप काटने के लिए आपने किस विधि का उपयोग किया?'
            : 'What method did you use to cut the bias binding tape at an exact 45-degree angle?',
        questionTamil: 'கழுத்து பைப்பிங் நாடாவை சரியான 45 பாகை கோணத்தில் எவ்வாறு வெட்டினீர்கள்?',
        context: 'Confirms true bias fabric stretch for smooth curved necklines.'
      }
    ];
  } else if (challengeId.includes('electric') || challengeId.includes('wire') || challengeId.includes('earthing')) {
    fallbackQuestions = [
      {
        id: 'q1',
        question:
          currentLang === 'ta'
            ? 'புவித் தொடுப்பு மின்தடை 5 ஓம்களுக்கு குறைவாக இருக்க வேண்டும் என்று ஏன் சோதிக்கப்படுகிறது?'
            : currentLang === 'fr'
            ? 'Pourquoi le test de résistance de terre avec un mégohmmètre doit-il être inférieur à 5 ohms ?'
            : currentLang === 'hi'
            ? 'मेगर फॉल-ऑफ-पोटेंशियल टेस्ट के साथ अर्थ प्रतिरोध 5 ओम से नीचे क्यों आवश्यक है?'
            : 'Why is earth resistance testing with a Megger fall-of-potential test required below 5 ohms?',
        questionTamil: 'புவித் தொடுப்பு மின்தடை 5 ஓம்களுக்கு குறைவாக இருக்க வேண்டும் என்று ஏன் சோதிக்கப்படுகிறது?',
        context: 'Tests compliance with IS 3043 grounding standards.'
      },
      {
        id: 'q2',
        question:
          currentLang === 'ta'
            ? 'மின் கம்பிகளின் வண்ணக் குறியீடுகள் IS 5216 விதிகளுக்கு உட்பட்டு இருப்பதை எவ்வாறு உறுதி செய்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Comment avez-vous assuré la conformité des couleurs de câblage selon les normes de sécurité ?'
            : currentLang === 'hi'
            ? 'आपने कैसे सुनिश्चित किया कि फेज, न्यूट्रल और अर्थ वायर IS 5216 रंग कोड का पालन करते हैं?'
            : 'How did you ensure phase, neutral, and earth wires strictly adhere to IS 5216 color codes?',
        questionTamil: 'மின் கம்பிகளின் வண்ணக் குறியீடுகள் IS 5216 விதிகளுக்கு உட்பட்டு இருப்பதை எவ்வாறு உறுதி செய்தீர்கள்?',
        context: 'Inspects safety wiring color verification.'
      },
      {
        id: 'q3',
        question:
          currentLang === 'ta'
            ? 'இணைப்புகளை இறுக்கும் முன் என்ன பாதுகாப்பு நடைமுறைகளைப் பின்பற்றினீர்கள்?'
            : currentLang === 'fr'
            ? 'Quelles étapes de consignation de sécurité avez-vous suivies avant de serrer les bornes ?'
            : currentLang === 'hi'
            ? 'टर्मिनल कनेक्शन कसने से पहले आपने किन सुरक्षा अलगाव चरणों का पालन किया?'
            : 'What safety isolation steps did you follow before tightening terminal connections?',
        questionTamil: 'இணைப்புகளை இறுக்கும் முன் என்ன பாதுகாப்பு நடைமுறைகளைப் பின்பற்றினீர்கள்?',
        context: 'Validates LOTO and de-energized line testing protocol.'
      }
    ];
  } else {
    fallbackQuestions = [
      {
        id: 'q1',
        question:
          currentLang === 'ta'
            ? 'தலைப்பு மற்றும் வழிசெலுத்தல் இணைப்புகளுக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Pourquoi avoir choisi Flexbox plutôt que Grid pour l\'en-tête et les liens de navigation ?'
            : currentLang === 'hi'
            ? 'हेडर और नेविगेशन लिंक के लिए ग्रिड के बजाय फ्लेक्स को क्यों चुना?'
            : 'Why did you choose flex over grid for the header and navigation links?',
        questionTamil: 'தலைப்பு மற்றும் வழிசெலுத்தல் இணைப்புகளுக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        context: 'Inspects your 1D vs 2D layout choice in the header.'
      },
      {
        id: 'q2',
        question:
          currentLang === 'ta'
            ? '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல் இருக்க என்ன செய்தீர்கள்?'
            : currentLang === 'fr'
            ? 'Comment avez-vous garanti l\'absence de défilement horizontal sur un écran mobile de 320px ?'
            : currentLang === 'hi'
            ? 'आपने यह कैसे सुनिश्चित किया कि प्रोफाइल लेआउट 320px मोबाइल स्क्रीन पर क्षैतिज रूप से स्क्रॉल न हो?'
            : "How did you ensure the profile layout doesn't horizontally scroll on a 320px mobile viewport?",
        questionTamil: '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல் இருக்க என்ன செய்தீர்கள்?',
        context: 'Examines your clamp() and fluid flex-basis implementation.'
      },
      {
        id: 'q3',
        question:
          currentLang === 'ta'
            ? 'விசைப்பலகை வழிசெலுத்தலில் skip-link இணைப்பின் முக்கிய பங்கு என்ன?'
            : currentLang === 'fr'
            ? 'Quel rôle joue le lien skip-link visible pour l\'accessibilité au clavier et les lecteurs d\'écran ?'
            : currentLang === 'hi'
            ? 'एक्सेसिबिलिटी और स्क्रीन रीडर उपयोगकर्ताओं के लिए विज़िबल :focus-visible स्किप-लिंक की क्या भूमिका है?'
            : 'What role does the visible :focus-visible skip-link play for accessibility and screen reader users?',
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
        submission: params.submission,
        language: currentLang
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
    language?: Language;
  },
  isOfflineDemo: boolean = false
): Promise<{ data: VivaScoreAnswerResponse; isLive: boolean }> {
  const currentLang: Language = params.language || (i18n.language as Language) || 'en';
  const answer = (params.answer || '').trim();
  const lower = answer.toLowerCase();

  // Natural evaluation logic fallback
  const isVague =
    lower.length < 15 ||
    lower.includes("don't know") ||
    lower.includes('dunno') ||
    lower.includes('copied') ||
    lower.includes('no idea') ||
    lower.includes('தெரியாது') ||
    lower.includes('पता नहीं');

  const notesVague: Record<Language, string> = {
    en: 'Response lacks specific architectural or technical reasoning from your submitted work.',
    ta: 'உங்கள் பதிலில் சமர்ப்பித்த படைப்பின் குறிப்பிட்ட தொழில்நுட்ப அல்லது கட்டமைப்பு காரணங்கள் போதுமானதாக இல்லை.',
    fr: 'La réponse manque de raisonnement technique ou architectural spécifique issu de votre travail soumis.',
    hi: 'आपके उत्तर में आपके प्रस्तुत कार्य से संबंधित विशिष्ट तकनीकी या संरचनात्मक तर्क की कमी है।'
  };

  const notesAuthentic: Record<Language, string> = {
    en: 'Demonstrates authentic understanding of architectural decisions, trade-offs, and implementation.',
    ta: 'கட்டமைப்பு முடிவுகள், நடைமுறை பரிசீலனைகள் மற்றும் அமலாக்கம் பற்றிய உண்மையான புரிதலை வெளிப்படுத்துகிறது.',
    fr: 'Démontre une compréhension authentique des choix architecturaux, des compromis et de la réalisation.',
    hi: 'संरचनात्मक निर्णयों, तकनीकी ट्रेड-ऑफ और वास्तविक कार्यान्वयन की प्रामाणिक समझ प्रदर्शित करता है।'
  };

  const fallbackScore: VivaScoreAnswerResponse = isVague
    ? {
        score: 55,
        note: notesVague[currentLang] || notesVague.en
      }
    : {
        score: 92,
        note: notesAuthentic[currentLang] || notesAuthentic.en
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
        language: currentLang
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
  language: Language;
  durationSeconds: number;
}

export async function scoreInterviewTranscript(
  params: InterviewScoreRequest,
  isOfflineDemo: boolean = false
): Promise<{ data: InterviewScoreResponse; isLive: boolean }> {
  const currentLang: Language = params.language || (i18n.language as Language) || 'en';
  const words = (params.transcript || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationMin = Math.max(0.2, (params.durationSeconds || 30) / 60);
  const paceWpm = Math.round(wordCount / durationMin);

  const tipsByLanguage: Record<Language, string[]> = {
    en: [
      `Pacing (${paceWpm || 122} WPM): Maintained an accessible conversational rhythm close to the 120 WPM benchmark.`,
      "Linguistic Clarity: Aim to replace filler sounds with a deliberate 1-second pause before introducing technical tradeoffs.",
      `Evidence Citation: Strengthen your response for ${params.roleTitle} by mentioning your verified rubric score and hands-on portfolio proof.`
    ],
    ta: [
      `பேச்சு வேகம் (${paceWpm || 122} WPM): 120 WPM வழிகாட்டுதலுக்கு அருகில் இயல்பான உரையாடல் வேகத்தைக் காட்டியுள்ளது.`,
      "மொழித் தெளிவு: தயக்க ஒலிகளுக்குப் பதிலாக 1 வினாடி அமைதி காத்து தொழில்நுட்ப காரணங்களை முன்வையுங்கள்.",
      `${params.roleTitle} பணிக்கு உங்கள் சரிபார்க்கப்பட்ட மதிப்பெண் மற்றும் செயல்முறை சான்றுகளை குறிப்பிடுவது கூடுதல் பலம் தரும்.`
    ],
    fr: [
      `Débit (${paceWpm || 122} MPM) : Rythme conversationnel fluide proche du repère optimal de 120 mots par minute.`,
      "Clarté linguistique : Remplacez les hésitations par une pause délibérée d'une seconde avant d'aborder les compromis techniques.",
      `Citation de preuves : Renforcez votre réponse pour ${params.roleTitle} en mentionnant votre score certifié et vos projets concrets.`
    ],
    hi: [
      `बोलने की गति (${paceWpm || 122} WPM): 120 WPM मानक के निकट एक सुलभ और संतुलित लय बनाए रखी।`,
      "भाषाई स्पष्टता: तकनीकी पहलुओं को समझाते समय भराव शब्दों की जगह 1 सेकंड का ठहराव लें।",
      `${params.roleTitle} के लिए अपने सत्यापित रूब्रिक स्कोर और हैंड्स-ऑन प्रोजेक्ट प्रमाण का उल्लेख करके उत्तर को मजबूत करें।`
    ]
  };

  const disclaimerByLanguage: Record<Language, string> = {
    en: 'Confidence scoring is derived strictly from linguistic transcript structure and assertive vocabulary. It is not a psychological assessment or judgment of the person.',
    ta: 'நம்பிக்கை மதிப்பீடு உரையின் சொற்கள் மற்றும் வாக்கிய அமைப்பை அடிப்படையாகக் கொண்டது; இது மனித மனோபாவ மதிப்பீடு அல்ல.',
    fr: 'L\'évaluation de confiance repose strictement sur la structure linguistique de la transcription et le vocabulaire affirmatif. Il ne s\'agit pas d\'un jugement psychologique.',
    hi: 'आत्मविश्वास स्कोरिंग विशुद्ध रूप से भाषाई प्रतिलेख संरचना और मुखर शब्दावली पर आधारित है। यह किसी व्यक्ति का मनोवैज्ञानिक मूल्यांकन नहीं है।'
  };

  // Fallback calculation for offline / resilience
  const fallbackScore: InterviewScoreResponse = {
    clarity: wordCount < 10 ? 68 : 88,
    confidence: 84,
    relevance: 90,
    overallScore: 87,
    paceWpm: paceWpm || 122,
    fillerWordCount: Math.max(1, Math.min(4, Math.round(wordCount * 0.05))),
    matchedFillers: ['um', 'like'],
    tips: tipsByLanguage[currentLang] || tipsByLanguage.en,
    disclaimer: disclaimerByLanguage[currentLang] || disclaimerByLanguage.en
  };

  if (isOfflineDemo) {
    await new Promise((res) => setTimeout(res, 750));
    return { data: fallbackScore, isLive: false };
  }

  try {
    if (isGeminiConfigured) {
      const data = await scoreInterviewWithGemini(params);
      return { data, isLive: true };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/interview-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, language: currentLang }),
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

export async function getCoachAnswerLive(
  query: string,
  persona: Persona,
  language: Language,
  isOfflineDemo: boolean
): Promise<{ text: string; isLive: boolean }> {
  if (isOfflineDemo) {
    throw new Error('Live AI Coach is disabled while Offline mode is enabled.');
  }
  if (!isGeminiConfigured) {
    throw new Error('Gemini is not configured. Add VITE_GEMINI_API_KEY to .env.local.');
  }

  return { text: await getGeminiCoachAnswer(query, persona, language), isLive: true };
}
