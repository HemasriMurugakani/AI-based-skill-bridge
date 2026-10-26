import { Persona } from '../types';

export const personas: Persona[] = [
  {
    id: 'priya-student',
    name: 'Priya Soundararajan',
    nameTamil: 'பிரியா சௌந்தரராஜன்',
    tag: 'BCA Final Year Student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Tiruchirappalli (Trichy), Tamil Nadu',
    pathwayId: 'junior-web-dev',
    bio: 'Self-motivated student from a Tier-3 college in Trichy. Building accessible web interfaces with clean semantic HTML and modern React to secure my first frontend developer role.',
    educationOrBackground: 'BCA 3rd Year, Jamal Mohamed College, Trichy',
    dailyTimeAvailable: '60 mins / day',
    preferredWork: 'Hybrid / Remote / Chennai tech corridor',
    streakDays: 18,
    xpPoints: 1420,
    readinessScore: 78,
    skillsAssessed: 5,
    skillsGap: 1,
    activeBadges: ['badge-first-proof', 'badge-wcag-champion', 'badge-tamil-voice-viva', 'badge-streak-7', 'badge-responsive-grid'],
    recentActivity: [
      { date: 'Today, 8:15 AM', action: 'Practiced Accessible Navbar keyboard focus challenge', type: 'challenge' },
      { date: 'Yesterday', action: 'Submitted Voice Viva: DOM event delegation explained in Tamil', type: 'proof' },
      { date: '3 days ago', action: 'Milestone completed: CSS Grid fluid layouts masterclass', type: 'roadmap' }
    ]
  },
  {
    id: 'lakshmi-vocational',
    name: 'Lakshmi Arumugam',
    nameTamil: 'லட்சுமி ஆறுமுகம்',
    tag: 'Vocational Artisan & SHG Member',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'Avinashi, Tiruppur District, Tamil Nadu',
    pathwayId: 'tailoring-craft',
    bio: 'Rural micro-entrepreneur and self-help group member. Proving precision pattern cutting and blouse tailoring skills with step-by-step photographic inspection to win boutique contracts.',
    educationOrBackground: 'SSLC + 6-month State Skill Mission Certificate, Tiruppur',
    dailyTimeAvailable: '45 mins / day',
    preferredWork: 'Local garment cluster / Boutique contract / Home-based work',
    streakDays: 26,
    xpPoints: 2180,
    readinessScore: 84,
    skillsAssessed: 4,
    skillsGap: 1,
    activeBadges: ['badge-first-proof', 'badge-precision-cutting', 'badge-streak-7', 'badge-streak-30', 'badge-mentor-approved'],
    recentActivity: [
      { date: 'Today, 7:00 AM', action: 'Uploaded photo proof: 5-Point Blouse measurement sheet (Score 94%)', type: 'proof' },
      { date: '2 days ago', action: 'Completed Katori paper pattern curvature inspection', type: 'challenge' },
      { date: '4 days ago', action: 'Mentor Senthil Nathan endorsed ease calculation precision', type: 'roadmap' }
    ]
  },
  {
    id: 'murugan-jobseeker',
    name: 'Murugan Palanisamy',
    nameTamil: 'முருகன் பழனிசாமி',
    tag: 'Career Transitioner & Aspiring Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Coimbatore, Tamil Nadu',
    pathwayId: 'data-analyst',
    bio: 'Transitioning from retail store inventory supervisor into data and business reporting. Proving SQL aggregations, Excel automation, and problem solving through evidence-backed work.',
    educationOrBackground: 'B.Com Commerce, Bharathiar University, Coimbatore',
    dailyTimeAvailable: '90 mins / day',
    preferredWork: 'Coimbatore / Erode / Remote',
    streakDays: 34,
    xpPoints: 2850,
    readinessScore: 81,
    skillsAssessed: 3,
    skillsGap: 1,
    activeBadges: ['badge-first-proof', 'badge-streak-7', 'badge-streak-30', 'badge-sql-craft'],
    recentActivity: [
      { date: 'Today, 9:30 AM', action: 'Solved SQL window function challenge for district sales', type: 'challenge' },
      { date: 'Yesterday', action: 'Exported validated Skill Passport PDF for interview share', type: 'roadmap' },
      { date: '3 days ago', action: 'Reached 30-day streak milestone with 2,500+ XP', type: 'proof' }
    ]
  }
];
