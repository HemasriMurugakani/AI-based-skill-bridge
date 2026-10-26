import { Challenge } from '../types';

export const challenges: Challenge[] = [
  // 1. FULLY IMPLEMENTED: Build a responsive profile page
  {
    id: 'challenge-web-profile',
    title: 'Build a Responsive Profile Page',
    titleTamil: 'நெகிழ்வான சுயவிவரப் பக்கம் உருவாக்குதல்',
    pathwayId: 'junior-web-dev',
    skillId: 'web-responsive-css',
    skillName: 'Responsive CSS & Semantic HTML',
    difficulty: 'Intermediate',
    timeEstimate: '45 mins',
    type: 'code',
    description: 'Build an accessible personal profile page for a Tamil Nadu artisan or software apprentice with fluid typography, responsive layout scaling without horizontal overflow on 320px screens, and WCAG AA keyboard focus indicators.',
    instructions: [
      'Use semantic <header role="banner">, <nav>, and <main id="content"> landmarks.',
      'Construct a fluid flexbox or CSS Grid layout with clamp() typography.',
      'Ensure ZERO horizontal scrolling on narrow mobile devices (320px viewport).',
      'Provide visible :focus-visible outlines (>= 3px) for keyboard tab navigation.',
      'Submit your live project URL / GitHub repository link, screenshot, and explanation.'
    ],
    rubric: [
      { criterion: 'Semantic Landmarks & Accessibility', weight: 25, description: 'Header, main, skip-link, and landmark roles.' },
      { criterion: 'Responsive Grid & Flexbox Scaling', weight: 30, description: 'Intrinsic fluid wrapping without rigid pixel breakpoints.' },
      { criterion: 'Mobile Viewport & Zero Horizontal Overflow', weight: 25, description: 'Strict 0-overflow compliance at 320px viewport width.' },
      { criterion: 'Focus Visible & High Contrast', weight: 20, description: 'Visible focus indicator and WCAG AA 4.5:1 text contrast.' }
    ],
    points: 150,
    completed: false
  },
  // 2. FULLY IMPLEMENTED: Write a professional introduction
  {
    id: 'challenge-comm-intro',
    title: 'Write a Professional Introduction',
    titleTamil: 'தொழில்முறை அறிமுக உரை எழுதுதல் / பேசுதல்',
    pathwayId: 'junior-web-dev',
    skillId: 'comm-professional-pitch',
    skillName: 'Professional Communication & Articulation',
    difficulty: 'Beginner',
    timeEstimate: '15 mins',
    type: 'viva',
    description: 'Record a concise 45-second bilingual elevator pitch or submit a written introduction presenting your background, verified SkillBridge proof scores, and career ambitions with warmth and cultural respect.',
    instructions: [
      'Speak or write comfortably in Tamil (தூய தமிழ் / தங்கிலீஷ்) or English.',
      'State your name, district, primary skill proofs (cite your verified rubric score), and career target.',
      'Maintain professional warmth with cultural greeting (e.g. "வணக்கம்").',
      'Keep delivery strictly concise (under 45 seconds).'
    ],
    rubric: [
      { criterion: 'Clarity & Articulation', weight: 25, description: 'Clear voice delivery, natural cadence, zero verbal fillers.' },
      { criterion: 'Relevant Skills & Evidence Citation', weight: 30, description: 'Cites concrete verified SkillBridge rubric proof scores.' },
      { criterion: 'Professional Warmth & Cultural Respect', weight: 25, description: 'Respectful demeanor and authentic civic grounding.' },
      { criterion: 'Brevity & Actionable Closing', weight: 20, description: 'Under 45 seconds with a clear next-step career objective.' }
    ],
    points: 120,
    completed: false
  },
  // 3. Junior Web Dev - Semantic HTML
  {
    id: 'ch-web-01',
    title: 'Accessible Tamil Nadu Artisan Portfolio Header & Nav',
    titleTamil: 'கைவினைஞர் போர்ட்ஃபோலியோ அணுகல்தன்மை தலைப்பு',
    pathwayId: 'junior-web-dev',
    skillId: 'web-html-semantics',
    skillName: 'Semantic HTML & Accessibility',
    difficulty: 'Beginner',
    timeEstimate: '35 mins',
    type: 'code',
    description: 'Implement a semantic, WCAG 2.1 AA accessible navbar for a Thanjavur doll artisan collective with skip-link, keyboard focus traps, and ARIA labels.',
    instructions: [
      'Use semantic <header>, <nav>, <main> landmarks.',
      'Add a visible "Skip to main content" link for keyboard tab navigation.',
      'Ensure every icon button has an aria-label.',
      'Verify color contrast ratio >= 4.5:1.'
    ],
    rubric: [
      { criterion: 'Semantic HTML Landmarks', weight: 30, description: 'Correct usage of header, nav, ul, button tags.' },
      { criterion: 'Keyboard Nav & Focus Rings', weight: 40, description: 'Tab index order, skip link, visible focus styling.' },
      { criterion: 'ARIA & Screen Reader Support', weight: 30, description: 'Meaningful aria-expanded and aria-labels.' }
    ],
    points: 120,
    completed: true,
    score: 92
  },
  // 2. Junior Web Dev - Responsive CSS
  {
    id: 'ch-web-02',
    title: 'Responsive Kolam Motif Product Card Grid',
    titleTamil: 'கோலம் வடிவமைப்பு பொருள் அட்டை கட்டமைப்பு',
    pathwayId: 'junior-web-dev',
    skillId: 'web-responsive-css',
    skillName: 'Responsive CSS & Flex/Grid',
    difficulty: 'Intermediate',
    timeEstimate: '45 mins',
    type: 'code',
    description: 'Build a zero-overflow, fluid CSS Grid layout showcasing Tamil Nadu handloom textiles that automatically scales from 1 column on mobile (320px) to 4 columns on desktop.',
    instructions: [
      'Use CSS Grid with repeat(auto-fit, minmax(260px, 1fr)).',
      'Add aspect-ratio: 4/3 on image wrappers with object-fit: cover.',
      'Ensure typography scales smoothly with clamp().',
      'Test for no horizontal scrollbars on 320px viewport.'
    ],
    rubric: [
      { criterion: 'Fluid Grid Scaling', weight: 35, description: 'No fixed pixel widths causing side-scroll.' },
      { criterion: 'Aspect Ratio & Media Containment', weight: 35, description: 'Images do not distort or jump during layout shifts.' },
      { criterion: 'Micro-interactions', weight: 30, description: 'Gentle card hover elevation and smooth transitions.' }
    ],
    points: 150,
    completed: true,
    score: 84
  },
  // 3. Junior Web Dev - JavaScript Async State
  {
    id: 'ch-web-03',
    title: 'District Job Board Search with Debounce & Error Toast',
    titleTamil: 'மாவட்ட வேலை தேடல் மற்றும் பிழை அறிவிப்பு',
    pathwayId: 'junior-web-dev',
    skillId: 'web-javascript-dom',
    skillName: 'JavaScript & DOM Manipulation',
    difficulty: 'Intermediate',
    timeEstimate: '50 mins',
    type: 'code',
    description: 'Write an asynchronous search client with 300ms debounce, abort controller for cancelling race conditions, and graceful offline cache fallback.',
    instructions: [
      'Implement custom debounce without third party dependencies.',
      'Use AbortController to cancel previous unfulfilled requests.',
      'Handle HTTP 4xx, 5xx, and network offline states gracefully.',
      'Render results dynamically into DOM fragment.'
    ],
    rubric: [
      { criterion: 'Debounce & Concurrency Control', weight: 40, description: 'No redundant fetch calls or race conditions.' },
      { criterion: 'Resilient Error Handling', weight: 35, description: 'Clean user-facing toast and retry triggers.' },
      { criterion: 'DOM Performance', weight: 25, description: 'Clean batch rendering using document fragments.' }
    ],
    points: 180,
    completed: false
  },
  // 4. Junior Web Dev - React State Machine
  {
    id: 'ch-web-04',
    title: 'Multi-Step Learner Verification Wizard in React',
    titleTamil: 'பல கட்ட பயனர் சரிபார்ப்பு படிவம்',
    pathwayId: 'junior-web-dev',
    skillId: 'web-react-components',
    skillName: 'React Components & Hooks',
    difficulty: 'Advanced',
    timeEstimate: '60 mins',
    type: 'code',
    description: 'Construct a state-driven 3-step proof upload wizard with client-side Zod validation, auto-save to localStorage, and progress indicator.',
    instructions: [
      'Create step components with decoupled local validation.',
      'Persist wizard drafts in localStorage to recover from accidental reloads.',
      'Animate step transitions smoothly with Framer Motion.',
      'Show clear validation errors adjacent to each field.'
    ],
    rubric: [
      { criterion: 'State Architecture', weight: 40, description: 'Zero state desynchronization or unnecessary rerenders.' },
      { criterion: 'Form Validation & UX', weight: 35, description: 'Accessible inline error announcements.' },
      { criterion: 'Draft Recovery', weight: 25, description: 'Restores unfinished draft accurately on refresh.' }
    ],
    points: 220,
    completed: false
  },
  // 5. Junior Web Dev - Viva Voice Challenge
  {
    id: 'ch-web-05',
    title: 'Viva: Explaining DOM Event Delegation in Tamil or English',
    titleTamil: 'வாய்மொழித் தேர்வு: DOM நிகழ்வு பரிமாற்றம் விளக்கம்',
    pathwayId: 'junior-web-dev',
    skillId: 'web-javascript-dom',
    skillName: 'JavaScript & DOM Manipulation',
    difficulty: 'Beginner',
    timeEstimate: '10 mins',
    type: 'viva',
    description: 'Answer 3 conversational questions on why event delegation saves memory and how event bubbling works in single-page apps.',
    instructions: [
      'Record your voice or type your answers.',
      'You can explain comfortably in Tamil (தங்கிலீஷ் or தூய தமிழ்) or English.',
      'Provide a practical example of a dynamic <ul> list.'
    ],
    rubric: [
      { criterion: 'Conceptual Clarity', weight: 40, description: 'Accurate distinction of capturing vs bubbling phases.' },
      { criterion: 'Practical Application', weight: 40, description: 'Clear scenario of managing 1,000 table rows.' },
      { criterion: 'Communication', weight: 20, description: 'Coherent and structured explanation.' }
    ],
    points: 100,
    completed: true,
    score: 88
  },
  // 6. Tailoring - Measurement Tape Proof
  {
    id: 'ch-tailor-01',
    title: 'Submit 5-Point Blouse Measurement Sheet with Photo Proof',
    titleTamil: '5-புள்ளி ரவிக்கை அளவீட்டு தாள் புகைப்பட சமர்ப்பிப்பு',
    pathwayId: 'tailoring-craft',
    skillId: 'tailor-body-measurement',
    skillName: 'Body Measurement & Ease Allowances',
    difficulty: 'Beginner',
    timeEstimate: '30 mins',
    type: 'photo_upload',
    description: 'Upload a clear top-down photo of your handwritten client measurement record alongside the measuring tape placed against standard guide marks.',
    instructions: [
      'Ensure good daytime lighting without shadows.',
      'Include Bust (36"), Waist (30"), Shoulder (14"), Front Neck Depth (6.5"), Armhole (16").',
      'The measuring tape inches must be legible in the image.',
      'AI visual model checks for calculation of 1.5" sewing ease allowance.'
    ],
    rubric: [
      { criterion: 'Legibility & Completeness', weight: 35, description: 'All 5 critical blouse dimensions marked clearly.' },
      { criterion: 'Ease Calculation Accuracy', weight: 35, description: 'Calculated seam margins correct for fabric tension.' },
      { criterion: 'Photo Quality', weight: 30, description: 'Even lighting, sharp focus on measurements.' }
    ],
    points: 130,
    completed: true,
    score: 94
  },
  // 7. Tailoring - Katori Paper Pattern Cutting
  {
    id: 'ch-tailor-02',
    title: 'Photo Review: Katori Cup Curvature & Notch Marking',
    titleTamil: 'புகைப்பட ஆய்வு: கட்டோரி கப்பு வளைவு மற்றும் அடையாள வெட்டு',
    pathwayId: 'tailoring-craft',
    skillId: 'tailor-blouse-drafting',
    skillName: 'Katori & 4-Dart Blouse Drafting',
    difficulty: 'Intermediate',
    timeEstimate: '40 mins',
    type: 'photo_upload',
    description: 'Cut a Katori front pattern on brown craft paper. Photograph the piece with alignment ruler showing grain line and 1/4-inch seam allowances.',
    instructions: [
      'Cut smooth curves without jagged scissor bites.',
      'Snip 2mm triangular notches at shoulder and bust apex points.',
      'Place a 30cm steel ruler alongside the pattern for scale calibration.',
      'Take photo directly from 90-degree overhead angle.'
    ],
    rubric: [
      { criterion: 'Curvature Smoothness', weight: 40, description: 'Smooth elliptical arc without stair-stepping.' },
      { criterion: 'Notch Precision', weight: 30, description: 'Notches visible within 1mm of specification.' },
      { criterion: 'Allowance Margins', weight: 30, description: 'Exact 0.25 inch seam margins maintained.' }
    ],
    points: 160,
    completed: true,
    score: 86
  },
  // 8. Tailoring - Lockstitch Seam Straightness
  {
    id: 'ch-tailor-03',
    title: 'Stitch Quality Inspection: 10 Stitches/Inch Straight Seam',
    titleTamil: 'தையல் தரம்: நேர்கோட்டு தையல் மற்றும் நூல் அழுத்தம்',
    pathwayId: 'tailoring-craft',
    skillId: 'tailor-machine-stitching',
    skillName: 'Lockstitch Sewing & Tension Control',
    difficulty: 'Intermediate',
    timeEstimate: '25 mins',
    type: 'photo_upload',
    description: 'Stitch two 10-inch cotton swatches with contrasting thread. Upload macro photo showing top thread and bobbin thread tension balance.',
    instructions: [
      'Use white thread on dark fabric (or dark thread on light fabric).',
      'Ensure stitches are locked at beginning and end with 3 reverse stitches.',
      'Place a coin or ruler next to the seam for AI stitch-count validation.',
      'Capture both front and back sides in good lighting.'
    ],
    rubric: [
      { criterion: 'Tension Balance', weight: 40, description: 'No thread loops on top or bottom side of fabric.' },
      { criterion: 'Stitch Uniformity', weight: 35, description: 'Consistent 10 stitches per inch across entire length.' },
      { criterion: 'Edge Parallelism', weight: 25, description: 'Stitch line strictly 0.5 inch from raw edge.' }
    ],
    points: 140,
    completed: false
  },
  // 9. Tailoring - Viva Craft Explanation
  {
    id: 'ch-tailor-04',
    title: 'Viva: Solving Fabric Puckering in Chiffon and Silk',
    titleTamil: 'வாய்மொழித் தேர்வு: பட்டுத் துணியில் தையல் சுருக்கம் சரிசெய்தல்',
    pathwayId: 'tailoring-craft',
    skillId: 'tailor-machine-stitching',
    skillName: 'Lockstitch Sewing & Tension Control',
    difficulty: 'Intermediate',
    timeEstimate: '10 mins',
    type: 'viva',
    description: 'Explain in Tamil or English how you adjust needle gauge (e.g. size 9/11 vs 16) and bobbin spring tension when switching from heavy cotton to lightweight chiffon.',
    instructions: [
      'Record your audio answer or submit text response.',
      'Mention needle numbers, thread weight, and presser foot pressure.',
      'Tamil explanation is encouraged and fully supported.'
    ],
    rubric: [
      { criterion: 'Needle & Thread Pairing', weight: 40, description: 'Accurate recommendation of size 9/11 needle for silk.' },
      { criterion: 'Tension Troubleshooting', weight: 40, description: 'Clear diagnosis of upper vs lower thread puckering.' },
      { criterion: 'Practical Craft Nuance', weight: 20, description: 'Mention of tissue paper backing or ball-point tips.' }
    ],
    points: 110,
    completed: false
  },
  // 10. Electrician - Two-Way Switch Wiring Proof
  {
    id: 'ch-elec-01',
    title: 'Photo Proof: Staircase Two-Way Switch Circuit Wiring',
    titleTamil: 'புகைப்பட சான்று: இருவழி மின் சுவிட்ச் இணைப்பு அமைப்பு',
    pathwayId: 'electrician-trade',
    skillId: 'elec-conduit-wiring',
    skillName: 'PVC Conduit & Loop-in Wiring',
    difficulty: 'Intermediate',
    timeEstimate: '40 mins',
    type: 'photo_upload',
    description: 'Wire a working staircase two-way switch circuit on a practice test board. Upload wiring layout showing color-coded strapping conductors.',
    instructions: [
      'Red/Brown for Phase, Black/Blue for Neutral, Green/Yellow for Earth.',
      'Ensure copper conductors have zero exposed wire outside screw terminals.',
      'Include clear overview of the switch junction box.',
      'Circuit must follow Indian Electricity Rules (IER).'
    ],
    rubric: [
      { criterion: 'Color Coding Compliance', weight: 35, description: 'Phase, neutral, and strappers strictly color-coded.' },
      { criterion: 'Terminal Insulation Safety', weight: 35, description: 'Zero exposed bare copper strands outside terminal block.' },
      { criterion: 'Schematic Correctness', weight: 30, description: 'Two-way logic verified with lamp load.' }
    ],
    points: 170,
    completed: true,
    score: 95
  },
  // 11. Data Analyst - SQL Query Challenge
  {
    id: 'ch-data-01',
    title: 'Write SQL: District-wise Handloom Sales & Month-over-Month Growth',
    titleTamil: 'SQL வினவல்: கைத்தறி விற்பனை & மாத வளர்ச்சி விகிதம்',
    pathwayId: 'data-analyst',
    skillId: 'data-sql-queries',
    skillName: 'SQL Aggregations, Joins & Window Functions',
    difficulty: 'Intermediate',
    timeEstimate: '45 mins',
    type: 'code',
    description: 'Given two tables `districts` and `handloom_transactions`, write a SQL query using window functions (LAG) to compute total revenue and percentage growth month-over-month.',
    instructions: [
      'Join transactions with districts on district_id.',
      'Group by district_name and DATE_TRUNC("month", sale_date).',
      'Use LAG() OVER (PARTITION BY district_id ORDER BY month) to compute MoM growth percentage.',
      'Filter out districts with zero transactions.'
    ],
    rubric: [
      { criterion: 'Window Function Logic', weight: 45, description: 'Correct partitioning and ordering in LAG().' },
      { criterion: 'Division by Zero Guard', weight: 30, description: 'NULLIF usage when previous month revenue is zero.' },
      { criterion: 'Query Performance', weight: 25, description: 'Optimized join order and column selection.' }
    ],
    points: 160,
    completed: true,
    score: 89
  },
  // 12. Quick Viva - Tailor Bias Tape Cutting
  {
    id: 'ch-tailor-05',
    title: 'Viva: Why Must Bias Binding Be Cut at Exactly 45 Degrees?',
    titleTamil: 'வாய்மொழித் தேர்வு: பைப்பிங் துணி ஏன் 45 டிகிரியில் வெட்டப்பட வேண்டும்?',
    pathwayId: 'tailoring-craft',
    skillId: 'tailor-piping-finishing',
    skillName: 'Bias Binding & Neckline Piping',
    difficulty: 'Beginner',
    timeEstimate: '8 mins',
    type: 'viva',
    description: 'Explain in simple Tamil or English what happens to the warp and weft threads when fabric is pulled on the true bias versus straight grain.',
    instructions: [
      'Speak for 1-2 minutes or write a short note.',
      'Explain elasticity, curvature around round necks, and wrinkle prevention.'
    ],
    rubric: [
      { criterion: 'Grain Mechanics', weight: 50, description: 'Explains true bias weave elasticity vs straight grain rigidity.' },
      { criterion: 'Curve Conformation', weight: 35, description: 'Explains how bias hugs circular necklines without puckering.' },
      { criterion: 'Clarity of Expression', weight: 15, description: 'Natural and lucid communication.' }
    ],
    points: 90,
    completed: false
  }
];
