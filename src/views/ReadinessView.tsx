import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { ProgressRing } from '../components/ProgressRing';
import { calculateReadiness } from '../utils/readinessCalculator';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import { AboutThisData } from '../components/ui/AboutThisData';
import { Language } from '../types';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  RotateCcw,
  ShieldCheck,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Target,
  Mic,
  Code,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

const getStrings = (lang: string) => {
  switch (lang) {
    case 'ta':
      return {
        badge: 'வேலைத்தள தயார்நிலை குறியீடு',
        evidenceBacked: 'சான்று அடிப்படையிலானது',
        heading: 'முழுமையான வெளிப்படையான தயார்நிலை',
        subheading: 'மறைக்கப்பட்ட சூத்திரங்கள் அல்லது தன்னிச்சையான சதவீதங்கள் இல்லை. உங்கள் சமர்ப்பிக்கப்பட்ட குறியீடு, மதிப்பீடுகள், திட்டப்பணிகள் மற்றும் வாய்மொழி பதில்களின் அடிப்படையில் மட்டுமே கணக்கிடப்படுகிறது.',
        activeLearner: 'தற்போதைய பயனர்:',
        verifiedProofs: 'நிரூபிக்கப்பட்ட சான்றுகள்',
        missingCriteria: 'நிலுவை தேவைகள்',
        guidancePolicy: 'வழிகாட்டல் கொள்கை',
        aboutParagraph1: 'இந்தத் தயார்நிலைக் குறியீடு உங்கள் சரிபார்க்கப்பட்ட ரूब்ரிக் சான்றுகள், சமர்ப்பிக்கப்பட்ட குறியீடு மற்றும் வாய்மொழித் தேர்வுகளிலிருந்து கணக்கிடப்படும் வழிகாட்டும் கருவியாகும்.',
        aboutParagraph2: 'நேர்மை உத்தரவாதம்: மதிப்பீடு செய்யப்படாத திறன்கள் நடுநிலையாக வைக்கப்படுகின்றன. இது வேலை உத்தரவாதம் அல்ல, பயிற்சி வழிகாட்டல் மட்டுமே.',
        overallGuidance: 'ஒட்டுமொத்த தயார்நிலை வழிகாட்டி',
        overallSub: 'கீழே உள்ள 5 கூறுகளின் எடையிடப்பட்ட கூட்டல் மட்டுமே இந்த மதிப்பெண்ணை உருவாக்குகிறது:',
        weightsLabel: 'கூறு எடைகள் (மொத்தம் 100%):',
        skills: 'திறன்கள்',
        projects: 'திட்டப்பணிகள்',
        assessments: 'தேர்வுகள்',
        communication: 'தகவல்தொடர்பு',
        requirements: 'மைல்கற்கள்',
        hideFormula: 'கணக்கீட்டு சூத்திரத்தை மறைக்க',
        showFormula: 'ஒட்டுமொத்த சூத்திரம் எவ்வாறு கணக்கிடப்படுகிறது?',
        simulated: 'மாதிரி',
        guidance: 'வழிகாட்டல்',
        benchmarkNear: 'தயார்நிலை',
        inProgress: 'வளர்ச்சி',
        projectedGain: 'அதிகரிப்பு',
        weightedComposite: 'எடையிடப்பட்ட கலவை',
        exactFormulaTitle: 'கணித சூத்திரம் மற்றும் மாற்று எண்கள்',
        nextStepBadge: 'உங்கள் அடுத்த சிறந்த நடவடிக்கை',
        whyMatters: 'இது ஏன் முக்கியமானது (எளிய வார்த்தைகளில்):',
        readinessGain: 'உடனடி தயார்நிலை உயர்வு',
        startNextStep: 'சவாலை தொடங்குக →',
        simulatingInWhatIf: 'மாதிரி இயக்கத்தில் உள்ளது',
        simulateInWhatIf: 'மாதிரி உருவகப்படுத்துக',
        whatIfTitle: 'என்ன நடக்கும்? மாதிரி உருவகப்படுத்துதல்',
        whatIfSub: 'நேரத்தை செலவழிக்கும் முன் செயல்களின் தாக்கத்தை சோதிக்கவும். கீழேயுள்ள உருவகப்படுத்துதலைத் தேர்ந்தெடுத்து 5 கூறுகளின் மாற்றங்களைப் பார்க்கவும்.',
        resetSim: 'உருவகப்படுத்துதலை மீட்டமைக்க',
        simActive: 'மாதிரி உருவகப்படுத்துதல் இயங்குகிறது:',
        profileUntouched: 'உங்கள் உண்மையான சுயவிவரம் மாறவில்லை.',
        updatedBelow: 'கீழே உள்ள கூறுகள் புதுப்பிக்கப்பட்டுள்ளன ↓',
        start: 'தொடங்க',
        breakdownTitle: 'தயார்நிலையின் 5 முக்கிய கூறுகள்',
        breakdownSub: 'ஒவ்வொரு கூறும் சரியான எண்ணிக்கை மற்றும் விரிவாக்கக்கூடிய சூத்திரத்துடன் காட்டப்பட்டுள்ளது.',
        weight: 'எடை:',
        missing: 'நிலுவை',
        contribution: 'பங்களிப்பு:',
        hideRowFormula: 'சூத்திரத்தை மறை',
        showRowFormula: 'இது எவ்வாறு கணக்கிடப்படுகிறது?',
        exactRowFormula: 'சரியான கணித சூத்திரம்:',
        itemizedEvidence: 'சரிபார்க்கப்பட்ட சான்றுகளின் முழுப் பட்டியல்:',
        verified: 'சரிபார்க்கப்பட்டது',
        progress: 'செயலில்',
        fulfillment: 'நிறைவு:',
        progression: 'மதிப்பீடு:'
      };
    case 'fr':
      return {
        badge: 'Indice de préparation professionnelle',
        evidenceBacked: '100% basé sur des preuves',
        heading: 'Préparation professionnelle transparente',
        subheading: 'Aucun pourcentage inexpliqué. Chaque score découle directement du décompte concret des critères de compétences vérifiés, évaluations réussies et soutenances orales.',
        activeLearner: 'Apprenant actif :',
        verifiedProofs: 'Preuves vérifiées',
        missingCriteria: 'Critères manquants',
        guidancePolicy: 'Politique d\'orientation',
        aboutParagraph1: 'Cet indice de préparation est un outil d\'auto-évaluation calculé de manière déterministe à partir de vos grilles d\'évaluation validées, projets et soutenances orales.',
        aboutParagraph2: 'Garantie d\'équité : Les compétences non évaluées restent strictement neutres. Cet indicateur fournit une orientation pratique et ne constitue pas une garantie d\'embauche.',
        overallGuidance: 'Indicateur global d\'orientation',
        overallSub: 'Calculé exclusivement comme la somme pondérée de vos 5 composantes vérifiées :',
        weightsLabel: 'Pondérations des composantes (Total = 100%) :',
        skills: 'Compétences',
        projects: 'Projets',
        assessments: 'Évaluations',
        communication: 'Communication',
        requirements: 'Exigences',
        hideFormula: 'Masquer le détail de la formule',
        showFormula: 'Comment est-ce calculé ? (Formule exacte)',
        simulated: 'Simulé',
        guidance: 'Orientation',
        benchmarkNear: 'Proche du seuil',
        inProgress: 'En cours',
        projectedGain: 'gain projeté',
        weightedComposite: 'Indicateur composite pondéré',
        exactFormulaTitle: 'Formule exacte et substitution arithmétique',
        nextStepBadge: 'Votre prochaine étape à fort impact',
        whyMatters: 'Pourquoi c\'est important (en termes simples) :',
        readinessGain: 'Gain de préparation',
        startNextStep: 'Démarrer l\'étape suivante →',
        simulatingInWhatIf: 'En cours de simulation',
        simulateInWhatIf: 'Simuler dans What-If',
        whatIfTitle: 'Simulateur d\'impact What-If : aperçu en direct',
        whatIfSub: 'Activez les scénarios pour observer l\'impact direct sur vos formules de préparation :',
        resetSim: 'Réinitialiser le simulateur',
        simActive: 'Simulation active :',
        profileUntouched: 'Votre profil enregistré reste inchangé.',
        updatedBelow: 'Formules des composantes mises à jour ci-dessous ↓',
        start: 'Démarrer',
        breakdownTitle: 'Détail des 5 composantes de préparation',
        breakdownSub: 'Chaque composante est directement liée à des preuves concrètes et des formules explicites :',
        weight: 'Poids :',
        missing: 'Manquant',
        contribution: 'Contribution :',
        hideRowFormula: 'Masquer la formule',
        showRowFormula: 'Comment est-ce calculé ?',
        exactRowFormula: 'Formule mathématique exacte :',
        itemizedEvidence: 'Détail et statut des éléments de preuve :',
        verified: 'Vérifié',
        progress: 'En cours',
        fulfillment: 'Accomplissement :',
        progression: 'Progression :'
      };
    case 'hi':
      return {
        badge: 'कार्यस्थल तत्परता सूचकांक',
        evidenceBacked: '100% साक्ष्य-आधारित',
        heading: 'पारदर्शी कार्यस्थल तत्परता',
        subheading: 'कोई अस्पष्ट प्रतिशत नहीं। प्रत्येक स्कोर सीधे सत्यापित कौशल रूब्रिक, उत्तीर्ण आकलन, कोड सबमिशन और मौखिक साक्षात्कारों से प्राप्त होता है।',
        activeLearner: 'सक्रिय शिक्षार्थी:',
        verifiedProofs: 'सत्यापित प्रमाण',
        missingCriteria: 'शेष आवश्यकताएं',
        guidancePolicy: 'मार्गदर्शन नीति',
        aboutParagraph1: 'यह तत्परता सूचकांक आपके सत्यापित रूब्रिक प्रमाणों, प्रस्तुत कोड और मौखिक साक्षात्कारों से सटीक रूप से गणना किया गया एक स्व-मूल्यांकन उपकरण है।',
        aboutParagraph2: 'निष्पक्षता गारंटी: असत्यापित कौशलों को तटस्थ रखा जाता है। यह सूचक अभ्यास मार्गदर्शन प्रदान करता है और रोजगार की गारंटी नहीं है।',
        overallGuidance: 'समग्र तत्परता मार्गदर्शन सूचक',
        overallSub: 'आपके 5 सत्यापित घटकों के भारित योग के रूप में सीधे गणना की गई:',
        weightsLabel: 'घटक भार (कुल = 100%):',
        skills: 'कौशल',
        projects: 'प्रोजेक्ट्स',
        assessments: 'आकलन',
        communication: 'संचार',
        requirements: 'आवश्यकताएं',
        hideFormula: 'फॉर्मूला विवरण छिपाएं',
        showFormula: 'इसकी गणना कैसे की जाती है? (सटीक फॉर्मूला)',
        simulated: 'सिम्युलेटेड',
        guidance: 'मार्गदर्शन',
        benchmarkNear: 'मानक के करीब',
        inProgress: 'प्रगति में',
        projectedGain: 'अनुमानित लाभ',
        weightedComposite: 'भारित समग्र सूचक',
        exactFormulaTitle: 'सटीक गणितीय सूत्र और मान प्रतिस्थापन',
        nextStepBadge: 'आपका अगला उच्चतम प्रभाव वाला कदम',
        whyMatters: 'यह क्यों महत्वपूर्ण है (सरल शब्दों में):',
        readinessGain: 'तत्परता में वृद्धि',
        startNextStep: 'अगला चरण अभी शुरू करें →',
        simulatingInWhatIf: 'सिम्युलेटर सक्रिय है',
        simulateInWhatIf: 'सिम्युलेटर में देखें',
        whatIfTitle: 'व्हाट-इफ़ सिम्युलेटर: सटीक फॉर्मूलों पर प्रभाव',
        whatIfSub: 'यह देखने के लिए परिदृश्य चालू करें कि अभ्यास से आपका स्कोर कैसे बढ़ता है:',
        resetSim: 'सिम्युलेटर रीसेट करें',
        simActive: 'सिमुलेशन सक्रिय:',
        profileUntouched: 'आपकी वास्तविक प्रोफ़ाइल सुरक्षित है।',
        updatedBelow: 'घटक सूत्र नीचे अपडेट किए गए हैं ↓',
        start: 'शुरू करें',
        breakdownTitle: 'तत्परता के 5 प्रमुख घटकों का विवरण',
        breakdownSub: 'प्रत्येक घटक स्पष्ट गणितीय सूत्र और सत्यापित साक्ष्यों से जुड़ा है:',
        weight: 'भार:',
        missing: 'शेष',
        contribution: 'योगदान:',
        hideRowFormula: 'फॉर्मूला छिपाएं',
        showRowFormula: 'इसकी गणना कैसे की जाती है?',
        exactRowFormula: 'सटीक गणितीय सूत्र:',
        itemizedEvidence: 'सत्यापित साक्ष्यों की पूरी सूची और स्थिति:',
        verified: 'सत्यापित',
        progress: 'प्रगति में',
        fulfillment: 'पूर्ति:',
        progression: 'प्रगति:'
      };
    default: // en
      return {
        badge: 'Workplace Readiness Index',
        evidenceBacked: '100% Evidence-Backed',
        heading: 'Transparent Workplace Readiness',
        subheading: 'Zero unexplained percentages. Every score is directly derived from concrete counts of verified skill rubrics, passed assessments, multi-file code submissions, and authenticated oral defenses.',
        activeLearner: 'Active Learner:',
        verifiedProofs: 'Verified Proofs',
        missingCriteria: 'Missing Criteria',
        guidancePolicy: 'About this guidance data',
        aboutParagraph1: 'This readiness index is a self-assessment feedback tool calculated deterministically from your verified rubric proofs, submitted PRs, and oral defenses.',
        aboutParagraph2: 'Fairness Guarantee: Unassessed skills are kept strictly neutral. This indicator provides practice guidance and is not a guarantee of employment.',
        overallGuidance: 'Overall Readiness Guidance Indicator',
        overallSub: 'Computed exclusively as the weighted sum of your 5 verified components. All component weights are fully transparent:',
        weightsLabel: 'Component Weights (Sum = 100%):',
        skills: 'Skills',
        projects: 'Projects',
        assessments: 'Assessments',
        communication: 'Communication',
        requirements: 'Requirements',
        hideFormula: 'Hide overall formula breakdown',
        showFormula: 'How is this calculated? (View exact formula)',
        simulated: 'Simulated',
        guidance: 'Guidance',
        benchmarkNear: 'Benchmark Near',
        inProgress: 'In Progress',
        projectedGain: 'projected gain',
        weightedComposite: 'Weighted composite indicator',
        exactFormulaTitle: 'Exact Formula & Arithmetic Substitution',
        nextStepBadge: 'Your Next Highest-Impact Step',
        whyMatters: 'Why this matters (in plain words):',
        readinessGain: 'Readiness Gain',
        startNextStep: 'Start Next Step Now →',
        simulatingInWhatIf: 'Simulating in What-If',
        simulateInWhatIf: 'Simulate in What-If',
        whatIfTitle: 'What-If Simulator: Preview Impact on Exact Formulas',
        whatIfSub: 'Test hypothetical accomplishments before spending time. Click any action below to see real-time updates across all component counts and mathematical formulas.',
        resetSim: 'Reset Simulator',
        simActive: 'Simulation Active:',
        profileUntouched: 'Your saved profile is untouched.',
        updatedBelow: 'Component formulas updated below ↓',
        start: 'Start',
        breakdownTitle: 'Readiness Component Breakdown (All 5 Rows)',
        breakdownSub: 'Each row displays exact counts, percentage, weight contribution, and step-by-step formula derivation.',
        weight: 'Weight:',
        missing: 'Missing',
        contribution: 'Contribution:',
        hideRowFormula: 'Hide Formula',
        showRowFormula: 'How is this calculated?',
        exactRowFormula: 'Exact Formula & Step-by-Step Derivation:',
        itemizedEvidence: 'Itemized Evidence Breakdown & Status:',
        verified: 'Verified',
        progress: 'In Progress',
        fulfillment: 'Fulfillment:',
        progression: 'Progress:'
      };
  }
};

