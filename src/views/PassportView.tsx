import React from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { QRCodeSVG } from 'qrcode.react';
import { BadgeMedal } from '../components/BadgeMedal';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { KolamDivider } from '../components/KolamDivider';
import {
  Share2,
  Printer,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText
} from 'lucide-react';

export const PassportView: React.FC = () => {
  const { getPersona, getCurrentPathway, badges, vivaRecords, setActiveTab } = useSkillBridgeStore();
  const persona = getPersona();
  const pathway = getCurrentPathway();
  const [expandedVivaId, setExpandedVivaId] = React.useState<string | null>('challenge-web-profile');

  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const vivaList = Object.values(vivaRecords);
  const passportUrl = `https://skillbridge.tn.gov.in/verify/${persona.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
            Verified Skill Passport
          </h1>
          <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
            சரிபார்க்கப்பட்ட திறன் கடவுச்சீட்டு
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resume')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500 hover:bg-gold-600 text-maroon-950 text-xs font-bold shadow-warm-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate 1-Page Resume</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-parchment-200 dark:bg-night-100 border border-warm-border text-xs font-semibold hover:bg-parchment-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(passportUrl)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-semibold shadow-warm-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Verifiable Link</span>
          </button>
        </div>
      </div>

      {/* Verifiable Passport Certificate Document */}
      <div className="relative p-6 sm:p-10 rounded-card-lg bg-parchment-50 dark:bg-night-card border-2 border-gold-400/60 dark:border-gold-600/60 shadow-warm-lg overflow-hidden">
        {/* Kolam Ornamental Border Accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-600 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-600 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-600 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-600 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-warm-border/80 dark:border-night-border/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 border border-gold-300 text-gold-900 dark:text-gold-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>Tamil Nadu Civic Skill & Opportunity Initiative</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage text-maroon-900 dark:text-gold-200">
            SkillBridge AI Verifiable Credential
          </h2>
          <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
            உறுதிப்படுத்தப்பட்ட திறன் சான்றளிப்பு ஆவணம்
          </div>

          <div id="passport-mentor-seal" className="mt-3 flex items-center justify-center gap-4 text-xs">
            <StatusPill status="mentor_verified" mentorName="K. Senthil Nathan" />
            <TrustLabel type="evidence-badge" />
          </div>
        </div>

        {/* Learner Profile Details & QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-center">
          <div className="flex items-center gap-4 md:col-span-2">
            <img
              src={persona.avatar}
              alt={persona.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-gold-400 shadow-warm-md shrink-0"
            />
            <div>
              <div className="text-xs font-semibold text-warm-muted dark:text-night-muted">
                CREDENTIAL HOLDER
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                {persona.name}
              </h3>
              <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                {persona.nameTamil}
              </div>
              <div className="text-xs text-maroon-700 dark:text-gold-400 font-semibold mt-1">
                {persona.educationOrBackground}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-warm-muted mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{persona.location}</span>
              </div>
            </div>
          </div>

          {/* Tamper-Evident QR Code Verification Box */}
          <div id="passport-qr-box" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-gold-400/40 text-center">
            <QRCodeSVG value={passportUrl} size={90} fgColor="#7A1A12" bgColor="transparent" />
            <div className="text-[10px] font-bold text-maroon-800 dark:text-gold-300 mt-2">
              SCAN TO VERIFY PROOFS
            </div>
            <div className="text-[9px] text-warm-muted dark:text-night-muted">
              ID: TN-SB-{persona.id.toUpperCase()}-2026
            </div>
          </div>
        </div>

        <KolamDivider className="my-6" />

        {/* Verified Competencies Matrix */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
            Assessed Skills & Verified Evidence ({pathway.title})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathway.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-xl bg-white/70 dark:bg-night-card border border-warm-border/80 dark:border-night-border/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-warm-ink dark:text-night-ink">{skill.name}</div>
                  <div className="font-tamil text-[10px] text-warm-muted dark:text-night-muted">
                    {skill.nameTamil}
                  </div>
                  <div className="text-[10px] text-forest-700 dark:text-forest-400 mt-0.5">
                    ✓ {skill.evidenceCount} validated evidence {skill.evidenceCount === 1 ? 'proof' : 'proofs'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm font-heritage text-maroon-800 dark:text-gold-400">
                    {skill.score ? `${skill.score}%` : 'Pending'}
                  </span>
                  <div className="text-[9px] text-warm-muted uppercase">Level {skill.level}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Project Evidence & Authenticity Defenses */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider">
                Verified Project Evidence & Authenticity Defenses ({vivaList.length})
              </h4>
              <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                சரிபார்க்கப்பட்ட சான்றுகள் மற்றும் வாய்மொழி விளக்கங்கள்
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/70 border border-forest-300 text-forest-800 dark:text-forest-200 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>Evidence status: Viva completed</span>
              </span>
            </div>
          </div>

          {/* Mandated Screen Explanation: Why we ask */}
          <div className="p-3.5 rounded-xl bg-gold-50/90 dark:bg-gold-950/50 border border-gold-300/80 dark:border-gold-800/60 mb-3 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-gold-700 dark:text-gold-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-maroon-900 dark:text-gold-300">
                Why we ask: skills should be yours, not copied.
              </div>
              <div className="font-tamil text-[11px] text-maroon-800/80 dark:text-gold-400/90 font-medium">
                ஏன் கேட்கிறோம்: திறன்கள் உங்களுடையதாக இருக்க வேண்டும், நகலெடுக்கப்பட்டதாக அல்ல.
              </div>
              <div className="text-[11px] text-warm-muted dark:text-night-muted mt-0.5">
                Every verified challenge in this passport requires a 3-question viva defense. We assess whether the learner can explain their own architectural trade-offs without invasive surveillance or punitive labels.
              </div>
            </div>
          </div>

          {/* List of Viva Defended Evidences */}
          <div className="space-y-3">
            {vivaList.map((viva) => {
              const isExpanded = expandedVivaId === viva.challengeId;
              const isConsistent = viva.authenticityConfidence === 'Consistent';

              return (
                <div
                  key={viva.challengeId}
                  className="rounded-2xl bg-white/80 dark:bg-night-card border border-warm-border/80 dark:border-night-border/80 overflow-hidden shadow-xs"
                >
                  <div
                    onClick={() => setExpandedVivaId(isExpanded ? null : viva.challengeId)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-parchment-100/50 dark:hover:bg-night-100/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 border border-forest-300 text-forest-800 dark:text-forest-200 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                          <span>Viva completed</span>
                        </span>

                        {/* Authenticity Confidence Indicator (NEVER CHEATER) */}
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            isConsistent
                              ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 border border-forest-300'
                              : 'bg-gold-50 dark:bg-gold-900/40 text-gold-900 dark:text-gold-200 border border-gold-300'
                          }`}
                        >
                          {isConsistent ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                          ) : (
                            <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
                          )}
                          <span>Authenticity confidence: {viva.authenticityConfidence}</span>
                        </span>
                      </div>

                      <div className="font-bold text-sm text-warm-ink dark:text-night-ink">
                        {viva.challengeTitle}
                      </div>
                      <div className="text-[11px] text-warm-muted">
                        Verified at: {viva.completedAt} • {viva.qa.length} technical defense questions answered
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="font-heritage text-base font-extrabold text-maroon-800 dark:text-gold-400">
                          {viva.averageScore}%
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-warm-muted">
                          Understanding
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1 rounded-full text-warm-muted hover:text-warm-ink"
                        aria-label="Toggle viva breakdown"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown of the 3 questions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-warm-border/50 dark:border-night-border/50 bg-parchment-50/50 dark:bg-night-100/40 space-y-2 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted pt-2">
                        Oral / Written Defense Transcripts ({viva.qa.length} questions)
                      </div>
                      {viva.qa.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-night-card border border-warm-border/70 dark:border-night-border/70 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2 font-bold text-warm-ink dark:text-night-ink">
                            <span>Q{idx + 1}: {item.question}</span>
                            <span className="font-heritage text-maroon-800 dark:text-gold-400 font-bold shrink-0">
                              {item.score}%
                            </span>
                          </div>
                          {item.questionTamil && (
                            <div className="font-tamil text-[11px] text-maroon-800 dark:text-gold-400/90">
                              {item.questionTamil}
                            </div>
                          )}
                          <div className="p-2 rounded-lg bg-parchment-100/70 dark:bg-night-200/50 text-[11px] text-warm-ink dark:text-night-ink italic">
                            "{item.answer}"
                          </div>
                          <div className="text-[11px] text-forest-700 dark:text-forest-400 font-medium">
                            ✓ {item.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Badges Showcase */}
        <div>
          <h4 className="text-sm font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
            Evidence-Backed Micro-Credentials ({unlockedBadges.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {unlockedBadges.map((badge) => (
              <BadgeMedal
                key={badge.id}
                badge={badge}
                size="sm"
                showDetails={true}
              />
            ))}
          </div>
        </div>

        {/* Bottom Endorsement & Trust Footnote */}
        <div className="mt-8 pt-6 border-t border-warm-border/80 dark:border-night-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-muted dark:text-night-muted">
          <div>
            <div className="font-bold text-warm-ink dark:text-night-ink">Mentor Endorsement:</div>
            <div className="italic text-[11px]">
              "Workplace readiness attested based on reproducible code repository and pattern drafting accuracy."
            </div>
          </div>
          <div className="text-right text-[11px]">
            <div>Issued by <span className="font-bold">SkillBridge AI Civic Platform</span></div>
            <div>Valid indefinitely • Backed by cryptographic checksum</div>
          </div>
        </div>
      </div>
    </div>
  );
};
