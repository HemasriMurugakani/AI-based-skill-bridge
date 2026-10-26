import { Opportunity } from '../types';

export const sampleOpportunities: Opportunity[] = [
  // 1. Technical: Junior Frontend Trainee
  {
    id: 'opp-chennai-frontend-trainee',
    title: 'Junior React Frontend Trainee',
    titleTamil: 'இளநிலை ரியாக்ட் இணைய உருவாக்குநர் பயிற்சி',
    company: 'Vaigai Digital Solutions',
    location: 'Chennai / Hybrid (Guindy Industrial Estate)',
    type: 'Full-time',
    category: 'technical',
    isSample: true,
    stipendOrSalary: '₹22,000 - ₹28,000 / month',
    matchScore: 88,
    pathwayId: 'junior-web-dev',
    eligibility: 'BCA / B.Sc / B.E / Diploma or Self-Taught with verified code PRs (No arrears barrier)',
    eligibilityTamil: 'BCA / B.Sc / பொறியியல் / டிப்ளமோ அல்லது சரிபார்க்கப்பட்ட குறியீடு சான்றுகள் உள்ள எவரும்',
    nextAction: 'Bridge Modern JavaScript Challenge (Only JavaScript missing)',
    nextActionTamil: 'நவீன ஜாவாஸ்கிரிப்ட் சவாலை முடிக்கவும் (ஜாவாஸ்கிரிப்ட் மட்டுமே தேவை)',
    description: 'Build citizen services interfaces with semantic HTML, modern React, and responsive layouts. Mentorship provided for first 3 months.',
    descriptionTamil: 'அரசு மற்றும் குடிமக்கள் சேவை இணையதளங்களை அணுகல்தன்மை கொண்ட ரியாக்ட் கூறுகளுடன் உருவாக்குதல்.',
    postedDate: '2 days ago',
    requiredSkills: [
      { skillName: 'Semantic HTML & Accessibility', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Responsive CSS & Flex/Grid', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'React Components & Hooks', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'Git Version Control & PRs', requiredLevel: 2, userLevel: 3, met: true },
      { skillName: 'JavaScript & DOM Manipulation', requiredLevel: 3, userLevel: 2, met: false }
    ],
    aiExplanation: {
      strengths: 'You exceed requirements in Semantic HTML (Level 4), Responsive Layouts (Level 3), and React Components with verified code proofs.',
      strengthsTamil: 'அணுகல்தன்மை, CSS கட்டமைப்பு மற்றும் ரியாக்ட் கூறுகளில் நீங்கள் முழு தகுதி பெற்றுள்ளீர்கள்.',
      gaps: 'Only JavaScript missing: JavaScript & DOM Manipulation is currently at Level 2, while Level 3 is required for full placement readiness.',
      gapsTamil: 'ஜாவாஸ்கிரிப்ட் மட்டுமே இடைவெளி: 5-ல் 4 திறன்கள் சரிபார்க்கப்பட்டுள்ளன. ஜாவாஸ்கிரிப்ட் DOM பயிற்சி மட்டுமே தேவை.',
      roadmapAction: 'Complete the 3-day Modern JavaScript DOM challenge to turn this card 100% green and unlock direct placement.',
      roadmapActionTamil: '3-நாள் ஜாவாஸ்கிரிப்ட் DOM சவாலை முடித்து 100% தகுதியைப் பெறவும்.',
      recommendedChallengeId: 'ch-web-03'
    }
  },

  // 2. Technical: Frontend Web Apprentice
  {
    id: 'opp-coimbatore-web-apprentice',
    title: 'Frontend Web Apprentice (NAPS Scheme)',
    titleTamil: 'இணையதள தொழிற்பழகுநர் (NAPS திட்டம்)',
    company: 'Siruvani Tech Labs',
    location: 'Coimbatore (Saravanampatti Tech Corridor)',
    type: 'Apprenticeship',
    category: 'technical',
    isSample: true,
    stipendOrSalary: '₹14,000 / month + Govt NAPS Subsidy',
    matchScore: 92,
    pathwayId: 'junior-web-dev',
    eligibility: 'Diploma / Degree completed in 2023-2026, eligible for NAPS apprenticeship subsidy portal',
    eligibilityTamil: '2023-2026-ல் தேர்ச்சி பெற்ற டிப்ளமோ / பட்டதாரிகள், NAPS உதவித்தொகை பெற தகுதியுடையவர்கள்',
    nextAction: 'Ready to submit Skill Passport directly',
    nextActionTamil: 'திறன் கடவுச்சீட்டுடன் நேரடியாக விண்ணப்பிக்கலாம்',
    description: 'Official apprenticeship opening for diploma and engineering graduates. Hands-on training on accessible web portals and component testing.',
    descriptionTamil: 'அணுகல்தன்மை கொண்ட இணையதளங்கள் மற்றும் சோதனைகளில் நேரடி செய்முறைப் பயிற்சி.',
    postedDate: 'Yesterday',
    requiredSkills: [
      { skillName: 'Semantic HTML & Accessibility', requiredLevel: 2, userLevel: 4, met: true },
      { skillName: 'Responsive CSS & Flex/Grid', requiredLevel: 2, userLevel: 3, met: true },
      { skillName: 'JavaScript & DOM Manipulation', requiredLevel: 2, userLevel: 4, met: true }
    ],
    aiExplanation: {
      strengths: 'You meet 100% of required competencies. Your verified rubric score in Responsive Layouts (88%) makes you an immediate high-match candidate.',
      strengthsTamil: 'தேவையான அனைத்து திறன்களையும் நீங்கள் 100% பூர்த்தி செய்துள்ளீர்கள்.',
      gaps: 'No blocking technical skill gaps detected for this apprenticeship role.',
      gapsTamil: 'தடைசெய்யும் இடைவெளிகள் எதுவும் இல்லை.',
      roadmapAction: 'Export your Skill Passport QR code and attach your live profile link.',
      roadmapActionTamil: 'உங்கள் கடவுச்சீட்டு QR குறியீட்டை இணைத்து விண்ணப்பிக்கவும்.',
      recommendedChallengeId: 'challenge-web-profile'
    }
  },

  // 3. Technical: Rural Hub Web Support
  {
    id: 'opp-trichy-rural-hub-web',
    title: 'Rural BPO Web Portal Support Specialist',
    titleTamil: 'ஊரக இணையதள ஆதரவு நிபுணர்',
    company: 'Kaveri Rural Enterprises Hub',
    location: 'Tiruchirappalli (Trichy Rural Cluster)',
    type: 'Rural Hub',
    category: 'technical',
    isSample: true,
    stipendOrSalary: '₹18,000 - ₹22,000 / month',
    matchScore: 78,
    pathwayId: 'junior-web-dev',
    eligibility: 'Residence in Tiruchirappalli or Pudukkottai district; flexible rural hub schedule',
    eligibilityTamil: 'திருச்சி அல்லது புதுக்கோட்டை மாவட்டத்தைச் சேர்ந்தவர்கள்; உள்ளூர் பணி நேரம்',
    nextAction: 'Bridge REST API & State Caching (ch-web-04)',
    nextActionTamil: 'REST API சவாலை முடித்து தகுதியை உயர்த்துக',
    description: 'Maintain and update district farmer cooperative portals and artisan catalogs. Flexible shifts and local transit support available.',
    descriptionTamil: 'விவசாய கூட்டுறவு மற்றும் கைவினைஞர் இணையதளங்களை புதுப்பித்து பராமரிக்கும் பணி.',
    postedDate: '3 days ago',
    requiredSkills: [
      { skillName: 'Semantic HTML & Accessibility', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Responsive CSS & Flex/Grid', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'REST API & State Caching', requiredLevel: 3, userLevel: 2, met: false }
    ],
    aiExplanation: {
      strengths: 'Strong alignment on regional accessibility standards and mobile viewport optimizations.',
      strengthsTamil: 'மொபைல் திரை வடிவமைப்பு மற்றும் உள்ளூர் மொழியாக்கத்தில் சிறந்த திறன்கள்.',
      gaps: 'Catalog updates require async API fetching and error retry handling (Level 3 needed).',
      gapsTamil: 'API தரவுப் பரிமாற்றத்தில் கூடுதல் பயிற்சி தேவைப்படுகிறது.',
      roadmapAction: 'Add REST API module to your active roadmap to resolve this requirement.',
      roadmapActionTamil: 'உங்கள் வரைபடத்தில் REST API பகுதியைச் சேர்த்து பயிற்சி செய்யவும்.',
      recommendedChallengeId: 'ch-web-04'
    }
  },

  // 4. Technical: Junior Web & UI Assistant
  {
    id: 'opp-madurai-junior-dev',
    title: 'Junior Web & UI Assistant',
    titleTamil: 'இளநிலை இணையதள மற்றும் இடைமுக உதவியாளர்',
    company: 'Pandyan IT Innovations',
    location: 'Madurai (Mattuthavani)',
    type: 'Full-time',
    category: 'technical',
    isSample: true,
    stipendOrSalary: '₹20,000 - ₹25,000 / month',
    matchScore: 82,
    pathwayId: 'junior-web-dev',
    eligibility: 'Demonstrated mobile-first CSS and reusable component proofs; college pedigree optional',
    eligibilityTamil: 'மொபைல்-முதல் வடிவமைப்பு சான்றுகள்; கல்லூரி மதிப்பெண் கட்டாயமில்லை',
    nextAction: 'Verify Git Version Control & PR Etiquette',
    nextActionTamil: 'கிட் பதிப்புக் கட்டுப்பாட்டு பயிற்சியை முடிக்கவும்',
    description: 'Construct responsive interfaces for e-commerce and local business websites. Evidence-backed code portfolio prioritised over college pedigree.',
    descriptionTamil: 'உள்ளூர் வணிகங்களுக்கான இணையதளங்களை சுத்தமான குறியீட்டுடன் உருவாக்குதல்.',
    postedDate: '5 days ago',
    requiredSkills: [
      { skillName: 'Semantic HTML & Accessibility', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Responsive CSS & Flex/Grid', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'React Components & Hooks', requiredLevel: 2, userLevel: 3, met: true },
      { skillName: 'Git Version Control & PRs', requiredLevel: 2, userLevel: 1, met: false }
    ],
    aiExplanation: {
      strengths: 'All primary React UI component and layout requirements are fully verified.',
      strengthsTamil: 'React கூறுகள் மற்றும் கட்டமைப்பு தேவைகள் முழுமையாக பூர்த்தி செய்யப்பட்டுள்ளன.',
      gaps: 'Team uses GitHub pull requests with conventional commit messages (currently unassessed).',
      gapsTamil: 'குழு பணிக்குத் தேவையான கிட் (Git) பணிப்பாய்வு இன்னும் மதிப்பிடப்படவில்லை.',
      roadmapAction: 'Complete the Git Branching & PR Checklist to turn this card 100% green.',
      roadmapActionTamil: 'கிட் பயிற்சியை முடித்து 100% தகுதியைப் பெறவும்.',
      recommendedChallengeId: 'ch-web-02'
    }
  },

  // 5. Technical: Junior Data Analyst
  {
    id: 'opp-chennai-data-trainee',
    title: 'Junior Data & MIS Reporting Analyst',
    titleTamil: 'இளநிலை தரவு மற்றும் MIS அறிக்கை ஆய்வாளர்',
    company: 'Coromandel Analytics Group',
    location: 'Chennai (Tidel Park)',
    type: 'Full-time',
    category: 'technical',
    isSample: true,
    stipendOrSalary: '₹24,000 - ₹30,000 / month',
    matchScore: 81,
    pathwayId: 'data-analyst',
    eligibility: 'B.Com / B.Sc / BCA with demonstrated SQL aggregations and Excel automation',
    eligibilityTamil: 'SQL மற்றும் எக்செல் ஆட்டோமேஷன் சான்றுகள் கொண்ட பட்டதாரிகள்',
    nextAction: 'Practice Python Data Cleaning Challenge (ch-data-01)',
    nextActionTamil: 'பைதான் தரவு சுத்திகரிப்பு சவாலை முடிக்கவும்',
    description: 'Write SQL queries and build weekly Excel/PowerBI dashboards tracking retail supply chain performance across South India.',
    descriptionTamil: 'விற்பனை தரவுகளை ஆய்வு செய்து எக்செல் மற்றும் SQL மூலம் அறிக்கை தயாரித்தல்.',
    postedDate: '2 days ago',
    requiredSkills: [
      { skillName: 'SQL Aggregations, Joins & Window Functions', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'Advanced Excel & Power Query Automation', requiredLevel: 2, userLevel: 3, met: true },
      { skillName: 'Python Data Cleaning & Storytelling', requiredLevel: 2, userLevel: 1, met: false }
    ],
    aiExplanation: {
      strengths: 'Outstanding SQL join syntax and Excel pivot automation scores verified.',
      strengthsTamil: 'SQL மற்றும் எக்செல் தரவு கையாளுதலில் மிக வலுவான சான்றுகள் உள்ளன.',
      gaps: 'Pandas data frame manipulation needs reinforcement for automated ETL scripts.',
      gapsTamil: 'பைதான் பாண்டாஸ் (Pandas) தரவு சுத்திகரிப்பில் கூடுதல் பயிற்சி தேவை.',
      roadmapAction: 'Add Python Data Cleaning challenge to your active roadmap focus.',
      roadmapActionTamil: 'பைதான் சவாலை உங்கள் வரைபடத்தில் சேர்த்து பயிற்சி செய்யவும்.',
      recommendedChallengeId: 'ch-data-01'
    }
  },

  // 6. Vocational: Master Pattern Cutter
  {
    id: 'opp-tiruppur-garment-sample',
    title: 'Master Pattern Cutter & Blouse Sample Tailor',
    titleTamil: 'முதுநிலை ஆடை வெட்டுநர் & மாதிரி தையற்கலைஞர்',
    company: 'Kongu Apparel Exports & Boutiques',
    location: 'Tiruppur (Avinashi Road Garment Hub)',
    type: 'Full-time',
    category: 'vocational',
    isSample: true,
    stipendOrSalary: '₹22,000 - ₹28,000 / month + Piece Incentive',
    matchScore: 92,
    pathwayId: 'tailoring-craft',
    eligibility: 'SSLC / ITI or SHG skill certification with photo-verified pattern cutting swatches',
    eligibilityTamil: '10-ஆம் வகுப்பு / ITI அல்லது மகளிர் சுயஉதவிக்குழு தையல் சான்றிதழ்',
    nextAction: 'Ready to submit Craft Passport with cutting swatches',
    nextActionTamil: 'கைவினை கடவுச்சீட்டுடன் நேரடியாக விண்ணப்பிக்கலாம்',
    description: 'Precision cutting and sample blouse development for boutique bridal wear and export sample runs. Photo-verified cutting portfolio required.',
    descriptionTamil: 'மணப்பெண் ஆடைகள் மற்றும் ஏற்றுமதி மாதிரிகளுக்கான துல்லியமான ஆடை வெட்டுதல் பணி.',
    postedDate: '1 day ago',
    requiredSkills: [
      { skillName: 'Body Measurement & Ease Allowances', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Katori & 4-Dart Blouse Drafting', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Lockstitch Sewing & Tension Control', requiredLevel: 3, userLevel: 3, met: true }
    ],
    aiExplanation: {
      strengths: 'Your 5-point measurement sheet and katori curvature swatches scored 94% on precision tolerance inspection.',
      strengthsTamil: 'அளவீடு மற்றும் கட்டோரி பிளவுஸ் வெட்டுதலில் 94% துல்லிய மதிப்பெண் பெற்றுள்ளீர்கள்.',
      gaps: 'Zero technical gaps for sample blouse cutting benchmark.',
      gapsTamil: 'எந்த இடைவெளியும் இல்லை.',
      roadmapAction: 'Generate your physical measurement Craft Passport and share with employer.',
      roadmapActionTamil: 'உங்கள் கைவினை கடவுச்சீட்டை பதிவிறக்கி சமர்ப்பிக்கவும்.',
      recommendedChallengeId: 'ch-tailor-01'
    }
  },

  // 7. Vocational: Boutique Apparel Finishing
  {
    id: 'opp-coimbatore-boutique-finisher',
    title: 'Boutique Apparel Finishing & Piping Specialist',
    titleTamil: 'ஆடை நேர்த்தி மற்றும் பைப்பிங் நிபுணர்',
    company: 'Ananya Bridal & Handloom Studio',
    location: 'Coimbatore (RS Puram)',
    type: 'Full-time',
    category: 'vocational',
    isSample: true,
    stipendOrSalary: '₹18,000 - ₹24,000 / month',
    matchScore: 79,
    pathwayId: 'tailoring-craft',
    eligibility: 'Demonstrated experience in bridal silk blouse neckline piping and invisible zippers',
    eligibilityTamil: 'பட்டு பிளவுஸ் பைப்பிங் மற்றும் ஜிப் பொருத்துவதில் அனுபவம் உள்ளவர்கள்',
    nextAction: 'Complete 45-Degree Bias Piping Challenge (ch-tailor-05)',
    nextActionTamil: 'கழுத்து பைப்பிங் பயிற்சியை முடித்து சான்று பதிவேற்றுக',
    description: 'Expert neckline piping, bias cord attachment, invisible zipper installation, and steam press finishing for premium handloom silk blouses.',
    descriptionTamil: 'பட்டு பிளவுஸ்களுக்கான கழுத்து பைப்பிங் மற்றும் மெருகூட்டல் வேலைகள்.',
    postedDate: '4 days ago',
    requiredSkills: [
      { skillName: 'Lockstitch Sewing & Tension Control', requiredLevel: 3, userLevel: 3, met: true },
      { skillName: 'Katori & 4-Dart Blouse Drafting', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Bias Binding & Neckline Piping', requiredLevel: 3, userLevel: 2, met: false }
    ],
    aiExplanation: {
      strengths: 'Flawless seam straightness and tension calibration on lockstitch machines.',
      strengthsTamil: 'தையல் நேர்த்தி மற்றும் இயந்திர இழுவிசையில் மிகச் சிறந்த திறன்கள்.',
      gaps: 'Requires Level 3 precision on 45-degree bias strip joining for wrinkle-free necklines.',
      gapsTamil: 'சுருக்கம் இல்லாத பைப்பிங் அமைப்பில் நிலை 3 தேர்ச்சி தேவைப்படுகிறது.',
      roadmapAction: 'Upload 1 photo swatch of corded neckline piping to clear this gap.',
      roadmapActionTamil: 'பைப்பிங் மாதிரி புகைப்படத்தை பதிவேற்றி தகுதியை உறுதிப்படுத்தவும்.',
      recommendedChallengeId: 'ch-tailor-05'
    }
  },

  // 8. Vocational: SHG Tailoring Lead
  {
    id: 'opp-madurai-shg-tailoring-lead',
    title: 'SHG Tailoring Cluster Team Lead',
    titleTamil: 'சுயஉதவிக்குழு தையல் ஒருங்கிணைப்பாளர்',
    company: 'Meenakshi Women Livelihoods Mission',
    location: 'Madurai Rural (Usilampatti)',
    type: 'Rural Hub',
    category: 'vocational',
    isSample: true,
    stipendOrSalary: '₹16,000 - ₹20,000 / month',
    matchScore: 88,
    pathwayId: 'tailoring-craft',
    eligibility: 'Self-Help Group (SHG) member with leadership aptitude and garment cutting proof',
    eligibilityTamil: 'மகளிர் சுயஉதவிக்குழு உறுப்பினர்; ஆடை வெட்டுதல் மற்றும் வழிகாட்டுதல் திறன்',
    nextAction: 'Ready to submit Craft Passport for SHG cluster lead',
    nextActionTamil: 'சுயஉதவிக்குழு தலைமைப் பொறுப்பிற்கு கடவுச்சீட்டுடன் விண்ணப்பிக்கலாம்',
    description: 'Guide 12 rural women tailors on school uniform bulk orders, check seam tolerances, and maintain sewing machine oiling and tension.',
    descriptionTamil: 'கிராமப்புற பெண்களுக்கு பள்ளி சீருடை தையல் வழிகாட்டுதல் மற்றும் தரக் கட்டுப்பாடு.',
    postedDate: '6 days ago',
    requiredSkills: [
      { skillName: 'Body Measurement & Ease Allowances', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Katori & 4-Dart Blouse Drafting', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'Lockstitch Sewing & Tension Control', requiredLevel: 3, userLevel: 3, met: true }
    ],
    aiExplanation: {
      strengths: 'Proven mastery in body measurements, drafting, and machine maintenance.',
      strengthsTamil: 'அளவீடு, ஆடை வரைதல் மற்றும் இயந்திர பராமரிப்பில் சிறந்த அனுபவம்.',
      gaps: 'No technical gaps. Verbal explanation in Tamil scored 92% in viva evaluation.',
      gapsTamil: 'எந்த இடைவெளியும் இல்லை; வாய்மொழி விளக்கத்தில் 92% மதிப்பெண்.',
      roadmapAction: 'Download the SHG cluster endorsement form to proceed.',
      roadmapActionTamil: 'சுயஉதவிக்குழு பரிந்துரை படிவத்தை பதிவிறக்கம் செய்யவும்.',
      recommendedChallengeId: 'ch-tailor-03'
    }
  },

  // 9. Vocational: Solar Rooftop Wireman Trainee
  {
    id: 'opp-salem-solar-elec',
    title: 'Solar Rooftop & Domestic Wireman Trainee',
    titleTamil: 'சூரிய மின் தகடு & உள்நாட்டு மின் கம்பி பணியாளர்',
    company: 'Shevaroy Green Energy Corp',
    location: 'Salem / Yercaud Foothills',
    type: 'Contract',
    category: 'vocational',
    isSample: true,
    stipendOrSalary: '₹18,000 - ₹22,000 / month + Field Travel Allowance',
    matchScore: 85,
    pathwayId: 'electrician-trade',
    eligibility: 'ITI Wireman / Electrician or verified SkillBridge conduit wiring badge',
    eligibilityTamil: 'ITI எலக்ட்ரீசியன் அல்லது சரிபார்க்கப்பட்ட மின் கம்பி இணைப்பு சான்று',
    nextAction: 'Complete Earthing & Testing Module (ch-elec-02)',
    nextActionTamil: 'எர்த்திங் மற்றும் மின்தடை சோதனை பயிற்சியை முடிக்கவும்',
    description: 'Install conduit wiring, DC isolator switches, and distribution boards for solar panel installations across Salem residential complexes.',
    descriptionTamil: 'சூரிய மின் தகடுகள் மற்றும் விநியோக பெட்டிகள் பொருத்தும் களப்பணி.',
    postedDate: '3 days ago',
    requiredSkills: [
      { skillName: 'Electrical Safety & PPE (IS 5216)', requiredLevel: 3, userLevel: 4, met: true },
      { skillName: 'PVC Conduit & Loop-in Wiring', requiredLevel: 2, userLevel: 2, met: true },
      { skillName: 'Earthing & Resistance Testing', requiredLevel: 3, userLevel: 1, met: false }
    ],
    aiExplanation: {
      strengths: 'IS 5216 safety standards and lock-out/tag-out (LOTO) procedures strictly verified.',
      strengthsTamil: 'பாதுகாப்பு நெறிமுறைகள் மற்றும் பிவிசி வயரிங் சான்றுகள் வலுவாக உள்ளன.',
      gaps: 'Rooftop solar requires Megger insulation and pipe earthing resistance checks < 5 ohms.',
      gapsTamil: 'எர்த்திங் மின்தடை பரிசோதனை முறையில் கூடுதல் பயிற்சி தேவைப்படுகிறது.',
      roadmapAction: 'Complete the Earthing & Megger Inspection checklist to bridge this skill.',
      roadmapActionTamil: 'எர்த்திங் சரிபார்ப்புப் பயிற்சியை உங்கள் வரைபடத்தில் சேர்க்கவும்.',
      recommendedChallengeId: 'ch-elec-01'
    }
  },

  // 10. Vocational: Wind Substation Electrical Maintenance Assistant
  {
    id: 'opp-tirunelveli-wind-substation',
    title: 'Substation Electrical Maintenance Assistant',
    titleTamil: 'துணை மின்நிலைய பராமரிப்பு உதவியாளர்',
    company: 'Muppandal Wind Power Consortium',
    location: 'Tirunelveli / Kayathar Wind Belt',
    type: 'Full-time',
    category: 'vocational',
    isSample: true,
    stipendOrSalary: '₹19,000 - ₹24,000 / month + Quarters',
    matchScore: 80,
    pathwayId: 'electrician-trade',
    eligibility: 'ITI Electrician / Diploma with high-voltage safety endorsement',
    eligibilityTamil: 'ITI எலக்ட்ரீசியன் / டிப்ளமோ மற்றும் உயர் மின்னழுத்த பாதுகாப்பு பயிற்சி',
    nextAction: 'Bridge PVC Conduit & High-Current Distribution Wiring',
    nextActionTamil: 'உயர் மின்னோட்ட வயரிங் சான்றை நிறைவு செய்க',
    description: 'Assisting licensed wiremen with earth resistance tests, transformer oil checks, and 415V distribution board maintenance.',
    descriptionTamil: 'மின்மாற்றி எண்ணெய் சோதனை மற்றும் 415V விநியோக பெட்டி பராமரிப்பு.',
    postedDate: '5 days ago',
    requiredSkills: [
      { skillName: 'Electrical Safety & PPE (IS 5216)', requiredLevel: 4, userLevel: 4, met: true },
      { skillName: 'PVC Conduit & Loop-in Wiring', requiredLevel: 3, userLevel: 2, met: false },
      { skillName: 'Earthing & Resistance Testing', requiredLevel: 3, userLevel: 1, met: false }
    ],
    aiExplanation: {
      strengths: 'Full score in safety gear compliance and lockout tagout procedures.',
      strengthsTamil: 'மின் பாதுகாப்பு மற்றும் பாதுகாப்பு உபகரண பயன்பாட்டில் முழு தகுதி.',
      gaps: 'Substation maintenance requires 3-phase commercial conduit routing and Megger earth checks.',
      gapsTamil: 'முக்கட்ட (3-Phase) வயரிங் மற்றும் எர்த்திங் பரிசோதனையில் பயிற்சி தேவை.',
      roadmapAction: 'Add High-Current Conduit wiring to your active learning pathway.',
      roadmapActionTamil: 'உயர் மின்னோட்ட வயரிங் பயிற்சியை வரைபடத்தில் சேர்க்கவும்.',
      recommendedChallengeId: 'ch-elec-01'
    }
  }
];
