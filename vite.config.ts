import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

function apiMockPlugin(): Plugin {
  return {
    name: 'api-mock-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/roadmap-adapt' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const score = parsed.quizScore !== undefined ? parsed.quizScore : 40
              const topic = parsed.quizTopic || 'Flexbox'
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                action: 'insert_node',
                insertedNode: {
                  id: `remedial-css-layout-${Date.now()}`,
                  stepNumber: 2.5,
                  title: 'CSS Layout Practice',
                  titleTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சி',
                  activity: 'Targeted Flexbox sandbox: alignment, axis orientation, and auto-fit responsive patterns.',
                  timeEstimate: '35 mins',
                  whyThisStep: `Added because you scored ${score}% on ${topic}. Reinforces alignment fundamentals before starting production projects.`,
                  status: 'adaptive_remedial',
                  adaptiveReason: `Added because you scored ${score}% on ${topic}`,
                  lessonContent: {
                    overview: 'This targeted practice module reinforces Flexbox alignment, cross-axis distribution, and responsive fluid layouts without media queries.',
                    overviewTamil: 'இந்த சிறப்புப் பயிற்சி Flexbox அச்சு வரிசைப்படுத்துதலை எளிய செய்முறை மூலம் வலுப்படுத்துகிறது.',
                    keyTakeaways: [
                      'flex-direction: row sets main axis horizontal; align-items aligns vertical cross axis.',
                      'justify-content: space-between spaces child items across main axis.',
                      'flex: 1 1 auto allows fluid expansion without overflow.'
                    ],
                    audioTranscript: 'Welcome to CSS Layout Practice. Let us master Flexbox main and cross axes with interactive hands-on drills.',
                    audioTranscriptTamil: 'CSS கட்டமைப்பு சிறப்புப் பயிற்சிக்கு நல்வரவு. இதில் Flexbox தத்துவங்களை தெளிவாக கற்போம்.',
                    handsOnPrompt: 'Build a 3-item navigation bar using justify-content: space-between and align-items: center.'
                  }
                },
                changelogEntry: `Added because you scored ${score}% on ${topic}`,
                reasoning: `Diagnostic score of ${score}% indicates need for foundational Flexbox alignment drills.`
              }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        if (req.url === '/api/jd-extract' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const jdText = (parsed.jdText || '').toLowerCase()
              res.setHeader('Content-Type', 'application/json')

              if (jdText.includes('tailor') || jdText.includes('stitch') || jdText.includes('blouse')) {
                res.end(JSON.stringify({
                  role: "Boutique Sample Tailor & Pattern Assistant",
                  company: "Kongu Apparel & Bridal Studio, Tiruppur",
                  requiredSkills: [
                    { name: "Body Measurement & Ease Allowances", importance: "must", category: "Pattern Prep", why: "Accurate bust, armhole, and 1.5-inch ease calculations." },
                    { name: "Katori & 4-Dart Blouse Drafting", importance: "must", category: "Cutting Craft", why: "Drafting paper patterns on fabric grain line with 1/4\" margins." },
                    { name: "Lockstitch Sewing & Tension Control", importance: "must", category: "Assembly", why: "Balanced thread tension at 10 stitches per inch without puckering." },
                    { name: "Bias Binding & Neckline Piping", importance: "must", category: "Finishing", why: "True 45-degree cord insertion for seamless bridal blouse necks." },
                    { name: "Steam Pressing & Seam Opening", importance: "nice", category: "Quality Control", why: "Flattening open seams without shine marks before client delivery." }
                  ],
                  softSkills: ["Eye for fabric tension nuance", "Patience for curved seam accuracy"],
                  eligibility: ["Vocational Skill Mission certificate or self-taught proof", "Photo portfolio of blouse seams"]
                }))
              } else if (jdText.includes('electric') || jdText.includes('wire')) {
                res.end(JSON.stringify({
                  role: "Domestic Wireman & Solar Substation Helper",
                  company: "Shevaroy Green Energy & Electricals, Salem",
                  requiredSkills: [
                    { name: "Electrical Safety & PPE (IS 5216)", importance: "must", category: "Safety Standard", why: "Zero-compromise de-energization and insulated tools." },
                    { name: "PVC Conduit & Loop-in Wiring", importance: "must", category: "Installation", why: "Phase color-coding and staircase two-way switch logic." },
                    { name: "Pipe/Plate Earthing & Megger Test", importance: "must", category: "Protection", why: "Earth resistance fall-of-potential verification under 5 ohms." },
                    { name: "Single-phase & 3-phase Load Balance", importance: "nice", category: "Calculations", why: "Preventing neutral wire overheating in residential circuits." }
                  ],
                  softSkills: ["Strict adherence to IER rules", "Safety vigilance under pressure"],
                  eligibility: ["ITI Wireman / Electrician certificate or apprenticeship"]
                }))
              } else {
                res.end(JSON.stringify({
                  role: "Junior React & Frontend Engineering Intern",
                  company: "Vaigai Digital Solutions, Chennai",
                  requiredSkills: [
                    { name: "Semantic HTML & Accessibility", importance: "must", category: "Core Frontend", why: "Mandatory for WCAG 2.1 AA citizen portal compliance." },
                    { name: "Responsive CSS & Flex/Grid", importance: "must", category: "Styling", why: "Layout must scale from 320px mobile to ultra-wide." },
                    { name: "JavaScript & DOM Manipulation", importance: "must", category: "Logic", why: "Handling async event loops and debounced search triggers." },
                    { name: "React Components & Hooks", importance: "must", category: "UI Architecture", why: "Primary technology stack for all production user interfaces." },
                    { name: "REST API & State Caching", importance: "must", category: "State Management", why: "Handling offline cache fallbacks and Zod payload safety." },
                    { name: "Git Version Control", importance: "nice", category: "Dev Tools", why: "Collaborating via pull requests and conventional commits." }
                  ],
                  softSkills: ["Bilingual communication (Tamil / English)", "Attention to design fidelity"],
                  eligibility: ["Diploma or BCA / B.Sc / B.E. graduate (or equivalent self-taught proof)", "Portfolio prioritized over college tier"]
                }))
              }
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        if (req.url === '/api/rubric-feedback' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const challengeId = parsed.challengeId || 'challenge-web-profile'
              const version = parsed.submission?.version || parsed.version || 1
              res.setHeader('Content-Type', 'application/json')

              if (challengeId === 'challenge-comm-intro') {
                if (version === 1) {
                  res.end(JSON.stringify({
                    criteria: [
                      {
                        name: 'Clarity & Articulation',
                        score: 20,
                        max: 25,
                        evidence: "Spoken delivery is distinct and clear in bilingual Tamil and English, with pleasant greeting ('வணக்கம்').",
                        fix: "Eliminate hesitant conversational fillers ('umm', 'basically') in the opening 10 seconds."
                      },
                      {
                        name: 'Relevant Skills & Evidence Citation',
                        score: 16,
                        max: 30,
                        evidence: "Self-identifies as aspiring frontend engineer and tailor, but does not cite any verified rubric scores or project evidence.",
                        fix: "Explicitly cite verified SkillBridge proof: 'I scored 92% on responsive CSS and built a live e-commerce catalog for Salem weavers'."
                      },
                      {
                        name: 'Professional Warmth & Cultural Respect',
                        score: 21,
                        max: 25,
                        evidence: "Courteous tone with respectful greeting and confident enthusiasm for local technology solutions.",
                        fix: "State in 1 sentence how your technical and craft skills solve real problems for local enterprises or users."
                      },
                      {
                        name: 'Brevity & Actionable Closing',
                        score: 15,
                        max: 20,
                        evidence: "Pitch ran for 62 seconds, exceeding the recommended 45-second target window.",
                        fix: "Condense conversational background and end with a crisp call to action: 'I am ready for a frontend engineering apprenticeship in Tamil Nadu'."
                      }
                    ],
                    overall: 72,
                    strengths: [
                      "Warm, respectful bilingual opening with clear Tamil pronunciation",
                      "Demonstrates genuine enthusiasm for craftsmanship and digital products"
                    ],
                    improvements: [
                      "Cite concrete verified rubric scores (92% CSS proof) rather than vague self-ratings",
                      "Keep duration strictly under 45 seconds for recruiter screening",
                      "Conclude with a specific, actionable career objective"
                    ],
                    version: 1
                  }))
                } else {
                  res.end(JSON.stringify({
                    criteria: [
                      {
                        name: 'Clarity & Articulation',
                        score: 25,
                        max: 25,
                        evidence: "Crisp 38-second bilingual articulation with zero filler sounds, perfect pacing, and confident projection.",
                        fix: "None needed; articulation and cadence are recruiter-ready."
                      },
                      {
                        name: 'Relevant Skills & Evidence Citation',
                        score: 28,
                        max: 30,
                        evidence: "Directly cited: 'I hold verified 92% rubric proof in semantic HTML and responsive CSS, and built an e-commerce catalog for Salem weavers.'",
                        fix: "Exemplary evidence backing; connects verifiable proof directly to employer need."
                      },
                      {
                        name: 'Professional Warmth & Cultural Respect',
                        score: 25,
                        max: 25,
                        evidence: "Respectful bilingual greeting ('வணக்கம், I am Priya from Salem') with genuine passion for civic technology.",
                        fix: "None needed; demonstrates cultural empathy and polished professional presence."
                      },
                      {
                        name: 'Brevity & Actionable Closing',
                        score: 18,
                        max: 20,
                        evidence: "Finished in exactly 38 seconds with a clear closing: 'I am actively seeking a junior frontend internship in Chennai or remote.'",
                        fix: "Superb closing timing; respects interviewer schedule."
                      }
                    ],
                    overall: 96,
                    strengths: [
                      "Mastered 38-second high-density elevator pitch with zero filler words",
                      "Evidence-backed skill claim citing verified 92% rubric proof",
                      "Strong cultural grounding and clear civic motivation"
                    ],
                    improvements: [
                      "Fully validated; ready for live recruiter and mentor viva presentations"
                    ],
                    version: 2
                  }))
                }
              } else {
                if (version === 1) {
                  res.end(JSON.stringify({
                    criteria: [
                      {
                        name: 'Semantic Landmarks & Accessibility',
                        score: 21,
                        max: 25,
                        evidence: "Found <header role='banner'> and <main id='content'>. Skip link present but missing visible focus ring.",
                        fix: "Add :focus-visible { outline: 3px solid #B8761A; outline-offset: 2px; } to the skip-to-content anchor tag."
                      },
                      {
                        name: 'Responsive Grid & Flexbox Scaling',
                        score: 20,
                        max: 30,
                        evidence: "Flex container used for profile cards, but rigid 'width: 480px' causes layout break on narrow displays.",
                        fix: "Replace fixed width with 'flex: 1 1 280px' and add 'min-width: 0' to prevent child elements from expanding beyond parent container."
                      },
                      {
                        name: 'Mobile Viewport & Zero Horizontal Overflow',
                        score: 16,
                        max: 25,
                        evidence: "Horizontal scrollbar triggered on 320px viewport emulation due to 'min-width: 360px' on card inner wrapper.",
                        fix: "Remove 'min-width: 360px'; use 'max-width: 100%' and fluid padding 'clamp(12px, 3vw, 24px)'."
                      },
                      {
                        name: 'Focus Visible & High Contrast',
                        score: 17,
                        max: 20,
                        evidence: "Primary headings pass 7:1 contrast. Secondary bio text '#999' on parchment has contrast ratio of 3.2:1 (fails WCAG AA 4.5:1).",
                        fix: "Darken secondary text color token to '#5C4033' or '#4A3B32' to guarantee >= 5:1 contrast."
                      }
                    ],
                    overall: 74,
                    strengths: [
                      "Clean landmark hierarchy without redundant <div> wrappers",
                      "Relative REM units used consistently for headings and icons"
                    ],
                    improvements: [
                      "Eliminate horizontal scrollbar on 320px mobile viewport caused by rigid min-width",
                      "Upgrade secondary text contrast ratio from 3.2:1 to >= 4.5:1",
                      "Make flex child elements fluid using flex: 1 1 280px and min-width: 0"
                    ],
                    version: 1
                  }))
                } else {
                  res.end(JSON.stringify({
                    criteria: [
                      {
                        name: 'Semantic Landmarks & Accessibility',
                        score: 25,
                        max: 25,
                        evidence: "Accessible skip-link has high-contrast 3px gold focus ring. Landmark tree is complete with ARIA landmarks.",
                        fix: "None needed; landmark accessibility is production ready."
                      },
                      {
                        name: 'Responsive Grid & Flexbox Scaling',
                        score: 29,
                        max: 30,
                        evidence: "Fluid flex layout with repeat(auto-fit, minmax(280px, 1fr)) and flex: 1 1 280px scales flawlessly without layout shift.",
                        fix: "Optional: add container queries for ultra-wide widescreen monitors."
                      },
                      {
                        name: 'Mobile Viewport & Zero Horizontal Overflow',
                        score: 25,
                        max: 25,
                        evidence: "Verified 0 horizontal overflow across 320px, 375px, 768px, and 1280px viewport tests.",
                        fix: "None needed; flawless mobile viewport containment."
                      },
                      {
                        name: 'Focus Visible & High Contrast',
                        score: 19,
                        max: 20,
                        evidence: "All text tokens exceed 5.4:1 contrast ratio. Visible :focus-visible styling on all interactive elements.",
                        fix: "Optional: add subtle transition on focus ring appearance."
                      }
                    ],
                    overall: 98,
                    strengths: [
                      "Eliminated 320px mobile overflow; cards scale smoothly with clamp() and minmax()",
                      "Exemplary keyboard navigation with visible focus rings",
                      "High-contrast WCAG 2.1 AA certified color tokens across light and dark modes"
                    ],
                    improvements: [
                      "Consider adding subtle micro-interaction transitions on active button states"
                    ],
                    version: 2
                  }))
                }
              }
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        if (req.url === '/api/viva' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const action = parsed.action || (parsed.answer !== undefined ? 'score_answer' : 'generate_questions')
              const challengeId = parsed.challengeId || 'challenge-web-profile'
              res.setHeader('Content-Type', 'application/json')

              if (action === 'score_answer') {
                const answer = (parsed.answer || '').toLowerCase()
                const isUnderstanding =
                  answer.length > 20 &&
                  !answer.includes('dunno') &&
                  !answer.includes("don't know") &&
                  !answer.includes('copied')
                const score = isUnderstanding ? 92 : 55
                const note = isUnderstanding
                  ? 'Demonstrates authentic understanding of architectural decisions and trade-offs.'
                  : 'Response lacks specific architectural explanation from your submitted code.'

                res.end(JSON.stringify({ score, note }))
                return
              }

              // Default: action === 'generate_questions'
              if (challengeId === 'challenge-comm-intro' || challengeId.includes('comm')) {
                res.end(
                  JSON.stringify({
                    questions: [
                      {
                        id: 'q1',
                        question:
                          'Why did you choose to cite your verified 92% rubric score instead of general credentials?',
                        questionTamil:
                          'பொதுவான தகுதிக்குப் பதிலாக 92% சரிபார்க்கப்பட்ட மதிப்பெண்ணை ஏன் குறிப்பிட்டீர்கள்?',
                        context: 'Inspects your evidence-based pitch strategy.'
                      },
                      {
                        id: 'q2',
                        question:
                          'How did you structure the 40-second pacing between greeting, skills, and the closing ask?',
                        questionTamil:
                          '40 வினாடிகளுக்குள் வாழ்த்து, திறன்கள், மற்றும் வாய்ப்பு கேட்பதை எவ்வாறு அமைத்தீர்கள்?',
                        context: 'Examines your information density and elevator pitch cadence.'
                      },
                      {
                        id: 'q3',
                        question:
                          "Why is beginning with a culturally respectful Tamil greeting like 'வணக்கம்' impactful for local employers?",
                        questionTamil:
                          "'வணக்கம்' போன்ற மரியாதையான அறிமுகம் உள்ளூர் நிறுவனங்களிடம் ஏற்படுத்தும் தாக்கம் என்ன?",
                        context: 'Verifies cultural warmth and civic connection in your communication.'
                      }
                    ]
                  })
                )
              } else if (challengeId.includes('tailor') || challengeId.includes('garment') || challengeId.includes('stitch') || challengeId.includes('katori')) {
                res.end(
                  JSON.stringify({
                    questions: [
                      {
                        id: 'q1',
                        question: 'Why did you select a 1.5-inch ease allowance for the chest and armhole curve?',
                        questionTamil: 'மார்பு மற்றும் கைவளைவுக்கு 1.5 அங்குல தளர்வு அளவை ஏன் தேர்ந்தெடுத்தீர்கள்?',
                        context: 'Verifies your pattern ease calculation for breathing room and drape.'
                      },
                      {
                        id: 'q2',
                        question: 'How did you check stitch balance at 10 stitches per inch to avoid seam puckering?',
                        questionTamil: 'தையல் சுருக்கம் ஏற்படாமல் இருக்க 10 தையல் அடர்த்தியை எவ்வாறு சோதித்தீர்கள்?',
                        context: 'Evaluates needle thread tension calibration on the bobbin.'
                      },
                      {
                        id: 'q3',
                        question: 'What method did you use to cut the bias binding tape at an exact 45-degree angle?',
                        questionTamil: 'கழுத்து பைப்பிங் நாடாவை சரியான 45 பாகை கோணத்தில் எவ்வாறு வெட்டினீர்கள்?',
                        context: 'Confirms true bias fabric stretch for smooth curved necklines.'
                      }
                    ]
                  })
                )
              } else if (challengeId.includes('electric') || challengeId.includes('wire') || challengeId.includes('earthing')) {
                res.end(
                  JSON.stringify({
                    questions: [
                      {
                        id: 'q1',
                        question: 'Why is earth resistance testing with a Megger fall-of-potential test required below 5 ohms?',
                        questionTamil: 'புவித் தொடுப்பு மின்தடை 5 ஓம்களுக்கு குறைவாக இருக்க வேண்டும் என்று ஏன் சோதிக்கப்படுகிறது?',
                        context: 'Tests compliance with IS 3043 grounding standards.'
                      },
                      {
                        id: 'q2',
                        question: 'How did you ensure phase, neutral, and earth wires strictly adhere to IS 5216 color codes?',
                        questionTamil: 'மின் கம்பிகளின் வண்ணக் குறியீடுகள் IS 5216 விதிகளுக்கு உட்பட்டு இருப்பதை எவ்வாறு உறுதி செய்தீர்கள்?',
                        context: 'Inspects safety wiring color verification.'
                      },
                      {
                        id: 'q3',
                        question: 'What safety isolation steps did you follow before tightening terminal connections?',
                        questionTamil: 'இணைப்புகளை இறுக்கும் முன் என்ன பாதுகாப்பு நடைமுறைகளைப் பின்பற்றினீர்கள்?',
                        context: 'Validates LOTO and de-energized line testing protocol.'
                      }
                    ]
                  })
                )
              } else {
                res.end(
                  JSON.stringify({
                    questions: [
                      {
                        id: 'q1',
                        question: 'Why did you choose flex over grid for the header and navigation links?',
                        questionTamil:
                          'தலைப்பு மற்றும் வழிசெலுத்தல் இணைப்புகளுக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?',
                        context: 'Inspects your 1D vs 2D layout choice in the header.'
                      },
                      {
                        id: 'q2',
                        question:
                          "How did you ensure the profile layout doesn't horizontally scroll on a 320px mobile viewport?",
                        questionTamil:
                          '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல் இருக்க என்ன செய்தீர்கள்?',
                        context: 'Examines your clamp() and fluid flex-basis implementation.'
                      },
                      {
                        id: 'q3',
                        question:
                          'What role does the visible :focus-visible skip-link play for accessibility and screen reader users?',
                        questionTamil:
                          'விசைப்பலகை வழிசெலுத்தலில் skip-link இணைப்பின் முக்கிய பங்கு என்ன?',
                        context: 'Tests your understanding of WCAG 2.1 AA keyboard accessibility.'
                      }
                    ]
                  })
                )
              }
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        if (req.url === '/api/interview-score' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const transcript = (parsed.transcript || '').trim()
              const durationSeconds = Number(parsed.durationSeconds) || 30
              const roleTitle = parsed.roleTitle || 'Junior Developer'

              const words = transcript ? transcript.split(/\s+/).filter(Boolean) : []
              const wordCount = words.length
              const durationMin = Math.max(0.2, durationSeconds / 60)
              const paceWpm = Math.round(wordCount / durationMin)

              // Detect filler sounds in English, Tamil, and Hindi
              const fillerRegex = /\b(um|uh|er|ah|like|you know|basically|actually|literally|so yeah|அந்த|அதாவது|வந்து|வந்துட்டு|மற்றும்|யா|मतलब|जैसे|अह|उम)\b/gi
              const matchedFillers = transcript.match(fillerRegex) || []
              const fillerWordCount = matchedFillers.length

              // Linguistic clarity: penalizes excessive fillers and very short answers
              const baseClarity = wordCount < 15 ? 65 : 92
              const clarity = Math.min(96, Math.max(50, Math.round(baseClarity - (fillerWordCount * 3.5))))

              // Linguistic confidence: evaluates vocabulary directness and active voice (NOT psychological judgment)
              const activeVerbsRegex = /\b(built|created|designed|implemented|solved|chose|verified|tested|debugged|measured|stitched|wired|queried|joined|நிரூபித்தேன்|செய்தேன்|உருவாக்கினேன்|தேர்ந்தெடுத்தேன்|बनाया|किया|सुलझाया)\b/gi
              const activeMatches = transcript.match(activeVerbsRegex) || []
              const hedgeRegex = /\b(maybe|i guess|probably|not sure|sort of|dunno|தெரியல|शायद)\b/gi
              const hedgeMatches = transcript.match(hedgeRegex) || []
              const confidence = Math.min(95, Math.max(55, Math.round(75 + (activeMatches.length * 4) - (hedgeMatches.length * 6))))

              // Relevance: check role-related terminology
              const lower = transcript.toLowerCase()
              let relevance = 80
              if (lower.includes('css') || lower.includes('html') || lower.includes('react') || lower.includes('dom') || lower.includes('seam') || lower.includes('blouse') || lower.includes('wiring') || lower.includes('safety') || lower.includes('sql') || lower.includes('data')) {
                relevance = 92
              }
              if (lower.includes('rubric') || lower.includes('score') || lower.includes('proof') || lower.includes('test') || lower.includes('mobile') || lower.includes('320px')) {
                relevance = Math.min(98, relevance + 5)
              }

              const overallScore = Math.round((clarity * 0.35) + (confidence * 0.30) + (relevance * 0.35))

              // Generate 3 specific tips
              const tips = [
                paceWpm < 100
                  ? `Pacing (${paceWpm} WPM): Your speech cadence is slightly measured. Aim for 115-140 WPM to maintain natural interview momentum.`
                  : paceWpm > 155
                  ? `Pacing (${paceWpm} WPM): You spoke quite rapidly. Slowing down closer to 125-135 WPM gives technical interviewers time to absorb your points.`
                  : `Pacing (${paceWpm} WPM): Ideal conversational cadence. Your delivery speed aligns comfortably with professional technical interviews.`,

                fillerWordCount > 2
                  ? `Linguistic Fillers: Detected ${fillerWordCount} filler words (${Array.from(new Set(matchedFillers.map((f: string) => f.toLowerCase()))).slice(0, 3).join(', ')}). Replacing fillers with a silent 1-second breath projects deliberate, structured thinking.`
                  : `Linguistic Clarity: Low filler frequency (${fillerWordCount} detected). Clean transition words and concise sentence structures kept your message direct.`,

                `Evidence Citation: When answering technical questions for ${roleTitle}, citing your verified SkillBridge rubric scores (e.g. your verified profile code or craft swatch) transforms generic claims into tamper-evident proof.`
              ]

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                clarity,
                confidence,
                relevance,
                overallScore,
                paceWpm,
                fillerWordCount,
                matchedFillers: Array.from(new Set(matchedFillers.map((f: string) => f.toLowerCase()))),
                tips,
                disclaimer: 'Confidence scoring is derived strictly from linguistic transcript structure and assertive vocabulary. It is not a psychological assessment or judgment of the person.'
              }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiMockPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'bridge-logo.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png',
        'pwa-192x192.svg',
        'pwa-512x512.svg',
        'maskable-icon-512x512.svg'
      ],
      manifest: {
        name: 'SkillBridge AI · தமிழ்நாடு திறன் பாலம்',
        short_name: 'SkillBridge',
        description: 'Evidence-based civic skill-to-opportunity engine for Tamil Nadu youth and craftspeople.',
        theme_color: '#7A1A12',
        background_color: '#FDFBF7',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Google Fonts webfont files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache API endpoints for offline mock fallback
            urlPattern: /\/api\/(roadmap-adapt|jd-extract|rubric-feedback|viva|interview-score)/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'skillbridge-api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})

