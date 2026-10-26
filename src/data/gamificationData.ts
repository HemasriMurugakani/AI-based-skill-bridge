export interface LevelDefinition {
  level: number;
  title: string;
  titleTamil: string;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  criteriaDescription: string;
  criteriaDescriptionTamil: string;
  requirements: {
    label: string;
    labelTamil: string;
    met: boolean;
  }[];
}

export interface XpRewardRule {
  action: string;
  actionTamil: string;
  xpPoints: number;
  category: 'proof' | 'viva' | 'mentor' | 'consistency';
  description: string;
}

export interface ActivityVsMasteryPoint {
  week: string;
  activityIndex: number; // 0-100 (effort, time, challenges attempted)
  masteryIndex: number;  // 0-100 (verified rubric score >=75%, viva passed)
  practiceMinutes: number;
  proofsVerified: number;
}

export interface HeatmapDay {
  date: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  weekIndex: number; // 0 to 15
  level: 0 | 1 | 2 | 3; // 0: none, 1: light (15-30m), 2: medium (30-60m), 3: deep proof (60m+)
  minutesSpent: number;
  xpEarned: number;
  taskTitle: string;
  taskTitleTamil?: string;
  proofType?: 'code' | 'photo_qc' | 'viva' | 'practice';
}

export interface CatchUpTask {
  id: string;
  pathwayId: string;
  title: string;
  titleTamil: string;
  question: string;
  questionTamil: string;
  options: string[];
  optionsTamil?: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationTamil: string;
  rewardXp: number;
}

