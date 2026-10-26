export interface InterviewQuestion {
  id: string;
  questionText: string;
  questionTamil: string;
  questionHindi: string;
  context: string;
  contextTamil: string;
  suggestedPoints: string[];
  sampleAnswerEnglish: string;
  sampleAnswerTamil: string;
}

export interface InterviewRole {
  id: string;
  title: string;
  titleTamil: string;
  category: 'technical' | 'vocational';
  pathwayId: string;
  industry: string;
  companyExample: string;
  description: string;
  descriptionTamil: string;
  questions: InterviewQuestion[];
}

export const interviewRoles: InterviewRole[] = [
  // 1. Junior React Frontend Trainee
  {
    id: 'role-frontend-trainee',
    title: 'Junior React Frontend Trainee',
    titleTamil: 'இளநிலை ரியாக்ட் இணைய உருவாக்குநர்',
    category: 'technical',
    pathwayId: 'junior-web-dev',
    industry: 'Information Technology & Software',
    companyExample: 'Vaigai Digital Solutions, Chennai',
    description: 'Entry-level frontend engineering position building accessible citizen portals, e-commerce storefronts, and dashboard components using modern React and TypeScript.',
    descriptionTamil: 'அணுகல்தன்மை மற்றும் நெகிழ்வான இணையதளங்களை ரியாக்ட் கொண்டு உருவாக்கும் பணி.',
    questions: [
      {
        id: 'q1',
        questionText: 'Can you introduce yourself and explain how you built your responsive profile page to avoid horizontal overflow on 320px mobile screens?',
        questionTamil: 'உங்களை அறிமுகப்படுத்தி, 320px மொபைல் திரைகளில் கிடைமட்டமாக உருளாமல் இருக்க உங்கள் சுயவிவரப் பக்கத்தை எவ்வாறு உருவாக்கினீர்கள் என்று விளக்குங்கள்?',
        questionHindi: 'कृपया अपना परिचय दें और बताएं कि आपने 320px मोबाइल स्क्रीन पर क्षैतिज ओवरफ्लो से बचने के लिए अपनी प्रोफाइल कैसे बनाई?',
        context: 'Tests mobile-first fluid layout fundamentals, CSS clamp, and viewport constraints.',
        contextTamil: 'மொபைல் திரை வடிவமைப்பு மற்றும் CSS clamp பயன்பாட்டு திறன் ஆய்வு.',
        suggestedPoints: [
          'Removed rigid pixel widths; used flex: 1 1 280px with min-width: 0',
          'Applied clamp(14px, 3vw, 24px) for fluid typography',
          'Verified with 0 horizontal scroll compliance at 320px width',
          'Mentioned verified 92% rubric score on SkillBridge'
        ],
        sampleAnswerEnglish: 'வணக்கம், I am Priya from Tiruchirappalli. In my verified SkillBridge project, I built a responsive artisan profile page. To ensure zero horizontal scrolling on narrow 320px viewports, I avoided rigid pixel widths and instead used fluid CSS Grid and flexbox with clamp typography. I achieved a verified 92% rubric score on accessibility and responsive layout.',
        sampleAnswerTamil: 'வணக்கம், நான் திருச்சியிலிருந்து பிரியா. எனது ஸ்கில்பிரிட்ஜ் திட்டப்பணியில் 320px திரையில் கிடைமட்டமாக உருளாமல் இருக்க rigid pixel அளவுகளுக்குப் பதிலாக clamp() மற்றும் flexbox அமைப்பைப் பயன்படுத்தினேன். இதற்கு 92% சரிபார்க்கப்பட்ட மதிப்பெண் பெற்றுள்ளேன்.'
      },
      {
        id: 'q2',
        questionText: 'Why is semantic HTML and keyboard accessibility (such as skip links and focus rings) essential when developing public web portals?',
        questionTamil: 'பொது இணையதளங்களை உருவாக்கும் போது அர்த்தமுள்ள HTML மற்றும் விசைப்பலகை அணுகல்தன்மை ஏன் மிக அவசியமானது?',
        questionHindi: 'सार्वजनिक वेब पोर्टल विकसित करते समय सिमेंटिक HTML और कीबोर्ड एक्सेसिबिलिटी क्यों आवश्यक है?',
        context: 'Evaluates empathy for assistive technology and WCAG 2.1 AA standards compliance.',
        contextTamil: 'உதவி தொழில்நுட்பம் மற்றும் அணுகல்தன்மை தரநிலைகள் பற்றிய புரிதல்.',
        suggestedPoints: [
          'Semantic landmarks (<header>, <main>, <nav>) allow screen reader navigation',
          'Skip links bypass repetitive header links for motor-impaired users',
          ':focus-visible outline ensures high contrast keyboard tab indicators',
          'Citizen portals must be accessible to all users regardless of ability'
        ],
        sampleAnswerEnglish: 'Semantic HTML provides native landmark navigation for screen readers without requiring complex ARIA overrides. Visible focus indicators and skip-to-content links allow motor-impaired and keyboard-only users to bypass repetitive navigation quickly. In my accessible portfolio challenge, I enforced a 3px gold high-contrast outline to meet WCAG AA standards.',
        sampleAnswerTamil: 'அர்த்தமுள்ள HTML கூறுகள் திரை வாசிப்பான்களுக்கு தெளிவான வழிகாட்டலை அளிக்கின்றன. விசைப்பலகை மூலம் வழிசெலுத்துவோருக்கு skip-link மற்றும் தெளிவான focus-ring அத்தியாவசியமானது. இதை நான் எனது திட்டத்தில் முழுமையாக செயல்படுத்தியுள்ளேன்.'
      },
      {
        id: 'q3',
        questionText: 'Describe a challenging JavaScript or DOM bug you encountered in your projects, and walk me through your diagnostic and debugging process.',
        questionTamil: 'உங்கள் திட்டப்பணியில் சந்தித்த ஒரு கடினமான ஜாவாஸ்கிரிப்ட் சிக்கலையும், அதை எவ்வாறு சரிசெய்தீர்கள் என்பதையும் விளக்குங்கள்.',
        questionHindi: 'अपनी परियोजनाओं में आई किसी चुनौतीपूर्ण जावास्क्रिप्ट बग का वर्णन करें और बताएं कि आपने इसे कैसे ठीक किया।',
        context: 'Assesses systematic debugging methodology, DevTools console inspection, and problem solving.',
        contextTamil: 'பிழைத்திருத்த திறன் மற்றும் முறையான அணுகுமுறை ஆய்வு.',
        suggestedPoints: [
          'Identified symptoms in browser DevTools and console stack trace',
          'Isolated the root cause (e.g. event listener memory leak or unhandled async promise)',
          'Implemented clean fix with event delegation or abort controller',
          'Verified fix across multiple browsers and added unit test'
        ],
        sampleAnswerEnglish: 'In my shopping cart exercise, items were duplicating because event listeners were repeatedly bound on dynamic re-renders. I used Chrome DevTools Event Listeners panel to pinpoint the memory leak, then replaced multiple child listeners with single event delegation on the parent container using event.target matching.',
        sampleAnswerTamil: 'எனது வணிக கூடை பயிற்சியில் நிகழ்வு கேட்பான்கள் மீண்டும் மீண்டும் இணைக்கப்பட்டதால் மெமரி கசிவு ஏற்பட்டது. Chrome DevTools மூலம் இதை கண்டறிந்து, பெற்றோர் கூறில் ஒரே நிகழ்வு பரிமாற்றத்தை (Event Delegation) வைத்து அதை சரிசெய்தேன்.'
      }
    ]
  },

  // 2. Rural BPO Web Portal Support Specialist
  {
    id: 'role-rural-bpo-web',
    title: 'Rural BPO Web Portal Support Specialist',
    titleTamil: 'ஊரக இணையதள ஆதரவு நிபுணர்',
    category: 'technical',
    pathwayId: 'junior-web-dev',
    industry: 'E-Governance & Rural BPO Operations',
    companyExample: 'Kaveri Rural Enterprises Hub, Trichy',
    description: 'Support and maintain regional government and artisan cooperative web portals. Handle ticket triage, catalog content updates, and bilingual user troubleshooting.',
    descriptionTamil: 'ஊரக கூட்டுறவு மற்றும் கைவினைஞர் இணையதளங்களை நிர்வகிக்கும் பணி.',
    questions: [
      {
        id: 'q1',
        questionText: 'How would you handle updating an artisan catalog website when an API fetch request fails or network connectivity is slow?',
        questionTamil: 'இணைய வேகம் குறைவாக இருக்கும் போது அல்லது API அழைப்பு தோல்வியடையும் போது இணையதளத்தை எவ்வாறு நிர்வகிப்பீர்கள்?',
        questionHindi: 'धीमी इंटरनेट कनेक्टिविटी या API विफलता के दौरान आप कैटलॉग अपडेट को कैसे संभालेंगे?',
        context: 'Tests resilient offline caching, graceful degradation, and user-friendly error banners.',
        contextTamil: 'இணைய வேகம் குறைந்த சூழலில் மென்பொருள் இயங்குதிறன்.',
        suggestedPoints: [
          'Display friendly bilingual retry banner rather than a blank screen',
          'Fall back to cached localStorage catalog data',
          'Implement timeout and exponential backoff retry logic'
        ],
        sampleAnswerEnglish: 'In rural networks with spotty connectivity, the application should never crash or display blank screens. I implement optimistic UI with cached localStorage data, and show a warm bilingual toast notification informing the user that offline cached content is displayed while attempting background retries.',
        sampleAnswerTamil: 'கிராமப்புற இணையத்தில் பிழை ஏற்பட்டால் வெற்று திரையைக் காட்டாமல், லோக்கல் ஸ்டோரேஜில் உள்ள சேமிக்கப்பட்ட தகவலை காட்டி, பயனர் எளிதில் மீண்டும் முயற்சிக்கும் வகையில் மென்மையான அறிவிப்பை காட்டுவேன்.'
      },
      {
        id: 'q2',
        questionText: 'Explain the difference between CSS Flexbox and CSS Grid in simple terms for a non-technical coworker.',
        questionTamil: 'Flexbox மற்றும் CSS Grid ஆகியவற்றுக்கு இடையேயான வித்தியாசத்தை தொழில்நுட்ப பின்னணி இல்லாத ஒருவருக்கு எவ்வாறு எளிமையாக விளக்குவீர்கள்?',
        questionHindi: 'गैर-तकनीकी सहकर्मी के लिए सरल शब्दों में फ्लेक्सबॉक्स और सीएसएस ग्रिड के बीच का अंतर समझाएं।',
        context: 'Measures plain-language articulation and conceptual clarity.',
        contextTamil: 'எளிய வார்த்தைகளில் தொழில்நுட்பத்தை விளக்கும் திறன்.',
        suggestedPoints: [
          'Flexbox is for 1-dimensional layouts (a single row or column of items)',
          'Grid is for 2-dimensional layouts (both rows and columns simultaneously like a newspaper grid)',
          'Use Flexbox for navigation bars and buttons; use Grid for full-page photo galleries'
        ],
        sampleAnswerEnglish: 'I explain it like arranging books versus building a bookshelf. Flexbox is 1-dimensional, ideal for a single row of buttons or navigation links where items flex to fit. CSS Grid is 2-dimensional, like a full calendar or newspaper with both rows and columns.',
        sampleAnswerTamil: 'Flexbox என்பது ஒரு பரிமாண வரிசை - ஒரு வரிசையில் பொத்தான்களை அடுக்க சிறந்தது. CSS Grid என்பது இரண்டு பரிமாண கட்டமைப்பு - காலண்டர் அல்லது செய்தித்தாள் போல கட்டங்களாக அடுக்க சிறந்தது.'
      },
      {
        id: 'q3',
        questionText: 'Why is bilingual communication in Tamil and English valuable when supporting district rural portal users?',
        questionTamil: 'மாவட்ட ஊரக இணையதள பயனர்களுக்கு ஆதரவு அளிக்கும் போது தமிழ் மற்றும் ஆங்கில இருமொழி தொடர்பு ஏன் மதிப்புமிக்கது?',
        questionHindi: 'स्थानीय उपयोगकर्ताओं की सहायता करते समय द्विभाषी संचार क्यों महत्वपूर्ण है?',
        context: 'Tests cultural empathy, regional linguistic awareness, and respectful user support.',
        contextTamil: 'மரியாதையான இருமொழி தொடர்பு மற்றும் மக்கள் சேவை அணுகுமுறை.',
        suggestedPoints: [
          'Helps rural cooperative leaders feel respected and understood',
          'Translates English technical error codes into plain actionable Tamil advice',
          'Builds digital trust among first-time internet users'
        ],
        sampleAnswerEnglish: 'Many rural artisans and cooperative leaders feel intimidated by English technical jargon. Being able to explain browser caching or photo upload requirements in warm, respectful Tamil builds immediate trust and digital confidence.',
        sampleAnswerTamil: 'கிராமப்புற கைவினைஞர்கள் ஆங்கில தொழில்நுட்ப வார்த்தைகளை கண்டு தயங்கலாம். அவர்களுக்கு புரியும் தமிழில் எளிய வார்த்தைகளில் விளக்கும் போது அவர்களுக்கு டிஜிட்டல் தளங்களின் மீது நம்பிக்கை கூடும்.'
      }
    ]
  },

  // 3. Master Pattern Cutter & Blouse Sample Tailor
  {
    id: 'role-master-tailor',
    title: 'Master Pattern Cutter & Sample Tailor',
    titleTamil: 'முதுநிலை ஆடை வெட்டுநர் & மாதிரி தையற்கலைஞர்',
    category: 'vocational',
    pathwayId: 'tailoring-craft',
    industry: 'Garment Manufacturing & Boutique Apparel',
    companyExample: 'Kongu Apparel Exports & Boutiques, Tiruppur',
    description: 'Precision pattern cutting, measurement verification, and sample blouse construction for boutique bridal wear and export garment lines.',
    descriptionTamil: 'மணப்பெண் ஆடைகள் மற்றும் ஏற்றுமதி ஆடை மாதிரிகளுக்கான துல்லியமான வெட்டுதல் மற்றும் தையல் பணி.',
    questions: [
      {
        id: 'q1',
        questionText: 'How do you calculate body measurement ease allowances before cutting a 4-dart katori blouse paper pattern?',
        questionTamil: '4-டாட் கட்டோரி பிளவுஸ் பேப்பர் பேட்டர்ன் வெட்டுவதற்கு முன் தளர்வு அளவுகளை (Ease allowances) எவ்வாறு கணக்கிடுகிறீர்கள்?',
        questionHindi: 'ब्लाउज का पेपर पैटर्न काटने से पहले आप शरीर के माप में ढीलापन (ease allowance) की गणना कैसे करते हैं?',
        context: 'Verifies precision craft measurement, seam allowances, and drape calculations.',
        contextTamil: 'துல்லியமான தையல் அளவீடு மற்றும் தளர்வு கணக்கீடு.',
        suggestedPoints: [
          'Chest measurement divided by 4 plus 1.5 inches for comfort ease',
          '1/2 inch shoulder seam and 1.5 inch side margin for future alterations',
          'Grain line alignment on fabric to prevent distortion during stitching'
        ],
        sampleAnswerEnglish: 'Before cutting the paper pattern, I take exact body measurements. For the chest, I divide by four and add 1.5 inches of comfort ease, plus 1.5 inches of seam margin for future alterations. I verify apex point height and armhole depth to ensure the arm curve moves freely without pulling.',
        sampleAnswerTamil: 'பேட்டர்ன் வெட்டும் போது மார்பு சுற்றளவை 4-ஆல் வகுத்து 1.5 அங்குல தளர்வு மற்றும் 1.5 அங்குல தையல் மார்ஜின் சேர்க்க வேண்டும். கைவளைவு மற்றும் அப்பக்ஸ் பாயிண்ட் அளவுகளை சரியாக சரிபார்த்து வெட்டுகிறேன்.'
      },
      {
        id: 'q2',
        questionText: 'If sewing machine stitches are puckering or thread breaks on delicate silk fabric, what tension adjustments do you perform?',
        questionTamil: 'பட்டுத் துணியில் தையல் சுருங்குதல் அல்லது நூல் அறுந்து போனால், தையல் இயந்திரத்தின் இழுவிசையை எவ்வாறு சரிசெய்வீர்கள்?',
        questionHindi: 'यदि रेशमी कपड़े पर सिलाई सिकुड़ रही है या धागा टूट रहा है, तो आप मशीन के तनाव को कैसे समायोजित करेंगे?',
        context: 'Examines mechanical calibration of lockstitch machines, bobbin tension, and needle gauge choice.',
        contextTamil: 'தையல் இயந்திர இழுவிசை மற்றும் ஊசி தேர்வு.',
        suggestedPoints: [
          'Switch to fine gauge needle (size 11 or 9 for silk)',
          'Check upper thread tension disc and balance with bobbin case screw',
          'Maintain 10 to 12 stitches per inch cadence'
        ],
        sampleAnswerEnglish: 'On delicate silk, puckering usually occurs from high upper tension or blunt needle gauge. I immediately switch to a size 11 needle, loosen the upper tension spring slightly, and verify the bobbin thread pulls smoothly like a yo-yo before testing on a scrap swatch.',
        sampleAnswerTamil: 'பட்டுத் துணியில் சுருக்கம் வந்தால் ஊசி எண் 11-க்கு மாற்றி, மேல் தையல் ஸ்பிரிங் இழுவிசையை சற்று தளர்த்துவேன். பாபின் கேஸ் திருகையும் சமன் செய்து மாதிரி துணியில் சோதிப்பேன்.'
      },
      {
        id: 'q3',
        questionText: 'How do you ensure 45-degree bias binding creates smooth, wrinkle-free neckline piping on export bridal garments?',
        questionTamil: 'ஏற்றுமதி மணப்பெண் ஆடைகளில் 45 டிகிரி பயாஸ் துணி மூலம் சுருக்கமில்லாத நேர்த்தியான பைப்பிங் செய்வதை எவ்வாறு உறுதி செய்கிறீர்கள்?',
        questionHindi: 'निर्यात गुणवत्ता वाले ब्लाउज पर चिकनी पाइपिंग बनाने के लिए आप 45-डिग्री बायस स्ट्रिप का उपयोग कैसे करते हैं?',
        context: 'Assesses high-end bridal garment finishing, bias cord insertion, and pressing.',
        contextTamil: 'ஆடை இறுதி மெருகூட்டல் மற்றும் பைப்பிங் நேர்த்தி.',
        suggestedPoints: [
          'Strict 45-degree grain cut for maximum natural stretch',
          'Even 1/8-inch cord insertion using zipper foot',
          'Gentle stretching of bias tape while stitching curved necklines'
        ],
        sampleAnswerEnglish: 'I cut the fabric strip at an exact 45-degree bias angle so it stretches uniformly around curves without ripples. I enclose the piping cord using a single-side zipper foot, pull the bias strip gently while feeding, and finish with a steam press open seam.',
        sampleAnswerTamil: 'துணியை துல்லியமாக 45 டிகிரியில் வெட்டினால் மட்டுமே வளைவுகளில் சுருக்கம் இல்லாமல் அமையும். பைப்பிங் நூலை நடுவில் வைத்து சிப்பர் பூட் மூலம் தைத்து, நீராவி இஸ்திரி மூலம் மெருகூட்டுவேன்.'
      }
    ]
  },

  // 4. Solar Rooftop & Domestic Wireman Trainee
  {
    id: 'role-solar-wireman',
    title: 'Solar Rooftop & Domestic Wireman Trainee',
    titleTamil: 'சூரிய மின் தகடு & மின் கம்பி பணியாளர்',
    category: 'vocational',
    pathwayId: 'electrician-trade',
    industry: 'Renewable Energy & Electrical Contracting',
    companyExample: 'Shevaroy Green Energy Corp, Salem',
    description: 'Rooftop solar DC wiring, AC distribution board installation, conduit routing, and grounding safety checks complying with IS 5216 standards.',
    descriptionTamil: 'சூரிய மின் தகடு வயரிங் மற்றும் பாதுகாப்பு எர்த்திங் பணி.',
    questions: [
      {
        id: 'q1',
        questionText: 'Before starting conduit wiring or touching a distribution board, what IS 5216 safety precautions and PPE do you check?',
        questionTamil: 'மின் வயரிங் பணியைத் தொடங்கும் முன் அல்லது விநியோக பெட்டியை தொடும் முன் IS 5216 பாதுகாப்பு நெறிமுறைகளின்படி என்னென்ன சோதிப்பீர்கள்?',
        questionHindi: 'वायरिंग शुरू करने से पहले आप किन सुरक्षा सावधानियों और पीपीई की जांच करते हैं?',
        context: 'Inspects life-saving electrical safety standards, LOTO, and insulated footwear.',
        contextTamil: 'மின்துறை பாதுகாப்பு விதிகள் மற்றும் கவச உபகரணங்கள்.',
        suggestedPoints: [
          'Lock-Out / Tag-Out (LOTO) on main circuit breaker',
          'Verification with calibrated neon voltage tester or multimeter',
          'Insulated rubber gloves (Class 0, 1000V) and safety boots',
          'Dry rubber matting underfoot'
        ],
        sampleAnswerEnglish: 'Safety is non-negotiable under IS 5216. Before touching any panel, I apply Lock-Out/Tag-Out on the main isolator, test all phases with a calibrated multimeter to confirm zero voltage, wear 1000V insulated gloves and dielectric boots, and stand on dry rubber matting.',
        sampleAnswerTamil: 'IS 5216 விதிகளின்படி முதலில் மெயின் சுவிட்சை லாக்-அவுட் செய்து, மல்டிமீட்டர் மூலம் மின்சாரம் இல்லை என்பதை உறுதி செய்வேன். 1000V இன்சுலேட்டட் கையுறைகள் மற்றும் பாதுகாப்பு காலணிகளை அணிந்தே பணியைத் தொடங்குவேன்.'
      },
      {
        id: 'q2',
        questionText: 'How do you perform a pipe earthing fall-of-potential test with a Megger, and what resistance value must be achieved?',
        questionTamil: 'மெக்கர் (Megger) கொண்டு எர்த்திங் மின்தடை பரிசோதனையை எவ்வாறு செய்வீர்கள்? என்ன மதிப்பு வர வேண்டும்?',
        questionHindi: 'मेगर के साथ अर्थिंग परीक्षण कैसे किया जाता है और क्या मान प्राप्त होना चाहिए?',
        context: 'Assesses knowledge of earthing resistance testing and fall-of-potential electrode spacing.',
        contextTamil: 'எர்த்திங் மின்தடை சோதனை முறை.',
        suggestedPoints: [
          'Place current and potential spike electrodes at 15m and 30m distance',
          'Rotate Megger crank at 160 RPM or use digital earth tester',
          'Achieve reading strictly below 5 ohms for domestic and below 1 ohm for solar substation'
        ],
        sampleAnswerEnglish: 'I drive the potential and current auxiliary spikes at 15 meters and 30 meters from the earth electrode in a straight line. Using the 4-terminal earth tester, I read the resistance. For residential solar installations, the value must be strictly under 5 ohms, and ideally below 1 ohm for power stations.',
        sampleAnswerTamil: 'எர்த் எலக்ட்ரோடிலிருந்து 15 மீட்டர் மற்றும் 30 மீட்டர் தூரத்தில் இரண்டு முள் கம்பிகளை நட்டு, மெக்கர் கருவி மூலம் அளவிடுவேன். வீட்டு பயன்பாட்டிற்கு 5 ஓம்ஸ்-க்கு குறைவாகவும், சோலார் மின் நிலையங்களுக்கு 1 ஓம்ஸ்-க்கு குறைவாகவும் இருக்க வேண்டும்.'
      },
      {
        id: 'q3',
        questionText: 'Explain how a staircase two-way switch circuit works to control one light from two locations.',
        questionTamil: 'ஒரு மின்விளக்கை இரண்டு இடங்களில் இருந்து கட்டுப்படுத்தும் படிக்கட்டு சுவிட்ச் (Two-way switch) எவ்வாறு இயங்குகிறது?',
        questionHindi: 'सीढ़ी टू-वे स्विच सर्किट कैसे काम करता है, समझाएं।',
        context: 'Tests fundamental domestic circuit wiring and SPDT switch terminals.',
        contextTamil: 'படிக்கட்டு இருவழி சுவிட்ச் வயரிங் தத்துவம்.',
        suggestedPoints: [
          'Uses two Single Pole Double Throw (SPDT) switches with 3 terminals each',
          'Two strapper wires connect L1 to L1 and L2 to L2',
          'Phase connects to common of switch 1; light load connects to common of switch 2'
        ],
        sampleAnswerEnglish: 'A staircase circuit uses two SPDT switches. The phase wire connects to the common terminal of switch 1. Two strapper wires run between L1 and L2 of both switches. The common terminal of switch 2 connects directly to the lamp, allowing either switch to complete or break the circuit.',
        sampleAnswerTamil: 'படிக்கட்டு சுவிட்சில் இரண்டு SPDT சுவிட்சுகள் பயன்படுகின்றன. மெயின் பேஸ் முதல் சுவிட்சின் காமனில் இணையும். இரண்டு ஸ்ட்ராப்பர் கம்பிகள் சுவிட்சுகளுக்கு இடையே செல்லும். இரண்டாவது சுவிட்சின் காமன் விளக்கிற்குச் செல்லும்.'
      }
    ]
  },

  // 5. Junior Data & MIS Reporting Analyst
  {
    id: 'role-data-analyst',
    title: 'Junior Data & MIS Reporting Analyst',
    titleTamil: 'இளநிலை தரவு மற்றும் MIS ஆய்வாளர்',
    category: 'technical',
    pathwayId: 'data-analyst',
    industry: 'Business Intelligence & Supply Chain Analytics',
    companyExample: 'Coromandel Analytics Group, Chennai',
    description: 'Data extraction, SQL window function aggregations, and automated weekly reporting dashboards tracking retail supply chain performance.',
    descriptionTamil: 'SQL மற்றும் எக்செல் மூலம் வணிக தரவு பகுப்பாய்வு மற்றும் அறிக்கை தயாரிப்பு.',
    questions: [
      {
        id: 'q1',
        questionText: 'When tracking regional district sales, when do you choose an INNER JOIN versus a LEFT JOIN in SQL?',
        questionTamil: 'மாவட்ட விற்பனை தரவுகளை இணைக்கும் போது SQL-ல் INNER JOIN எப்போது, LEFT JOIN எப்போது பயன்படுத்துவீர்கள்?',
        questionHindi: 'एसक्यूएल में आप INNER JOIN बनाम LEFT JOIN कब चुनते हैं?',
        context: 'Tests relational database design, null handling, and data reporting integrity.',
        contextTamil: 'SQL தரவுத்தள அட்டவணைகள் இணைப்பு தத்துவம்.',
        suggestedPoints: [
          'INNER JOIN returns records matching in both tables (e.g. stores that made active sales)',
          'LEFT JOIN preserves all left table records even if right table has zero matching records (e.g. all registered stores, including zero-sales outlets)',
          'Crucial for reporting non-performing districts accurately'
        ],
        sampleAnswerEnglish: 'I use an INNER JOIN when analyzing transactions where matching records must exist on both sides, like sales tied to valid product SKUs. I choose a LEFT JOIN when reporting on all districts, ensuring branches with zero sales are still listed with NULL instead of being accidentally omitted.',
        sampleAnswerTamil: 'இரண்டு அட்டவணைகளிலும் பொருந்தும் தரவுகளை மட்டும் எடுக்க INNER JOIN உதவும். அனைத்து கிளைகளையும் காட்டி, விற்பனை இல்லாத கிளைகளை NULL என பார்க்க LEFT JOIN உதவும்.'
      },
      {
        id: 'q2',
        questionText: 'How do you structure an automated Excel Power Query pipeline to clean messy CSV inputs without manual copy-pasting?',
        questionTamil: 'குழப்பமான CSV தரவுகளை கைகளால் நகலெடுக்காமல் எக்செல் Power Query மூலம் எவ்வாறு தானாக தூய்மைப்படுத்துவீர்கள்?',
        questionHindi: 'मैन्युअल कॉपी-पेस्ट के बिना CSV डेटा को साफ करने के लिए आप एक्सेल पावर क्वेरी कैसे सेट करते हैं?',
        context: 'Assesses ETL automation mindset, schema consistency, and repeatable reporting.',
        contextTamil: 'தரவு ஆட்டோமேஷன் மற்றும் தூய்மைப்படுத்தும் பணிப்பாய்வு.',
        suggestedPoints: [
          'Connect to source folder or CSV directly via Data > Get Data',
          'Promote headers, trim whitespace, change data types, and filter out null rows',
          'Load to Data Model; subsequent weeks require just clicking "Refresh All"'
        ],
        sampleAnswerEnglish: 'Instead of repetitive manual editing, I connect Power Query directly to the raw folder. I apply transformation steps like promoting headers, trimming whitespace, and setting explicit currency types. When new weekly files drop in, a single click on Refresh All updates the pivot tables instantly.',
        sampleAnswerTamil: 'Power Query-ல் கோப்புறையை நேரடியாக இணைத்து, தேவையில்லாத இடைவெளிகளை நீக்கி, சரியான தரவு வகைகளை அமைப்பேன். அடுத்த வாரம் புதிய கோப்பு வரும் போது Refresh All அழுத்தினால் தானாக அறிக்கை தயாராகிவிடும்.'
      },
      {
        id: 'q3',
        questionText: 'How do you present data findings clearly to store managers who prefer simple visual summaries over raw database tables?',
        questionTamil: 'சிக்கலான அட்டவணைகளை விரும்பாத கிளை மேலாளர்களுக்கு தரவு முடிவுகளை எவ்வாறு எளிமையாக காட்சிப்படுத்துவீர்கள்?',
        questionHindi: 'स्टोर प्रबंधकों को आप डेटा निष्कर्ष सरलता से कैसे समझाते हैं?',
        context: 'Tests data storytelling, KPI prioritization, and executive communication.',
        contextTamil: 'தரவு கதைசொல்லல் மற்றும் எளிய காட்சிப்படுத்தல்.',
        suggestedPoints: [
          'Lead with 3 actionable KPI cards (Total Revenue, Top SKU, Inventory Turnover)',
          'Use clear bar charts with direct callouts rather than 20-column spreadsheets',
          'Provide clear next steps: "Re-order SKU A; discontinue SKU B"'
        ],
        sampleAnswerEnglish: 'Branch managers need answers, not rows of numbers. I highlight top 3 KPI cards with trend arrows, pair it with a single bar chart showing top-selling products, and add a one-line recommendation like "Stock 20% more cotton shirts for weekend rush".',
        sampleAnswerTamil: 'மேலாளர்களுக்கு எண்களை விட முடிவுகள் முக்கியம். 3 முக்கியமான KPI கார்டுகளுடன் எளிய வரைபடத்தை வைத்து, "இந்த வாரம் இந்த பொருளை அதிகம் இருப்பு வைக்கவும்" என நேரடி ஆலோசனையை வழங்குவேன்.'
      }
    ]
  }
];
