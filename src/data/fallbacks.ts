// Strict fallback responses for all AI proxy endpoints used during timeout, error, or Offline Demo mode

export interface JdExtractResponse {
  jobTitle: string;
  companyName: string;
  pathwayRecommendation: string;
  extractedSkills: {
    skillName: string;
    requiredLevel: number; // 1 to 5
    importance: 'Mandatory' | 'Preferred' | 'Bonus';
    category: string;
  }[];
  matchedExistingSkills: string[];
  detectedSkillGaps: string[];
  readinessEstimate: number; // 0 to 100
  summaryTamil: string;
  summaryEnglish: string;
}

export const fallbackJdExtract: JdExtractResponse = {
  jobTitle: "Junior Frontend Engineer (React/TypeScript)",
  companyName: "Vaigai Digital Solutions, Chennai",
  pathwayRecommendation: "Junior Web Developer",
  extractedSkills: [
    { skillName: "Semantic HTML & Accessibility", requiredLevel: 4, importance: "Mandatory", category: "Core Frontend" },
    { skillName: "Responsive CSS & Flex/Grid", requiredLevel: 3, importance: "Mandatory", category: "Styling" },
    { skillName: "JavaScript & DOM Manipulation", requiredLevel: 4, importance: "Mandatory", category: "Logic" },
    { skillName: "React Components & Hooks", requiredLevel: 3, importance: "Mandatory", category: "UI Architecture" },
    { skillName: "REST API & State Caching", requiredLevel: 3, importance: "Mandatory", category: "State Management" },
    { skillName: "Git Version Control", requiredLevel: 2, importance: "Preferred", category: "Dev Tools" }
  ],
  matchedExistingSkills: [
    "Semantic HTML & Accessibility (Level 4)",
    "JavaScript & DOM Manipulation (Level 4)",
    "Responsive CSS & Flex/Grid (Level 3)"
  ],
  detectedSkillGaps: [
    "REST API & State Caching (Current Level 2 vs Required Level 3)",
    "Git Version Control (Not assessed yet)"
  ],
  readinessEstimate: 78,
  summaryTamil: "இந்த வேலை வாய்ப்பிற்கு உங்கள் அணுகல்தன்மை மற்றும் ஜாவாஸ்கிரிப்ட் திறன்கள் மிகச் சிறந்தது. REST API மற்றும் கிட் பதிப்புக் கட்டுப்பாட்டில் சிறிய இடைவெளி உள்ளது.",
  summaryEnglish: "Strong match on accessibility and core JavaScript logic. Recommended to bridge REST API caching and complete Git PR verification challenge to reach 90%+ match."
};

export interface RubricFeedbackResponse {
  submissionId: string;
  overallScore: number; // 0 to 100
  status: 'ai_reviewed' | 'mentor_verified' | 'pending_mentor';
  verificationLevel: string;
  feedbackCriteria: {
    criterion: string;
    scoreGiven: number;
    maxScore: number;
    observations: string;
    strengths: string;
    actionableImprovement: string;
  }[];
  codeSmellsOrFlawsDetected: string[];
  keyStrengthsHighlighted: string[];
  rubricTamilSummary: string;
  rubricEnglishSummary: string;
  badgeEligible?: string;
}