// 1. Explicit Level System (NOT vanity clicks, strictly tied to demonstrated proof)
export const levelDefinitions: LevelDefinition[] = [
  {
    level: 1,
    title: 'Civic Explorer',
    titleTamil: 'தொடக்க ஆய்வாளர்',
    minXp: 0,
    maxXp: 500,
    badgeIcon: '🌱',
    criteriaDescription: 'Complete onboarding diagnostic & set up learning roadmap.',
    criteriaDescriptionTamil: 'தொடக்க நிலை மதிப்பீடு மற்றும் கற்றல் வரைபடத்தை அமைத்தல்.',
    requirements: [
      { label: 'Complete bilingual skill assessment diagnostic', labelTamil: 'இருமொழி தொடக்க மதிப்பீட்டை முடிக்கவும்', met: true },
      { label: 'Select primary civic pathway and district', labelTamil: 'முதன்மைப் பாதை மற்றும் மாவட்டத்தைத் தேர்வு செய்க', met: true },
      { label: 'Attempt first practice challenge', labelTamil: 'முதல் பயிற்சி சவாலைத் தொடங்கவும்', met: true }
    ]
  },
  {
    level: 2,
    title: 'Hands-On Practitioner',
    titleTamil: 'செயல்முறை பயிற்சியாளர்',
    minXp: 501,
    maxXp: 1200,
    badgeIcon: '🛠️',
    criteriaDescription: 'Submit first verified rubric proof (≥75%) + 3 completed challenges.',
    criteriaDescriptionTamil: 'முதல் சான்றளிக்கப்பட்ட திட்டத்தை சமர்ப்பித்தல் + 3 சவால்கள்.',
    requirements: [
      { label: 'Pass 1 challenge with ≥75% automated rubric score', labelTamil: '75%+ மதிப்பெண்ணுடன் 1 சவாலில் தேர்ச்சி', met: true },
      { label: 'Submit reproducible code or photographic QC proof', labelTamil: 'சரிபார்க்கத்தக்க குறியீடு அல்லது புகைப்பட சான்று', met: true },
      { label: 'Complete 3-day learning consistency streak', labelTamil: '3 நாள் தொடர் பயிற்சி நிறைவு', met: true }
    ]
  },
  {
    level: 3,
    title: 'Apprentice Builder',
    titleTamil: 'வளர்ச்சிப் படைப்பாளர்',
    minXp: 1201,
    maxXp: 2200,
    badgeIcon: '⭐',
    criteriaDescription: '3+ verified multi-file proofs + 1 authenticated viva defense + 7-day streak.',
    criteriaDescriptionTamil: '3+ சான்றுகள் + வாய்மொழி தேர்வு + 7 நாள் தொடர்ச்சி.',
    requirements: [
      { label: 'Achieve 3+ verified multi-file or QC evidence proofs', labelTamil: '3+ சரிபார்க்கப்பட்ட சான்றுகளைப் பெறுதல்', met: true },
      { label: 'Complete oral viva defense with Consistent authenticity', labelTamil: 'வாய்மொழித் தேர்வில் உறுதியான விளக்கமளித்தல்', met: true },
      { label: 'Maintain 7-day consistency streak without reset', labelTamil: '7 நாள் தொடர் பயிற்சி இழப்பின்றி நிறைவு', met: true }
    ]
  },
  {
    level: 4,
    title: 'Verified Craftsperson',
    titleTamil: 'சான்றளிக்கப்பட்ட கைவினைஞர்',
    minXp: 2201,
    maxXp: 3500,
    badgeIcon: '🏅',
    criteriaDescription: '5+ verified artifacts + state mentor attestation + ≥80% readiness.',
    criteriaDescriptionTamil: '5+ சான்றுகள் + வழிகாட்டி ஒப்புதல் + 80%+ தயார்நிலை.',
    requirements: [
      { label: '5+ tamper-evident code PRs or garment QC inspections', labelTamil: '5+ குறியீடு அல்லது ஆடை தரக்கட்டுப்பாட்டு சான்றுகள்', met: false },
      { label: 'Official signoff from State Industry Mentor', labelTamil: 'மாநில தொழில் வழிகாட்டியின் அதிகாரப்பூர்வ ஒப்புதல்', met: false },
      { label: 'Overall Readiness score exceeding 80% on /readiness', labelTamil: 'தயார்நிலை குறியீட்டில் 80%+ மதிப்பெண் பெறுதல்', met: false }
    ]
  },
  {
    level: 5,
    title: 'Master Artisan & Employer-Ready',
    titleTamil: 'முதுநிலை நிபுணர் & பணித்தயார்',
    minXp: 3501,
    maxXp: 5000,
    badgeIcon: '👑',
    criteriaDescription: 'Comprehensive portfolio passed + verified interview defense + employer shortlisting.',
    criteriaDescriptionTamil: 'முழுமையான சான்றுகள் + நேர்காணல் தேர்ச்சி + நிறுவனங்களின் தேர்வு.',
    requirements: [
      { label: 'Full multi-milestone portfolio verified by rubric', labelTamil: 'முழுமையான திட்டத்தொகுப்பு சரிபார்க்கப்பட்டது', met: false },
      { label: 'Complete bilingual AI Mock Interview on /interview', labelTamil: 'AI மாதிரி நேர்காணல் நிறைவு', met: false },
      { label: 'Eligible for direct apprentice contract on /opportunities', labelTamil: 'நேரடி பயிற்சி ஒப்பந்தத்திற்கு தகுதி பெறுதல்', met: false }
    ]
  }
];

// 2. XP Reward Rules (Meaningful work only, no vanity points)
export const xpRewardRules: XpRewardRule[] = [
  {
    action: 'Multi-File Code PR / Photo QC Proof',
    actionTamil: 'குறியீடு சமர்ப்பிப்பு / புகைப்பட சான்று',
    xpPoints: 150,
    category: 'proof',
    description: 'Passing automated rubric checks (0-overflow, focus-visible, ease tolerances).'
  },
  {
    action: 'Oral Defense / Viva Voce Passed',
    actionTamil: 'வாய்மொழி விளக்கம் / நேர்காணல் தேர்ச்சி',
    xpPoints: 100,
    category: 'viva',
    description: 'Defending architectural tradeoffs in bilingual Tamil/English with Consistent rating.'
  },
  {
    action: 'State Industry Mentor Signoff',
    actionTamil: 'தொழில் வழிகாட்டியின் சான்றளிப்பு',
    xpPoints: 200,
    category: 'mentor',
    description: 'Manual verification and endorsement by a certified Tamil Nadu industry mentor.'
  },
  {
    action: 'Daily 15-Minute Deliberate Practice',
    actionTamil: 'தினசரி 15 நிமிட தீவிர பயிற்சி',
    xpPoints: 30,
    category: 'consistency',
    description: 'Attempting roadmap challenge or reviewing rubric criteria.'
  },
  {
    action: '7-Day Meaningful Consistency Streak',
    actionTamil: '7 நாள் தொடர் பயிற்சி சாதனை',
    xpPoints: 100,
    category: 'consistency',
    description: 'Submitting daily practice proofs for a full week.'
  }
];

