export interface MilestoneNode {
  id: string;
  stepNumber: number;
  title: string;
  titleTamil: string;
  activity: string;
  timeEstimate: string;
  whyThisStep: string;
  status: 'completed' | 'current' | 'locked' | 'adaptive_remedial' | 'stretch';
  adaptiveReason?: string;
  score?: number;
  lessonContent: {
    overview: string;
    overviewTamil: string;
    keyTakeaways: string[];
    audioTranscript: string;
    audioTranscriptTamil: string;
    handsOnPrompt: string;
    hasMedia?: boolean;
    mediaUrl?: string;
  };
  transferable?: boolean;
  transferNote?: string;
}

export interface PathwayRoadmap {
  pathwayId: string;
  title: string;
  titleTamil: string;
  color: string;
  category: 'academic' | 'vocational';
  milestones: MilestoneNode[];
}

export const initialRoadmaps: Record<string, PathwayRoadmap> = {
  'junior-web-dev': {
    pathwayId: 'junior-web-dev',
    title: 'Junior Web Developer',
    titleTamil: 'இளநிலை இணைய மென்பொருள் உருவாக்குநர்',
    color: '#8B1E14',
    category: 'academic',
    milestones: [
      {
        id: 'web-m1',
        stepNumber: 1,
        title: 'HTML: Semantic Structure & Accessibility',
        titleTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை',
        activity: 'Construct semantic landmark trees (<header>, <nav>, <main>) with WCAG AA keyboard skip links.',
        timeEstimate: '45 mins',
        whyThisStep: 'Evidence shows 92% of frontend accessibility violations happen at the landmark layer. Required by all civic portals.',
        status: 'completed',
        score: 92,
        transferable: true,
        transferNote: 'Transferable habit: Structural semantic discipline & accessibility standards',
        lessonContent: {
          overview: 'Semantic HTML is the backbone of accessible web architecture. Screen readers and search engine crawlers rely on explicit landmarks to navigate DOM trees efficiently without visual reliance.',
          overviewTamil: 'அர்த்தமுள்ள HTML என்பது இணையத்தின் அடித்தளமாகும். பார்வைத் திறன் குறைபாடுள்ள பயனர்களும் திரை வாசிப்பான்களும் எளிதாக பக்கத்தை புரிந்து கொள்ள இது மிகவும் அவசியம்.',
          keyTakeaways: [
            'Always use <main>, <nav role="navigation">, and <header> landmarks.',
            'Include a visible :focus-visible skip-link to bypass repetitive headers.',
            'Never use <div> when a native semantic element (<button>, <section>) exists.'
          ],
          audioTranscript: 'Welcome to milestone 1. In this module, you master semantic HTML landmarks and keyboard accessibility. Screen readers rely on semantic landmarks to understand page architecture.',
          audioTranscriptTamil: 'முதல் பாடத்திற்கு நல்வரவு. இதில் அர்த்தமுள்ள HTML மற்றும் விசைப்பலகை அணுகல்தன்மையை நாம் கற்கிறோம்.',
          handsOnPrompt: 'Inspect the provided HTML skeleton and replace all div wrappers with appropriate semantic HTML5 tags.'
        }
      },
      {
        id: 'web-m2',
        stepNumber: 2,
        title: 'CSS & Responsive: Fluid Layouts & Grid',
        titleTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு',
        activity: 'Build fluid 2D grid layouts that scale flawlessly from 320px mobile viewports to 4K displays.',
        timeEstimate: '60 mins',
        whyThisStep: 'Demonstrates container-query responsiveness without rigid pixel breakpoints. Avoids layout shift.',
        status: 'current',
        transferable: true,
        transferNote: 'Transferable skill: Visual proportion & 2D layout spatial balance',
        lessonContent: {
          overview: 'Modern CSS Grid and Flexbox allow components to adapt intrinsically to their container size rather than fixed viewport widths. Clamped fluid typography ensures legible scaling across rural mobile devices.',
          overviewTamil: 'நவீன CSS கட்டமைப்பு மூலம் எந்த ஒரு செல்போன் திரையிலும் பக்கங்கள் அழகாகப் பொருந்தும். கிடைமட்டமாக உருளாமல் நேர்த்தியாக காட்சியளிக்கும்.',
          keyTakeaways: [
            'Use CSS Grid repeat(auto-fit, minmax(260px, 1fr)) for responsive cards.',
            'Implement clamp(1rem, 2.5vw, 1.5rem) for fluid scalable typography.',
            'Ensure touch targets are at least 44x44px for thumb accessibility.'
          ],
          audioTranscript: 'In milestone 2, you master modern CSS Grid and Flexbox. Fluid layout principles guarantee zero horizontal scrollbars on mobile phones.',
          audioTranscriptTamil: 'இரண்டாம் பாடத்தில் CSS கிரிட் மற்றும் நெகிழ்வான தளவமைப்பை கற்கிறோம். இது உங்கள் பக்கங்களை மொபைலில் நேர்த்தியாக மாற்றும்.',
          handsOnPrompt: 'Construct a 3-column product grid with aspect-ratio 4/3 image wrappers and zero overflow.'
        }
      },
      {
        id: 'web-m3',
        stepNumber: 3,
        title: 'JavaScript: DOM State & Async Fetching',
        titleTamil: 'ஜாவாஸ்கிரிப்ட் மற்றும் DOM நிலை',
        activity: 'Handle async/await fetch flows, event delegation, and race-condition cancellation via AbortController.',
        timeEstimate: '75 mins',
        whyThisStep: 'Proves mastery of JavaScript concurrency, debounced inputs, and graceful offline cache recovery.',
        status: 'locked',
        transferable: true,
        lessonContent: {
          overview: 'Asynchronous event handling and robust state reconciliation are critical to snappy web applications. Delegating click listeners to parent nodes minimizes memory footprint on budget smartphones.',
          overviewTamil: 'ஜாவாஸ்கிரிப்ட் மூலம் தரவுகளைப் பெற்று பக்கத்தை இயங்குநிலையில் வைப்பது எவ்வாறு என்பதை இதில் கற்கிறோம்.',
          keyTakeaways: [
            'Use AbortController to cancel stale network requests during rapid typing.',
            'Attach single listener to parent container via event delegation.',
            'Always wrap network calls in try/catch with user-friendly error fallbacks.'
          ],
          audioTranscript: 'Milestone 3 covers JavaScript async/await and event bubbling. Learn how event delegation saves memory on mobile devices.',
          audioTranscriptTamil: 'மூன்றாம் பாடத்தில் ஜாவாஸ்கிரிப்ட் மெமரி சேமிப்பு மற்றும் நிகழ்வு பரிமாற்றத்தை கற்கிறோம்.',
          handsOnPrompt: 'Write a 300ms debounced input search handler that cancels previous inflight fetches.'
        }
      },
      {
        id: 'web-m4',
        stepNumber: 4,
        title: 'Project: Handloom Civic E-Commerce Portal',
        titleTamil: 'நடைமுறை நேரலை திட்டப்பணி',
        activity: 'Construct an accessible e-commerce catalog for Tamil Nadu handloom textiles with filter state.',
        timeEstimate: '90 mins',
        whyThisStep: 'Portfolio evidence: Employers require reproducible Git repositories over multiple-choice certifications.',
        status: 'locked',
        lessonContent: {
          overview: 'Combine semantic accessibility, responsive layouts, and state management into a complete production portal showcasing artisanal handloom goods.',
          overviewTamil: 'இதுவரை கற்ற அனைத்தையும் கொண்டு ஒரு முழுமையான கைத்தறி விற்பனை தளத்தை உருவாக்கும் திட்டப்பணி.',
          keyTakeaways: [
            'End-to-end component hierarchy with decoupled data state.',
            'Lighthouse Accessibility audit score >95.',
            'Offline caching with localStorage draft persistence.'
          ],
          audioTranscript: 'In milestone 4, you construct an end-to-end accessible web portal with search, cart, and offline storage.',
          audioTranscriptTamil: 'நான்காம் பாடத்தில் ஒரு நேரலை திட்டப்பணியை செய்து முடிக்கிறோம்.',
          handsOnPrompt: 'Build and deploy a responsive catalog with accessible keyboard filters and cart drawers.'
        }
      },
      {
        id: 'web-m5',
        stepNumber: 5,
        title: 'Demonstrate: Oral Defense & Viva Verification',
        titleTamil: 'வாய்மொழி விளக்கம் & சரிபார்ப்பு',
        activity: 'Deliver a 5-minute bilingual viva defense explaining your architecture decisions and trade-offs.',
        timeEstimate: '30 mins',
        whyThisStep: 'Workplace readiness: Tech leads hire applicants who can articulate trade-offs in Tamil or English.',
        status: 'locked',
        lessonContent: {
          overview: 'Defend your engineering choices in an interactive viva interview. Explain why event delegation was chosen and how CSS grid prevents layout shifts.',
          overviewTamil: 'உங்கள் திட்டத்தை வாய்மொழியாக விளக்கி வழிகாட்டி ஒப்புதல் பெறும் இறுதித் தேர்வு.',
          keyTakeaways: [
            'Articulate technical trade-offs with clarity.',
            'Demonstrate code inspection walkthrough.',
            'Earn verified mentor seal on Skill Passport.'
          ],
          audioTranscript: 'Final milestone 5: Deliver an oral defense of your code to earn your verified credential.',
          audioTranscriptTamil: 'இறுதிப் பாடத்தில் உங்கள் திட்டத்தை வாய்மொழியாக விளக்கி சான்றளிப்பு பெறுகிறீர்கள்.',
          handsOnPrompt: 'Record your oral explanation of DOM bubbling and state management in Tamil or English.'
        }
      }
    ]
  },
  'tailoring-craft': {
    pathwayId: 'tailoring-craft',
    title: 'Tailoring & Garment Construction',
    titleTamil: 'தையற்கலை & ஆடை வடிவமைப்பு',
    color: '#B8761A',
    category: 'vocational',
    milestones: [
      {
        id: 'tailor-m1',
        stepNumber: 1,
        title: 'Measurements & Tools: Body Measurement & Ease',
        titleTamil: 'அளவீடு & கருவிகள்: உடல் அளவீடு & தையல் தளர்வு',
        activity: 'Record 5 key client measurements (bust, waist, armhole, shoulder, neck depth) with 1.5" standard ease allowances.',
        timeEstimate: '35 mins',
        whyThisStep: 'Evidence proves accurate measurement records prevent fabric waste and ill-fitting armhole puckering.',
        status: 'completed',
        score: 94,
        transferable: true,
        transferNote: 'Transferable habit: Precision metric measurement and standard ease tolerances',
        lessonContent: {
          overview: 'Accurate body measurement is the bedrock of tailoring. Learning where to anchor the tape against natural body landmarks ensures exact fit without tightness.',
          overviewTamil: 'துல்லியமான உடல் அளவீடே தையற்கலையின் அடித்தளம். சரியான அளவுகள் துணி வீணாவதைத் தடுக்கும்.',
          keyTakeaways: [
            'Keep tape flat and snug, never compressing skin tissue.',
            'Add standard 1.5 inch ease allowance across bust and waist lines.',
            'Record client posture nuances (sloping shoulders, high bust apex).'
          ],
          audioTranscript: 'Welcome to tailoring milestone 1. Accurate measurements with standard ease allowances guarantee perfect garment drape.',
          audioTranscriptTamil: 'தையல் முதல் பாடத்திற்கு நல்வரவு. இதில் துல்லியமான உடல் அளவீடுகளை நாம் கற்கிறோம்.',
          handsOnPrompt: 'Record a complete 5-point measurement chart on paper with a ruler scale alongside.'
        }
      },
      {
        id: 'tailor-m2',
        stepNumber: 2,
        title: 'Basic Stitching: Lockstitch Sewing & Tension Balancing',
        titleTamil: 'அடிப்படை தையல்: நேர்கோட்டு தையல் & நூல் அழுத்தம்',
        activity: 'Stitch two 10-inch swatches with balanced bobbin/top thread tension at strictly 10 stitches per inch.',
        timeEstimate: '45 mins',
        whyThisStep: 'Export quality standard: Unbalanced tension causes seam breakage and puckering upon first wash.',
        status: 'current',
        transferable: true,
        transferNote: 'Transferable skill: Machine calibration and tension balance',
        lessonContent: {
          overview: 'Industrial sewing machines require precise tension matching between upper spool thread and bobbin thread. Balanced tension buries the lockstitch knot invisible in the fabric sandwich.',
          overviewTamil: 'தையல் இயந்திரத்தில் மேல் நூல் மற்றும் கீழ் பாபின் நூல் அழுத்தத்தை சமநிலையில் வைப்பது எவ்வாறு என்பதை இதில் பயில்கிறோம்.',
          keyTakeaways: [
            'Achieve 10 stitches per inch across straight test swatches.',
            'Adjust bobbin case screw until thread drops smoothly under bobbin weight.',
            'Anchor all seam starts and ends with 3 back-tack stitches.'
          ],
          audioTranscript: 'In milestone 2, learn lockstitch balance and bobbin adjustment to ensure clean, durable seams.',
          audioTranscriptTamil: 'இரண்டாம் பாடத்தில் நூல் அழுத்தம் சமநிலை மற்றும் நேர்கோட்டு தையலை கற்கிறோம்.',
          handsOnPrompt: 'Photograph both sides of your 10-inch stitch test swatch with a coin next to stitches.'
        }
      },
      {
        id: 'tailor-m3',
        stepNumber: 3,
        title: 'Garment Construction: Katori Blouse Drafting',
        titleTamil: 'ஆடை கட்டுமானம்: கட்டோரி ரவிக்கை வரைவு & வெட்டுதல்',
        activity: 'Draft paper patterns on fabric grain line with 1/4" seam margins and cut front cup curvature.',
        timeEstimate: '75 mins',
        whyThisStep: 'Master cutting craft: Elliptical curve alignment eliminates cup sagging and side-bust pulling.',
        status: 'locked',
        lessonContent: {
          overview: 'Pattern drafting requires geometric precision. Aligning paper pieces with straight fabric grain ensures the blouse cups hug natural body contours smoothly.',
          overviewTamil: 'துணியின் நேர் நூல் கோட்டில் பேப்பர் பேட்டர்ன் வைத்து நேர்த்தியாக வெட்டுவது எவ்வாறு என்பதை இதில் கற்கிறோம்.',
          keyTakeaways: [
            'Always align pattern grain line strictly parallel to fabric selvage.',
            'Snip 2mm triangular notches at shoulder and bust apex points.',
            'Maintain uniform 0.25 inch seam allowance around armhole curves.'
          ],
          audioTranscript: 'Milestone 3 covers Katori blouse pattern drafting and notch marking on true grain lines.',
          audioTranscriptTamil: 'மூன்றாம் பாடத்தில் கட்டோரி ரவிக்கை வெட்டுதல் மற்றும் பேட்டர்ன் அமைப்பை கற்கிறோம்.',
          handsOnPrompt: 'Submit a top-down photo of your cut brown paper pattern with 30cm steel ruler.'
        }
      },
      {
        id: 'tailor-m4',
        stepNumber: 4,
        title: 'Finishing & Quality: 45° Bias Piping & Steam Press',
        titleTamil: 'முடிவு & தரம்: பைப்பிங் விளிம்பு & நீராவி அயர்னிங்',
        activity: 'Cut true 45-degree bias strip, insert cord, and attach to round neckline without wrinkles.',
        timeEstimate: '60 mins',
        whyThisStep: 'Boutique bridal requirement: Flawless neckline finish separates amateur tailors from master artisans.',
        status: 'locked',
        lessonContent: {
          overview: 'Bias binding cut at 45 degrees stretches around curves smoothly. Finishing with steam pressing flattens open seam allowances permanently.',
          overviewTamil: 'கழுத்து விளிம்பில் 45 டிகிரி பைப்பிங் அமைத்து சுருக்கமில்லாமல் தைப்பது மற்றும் நீராவி அயர்னிங் செய்யும் கலை.',
          keyTakeaways: [
            'True 45-degree angle provides maximum elasticity.',
            'Keep cord tension uniform around circular neckline.',
            'Steam press open seams with tailor ham to retain cup volume.'
          ],
          audioTranscript: 'In milestone 4, master bias cord attachment and professional steam pressing for boutique bridal wear.',
          audioTranscriptTamil: 'நான்காம் பாடத்தில் கழுத்து பைப்பிங் மற்றும் நீராவி அயர்னிங் நுணுக்கங்களை கற்கிறோம்.',
          handsOnPrompt: 'Photograph finished round neckline showing both outer piping and interior tape fold.'
        }
      },
      {
        id: 'tailor-m5',
        stepNumber: 5,
        title: 'Demonstrate: Master Artisan Sign-Off & Viva',
        titleTamil: 'செயல்முறை விளக்கம்: மாதிரி ஆடை ஆய்வு & வழிகாட்டி ஒப்புதல்',
        activity: 'Submit complete 5-point photo inspection and explain puckering troubleshooting in Tamil or English.',
        timeEstimate: '30 mins',
        whyThisStep: 'Unlocks boutique bridal tailoring contracts in Tiruppur, Coimbatore, and Chennai fashion clusters.',
        status: 'locked',
        lessonContent: {
          overview: 'Deliver completed blouse sample for AI photo inspection and master artisan sign-off.',
          overviewTamil: 'முழுமையான ரவிக்கையை ஆய்வு செய்து வழிகாட்டி ஒப்புதல் பெறும் இறுதி நிலை.',
          keyTakeaways: [
            'Inspection of all 5 critical stress points.',
            'Tolerance verification under 1mm.',
            'Endorsement for boutique contract work.'
          ],
          audioTranscript: 'Final milestone 5: Complete sample blouse review and earn master artisan endorsement.',
          audioTranscriptTamil: 'இறுதிப் பாடத்தில் முழு ஆடையை சமர்ப்பித்து கைதேர்ந்த தையற்கலைஞர் சான்றிதழ் பெறுகிறீர்கள்.',
          handsOnPrompt: 'Upload front and back photos of completed garment for computer vision inspection.'
        }
      }
    ]
  }
};

