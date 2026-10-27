export interface CandidateArtifact {
  id: string;
  title: string;
  type: 'code_pr' | 'photo_inspection' | 'viva_recording' | 'dataset_query';
  summary: string;
  rubricScore: number;
  completedAt: string;
  verificationHash: string;
  criteriaMet: string[];
  sampleOutputOrUrl: string;
}

export interface EmployerCandidate {
  id: string;
  name: string;
  nameTamil: string;
  avatar: string;
  district: string;
  pathwayId: string;
  targetRole: string;
  education: string;
  demonstratedScore: number; // Rubric score average across demonstrated skills
  evidenceCount: number; // Number of verified code / photo proofs
  mentorVerified: boolean;
  mentorName: string;
  vivaConfidence: 'Consistent' | 'Needs follow-up';
  vivaScore: number;
  vivaCadenceWpm: number;
  vivaClarity: number;
  readinessScore: number;
  streakDays: number;
  demonstratedSkills: {
    skillName: string;
    skillNameTamil?: string;
    score: number;
    level: number;
    evidenceCount: number;
  }[];
  artifacts: CandidateArtifact[];
  vivaQAs: {
    question: string;
    questionTamil?: string;
    answer: string;
    score: number;
    note: string;
  }[];
  mentorStatement: string;
}

export interface PracticalChallenge {
  id: string;
  title: string;
  role: string;
  pathwayId: string;
  description: string;
  requiredSkills: string[];
  minScoreThreshold: number;
  rubric: {
    id: string;
    criterion: string;
    weight: number;
    description: string;
  }[];
  timeEstimate: string;
  createdAt: string;
  applicantCount: number;
}

export const initialPracticalChallenges: PracticalChallenge[] = [
  {
    id: 'pc-frontend-trainee',
    title: 'Low-Latency Responsive Product Table with Keyboard Navigation',
    role: 'Junior React Frontend Trainee',
    pathwayId: 'junior-web-dev',
    description: 'Construct an accessible product directory with debounced search, responsive CSS grid scaling without 320px overflow, and visible WCAG AA focus indicators.',
    requiredSkills: ['Semantic HTML & Accessibility', 'Responsive CSS & Flex/Grid', 'JavaScript & DOM Manipulation', 'React Components & Hooks'],
    minScoreThreshold: 75,
    rubric: [
      { id: 'r-01', criterion: 'Semantic HTML5 Landmarks & ARIA Labels', weight: 25, description: 'Proper table, header, skip-link, and accessible button roles.' },
      { id: 'r-02', criterion: 'Zero 320px Viewport Horizontal Overflow', weight: 30, description: 'Strict 0-overflow compliance on narrow mobile viewport widths.' },
      { id: 'r-03', criterion: 'Keyboard Focus-Visible Navigation', weight: 25, description: 'High-contrast visible focus outline (>=3px) for tab traversal.' },
      { id: 'r-04', criterion: 'Oral Architecture Tradeoff Articulation', weight: 20, description: 'Explains state machine and DOM tradeoff decisions in viva defense.' }
    ],
    timeEstimate: '45 mins',
    createdAt: 'Active benchmark',
    applicantCount: 18
  },
  {
    id: 'pc-garment-craft',
    title: '5-Point Precision Blouse Ease Allowance & Seam Calibration',
    role: 'Master Pattern Cutter & Sample Tailor',
    pathwayId: 'tailoring-craft',
    description: 'Draft, cut, and calibrate a blouse pattern ensuring exact 1.5-inch ease allowances, neckline bias binding, and photographic measurement verification.',
    requiredSkills: ['Body Measurement & Ease Allowances', 'Fabric Grain & Precision Scissor Cutting', 'Industrial Machine Operation', 'Neckline Piping & Seam Tolerances'],
    minScoreThreshold: 75,
    rubric: [
      { id: 'r-11', criterion: '1.5-Inch Ease Allowance Precision', weight: 35, description: 'Exact dimensional ease applied across bust and waist seams.' },
      { id: 'r-12', criterion: 'Neckline Bias Binding Uniformity', weight: 25, description: 'Clean curvature piping without fabric puckering or stretching.' },
      { id: 'r-13', criterion: 'Step-by-Step Photographic QC Inspection', weight: 25, description: 'Photo proofs demonstrating measurement tape calibration.' },
      { id: 'r-14', criterion: 'Spoken Rationale on Fabric Grain Alignment', weight: 15, description: 'Oral explanation of true cross-grain vs bias cutting choices.' }
    ],
    timeEstimate: '60 mins',
    createdAt: 'Active benchmark',
    applicantCount: 12
  },
  {
    id: 'pc-data-reporting',
    title: 'SQL District Sales Discrepancy & Inventory Audit Pipeline',
    role: 'Junior Data Analyst',
    pathwayId: 'data-analyst',
    description: 'Write robust SQL queries joining sales, warehouse inventory, and transit logs to flag reconciliation anomalies and generate district summaries.',
    requiredSkills: ['SQL Aggregations & Query Optimization', 'Spreadsheet Automation & Pivot Modeling', 'Data Cleaning & Anomaly Detection'],
    minScoreThreshold: 75,
    rubric: [
      { id: 'r-21', criterion: 'Multi-Table SQL Join Optimization', weight: 35, description: 'Zero Cartesian products, clean indexing, and group by filters.' },
      { id: 'r-22', criterion: 'Anomaly Detection Logic', weight: 30, description: 'Accurate window function logic flagging >5% discrepancies.' },
      { id: 'r-23', criterion: 'Oral Rationale Defense', weight: 35, description: 'Candidate articulates query execution plan in viva interview.' }
    ],
    timeEstimate: '45 mins',
    createdAt: 'Active benchmark',
    applicantCount: 14
  }
];

