export interface DemoStep {
  id: string;
  stepNumber: number;
  stageName: string;
  stageNameTamil: string;
  tab: string;
  targetSelector: string;
  title: string;
  titleTamil: string;
  narrativeEn: string;
  narrativeTa: string;
  voiceSpeechEn: string;
  voiceSpeechTa: string;
  durationSeconds: number; // For under 4-minute pacing
  xpReward: number;
  readinessScore: number;
  actionType?: 'voice_onboard' | 'paste_jd' | 'live_extract' | 'gap_radar' | 'quiz_adapt' | 'rubric_review' | 'ai_viva' | 'mentor_sign' | 'phone_scan' | 'readiness_jump' | 'opportunity_spotlight';
  actionData?: any;
}

export interface PersonaStory {
  personaId: string;
  personaName: string;
  personaNameTamil: string;
  tagline: string;
  location: string;
  avatar: string;
  pathwayId: string;
  steps: DemoStep[];
}

export const priyaStory: PersonaStory = {
  personaId: 'priya-student',
  personaName: 'Priya Soundararajan',
  personaNameTamil: 'பிரியா சௌந்தரராஜன்',
  tagline: 'BCA Final Year (3rd Year) · Jamal Mohamed College, Trichy',
  location: 'Tiruchirappalli (Trichy), Tamil Nadu',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  pathwayId: 'junior-web-dev',
  steps: [
    // 1. Onboarding by Tamil voice
    {
      id: 'step-1-voice-onboarding',
      stepNumber: 1,
      stageName: 'Tamil Voice Onboarding',
      stageNameTamil: 'குரல் வழி பதிவு',
      tab: 'onboarding',
      targetSelector: '#onboarding-voice-section',
      title: 'Voice Onboarding in Native Tamil',
      titleTamil: 'தமிழ் குரல் வழி பதிவு & அறிமுகம்',
      narrativeEn: 'Priya, a final-year BCA student from Trichy, starts her journey using Tamil voice onboarding. Conversational speech recognition strips away technical English intimidation.',
      narrativeTa: 'திருச்சி கல்லூரி மாணவி பிரியா, தனது கற்றல் பயணத்தை தமிழ் குரல் வழி பதிவு மூலம் தொடங்குகிறார். ஆங்கிலத் தடையின்றி இயல்பான தமிழில் உரையாடலாம்.',
      voiceSpeechEn: 'Priya begins her SkillBridge journey using conversational Tamil voice onboarding, bypassing English language barriers.',
      voiceSpeechTa: 'வணக்கம் பிரியா! உங்கள் கற்றல் இலக்கு மற்றும் திறன்களை தமிழில் பதிவு செய்யலாம். இளநிலை இணையதள உருவாக்குநர் பயிற்சி தொடங்குகிறது.',
      durationSeconds: 19,
      xpReward: 50,
      readinessScore: 78,
      actionType: 'voice_onboard',
      actionData: {
        learnerName: 'Priya Soundararajan',
        learnerTamilName: 'பிரியா சௌந்தரராஜன்',
        goal: 'Secure First Tech Placement',
        voicePrompt: 'நான் ஒரு இணையதள உருவாக்குநராக பணியாற்ற விரும்புகிறேன்.'
      }
    },

    // 2. Paste JD
    {
      id: 'step-2-paste-jd',
      stepNumber: 2,
      stageName: 'Job Description Ingestion',
      stageNameTamil: 'வேலை விவரம் உள்ளீடு',
      tab: 'gap-analysis',
      targetSelector: '#gap-jd-input-card',
      title: 'Real-World Job Description Ingestion',
      titleTamil: 'நிறுவன வேலை விவரத்தை உள்ளிடுதல்',
      narrativeEn: 'Priya pastes an unformatted vacancy posting from Vaigai Digital Solutions in Chennai. SkillBridge prepares to extract granular, testable competencies rather than screening generic resumes.',
      narrativeTa: 'சென்னையின் முன்னணி தொழில்நுட்ப நிறுவனத்தின் வேலை விவரத்தை (JD) பிரியா உள்ளிடுகிறார். ரெஸ்யூமே வடிகட்டல் இல்லாமல் நேரடி திறன்களை பகுப்பாய்வு செய்ய AI தயாராகிறது.',
      voiceSpeechEn: 'Priya pastes a live job description from Chennai. SkillBridge ingests raw criteria for objective competency mapping.',
      voiceSpeechTa: 'சென்னையின் வைகை டிஜிட்டல் நிறுவனத்தின் வேலை விவரம் உள்ளிடப்படுகிறது. இதில் தேவையான அனைத்து திறன்களும் பிரித்தெடுக்கப்படும்.',
      durationSeconds: 18,
      xpReward: 30,
      readinessScore: 78,
      actionType: 'paste_jd',
      actionData: {
        sampleKey: 'web_dev',
        company: 'Vaigai Digital Solutions, Chennai',
        role: 'Junior React Frontend Engineering Intern'
      }
    },

    // 3. Live extraction
    {
      id: 'step-3-live-extraction',
      stepNumber: 3,
      stageName: 'Live AI Skill Extraction',
      stageNameTamil: 'நேரடி திறன் பிரித்தெடுத்தல்',
      tab: 'gap-analysis',
      targetSelector: '#gap-extracted-requirements',
      title: 'Live Deterministic Competency Parsing',
      titleTamil: 'AI நேரடி திறன் பிரித்தெடுத்தல்',
      narrativeEn: 'In milliseconds, deterministic LLM parsing extracts 5 required competencies with strict Zod schema validation: Semantic HTML, Responsive CSS, React Hooks, Git PRs, and REST API Caching.',
      narrativeTa: 'சில வினாடிகளில் AI என்ஜின் 5 அத்தியாவசிய திறன்களையும் அவற்றின் தரநிலைகளையும் (Level 1-5) பிழையின்றி பிரித்தெடுக்கிறது.',
      voiceSpeechEn: 'The AI extracts 5 core technical competencies with zero hallucination using validated deterministic schemas.',
      voiceSpeechTa: 'செயற்கை நுண்ணறிவு HTML, CSS, React, Git மற்றும் API திறன்களை வரிசைப்படுத்தி பிரித்தெடுத்துள்ளது.',
      durationSeconds: 19,
      xpReward: 40,
      readinessScore: 78,
      actionType: 'live_extract',
      actionData: {
        skillsCount: 5
      }
    },

    // 4. Gap analysis
    {
      id: 'step-4-gap-analysis',
      stepNumber: 4,
      stageName: 'Deterministic Gap Matrix',
      stageNameTamil: 'திறன் இடைவெளி பகுப்பாய்வு',
      tab: 'gap-analysis',
      targetSelector: '#gap-radar-chart',
      title: 'Transparent Domain Competency Radar',
      titleTamil: 'வெளிப்படையான ரேடார் ஒப்பீட்டு வரைபடம்',
      narrativeEn: 'Priya’s verified portfolio is benchmarked directly against employer criteria. 4 skills match her existing proofs; REST API & State Caching is flagged as the only critical gap.',
      narrativeTa: 'ரேடார் வரைபடம் பிரியாவின் தற்போதைய சான்றுகளை வேலைத் தேவைகளுடன் ஒப்பிடுகிறது. 4 திறன்கள் பொருந்துகின்றன; REST API பகுதியில் பயிற்சி தேவை என தெரிகிறது.',
      voiceSpeechEn: 'The interactive radar reveals 4 competencies already verified, pinpointing the exact gap without ambiguous resume guesswork.',
      voiceSpeechTa: 'வெளிப்படையான ரேடார் வரைபடம் பிரியாவின் 4 பலங்களை காட்டுகிறது. API தரவு சேமிப்பு மட்டுமே ஒரே இடைவெளியாக அடையாளம் காணப்பட்டுள்ளது.',
      durationSeconds: 20,
      xpReward: 50,
      readinessScore: 78,
      actionType: 'gap_radar',
      actionData: {
        matchedCount: 4,
        gapCount: 1,
        gapName: 'REST API & State Caching'
      }
    },

    // 5. Roadmap adapts after quiz fail
    {
      id: 'step-5-roadmap-adapts',
      stepNumber: 5,
      stageName: 'Dynamic Roadmap Adaptation',
      stageNameTamil: 'மாறும் கற்றல் வரைபடம்',
      tab: 'roadmap',
      targetSelector: '#roadmap-milestones-tree',
      title: 'Roadmap Recalibrates After Quiz Diagnostic Fail',
      titleTamil: 'வினாடிவினா தோல்விக்குப் பின் மாறும் வரைபடம்',
      narrativeEn: 'Priya attempts a diagnostic CSS Flexbox alignment quiz and scores 40% (< 60% fail threshold). Rather than penalizing her, SkillBridge dynamically restructures her roadmap, inserting a 3-day remedial sprint.',
      narrativeTa: 'பிரியா CSS Flexbox தேர்வில் 40% பெற்று தவறுகிறார். AI அவரை தண்டிக்காமல், அவரது வரைபடத்தில் 3-நாள் சிறப்பு சீரமைப்பு பயிற்சியை தானாக சேர்க்கிறது.',
      voiceSpeechEn: 'Priya scores 40% on a diagnostic quiz. SkillBridge dynamically recalculates her learning graph, inserting a custom remedial sprint.',
      voiceSpeechTa: 'தேர்வில் 40% பெற்றவுடன், வரைபடம் தானாக மாறி ஃப்ளெக்ஸ்பாக்ஸ் சிறப்புப் பயிற்சியை பிரியாவின் கற்றல் பாதையில் இணைக்கிறது.',
      durationSeconds: 21,
      xpReward: 60,
      readinessScore: 82,
      actionType: 'quiz_adapt',
      actionData: {
        quizTopic: 'Flexbox & CSS Alignment',
        quizScore: 40,
        insertedNodeTitle: 'Flexbox & CSS Alignment Remedial Sprint'
      }
    },

    // 6. Photo-evidence review
    {
      id: 'step-6-photo-evidence',
      stepNumber: 6,
      stageName: 'Workplace Evidence Review',
      stageNameTamil: 'செய்முறை சான்று மதிப்பீடு',
      tab: 'challenges',
      targetSelector: '#workspace-rubric-card',
      title: 'Photo & Code Submission Multi-Criteria Review',
      titleTamil: 'புகைப்படம் & குறியீடு சான்று மதிப்பீடு',
      narrativeEn: 'Priya submits her responsive profile page code repository and layout screenshot tested at 320px viewport. Automated vision & rubric evaluation scores it 94% across 4 strict criteria.',
      narrativeTa: '320 பிக்சல் மொபைல் திரையில் இயங்கும் தன்மையை நிரூபிக்கும் குறியீடு மற்றும் ஸ்கிரீன்ஷாட்டை பிரியா சமர்ப்பிக்கிறார். AI ரூப்ரிக் 94% மதிப்பெண் வழங்குகிறது.',
      voiceSpeechEn: 'Priya uploads photo and code evidence. SkillBridge tests her layout at 320px mobile width, awarding a 94% rubric score.',
      voiceSpeechTa: 'பிரியாவின் மொபைல் திரை வடிவமைப்பு சான்று ஆய்வு செய்யப்பட்டு 94% உயர்மதிப்பெண் வழங்கப்படுகிறது.',
      durationSeconds: 20,
      xpReward: 150,
      readinessScore: 86,
      actionType: 'rubric_review',
      actionData: {
        challengeId: 'challenge-web-profile',
        overallScore: 94,
        mobileZeroOverflow: 'Strict 0-overflow verified at 320px'
      }
    },

    // 7. AI viva
    {
      id: 'step-7-ai-viva',
      stepNumber: 7,
      stageName: 'Bilingual Voice Viva Defense',
      stageNameTamil: 'குரல் வழி வாய்மொழித் தேர்வு',
      tab: 'challenges',
      targetSelector: '#viva-voice-card',
      title: 'Anti-Copying AI Voice Viva in Tamil & English',
      titleTamil: 'நகலெடுப்பைத் தடுக்கும் தமிழ் AI வாய்மொழித் தேர்வு',
      narrativeEn: 'To prevent unverified code copying, AI asks: "Why choose flexbox over grid for header links?" Priya answers in Tamil. AI analyzes semantic understanding, awarding 94% authenticity confidence.',
      narrativeTa: 'குறியீடு நகலெடுப்பைத் தடுக்க AI தமிழில் கேட்கிறது: "தலைப்புக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?" பிரியாவின் பதிலை ஆராய்ந்து 94% உண்மைத்தன்மை என உறுதி செய்கிறது.',
      voiceSpeechEn: 'To ensure authenticity, AI conducts a voice viva in Tamil. Priya articulates her design reasoning with verified confidence.',
      voiceSpeechTa: 'ஏன் ஃப்ளெக்ஸ் அமைப்பை தேர்வு செய்தீர்கள் என்று AI தமிழில் கேட்கிறது. பிரியாவின் விளக்கத்தை ஆராய்ந்து அவரது உண்மையான அறிவை உறுதி செய்கிறது.',
      durationSeconds: 21,
      xpReward: 100,
      readinessScore: 89,
      actionType: 'ai_viva',
      actionData: {
        questionTamil: 'தலைப்புக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        answerTamil: 'தலைப்பு ஒரு பரிமாண நேர்கோட்டு வரிசை என்பதால் ஃப்ளெக்ஸ்பாக்ஸ் எளிதானது மற்றும் குறைவான குறியீடு போதுமானது.',
        authenticityConfidence: 'Consistent',
        vivaScore: 94
      }
    },

    // 8. Mentor approves
    {
      id: 'step-8-mentor-approves',
      stepNumber: 8,
      stageName: 'Industry Mentor Endorsement',
      stageNameTamil: 'வழிகாட்டி அங்கீகாரம்',
      tab: 'passport',
      targetSelector: '#passport-mentor-seal',
      title: 'Master Mentor Official Endorsement Seal',
      titleTamil: 'தொழில்துறை வல்லுநர் நேரடி அங்கீகாரம்',
      narrativeEn: 'Master Mentor K. Senthil Nathan (Senior Tech Lead) reviews Priya’s rubric scores, 320px mobile viewport proof, and viva transcript, signing off with a tamper-evident digital seal.',
      narrativeTa: 'தொழில்துறை மூத்த வல்லுநர் கே. செந்தில் நாதன், பிரியாவின் குறியீடு சான்றுகள் மற்றும் வாய்மொழி தேர்வை பரிசீலித்து அதிகாரப்பூர்வ டிஜிட்டல் முத்திரையிட்டு அங்கீகரிக்கிறார்.',
      voiceSpeechEn: 'Senior Tech Mentor K. Senthil Nathan endorses Priya’s verified submission, stamping an immutable cryptographic seal.',
      voiceSpeechTa: 'வழிகாட்டி செந்தில் நாதன் பிரியாவின் சான்றுகளை சரிபார்த்து தனது டிஜிட்டல் கையொப்பத்தை பதிவு செய்கிறார்.',
      durationSeconds: 19,
      xpReward: 120,
      readinessScore: 92,
      actionType: 'mentor_sign',
      actionData: {
        mentorName: 'K. Senthil Nathan',
        mentorRole: 'Senior Tech Lead & Guild Mentor'
      }
    },

    // 9. Passport QR scanned on phone
    {
      id: 'step-9-passport-qr-scan',
      stepNumber: 9,
      stageName: 'Tamper-Proof Skill Passport',
      stageNameTamil: 'திறன் கடவுச்சீட்டு QR ஸ்கேன்',
      tab: 'passport',
      targetSelector: '#passport-qr-box',
      title: 'Interactive Mobile Phone QR Scanner Experience',
      titleTamil: 'மொபைல் போன் மூலம் QR ஸ்கேன் சரிபார்ப்பு',
      narrativeEn: 'Simulated smartphone camera locks onto Priya’s Skill Passport QR, instantly loading her verifiable credential at skillbridge.tn.gov.in with cryptographic hashes. No employer login required.',
      narrativeTa: 'ஸ்மார்ட்போன் கேமரா பிரியாவின் QR குறியீட்டை ஸ்கேன் செய்கிறது. உடனடியாக அரசாங்க சரிபார்ப்பு போர்ட்டலில் சான்றிதழ்கள், குறியீடு மதிப்பெண்கள் மற்றும் சான்றுகள் திரையில் தோன்றுகின்றன.',
      voiceSpeechEn: 'Any smartphone camera scans Priya’s Skill Passport QR, loading verified rubric proofs and authenticity hashes without logging in.',
      voiceSpeechTa: 'மொபைல் கேமரா மூலம் QR குறியீடு ஸ்கேன் செய்யப்பட்டு, பிரியாவின் சரிபார்க்கப்பட்ட திறன் கடவுச்சீட்டு உடனடியாக திரையில் காட்டப்படுகிறது.',
      durationSeconds: 22,
      xpReward: 80,
      readinessScore: 94,
      actionType: 'phone_scan',
      actionData: {
        credentialId: 'TN-SB-PRIYA-STUDENT-2026',
        verifyUrl: 'https://skillbridge.tn.gov.in/verify/priya-student'
      }
    },

    // 10. Readiness updates
    {
      id: 'step-10-readiness-updates',
      stepNumber: 10,
      stageName: 'Workplace Readiness Index',
      stageNameTamil: 'தயார்நிலை குறியீடு புதுப்பிப்பு',
      tab: 'readiness',
      targetSelector: '#readiness-hero-ring',
      title: 'Live Readiness Jump: 78% → 94%',
      titleTamil: 'வேலைத்தள தயார்நிலை குறியீடு: 78% → 94%',
      narrativeEn: 'Priya’s Workplace Readiness Index jumps dynamically from 78% to 94%! Mathematical formula transparently factors in verified rubric proofs (40%), viva defense (20%), and mentor sign-off (15%).',
      narrativeTa: 'பிரியாவின் வேலைத்தள தயார்நிலை குறியீடு 78%-லிருந்து 94%-ஆக உயர்கிறது! ஒவ்வொரு சதவீதமும் செய்முறை சான்றுகள் மற்றும் வழிகாட்டி அங்கீகாரத்தால் மட்டுமே கணக்கிடப்படுகிறது.',
      voiceSpeechEn: 'Priya’s Workplace Readiness Index recalculates dynamically to 94%, completely backed by auditable proofs instead of vanity claims.',
      voiceSpeechTa: 'பிரியாவின் தயார்நிலை குறியீடு 94%-ஆக உயர்ந்துள்ளது. இது வெறும் சான்றிதழ் அல்ல, நடைமுறை சான்றுகளின் உண்மை வெளிப்பாடு.',
      durationSeconds: 20,
      xpReward: 70,
      readinessScore: 94,
      actionType: 'readiness_jump',
      actionData: {
        fromScore: 78,
        toScore: 94
      }
    },

    // 11. Sample opportunity "only JavaScript missing"
    {
      id: 'step-11-sample-opportunity',
      stepNumber: 11,
      stageName: 'Targeted Opportunity Matching',
      stageNameTamil: 'பொருத்தமான வேலைவாய்ப்பு',
      tab: 'opportunities',
      targetSelector: '#opportunity-spotlight-card',
      title: 'Spotlight Opportunity: "Only JavaScript Missing"',
      titleTamil: 'வாய்ப்பு பொருத்தம்: "ஜாவாஸ்கிரிப்ட் மட்டுமே தேவை"',
      narrativeEn: 'SkillBridge spotlights a Junior Frontend role in Chennai with an 88% match: 4 of 5 requirements verified, "Only JavaScript missing". In under 4 minutes, Priya has an exact, actionable 3-day sprint to placement!',
      narrativeTa: 'சென்னையின் முன்னணி வாய்ப்பு பிரியாவிற்கு கிடைக்கிறது: 5-ல் 4 திறன்கள் உள்ளன, "ஜாவாஸ்கிரிப்ட் மட்டுமே தேவை". வெறும் 3-நாள் பயிற்சியில் பிரியா வேலைக்கு முழு தகுதி பெறுகிறார்!',
      voiceSpeechEn: 'SkillBridge spotlights the top opportunity with 4 of 5 skills met, noting only JavaScript is missing. In under 4 minutes, Priya’s path to placement is clear.',
      voiceSpeechTa: 'பிரியாவிற்கு 88% பொருந்தும் வேலைவாய்ப்பு கிடைத்துள்ளது. ஜாவாஸ்கிரிப்ட் மட்டுமே தேவை. நான்கு நிமிடங்களுக்குள் பிரியாவின் வேலைக்கான பாதை தெளிவாகியுள்ளது!',
      durationSeconds: 23,
      xpReward: 100,
      readinessScore: 94,
      actionType: 'opportunity_spotlight',
      actionData: {
        roleTitle: 'Junior React Frontend Trainee',
        company: 'Vaigai Digital Solutions',
        missingSkill: 'JavaScript & DOM Manipulation',
        matchScore: 88
      }
    }
  ]
};