// 3. Weekly Activity vs Mastery Comparison (Separating Effort from Competency)
export const activityVsMasteryHistory: ActivityVsMasteryPoint[] = [
  { week: 'Week 1', activityIndex: 65, masteryIndex: 52, practiceMinutes: 180, proofsVerified: 1 },
  { week: 'Week 2', activityIndex: 74, masteryIndex: 61, practiceMinutes: 240, proofsVerified: 2 },
  { week: 'Week 3', activityIndex: 82, masteryIndex: 68, practiceMinutes: 310, proofsVerified: 3 },
  { week: 'Week 4', activityIndex: 88, masteryIndex: 72, practiceMinutes: 380, proofsVerified: 4 },
  { week: 'Week 5', activityIndex: 91, masteryIndex: 75, practiceMinutes: 420, proofsVerified: 4 },
  { week: 'Week 6 (Current)', activityIndex: 94, masteryIndex: 78, practiceMinutes: 460, proofsVerified: 5 }
];

// 4. Generate 16 weeks (112 days) of realistic calendar heatmap data
export function generate16WeekHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const today = new Date();
  const totalDays = 112; // 16 weeks * 7 days

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const weekIndex = Math.floor((totalDays - 1 - i) / 7);

    // Realistic adherence curve: consistent over the last 40 days
    const isRecent = i <= 40;
    const isMissed = isRecent ? i % 13 === 0 : i % 3 === 0;

    let level: 0 | 1 | 2 | 3 = 0;
    let minutesSpent = 0;
    let xpEarned = 0;
    let taskTitle = 'Rest day / No deliberate practice recorded';
    let proofType: 'code' | 'photo_qc' | 'viva' | 'practice' | undefined = undefined;

    if (!isMissed) {
      if (i % 6 === 0) {
        level = 3;
        minutesSpent = 75;
        xpEarned = 150;
        taskTitle = 'Completed Responsive Profile Page & Viva Voce (Score 92%)';
        proofType = 'code';
      } else if (i % 2 === 0) {
        level = 2;
        minutesSpent = 45;
        xpEarned = 60;
        taskTitle = 'Submitted DOM event delegation proof + test suite';
        proofType = 'practice';
      } else {
        level = 1;
        minutesSpent = 25;
        xpEarned = 30;
        taskTitle = '15-min practice: Semantic HTML skip-links and keyboard focus';
        proofType = 'practice';
      }
    }

    days.push({
      date: dateStr,
      dayOfWeek,
      weekIndex,
      level,
      minutesSpent,
      xpEarned,
      taskTitle,
      proofType
    });
  }

  return days;
}

