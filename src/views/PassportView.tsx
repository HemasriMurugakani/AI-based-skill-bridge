import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
            {isTa ? 'சரிபார்க்கப்பட்ட திறன் கடவுச்சீட்டு' : 'Verified Skill Passport'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resume')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] text-xs font-semibold shadow-soft transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTa ? '1-பக்க சுயவிவரத்தை உருவாக்கு' : 'Generate 1-Page Resume'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-white hover:bg-[#EAF5FC] border border-[#E2E8F0] text-[#173B67] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isTa ? 'அச்சிடுக / PDF சேமிக்க' : 'Print / Save PDF'}</span>
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(passportUrl)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] text-xs font-semibold border border-[#BAE6FD] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isTa ? 'சரிபார்க்கக்கூடிய இணைப்பை நகலெடு' : 'Copy Verifiable Link'}</span>
          </button>
        </div>
      </div>

      {/* Verifiable Passport Certificate Document */}
      <div className="relative p-6 sm:p-10 rounded-card bg-white dark:bg-night-card border border-[#BAE6FD] dark:border-night-border shadow-soft overflow-hidden">
        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-[#E2E8F0] dark:border-night-border/80">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/70 border border-[#BAE6FD] text-[#173B67] dark:text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-[#62B6E8]" />
            <span>{isTa ? 'தமிழ்நாடு குடிமை திறன் & வாய்ப்பு முயற்சி' : 'Tamil Nadu Civic Skill & Opportunity Initiative'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {isTa ? 'SkillBridge AI உறுதிப்படுத்தப்பட்ட திறன் சான்றளிப்பு ஆவணம்' : 'SkillBridge AI Verifiable Credential'}
          </h2>

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
              alt={isTa ? persona.nameTamil : persona.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-card object-cover border-2 border-[#62B6E8] shadow-soft shrink-0"
            />
            <div>
              <div className="text-xs font-semibold text-[#526174] dark:text-night-muted">
                {isTa ? 'சான்றிதழ் பெற்றவர்' : 'CREDENTIAL HOLDER'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
                {isTa ? persona.nameTamil : persona.name}
              </h3>
              <div className="text-xs text-[#62B6E8] font-semibold mt-1">
                {isTa ? (persona.educationOrBackgroundTamil || persona.educationOrBackground) : persona.educationOrBackground}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#526174] mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isTa ? (persona.locationTamil || persona.location) : persona.location}</span>
              </div>
            </div>
          </div>

          {/* Tamper-Evident QR Code Verification Box */}
          <div id="passport-qr-box" className="flex flex-col items-center justify-center p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#BAE6FD] text-center shadow-xs">
            <QRCodeSVG value={passportUrl} size={90} fgColor="#173B67" bgColor="transparent" />
            <div className="text-[10px] font-bold text-[#173B67] dark:text-sky-300 mt-2">
              {isTa ? 'சான்றுகளை சரிபார்க்க ஸ்கேன் செய்க' : 'SCAN TO VERIFY PROOFS'}
            </div>
            <div className="text-[9px] text-[#526174] dark:text-night-muted">
              ID: TN-SB-{persona.id.toUpperCase()}-2026
            </div>
          </div>
        </div>

        <KolamDivider className="my-6" />

        {/* Verified Competencies Matrix */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
            {isTa ? `மதிப்பிடப்பட்ட திறன்கள் & சரிபார்க்கப்பட்ட சான்றுகள் (${pathway.titleTamil || pathway.title})` : `Assessed Skills & Verified Evidence (${pathway.title})`}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathway.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#173B67] dark:text-white">
                    {isTa ? (skill.nameTamil || skill.name) : skill.name}
                  </div>
                  <div className="text-[10px] text-[#10B981] font-medium mt-0.5">
                    ✓ {skill.evidenceCount} {isTa ? 'சரிபார்க்கப்பட்ட சான்றுகள்' : `validated evidence ${skill.evidenceCount === 1 ? 'proof' : 'proofs'}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[#173B67] dark:text-sky-300">
                    {skill.score ? `${skill.score}%` : (isTa ? 'நிலுவையில்' : 'Pending')}
                  </span>
                  <div className="text-[9px] text-[#526174] uppercase">{isTa ? 'நிலை' : 'Level'} {skill.level}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Project Evidence & Authenticity Defenses */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-[#173B67] dark:text-white uppercase tracking-wider">
                {isTa ? `சரிபார்க்கப்பட்ட திட்ட சான்றுகள் & வாய்மொழி விளக்கங்கள் (${vivaList.length})` : `Verified Project Evidence & Authenticity Defenses (${vivaList.length})`}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/70 border border-[#A7F3D0] text-[#065F46] dark:text-emerald-200 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{isTa ? 'சான்று நிலை: வாய்மொழி முடிந்தது' : 'Evidence status: Viva completed'}</span>
              </span>
            </div>
          </div>

          {/* Mandated Screen Explanation: Why we ask */}
          <div className="p-3.5 rounded-card bg-[#EAF5FC] dark:bg-deepblue-950/50 border border-[#BAE6FD] mb-3 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#62B6E8] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#173B67] dark:text-sky-200">
                {isTa ? 'ஏன் கேட்கிறோம்: திறன்கள் உங்களுடையதாக இருக்க வேண்டும், நகலெடுக்கப்பட்டதாக அல்ல.' : 'Why we ask: skills should be yours, not copied.'}
              </div>
              <div className="text-[11px] text-[#526174] dark:text-night-muted mt-0.5">
                {isTa
                  ? 'இந்த கடவுச்சீட்டில் சரிபார்க்கப்பட்ட ஒவ்வொரு சவாலுக்கும் 3 கேள்விகள் கொண்ட வாய்மொழி விளக்கம் தேவைப்படுகிறது. ஆக்கிரமிப்பு கண்காணிப்பு அல்லது தண்டனை லேபிள்கள் இல்லாமல், கற்பவர் தனது சொந்த கட்டமைப்பு சமரசங்களை விளக்க முடிகிறதா என்பதை நாங்கள் மதிப்பிடுகிறோம்.'
                  : 'Every verified challenge in this passport requires a 3-question viva defense. We assess whether the learner can explain their own architectural trade-offs without invasive surveillance or punitive labels.'}
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
                  className="rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border/80 overflow-hidden shadow-xs"
                >
                  <div
                    onClick={() => setExpandedVivaId(isExpanded ? null : viva.challengeId)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-night-100/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/80 border border-[#A7F3D0] text-[#065F46] dark:text-emerald-200 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Viva completed</span>
                        </span>

                        {/* Authenticity Confidence Indicator (NEVER CHEATER) */}
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            isConsistent
                              ? 'bg-[#ECFDF5] dark:bg-emerald-900/40 text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0]'
                              : 'bg-[#FFFBEB] dark:bg-amber-900/40 text-[#B45309] dark:text-amber-200 border border-[#FDE68A]'
                          }`}
                        >
                          {isConsistent ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <HelpCircle className="w-3.5 h-3.5 text-[#F2B66D]" />
                          )}
                          <span>
                            {isTa
                              ? `உண்மைத்தன்மை நம்பிக்கை: ${viva.authenticityConfidence === 'Consistent' ? 'சீரானது' : viva.authenticityConfidence}`
                              : `Authenticity confidence: ${viva.authenticityConfidence}`}
                          </span>
                        </span>
                      </div>

                      <div className="font-bold text-sm text-[#173B67] dark:text-white">
                        {viva.challengeTitle}
                      </div>
                      <div className="text-[11px] text-[#526174]">
                        {isTa ? 'சரிபார்க்கப்பட்டது: ' : 'Verified at: '}{viva.completedAt} • {viva.qa.length} {isTa ? 'தொழில்நுட்ப கேள்விகளுக்கு பதிலளிக்கப்பட்டது' : 'technical defense questions answered'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-[#173B67] dark:text-sky-300">
                          {viva.averageScore}%
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#526174]">
                          {isTa ? 'புரிதல்' : 'Understanding'}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1 rounded-full text-[#526174] hover:text-[#173B67]"
                        aria-label="Toggle viva breakdown"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown of the 3 questions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#E2E8F0] dark:border-night-border/50 bg-[#F8FAFC] dark:bg-night-100/40 space-y-2 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174] pt-2">
                        {isTa ? `வாய்மொழி / எழுத்து விளக்க உரை (${viva.qa.length} கேள்விகள்)` : `Oral / Written Defense Transcripts (${viva.qa.length} questions)`}
                      </div>
                      {viva.qa.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border/70 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2 font-bold text-[#173B67] dark:text-white">
                            <span>Q{idx + 1}: {isTa ? (item.questionTamil || item.question) : item.question}</span>
                            <span className="text-[#173B67] dark:text-sky-300 font-bold shrink-0">
                              {item.score}%
                            </span>
                          </div>
                          <div className="p-2 rounded-btn bg-[#F8FAFC] dark:bg-night-200/50 text-[11px] text-[#173B67] dark:text-night-ink italic">
                            "{item.answer}"
                          </div>
                          <div className="text-[11px] text-[#10B981] font-medium">
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
          <h4 className="text-sm font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
            {isTa ? `சான்றளிக்கப்பட்ட நுண்-சான்றிதழ்கள் (${unlockedBadges.length})` : `Evidence-Backed Micro-Credentials (${unlockedBadges.length})`}
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
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-night-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#526174] dark:text-night-muted">
          <div>
            <div className="font-bold text-[#173B67] dark:text-white">{isTa ? 'வழிகாட்டி ஒப்புதல்:' : 'Mentor Endorsement:'}</div>
            <div className="italic text-[11px]">
              "{isTa ? 'மறுஉருவாக்கம் செய்யக்கூடிய குறியீடு மற்றும் வடிவமைப்பு துல்லியத்தின் அடிப்படையில் பணிக்குத் தயார்நிலை சான்றளிக்கப்பட்டது.' : 'Workplace readiness attested based on reproducible code repository and pattern drafting accuracy.'}"
            </div>
          </div>
          <div className="text-right text-[11px]">
            <div>{isTa ? 'வழங்கியது' : 'Issued by'} <span className="font-bold">{isTa ? 'SkillBridge AI குடிமை தளம்' : 'SkillBridge AI Civic Platform'}</span></div>
            <div>{isTa ? 'காலவரையற்ற செல்லுபடியாகும் தன்மை • குறியாக்க செக்சம் மூலம் சரிபார்க்கப்பட்டது' : 'Valid indefinitely • Backed by cryptographic checksum'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