export const fallbackRubricFeedback: RubricFeedbackResponse = {
  submissionId: "sub-74892",
  overallScore: 88,
  status: "ai_reviewed",
  verificationLevel: "Level 3 - Evidence-backed Project Proof",
  feedbackCriteria: [
    {
      criterion: "Semantic HTML Landmarks & Structure",
      scoreGiven: 28,
      maxScore: 30,
      observations: "Clear use of <header>, <nav role='navigation'>, <main>, and <button> elements throughout.",
      strengths: "Accessible landmark nesting adheres to W3C ARIA standards.",
      actionableImprovement: "Include a visible 'Skip to main content' anchor link at the top of the body."
    },
    {
      criterion: "Keyboard Trapping & Focus Rings",
      scoreGiven: 36,
      maxScore: 40,
      observations: "Tab cycle traverses all interactive controls smoothly. Visible outline on :focus-visible.",
      strengths: "Custom sky blue focus ring (outline: 2px solid #62B6E8) maintains WCAG AA contrast against clean surface.",
      actionableImprovement: "Trap keyboard focus when the mobile drawer overlay is opened."
    },
    {
      criterion: "ARIA Attributes & Voiceover Labels",
      scoreGiven: 24,
      maxScore: 30,
      observations: "aria-expanded and aria-controls toggle accurately with navbar state.",
      strengths: "Meaningful labels for screen reader users without clutter.",
      actionableImprovement: "Add aria-current='page' to the active navigation link."
    }
  ],
  codeSmellsOrFlawsDetected: [
    "Minor: Missing skip-link for keyboard power users.",
    "Notice: Mobile menu backdrop lacks Esc-key listener."
  ],
  keyStrengthsHighlighted: [
    "High contrast color tokens (ratio 5.8:1 exceeds AA threshold).",
    "Clean semantic markup without generic <div> soup."
  ],
  rubricTamilSummary: "உங்கள் குறியீடு அணுகல்தன்மை விதிகளுக்கு மிகவும் சிறப்பாக பொருந்துகிறது. விசைப்பலகை இயக்கம் மற்றும் திரை வாசிப்பான் லேபிள்கள் நேர்த்தியாக உள்ளன.",
  rubricEnglishSummary: "Excellent adherence to semantic standards. Score 88/100 validates Level 3 mastery. Fix the mobile escape listener to advance to mentor sign-off.",
  badgeEligible: "Accessibility Champion"
};

export interface PhotoReviewResponse {
  submissionId: string;
  craftType: 'tailoring' | 'electrical' | 'handloom' | 'general';
  inspectionScore: number;
  status: 'ai_reviewed';
  findings: {
    checkPoint: string;
    passed: boolean;
    confidence: number;
    notes: string;
  }[];
  geometricMeasurements: {
    feature: string;
    measuredValue: string;
    toleranceExpected: string;
    status: 'Within Tolerance' | 'Slight Deviation' | 'Needs Recut';
  }[];
  craftAdviceTamil: string;
  craftAdviceEnglish: string;
  safetyOrQCStatus: 'PASS - Export Grade' | 'PASS - Commercial Grade' | 'RE-STITCH / ADJUST';
}

export const fallbackPhotoReview: PhotoReviewResponse = {
  submissionId: "photo-sub-9012",
  craftType: "tailoring",
  inspectionScore: 92,
  status: "ai_reviewed",
  findings: [
    {
      checkPoint: "True 45-Degree Bias Angle Alignment",
      passed: true,
      confidence: 0.96,
      notes: "Fabric grain lines verify 44.5° cut angle, providing optimal elasticity for round neck curves."
    },
    {
      checkPoint: "Stitch Density & Uniformity",
      passed: true,
      confidence: 0.94,
      notes: "Consistent 10.2 stitches per inch measured across 8-inch seam segment."
    },
    {
      checkPoint: "Tension Balance (No Top/Bottom Loops)",
      passed: true,
      confidence: 0.91,
      notes: "Lockstitch knot buried cleanly in the middle fabric layer without puckering."
    },
    {
      checkPoint: "Seam Margin Consistency",
      passed: true,
      confidence: 0.89,
      notes: "Maintained 0.25 inch margin with under 0.8mm variance."
    }
  ],
  geometricMeasurements: [
    { feature: "Bias Angle", measuredValue: "44.5°", toleranceExpected: "45° ± 2°", status: "Within Tolerance" },
    { feature: "Stitch Count", measuredValue: "10 stitches/in", toleranceExpected: "10-11 SPI", status: "Within Tolerance" },
    { feature: "Seam Allowance", measuredValue: "6.2 mm", toleranceExpected: "6.35 mm (1/4 in)", status: "Within Tolerance" }
  ],
  craftAdviceTamil: "தையல் தரம் மற்றும் விளிம்பு வளைவு மிக நேர்த்தியாக அமைந்துள்ளது. ஏற்றுமதி தரத்திற்கான தையல் அடர்த்தி (10 SPI) சரியாக உள்ளது. அயர்னிங் செய்த பின் வழிகாட்டி ஒப்புதலுக்கு அனுப்பலாம்.",
  craftAdviceEnglish: "Superb seam tension and bias angle alignment. The seam allowance variance is under 0.8mm, easily qualifying for boutique bridal finishing standard.",
  safetyOrQCStatus: "PASS - Export Grade"
};