export const employerCandidates: EmployerCandidate[] = [
  {
    id: 'priya-soundararajan',
    name: 'Priya Soundararajan',
    nameTamil: 'பிரியா சௌந்தரராஜன்',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruchirappalli (Trichy)',
    pathwayId: 'junior-web-dev',
    targetRole: 'Junior Frontend Developer',
    education: 'BCA Final Year (3rd Year), Jamal Mohamed College, Trichy',
    demonstratedScore: 91,
    evidenceCount: 5,
    mentorVerified: true,
    mentorName: 'K. Senthil Nathan',
    vivaConfidence: 'Consistent',
    vivaScore: 92,
    vivaCadenceWpm: 124,
    vivaClarity: 90,
    readinessScore: 78,
    streakDays: 18,
    demonstratedSkills: [
      { skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', score: 88, level: 4, evidenceCount: 3 },
      { skillName: 'JavaScript & DOM Manipulation', skillNameTamil: 'ஜாவாஸ்கிரிப்ட் மற்றும் DOM கையாளுதல்', score: 85, level: 4, evidenceCount: 4 },
      { skillName: 'Responsive CSS & Flex/Grid', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', score: 92, level: 4, evidenceCount: 3 },
      { skillName: 'React Components & Hooks', skillNameTamil: 'ரியாக்ட் கூறுகள் மற்றும் ஹூக்ஸ்', score: 86, level: 3, evidenceCount: 2 }
    ],
    artifacts: [
      {
        id: 'art-01',
        title: 'Responsive Artisan Profile Portal',
        type: 'code_pr',
        summary: 'Production-ready web layout with clamp() typography, semantic HTML landmarks, zero horizontal overflow on 320px viewport, and WCAG AA keyboard skip-link.',
        rubricScore: 92,
        completedAt: 'Yesterday',
        verificationHash: 'sha256:7b92f4e823b1...a90f',
        criteriaMet: [
          '0-overflow strictly enforced at 320px width',
          ':focus-visible 3px gold contrast outlines',
          'Semantic header, nav, main, section tags'
        ],
        sampleOutputOrUrl: 'https://github.com/priya-tn-dev/responsive-profile'
      },
      {
        id: 'art-02',
        title: 'DOM Event Delegation Search Filter',
        type: 'code_pr',
        summary: 'Vanilla JavaScript event delegation handler supporting rapid keyboard navigation, debounce filtering, and memory leak prevention.',
        rubricScore: 89,
        completedAt: '3 days ago',
        verificationHash: 'sha256:4d83a1c900e2...f51b',
        criteriaMet: [
          'Single parent event listener for 100+ items',
          'Custom cleanup on container unmount',
          'ARIA-live regions for screen readers'
        ],
        sampleOutputOrUrl: 'https://github.com/priya-tn-dev/dom-event-delegation'
      }
    ],
    vivaQAs: [
      {
        question: 'Why did you choose flexbox over grid for the navigation bar layout?',
        questionTamil: 'வழிசெலுத்தல் பட்டிக்கு கிரிட்டிற்கு பதிலாக ஃப்ளெக்ஸ்பாக்ஸை ஏன் தேர்வு செய்தீர்கள்?',
        answer: 'I chose flexbox because the navbar is a 1-dimensional horizontal row where space-between alignment and intrinsic content sizing are required. Grid adds unnecessary two-dimensional track overhead.',
        score: 94,
        note: 'Articulated 1D vs 2D layout semantics with high clarity.'
      },
      {
        question: 'How did you ensure zero horizontal scrolling on a 320px narrow mobile viewport?',
        questionTamil: '320 பிக்சல் மொபைல் திரையில் கிடைமட்ட உருளல் இல்லாமல் இருக்க என்ன செய்தீர்கள்?',
        answer: 'I removed rigid min-width rules, used fluid clamp() padding, and applied flex: 1 1 280px with min-width: 0 on all flex children.',
        score: 90,
        note: 'Directly addresses mobile viewport constraint handling.'
      }
    ],
    mentorStatement: 'Priya writes reproducible, clean semantic code with genuine care for accessibility. Her oral defense demonstrates authentic, independent problem solving.'
  },
  {
    id: 'lakshmi-arumugam',
    name: 'Lakshmi Arumugam',
    nameTamil: 'லட்சுமி ஆறுமுகம்',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    district: 'Avinashi, Tiruppur',
    pathwayId: 'tailoring-craft',
    targetRole: 'Garment Finishing & Sample Maker',
    education: 'SSLC + 6-month State Skill Mission Certificate, Tiruppur',
    demonstratedScore: 93,
    evidenceCount: 6,
    mentorVerified: true,
    mentorName: 'K. Senthil Nathan',
    vivaConfidence: 'Consistent',
    vivaScore: 94,
    vivaCadenceWpm: 118,
    vivaClarity: 92,
    readinessScore: 84,
    streakDays: 26,
    demonstratedSkills: [
      { skillName: 'Body Measurement & Ease Allowances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு கணக்கீடு', score: 91, level: 4, evidenceCount: 5 },
      { skillName: 'Fabric Grain & Precision Scissor Cutting', skillNameTamil: 'துணி இழை & கத்தரி வெட்டுதல்', score: 94, level: 4, evidenceCount: 4 },
      { skillName: 'Neckline Piping & Seam Tolerances', skillNameTamil: 'கழுத்து பைப்பிங் & தையல் இடைவெளி', score: 89, level: 4, evidenceCount: 3 }
    ],
    artifacts: [
      {
        id: 'art-03',
        title: '5-Point Calibrated Blouse Pattern Sheet',
        type: 'photo_inspection',
        summary: 'Photographic quality control sheet verifying 1.5-inch ease tolerances across bust, waist, and armhole circumference for sample blouse drafting.',
        rubricScore: 94,
        completedAt: 'Today',
        verificationHash: 'sha256:1a82f9c314de...88aa',
        criteriaMet: [
          'Precise 1.5-inch ease across all seams',
          'Accurate Katori pattern curvature',
          'Step-by-step verified tape calibration'
        ],
        sampleOutputOrUrl: 'https://skillbridge.tn.gov.in/proofs/lakshmi-blouse-qc.jpg'
      }
    ],
    vivaQAs: [
      {
        question: 'How do you align the fabric grain line when cutting Katori pattern cups?',
        questionTamil: 'கடோரி வடிவமைப்பு வெட்டும்போது துணி இழையை எப்படி சீரமைப்பீர்கள்?',
        answer: 'The center cup must be placed strictly on the true bias (45 degrees) to allow natural chest expansion, while the side belt is placed on the straight grain for structural support.',
        score: 95,
        note: 'Exceptional master craftsman knowledge of bias drape vs straight grain support.'
      }
    ],
    mentorStatement: 'Lakshmi exhibits master tailor precision. Her photographic QC proofs and bias piping accuracy are on par with export garment house standards.'
  },
  {
    id: 'murugan-palanisamy',
    name: 'Murugan Palanisamy',
    nameTamil: 'முருகன் பழனிசாமி',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    district: 'Coimbatore',
    pathwayId: 'data-analyst',
    targetRole: 'Junior Business Reporting Analyst',
    education: 'B.Com Commerce, Bharathiar University, Coimbatore',
    demonstratedScore: 88,
    evidenceCount: 4,
    mentorVerified: true,
    mentorName: 'Dr. R. Kalyani',
    vivaConfidence: 'Consistent',
    vivaScore: 89,
    vivaCadenceWpm: 122,
    vivaClarity: 88,
    readinessScore: 81,
    streakDays: 34,
    demonstratedSkills: [
      { skillName: 'SQL Aggregations & Query Optimization', skillNameTamil: 'SQL திரட்டு வினவல்கள்', score: 87, level: 4, evidenceCount: 4 },
      { skillName: 'Spreadsheet Automation & Pivot Modeling', skillNameTamil: 'எக்செல் ஆட்டோமேஷன் & பிவட் அட்டவணை', score: 84, level: 4, evidenceCount: 3 },
      { skillName: 'Data Cleaning & Anomaly Detection', skillNameTamil: 'தரவு சுத்திகரிப்பு', score: 91, level: 4, evidenceCount: 3 }
    ],
    artifacts: [
      {
        id: 'art-04',
        title: 'District Retail Inventory Discrepancy Script',
        type: 'dataset_query',
        summary: 'Multi-table SQL script joining POS receipts, warehouse manifests, and returns with window functions to flag inventory shrinkage.',
        rubricScore: 91,
        completedAt: 'Yesterday',
        verificationHash: 'sha256:9c72e1a84f33...11ba',
        criteriaMet: [
          'No Cartesian products, indexed inner joins',
          'Rolling 7-day average shrinkage flag',
          'Exported to clean Excel pivot summary'
        ],
        sampleOutputOrUrl: 'https://github.com/murugan-data/inventory-reconciliation-sql'
      }
    ],
    vivaQAs: [
      {
        question: 'Why did you use a window function instead of a subquery for the running totals?',
        questionTamil: 'இயங்கும் மொத்தங்களுக்கு துணைக் கேள்விக்கு பதிலாக விண்டோ செயல்பாட்டை ஏன் பயன்படுத்தினீர்கள்?',
        answer: 'Window functions like SUM() OVER (PARTITION BY store_id ORDER BY trans_date) compute rolling metrics in a single pass without redundant table scans required by correlated subqueries.',
        score: 90,
        note: 'Accurately articulated single-pass query performance advantage.'
      }
    ],
    mentorStatement: 'Murugan blends practical commercial accounting with clean SQL logic. Highly disciplined and ready for immediate operational reporting roles.'
  },
  {
    id: 'ananya-ramesh',
    name: 'Ananya Ramesh',
    nameTamil: 'அனன்யா ரமேஷ்',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    district: 'Chennai',
    pathwayId: 'junior-web-dev',
    targetRole: 'Junior Frontend Developer',
    education: 'B.Sc Computer Science, Madras University',
    demonstratedScore: 89,
    evidenceCount: 4,
    mentorVerified: true,
    mentorName: 'K. Senthil Nathan',
    vivaConfidence: 'Consistent',
    vivaScore: 88,
    vivaCadenceWpm: 126,
    vivaClarity: 87,
    readinessScore: 82,
    streakDays: 21,
    demonstratedSkills: [
      { skillName: 'Semantic HTML & Accessibility', score: 92, level: 4, evidenceCount: 4 },
      { skillName: 'Responsive CSS & Flex/Grid', score: 86, level: 4, evidenceCount: 3 },
      { skillName: 'JavaScript & DOM Manipulation', score: 89, level: 4, evidenceCount: 3 }
    ],
    artifacts: [
      {
        id: 'art-05',
        title: 'Accessible Form Validator with Live Announcements',
        type: 'code_pr',
        summary: 'Form validation module with aria-invalid updates, error announcements via aria-live, and strict client-side regex parsing.',
        rubricScore: 90,
        completedAt: '2 days ago',
        verificationHash: 'sha256:6e11a3b82...c09f',
        criteriaMet: [
          'Live screen reader polite announcements',
          'High-contrast inline error indicators',
          'Keyboard focus shifted to first invalid field'
        ],
        sampleOutputOrUrl: 'https://github.com/ananya-web/accessible-forms'
      }
    ],
    vivaQAs: [
      {
        question: 'How do you alert screen readers to asynchronous form validation errors?',
        questionTamil: 'படிவ பிழைகளை திரை வாசிப்பான்களுக்கு எப்படி அறிவிப்பீர்கள்?',
        answer: 'I use aria-live="polite" on the error container and dynamically update aria-describedby on the relevant input so the error is read immediately upon focus.',
        score: 92,
        note: 'Solid comprehension of screen reader announcement lifecycles.'
      }
    ],
    mentorStatement: 'Ananya demonstrates excellent frontend accessibility standards. Clean git hygiene and clear commit documentation.'
  },
  {
    id: 'vignesh-kumar',
    name: 'Vignesh Kumar',
    nameTamil: 'விக்னேஷ் குமார்',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    district: 'Madurai',
    pathwayId: 'junior-web-dev',
    targetRole: 'React Frontend Trainee',
    education: 'Diploma in Computer Engineering, Govt Polytechnic, Madurai',
    demonstratedScore: 84,
    evidenceCount: 3,
    mentorVerified: false,
    mentorName: 'Pending state signoff',
    vivaConfidence: 'Consistent',
    vivaScore: 82,
    vivaCadenceWpm: 120,
    vivaClarity: 82,
    readinessScore: 71,
    streakDays: 14,
    demonstratedSkills: [
      { skillName: 'JavaScript & DOM Manipulation', score: 84, level: 3, evidenceCount: 3 },
      { skillName: 'Responsive CSS & Flex/Grid', score: 80, level: 3, evidenceCount: 2 }
    ],
    artifacts: [
      {
        id: 'art-06',
        title: 'Mobile-First Pricing Calculator',
        type: 'code_pr',
        summary: 'Fluid pricing tier selector with interactive sliders and zero horizontal scroll on mobile.',
        rubricScore: 84,
        completedAt: '4 days ago',
        verificationHash: 'sha256:55ab29c01...d8e3',
        criteriaMet: ['CSS Grid auto-fit tracks', 'Touch-friendly tap targets >= 44px'],
        sampleOutputOrUrl: 'https://github.com/vignesh-madurai/pricing-calc'
      }
    ],
    vivaQAs: [
      {
        question: 'What is the purpose of min-width: 0 on flex children?',
        questionTamil: 'ஃப்ளெக்ஸ் கூறுகளில் min-width: 0 பயன்பாடு என்ன?',
        answer: 'By default, flex items have min-width: auto which prevents them from shrinking below their content size. Setting min-width: 0 allows them to shrink cleanly on narrow screens without overflow.',
        score: 86,
        note: 'Accurately explained flex shrinkage mechanics.'
      }
    ],
    mentorStatement: 'Vignesh has strong potential and solid layout fundamentals. Pending final mentor audit for full credential issuance.'
  },
  {
    id: 'meenakshi-sundaram',
    name: 'Meenakshi Sundaram',
    nameTamil: 'மீனாட்சி சுந்தரம்',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruppur',
    pathwayId: 'tailoring-craft',
    targetRole: 'Apparel Quality Assurance Inspector',
    education: 'Vocational Higher Secondary (Garments), Tiruppur',
    demonstratedScore: 90,
    evidenceCount: 5,
    mentorVerified: true,
    mentorName: 'K. Senthil Nathan',
    vivaConfidence: 'Consistent',
    vivaScore: 91,
    vivaCadenceWpm: 116,
    vivaClarity: 90,
    readinessScore: 82,
    streakDays: 29,
    demonstratedSkills: [
      { skillName: 'Body Measurement & Ease Allowances', score: 88, level: 4, evidenceCount: 4 },
      { skillName: 'Neckline Piping & Seam Tolerances', score: 92, level: 4, evidenceCount: 4 }
    ],
    artifacts: [
      {
        id: 'art-07',
        title: 'Export Batch Seam Tension Audit',
        type: 'photo_inspection',
        summary: 'Defect logging sheet and high-resolution photo proof analyzing seam puckering on woven poplin cotton.',
        rubricScore: 92,
        completedAt: 'Yesterday',
        verificationHash: 'sha256:88fa2b109...321c',
        criteriaMet: ['SPI stitch density measured at 12 stitches/inch', 'Differential feed ratio calibrated'],
        sampleOutputOrUrl: 'https://skillbridge.tn.gov.in/proofs/meenakshi-tension-audit.jpg'
      }
    ],
    vivaQAs: [
      {
        question: 'How do you detect bobbin tension imbalances before cutting bulk fabric?',
        questionTamil: 'நூல் இழுவிசை ஏற்றத்தாழ்வை எப்படி கண்டறிவீர்கள்?',
        answer: 'I sew a test swatch on matching fabric folded on bias. If bottom thread loops appear on top, upper tension is too high or bobbin case screw is loose.',
        score: 93,
        note: 'Practical workshop diagnostic troubleshooting verified.'
      }
    ],
    mentorStatement: 'Meenakshi has sharp inspection discipline and thorough knowledge of industrial stitching tensions.'
  },
  {
    id: 'dinesh-pandian',
    name: 'Dinesh Pandian',
    nameTamil: 'தினேஷ் பாண்டியன்',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    district: 'Salem',
    pathwayId: 'data-analyst',
    targetRole: 'Operations Reporting Specialist',
    education: 'B.Sc Mathematics, Periyar University, Salem',
    demonstratedScore: 86,
    evidenceCount: 3,
    mentorVerified: true,
    mentorName: 'Dr. R. Kalyani',
    vivaConfidence: 'Consistent',
    vivaScore: 87,
    vivaCadenceWpm: 125,
    vivaClarity: 86,
    readinessScore: 79,
    streakDays: 19,
    demonstratedSkills: [
      { skillName: 'SQL Aggregations & Query Optimization', score: 86, level: 3, evidenceCount: 3 },
      { skillName: 'Data Cleaning & Anomaly Detection', score: 88, level: 4, evidenceCount: 3 }
    ],
    artifacts: [
      {
        id: 'art-08',
        title: 'Warehouse Dispatch Latency Analysis',
        type: 'dataset_query',
        summary: 'SQL script identifying dispatch bottlenecks by calculating median order turnaround time across Salem textile clusters.',
        rubricScore: 88,
        completedAt: '3 days ago',
        verificationHash: 'sha256:321ef9a01...881a',
        criteriaMet: ['PERCENTILE_CONT window functions used', 'Indexed warehouse dispatch timestamps'],
        sampleOutputOrUrl: 'https://github.com/dinesh-salem/warehouse-latency-sql'
      }
    ],
    vivaQAs: [
      {
        question: 'Why calculate median instead of arithmetic mean for dispatch turnaround times?',
        questionTamil: 'சராசரிக்கு பதிலாக இடைநிலையை (median) ஏன் கணக்கிட்டீர்கள்?',
        answer: 'Order dispatches have extreme outliers when consignments are delayed by heavy monsoon rain. Mean is skewed by outliers, while median gives the true representative turnaround.',
        score: 90,
        note: 'Sound statistical intuition applied to industrial operations.'
      }
    ],
    mentorStatement: 'Dinesh possesses solid mathematical foundation and pragmatic SQL querying instincts.'
  }
];