export const ReadinessView: React.FC = () => {
  const { t } = useTranslation();
  const {
    getPersona,
    getCurrentPathway,
    challenges,
    vivaRecords,
    streakHistory,
    setActiveTab,
    language
  } = useSkillBridgeStore();

  const currentLang = (language || 'en') as Language;
  const isTa = currentLang === 'ta';
  const strings = getStrings(currentLang);

  const persona = getPersona();
  const pathway = getCurrentPathway();

  // Expanded formula states
  const [isOverallFormulaOpen, setIsOverallFormulaOpen] = useState(false);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  // What-If Simulation State
  const [activeSimulations, setActiveSimulations] = useState<string[]>([]);

  // Compute readiness deterministically
  const readiness = calculateReadiness(
    persona,
    pathway,
    challenges,
    vivaRecords,
    activeSimulations
  );

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRowIds(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const toggleSimulation = (scenarioId: string) => {
    setActiveSimulations(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const resetSimulations = () => {
    setActiveSimulations([]);
  };

  const handleStartChallenge = (challengeId: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/challenges/${challengeId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setActiveTab('challenges');
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & TRANSPARENCY NOTICE */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAF5FC] dark:bg-deepblue-950/80 text-[#173B67] dark:text-sky-300 border border-[#62B6E8]/40">
                {strings.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF5FC] text-[#173B67] border border-[#62B6E8]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{strings.evidenceBacked}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              {strings.heading}
            </h1>

            <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-2xl leading-relaxed">
              {strings.subheading}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#526174] dark:text-night-muted">
              <span className="font-semibold text-[#173B67] dark:text-night-ink">
                {strings.activeLearner} {isTa ? persona.nameTamil : persona.name}
              </span>
              <span>•</span>
              <span className="text-[#173B67] dark:text-sky-300 font-medium">
                {isTa ? pathway.titleTamil : pathway.title}
              </span>
              <span>•</span>
              <span className="italic">{persona.location}</span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-row lg:flex-col items-center justify-around lg:justify-center p-3.5 sm:p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] dark:border-night-border w-full lg:w-auto lg:min-w-[200px]">
            <div className="text-center">
              <div className="text-xs uppercase font-bold text-[#526174] dark:text-night-muted">
                {strings.verifiedProofs}
              </div>
              <div className="text-2xl font-extrabold text-[#173B67] dark:text-white mt-0.5">
                {readiness.components[0].count + readiness.components[1].count + readiness.components[2].count}
              </div>
            </div>
            <div className="h-8 w-px bg-[#E2E8F0] dark:bg-night-border lg:w-full lg:h-px lg:my-2" />
            <div className="text-center">
              <div className="text-xs uppercase font-bold text-[#526174] dark:text-night-muted">
                {strings.missingCriteria}
              </div>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                {readiness.components[4].count}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. OVERALL GUIDANCE INDICATOR CARD */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card bg-white dark:bg-[#0F2035] border border-[#BAE6FD] shadow-soft font-poppins">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Title, Required Disclaimer Popover, and Weights */}
          <div className="space-y-3 flex-1">
            {/* Contextual "About this data" popover */}
            <div className="flex items-center gap-2">
              <AboutThisData title={strings.guidancePolicy}>
                <p>
                  {strings.aboutParagraph1}
                </p>
                <p className="font-semibold text-[#173B67] dark:text-white">
                  {strings.aboutParagraph2}
                </p>
              </AboutThisData>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
                {strings.overallGuidance}
              </h2>
              <p className="text-xs text-[#526174] dark:text-slate-300 mt-1 max-w-xl">
                {strings.overallSub}
              </p>
            </div>

            {/* Component Weights */}
            <div className="pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174] dark:text-slate-400 mb-2">
                {strings.weightsLabel}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] font-medium text-[#173B67] dark:text-white">
                  {strings.skills}: <strong className="text-[#173B67] dark:text-[#62B6E8]">30%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] font-medium text-[#173B67] dark:text-white">
                  {strings.projects}: <strong className="text-[#10B981]">25%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] font-medium text-[#173B67] dark:text-white">
                  {strings.assessments}: <strong className="text-[#F2B66D]">20%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] font-medium text-[#173B67] dark:text-white">
                  {strings.communication}: <strong className="text-[#173B67]">15%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] font-medium text-[#173B67] dark:text-white">
                  {strings.requirements}: <strong className="text-[#526174]">10%</strong>
                </span>
              </div>
            </div>

            {/* Expandable "How is this calculated?" for Overall Guidance */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsOverallFormulaOpen(!isOverallFormulaOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173B67] dark:text-sky-300 hover:text-[#62B6E8] underline underline-offset-4 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>
                  {isOverallFormulaOpen ? strings.hideFormula : strings.showFormula}
                </span>
                {isOverallFormulaOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Gauge & Score */}
          <div id="readiness-hero-ring" className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shrink-0 text-center shadow-xs">
            <ProgressRing
              progress={readiness.overallScore}
              size={140}
              strokeWidth={11}
              label={readiness.isSimulated ? strings.simulated : strings.guidance}
              sublabel={readiness.overallScore >= 70 ? strings.benchmarkNear : strings.inProgress}
            />

            {readiness.isSimulated && (
              <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  +{readiness.overallScore - readiness.baseOverallScore}% {strings.projectedGain}
                </span>
              </div>
            )}

            <div className="text-[11px] text-[#526174] dark:text-night-muted mt-1 max-w-[150px]">
              {strings.weightedComposite}
            </div>
          </div>
        </div>

        {/* EXPANDABLE OVERALL FORMULA SECTION */}
        {isOverallFormulaOpen && (
          <div className="mt-5 pt-5 border-t border-[#E2E8F0] dark:border-night-border animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#173B67] dark:text-sky-300" />
              <h4 className="text-xs sm:text-sm font-bold text-[#173B67] dark:text-night-ink">
                {strings.exactFormulaTitle}
              </h4>
            </div>

            {/* Formula Block */}
            <div className="p-3.5 rounded-card bg-[#F8FAFC] dark:bg-night-100 font-mono text-xs text-[#173B67] dark:text-night-ink border border-[#E2E8F0] dark:border-night-border space-y-2 overflow-x-auto">
              <div className="text-[#526174] dark:text-night-muted">
                // 1. General Algebraic Formula
              </div>
              <div className="font-semibold text-[#173B67] dark:text-sky-300">
                {readiness.formulaSummary.formula}
              </div>

              <div className="text-[#526174] dark:text-night-muted pt-1">
                // 2. Exact Substitution of Your Current Numbers
              </div>
              <div className="text-[#173B67] dark:text-night-ink">
                = {readiness.formulaSummary.substitution}
              </div>

              <div className="text-[#526174] dark:text-night-muted pt-1">
                // 3. Term Contributions & Final Sum
              </div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                = {readiness.formulaSummary.result}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
              {readiness.components.map(comp => (
                <div
                  key={comp.id}
                  className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border"
                >
                  <div className="font-bold text-[#173B67] dark:text-night-ink truncate">
                    {isTa && comp.titleTamil ? comp.titleTamil : comp.title}
                  </div>
                  <div className="text-[#526174] dark:text-night-muted">
                    {comp.percentage}% × {comp.weightPercentage}%
                  </div>
                  <div className="text-xs font-extrabold text-[#173B67] dark:text-sky-400 mt-1">
                    +{comp.weightedContribution} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. "YOUR NEXT STEP" CARD IN PLAIN LANGUAGE */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card bg-[#EAF5FC] dark:bg-[#0F2035] border border-[#BAE6FD] shadow-soft font-poppins">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#173B67] border border-[#BAE6FD] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>{strings.nextStepBadge}</span>
              </span>
              <span className="text-xs font-medium text-[#526174] dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readiness.nextStep.timeEstimate}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
              {isTa ? readiness.nextStep.plainLanguageTitleTamil : readiness.nextStep.plainLanguageTitle}
            </h3>

            {/* Plain language explanation */}
            <p className="text-xs sm:text-sm text-[#526174] dark:text-slate-300 leading-relaxed">
              {isTa ? readiness.nextStep.plainLanguageSummaryTamil : readiness.nextStep.plainLanguageSummary}
            </p>

            {/* Why it matters in plain language */}
            <div className="p-3.5 rounded-btn bg-white/80 dark:bg-slate-800/80 border border-[#BAE6FD] text-xs space-y-1.5">
              <div className="font-bold text-[#173B67] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>{strings.whyMatters}</span>
              </div>
              <p className="text-[#526174] dark:text-slate-300 leading-relaxed">
                {isTa ? readiness.nextStep.whyItMattersTamil : readiness.nextStep.whyItMatters}
              </p>
            </div>

            {/* Expected outcome pill */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="font-semibold text-[#10B981] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                <span>+{readiness.nextStep.impactGain}% {strings.readinessGain}</span>
              </span>
              <span>•</span>
              <span className="text-[#526174] dark:text-slate-300">
                {isTa ? readiness.nextStep.expectedOutcomeTamil : readiness.nextStep.expectedOutcome}
              </span>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 min-w-[210px]">
            <button
              type="button"
              onClick={() => handleStartChallenge(readiness.nextStep.challengeId)}
              className="px-5 py-3 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs sm:text-sm shadow-soft transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{strings.startNextStep}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSimulation('sim-complete-js-challenge')}
              className={`px-4 py-2.5 rounded-btn border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSimulations.includes('sim-complete-js-challenge')
                  ? 'bg-white border-[#62B6E8] text-[#173B67] shadow-soft'
                  : 'bg-white/80 dark:bg-slate-800 border-[#BAE6FD] text-[#173B67] dark:text-white hover:bg-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#62B6E8]" />
              <span>
                {activeSimulations.includes('sim-complete-js-challenge')
                  ? strings.simulatingInWhatIf
                  : strings.simulateInWhatIf}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. WHAT-IF SIMULATOR */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft font-poppins">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-btn bg-[#EAF5FC] text-[#62B6E8]">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-white">
                {strings.whatIfTitle}
              </h3>
            </div>
            <p className="text-xs text-[#526174] dark:text-slate-300 mt-1">
              {strings.whatIfSub}
            </p>
          </div>

          {activeSimulations.length > 0 && (
            <button
              type="button"
              onClick={resetSimulations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold text-[#173B67] hover:bg-[#D9EFFB] border border-[#E2E8F0] transition-colors cursor-pointer self-start md:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#62B6E8]" />
              <span>{strings.resetSim}</span>
            </button>
          )}
        </div>

        {/* Active Simulation Notification Banner */}
        {activeSimulations.length > 0 && (
          <div className="mb-4 p-3.5 rounded-btn bg-[#ECFDF5] border border-[#A7F3D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#065F46]">
              <Sparkles className="w-4 h-4 shrink-0 text-[#10B981]" />
              <div>
                <span className="font-bold">
                  {strings.simActive}
                </span>{' '}
                {readiness.baseOverallScore}% → <strong className="text-[#065F46] text-sm">{readiness.overallScore}%</strong>{' '}
                (+{readiness.overallScore - readiness.baseOverallScore}% gain). {strings.profileUntouched}
              </div>
            </div>
            <span className="text-[11px] text-[#065F46] font-semibold italic">
              {strings.updatedBelow}
            </span>
          </div>
        )}

        {/* Scenario Toggle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {readiness.availableScenarios.map(scenario => {
            const isSelected = activeSimulations.includes(scenario.id);
            return (
              <div
                key={scenario.id}
                onClick={() => toggleSimulation(scenario.id)}
                className={`p-3.5 rounded-btn border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF5FC] border-[#62B6E8] shadow-soft'
                    : 'bg-[#F8FAFC] dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-700 hover:bg-[#EAF5FC]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-[#173B67] dark:text-white">
                      {isTa ? scenario.labelTamil : scenario.label}
                    </span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#526174] dark:text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#526174] dark:text-slate-300 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${isSelected ? 'text-[#10B981]' : 'text-[#526174] dark:text-slate-400'}`}>
                    {scenario.impactSummary.split(',')[0]}
                  </span>
                  {scenario.challengeId && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleStartChallenge(scenario.challengeId!);
                      }}
                      className="text-[#173B67] dark:text-[#62B6E8] hover:underline font-bold text-[11px]"
                    >
                      {strings.start} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. COMPONENT ROWS (ALL 5 ROWS) */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4 font-poppins">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#173B67] dark:text-white">
              {strings.breakdownTitle}
            </h3>
            <p className="text-xs text-[#526174] dark:text-slate-300">
              {strings.breakdownSub}
            </p>
          </div>
        </div>

        {/* The 5 Component Rows */}
        <div className="space-y-3.5">
          {readiness.components.map((comp, idx) => {
            const isExpanded = !!expandedRowIds[comp.id];
            const hasSimulatedDiff = comp.simulatedCount !== undefined && comp.simulatedCount !== comp.count;

            // Row icons
            const getRowIcon = () => {
              switch (comp.id) {
                case 'skills':
                  return <Code className="w-5 h-5 text-[#173B67]" />;
                case 'projects':
                  return <FileCode className="w-5 h-5 text-[#10B981]" />;
                case 'assessments':
                  return <CheckCircle2 className="w-5 h-5 text-[#62B6E8]" />;
                case 'communication':
                  return <Mic className="w-5 h-5 text-[#F2B66D]" />;
                case 'missingRequirements':
                  return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
                default:
                  return <Layers className="w-5 h-5 text-[#526174]" />;
              }
            };

            return (
              <div
                key={comp.id}
                className="rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft overflow-hidden transition-all"
              >
                {/* Main Row Bar */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Icon, Title, and Counts */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="p-2.5 rounded-btn bg-[#EAF5FC] border border-[#BAE6FD] shrink-0">
                      {getRowIcon()}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#526174] uppercase">
                          {idx + 1}. {isTa && comp.titleTamil ? comp.titleTamil : comp.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                          {strings.weight} {comp.weightPercentage}%
                        </span>
                        {comp.id === 'missingRequirements' && comp.count > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                            {comp.count} {strings.missing}
                          </span>
                        )}
                      </div>

                      {/* Explicit Counts */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
                          {comp.count} / {comp.total}
                        </span>
                        <span className="text-xs text-[#526174] dark:text-slate-300">
                          {isTa ? comp.unitTamil : comp.unit}
                        </span>

                        {hasSimulatedDiff && (
                          <span className="px-2 py-0.5 rounded-btn text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                            Simulated: {comp.simulatedCount}/{comp.total}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#526174] dark:text-slate-300 leading-relaxed max-w-xl">
                        {isTa ? comp.explanationTamil : comp.explanationEnglish}
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress Metric and Expandable Formula Toggle */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 min-w-[200px]">
                    <div className="w-full sm:w-44 md:w-48 space-y-1 text-right">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#526174] dark:text-slate-300">
                          {comp.id === 'missingRequirements' ? strings.fulfillment : strings.progression}
                        </span>
                        <span className="text-[#173B67] dark:text-white text-sm">
                          {comp.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-[#EAF5FC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-[#62B6E8]"
                          style={{ width: `${comp.percentage}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-[#526174] dark:text-slate-300 text-right">
                        {strings.contribution}{' '}
                        <strong className="text-[#173B67] dark:text-[#62B6E8]">
                          +{comp.weightedContribution} pts
                        </strong>
                      </div>
                    </div>

                    {/* EXPANDABLE "HOW IS THIS CALCULATED?" BUTTON */}
                    <button
                      type="button"
                      onClick={() => toggleRowExpansion(comp.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B67] hover:text-[#62B6E8] underline underline-offset-2 cursor-pointer pt-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#62B6E8]" />
                      <span>
                        {isExpanded ? strings.hideRowFormula : strings.showRowFormula}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED ACCORDION: EXACT FORMULA & ITEM BREAKDOWN */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-[#F8FAFC] dark:bg-slate-800 border-t border-[#E2E8F0] animate-in fade-in duration-200 space-y-4">
                    {/* Exact Formula Block */}
                    <div className="p-3.5 rounded-btn bg-white dark:bg-[#0F2035] border border-[#BAE6FD] font-mono text-xs space-y-1.5 overflow-x-auto">
                      <div className="text-[#526174] dark:text-slate-300 font-sans font-bold flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-[#62B6E8]" />
                        <span>{strings.exactRowFormula}</span>
                      </div>
                      <div className="text-[#173B67] dark:text-[#62B6E8] font-semibold">
                        {comp.formulaStr}
                      </div>
                      <div className="text-[#173B67] dark:text-white">
                        = {comp.substitutionStr}
                      </div>
                      <div className="text-[#10B981] font-bold pt-1">
                        Weighted Contribution = {comp.percentage}% × {comp.weightPercentage}% = +{comp.weightedContribution} points to overall guidance
                      </div>
                    </div>

                    {/* Itemized Evidence List */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#526174] dark:text-slate-300 mb-2">
                        {strings.itemizedEvidence}
                      </div>

                      <div className="space-y-2">
                        {comp.items.map(item => (
                          <div
                            key={item.id}
                            className="p-3 rounded-btn bg-white dark:bg-[#0F2035] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              {item.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                              ) : item.status === 'missing' ? (
                                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="w-4 h-4 text-[#F2B66D] shrink-0 mt-0.5" />
                              )}
                              <div>
                                <div className="font-bold text-[#173B67] dark:text-white">
                                  {isTa && item.nameTamil ? item.nameTamil : item.name}
                                </div>
                                <div className="text-[#526174] dark:text-slate-400 text-[11px] mt-0.5">
                                  {isTa && item.detailsTamil ? item.detailsTamil : item.details}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {item.score !== undefined && (
                                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#EAF5FC] text-[#173B67]">
                                  {item.score}%
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider ${
                                  item.status === 'completed'
                                    ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                                    : item.status === 'missing'
                                    ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                                    : 'bg-[#FCF3E5] text-[#9A5B13] border border-[#F2B66D]/40'
                                }`}
                              >
                                {item.status === 'completed'
                                  ? strings.verified
                                  : item.status === 'missing'
                                  ? strings.missing
                                  : strings.progress}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. 16-WEEK PRACTICE HABIT CONSISTENCY HEATMAP */}
      {/* ------------------------------------------------------------------ */}
      <PracticeHeatmap streakDays={persona.streakDays} />
    </div>
  );
};