export interface VivaQuestionResponse {
  sessionId: string;
  questionNumber: number;
  totalQuestions: number;
  questionTextEnglish: string;
  questionTextTamil: string;
  questionContext: string;
  suggestedFocusPoints: string[];
}

export const fallbackVivaQuestion: VivaQuestionResponse = {
  sessionId: "viva-sess-301",
  questionNumber: 2,
  totalQuestions: 3,
  questionTextEnglish: "How does DOM event delegation improve web page memory usage when handling large lists of items?",
  questionTextTamil: "அதிக பொருட்கள் கொண்ட பட்டியலில் DOM நிகழ்வு பரிமாற்றம் (Event Delegation) எவ்வாறு நினைவக பயன்பாட்டை மிச்சப்படுத்துகிறது?",
  questionContext: "Imagine an e-commerce catalog showing 500 handloom sarees with click-to-view buttons.",
  suggestedFocusPoints: [
    "Attaching 1 listener to parent <ul> vs 500 listeners on each button",
    "Event bubbling phase (event.target checking)",
    "Handling dynamically added items without re-binding"
  ]
};

export interface VivaScoreResponse {
  sessionId: string;
  overallScore: number; // 0 to 100
  feedbackTamil: string;
  feedbackEnglish: string;
  conceptualAccuracy: number;
  clarityOfExpression: number;
  practicalApplication: number;
  highlights: string[];
  recommendedFollowup: string;
}

export const fallbackVivaScore: VivaScoreResponse = {
  sessionId: "viva-sess-301",
  overallScore: 89,
  feedbackTamil: "உங்கள் விளக்கம் மிகத் தெளிவாக இருந்தது. பெற்றோர் கூறில் (Parent element) ஒரு நிகழ்வு கேட்பானை வைத்து மெமரியை மிச்சப்படுத்துவதை அழகாக விளக்கினீர்கள்.",
  feedbackEnglish: "Terrific grasp of DOM event bubbling mechanics. Clearly distinguished between event.currentTarget and event.target.",
  conceptualAccuracy: 92,
  clarityOfExpression: 88,
  practicalApplication: 87,
  highlights: [
    "Accurately cited the event bubbling phase through DOM ancestry.",
    "Highlighted memory savings for dynamic lists.",
    "Natural bilingual communication (Tamil + English technical terms)."
  ],
  recommendedFollowup: "Practice explaining memory leaks caused by lingering event listeners upon component unmount."
};

export interface InterviewScoreResponse {
  learnerName: string;
  overallReadinessScore: number;
  verdict: 'Interview Ready' | 'Near Ready (1-2 Gap Bridges)' | 'Foundational Stage';
  pathway: string;
  domainCompetency: number;
  communicationScore: number;
  practicalCraftProof: number;
  verifiedBadgesCount: number;
  readinessBreakdown: {
    skill: string;
    score: number;
    status: 'Ready' | 'Needs Practice';
    evidenceCount: number;
  }[];
  howCalculatedExplanation: string;
  strengthsSummaryTamil: string;
  strengthsSummaryEnglish: string;
  topActionableNextSteps: string[];
}

