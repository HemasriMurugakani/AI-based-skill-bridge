import { Badge } from '../types';

export const badges: Badge[] = [
  {
    id: 'badge-first-proof',
    title: 'First Verified Proof',
    titleTamil: 'முதல் சரிபார்க்கப்பட்ட சான்று',
    category: 'proof',
    description: 'Submitted first reproducible code repository or physical craft photo verified by rubric evaluation.',
    isUnlocked: true,
    unlockedAt: '18 days ago',
    icon: 'ShieldCheck',
    evidenceNotes: 'Evidence-backed: Accessible portfolio header submission scored 92/100.',
    level: 'bronze'
  },
  {
    id: 'badge-wcag-champion',
    title: 'Accessibility Champion',
    titleTamil: 'அணுகல்தன்மை நாயகன்',
    category: 'mastery',
    description: 'Constructed keyboard-navigable components with zero critical accessibility errors in automated audits.',
    isUnlocked: true,
    unlockedAt: '12 days ago',
    icon: 'Eye',
    evidenceNotes: 'Evidence-backed: WCAG 2.1 AA keyboard trap prevention and screen reader tags validated.',
    level: 'silver'
  },
  {
    id: 'badge-tamil-voice-viva',
    title: 'Voice Viva Master',
    titleTamil: 'குரல் வழி விளக்கத் தேர்ச்சி',
    category: 'proof',
    description: 'Articulated complex technical concepts clearly in mother tongue (Tamil or Hindi) during viva evaluation.',
    isUnlocked: true,
    unlockedAt: '8 days ago',
    icon: 'Mic',
    evidenceNotes: 'Evidence-backed: Event delegation audio explanation scored 88/100 on rubric.',
    level: 'silver'
  },
  {
    id: 'badge-precision-cutting',
    title: 'Master Cutter',
    titleTamil: 'கைதேர்ந்த வெட்டுக்கலைஞர்',
    category: 'craft',
    description: 'Cut fabric patterns with less than 1.5mm deviation from grain line as verified by photo measurement.',
    isUnlocked: true,
    unlockedAt: '5 days ago',
    icon: 'Scissors',
    evidenceNotes: 'Evidence-backed: 4-Dart blouse pattern photo inspection passed with 87% precision.',
    level: 'silver'
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Consistent Learner',
    titleTamil: '7-நாள் தொடர் கற்றல்',
    category: 'streak',
    description: 'Maintained practice consistency for 7 consecutive days with logged proof submissions.',
    isUnlocked: true,
    unlockedAt: '14 days ago',
    icon: 'Flame',
    evidenceNotes: 'Evidence-backed: 7 days unbroken streak activity recorded in local tamper-evident log.',
    level: 'bronze'
  },
  {
    id: 'badge-streak-30',
    title: '30-Day Grit & Discipline',
    titleTamil: '30-நாள் விடாமுயற்சி சாதனை',
    category: 'streak',
    description: 'Demonstrated exceptional perseverance with 30 consecutive days of hands-on learning.',
    isUnlocked: true,
    unlockedAt: '3 days ago',
    icon: 'Zap',
    evidenceNotes: 'Evidence-backed: 30 days active learning logged with 42 verified milestones.',
    level: 'gold'
  },
  {
    id: 'badge-mentor-approved',
    title: 'Mentor Endorsed',
    titleTamil: 'வழிகாட்டி அங்கீகாரம்',
    category: 'mentor',
    description: 'Received a signed review from an industry or artisan master verifying workplace readiness.',
    isUnlocked: true,
    unlockedAt: 'Yesterday',
    icon: 'Award',
    evidenceNotes: 'Evidence-backed: Mentor K. Senthil Nathan (Coimbatore Tech Collective) signed verification.',
    level: 'gold'
  },
  {
    id: 'badge-clean-stitch',
    title: 'Export Quality Seam',
    titleTamil: 'ஏற்றுமதி தர தையல் தரம்',
    category: 'craft',
    description: 'Stitched a 10-inch straight lockstitch seam with zero thread loops and balanced bobbin tension.',
    isUnlocked: false,
    icon: 'CheckCircle2',
    evidenceNotes: 'Evidence-backed: Requires photo proof submission of lockstitch seam with inspection coin.',
    level: 'silver'
  },
  {
    id: 'badge-safe-wiring',
    title: 'Safety First Wireman',
    titleTamil: 'பாதுகாப்பு மின்சார பணியாளர்',
    category: 'craft',
    description: 'Assembled conduit wiring with zero exposed copper conductors adhering to IS 5216 standards.',
    isUnlocked: false,
    icon: 'AlertTriangle',
    evidenceNotes: 'Evidence-backed: Requires photo proof of two-way switch terminal blocks without bare copper.',
    level: 'silver'
  },
  {
    id: 'badge-sql-craft',
    title: 'SQL Data Wrangler',
    titleTamil: 'SQL தரவு ஆளுமை',
    category: 'proof',
    description: 'Constructed multi-table queries with window functions and null safety for business analytics.',
    isUnlocked: false,
    icon: 'Database',
    evidenceNotes: 'Evidence-backed: Requires automated test pass on district sales SQL challenge.',
    level: 'silver'
  },
  {
    id: 'badge-responsive-grid',
    title: 'Fluid Layout Architect',
    titleTamil: 'நெகிழ்வு வடிவமைப்பு நிபுணர்',
    category: 'proof',
    description: 'Engineered CSS Grid layouts scaling from 320px mobile to ultra-wide displays without horizontal scroll.',
    isUnlocked: true,
    unlockedAt: '4 days ago',
    icon: 'Layout',
    evidenceNotes: 'Evidence-backed: Kolam product card grid passed 320px responsive container test.',
    level: 'silver'
  },
  {
    id: 'badge-village-impact',
    title: 'Rural Community Builder',
    titleTamil: 'கிராமப்புற சமூக மேம்பாட்டாளர்',
    category: 'mentor',
    description: 'Supported local self-help group (SHG) members with digital literacy or vocational skill coaching.',
    isUnlocked: false,
    icon: 'Users',
    evidenceNotes: 'Evidence-backed: Peer review endorsement from local SHG federation coordinator.',
    level: 'gold'
  },
  {
    id: 'badge-speedy-debugger',
    title: 'Bug Hunter',
    titleTamil: 'பிழை கண்டறிந்து தீர்ப்பவர்',
    category: 'mastery',
    description: 'Resolved runtime asynchronous race conditions and memory leaks within 30 minutes.',
    isUnlocked: false,
    icon: 'Cpu',
    evidenceNotes: 'Evidence-backed: Solved AbortController cancellation challenge on first try.',
    level: 'bronze'
  },
  {
    id: 'badge-bias-piping',
    title: 'Piping & Neckline Artisan',
    titleTamil: 'பைப்பிங் & கழுத்து வடிவமைப்பு கலைஞர்',
    category: 'craft',
    description: 'Finished a round neck blouse with uniform bias cord piping and zero gather wrinkles.',
    isUnlocked: false,
    icon: 'Sparkles',
    evidenceNotes: 'Evidence-backed: Requires photo proof of neckline front and interior bias tape finish.',
    level: 'gold'
  },
  {
    id: 'badge-top-readiness',
    title: 'Workplace Ready (85%+)',
    titleTamil: 'பணிக்கு முழு தயார்நிலை (85%+)',
    category: 'mastery',
    description: 'Achieved an overall verified readiness score of 85% or higher across all required pathway skills.',
    isUnlocked: false,
    icon: 'Trophy',
    evidenceNotes: 'Evidence-backed: Computed aggregate of code proof, viva assessments, and mentor reviews.',
    level: 'diamond'
  },
  {
    id: 'badge-responsive-profile',
    title: 'Profile Craftsman',
    titleTamil: 'சுயவிவரப் பக்க கலைஞர்',
    category: 'proof',
    description: 'Built a production-grade responsive profile page verified for 0 horizontal overflow at 320px mobile viewports.',
    isUnlocked: false,
    icon: 'Layout',
    evidenceNotes: 'Evidence-backed: Responsive profile challenge verified with 98% rubric score.',
    level: 'gold'
  },
  {
    id: 'badge-professional-pitch',
    title: 'Professional Voice Communicator',
    titleTamil: 'தொழில்முறை குரல் தொடர்பாளர்',
    category: 'proof',
    description: 'Delivered a crisp, evidence-backed bilingual introduction within 45 seconds verified by rubric evaluation.',
    isUnlocked: false,
    icon: 'Mic',
    evidenceNotes: 'Evidence-backed: Professional introduction challenge verified with 96% rubric score.',
    level: 'gold'
  }
];
