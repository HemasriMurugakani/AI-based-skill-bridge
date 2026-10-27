import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const {
    getPersona,
    getCurrentPathway,
    challenges,
    vivaRecords,
    badges,
    language: appLanguage,
    setActiveTab
  } = useSkillBridgeStore();

  const isTamil = appLanguage === 'ta';
  const persona = getPersona();
  const pathway = getCurrentPathway();

  // 1. Template switcher state: 'heritage-classic' | 'modern-minimal'
  const [template, setTemplate] = useState<'heritage-classic' | 'modern-minimal'>('heritage-classic');

  // 2. Audit inclusion/exclusion drawer state
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditTab, setAuditTab] = useState<'all' | 'included' | 'excluded'>('all');

  // 3. Download PDF hint notification
  const [showPrintHint, setShowPrintHint] = useState(false);

  // Compute verified-only resume data
  const data = buildVerifiedResumeData(persona, pathway, challenges, vivaRecords, badges);

  const handleDownloadPdf = () => {
    setShowPrintHint(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Section headings dictionary supporting en, ta, fr, and hi
  const headings = {
    docTitle:
      appLanguage === 'ta'
        ? 'சரிபார்க்கப்பட்ட திறன் ரெஸ்யூமே'
        : appLanguage === 'fr'
        ? 'CV & Portfolio certifié SkillBridge'
        : appLanguage === 'hi'
        ? 'सत्यापित स्किलब्रिज बायोडाटा और पोर्टफोलियो'
        : 'Verified SkillBridge Resume & Portfolio',
    credentialNotice:
      appLanguage === 'ta'
        ? 'தமிழ்நாடு திறன் முயற்சி: சரிபார்க்கப்பட்ட சான்றுகளிலிருந்து தானாக உருவாக்கப்பட்டது'
        : appLanguage === 'fr'
        ? 'Initiative de compétences civiques du Tamil Nadu • Généré automatiquement à partir de preuves certifiées'
        : appLanguage === 'hi'
        ? 'तमिलनाडु कौशल पहल • सीधे सत्यापित पासपोर्ट प्रमाणों से स्वतः जनरेट'
        : 'Tamil Nadu Civic Skill Initiative • Auto-generated strictly from verified passport proofs',
    summary:
      appLanguage === 'ta'
        ? 'தொழில்முறை சுயவிவரம் & சுருக்கம்'
        : appLanguage === 'fr'
        ? 'Profil professionnel & Synthèse des preuves'
        : appLanguage === 'hi'
        ? 'व्यावसायिक प्रोफ़ाइल और साक्ष्य सारांश'
        : 'Professional Profile & Evidence Summary',
    skills:
      appLanguage === 'ta'
        ? 'சரிபார்க்கப்பட்ட திறன்கள்'
        : appLanguage === 'fr'
        ? 'Compétences certifiées'
        : appLanguage === 'hi'
        ? 'सत्यापित क्षमताएं'
        : 'Verified Competencies',
    projects:
      appLanguage === 'ta'
        ? 'சரிபார்க்கப்பட்ட திட்டப்பணிகள் & சான்றுகள்'
        : appLanguage === 'fr'
        ? 'Portfolio vérifié & Projets concrets'
        : appLanguage === 'hi'
        ? 'सत्यापित पोर्टफोलियो और प्रोजेक्ट प्रमाण'
        : 'Verified Portfolio & Project Proofs',
    communication:
      appLanguage === 'ta'
        ? 'வாய்மொழி விளக்கம் & தகவல்தொடர்பு'
        : appLanguage === 'fr'
        ? 'Épreuve orale Viva & Élocution'
        : appLanguage === 'hi'
        ? 'मौखिक रक्षा और वाइवा अभिव्यक्ति'
        : 'Oral Defense & Viva Articulation',
    credentials:
      appLanguage === 'ta'
        ? 'சான்றளிக்கப்பட்ட நற்சான்றிதழ்கள்'
        : appLanguage === 'fr'
        ? 'Micro-titres de compétences vérifiés'
        : appLanguage === 'hi'
        ? 'सत्यापित माइक्रो-क्रेडेंशियल्स'
        : 'Verified Micro-Credentials',
    education:
      appLanguage === 'ta'
        ? 'கல்வி & பின்னணி'
        : appLanguage === 'fr'
        ? 'Formation & Parcours'
        : appLanguage === 'hi'
        ? 'शिक्षा और पृष्ठभूमि'
        : 'Education & Civic Background',
    endorsement:
      appLanguage === 'ta'
        ? 'வழிகாட்டி சான்றளிப்பு'
        : appLanguage === 'fr'
        ? 'Attestation & Validation de mentor'
        : appLanguage === 'hi'
        ? 'मेंटर सत्यापन और अभिप्रमाणन'
        : 'Mentor Verification & Attestation',
    verifiedPill:
      appLanguage === 'ta'
        ? 'வழிகாட்டியால் சரிபார்க்கப்பட்டது'
        : appLanguage === 'fr'
        ? 'Vérifié par mentor & Inviolable'
        : appLanguage === 'hi'
        ? 'मेंटर-सत्यापित और सुरक्षित'
        : 'Mentor-Verified & Tamper-Evident',
    authenticity:
      appLanguage === 'ta'
        ? 'உறுதித்தன்மை'
        : appLanguage === 'fr'
        ? 'Authenticité'
        : appLanguage === 'hi'
        ? 'प्रामाणिकता'
        : 'Authenticity',
    outcomes:
      appLanguage === 'ta'
        ? 'முக்கிய சாதனைகள்'
        : appLanguage === 'fr'
        ? 'Critères de grille validés'
        : appLanguage === 'hi'
        ? 'सत्यापित रूब्रिक मानदंड पूर्ण'
        : 'Verified Rubric Criteria Met',
    scanToVerify:
      appLanguage === 'ta'
        ? 'சான்றுகளை சரிபார்க்க ஸ்கேன் செய்க'
        : appLanguage === 'fr'
        ? 'SCANNER POUR VÉRIFIER LES PREUVES'
        : appLanguage === 'hi'
        ? 'प्रमाण सत्यापित करने के लिए स्कैन करें'
        : 'SCAN TO VERIFY PROOFS',
    auditButton:
      appLanguage === 'ta'
        ? 'தணிக்கை அறிக்கை'
        : appLanguage === 'fr'
        ? 'Journal d\'audit de vérification'
        : appLanguage === 'hi'
        ? 'ऑडिट सत्यापन लॉग'
        : 'Audit Verification Log',
    downloadPdf:
      appLanguage === 'ta'
        ? 'PDF பதிவிறக்கு'
        : appLanguage === 'fr'
        ? 'Télécharger le PDF'
        : appLanguage === 'hi'
        ? 'PDF डाउनलोड करें'
        : 'Download PDF',
    printResume:
      appLanguage === 'ta'
        ? 'அச்சிடு'
        : appLanguage === 'fr'
        ? 'Imprimer'
        : appLanguage === 'hi'
        ? 'प्रिंट करें'
        : 'Print',
    templateClassic:
      appLanguage === 'ta'
        ? 'தஞ்சாவூர் கிளாசிக் (ஹெரிடேஜ்)'
        : appLanguage === 'fr'
        ? 'Classique Thanjavur (Héritage)'
        : appLanguage === 'hi'
        ? 'तंजावुर क्लासिक (हेरिटेज)'
        : 'Thanjavur Classic (Heritage)',
    templateModern:
      appLanguage === 'ta'
        ? 'நவீன கலைஞர் (மினிமல்)'
        : appLanguage === 'fr'
        ? 'Minimaliste moderne (Artisan)'
        : appLanguage === 'hi'
        ? 'आधुनिक मिनिमलिस्ट (कारीगर)'
        : 'Modern Minimalist (Artisan)',
    reproducibleCode:
      appLanguage === 'ta'
        ? 'சான்றளிக்கப்பட்ட குறியீடு'
        : appLanguage === 'fr'
        ? 'Code et preuves vérifiables'
        : appLanguage === 'hi'
        ? 'सत्यापित कोड और प्रमाण'
        : 'Reproducible Code & Proofs'
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* =========================================================================
          CONTROL BAR (Toolbar - strictly hidden during printing)
          ========================================================================= */}
      <div className="no-print p-4 sm:p-5 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-forest-950/80 border border-emerald-300 text-emerald-800 dark:text-forest-300 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Passport Only</span>
              </span>
              <span className="text-xs text-[#526174]">
                {data.stats.totalIncluded} included • {data.stats.totalExcluded} excluded
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-night-ink">
              {t('resume.title')}
            </h1>
            <p className="text-xs text-[#526174] dark:text-night-muted">
              {t('resume.subtitle')}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audit Log Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsAuditOpen(prev => !prev)}
              className={`px-3.5 py-2 rounded-btn text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAuditOpen
                  ? 'bg-[#EAF5FC] dark:bg-night-100 border-[#BAE6FD] text-[#173B67] dark:text-sky-300'
                  : 'bg-[#F8FAFC] dark:bg-night-100 border-[#E2E8F0] hover:bg-[#EAF5FC] text-[#173B67] dark:text-night-ink'
              }`}
            >
              <Info className="w-4 h-4 text-[#62B6E8]" />
              <span>{headings.auditButton}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#173B67] text-white">
                {data.stats.totalExcluded}
              </span>
              {isAuditOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Template Switcher */}
            <div className="flex items-center rounded-btn bg-[#F8FAFC] dark:bg-night-100 p-1 border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setTemplate('heritage-classic')}
                className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
                  template === 'heritage-classic'
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'text-[#526174] hover:text-[#173B67]'
                }`}
                title="Two-column civic heritage layout"
              >
                {headings.templateClassic}
              </button>
              <button
                type="button"
                onClick={() => setTemplate('modern-minimal')}
                className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
                  template === 'modern-minimal'
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'text-[#526174] hover:text-[#173B67]'
                }`}
                title="Single-page clean modern artisan layout"
              >
                {headings.templateModern}
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs shadow-soft transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{headings.downloadPdf}</span>
            </button>
          </div>
        </div>

        {/* Helpful Print Tip */}
        {showPrintHint && (
          <div className="p-3 rounded-card bg-[#EAF5FC] dark:bg-night-100/60 border border-[#BAE6FD] text-xs text-[#173B67] dark:text-sky-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#62B6E8] shrink-0" />
              <span>
                <strong>PDF Export Tip:</strong> In your browser print dialog, set Destination to <strong>"Save as PDF"</strong>, Paper size to <strong>A4</strong>, and ensure <strong>"Background graphics"</strong> is checked for exact palette rendering.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPrintHint(false)}
              className="text-[#526174] hover:text-[#173B67] p-1"
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
        <div className="no-print p-5 rounded-card bg-[#F8FAFC] dark:bg-night-card border border-[#BAE6FD] shadow-soft space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-night-border">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#173B67] dark:text-sky-300" />
                <h3 className="text-base font-bold text-[#173B67] dark:text-night-ink">
                  Passport Verification Audit & Inclusion Log
                </h3>
              </div>
              <p className="text-xs text-[#526174] mt-0.5">
                Every line on this resume is verified against reproducible code, photos, or authenticated viva defenses. Unverified claims, pending mentor reviews, and skill gaps are strictly excluded to protect civic trust.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-[#EAF5FC] dark:bg-night-100 p-1 rounded-btn text-xs">
              <button
                type="button"
                onClick={() => setAuditTab('all')}
                className={`px-2.5 py-1 rounded-btn font-semibold cursor-pointer ${
                  auditTab === 'all' ? 'bg-white dark:bg-night-card shadow-soft text-[#173B67]' : 'text-[#526174]'
                }`}
              >
                All ({data.stats.totalEvaluated})
              </button>
              <button
                type="button"
                onClick={() => setAuditTab('included')}
                className={`px-2.5 py-1 rounded-btn font-semibold flex items-center gap-1 cursor-pointer ${
                  auditTab === 'included' ? 'bg-emerald-50 text-emerald-800 shadow-soft' : 'text-[#526174]'
                }`}
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Included ({data.stats.totalIncluded})</span>
              </button>
              <button
                type="button"
                onClick={() => setAuditTab('excluded')}
                className={`px-2.5 py-1 rounded-btn font-semibold flex items-center gap-1 cursor-pointer ${
                  auditTab === 'excluded' ? 'bg-amber-50 text-amber-900 shadow-soft' : 'text-[#526174]'
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
                    className="p-3 rounded-card bg-white dark:bg-night-card border border-emerald-200 dark:border-forest-800/80 space-y-1.5 text-xs shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#173B67] dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-forest-950 text-emerald-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {skill.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Level {skill.level}/5 with {skill.evidenceCount} verified rubric proofs
                    </div>
                    <div className="text-[10px] text-[#526174] font-mono">
                      Checksum: {skill.verificationStamp}
                    </div>
                  </div>
                ))}

                {data.verifiedProjects.map((proj) => (
                  <div
                    key={`audit-proj-${proj.id}`}
                    className="p-3 rounded-card bg-white dark:bg-night-card border border-emerald-200 dark:border-forest-800/80 space-y-1.5 text-xs shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#173B67] dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{proj.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-forest-950 text-emerald-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {proj.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Viva Voce completed ({proj.qaCount} defense questions answered)
                    </div>
                    <div className="text-[10px] text-[#526174] font-mono">
                      Verification ID: {proj.verificationId}
                    </div>
                  </div>
                ))}

                {data.verifiedCommunication.map((comm) => (
                  <div
                    key={`audit-comm-${comm.id}`}
                    className="p-3 rounded-card bg-white dark:bg-night-card border border-emerald-200 dark:border-forest-800/80 space-y-1.5 text-xs shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#173B67] dark:text-night-ink">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{comm.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-forest-950 text-emerald-800 dark:text-forest-300 font-extrabold text-[11px]">
                        ✓ {comm.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-forest-400 font-medium">
                      Status: INCLUDED • Spoken pace: {comm.paceWpm} WPM • Authenticity: {comm.authenticityConfidence}
                    </div>
                    <div className="text-[10px] text-[#526174]">
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
                    className="p-3 rounded-card bg-white dark:bg-night-100/60 border border-amber-300 dark:border-amber-800/80 space-y-1.5 text-xs shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#173B67] dark:text-night-ink">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-[10px]">
                        {item.statusBadge}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#173B67] dark:text-sky-300 font-semibold">
                      {item.reason}
                    </div>
                    <div className="text-[11px] text-[#526174] flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-[#62B6E8] shrink-0" />
                      <span>{item.actionRequired}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#526174] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              All excluded entries remain private to your study roadmap and are never visible on employer scans.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className="text-[#173B67] dark:text-sky-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
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
            className="resume-sheet w-full max-w-[850px] bg-white text-[#173B67] rounded-card shadow-soft border border-[#BAE6FD] p-6 sm:p-8 space-y-5 overflow-hidden relative"
            style={{ minHeight: '1080px' }}
          >
            {/* Top Accent Borders */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#62B6E8] pointer-events-none" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#62B6E8] pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#62B6E8] pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#62B6E8] pointer-events-none" />

            {/* Top Official Banner */}
            <div className="bg-[#173B67] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#62B6E8]">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#62B6E8]/20 text-[#62B6E8] text-[10px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F2B66D]" />
                  <span>{headings.docTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {isTamil ? persona.nameTamil : persona.name}
                </h2>
                <div className={`text-sm text-sky-200/90 font-medium ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? pathway.titleTamil : pathway.title}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-sky-100/80 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#F2B66D]" />
                    <span>{persona.location}</span>
                  </span>
                  <span>•</span>
                  <span>{persona.educationOrBackground}</span>
                  <span>•</span>
                  <span className="font-mono text-[#F2B66D]">{data.verificationId}</span>
                </div>
              </div>

              {/* QR Code Verification Stamp */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white text-center shadow-xs shrink-0">
                <QRCodeSVG value={data.verificationUrl} size={70} fgColor="#173B67" bgColor="transparent" />
                <div className="text-[8px] font-extrabold text-[#173B67] mt-1 tracking-wider uppercase">
                  {headings.scanToVerify}
                </div>
                <div className="text-[7px] text-[#173B67]/60 font-mono">
                  {data.verificationId}
                </div>
              </div>
            </div>

            {/* Evidence-Backed Summary */}
            <div className="p-3.5 rounded-2xl bg-[#EAF5FC] border border-[#62B6E8]/30 text-xs text-[#173B67]">
              <div className="font-bold text-[#173B67] uppercase tracking-wider text-[10px] mb-1">
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
                  <div className="flex items-center justify-between pb-1 border-b-2 border-[#62B6E8]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
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
                        className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-bold text-[#173B67]">
                              {isTamil && skill.nameTamil ? skill.nameTamil : skill.name}
                            </div>
                            <div className="text-[10px] text-[#526174]">
                              {skill.category} • Level {skill.level}/5
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-extrabold text-[11px] shrink-0">
                            {skill.score}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#EAF5FC] rounded-full overflow-hidden">
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
                  <div className="pb-1 border-b-2 border-[#62B6E8]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                      {headings.communication}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {data.verifiedCommunication.slice(0, 2).map((comm) => (
                      <div
                        key={comm.id}
                        className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#173B67] text-[11px]">
                            {isTamil && comm.titleTamil ? comm.titleTamil : comm.title}
                          </span>
                          <span className="font-bold text-[#173B67] text-xs">
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
                  <div className="pb-1 border-b-2 border-[#62B6E8]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                      {headings.credentials}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {data.verifiedBadges.slice(0, 3).map((badge) => (
                      <div
                        key={badge.id}
                        className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[11px] flex items-center gap-2"
                      >
                        <span className="text-base shrink-0">{badge.icon}</span>
                        <div>
                          <div className="font-bold text-[#173B67]">
                            {isTamil && badge.titleTamil ? badge.titleTamil : badge.title}
                          </div>
                          <div className="text-[9px] text-[#526174] truncate max-w-[170px]">
                            {badge.evidenceNotes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Education & Background */}
                <div className="space-y-2">
                  <div className="pb-1 border-b-2 border-[#62B6E8]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                      {headings.education}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs">
                    <div className="font-bold text-[#173B67]">{persona.educationOrBackground}</div>
                    <div className="text-[10px] text-[#526174]">{persona.location}</div>
                  </div>
                </div>
              </div>

              {/* RIGHT MAIN COLUMN (60% width) */}
              <div className="md:col-span-7 space-y-4">
                {/* 1. Verified Portfolio Projects */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b-2 border-[#62B6E8]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                      {headings.projects}
                    </h3>
                    <span className="text-[9px] text-[#526174]">
                      {headings.reproducibleCode}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.verifiedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-sm text-[#173B67]">
                              {isTamil && project.titleTamil ? project.titleTamil : project.title}
                            </div>
                            <div className="text-[10px] text-[#526174]">
                              {project.type} • Verified: {project.completedAt}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-extrabold text-xs">
                              {project.score}% Passing Rubric
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#173B67] leading-relaxed">
                          {isTamil && project.summaryTamil ? project.summaryTamil : project.summary}
                        </p>

                        {/* Verified Rubric Outcomes */}
                        <div className="space-y-1 pt-1 border-t border-[#E2E8F0]/60">
                          <div className="font-bold text-[10px] text-[#526174] uppercase tracking-wider">
                            {headings.outcomes}:
                          </div>
                          {project.keyOutcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-forest-900">
                              <span className="text-forest-600 font-bold shrink-0">✓</span>
                              <span>{outcome}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[9px] text-[#526174] font-mono">
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
                <div className="p-3.5 rounded-xl bg-[#EAF5FC] border border-[#62B6E8]/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#173B67] uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="w-4 h-4 text-[#F2B66D]" />
                    <span>{headings.endorsement}</span>
                  </div>
                  <blockquote className="italic text-[11px] text-[#173B67] border-l-2 border-[#173B67] pl-2.5 leading-relaxed">
                    "{isTamil ? data.mentorEndorsement.statementTamil : data.mentorEndorsement.statement}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#526174]">
                    <div>
                      <span className="font-bold text-[#173B67]">{data.mentorEndorsement.mentorName}</span>
                      <span className="ml-1">({isTamil ? data.mentorEndorsement.mentorTitleTamil : data.mentorEndorsement.mentorTitle})</span>
                    </div>
                    <span className="font-mono">{data.mentorEndorsement.date}</span>
                  </div>
                </div>

                {/* Footnote / Trust Guarantee */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[9px] text-[#526174]">
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
            className="resume-sheet w-full max-w-[850px] bg-white text-[#173B67] rounded-2xl shadow-soft border border-[#E2E8F0] p-6 sm:p-8 space-y-4 overflow-hidden relative"
            style={{ minHeight: '1080px' }}
          >
            {/* Modern Header */}
            <div className="border-b-2 border-[#173B67] pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#173B67] text-white text-[10px] font-bold tracking-wider uppercase">
                    {headings.verifiedPill}
                  </span>
                  <span className="text-xs font-mono text-[#526174]">{data.verificationId}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#173B67]">
                  {isTamil ? persona.nameTamil : persona.name}
                </h2>
                <div className={`text-sm text-[#173B67] font-semibold ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? pathway.titleTamil : pathway.title}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#526174] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#62B6E8]" />
                    <span>{persona.location}</span>
                  </span>
                  <span>•</span>
                  <span>{persona.educationOrBackground}</span>
                </div>
              </div>

              {/* Minimal QR Verification */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">
                <QRCodeSVG value={data.verificationUrl} size={60} fgColor="#173B67" bgColor="transparent" />
                <div className="text-left text-[9px]">
                  <div className="font-bold text-[#173B67] uppercase">{headings.scanToVerify}</div>
                  <div className="text-[#526174] font-mono">{data.verificationId}</div>
                  <div className="text-emerald-700 font-semibold mt-0.5">✓ 100% Tamper-Evident</div>
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="text-xs text-[#173B67] leading-relaxed">
              <span className="font-bold text-[#173B67] uppercase text-[10px] tracking-wider block mb-0.5">
                {headings.summary}
              </span>
              {isTamil ? data.summaryTamil : data.summary}
            </div>

            {/* Section 1: Verified Competencies (Grid Cards) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                  {headings.skills} ({data.verifiedSkills.length} Verified)
                </h3>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  ✓ Backed by 3+ reproducible artifacts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.verifiedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#173B67]">
                        {isTamil && skill.nameTamil ? skill.nameTamil : skill.name}
                      </div>
                      <div className="text-[10px] text-[#526174]">
                        {skill.category} • {skill.evidenceCount} validated proofs
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 font-extrabold text-xs">
                      {skill.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Verified Portfolio Projects */}
            <div className="space-y-2.5">
              <div className="pb-1 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                  {headings.projects}
                </h3>
              </div>

              <div className="space-y-2.5">
                {data.verifiedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#173B67]">
                          {isTamil && project.titleTamil ? project.titleTamil : project.title}
                        </div>
                        <div className="text-[10px] text-[#526174]">
                          {project.type} • Completed {project.completedAt}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                        Rubric: {project.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-[#173B67]">
                      {isTamil && project.summaryTamil ? project.summaryTamil : project.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1 text-[10px] text-emerald-800">
                      {project.keyOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
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
              <div className="pb-1 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                  {headings.communication}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.verifiedCommunication.slice(0, 2).map((comm) => (
                  <div
                    key={comm.id}
                    className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#173B67] text-[11px]">
                        {isTamil && comm.titleTamil ? comm.titleTamil : comm.title}
                      </div>
                      <div className="text-[10px] text-[#526174]">
                        Pace: {comm.paceWpm} WPM • Authenticity: Consistent
                      </div>
                    </div>
                    <span className="font-extrabold text-[#173B67] text-xs">
                      {comm.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Micro-Badges Strip */}
            <div className="space-y-2">
              <div className="pb-1 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#173B67]">
                  {headings.credentials}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {data.verifiedBadges.slice(0, 4).map((badge) => (
                  <span
                    key={badge.id}
                    className="px-2.5 py-1 rounded-md bg-[#EAF5FC] border border-[#BAE6FD] text-xs font-semibold flex items-center gap-1.5 text-[#173B67]"
                  >
                    <span>{badge.icon}</span>
                    <span>{isTamil && badge.titleTamil ? badge.titleTamil : badge.title}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Modern Footer Attestation */}
            <div className="pt-3 border-t-2 border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[#526174]">
              <div>
                Attested by <span className="font-bold text-[#173B67]">{data.mentorEndorsement.mentorName}</span> ({data.mentorEndorsement.mentorTitle})
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
