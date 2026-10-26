import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { QRCodeSVG } from 'qrcode.react';
import { buildVerifiedResumeData } from '../utils/resumeTransformer';
import {
  Download,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  ArrowRight,
  Info,
  Check,
  X
} from 'lucide-react';

export const ResumeView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    challenges,
    vivaRecords,
    badges,
    language: appLanguage,
    setActiveTab
  } = useSkillBridgeStore();

  const persona = getPersona();
  const pathway = getCurrentPathway();

  // 1. Template switcher state: 'heritage-classic' | 'modern-minimal'
  const [template, setTemplate] = useState<'heritage-classic' | 'modern-minimal'>('heritage-classic');

  // 2. Heading Language toggle: 'en' | 'ta'
  const [headingLang, setHeadingLang] = useState<'en' | 'ta'>(appLanguage === 'ta' ? 'ta' : 'en');
  const isTamil = headingLang === 'ta';

  // 3. Audit inclusion/exclusion drawer state
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditTab, setAuditTab] = useState<'all' | 'included' | 'excluded'>('all');

  // 4. Download PDF hint notification
  const [showPrintHint, setShowPrintHint] = useState(false);

  // Compute verified-only resume data
  const data = buildVerifiedResumeData(persona, pathway, challenges, vivaRecords, badges);

  const handleDownloadPdf = () => {
    setShowPrintHint(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Section headings dictionary
  const headings = {
    docTitle: isTamil ? 'சரிபார்க்கப்பட்ட திறன் ரெஸ்யூமே' : 'Verified SkillBridge Resume & Portfolio',
    credentialNotice: isTamil
      ? 'தமிழ்நாடு திறன் முயற்சி: சரிபார்க்கப்பட்ட சான்றுகளிலிருந்து தானாக உருவாக்கப்பட்டது'
      : 'Tamil Nadu Civic Skill Initiative • Auto-generated strictly from verified passport proofs',
    summary: isTamil ? 'தொழில்முறை சுயவிவரம் & சுருக்கம்' : 'Professional Profile & Evidence Summary',
    skills: isTamil ? 'சரிபார்க்கப்பட்ட திறன்கள்' : 'Verified Competencies',
    projects: isTamil ? 'சரிபார்க்கப்பட்ட திட்டப்பணிகள் & சான்றுகள்' : 'Verified Portfolio & Project Proofs',
    communication: isTamil ? 'வாய்மொழி விளக்கம் & தகவல்தொடர்பு' : 'Oral Defense & Viva Articulation',
    credentials: isTamil ? 'சான்றளிக்கப்பட்ட நற்சான்றிதழ்கள்' : 'Verified Micro-Credentials',
    education: isTamil ? 'கல்வி & பின்னணி' : 'Education & Civic Background',
    endorsement: isTamil ? 'வழிகாட்டி சான்றளிப்பு' : 'Mentor Verification & Attestation',
    verifiedPill: isTamil ? 'வழிகாட்டியால் சரிபார்க்கப்பட்டது' : 'Mentor-Verified & Tamper-Evident',
    authenticity: isTamil ? 'உறுதித்தன்மை' : 'Authenticity',
    outcomes: isTamil ? 'முக்கிய சாதனைகள்' : 'Verified Rubric Criteria Met',
    scanToVerify: isTamil ? 'சான்றுகளை சரிபார்க்க ஸ்கேன் செய்க' : 'SCAN TO VERIFY PROOFS',
    auditButton: isTamil ? 'தணிக்கை அறிக்கை' : 'Audit Verification Log',
    downloadPdf: isTamil ? 'PDF பதிவிறக்கு' : 'Download PDF',
    printResume: isTamil ? 'அச்சிடு' : 'Print',
    templateClassic: isTamil ? 'தஞ்சாவூர் ஹெரிடேஜ் (Classic)' : 'Thanjavur Classic (Heritage)',
    templateModern: isTamil ? 'நவீன கலைஞர் (Modern)' : 'Modern Minimalist (Artisan)'
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* =========================================================================
          CONTROL BAR (Toolbar - strictly hidden during printing)
          ========================================================================= */}
      <div className="no-print p-4 sm:p-5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 border border-forest-300 text-forest-800 dark:text-forest-300 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>Verified Passport Only</span>
              </span>
              <span className="text-xs text-warm-muted">
                {data.stats.totalIncluded} included • {data.stats.totalExcluded} excluded
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              1-Page Resume & Portfolio Generator
            </h1>
            <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
              சரிபார்க்கப்பட்ட திறன் கடவுச்சீட்டுப் பதிவுகளிலிருந்து தானாக உருவாக்கப்படும் ஒற்றைப் பக்க ரெஸ்யூமே
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audit Log Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsAuditOpen(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAuditOpen
                  ? 'bg-gold-100 dark:bg-gold-950/70 border-gold-400 text-maroon-900 dark:text-gold-200'
                  : 'bg-parchment-100 dark:bg-night-100 border-warm-border hover:bg-parchment-200 text-warm-ink dark:text-night-ink'
              }`}
            >
              <Info className="w-4 h-4 text-gold-600" />
              <span>{headings.auditButton}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-maroon-700 text-white">
                {data.stats.totalExcluded}
              </span>
              {isAuditOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Template Switcher */}
            <div className="flex items-center rounded-xl bg-parchment-200 dark:bg-night-100 p-1 border border-warm-border">
              <button
                type="button"
                onClick={() => setTemplate('heritage-classic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  template === 'heritage-classic'
                    ? 'bg-maroon-700 text-white shadow-xs'
                    : 'text-warm-muted hover:text-warm-ink'
                }`}
                title="Two-column civic heritage layout"
              >
                {headings.templateClassic}
              </button>
              <button
                type="button"
                onClick={() => setTemplate('modern-minimal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  template === 'modern-minimal'
                    ? 'bg-maroon-700 text-white shadow-xs'
                    : 'text-warm-muted hover:text-warm-ink'
                }`}
                title="Single-page clean modern artisan layout"
              >
                {headings.templateModern}
              </button>
            </div>

            {/* English / Tamil Headings Toggle */}
            <div className="flex items-center rounded-xl bg-parchment-200 dark:bg-night-100 p-1 border border-warm-border">
              <button
                type="button"
                onClick={() => setHeadingLang('en')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  headingLang === 'en'
                    ? 'bg-white dark:bg-night-card text-warm-ink dark:text-night-ink shadow-xs'
                    : 'text-warm-muted hover:text-warm-ink'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setHeadingLang('ta')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-tamil transition-all cursor-pointer ${
                  headingLang === 'ta'
                    ? 'bg-white dark:bg-night-card text-warm-ink dark:text-night-ink shadow-xs'
                    : 'text-warm-muted hover:text-warm-ink'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-warm-sm transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{headings.downloadPdf}</span>
            </button>
          </div>
        </div>

        {/* Helpful Print Tip */}
        {showPrintHint && (
          <div className="p-3 rounded-xl bg-gold-50 dark:bg-gold-950/60 border border-gold-300 text-xs text-maroon-900 dark:text-gold-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
              <span>
                <strong>PDF Export Tip:</strong> In your browser print dialog, set Destination to <strong>"Save as PDF"</strong>, Paper size to <strong>A4</strong>, and ensure <strong>"Background graphics"</strong> is checked for exact heritage palette rendering.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPrintHint(false)}
              className="text-warm-muted hover:text-warm-ink p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          PASSPORT VERIFICATION AUDIT & INCLUSION LOG (Mandatory Feature)
          ========================================================================= */}
      {isAuditOpen && (
        <div className="no-print p-5 rounded-2xl bg-parchment-100 dark:bg-night-card border-2 border-gold-400/80 shadow-warm-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-border">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-maroon-700 dark:text-gold-400" />
                <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                  Passport Verification Audit & Inclusion Log
                </h3>
              </div>
              <p className="text-xs text-warm-muted mt-0.5">
                Every line on this resume is verified against reproducible code, photos, or authenticated viva defenses. Unverified claims, pending mentor reviews, and skill gaps are strictly excluded to protect civic trust.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-parchment-200 dark:bg-night-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setAuditTab('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  auditTab === 'all' ? 'bg-white dark:bg-night-card shadow-xs text-warm-ink' : 'text-warm-muted'
                }`}
              >
                All ({data.stats.totalEvaluated})
              </button>
              <button
                type="button"
                onClick={() => setAuditTab('included')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer ${
                  auditTab === 'included' ? 'bg-forest-100 text-forest-800 shadow-xs' : 'text-warm-muted'
                }`}
              >
                <Check className="w-3 h-3 text-forest-600" />
                <span>Included ({data.stats.totalIncluded})</span>
              </button>
              <button
                type="button"
                onClick={() => setAuditTab('excluded')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer ${
                  auditTab === 'excluded' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-warm-muted'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Excluded ({data.stats.totalExcluded})</span>
              </button>
            </div>
          </div>

          {/* Audit Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {/* INCLUDED ENTRIES */}
            {(auditTab === 'all' || auditTab === 'included') && (
              <>
                {data.verifiedSkills.map((skill) => (
                  <div
                    key={`audit-skill-${skill.id}`}
                    className="p-3 rounded-xl bg-white dark:bg-night-card border border-forest-300 dark:border-forest-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-warm-ink dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {skill.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-forest-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Level {skill.level}/5 with {skill.evidenceCount} verified rubric proofs
                    </div>
                    <div className="text-[10px] text-warm-muted font-mono">
                      Checksum: {skill.verificationStamp}
                    </div>
                  </div>
                ))}

                {data.verifiedProjects.map((proj) => (
                  <div
                    key={`audit-proj-${proj.id}`}
                    className="p-3 rounded-xl bg-white dark:bg-night-card border border-forest-300 dark:border-forest-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-warm-ink dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        <span>{proj.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {proj.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-forest-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Viva Voce completed ({proj.qaCount} defense questions answered)
                    </div>
                    <div className="text-[10px] text-warm-muted font-mono">
                      Verification ID: {proj.verificationId}
                    </div>
                  </div>
                ))}

                {data.verifiedCommunication.map((comm) => (
                  <div
                    key={`audit-comm-${comm.id}`}
                    className="p-3 rounded-xl bg-white dark:bg-night-card border border-forest-300 dark:border-forest-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-warm-ink dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        <span>{comm.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {comm.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-forest-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Spoken pace: {comm.paceWpm} WPM • Authenticity: {comm.authenticityConfidence}
                    </div>
                    <div className="text-[10px] text-warm-muted">
                      Evaluated via Web Speech API and /api/interview-score.
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* EXCLUDED ENTRIES (With clear, transparent reasons) */}
            {(auditTab === 'all' || auditTab === 'excluded') && (
              <>
                {data.excludedEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-parchment-50 dark:bg-night-100/60 border border-amber-300 dark:border-amber-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-warm-ink dark:text-night-ink">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-[10px]">
                        {item.statusBadge}
                      </span>
                    </div>
                    <div className="text-[11px] text-maroon-800 dark:text-gold-300 font-semibold">
                      {item.reason}
                    </div>
                    <div className="text-[11px] text-warm-muted flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-gold-600 shrink-0" />
                      <span>{item.actionRequired}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="pt-2 border-t border-warm-border text-[11px] text-warm-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              All excluded entries remain private to your study roadmap and are never visible on employer scans.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className="text-maroon-700 dark:text-gold-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Practice challenges to verify excluded skills</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          RESUME CANVAS CONTAINER
          ========================================================================= */}
      <div className="flex justify-center">
        {template === 'heritage-classic' ? (
          /* =====================================================================
             TEMPLATE 1: THANJAVUR HERITAGE (EXECUTIVE DUAL-COLUMN)
             ===================================================================== */
          <div
            id="printable-resume"
            className="resume-sheet w-full max-w-[850px] bg-[#FAF8F5] text-[#231C18] rounded-2xl shadow-warm-lg border-2 border-gold-400/80 p-6 sm:p-8 space-y-5 overflow-hidden relative"
            style={{ minHeight: '1080px' }}
          >
            {/* Gold Corner Accents */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-gold-600 pointer-events-none" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-gold-600 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-gold-600 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-gold-600 pointer-events-none" />

            {/* Top Official Banner */}
            <div className="bg-[#7A1A12] text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-gold-400">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-200 text-[10px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>{headings.docTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage tracking-tight text-gold-100">
                  {persona.name}
                </h2>
                <div className="font-tamil text-sm text-gold-200/90 font-medium">
                  {persona.nameTamil} • {isTamil ? pathway.titleTamil : pathway.title}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-gold-100/80 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-400" />
                    <span>{persona.location}</span>
                  </span>
                  <span>•</span>
                  <span>{persona.educationOrBackground}</span>
                  <span>•</span>
                  <span className="font-mono text-gold-300">{data.verificationId}</span>
                </div>
              </div>

              {/* QR Code Verification Stamp */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/95 text-center shadow-xs shrink-0">
                <QRCodeSVG value={data.verificationUrl} size={70} fgColor="#7A1A12" bgColor="transparent" />
                <div className="text-[8px] font-extrabold text-[#7A1A12] mt-1 tracking-wider uppercase">
                  {headings.scanToVerify}
                </div>
                <div className="text-[7px] text-[#231C18]/60 font-mono">
                  {data.verificationId}
                </div>
              </div>
            </div>

            {/* Evidence-Backed Summary */}
            <div className="p-3.5 rounded-xl bg-gold-50/80 border border-gold-300/80 text-xs text-[#231C18]">
              <div className="font-bold text-[#7A1A12] uppercase tracking-wider text-[10px] mb-1">
                {headings.summary}
              </div>
              <p className="leading-relaxed">
                {isTamil ? data.summaryTamil : data.summary}
              </p>
            </div>

            {/* Dual Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* LEFT SIDEBAR (40% width) */}
              <div className="md:col-span-5 space-y-4">
                {/* 1. Verified Competencies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b-2 border-gold-400">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A1A12]">
                      {headings.skills}
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-bold">
                      {data.verifiedSkills.length} Verified
                    </span>
                  </div>

                  <div className="space-y-2">
                    {data.verifiedSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-2.5 rounded-xl bg-white border border-warm-border text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-bold text-warm-ink">
                              {isTamil && skill.nameTamil ? skill.nameTamil : skill.name}
                            </div>
                            <div className="text-[10px] text-warm-muted">
                              {skill.category} • Level {skill.level}/5
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-extrabold text-[11px] shrink-0">
                            {skill.score}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-parchment-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-forest-600 to-forest-500 rounded-full"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-forest-700 font-medium">
                          ✓ {skill.evidenceCount} verified rubric proofs
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Oral Defense & Communication */}
                <div className="space-y-2">
                  <div className="pb-1 border-b-2 border-gold-400">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A1A12]">
                      {headings.communication}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {data.verifiedCommunication.slice(0, 2).map((comm) => (
                      <div
                        key={comm.id}
                        className="p-2.5 rounded-xl bg-white border border-warm-border text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-warm-ink text-[11px]">
                            {isTamil && comm.titleTamil ? comm.titleTamil : comm.title}
                          </span>
                          <span className="font-bold text-[#7A1A12] text-xs">
                            {comm.score}%
                          </span>
                        </div>
                        <div className="text-[10px] text-forest-700 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-forest-600" />
                          <span>Cadence: {comm.paceWpm} WPM • Authenticity: Consistent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Verified Micro-Credentials */}
                <div className="space-y-2">
                  <div className="pb-1 border-b-2 border-gold-400">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A1A12]">
                      {headings.credentials}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {data.verifiedBadges.slice(0, 3).map((badge) => (
                      <div
                        key={badge.id}
                        className="p-2 rounded-lg bg-white border border-warm-border text-[11px] flex items-center gap-2"
                      >
                        <span className="text-base shrink-0">{badge.icon}</span>
                        <div>
                          <div className="font-bold text-warm-ink">
                            {isTamil && badge.titleTamil ? badge.titleTamil : badge.title}
                          </div>
                          <div className="text-[9px] text-warm-muted truncate max-w-[170px]">
                            {badge.evidenceNotes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Education & Background */}
                <div className="space-y-2">
                  <div className="pb-1 border-b-2 border-gold-400">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A1A12]">
                      {headings.education}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-warm-border text-xs">
                    <div className="font-bold text-warm-ink">{persona.educationOrBackground}</div>
                    <div className="text-[10px] text-warm-muted">{persona.location}</div>
                  </div>
                </div>
              </div>

              {/* RIGHT MAIN COLUMN (60% width) */}
              <div className="md:col-span-7 space-y-4">
                {/* 1. Verified Portfolio Projects */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b-2 border-gold-400">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#7A1A12]">
                      {headings.projects}
                    </h3>
                    <span className="text-[9px] text-warm-muted">
                      {isTamil ? 'சான்றளிக்கப்பட்ட குறியீடு' : 'Reproducible Code & Proofs'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.verifiedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3.5 rounded-xl bg-white border border-warm-border shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-sm text-[#7A1A12]">
                              {isTamil && project.titleTamil ? project.titleTamil : project.title}
                            </div>
                            <div className="text-[10px] text-warm-muted">
                              {project.type} • Verified: {project.completedAt}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-extrabold text-xs">
                              {project.score}% Passing Rubric
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-warm-ink leading-relaxed">
                          {isTamil && project.summaryTamil ? project.summaryTamil : project.summary}
                        </p>

                        {/* Verified Rubric Outcomes */}
                        <div className="space-y-1 pt-1 border-t border-warm-border/60">
                          <div className="font-bold text-[10px] text-warm-muted uppercase tracking-wider">
                            {headings.outcomes}:
                          </div>
                          {project.keyOutcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-forest-900">
                              <span className="text-forest-600 font-bold shrink-0">✓</span>
                              <span>{outcome}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[9px] text-warm-muted font-mono">
                          <span>Verification Hash: {project.verificationId}</span>
                          <span className="text-forest-700 font-sans font-semibold">
                            Authenticity: Consistent
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Mentor Endorsement & Attestation Block */}
                <div className="p-3.5 rounded-xl bg-parchment-100 border border-gold-300 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#7A1A12] uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="w-4 h-4 text-gold-600" />
                    <span>{headings.endorsement}</span>
                  </div>
                  <blockquote className="italic text-[11px] text-warm-ink border-l-2 border-[#7A1A12] pl-2.5 leading-relaxed">
                    "{isTamil ? data.mentorEndorsement.statementTamil : data.mentorEndorsement.statement}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-warm-muted">
                    <div>
                      <span className="font-bold text-warm-ink">{data.mentorEndorsement.mentorName}</span>
                      <span className="ml-1">({isTamil ? data.mentorEndorsement.mentorTitleTamil : data.mentorEndorsement.mentorTitle})</span>
                    </div>
                    <span className="font-mono">{data.mentorEndorsement.date}</span>
                  </div>
                </div>

                {/* Footnote / Trust Guarantee */}
                <div className="pt-2 border-t border-warm-border/80 flex items-center justify-between text-[9px] text-warm-muted">
                  <span>Issued under Tamil Nadu Civic SkillBridge Standard</span>
                  <span>Tamper-evident verification at skillbridge.tn.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
             TEMPLATE 2: MODERN MINIMALIST (ARTISAN TECH SINGLE-PAGE)
             ===================================================================== */
          <div
            id="printable-resume"
            className="resume-sheet w-full max-w-[850px] bg-white text-[#1A1412] rounded-2xl shadow-warm-lg border border-warm-border p-6 sm:p-8 space-y-4 overflow-hidden relative"
            style={{ minHeight: '1080px' }}
          >
            {/* Modern Header */}
            <div className="border-b-2 border-[#8B1E14] pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#8B1E14] text-white text-[10px] font-bold tracking-wider uppercase">
                    {headings.verifiedPill}
                  </span>
                  <span className="text-xs font-mono text-warm-muted">{data.verificationId}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1412]">
                  {persona.name}
                </h2>
                <div className="font-tamil text-sm text-[#8B1E14] font-semibold">
                  {persona.nameTamil} • {isTamil ? pathway.titleTamil : pathway.title}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-warm-muted pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8B1E14]" />
                    <span>{persona.location}</span>
                  </span>
                  <span>•</span>
                  <span>{persona.educationOrBackground}</span>
                </div>
              </div>

              {/* Minimal QR Verification */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-parchment-50 border border-warm-border shrink-0">
                <QRCodeSVG value={data.verificationUrl} size={60} fgColor="#8B1E14" bgColor="transparent" />
                <div className="text-left text-[9px]">
                  <div className="font-bold text-[#8B1E14] uppercase">{headings.scanToVerify}</div>
                  <div className="text-warm-muted font-mono">{data.verificationId}</div>
                  <div className="text-forest-700 font-semibold mt-0.5">✓ 100% Tamper-Evident</div>
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="text-xs text-warm-ink leading-relaxed">
              <span className="font-bold text-[#8B1E14] uppercase text-[10px] tracking-wider block mb-0.5">
                {headings.summary}
              </span>
              {isTamil ? data.summaryTamil : data.summary}
            </div>

            {/* Section 1: Verified Competencies (Grid Cards) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-warm-border">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E14]">
                  {headings.skills} ({data.verifiedSkills.length} Verified)
                </h3>
                <span className="text-[10px] text-forest-700 font-semibold">
                  ✓ Backed by 3+ reproducible artifacts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.verifiedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-2.5 rounded-lg bg-parchment-50 border border-warm-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-warm-ink">
                        {isTamil && skill.nameTamil ? skill.nameTamil : skill.name}
                      </div>
                      <div className="text-[10px] text-warm-muted">
                        {skill.category} • {skill.evidenceCount} validated proofs
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-forest-300 text-forest-800 font-extrabold text-xs">
                      {skill.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Verified Portfolio Projects */}
            <div className="space-y-2.5">
              <div className="pb-1 border-b border-warm-border">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E14]">
                  {headings.projects}
                </h3>
              </div>

              <div className="space-y-2.5">
                {data.verifiedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg bg-parchment-50 border border-warm-border space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#8B1E14]">
                          {isTamil && project.titleTamil ? project.titleTamil : project.title}
                        </div>
                        <div className="text-[10px] text-warm-muted">
                          {project.type} • Completed {project.completedAt}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-forest-100 text-forest-800 font-bold text-[11px]">
                        Rubric: {project.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-warm-ink">
                      {isTamil && project.summaryTamil ? project.summaryTamil : project.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1 text-[10px] text-forest-800">
                      {project.keyOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-forest-600 shrink-0" />
                          <span className="truncate">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Spoken Communication & Viva Defense */}
            <div className="space-y-2">
              <div className="pb-1 border-b border-warm-border">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E14]">
                  {headings.communication}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.verifiedCommunication.slice(0, 2).map((comm) => (
                  <div
                    key={comm.id}
                    className="p-2.5 rounded-lg bg-parchment-50 border border-warm-border text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-warm-ink text-[11px]">
                        {isTamil && comm.titleTamil ? comm.titleTamil : comm.title}
                      </div>
                      <div className="text-[10px] text-warm-muted">
                        Pace: {comm.paceWpm} WPM • Authenticity: Consistent
                      </div>
                    </div>
                    <span className="font-extrabold text-[#8B1E14] text-xs">
                      {comm.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Micro-Badges Strip */}
            <div className="space-y-2">
              <div className="pb-1 border-b border-warm-border">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E14]">
                  {headings.credentials}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {data.verifiedBadges.slice(0, 4).map((badge) => (
                  <span
                    key={badge.id}
                    className="px-2.5 py-1 rounded-md bg-parchment-100 border border-warm-border text-xs font-semibold flex items-center gap-1.5 text-warm-ink"
                  >
                    <span>{badge.icon}</span>
                    <span>{isTamil && badge.titleTamil ? badge.titleTamil : badge.title}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Modern Footer Attestation */}
            <div className="pt-3 border-t-2 border-warm-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-warm-muted">
              <div>
                Attested by <span className="font-bold text-warm-ink">{data.mentorEndorsement.mentorName}</span> ({data.mentorEndorsement.mentorTitle})
              </div>
              <div className="font-mono">
                Checksum: {data.verificationId} • skillbridge.tn.gov.in
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
