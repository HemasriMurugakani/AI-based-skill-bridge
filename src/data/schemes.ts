export interface GovernmentScheme {
  id: string;
  name: string;
  nameTamil: string;
  ministryOrAuthority: string;
  ministryOrAuthorityTamil: string;
  targetBeneficiaries: string;
  targetBeneficiariesTamil: string;
  officialUrl: string;
  badgeTag: string;
  keyHighlights: string[];
  keyHighlightsTamil: string[];
  description: string;
  descriptionTamil: string;
  learnMoreCtaText: string;
  learnMoreCtaTextTamil: string;
}

export const governmentSchemes: GovernmentScheme[] = [
  {
    id: 'scheme-skill-india',
    name: 'Skill India Digital Hub',
    nameTamil: 'திறன் இந்தியா டிஜிட்டல் தளம்',
    ministryOrAuthority: 'Ministry of Skill Development & Entrepreneurship (MSDE), Govt of India',
    ministryOrAuthorityTamil: 'மத்திய திறன் மேம்பாட்டு மற்றும் தொழில்முனைவோர் அமைச்சகம்',
    targetBeneficiaries: 'Youth, Students, ITI / Vocational Diploma holders, and Job Seekers',
    targetBeneficiariesTamil: 'இளைஞர்கள், மாணவர்கள், தொழிற்பயிற்சி மற்றும் பட்டதாரிகள்',
    officialUrl: 'https://www.skillindiadigital.gov.in/',
    badgeTag: 'National Digital Skilling Portal',
    description: 'The unified digital public infrastructure for skilling, apprenticeships, and entrepreneurial opportunities across India. Access verified training courses, NSQF qualifications, and sector skill council certifications.',
    descriptionTamil: 'இந்தியா முழுவதும் திறன் மேம்பாடு, தொழிற்பயிற்சி மற்றும் வேலைவாய்ப்புகளுக்கான ஒருங்கிணைந்த தேசிய டிஜிட்டல் தளம்.',
    keyHighlights: [
      'National Skills Qualification Framework (NSQF) aligned courses',
      'Digital verifiable skill credentials and badges',
      'Discovery of accredited training centres in your district',
      'Direct link to PMKVY 4.0 free training tracks'
    ],
    keyHighlightsTamil: [
      'தேசிய திறன் தகுதி கட்டமைப்பு (NSQF) அடிப்படையிலான படிப்புகள்',
      'டிஜிட்டல் சரிபார்க்கக்கூடிய திறன் சான்றிதழ்கள்',
      'உங்கள் மாவட்டத்தில் உள்ள அங்கீகரிக்கப்பட்ட பயிற்சி மையங்கள்',
      'PMKVY 4.0 இலவச பயிற்சிகளுக்கான நேரடி இணைப்பு'
    ],
    learnMoreCtaText: 'Learn about Skill India Digital',
    learnMoreCtaTextTamil: 'திறன் இந்தியா பற்றி அறிக'
  },
  {
    id: 'scheme-naps',
    name: 'National Apprenticeship Promotion Scheme (NAPS)',
    nameTamil: 'தேசிய தொழிற்பழகுநர் ஊக்குவிப்புத் திட்டம் (NAPS)',
    ministryOrAuthority: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
    ministryOrAuthorityTamil: 'திறன் மேம்பாட்டு மற்றும் தொழில்முனைவோர் அமைச்சகம்',
    targetBeneficiaries: 'Candidates with minimum 5th standard up to graduates & ITI passouts',
    targetBeneficiariesTamil: '5-ஆம் வகுப்பு முதல் பட்டதாரிகள் மற்றும் ITI முடித்தவர்கள் வரை',
    officialUrl: 'https://www.apprenticeshipindia.gov.in/',
    badgeTag: 'Industry Apprenticeship & Stipend',
    description: 'Encourages establishments to engage apprentices by providing financial support: Government reimburses 25% of prescribed stipend up to ₹1,500 per month per apprentice directly via DBT.',
    descriptionTamil: 'தொழிற்சாலைகளில் நேரடி செய்முறை பயிற்சியுடன் மத்திய அரசின் மாத உதவித்தொகை (ரூ.1,500 வரை DBT மூலம்) வழங்கும் திட்டம்.',
    keyHighlights: [
      'On-the-job training in manufacturing, IT, retail, and services',
      'Monthly stipend shared between industry and Central Government',
      'National Apprenticeship Certificate (NAC) recognized across India',
      'Opportunity to transition into full-time roles upon contract completion'
    ],
    keyHighlightsTamil: [
      'உற்பத்தி, தகவல் தொழில்நுட்பம் மற்றும் சேவைத் துறைகளில் நேரடி பயிற்சி',
      'நிறுவனம் மற்றும் மத்திய அரசால் வழங்கப்படும் மாத உதவித்தொகை',
      'இந்தியா முழுவதும் அங்கீகரிக்கப்பட்ட தேசிய தொழிற்பழகுநர் சான்றிதழ் (NAC)',
      'பயிற்சிக்குப் பிறகு நிரந்தர பணிக்கான வாய்ப்புகள்'
    ],
    learnMoreCtaText: 'Learn about NAPS Apprenticeships',
    learnMoreCtaTextTamil: 'NAPS தொழிற்பழகுநர் திட்டம் பற்றி அறிக'
  },
  {
    id: 'scheme-naan-mudhalvan',
    name: 'Naan Mudhalvan - Tamil Nadu Skill Initiative',
    nameTamil: 'நான் முதல்வன் - தமிழ்நாடு திறன் மேம்பாட்டு திட்டம்',
    ministryOrAuthority: 'Tamil Nadu Skill Development Corporation (TNSDC), Govt of Tamil Nadu',
    ministryOrAuthorityTamil: 'தமிழ்நாடு திறன் மேம்பாட்டுக் கழகம் (TNSDC), தமிழ்நாடு அரசு',
    targetBeneficiaries: 'College students, Polytechnic diploma learners, and Tamil Nadu youth',
    targetBeneficiariesTamil: 'கல்லூரி மாணவர்கள், பாலிடெக்னிக் மாணவர்கள் மற்றும் தமிழக இளைஞர்கள்',
    officialUrl: 'https://www.naanmudhalvan.tn.gov.in/',
    badgeTag: 'Tamil Nadu State Flagship Initiative',
    description: 'Flagship initiative of the Government of Tamil Nadu to equip 10 lakh youth annually with cutting-edge skills in technology, coding, engineering, green jobs, and soft skills aligned with global industry requirements.',
    descriptionTamil: 'ஆண்டுதோறும் 10 லட்சம் இளைஞர்களுக்கு நவீன தொழில்நுட்பம் மற்றும் வேலைவாய்ப்பு திறன்களை இலவசமாக வழங்கும் தமிழ்நாடு அரசின் திட்டம்.',
    keyHighlights: [
      'Embedded college semester courses with tech industry leaders',
      'Free certification tracks in cloud, React, Python, and data',
      'District-level mega placement camps across all 38 districts',
      'Tamil-first learning materials and mentorship support'
    ],
    keyHighlightsTamil: [
      'முன்னணி நிறுவனங்களுடன் இணைந்து கல்லூரி பாடத்திட்டத்தில் திறன் பயிற்சி',
      'கிளவுட், ரியாக்ட், பைதான் ஆகியவற்றில் இலவச சான்றிதழ்கள்',
      '38 மாவட்டங்களிலும் நடைபெறும் மாபெரும் வேலைவாய்ப்பு முகாம்கள்',
      'தமிழ் வழியிலான கற்றல் உதவிகள் மற்றும் வழிகாட்டல்'
    ],
    learnMoreCtaText: 'Learn about Naan Mudhalvan Scheme',
    learnMoreCtaTextTamil: 'நான் முதல்வன் திட்டம் பற்றி அறிக'
  },
  {
    id: 'scheme-pm-vishwakarma',
    name: 'PM Vishwakarma Scheme for Artisans & Craftspeople',
    nameTamil: 'பிஎம் விஸ்வகர்மா - பாரம்பரிய கைவினைஞர்கள் திட்டம்',
    ministryOrAuthority: 'Ministry of Micro, Small and Medium Enterprises (MoMSME), Govt of India',
    ministryOrAuthorityTamil: 'மத்திய குறு, சிறு மற்றும் நடுத்தர தொழில் அமைச்சகம்',
    targetBeneficiaries: 'Traditional artisans & craftspeople (18 trades: Tailors, Electricians, Carpenters, Blacksmiths, etc.)',
    targetBeneficiariesTamil: '18 பாரம்பரிய கைவினைஞர்கள் (தையற்கலைஞர், எலக்ட்ரீசியன், தச்சர், கொத்தனார் உள்பட)',
    officialUrl: 'https://pmvishwakarma.gov.in/',
    badgeTag: 'Artisan Toolkit & Enterprise Credit',
    description: 'Holistic support for hands-on craftspeople working with their hands and tools. Provides PM Vishwakarma Certificate, 5-day basic skill training with ₹500/day stipend, ₹15,000 modern toolkit incentive, and collateral-free loans at 5% interest.',
    descriptionTamil: 'பாரம்பரிய கைவினைஞர்களுக்கு அடையாள அட்டை, ரூ.15,000 உபகரண மானியம் மற்றும் 5% வட்டியில் பிணையில்லா கடன் உதவி வழங்கும் திட்டம்.',
    keyHighlights: [
      'Official PM Vishwakarma Certificate and ID Card',
      '₹15,000 digital e-voucher for purchasing modern tools & sewing machines',
      'Collateral-free enterprise loan up to ₹1 Lakh (Tranche 1) and ₹2 Lakh (Tranche 2) at 5%',
      'Digital transaction incentive of ₹1 per transaction up to 100 transactions/month'
    ],
    keyHighlightsTamil: [
      'அதிகாரப்பூர்வ கைவினைஞர் சான்றிதழ் மற்றும் அடையாள அட்டை',
      'நவீன தையல் / கைவினை உபகரணங்கள் வாங்க ரூ.15,000 மானியம்',
      '5% குறைந்த வட்டியில் ரூ.3 லட்சம் வரை பிணையில்லா வணிகக் கடன்',
      'டிஜிட்டல் பரிவர்த்தனைகளுக்கு ஊக்கத்தொகை'
    ],
    learnMoreCtaText: 'Learn about PM Vishwakarma',
    learnMoreCtaTextTamil: 'பிஎம் விஸ்வகர்மா பற்றி அறிக'
  },
  {
    id: 'scheme-nats',
    name: 'National Apprenticeship Training Scheme (NATS)',
    nameTamil: 'தேசிய தொழிற்பயிற்சி திட்டம் (NATS)',
    ministryOrAuthority: 'Board of Apprenticeship Training (BOAT) / Ministry of Education, Govt of India',
    ministryOrAuthorityTamil: 'மத்திய கல்வி அமைச்சகம் / தொழிற்பயிற்சி வாரியம்',
    targetBeneficiaries: 'Engineering, Technology, Diploma, and General Graduates (B.A, B.Sc, B.Com, BCA)',
    targetBeneficiariesTamil: 'பொறியியல், டிப்ளமோ மற்றும் கலை/அறிவியல் பட்டதாரிகள்',
    officialUrl: 'https://nats.education.gov.in/',
    badgeTag: 'Graduate Apprenticeship Portal',
    description: 'A flagship 1-year on-the-job training program for technically and non-technically qualified youth. Bridges the gap between academic learning and corporate workplace expectations with guaranteed monthly stipend.',
    descriptionTamil: 'பட்டதாரிகளுக்கு நிறுவனங்களில் 1 ஆண்டு நேரடி தொழிற்பயிற்சி மற்றும் மத்திய அரசின் மாதாந்திர உதவித்தொகை வழங்கும் திட்டம்.',
    keyHighlights: [
      'Direct enrollment with leading public and private sector enterprises',
      'Monthly stipend protected under the Apprentices Act',
      'Practical exposure to professional engineering & enterprise workflows',
      'Certificate of Proficiency issued by Government of India'
    ],
    keyHighlightsTamil: [
      'முன்னணி அரசு மற்றும் தனியார் நிறுவனங்களில் நேரடி பதிவு',
      'தொழிற்பழகுநர் சட்டத்தின்படி உறுதி செய்யப்பட்ட மாத உதவித்தொகை',
      'நிறுவன பணிச்சூழலில் நேரடி செய்முறை அனுபவம்',
      'மத்திய அரசால் வழங்கப்படும் தொழிற்திறன் சான்றிதழ்'
    ],
    learnMoreCtaText: 'Learn about NATS Portal',
    learnMoreCtaTextTamil: 'NATS போர்டல் பற்றி அறிக'
  }
];