// 5. 5-Minute Catch-Up Tasks for Recovery-Friendly Streaks
export const catchUpTasks: CatchUpTask[] = [
  {
    id: 'catchup-web-01',
    pathwayId: 'junior-web-dev',
    title: '5-Minute CSS Clamp() Viewport Diagnostic',
    titleTamil: '5 நிமிட CSS clamp() திரையளவு விரைவுச் சோதனை',
    question: 'Which of the following CSS clamp() declarations prevents horizontal overflow on a narrow 320px mobile viewport while allowing fluid scaling up to 24px?',
    questionTamil: '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல், 24 பிக்சல் வரை பெரிதாகும் சரியான CSS clamp() எது?',
    options: [
      'font-size: clamp(14px, 3.5vw, 24px);',
      'font-size: clamp(28px, 10vw, 48px);',
      'font-size: min-width: 480px;',
      'font-size: clamp(24px, 20vw, 32px);'
    ],
    optionsTamil: [
      'font-size: clamp(14px, 3.5vw, 24px); (பரிந்துரைக்கப்பட்டது)',
      'font-size: clamp(28px, 10vw, 48px);',
      'font-size: min-width: 480px;',
      'font-size: clamp(24px, 20vw, 32px);'
    ],
    correctAnswerIndex: 0,
    explanation: 'clamp(14px, 3.5vw, 24px) ensures the minimum font-size stays at 14px on 320px screens without overflowing, scaling smoothly up to a maximum of 24px.',
    explanationTamil: 'clamp(14px, 3.5vw, 24px) 320px திரையில் 14px ஆகவும், பெரிய திரைகளில் 24px வரையும் நெகிழ்வாக மாறும்.',
    rewardXp: 50
  },
  {
    id: 'catchup-craft-01',
    pathwayId: 'tailoring-craft',
    title: '5-Minute Garment Bias Cut Diagnostic',
    titleTamil: '5 நிமிட ஆடை இழை விரைவுச் சோதனை',
    question: 'Why must the center cup of a Katori blouse pattern be placed strictly on the true bias (45 degrees)?',
    questionTamil: 'கடோரி பிளவுஸ் வடிவமைப்பு வெட்டும்போது நடுப்பகுதி ஏன் 45 டிகிரி கோணத்தில் வெட்டப்பட வேண்டும்?',
    options: [
      'To allow natural fabric stretch and comfortable expansion around the bust curve without puckering',
      'To save fabric consumption during scissor cutting',
      'To make machine stitching faster on straight seams',
      'Because bias cuts never require iron pressing'
    ],
    optionsTamil: [
      'இயற்கையான துணி இழுவிசை மற்றும் மார்பு வளைவுக்கு ஏற்ப வசதியாக பொருந்த (பரிந்துரைக்கப்பட்டது)',
      'துணி மிச்சப்படுத்த',
      'தையல் வேகமாக முடிக்க',
      'அயர்ன் செய்ய தேவையில்லை என்பதால்'
    ],
    correctAnswerIndex: 0,
    explanation: 'A 45-degree true bias cut allows non-stretch woven fabric to expand naturally along the chest curvature without uncomfortable tight pulling.',
    explanationTamil: '45 டிகிரி கோணத்தில் வெட்டுவது துணிக்கு நெகிழ்வுத்தன்மையை அளித்து உடலுக்கு வசதியாக பொருந்தும்.',
    rewardXp: 50
  },
  {
    id: 'catchup-data-01',
    pathwayId: 'data-analyst',
    title: '5-Minute SQL Aggregate Window Diagnostic',
    titleTamil: '5 நிமிட SQL விண்டோ விரைவுச் சோதனை',
    question: 'What is the key performance benefit of SUM() OVER (PARTITION BY store_id) compared to a correlated subquery for rolling sales calculations?',
    questionTamil: 'துணைக் கேள்விக்கு பதிலாக SUM() OVER விண்டோ செயல்பாட்டைப் பயன்படுத்துவதன் முக்கிய நன்மை என்ன?',
    options: [
      'It computes rolling sums in a single sequential table pass without repetitive correlated table rescans',
      'It requires zero memory in database RAM',
      'It automatically formats output into an Excel spreadsheet',
      'It only works on small datasets under 100 rows'
    ],
    correctAnswerIndex: 0,
    explanation: 'Window functions partition and compute metrics across rows in a single pass, avoiding the quadratic $O(N^2)$ execution penalty of correlated subqueries.',
    explanationTamil: 'விண்டோ செயல்பாடுகள் ஒற்றை சுழற்சியில் இயங்கி தரவுத்தளத்தின் வேகத்தை பலமடங்கு அதிகரிக்கும்.',
    rewardXp: 50
  }
];
