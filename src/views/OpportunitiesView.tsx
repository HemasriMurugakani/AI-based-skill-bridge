import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { TrustLabel } from '../components/TrustLabel';
import { Opportunity, ApplicationTrackerStage, Language } from '../types';
import { governmentSchemes } from '../data/schemes';
import {
  Briefcase,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Search,
  Sparkles,
  Clock,
  X,
  Bookmark,
  Send,
  Landmark,
  Target,
  ArrowLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

const getStrings = (lang: string) => {
  switch (lang) {
    case 'ta':
      return {
        badge: 'வேலைவாய்ப்பு வழிகாட்டல்',
        heading: 'மாவட்ட வாய்ப்புகள் & அரசுத் திட்டங்கள்',
        subheading: 'அனைத்து வாய்ப்புகளும் மாதிரி உதாரணங்கள் மட்டுமே. உங்கள் சரிபார்க்கப்பட்ட குறியீடு, செய்முறை சான்றுகள் மற்றும் அரசு தொழிற்பழகுநர் திட்டங்களை இணைக்க உதவும் வழிகாட்டி.',
        activeProfile: 'பயிற்சி பயனர்',
        tabOpportunities: 'மாதிரி வாய்ப்புகள் (10)',
        tabSchemes: 'அரசு திட்டங்கள் (Skill India & NAPS)',
        tabTracker: 'விண்ணப்ப கண்காணிப்பாளர்',
        viewRoadmap: 'வரைபடத்தைக் காண்க →',
        searchPlaceholder: 'நிறுவனம், வேலை அல்லது திறன் தேடுக...',
        allRoles: 'அனைத்து துறைகளும் (10)',
        technical: 'தொழில்நுட்பம் (5)',
        vocational: 'தொழிற்கல்வி & கைவினை (5)',
        districtLabel: 'மாவட்டம்:',
        allDistricts: 'அனைத்து மாவட்டங்களும்',
        emptyTitle: 'வாய்ப்புகள் எதுவும் பொருந்தவில்லை',
        emptyDesc: 'வடிகட்டி அல்லது தேடலை மாற்றி மீண்டும் முயற்சிக்கவும்.',
        emptyAction: 'அனைத்தையும் காட்டு',
        sampleRibbon: 'மாதிரி · நேரடி வேலைவாய்ப்பு அல்ல',
        technicalCategory: 'தொழில்நுட்பம்',
        vocationalCategory: 'தொழிற்கல்வி',
        eligibility: 'தகுதி வரம்பு:',
        requiredCompetencies: 'தேவைப்படும் திறன்கள்:',
        verified: 'சரிபார்க்கப்பட்டது',
        colorLegend: 'பச்சை = உங்களிடம் உள்ளது, அம்பர் = இடைவெளி',
        missing: 'இடைவெளி',
        nextAction: 'அடுத்த நடவடிக்கை:',
        proofMatch: 'சான்று பொருத்தம்',
        trackerStage: 'கண்காணிப்பு நிலை:',
        viewMatchDetails: 'பொருத்தம் & விவரங்கள்',
        stageSaved: 'சேமிக்கப்பட்டவை',
        stagePreparing: 'தயாராகுதல்',
        stageReady: 'விண்ணப்பிக்க தயார்',
        stageApplied: 'விண்ணப்பம் அனுப்பப்பட்டது',
        schemeNoticeTitle: 'அரசுத் திட்டங்கள் பொது தகவல் அறிவிப்பு',
        schemeNoticeText: 'இந்த வழிகாட்டல் விழிப்புணர்வு நோக்கத்திற்காக மட்டுமே வழங்கப்படுகிறது. SkillBridge AI எந்த அரசுத் துறையுடனும் நேரடியாக இணைக்கப்படவில்லை, தகுதி முடிவுகளை எடுப்பதில்லை, அல்லது அரசு உதவித்தொகைகளை வழங்குவதில்லை. அதிகாரப்பூர்வ தகவல்களுக்கு அரசு இணையதளங்களை நேரடியாக பார்வையிடவும்.',
        targetBeneficiaries: 'பயனாளிகள்:',
        keyHighlights: 'முக்கிய நன்மைகள்:',
        opensOfficial: 'அதிகாரப்பூர்வ அரசு இணையதளத்திற்குச் செல்கிறது',
        trackerTitle: 'மாதிரி விண்ணப்ப மேலாண்மை பலகை (4 நிலைகள்)',
        trackerSub: 'சேமிக்கப்பட்டது → தயார் நிலை → விண்ணப்பிக்க தயார் → கடவுச்சீட்டு அனுப்பப்பட்டது',
        trackerHint: 'நிலைகளை மாற்ற அட்டை பொத்தான்களை அழுத்தவும்',
        noRolesInStage: 'வாய்ப்புகள் இல்லை',
        moveToPreparing: 'தயாரிப்புக்கு நகர்த்தவும்',
        markReady: 'தயாராக குறிக்கவும்',
        sendPassport: 'கடவுச்சீட்டு அனுப்பவும்',
        passportLogged: 'கடவுச்சீட்டு பதிவு செய்யப்பட்டது',
        reset: 'மீட்டமைக்க',
        aiExplanationTitle: 'AI பொருத்தம் பகுப்பாய்வு',
        strengthsTitle: 'நிரூபிக்கப்பட்ட பலங்கள்:',
        gapsTitle: 'இடைவெளி பகுப்பாய்வு:',
        recommendedActionTitle: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:',
        addMissingSkills: 'விடுபட்ட திறன்களை வரைபடத்தில் சேர்க்கவும்',
        skillsOnRoadmap: 'திறன்கள் கற்றல் வரைபடத்தில் உள்ளன',
        competencyStatus: 'திறன் சரிபார்ப்பு நிலை:',
        startRecommendedChallenge: 'பரிந்துரைக்கப்பட்ட சவாலைத் தொடங்குக →',
        viewVerifiedResume: 'சரிபார்க்கப்பட்ட ஒற்றைப் பக்க ரெஸ்யூமே காண்க →',
        stipendLabel: 'மதிப்பிடப்பட்ட உதவித்தொகை / ஊதியம்'
      };
    case 'fr':
      return {
        badge: 'Découverte des opportunités & Orientation',
        heading: 'Opportunités de district & Dispositifs publics',
        subheading: 'Toutes les opportunités présentées sont strictement des exemples de démonstration. Découvrez des critères d\'embauche réalistes, comblez vos lacunes et suivez votre préparation.',
        activeProfile: 'Profil actif',
        tabOpportunities: 'Opportunités modèles (10)',
        tabSchemes: 'Dispositifs publics (Skill India & NAPS)',
        tabTracker: 'Suivi des candidatures',
        viewRoadmap: 'Voir le parcours →',
        searchPlaceholder: 'Rechercher poste, entreprise, lieu ou compétence...',
        allRoles: 'Tous les postes (10)',
        technical: 'Technique (5)',
        vocational: 'Professionnel & Artisanal (5)',
        districtLabel: 'District :',
        allDistricts: 'Tous les districts',
        emptyTitle: 'Aucune opportunité correspondante',
        emptyDesc: 'Essayez de modifier votre mot-clé de recherche ou vos filtres de district.',
        emptyAction: 'Afficher tous les postes et districts',
        sampleRibbon: 'Exemple · Offre fictive',
        technicalCategory: 'Technique',
        vocationalCategory: 'Professionnel',
        eligibility: 'Éligibilité :',
        requiredCompetencies: 'Compétences requises :',
        verified: 'Vérifié',
        colorLegend: 'Vert = Acquis, Ambre = Manquant',
        missing: 'Manquant',
        nextAction: 'Action suivante :',
        proofMatch: 'Adéquation des preuves',
        trackerStage: 'Étape de suivi :',
        viewMatchDetails: 'Voir les détails',
        stageSaved: 'Enregistré',
        stagePreparing: 'En préparation',
        stageReady: 'Prêt à postuler',
        stageApplied: 'Passeport envoyé',
        schemeNoticeTitle: 'Information d\'intérêt public & Mention de non-affiliation',
        schemeNoticeText: 'Cette section fournit des informations éducatives concernant les initiatives publiques de formation. SkillBridge AI est un assistant civique indépendant et n\'est affilié à aucun organisme gouvernemental.',
        targetBeneficiaries: 'Bénéficiaires cibles :',
        keyHighlights: 'Points clés :',
        opensOfficial: 'Ouvre le portail officiel dans un nouvel onglet',
        trackerTitle: 'Tableau de suivi des candidatures (4 étapes)',
        trackerSub: 'Suivez votre progression de la sélection jusqu\'à la transmission de votre passeport SkillBridge vérifié.',
        trackerHint: 'Cliquez sur les boutons des cartes pour changer d\'étape',
        noRolesInStage: 'Aucun poste dans cette étape',
        moveToPreparing: 'Passer en préparation',
        markReady: 'Marquer comme prêt',
        sendPassport: 'Envoyer le passeport',
        passportLogged: 'Passeport enregistré',
        reset: 'Réinitialiser',
        aiExplanationTitle: 'Explication & Justification du match par l\'IA',
        strengthsTitle: 'Vos forces vérifiées :',
        gapsTitle: 'Lacunes identifiées :',
        recommendedActionTitle: 'Action recommandée :',
        addMissingSkills: 'Ajouter les compétences manquantes au parcours',
        skillsOnRoadmap: 'Compétences actives sur votre parcours',
        competencyStatus: 'Statut de vérification des compétences :',
        startRecommendedChallenge: 'Démarrer le défi recommandé dans l\'espace de travail →',
        viewVerifiedResume: 'Voir le CV certifié en 1 page pour ce poste →',
        stipendLabel: 'Indemnité / Rémunération estimée'
      };
    case 'hi':
      return {
        badge: 'अवसर खोज और मार्गदर्शन',
        heading: 'जिला अवसर और सरकारी योजनाएं',
        subheading: 'सूचीबद्ध सभी अवसर केवल प्रदर्शन के नमूने हैं। वास्तविक भर्ती मानदंडों को जानें, कौशल अंतर पाटें और अपनी तैयारी को ट्रैक करें।',
        activeProfile: 'सक्रिय प्रोफ़ाइल',
        tabOpportunities: 'नमूना अवसर (10)',
        tabSchemes: 'सरकारी योजनाएं (Skill India & NAPS)',
        tabTracker: 'आवेदन ट्रैकर',
        viewRoadmap: 'रोडमैप देखें →',
        searchPlaceholder: 'पद, कंपनी, स्थान या कौशल खोजें...',
        allRoles: 'सभी पद (10)',
        technical: 'तकनीकी (5)',
        vocational: 'व्यावसायिक व शिल्प (5)',
        districtLabel: 'ज़िला:',
        allDistricts: 'सभी ज़िले',
        emptyTitle: 'कोई मेल खाने वाला अवसर नहीं मिला',
        emptyDesc: 'कृपया अपना खोज शब्द या ज़िला फ़िल्टर बदलकर पुनः प्रयास करें।',
        emptyAction: 'सभी पद और ज़िले दिखाएं',
        sampleRibbon: 'नमूना · वास्तविक रिक्ति नहीं',
        technicalCategory: 'तकनीकी',
        vocationalCategory: 'व्यावसायिक',
        eligibility: 'पात्रता:',
        requiredCompetencies: 'आवश्यक क्षमताएं:',
        verified: 'सत्यापित',
        colorLegend: 'हरा = आपके पास है, अंबर = शेष',
        missing: 'शेष',
        nextAction: 'अगला कदम:',
        proofMatch: 'प्रमाण मिलान',
        trackerStage: 'ट्रैकर चरण:',
        viewMatchDetails: 'मिलान विवरण देखें',
        stageSaved: 'सहेजा गया',
        stagePreparing: 'तैयारी जारी',
        stageReady: 'आवेदन के लिए तैयार',
        stageApplied: 'पासपोर्ट भेजा गया',
        schemeNoticeTitle: 'सार्वजनिक सूचनात्मक मार्गदर्शन एवं गैर-संबद्धता सूचना',
        schemeNoticeText: 'यह खंड सरकारी कौशल पहलों के संबंध में शैक्षिक जानकारी प्रदान करता है। SkillBridge AI एक स्वतंत्र नागरिक शिक्षण सहायक है और किसी भी सरकारी एजेंसी से संबद्ध नहीं है।',
        targetBeneficiaries: 'लक्षित लाभार्थी:',
        keyHighlights: 'प्रमुख लाभ:',
        opensOfficial: 'आधिकारिक सरकारी पोर्टल नए टैब में खुलता है',
        trackerTitle: 'मॉडल आवेदन प्रबंधन पाइपलाइन (4 चरण)',
        trackerSub: 'बुकमार्क करने से लेकर अपने सत्यापित स्किलब्रिज पासपोर्ट को जमा करने तक की प्रगति को ट्रैक करें।',
        trackerHint: 'चरणों के बीच स्थानांतरित करने के लिए कार्ड बटन क्लिक करें',
        noRolesInStage: 'इस चरण में कोई पद नहीं है',
        moveToPreparing: 'तैयारी में ले जाएं',
        markReady: 'तैयार चिह्नित करें',
        sendPassport: 'पासपोर्ट भेजें',
        passportLogged: 'पासपोर्ट दर्ज किया गया',
        reset: 'रीसेट',
        aiExplanationTitle: 'एआई मिलान स्पष्टीकरण और तर्क',
        strengthsTitle: 'आपकी सत्यापित क्षमताएं:',
        gapsTitle: 'पहचाने गए कौशल अंतराल:',
        recommendedActionTitle: 'अनुशंसित कार्रवाई:',
        addMissingSkills: 'शेष कौशलों को रोडमैप में जोड़ें',
        skillsOnRoadmap: 'कौशल आपके रोडमैप में सक्रिय हैं',
        competencyStatus: 'कौशल सत्यापन स्थिति:',
        startRecommendedChallenge: 'कार्यक्षेत्र में अनुशंसित चुनौती शुरू करें →',
        viewVerifiedResume: 'इस पद के लिए सत्यापित 1-पेज का बायोडाटा देखें →',
        stipendLabel: 'अनुमानित वजीफा / वेतन'
      };
    default: // en
      return {
        badge: 'Opportunity Discovery & Guidance',
        heading: 'District Opportunities & Govt Schemes',
        subheading: 'All opportunities listed are strictly labeled demonstration samples. Discover realistic hiring criteria, bridge skill gaps, learn about official apprenticeships, and track your mock preparation.',
        activeProfile: 'Active Profile',
        tabOpportunities: 'Sample Opportunities (10)',
        tabSchemes: 'Government Schemes (Skill India & NAPS)',
        tabTracker: 'Application Tracker',
        viewRoadmap: 'View Roadmap →',
        searchPlaceholder: 'Search role, company, location, or skill...',
        allRoles: 'All Roles (10)',
        technical: 'Technical (5)',
        vocational: 'Vocational & Craft (5)',
        districtLabel: 'District:',
        allDistricts: 'All Districts',
        emptyTitle: 'No matching opportunities found',
        emptyDesc: 'Try clearing your search keyword or switching to "All Roles" or "All Districts".',
        emptyAction: 'Show All Roles & Districts',
        sampleRibbon: 'Sample · not a real vacancy',
        technicalCategory: 'Technical',
        vocationalCategory: 'Vocational',
        eligibility: 'Eligibility:',
        requiredCompetencies: 'Required Competencies:',
        verified: 'Verified',
        colorLegend: 'Green = You Have, Amber = Missing',
        missing: 'Missing',
        nextAction: 'Next Action:',
        proofMatch: 'Proof Match',
        trackerStage: 'Tracker Stage:',
        viewMatchDetails: 'View Match Details',
        stageSaved: 'Saved',
        stagePreparing: 'Preparing',
        stageReady: 'Ready to Apply',
        stageApplied: 'Passport Sent',
        schemeNoticeTitle: 'Public Informational Guidance & Non-Affiliation Notice',
        schemeNoticeText: 'This section provides educational information regarding central and state skilling initiatives. SkillBridge AI is an independent civic learning assistant and is not affiliated with, nor does it make eligibility determinations or process official applications for any government agency. Official registration, eligibility verification, and stipend disbursement are handled exclusively through the respective official government portals.',
        targetBeneficiaries: 'Target Beneficiaries:',
        keyHighlights: 'Key Highlights:',
        opensOfficial: 'Opens official government portal in a new tab',
        trackerTitle: 'Mock Application Pipeline (4 Stages)',
        trackerSub: 'Track your preparation progress from bookmarking to submitting your verifiable SkillBridge Passport.',
        trackerHint: 'Click buttons on any card to move between stages',
        noRolesInStage: 'No roles in this stage',
        moveToPreparing: 'Move to Preparing',
        markReady: 'Mark Ready',
        sendPassport: 'Send Passport',
        passportLogged: 'Passport Logged',
        reset: 'Reset',
        aiExplanationTitle: 'AI Match Explanation & Reasoning',
        strengthsTitle: 'Your Verified Strengths:',
        gapsTitle: 'Identified Skill Gaps:',
        recommendedActionTitle: 'Recommended Action:',
        addMissingSkills: 'Add missing skills to roadmap',
        skillsOnRoadmap: 'Skills active on your roadmap',
        competencyStatus: 'Competency Verification Status:',
        startRecommendedChallenge: 'Start Recommended Challenge in Workspace →',
        viewVerifiedResume: 'View Verified 1-Page Resume for this Role →',
        stipendLabel: 'Estimated Stipend / Pay'
      };
  }
};

export const OpportunitiesView: React.FC = () => {
  const { t } = useTranslation();
  const {
    opportunities,
    getPersona,
    setActiveTab,
    language,
    trackerStages,
    setTrackerStage,
    roadmapFocusSkills,
    addMissingSkillsToRoadmap
  } = useSkillBridgeStore();

  const currentLang = (language || 'en') as Language;
  const isTa = currentLang === 'ta';
  const strings = getStrings(currentLang);
  const persona = getPersona();

  // Navigation tab state
  const [activeMainTab, setActiveMainTab] = useState<'opportunities' | 'schemes' | 'tracker'>('opportunities');

  // Filters state
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'vocational'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawer state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [addedSkillsToast, setAddedSkillsToast] = useState<string | null>(null);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesLocation =
      selectedLocation === 'all' ||
      opp.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || opp.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLocation && matchesCategory && matchesSearch;
  });

  const handleOpenDrawer = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  const handleCloseDrawer = () => {
    setSelectedOpportunity(null);
  };

  const handleAddSkillsToRoadmap = (skillNames: string[]) => {
    addMissingSkillsToRoadmap(skillNames);
    const toastMsg =
      currentLang === 'ta'
        ? `"${skillNames.join(', ')}" உங்கள் கற்றல் வரைபடத்தில் சேர்க்கப்பட்டது!`
        : currentLang === 'fr'
        ? `« ${skillNames.join(', ')} » a été ajouté à votre parcours actif !`
        : currentLang === 'hi'
        ? `"${skillNames.join(', ')}" आपके सक्रिय रोडमैप में जोड़ा गया!`
        : `Added "${skillNames.join(', ')}" to your active roadmap focus!`;

    setAddedSkillsToast(toastMsg);
    setTimeout(() => {
      setAddedSkillsToast(null);
    }, 4500);
  };

  const handleStageChange = (oppId: string, newStage: ApplicationTrackerStage) => {
    setTrackerStage(oppId, newStage);
  };

  const handleStartChallenge = (challengeId: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/challenges/${challengeId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setActiveTab('challenges');
  };

  // Group opportunities by tracker stages
  const trackerColumns: { stage: ApplicationTrackerStage; label: string; icon: React.ReactNode; color: string }[] = [
    {
      stage: 'saved',
      label: strings.stageSaved,
      icon: <Bookmark className="w-4 h-4 text-[#173B67] dark:text-sky-300" />,
      color: 'border-[#E2E8F0] dark:border-night-border'
    },
    {
      stage: 'preparing',
      label: strings.stagePreparing,
      icon: <Clock className="w-4 h-4 text-[#62B6E8]" />,
      color: 'border-[#BAE6FD] dark:border-night-border'
    },
    {
      stage: 'ready',
      label: strings.stageReady,
      icon: <CheckCircle2 className="w-4 h-4 text-[#10B981]" />,
      color: 'border-[#A7F3D0] dark:border-night-border'
    },
    {
      stage: 'applied',
      label: strings.stageApplied,
      icon: <Send className="w-4 h-4 text-[#173B67] dark:text-sky-300" />,
      color: 'border-[#BAE6FD] dark:border-night-border'
    }
  ];

  const getStageOppList = (stage: ApplicationTrackerStage) => {
    return opportunities.filter(opp => {
      const currentStage = trackerStages[opp.id] || 'saved';
      return currentStage === stage;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAF5FC] dark:bg-deepblue-950/80 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                {strings.badge}
              </span>
              <TrustLabel type="sample-opportunity" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              {strings.heading}
            </h1>

            <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-2xl leading-relaxed">
              {strings.subheading}
            </p>
          </div>

          {/* Persona context */}
          <div className="p-3.5 sm:p-4 rounded-btn bg-[#EAF5FC] dark:bg-night-100/60 border border-[#BAE6FD] text-xs space-y-1 w-full lg:w-auto lg:min-w-[200px]">
            <div className="text-[11px] uppercase font-bold text-[#526174] dark:text-night-muted">
              {strings.activeProfile}
            </div>
            <div className="font-bold text-[#173B67] dark:text-white">
              {isTa ? persona.nameTamil : persona.name}
            </div>
            <div className="text-[#62B6E8] font-medium">
              {persona.location}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-[#E2E8F0] dark:border-night-border/60">
          <button
            type="button"
            onClick={() => setActiveMainTab('opportunities')}
            className={`px-4 py-2 rounded-btn text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'opportunities'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{strings.tabOpportunities}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('schemes')}
            className={`px-4 py-2 rounded-btn text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'schemes'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{strings.tabSchemes}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tracker')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'tracker'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-sky-200/50'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>{strings.tabTracker}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {addedSkillsToast && (
        <div className="p-3.5 rounded-xl bg-forest-100 dark:bg-forest-950/80 border border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-200 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0" />
            <span>{addedSkillsToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className="text-forest-800 dark:text-forest-300 underline underline-offset-2 hover:text-forest-950 text-xs cursor-pointer"
          >
            {strings.viewRoadmap}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: 10 SAMPLE OPPORTUNITIES */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'opportunities' && (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#526174]" />
              <input
                type="text"
                placeholder={strings.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-btn text-xs bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border text-[#173B67] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-btn text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
                }`}
              >
                {strings.allRoles}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('technical')}
                className={`px-3 py-1.5 rounded-btn text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'technical'
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
                }`}
              >
                {strings.technical}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('vocational')}
                className={`px-3 py-1.5 rounded-btn text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'vocational'
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
                }`}
              >
                {strings.vocational}
              </button>
            </div>
          </div>

          {/* District Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-[#526174] dark:text-night-muted mr-1">
              {strings.districtLabel}
            </span>
            <button
              type="button"
              onClick={() => setSelectedLocation('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                selectedLocation === 'all'
                  ? 'bg-[#173B67] text-white shadow-soft'
                  : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
              }`}
            >
              {strings.allDistricts}
            </button>
            {['Chennai', 'Coimbatore', 'Tiruppur', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setSelectedLocation(dist)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  selectedLocation === dist
                    ? 'bg-[#173B67] text-white shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink hover:bg-[#D9EFFB]'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>

          {/* Opportunities Grid or Empty State */}
          {filteredOpportunities.length === 0 ? (
            <EmptyState
              title={strings.emptyTitle}
              description={strings.emptyDesc}
              actionLabel={strings.emptyAction}
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredOpportunities.map((opp) => {
                const matchedCount = opp.requiredSkills.filter(s => s.met).length;
                const totalCount = opp.requiredSkills.length;
                const currentTrackerStage = trackerStages[opp.id] || 'saved';

                const displayTitle = isTa && opp.titleTamil ? opp.titleTamil : opp.title;
                const displayDesc = isTa && opp.descriptionTamil ? opp.descriptionTamil : opp.description;
                const displayEligibility = isTa && opp.eligibilityTamil ? opp.eligibilityTamil : opp.eligibility;
                const displayNextAction = isTa && opp.nextActionTamil ? opp.nextActionTamil : opp.nextAction;

                return (
                  <div
                    key={opp.id}
                    id={opp.id === 'opp-chennai-frontend-trainee' ? 'opportunity-spotlight-card' : `opportunity-card-${opp.id}`}
                    className={`relative p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border shadow-soft hover:shadow-soft hover:border-[#62B6E8] transition-all overflow-hidden ${
                      opp.id === 'opp-chennai-frontend-trainee'
                        ? 'border-2 border-[#62B6E8] ring-2 ring-[#62B6E8]/30'
                        : 'border-[#E2E8F0] dark:border-night-border'
                    }`}
                  >
                    {/* "Sample · not a real vacancy" ribbon */}
                    <div className="absolute top-0 right-0 bg-[#EAF5FC] dark:bg-deepblue-950 text-[#173B67] dark:text-sky-200 text-[10px] font-extrabold uppercase tracking-widest px-4 py-0.5 rounded-bl-xl shadow-xs border-b border-l border-[#BAE6FD]">
                      {strings.sampleRibbon}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      {/* Left: Role Info & Skills */}
                      <div className="space-y-3 flex-1 pr-0 lg:pr-6">
                        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                          {opp.id === 'opp-chennai-frontend-trainee' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] text-xs font-bold shadow-xs">
                              <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                              <span>⚡ ONLY JAVASCRIPT MISSING (88% MATCH)</span>
                            </span>
                          )}
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink border border-[#BAE6FD]">
                            {opp.type}
                          </span>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                            {opp.category === 'technical' ? strings.technicalCategory : strings.vocationalCategory}
                          </span>
                          <span className="text-xs text-[#526174] dark:text-night-muted">
                            {opp.postedDate}
                          </span>
                        </div>

                        <div>
                          <h3 className={`text-lg sm:text-xl font-bold text-[#173B67] dark:text-white ${isTa ? 'font-tamil' : ''}`}>
                            {displayTitle}
                          </h3>
                        </div>

                        {/* Company & Location & Stipend */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#526174] dark:text-night-muted">
                          <span className="flex items-center gap-1 font-semibold text-[#173B67] dark:text-white">
                            <Building className="w-3.5 h-3.5 text-[#173B67] dark:text-sky-300" />
                            {opp.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {opp.location}
                          </span>
                          <span className="font-bold text-[#10B981]">
                            {opp.stipendOrSalary}
                          </span>
                        </div>

                        <p className={`text-xs text-[#526174] dark:text-night-muted leading-relaxed max-w-2xl ${isTa ? 'font-tamil' : ''}`}>
                          {displayDesc}
                        </p>

                        {/* ELIGIBILITY */}
                        <div className="p-2.5 rounded-card bg-[#F8FAFC] dark:bg-night-100/70 border border-[#E2E8F0] text-xs">
                          <span className="font-bold text-[#173B67] dark:text-white">
                            {strings.eligibility}
                          </span>{' '}
                          <span className={`text-[#526174] dark:text-night-muted ${isTa ? 'font-tamil' : ''}`}>
                            {displayEligibility}
                          </span>
                        </div>

                        {/* REQUIRED SKILLS */}
                        <div>
                          <div className="text-[11px] font-bold text-[#173B67] dark:text-white uppercase tracking-wide mb-1.5 flex items-center gap-2">
                            <span>
                              {strings.requiredCompetencies} ({matchedCount}/{totalCount} {strings.verified}):
                            </span>
                            <span className="text-[10px] text-[#526174] font-normal">
                              ({strings.colorLegend})
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {opp.requiredSkills.map((sk, sIdx) => (
                              <span
                                key={sIdx}
                                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                                  sk.met
                                    ? 'bg-[#ECFDF5] dark:bg-emerald-950/70 text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0]'
                                    : 'bg-[#FFFBEB] dark:bg-amber-950/70 text-[#B45309] dark:text-amber-200 border border-[#FDE68A] font-bold'
                                }`}
                              >
                                {sk.met ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-[#F2B66D] shrink-0" />
                                )}
                                <span>
                                  {sk.skillName} (Lvl {sk.requiredLevel})
                                </span>
                                {!sk.met && (
                                  <span className="text-[10px] uppercase font-bold text-[#B45309] dark:text-amber-300">
                                    [{strings.missing}]
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* NEXT ACTION */}
                        <div className="text-xs pt-1 flex items-center gap-2 text-[#526174] dark:text-night-muted">
                          <span className="font-bold text-[#173B67] dark:text-white">
                            {strings.nextAction}
                          </span>
                          <span className={`text-[#62B6E8] font-semibold ${isTa ? 'font-tamil' : ''}`}>
                            {displayNextAction}
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Match Score, Tracker Stage, and Detail Action */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 lg:min-w-[190px] pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
                        <div className="text-left lg:text-right">
                          <div className="text-[11px] uppercase font-bold text-[#526174]">
                            {strings.proofMatch}
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-sky-300">
                            {opp.matchScore}%
                          </div>
                          <div className="text-[10px] text-[#526174] dark:text-night-muted">
                            {matchedCount} of {totalCount} verified
                          </div>
                        </div>

                        {/* Current Tracker Stage Indicator */}
                        <div className="flex flex-col gap-1.5 w-full">
                          <div className="text-[10px] uppercase font-bold text-[#526174] dark:text-night-muted">
                            {strings.trackerStage}
                          </div>
                          <select
                            value={currentTrackerStage}
                            onChange={(e) => handleStageChange(opp.id, e.target.value as ApplicationTrackerStage)}
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-btn bg-white dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border text-[#173B67] dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
                          >
                            <option value="saved">{strings.stageSaved}</option>
                            <option value="preparing">{strings.stagePreparing}</option>
                            <option value="ready">{strings.stageReady}</option>
                            <option value="applied">{strings.stageApplied}</option>
                          </select>
                        </div>

                        {/* Open Detail Drawer Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(opp)}
                          className="w-full px-4 py-2.5 rounded-btn font-semibold text-xs bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] shadow-soft transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#173B67]" />
                          <span>{strings.viewMatchDetails}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: GOVERNMENT SCHEMES */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'schemes' && (
        <div className="space-y-6">
          {/* Informational Disclaimer Banner */}
          <div className="p-5 rounded-card bg-[#EAF5FC] dark:bg-night-card border border-[#BAE6FD] dark:border-night-border shadow-soft space-y-2">
            <div className="flex items-center gap-2 text-[#173B67] dark:text-sky-300">
              <ShieldCheck className="w-5 h-5 text-[#173B67] dark:text-sky-400 shrink-0" />
              <h3 className="text-sm font-bold tracking-wide">
                {strings.schemeNoticeTitle}
              </h3>
            </div>
            <p className="text-xs text-[#526174] dark:text-night-muted leading-relaxed">
              {strings.schemeNoticeText}
            </p>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {governmentSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
                      {scheme.badgeTag}
                    </span>
                    <Landmark className="w-4 h-4 text-[#173B67] dark:text-sky-400 shrink-0" />
                  </div>

                  <div>
                    <h3 className={`text-base sm:text-lg font-bold text-[#173B67] dark:text-night-ink ${isTa ? 'font-tamil' : ''}`}>
                      {isTa && scheme.nameTamil ? scheme.nameTamil : scheme.name}
                    </h3>
                  </div>

                  <div className="text-[11px] text-[#173B67] dark:text-sky-400 font-semibold">
                    {scheme.ministryOrAuthority}
                  </div>

                  <p className={`text-xs text-[#526174] dark:text-night-muted leading-relaxed ${isTa ? 'font-tamil' : ''}`}>
                    {isTa && scheme.descriptionTamil ? scheme.descriptionTamil : scheme.description}
                  </p>

                  {/* Beneficiary Pill */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-night-100/70 border border-[#E2E8F0] dark:border-night-border text-xs">
                    <span className="font-bold text-[#173B67] dark:text-night-ink">
                      {strings.targetBeneficiaries}
                    </span>{' '}
                    <span className={`text-[#526174] dark:text-night-muted ${isTa ? 'font-tamil' : ''}`}>
                      {isTa && scheme.targetBeneficiariesTamil ? scheme.targetBeneficiariesTamil : scheme.targetBeneficiaries}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                      {strings.keyHighlights}
                    </div>
                    <ul className={`space-y-1 text-xs text-[#526174] dark:text-night-muted ${isTa ? 'font-tamil' : ''}`}>
                      {(isTa && scheme.keyHighlightsTamil ? scheme.keyHighlightsTamil : scheme.keyHighlights).map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* External Link Out */}
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-night-border">
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn font-semibold text-xs bg-[#EAF5FC] dark:bg-night-100 hover:bg-[#D9EFFB] text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border transition-colors cursor-pointer"
                  >
                    <span>{isTa && scheme.learnMoreCtaTextTamil ? scheme.learnMoreCtaTextTamil : scheme.learnMoreCtaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="text-[10px] text-center text-[#526174] dark:text-night-muted mt-1.5">
                    {strings.opensOfficial}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: APPLICATION TRACKER */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'tracker' && (
        <div className="space-y-5">
          <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-[#173B67] dark:text-night-ink text-sm">
                {strings.trackerTitle}
              </div>
              <div className="text-[#526174] dark:text-night-muted">
                {strings.trackerSub}
              </div>
            </div>
            <div className="text-[11px] text-[#526174] italic">
              {strings.trackerHint}
            </div>
          </div>

          {/* 4 Columns Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackerColumns.map((col) => {
              const items = getStageOppList(col.stage);

              return (
                <div
                  key={col.stage}
                  className="rounded-card bg-[#F8FAFC] dark:bg-night-100/50 border border-[#E2E8F0] dark:border-night-border p-4 space-y-3 flex flex-col min-h-[420px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-night-border">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#173B67] dark:text-night-ink">
                      {col.icon}
                      <span>{col.label}</span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-[#EAF5FC] dark:bg-night-card font-bold text-[11px] flex items-center justify-center text-[#173B67] dark:text-sky-300">
                      {items.length}
                    </span>
                  </div>

                  {/* Column Items */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-4 rounded-lg border border-dashed border-[#E2E8F0] text-center text-xs text-[#526174] dark:text-night-muted">
                        {strings.noRolesInStage}
                      </div>
                    ) : (
                      items.map((opp) => {
                        const itemTitle = isTa && opp.titleTamil ? opp.titleTamil : opp.title;
                        return (
                          <div
                            key={opp.id}
                            className="p-3.5 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-2.5 transition-all hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className={`font-bold text-xs text-[#173B67] dark:text-night-ink leading-snug ${isTa ? 'font-tamil' : ''}`}>
                                  {itemTitle}
                                </div>
                                <div className="text-[11px] text-[#173B67] dark:text-sky-400 font-medium">
                                  {opp.company}
                                </div>
                              </div>
                              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                                {opp.matchScore}%
                              </span>
                            </div>

                            <div className="text-[11px] text-[#526174] dark:text-night-muted flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                              <span className="truncate">{opp.location}</span>
                            </div>

                            {/* Stage Transition Controls */}
                            <div className="pt-2 border-t border-[#E2E8F0] dark:border-night-border flex items-center justify-between gap-1 text-[10px]">
                              {col.stage === 'saved' && (
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'preparing')}
                                  className="w-full py-1.5 px-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-soft"
                                >
                                  <span>{strings.moveToPreparing}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}

                              {col.stage === 'preparing' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStageChange(opp.id, 'saved')}
                                    className="py-1 px-1.5 rounded text-[#526174] hover:text-[#173B67] cursor-pointer"
                                    title="Move Back"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStageChange(opp.id, 'ready')}
                                    className="flex-1 py-1.5 px-2 rounded-btn bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <span>{strings.markReady}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </>
                              )}

                              {col.stage === 'ready' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStageChange(opp.id, 'preparing')}
                                    className="py-1 px-1.5 rounded text-[#526174] hover:text-[#173B67] cursor-pointer"
                                    title="Move Back"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStageChange(opp.id, 'applied')}
                                    className="flex-1 py-1.5 px-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-soft"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>{strings.sendPassport}</span>
                                  </button>
                                </>
                              )}

                              {col.stage === 'applied' && (
                                <div className="w-full flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{strings.passportLogged}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleStageChange(opp.id, 'ready')}
                                    className="text-[#526174] hover:text-[#173B67] text-[10px] underline cursor-pointer"
                                  >
                                    {strings.reset}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DETAIL DRAWER WITH AI-STYLE MATCH EXPLANATION */}
      {/* ------------------------------------------------------------------ */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg h-full bg-white dark:bg-night-card border-l border-[#E2E8F0] dark:border-night-border shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#E2E8F0] dark:border-night-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                    {strings.sampleRibbon}
                  </span>
                  <span className="text-xs text-[#526174]">
                    {selectedOpportunity.type}
                  </span>
                </div>
                <h2 className={`text-lg sm:text-xl font-bold text-[#173B67] dark:text-night-ink ${isTa ? 'font-tamil' : ''}`}>
                  {isTa && selectedOpportunity.titleTamil ? selectedOpportunity.titleTamil : selectedOpportunity.title}
                </h2>
                <div className="text-xs font-semibold text-[#173B67] dark:text-sky-400 mt-0.5">
                  {selectedOpportunity.company} • {selectedOpportunity.location}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="p-1 rounded-btn text-[#526174] hover:bg-[#EAF5FC] dark:hover:bg-night-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Match Rating */}
            <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100/80 border border-[#E2E8F0] dark:border-night-border flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-bold text-[#526174]">
                  {strings.stipendLabel}
                </div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedOpportunity.stipendOrSalary}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase font-bold text-[#526174]">{strings.proofMatch}</div>
                <div className="text-2xl font-extrabold text-[#173B67] dark:text-sky-400">
                  {selectedOpportunity.matchScore}%
                </div>
              </div>
            </div>

            {/* AI-STYLE EXPLANATION OF THE MATCH */}
            <div className="p-4 rounded-card bg-[#EAF5FC] dark:bg-night-100/60 border border-[#BAE6FD] dark:border-night-border shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-[#173B67] dark:text-sky-300">
                <Sparkles className="w-4 h-4 text-[#62B6E8] dark:text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {strings.aiExplanationTitle}
                </h4>
              </div>

              {selectedOpportunity.aiExplanation && (
                <div className="space-y-2.5 text-xs">
                  {/* Verified Strengths */}
                  <div className="space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{strings.strengthsTitle}</span>
                    </div>
                    <p className={`text-[#526174] dark:text-night-muted leading-relaxed pl-5 ${isTa ? 'font-tamil' : ''}`}>
                      {isTa && selectedOpportunity.aiExplanation.strengthsTamil
                        ? selectedOpportunity.aiExplanation.strengthsTamil
                        : selectedOpportunity.aiExplanation.strengths}
                    </p>
                  </div>

                  {/* Detected Gaps */}
                  <div className="space-y-1">
                    <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{strings.gapsTitle}</span>
                    </div>
                    <p className={`text-[#526174] dark:text-night-muted leading-relaxed pl-5 ${isTa ? 'font-tamil' : ''}`}>
                      {isTa && selectedOpportunity.aiExplanation.gapsTamil
                        ? selectedOpportunity.aiExplanation.gapsTamil
                        : selectedOpportunity.aiExplanation.gaps}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="space-y-1 pt-1">
                    <div className="font-bold text-[#173B67] dark:text-sky-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>{strings.recommendedActionTitle}</span>
                    </div>
                    <p className={`text-[#526174] dark:text-night-muted leading-relaxed pl-5 ${isTa ? 'font-tamil' : ''}`}>
                      {isTa && selectedOpportunity.aiExplanation.roadmapActionTamil
                        ? selectedOpportunity.aiExplanation.roadmapActionTamil
                        : selectedOpportunity.aiExplanation.roadmapAction}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON: "Add missing skills to roadmap" */}
            {selectedOpportunity.requiredSkills.some(s => !s.met) && (() => {
              const missingSkills = selectedOpportunity.requiredSkills
                .filter(s => !s.met)
                .map(s => s.skillName);
              const isAlreadyOnRoadmap =
                missingSkills.length > 0 &&
                missingSkills.every(m => roadmapFocusSkills.includes(m));

              return (
                <button
                  type="button"
                  disabled={isAlreadyOnRoadmap}
                  onClick={() => handleAddSkillsToRoadmap(missingSkills)}
                  className={`w-full py-2.5 px-4 rounded-btn font-semibold text-xs shadow-soft transition-all flex items-center justify-center gap-2 ${
                    isAlreadyOnRoadmap
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 cursor-default'
                      : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] cursor-pointer'
                  }`}
                >
                  {isAlreadyOnRoadmap ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>
                    {isAlreadyOnRoadmap ? strings.skillsOnRoadmap : strings.addMissingSkills}
                  </span>
                </button>
              );
            })()}

            {/* Required Skills Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#526174]">
                {strings.competencyStatus}
              </div>
              <div className="space-y-1.5">
                {selectedOpportunity.requiredSkills.map((sk, idx) => {
                  const onRoadmap = roadmapFocusSkills.includes(sk.skillName);

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-night-100/70 border border-[#E2E8F0] dark:border-night-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {sk.met ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="font-semibold text-[#173B67] dark:text-night-ink">
                          {sk.skillName}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          sk.met
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                            : onRoadmap
                            ? 'bg-[#EAF5FC] text-[#173B67] dark:bg-night-100 dark:text-sky-300 border border-[#BAE6FD]'
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                        }`}
                      >
                        {sk.met
                          ? 'Verified (Lvl ' + sk.requiredLevel + ')'
                          : onRoadmap
                          ? 'On Roadmap Focus'
                          : strings.missing}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Challenge Action if recommended */}
            {selectedOpportunity.aiExplanation?.recommendedChallengeId && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartChallenge(selectedOpportunity.aiExplanation!.recommendedChallengeId!);
                    handleCloseDrawer();
                  }}
                  className="w-full py-2.5 px-4 rounded-btn font-semibold text-xs bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4" />
                  <span>
                    {strings.startRecommendedChallenge}
                  </span>
                </button>
              </div>
            )}

            {/* Generate Verified Resume CTA */}
            <div className="pt-2 border-t border-[#E2E8F0] dark:border-night-border">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('resume');
                  handleCloseDrawer();
                }}
                className="w-full py-2.5 px-4 rounded-btn font-semibold text-xs bg-[#EAF5FC] dark:bg-night-100 hover:bg-[#D9EFFB] border border-[#BAE6FD] dark:border-night-border text-[#173B67] dark:text-sky-300 shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#173B67] dark:text-sky-400" />
                <span>
                  {strings.viewVerifiedResume}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