// 5-Question CSS Quiz
export interface QuizQuestion {
  id: number;
  question: string;
  questionTamil: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const cssQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When using Flexbox with `flex-direction: row`, which CSS property aligns items along the cross axis (vertical)?",
    questionTamil: "Flexbox-ல் row அமைப்பில் குறுக்கு அச்சு (செங்குத்து) வரிசைப்படுத்துவதற்கு பயன்படும் பண்பு எது?",
    options: ["justify-content", "align-items", "flex-wrap", "align-self"],
    correctIndex: 1,
    explanation: "`align-items` aligns flex items along the cross axis, while `justify-content` controls the main axis."
  },
  {
    id: 2,
    question: "How do you create a responsive grid that automatically wraps items without using media queries?",
    questionTamil: "மீடியா வினவல்கள் இன்றி தானாக மடங்கும் கிரிட் உருவாக்க எதை பயன்படுத்த வேண்டும்?",
    options: [
      "grid-template-columns: repeat(3, 1fr)",
      "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
      "display: flex; flex-direction: column",
      "grid-auto-flow: dense"
    ],
    correctIndex: 1,
    explanation: "`repeat(auto-fit, minmax(250px, 1fr))` dynamically fills the available track without hardcoded breakpoints."
  },
  {
    id: 3,
    question: "What happens if a child element has `flex: 1` in a flex container?",
    questionTamil: "Flexbox உறுப்பில் `flex: 1` கொடுத்தால் என்ன நிகழும்?",
    options: [
      "It expands to occupy all remaining free space proportionally",
      "It forces the container to wrap to the next line",
      "It locks the element to 100 pixels",
      "It hides all other siblings"
    ],
    correctIndex: 0,
    explanation: "`flex: 1` is shorthand for `flex: 1 1 0%`, expanding the element to claim available space."
  },
  {
    id: 4,
    question: "Which CSS function provides fluid scalable typography between a minimum and maximum bound?",
    questionTamil: "குறைந்தபட்ச மற்றும் அதிகபட்ச எல்லைகளுக்குள் மாறும் எழுத்துரு அளவிற்கு பயன்படும் சார்பு எது?",
    options: ["calc()", "clamp(min, preferred, max)", "min()", "scale()"],
    correctIndex: 1,
    explanation: "`clamp(min, val, max)` restricts values between designated lower and upper limits."
  },
  {
    id: 5,
    question: "Why should you avoid fixed widths like `width: 600px` on mobile cards?",
    questionTamil: "மொபைல் திரைகளில் நிலையான பிக்சல் அகலத்தை ஏன் தவிர்க்க வேண்டும்?",
    options: [
      "It causes horizontal scrollbar on screens narrower than 600px (e.g. 320px screens)",
      "It increases server bandwidth consumption",
      "It disables screen readers completely",
      "Browsers crash on fixed widths"
    ],
    correctIndex: 0,
    explanation: "Fixed widths wider than the mobile viewport force horizontal scrolling, failing WCAG accessibility."
  }
];
