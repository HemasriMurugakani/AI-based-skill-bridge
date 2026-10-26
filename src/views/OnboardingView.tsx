import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { VoiceSettingsModal } from '../components/VoiceSettingsModal';
import { AIThinking } from '../components/AIThinking';
import { TrustLabel } from '../components/TrustLabel';
import { SpeechLang } from '../utils/speech';
import {
  User,
  Target,
  Layers,
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Star,
  Plus,
  Compass,
  Cpu,
  Palette,
  Wrench,
  BarChart3,
  HelpCircle,
  Mic
} from 'lucide-react';

interface SkillSelection {
  name: string;
  nameTamil?: string;
  rating: number; // 1 to 5
}

export const OnboardingView: React.FC = () => {
  const { pathways, setPersona, setActiveTab, updateSkillState } = useSkillBridgeStore();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [voiceLang, setVoiceLang] = useState<SpeechLang>('ta-IN');
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  // Step 1: Name
  const [learnerName, setLearnerName] = useState('');
  const [learnerTamilName, setLearnerTamilName] = useState('');

  // Step 2: Goal
  const [goal, setGoal] = useState('');

  // Step 3: Current Skills
  const [selectedSkills, setSelectedSkills] = useState<SkillSelection[]>([
    { name: 'Basic HTML / Smartphone literacy', rating: 2 }
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState<'tech' | 'tailor' | 'elec' | 'data'>('tech');

  // Step 4: Hours per day
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);

  // Step 5: Work preference
  const [workPreference, setWorkPreference] = useState<'technical' | 'creative' | 'business' | 'hands_on'>('technical');

  // AI Recommendation State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [recommendedPathwayId, setRecommendedPathwayId] = useState('junior-web-dev');
  const [showExplanation, setShowExplanation] = useState(false);

  // Quick Goals
  const quickGoals = [
    { title: 'Secure First Tech Placement', tamil: 'முதல் தகவல் தொழில்நுட்ப வேலை' },
    { title: 'Launch Boutique Tailoring Business', tamil: 'சொந்த தையல் கடை / தொழில் தொடங்குதல்' },
    { title: 'Become Licensed Solar & Domestic Wireman', tamil: 'அங்கீகரிக்கப்பட்ட மின்சார வல்லுநர்' },
    { title: 'Career Switch into Data Analytics', tamil: 'தரவு பகுப்பாய்வு பணிக்கு மாறுதல்' }
  ];

  // Category Skill Presets
  const categorySkillPresets = {
    tech: [
      { name: 'HTML & CSS Basics', nameTamil: 'அடிப்படை HTML & CSS' },
      { name: 'JavaScript Logic', nameTamil: 'ஜாவாஸ்கிரிப்ட் தர்க்கம்' },
      { name: 'Git & GitHub', nameTamil: 'கிட் பதிப்புக் கட்டுப்பாடு' },
      { name: 'Computer Typing', nameTamil: 'கணினி தட்டச்சு' }
    ],
    tailor: [
      { name: 'Tape Body Measurement', nameTamil: 'உடல் அளவீடு எடுத்தல்' },
      { name: 'Straight Seam Stitching', nameTamil: 'நேர்கோட்டு தையல்' },
      { name: 'Scissors Pattern Cutting', nameTamil: 'கத்தரி வெட்டு முறை' },
      { name: 'Hand Embroidery', nameTamil: 'கை எம்பிராய்டரி' }
    ],
    elec: [
      { name: 'Electrical Safety (IS 5216)', nameTamil: 'மின் பாதுகாப்பு' },
      { name: 'Switch & Socket Wiring', nameTamil: 'சுவிட்ச் மற்றும் சாக்கெட் இணைப்பு' },
      { name: 'Multimeter & Tester Usage', nameTamil: 'மல்டிமீட்டர் பயன்பாடு' }
    ],
    data: [
      { name: 'Excel Formulas & VLOOKUP', nameTamil: 'எக்செல் சூத்திரங்கள்' },
      { name: 'Basic SQL Queries', nameTamil: 'அடிப்படை SQL வினவல்கள்' },
      { name: 'Data Visualization', nameTamil: 'விளக்கப்பட உருவாக்கம்' }
    ]
  };

  const handleAddPresetSkill = (preset: { name: string; nameTamil?: string }) => {
    if (!selectedSkills.some(s => s.name === preset.name)) {
      setSelectedSkills([...selectedSkills, { name: preset.name, nameTamil: preset.nameTamil, rating: 2 }]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim()) {
      setSelectedSkills([...selectedSkills, { name: customSkillInput.trim(), rating: 2 }]);
      setCustomSkillInput('');
    }
  };

  const handleUpdateRating = (index: number, newRating: number) => {
    const updated = [...selectedSkills];
    updated[index].rating = newRating;
    setSelectedSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (step === 5) {
      // Trigger AI recommendation synthesis
      setStep(6);
      setIsSynthesizing(true);

      setTimeout(() => {
        setIsSynthesizing(false);
        // Compute recommendation based on work preference & skills
        if (workPreference === 'creative') {
          setRecommendedPathwayId('tailoring-craft');
        } else if (workPreference === 'hands_on') {
          setRecommendedPathwayId('electrician-trade');
        } else if (workPreference === 'business') {
          setRecommendedPathwayId('data-analyst');
        } else {
          setRecommendedPathwayId('junior-web-dev');
        }
      }, 1800);
    } else {
      setStep(step + 1);
    }
  };

  const handleFinishOnboarding = () => {
    // Save as active custom learner profile
    const targetPathway = pathways.find(p => p.id === recommendedPathwayId) || pathways[0];
    
    // Save to localStorage
    const customProfile = {
      name: learnerName.trim() || 'Learner',
      nameTamil: learnerTamilName.trim() || learnerName.trim(),
      goal,
      dailyMinutes,
      workPreference,
      pathwayId: targetPathway.id,
      selectedSkills
    };
    localStorage.setItem('skillbridge_learner_profile', JSON.stringify(customProfile));

    // Redirect to roadmap
    setActiveTab('roadmap');
  };

  const getStepVoiceInstruction = () => {
    switch (step) {
      case 1:
        return voiceLang === 'ta-IN'
          ? 'உங்கள் பெயரை உள்ளிடவும் அல்லது மைக் பட்டனை அழுத்தி தமிழில் பேசவும்.'
          : 'Please enter your name or use the microphone to speak.';
      case 2:
        return voiceLang === 'ta-IN'
          ? 'உங்கள் கற்றல் இலக்கு என்ன? ஒரு விருப்பத்தை தேர்வு செய்யவும்.'
          : 'What is your learning goal? Pick an option or speak your goal.';
      case 3:
        return voiceLang === 'ta-IN'
          ? 'உங்களுக்கு ஏற்கனவே தெரிந்த திறன்களை தேர்வு செய்து மதிப்பிடவும்.'
          : 'Select any current skills you have and rate your experience.';
      case 4:
        return voiceLang === 'ta-IN'
          ? 'ஒரு நாளில் நீங்கள் கற்கக்கூடிய நேரத்தை தேர்வு செய்யவும்.'
          : 'How many minutes per day can you dedicate to learning?';
      case 5:
        return voiceLang === 'ta-IN'
          ? 'நீங்கள் விரும்பும் பணி பாணியை தேர்ந்தெடுக்கவும்: தொழில்நுட்பம், ஆடை கலை, அல்லது களப்பணி.'
          : 'Select your preferred style of work.';
      default:
        return 'SkillBridge AI is tailoring your roadmap.';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Wizard Step Progress Header */}
      <div className="p-4 sm:p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/70 text-gold-900 dark:text-gold-300 uppercase tracking-wider">
              Step {step} of 5
            </span>
            <span className="text-xs font-semibold text-warm-muted dark:text-night-muted">
              {step === 1 && 'Learner Identity'}
              {step === 2 && 'Career Goal'}
              {step === 3 && 'Current Skills'}
              {step === 4 && 'Daily Time Availability'}
              {step === 5 && 'Work Preference'}
              {step === 6 && 'AI Pathway Recommendation'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsVoiceSettingsOpen(true)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-parchment-200 dark:bg-night-100 hover:bg-gold-100 text-warm-ink dark:text-night-ink border border-warm-border/80 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
              <span>Test Voice</span>
            </button>
            <ReadAloudButton
              text={getStepVoiceInstruction()}
              lang={voiceLang}
              label="Read Aloud"
            />
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2 w-full bg-parchment-200 dark:bg-night-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-maroon-700 via-gold-500 to-forest-600 rounded-full transition-all duration-300"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div id="onboarding-voice-section" className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-md">
        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                What is your name?
              </h2>
              <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
                உங்கள் பெயர் என்ன? (குரல் வழி உள்ளீடும் செய்யலாம்)
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-ink dark:text-night-ink mb-1.5 uppercase tracking-wide">
                  Your Full Name (English)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    placeholder="e.g. Priya Soundararajan or Lakshmi Arumugam"
                    className="flex-1 px-4 py-3 rounded-xl text-sm bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500 font-medium"
                  />
                  <VoiceInputButton
                    onTranscript={(text) => setLearnerName(text)}
                    lang={voiceLang}
                    onLangChange={setVoiceLang}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-ink dark:text-night-ink mb-1.5 uppercase tracking-wide">
                  Tamil Name (Optional / தமிழில் பெயர்)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={learnerTamilName}
                    onChange={(e) => setLearnerTamilName(e.target.value)}
                    placeholder="எ.கா. பிரியா அல்லது லட்சுமி"
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-tamil bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <VoiceInputButton
                    onTranscript={(text) => setLearnerTamilName(text)}
                    lang="ta-IN"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GOAL */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                What is your main career or learning goal?
              </h2>
              <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
                நீங்கள் அடைய விரும்பும் இலக்கு என்ன?
              </div>
            </div>

            {/* Quick Pick Goal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickGoals.map((qg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setGoal(qg.title)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    goal === qg.title
                      ? 'bg-maroon-50 dark:bg-maroon-950/60 border-maroon-600 ring-2 ring-gold-400'
                      : 'bg-parchment-100 dark:bg-night-100 border-warm-border hover:border-gold-400'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-warm-ink dark:text-night-ink">
                    {qg.title}
                  </div>
                  <div className="font-tamil text-xs text-warm-muted dark:text-night-muted mt-1">
                    {qg.tamil}
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-ink dark:text-night-ink mb-1.5 uppercase tracking-wide">
                Or Type / Speak Your Custom Goal
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master React and get a job in Coimbatore tech park..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500 font-medium"
                />
                <VoiceInputButton
                  onTranscript={(text) => setGoal(text)}
                  lang={voiceLang}
                  onLangChange={setVoiceLang}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CURRENT SKILLS */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                Select Your Existing Skills & Self-Rating
              </h2>
              <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
                உங்களுக்கு ஏற்கனவே தெரிந்த திறன்களை தேர்வு செய்யவும் (1 முதல் 5 நட்சத்திரம்)
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSkillCategory('tech')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  skillCategory === 'tech' ? 'bg-maroon-700 text-white' : 'bg-parchment-200 text-warm-muted'
                }`}
              >
                Web & Software
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('tailor')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  skillCategory === 'tailor' ? 'bg-maroon-700 text-white' : 'bg-parchment-200 text-warm-muted'
                }`}
              >
                Tailoring & Textiles
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('elec')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  skillCategory === 'elec' ? 'bg-maroon-700 text-white' : 'bg-parchment-200 text-warm-muted'
                }`}
              >
                Electrical Wiring
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('data')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  skillCategory === 'data' ? 'bg-maroon-700 text-white' : 'bg-parchment-200 text-warm-muted'
                }`}
              >
                Data & Spreadsheets
              </button>
            </div>

            {/* Quick Add Preset Chips */}
            <div className="p-3 rounded-xl bg-parchment-100 dark:bg-night-100 border border-warm-border/60">
              <div className="text-[11px] font-bold text-warm-muted mb-2 uppercase">
                Tap to add common skills:
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySkillPresets[skillCategory].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetSkill(preset)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white dark:bg-night-card border border-warm-border hover:border-gold-400 text-warm-ink dark:text-night-ink"
                  >
                    <Plus className="w-3 h-3 text-maroon-700" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Added Skills with Self Rating */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wide">
                Your Added Skills ({selectedSkills.length}):
              </div>
              {selectedSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-night-card border border-warm-border/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-warm-ink dark:text-night-ink">{sk.name}</div>
                    {sk.nameTamil && <div className="font-tamil text-[10px] text-warm-muted">{sk.nameTamil}</div>}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Star Rating 1-5 */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleUpdateRating(idx, star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= sk.rating
                                ? 'fill-gold-400 text-gold-500'
                                : 'text-warm-border dark:text-night-border'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-terracotta-600 hover:text-terracotta-800 text-xs font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Skill Field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Type or speak a custom skill (e.g. Photoshop, Welding, Tamil typing)..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-parchment-100 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <VoiceInputButton
                onTranscript={(text) => setCustomSkillInput(text)}
                lang={voiceLang}
                size="sm"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2.5 rounded-xl bg-maroon-700 text-white text-xs font-bold shadow-xs hover:bg-maroon-800"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: HOURS PER DAY (VISUAL PICKER) */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                How much time can you commit each day?
              </h2>
              <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
                ஒரு நாளில் நீங்கள் எவ்வளவு நேரம் பயிற்சி செய்ய முடியும்?
              </div>
            </div>

            {/* Visual Time Picker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  mins: 15,
                  title: '15 mins / day',
                  titleTamil: '15 நிமிடங்கள் (Micro-habit)',
                  desc: 'Perfect for working artisans, busy parents, and micro-learners.',
                  pacing: '1 micro-challenge every 2 days'
                },
                {
                  mins: 30,
                  title: '30 mins / day',
                  titleTamil: '30 நிமிடங்கள் (Steady)',
                  desc: 'Recommended steady habit for college students and working pros.',
                  pacing: '1 core skill milestone per week'
                },
                {
                  mins: 60,
                  title: '60 mins / day',
                  titleTamil: '60 நிமிடங்கள் (Accelerated)',
                  desc: 'Fast-track transition into job placement and boutique contracts.',
                  pacing: 'Complete full pathway in 8-10 weeks'
                },
                {
                  mins: 120,
                  title: '120 mins / day',
                  titleTamil: '120 நிமிடங்கள் (Full-Time)',
                  desc: 'Intensive immersion for job seekers targeting next-month hiring.',
                  pacing: 'Complete pathway in 4-6 weeks'
                }
              ].map((timeOpt) => {
                const isSelected = dailyMinutes === timeOpt.mins;

                return (
                  <div
                    key={timeOpt.mins}
                    onClick={() => setDailyMinutes(timeOpt.mins)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-maroon-50 dark:bg-maroon-950/60 border-maroon-600 ring-2 ring-gold-400 shadow-warm-md scale-[1.02]'
                        : 'bg-parchment-100 dark:bg-night-100 border-warm-border hover:border-gold-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Clock className={`w-5 h-5 ${isSelected ? 'text-maroon-700 dark:text-gold-400' : 'text-warm-muted'}`} />
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-maroon-700 text-white">
                            Selected
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                        {timeOpt.title}
                      </h3>
                      <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                        {timeOpt.titleTamil}
                      </div>

                      <p className="text-xs text-warm-muted dark:text-night-muted mt-2 leading-relaxed">
                        {timeOpt.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-warm-border/50 text-[11px] font-semibold text-forest-700 dark:text-forest-400">
                      ✓ {timeOpt.pacing}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: WORK PREFERENCE (VISUAL CARDS) */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                What style of work excites you most?
              </h2>
              <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
                நீங்கள் விரும்பும் பணி பாணி எது?
              </div>
            </div>

            {/* 4 Work Style Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'technical' as const,
                  title: 'Technical & Engineering',
                  titleTamil: 'தொழில்நுட்பம் & மென்பொருள்',
                  desc: 'Building responsive web interfaces, coding clean algorithms, solving software logic.',
                  icon: Cpu,
                  tag: 'Academic Track'
                },
                {
                  id: 'creative' as const,
                  title: 'Creative & Fashion Craft',
                  titleTamil: 'ஆடை வடிவமைப்பு & கைவினை',
                  desc: 'Drafting garment patterns, precision tailoring, neckline piping, boutique finishing.',
                  icon: Palette,
                  tag: 'Vocational Craft'
                },
                {
                  id: 'business' as const,
                  title: 'Business & Analytics',
                  titleTamil: 'வணிகம் & தரவு பகுப்பாய்வு',
                  desc: 'SQL data queries, Excel Power Query automation, KPI reporting dashboards.',
                  icon: BarChart3,
                  tag: 'Business Track'
                },
                {
                  id: 'hands_on' as const,
                  title: 'Hands-on Trades & Electrical',
                  titleTamil: 'மின்சாரம் & களப்பணி',
                  desc: 'Conduit wiring, safety standards (IS 5216), solar installations, motor maintenance.',
                  icon: Wrench,
                  tag: 'Vocational Trade'
                }
              ].map((style) => {
                const isSelected = workPreference === style.id;
                const Icon = style.icon;

                return (
                  <div
                    key={style.id}
                    onClick={() => setWorkPreference(style.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-maroon-50 dark:bg-maroon-950/60 border-maroon-600 ring-2 ring-gold-400 shadow-warm-md scale-[1.02]'
                        : 'bg-parchment-100 dark:bg-night-100 border-warm-border hover:border-gold-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-xl bg-white dark:bg-night-card text-maroon-700 dark:text-gold-400 border border-warm-border/60">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950 text-gold-900 dark:text-gold-200">
                          {style.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                        {style.title}
                      </h3>
                      <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                        {style.titleTamil}
                      </div>

                      <p className="text-xs text-warm-muted dark:text-night-muted mt-2 leading-relaxed">
                        {style.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-2.5 border-t border-maroon-200 dark:border-maroon-800 text-[11px] font-bold text-maroon-700 dark:text-gold-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected as Primary Preference
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: AI SYNTHESIS & RECOMMENDATION */}
        {step === 6 && (
          <div className="space-y-6">
            {isSynthesizing ? (
              <div className="py-12">
                <AIThinking
                  labelEnglish="SkillBridge AI is interpreting your profile and tailoring your adaptive roadmap..."
                  labelTamil="உங்கள் விவரங்களை ஆய்வு செய்து வழிகாட்டி வரைபடத்தை AI உருவாக்குகிறது..."
                />
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-200 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                    <span>AI Pathway Recommendation</span>
                  </div>
                  <h2 className="text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                    We Recommend: {pathways.find(p => p.id === recommendedPathwayId)?.title}
                  </h2>
                  <div className="font-tamil text-sm text-warm-muted dark:text-night-muted">
                    {pathways.find(p => p.id === recommendedPathwayId)?.titleTamil}
                  </div>
                </div>

                {/* Primary Recommendation Card */}
                {(() => {
                  const rec = pathways.find(p => p.id === recommendedPathwayId) || pathways[0];
                  return (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-parchment-100 to-parchment-200 dark:from-night-card dark:to-night-100 border-2 border-gold-400 dark:border-gold-600 shadow-warm-md space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wide text-maroon-700 dark:text-gold-400">
                            {rec.category.toUpperCase()} TRACK
                          </span>
                          <h3 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                            {rec.title}
                          </h3>
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-600 text-white self-start sm:self-auto">
                          Best Match
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-warm-ink dark:text-night-ink leading-relaxed">
                        {rec.description}
                      </p>

                      {/* "Why this?" collapsible rationale */}
                      <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/30 border border-warm-border/60 text-xs space-y-1.5">
                        <div className="font-bold text-maroon-800 dark:text-gold-400 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" />
                          <span>Why this recommendation?</span>
                        </div>
                        <p className="text-warm-muted dark:text-night-muted leading-relaxed">
                          Tailored for <span className="font-semibold text-warm-ink dark:text-night-ink">{learnerName || 'you'}</span> with <span className="font-semibold text-warm-ink dark:text-night-ink">{dailyMinutes} mins/day</span> availability and a primary interest in <span className="font-semibold text-warm-ink dark:text-night-ink">{workPreference}</span> work. Aligns directly with {rec.targetRoles.join(', ')}.
                        </p>
                      </div>

                      {/* Target Roles */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-warm-muted uppercase">Target Jobs:</span>
                        {rec.targetRoles.map((role, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2.5 py-0.5 rounded-full text-[11px] bg-parchment-50 dark:bg-night-card border border-warm-border text-warm-ink dark:text-night-ink font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 2 Alternative Pathways */}
                <div>
                  <div className="text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-2">
                    Or Choose an Alternative Track:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pathways
                      .filter(p => p.id !== recommendedPathwayId)
                      .slice(0, 2)
                      .map((alt) => (
                        <div
                          key={alt.id}
                          onClick={() => setRecommendedPathwayId(alt.id)}
                          className="p-4 rounded-xl bg-parchment-100 dark:bg-night-100 border border-warm-border hover:border-gold-400 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase text-warm-muted">
                              {alt.category}
                            </span>
                            <span className="text-xs text-maroon-700 dark:text-gold-400 font-bold">
                              Switch Track →
                            </span>
                          </div>
                          <div className="font-bold text-sm text-warm-ink dark:text-night-ink">{alt.title}</div>
                          <div className="font-tamil text-[11px] text-warm-muted">{alt.titleTamil}</div>
                          <p className="text-[11px] text-warm-muted mt-1.5 line-clamp-2">{alt.tagline}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Confirm & Start Button */}
                <div className="pt-4">
                  <button
                    onClick={handleFinishOnboarding}
                    className="w-full py-3.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-extrabold text-sm shadow-warm-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>Start My Adaptive Pathway</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Footer */}
        {step < 6 && (
          <div className="mt-8 pt-6 border-t border-warm-border/60 dark:border-night-border/60 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-full border border-warm-border text-xs font-semibold text-warm-ink dark:text-night-ink hover:bg-parchment-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{step === 5 ? 'Generate My AI Pathway' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Prominent Privacy Note */}
      <div className="p-4 rounded-2xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/60 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-warm-ink dark:text-night-ink">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          <span>No login. No phone number. Stored only on your device.</span>
        </div>
        <p className="text-[11px] text-warm-muted dark:text-night-muted mt-0.5">
          Your answers remain private in browser localStorage. You can reset or change your preferences at any time.
        </p>
      </div>

      {/* Voice Settings Diagnostic Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </div>
  );
};