export const fallbackInterviewScore: InterviewScoreResponse = {
  learnerName: "Priya Soundararajan",
  overallReadinessScore: 82,
  verdict: "Interview Ready",
  pathway: "Junior Web Developer",
  domainCompetency: 84,
  communicationScore: 88,
  practicalCraftProof: 85,
  verifiedBadgesCount: 5,
  readinessBreakdown: [
    { skill: "Semantic HTML & Accessibility", score: 88, status: "Ready", evidenceCount: 3 },
    { skill: "Responsive CSS & Flex/Grid", score: 78, status: "Ready", evidenceCount: 2 },
    { skill: "JavaScript & DOM Manipulation", score: 85, status: "Ready", evidenceCount: 4 },
    { skill: "React Components & Hooks", score: 74, status: "Ready", evidenceCount: 2 },
    { skill: "REST API & State Caching", score: 45, status: "Needs Practice", evidenceCount: 1 }
  ],
  howCalculatedExplanation: "Weighted composite: 45% verified code/photo submissions, 30% viva oral defenses, 15% rubric adherence, and 10% learning streak consistency. Unassessed skills are kept neutral.",
  strengthsSummaryTamil: "நீங்கள் நிறுவன நேர்காணலுக்கு 82% முழுத் தயார் நிலையில் உள்ளீர்கள். அணுகல்தன்மை மற்றும் ஜாவாஸ்கிரிப்ட் குறியீட்டு சான்றுகள் வலுவாக உள்ளன.",
  strengthsSummaryEnglish: "You are firmly in the top quartile of junior applicants with verified proofs. Bridging the REST API challenge will push readiness above 90%.",
  topActionableNextSteps: [
    "Complete Challenge 3: District Job Board Search with AbortController",
    "Request Mentor Verification for React custom hooks module",
    "Share verifiable Skill Passport QR link with Vaigai Digital recruiter"
  ]
};

export interface RoadmapAdaptResponse {
  learnerId: string;
  pathwayId: string;
  adaptiveActionTaken: 'Reordered Modules' | 'Pushed Remedial Micro-Challenge' | 'Fast-Tracked Advanced Track';
  triggerReason: string;
  reorderedModules: {
    moduleId: string;
    title: string;
    titleTamil: string;
    priority: 'Immediate Focus' | 'Next Step' | 'Mastered / Locked';
    adaptiveNote: string;
    estimatedMinutes: number;
  }[];
  motivationalQuoteTamil: string;
  motivationalQuoteEnglish: string;
}

export const fallbackRoadmapAdapt: RoadmapAdaptResponse = {
  learnerId: "priya-student",
  pathwayId: "junior-web-dev",
  adaptiveActionTaken: "Pushed Remedial Micro-Challenge",
  triggerReason: "REST API assessment indicated gap in optimistic UI error handling. Restructured roadmap to solidify async promises before introducing full-stack GraphQL.",
  reorderedModules: [
    {
      moduleId: "mod-async-resilience",
      title: "Async Data Fetching & Error Boundaries",
      titleTamil: "அசின்ங்க் தரவு பெறுதல் & பிழை தடுப்பு",
      priority: "Immediate Focus",
      adaptiveNote: "Bridging detected gap in HTTP 4xx/5xx offline recovery with hands-on practice.",
      estimatedMinutes: 45
    },
    {
      moduleId: "mod-react-state",
      title: "React Custom Hooks & Local Caching",
      titleTamil: "ரியாக்ட் கஸ்டம் ஹூக்ஸ் & சேமிப்பு முறை",
      priority: "Next Step",
      adaptiveNote: "Builds directly on resolved async fundamentals.",
      estimatedMinutes: 60
    },
    {
      moduleId: "mod-semantic-accessibility",
      title: "Semantic HTML & WCAG AA Auditing",
      titleTamil: "அர்த்தமுள்ள HTML & அணுகல்தன்மை",
      priority: "Mastered / Locked",
      adaptiveNote: "Already validated with 88% verified score.",
      estimatedMinutes: 0
    }
  ],
  motivationalQuoteTamil: "முயற்சி திருவினையாக்கும் முயற்றின்மை இன்மை புகுத்தி விடும். (திருக்குறள் 616)",
  motivationalQuoteEnglish: "Effort will bring prosperity; lack of effort will leave one destitute. Keep practicing your async fundamentals!"
};