export const lakshmiStory: PersonaStory = {
  personaId: 'lakshmi-vocational',
  personaName: 'Lakshmi Arumugam',
  personaNameTamil: 'லட்சுமி ஆறுமுகம்',
  tagline: 'Vocational Artisan & SHG Member · Avinashi',
  location: 'Avinashi, Tiruppur District, Tamil Nadu',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  pathwayId: 'tailoring-craft',
  steps: [
    {
      id: 'step-1-lakshmi-onboarding',
      stepNumber: 1,
      stageName: 'Tamil Voice Onboarding',
      stageNameTamil: 'குரல் வழி பதிவு',
      tab: 'onboarding',
      targetSelector: '#onboarding-voice-section',
      title: 'Rural Artisan Voice Onboarding in Tamil',
      titleTamil: 'கிராமப்புற கைவினைஞர் தமிழ் குரல் பதிவு',
      narrativeEn: 'Lakshmi, a self-help group artisan from Avinashi, speaks into SkillBridge in pure Tamil. The app configures the Precision Tailoring & Craft pathway instantly.',
      narrativeTa: 'அவிநாசி மகளிர் சுயஉதவிக்குழு உறுப்பினர் லட்சுமி, தனது தையல் கைவினை ஆர்வத்தை தமிழில் பேசுகிறார். ஆடை வடிவமைப்பு பாதை உடனடியாக தொடங்குகிறது.',
      voiceSpeechEn: 'Lakshmi onboards using spoken Tamil, setting up her garment craftsmanship portfolio.',
      voiceSpeechTa: 'வணக்கம் லட்சுமி அக்கா! அவிநாசி தையல் கிளஸ்டர் பயிற்சிக்கான உங்கள் பதிவு தொடங்குகிறது.',
      durationSeconds: 19,
      xpReward: 50,
      readinessScore: 84,
      actionType: 'voice_onboard'
    },
    {
      id: 'step-2-lakshmi-paste-jd',
      stepNumber: 2,
      stageName: 'Job Description Ingestion',
      stageNameTamil: 'ஆடை ஏற்றுமதி வேலை விவரம்',
      tab: 'gap-analysis',
      targetSelector: '#gap-jd-input-card',
      title: 'Tiruppur Apparel Export Specification Ingestion',
      titleTamil: 'திருப்பூர் ஆடை ஏற்றுமதி வேலை விவரம்',
      narrativeEn: 'Lakshmi pastes a master sample cutter vacancy from Kongu Apparel Exports on Avinashi Road requiring SPI tension balance and katori drafting.',
      narrativeTa: 'திருப்பூர் கொங்கு அப்பேரல் நிறுவனத்தின் முதுநிலை மாதிரி ஆடை வெட்டுநர் பணி விவரம் உள்ளிடப்படுகிறது.',
      voiceSpeechEn: 'Lakshmi enters an export garment criteria requiring exact seam tolerances and katori paper patterns.',
      voiceSpeechTa: 'திருப்பூர் ஆடை தயாரிப்பு நிறுவனத்தின் மாதிரி வெட்டுநர் வேலை விவரம் பகுப்பாய்வு செய்யப்படுகிறது.',
      durationSeconds: 18,
      xpReward: 30,
      readinessScore: 84,
      actionType: 'paste_jd'
    },
    {
      id: 'step-3-lakshmi-extraction',
      stepNumber: 3,
      stageName: 'Live AI Skill Extraction',
      stageNameTamil: 'கைவினைத் திறன் பிரித்தெடுத்தல்',
      tab: 'gap-analysis',
      targetSelector: '#gap-extracted-requirements',
      title: 'Craft Competency Extraction: Tolerance & SPI',
      titleTamil: 'தையல் துல்லியம் மற்றும் தையல் அளவு பிரித்தெடுத்தல்',
      narrativeEn: 'SkillBridge parses craft requirements: 1.5-inch ease calculations, 1/4-inch seam tolerances, and 10-11 SPI lockstitch balancing.',
      narrativeTa: 'உடல் அளவீடு, கட்டோரி வரைவு மற்றும் தையல் அடர்த்தி (10-11 SPI) ஆகிய துல்லிய கைவினைத் திறன்களை AI பிரித்தெடுக்கிறது.',
      voiceSpeechEn: 'The system extracts precision tailoring standards including seam allowances and lockstitch tension metrics.',
      voiceSpeechTa: 'துல்லிய தையல் தேவைகள் மற்றும் கத்தரி வெட்டு முறை திறன்கள் பிரித்தெடுக்கப்பட்டுள்ளன.',
      durationSeconds: 19,
      xpReward: 40,
      readinessScore: 84,
      actionType: 'live_extract'
    },
    {
      id: 'step-4-lakshmi-gap',
      stepNumber: 4,
      stageName: 'Deterministic Gap Matrix',
      stageNameTamil: 'கைவினை இடைவெளி ஆய்வு',
      tab: 'gap-analysis',
      targetSelector: '#gap-radar-chart',
      title: 'Craft Radar: Pattern Grading Gap Identified',
      titleTamil: 'கைவினை ரேடார்: கிரேடிங் இடைவெளி கண்டறிதல்',
      narrativeEn: 'Lakshmi meets 3 of 4 core craft competencies. Multi-size pattern grading is identified as the only development gap.',
      narrativeTa: 'லட்சுமியிடம் 4-ல் 3 முக்கிய திறன்கள் உள்ளன. பல அளவுகளில் கிரேடிங் செய்யும் முறை மட்டுமே இடைவெளியாக அடையாளம் காணப்பட்டுள்ளது.',
      voiceSpeechEn: 'The radar shows strong seam execution with pattern grading flagged as the next milestone.',
      voiceSpeechTa: 'லட்சுமியின் துல்லிய தையல் திறன் உறுதியாக உள்ளது. கிரேடிங் முறை மட்டுமே கூடுதல் பயிற்சியாக தேவைப்படுகிறது.',
      durationSeconds: 20,
      xpReward: 50,
      readinessScore: 84,
      actionType: 'gap_radar'
    },
    {
      id: 'step-5-lakshmi-roadmap',
      stepNumber: 5,
      stageName: 'Dynamic Roadmap Adaptation',
      stageNameTamil: 'மாறும் வரைபடம்',
      tab: 'roadmap',
      targetSelector: '#roadmap-milestones-tree',
      title: 'Roadmap Adapts for Katori Dart Curvature',
      titleTamil: 'கட்டோரி தையல் வளைவு சீரமைப்பு பயிற்சி',
      narrativeEn: 'After a curvature measurement diagnostic, the AI inserts a dedicated remedial session on smooth dart drafting.',
      narrativeTa: 'சோதனைக்குப் பிறகு, கட்டோரி வளைவு தையலுக்கான சிறப்புப் பயிற்சியை வரைபடத்தில் AI சேர்க்கிறது.',
      voiceSpeechEn: 'The vocational roadmap adapts with a personalized dart curvature remedial module.',
      voiceSpeechTa: 'கட்டோரி தையல் வளைவு சீரமைப்பிற்கான சிறப்புப் பயிற்சி வரைபடத்தில் சேர்க்கப்பட்டுள்ளது.',
      durationSeconds: 21,
      xpReward: 60,
      readinessScore: 88,
      actionType: 'quiz_adapt'
    },
    {
      id: 'step-6-lakshmi-photo',
      stepNumber: 6,
      stageName: 'Workplace Evidence Review',
      stageNameTamil: 'புகைப்பட சான்று ஆய்வு',
      tab: 'challenges',
      targetSelector: '#workspace-rubric-card',
      title: 'Physical Blouse Measurement & SPI Inspection',
      titleTamil: 'பிளவுஸ் அளவீட்டுத் தாள் & தையல் புகைப்பட சான்று',
      narrativeEn: 'Lakshmi uploads a macro photo of her 5-point measurement sheet and 10 SPI lockstitch seam. Vision inspection awards 94% precision.',
      narrativeTa: '5-புள்ளி அளவீட்டுத் தாள் மற்றும் தையல் புகைப்படத்தை லட்சுமி சமர்ப்பிக்கிறார். AI பார்வை ஆய்வு 94% துல்லியம் என சான்றளிக்கிறது.',
      voiceSpeechEn: 'Vision inspection validates Lakshmi’s physical measurement sheet and straight-stitch tension with a 94% score.',
      voiceSpeechTa: 'லட்சுமியின் அளவீட்டுத் தாள் மற்றும் தையல் சான்று 94% துல்லியத்துடன் அங்கீகரிக்கப்பட்டது.',
      durationSeconds: 20,
      xpReward: 150,
      readinessScore: 91,
      actionType: 'rubric_review'
    },
    {
      id: 'step-7-lakshmi-viva',
      stepNumber: 7,
      stageName: 'Bilingual Voice Viva Defense',
      stageNameTamil: 'குரல் வழி தேர்வு',
      tab: 'challenges',
      targetSelector: '#viva-voice-card',
      title: 'Artisan Oral Defense in Tamil: Ease Calculation',
      titleTamil: 'மார்பு சுற்றளவு தளர்வு கணக்கீடு தமிழ் வாய்மொழித் தேர்வு',
      narrativeEn: 'AI asks: "Why 1.5-inch ease allowance on the bustline?" Lakshmi explains ease for breathability and armhole movement in Tamil with 96% score.',
      narrativeTa: 'மார்பு தளர்வுக்கு ஏன் 1.5 அங்குலம் விட்டீர்கள் என்று AI கேட்கிறது. லட்சுமி இயல்பாக தமிழில் விளக்கி 96% உண்மைத்தன்மை பெறுகிறார்.',
      voiceSpeechEn: 'Lakshmi defends her ease allowance calculations orally in Tamil, proving authentic craft expertise.',
      voiceSpeechTa: 'இயற்கையான உடல் அசைவிற்காக 1.5 அங்குலம் தளர்வு கொடுத்ததாக லட்சுமி அழகாக விளக்குகிறார்.',
      durationSeconds: 21,
      xpReward: 100,
      readinessScore: 93,
      actionType: 'ai_viva'
    },
    {
      id: 'step-8-lakshmi-mentor',
      stepNumber: 8,
      stageName: 'Industry Mentor Endorsement',
      stageNameTamil: 'முதுநிலை தையற்கலைஞர் சான்று',
      tab: 'passport',
      targetSelector: '#passport-mentor-seal',
      title: 'Master Artisan Sign-Off & Verification Stamp',
      titleTamil: 'திருப்பூர் முதுநிலை தையற்கலைஞர் அங்கீகாரம்',
      narrativeEn: 'Master Tailor Endorsement stamped by Tiruppur Cluster Lead, validating Lakshmi’s sample cutting readiness.',
      narrativeTa: 'திருப்பூர் ஆடை கிளஸ்டர் தலைமை மாஸ்டர் லட்சுமியின் சான்றுகளை சரிபார்த்து அங்கீகார முத்திரை இடுகிறார்.',
      voiceSpeechEn: 'Tiruppur Cluster Master Tailor digitally signs off on Lakshmi’s craft credential.',
      voiceSpeechTa: 'திருப்பூர் தலைமை மாஸ்டர் லட்சுமியின் கைவினைத் திறனை அங்கீகரித்துள்ளார்.',
      durationSeconds: 19,
      xpReward: 120,
      readinessScore: 95,
      actionType: 'mentor_sign'
    },
    {
      id: 'step-9-lakshmi-phone-scan',
      stepNumber: 9,
      stageName: 'Tamper-Proof Skill Passport',
      stageNameTamil: 'கைவினை கடவுச்சீட்டு QR ஸ்கேன்',
      tab: 'passport',
      targetSelector: '#passport-qr-box',
      title: 'Craft Passport QR Scanned by Boutique Owner',
      titleTamil: 'பூட்டிக் உரிமையாளர் மொபைலில் QR ஸ்கேன்',
      narrativeEn: 'Boutique owners scan Lakshmi’s QR to view her verified SPI photos, body ease calculations, and mentor stamp without app install.',
      narrativeTa: 'பூட்டிக் உரிமையாளர்கள் லட்சுமியின் QR குறியீட்டை ஸ்கேன் செய்து அவரது தையல் புகைப்பட சான்றுகளை உடனடியாக சரிபார்க்கின்றனர்.',
      voiceSpeechEn: 'Boutique recruiters scan Lakshmi’s Craft Passport on their smartphone, viewing verifiable stitch proofs.',
      voiceSpeechTa: 'மொபைலில் QR ஸ்கேன் செய்யப்பட்டு லட்சுமியின் கைவினை கடவுச்சீட்டு திரையில் தெரிகிறது.',
      durationSeconds: 22,
      xpReward: 80,
      readinessScore: 96,
      actionType: 'phone_scan'
    },
    {
      id: 'step-10-lakshmi-readiness',
      stepNumber: 10,
      stageName: 'Workplace Readiness Index',
      stageNameTamil: 'தயார்நிலை குறியீடு புதுப்பிப்பு',
      tab: 'readiness',
      targetSelector: '#readiness-hero-ring',
      title: 'Artisan Readiness Updates to 96%',
      titleTamil: 'கைவினைஞர் தயார்நிலை குறியீடு: 96%',
      narrativeEn: 'Lakshmi’s Artisan Readiness Index reaches 96% backed by audited physical measurements and oral defense.',
      narrativeTa: 'லட்சுமியின் கைவினை தயார்நிலை குறியீடு 96%-ஐ எட்டுகிறது. பூட்டிக் ஆர்டர்களை நேரடியாக பெற தகுதி பெறுகிறார்.',
      voiceSpeechEn: 'Lakshmi’s Workplace Readiness index rises to 96% based on tangible measurement rubrics.',
      voiceSpeechTa: 'லட்சுமியின் பணி தயார்நிலை 96%-ஆக உயர்ந்துள்ளது. பூட்டிக் ஒப்பந்தங்களுக்கு அவர் முழு தகுதி பெறுகிறார்.',
      durationSeconds: 20,
      xpReward: 70,
      readinessScore: 96,
      actionType: 'readiness_jump'
    },
    {
      id: 'step-11-lakshmi-opportunity',
      stepNumber: 11,
      stageName: 'Targeted Opportunity Matching',
      stageNameTamil: 'பூட்டிக் மாதிரி வாய்ப்பு',
      tab: 'opportunities',
      targetSelector: '#opportunity-card-opp-tiruppur-garment-sample',
      title: 'Boutique Sample Tailor Match: Ready for Direct Hire',
      titleTamil: 'முதுநிலை ஆடை வெட்டுநர்: நேரடி பணி வாய்ப்பு',
      narrativeEn: 'Kongu Apparel Exports selects Lakshmi for Boutique Sample Tailor contract at ₹24,000/month. 100% craft proof verified in under 4 minutes!',
      narrativeTa: 'திருப்பூர் பூட்டிக் ஆடை வெட்டுநர் வாய்ப்பில் லட்சுமி 92% பொருத்தம் பெறுகிறார். 4 நிமிடங்களுக்குள் நேரடி பணி வாய்ப்பு!',
      voiceSpeechEn: 'Lakshmi matches directly with Tiruppur Boutique Sample Tailor role. The proof-to-progress loop is complete!',
      voiceSpeechTa: 'லட்சுமியின் கைவினை சான்றுகள் மூலம் திருப்பூர் ஆடை நிறுவனத்தில் நேரடி வாய்ப்பு உறுதியாகியுள்ளது.',
      durationSeconds: 23,
      xpReward: 100,
      readinessScore: 96,
      actionType: 'opportunity_spotlight'
    }
  ]
};
