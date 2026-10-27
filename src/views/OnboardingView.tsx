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
      <div className="p-4 sm:p-6 rounded-card bg-white border border-[#E2E8F0] shadow-soft">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] uppercase tracking-wider">
              Step {step} of 5
            </span>
            <span className="text-xs font-semibold text-[#526174]">
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
              className="px-2.5 py-1 rounded-btn text-xs font-semibold bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-[#173B67]" />
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
        <div className="h-2.5 w-full bg-[#EAF5FC] rounded-full overflow-hidden p-0.5 border border-[#BAE6FD]">
          <div
            className="h-full bg-gradient-to-r from-[#173B67] via-[#62B6E8] to-[#10B981] rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div id="onboarding-voice-section" className="p-6 sm:p-8 rounded-card bg-white border border-[#E2E8F0] shadow-soft">
        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#173B67]">
                What is your name?
              </h2>
              <div className="font-tamil text-sm text-[#526174] mt-0.5">
                உங்கள் பெயர் என்ன? (குரல் வழி உள்ளீடும் செய்யலாம்)
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B67] mb-1.5 uppercase tracking-wide">
                  Your Full Name (English)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    placeholder="e.g. Priya Soundararajan or Lakshmi Arumugam"
                    className="flex-1 px-4 py-3 rounded-btn text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8] font-medium"
                  />
                  <VoiceInputButton
                    onTranscript={(text) => setLearnerName(text)}
                    lang={voiceLang}
                    onLangChange={setVoiceLang}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173B67] mb-1.5 uppercase tracking-wide">
                  Tamil Name (Optional / தமிழில் பெயர்)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={learnerTamilName}
                    onChange={(e) => setLearnerTamilName(e.target.value)}
                    placeholder="எ.கா. பிரியா அல்லது லட்சுமி"
                    className="flex-1 px-4 py-3 rounded-btn text-sm font-tamil bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
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
              <h2 className="text-2xl font-bold text-[#173B67]">
                What is your main career or learning goal?
              </h2>
              <div className="font-tamil text-sm text-[#526174] mt-0.5">
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
                  className={`p-4 rounded-btn text-left border transition-all cursor-pointer ${
                    goal === qg.title
                      ? 'bg-[#EAF5FC] border-[#62B6E8] ring-2 ring-[#62B6E8]/30 shadow-soft'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#62B6E8]'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-[#173B67]">
                    {qg.title}
                  </div>
                  <div className="font-tamil text-xs text-[#526174] mt-1">
                    {qg.tamil}
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173B67] mb-1.5 uppercase tracking-wide">
                Or Type / Speak Your Custom Goal
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master React and get a job in Coimbatore tech park..."
                  className="flex-1 px-4 py-3 rounded-btn text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8] font-medium"
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
              <h2 className="text-2xl font-bold text-[#173B67]">
                Select Your Existing Skills & Self-Rating
              </h2>
              <div className="font-tamil text-sm text-[#526174] mt-0.5">
                உங்களுக்கு ஏற்கனவே தெரிந்த திறன்களை தேர்வு செய்யவும் (1 முதல் 5 நட்சத்திரம்)
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSkillCategory('tech')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  skillCategory === 'tech' ? 'bg-[#173B67] text-white shadow-sm ring-2 ring-[#62B6E8]' : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EEFA]'
                }`}
              >
                Web & Software
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('tailor')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  skillCategory === 'tailor' ? 'bg-[#173B67] text-white shadow-sm ring-2 ring-[#62B6E8]' : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EEFA]'
                }`}
              >
                Tailoring & Textiles
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('elec')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  skillCategory === 'elec' ? 'bg-[#173B67] text-white shadow-sm ring-2 ring-[#62B6E8]' : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EEFA]'
                }`}
              >
                Electrical Wiring
              </button>
              <button
                type="button"
                onClick={() => setSkillCategory('data')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  skillCategory === 'data' ? 'bg-[#173B67] text-white shadow-sm ring-2 ring-[#62B6E8]' : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EEFA]'
                }`}
              >
                Data & Spreadsheets
              </button>
            </div>

            {/* Quick Add Preset Chips */}
            <div className="p-3 rounded-card bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[11px] font-bold text-[#526174] mb-2 uppercase">
                Tap to add common skills:
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySkillPresets[skillCategory].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetSkill(preset)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white border border-[#E2E8F0] hover:border-[#62B6E8] text-[#173B67]"
                  >
                    <Plus className="w-3 h-3 text-[#173B67]" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Added Skills with Self Rating */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-[#173B67] uppercase tracking-wide">
                Your Added Skills ({selectedSkills.length}):
              </div>
              {selectedSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-btn bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#173B67]">{sk.name}</div>
                    {sk.nameTamil && <div className="font-tamil text-[10px] text-[#526174]">{sk.nameTamil}</div>}
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
                                ? 'fill-[#F2B66D] text-[#F2B66D]'
                                : 'text-[#CBD5E1]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold ml-1"
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
                className="flex-1 px-4 py-2.5 rounded-btn text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
              />
              <VoiceInputButton
                onTranscript={(text) => setCustomSkillInput(text)}
                lang={voiceLang}
                size="sm"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] text-xs font-semibold shadow-soft"
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
              <h2 className="text-2xl font-bold text-[#173B67]">
                How much time can you commit each day?
              </h2>
              <div className="font-tamil text-sm text-[#526174] mt-0.5">
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
                    className={`p-5 rounded-card border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EAF5FC] border-[#62B6E8] ring-2 ring-[#62B6E8]/30 shadow-soft scale-[1.02]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#62B6E8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Clock className={`w-5 h-5 ${isSelected ? 'text-[#173B67]' : 'text-[#526174]'}`} />
                        {isSelected && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#62B6E8] text-[#173B67]">
                            Selected
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#173B67]">
                        {timeOpt.title}
                      </h3>
                      <div className="font-tamil text-xs text-[#526174]">
                        {timeOpt.titleTamil}
                      </div>

                      <p className="text-xs text-[#526174] mt-2 leading-relaxed">
                        {timeOpt.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#E2E8F0] text-[11px] font-semibold text-emerald-700">
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
              <h2 className="text-2xl font-bold text-[#173B67]">
                What style of work excites you most?
              </h2>
              <div className="font-tamil text-sm text-[#526174] mt-0.5">
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
                    className={`p-5 rounded-card border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EAF5FC] border-[#62B6E8] ring-2 ring-[#62B6E8]/30 shadow-soft scale-[1.02]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#62B6E8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-btn bg-white text-[#173B67] border border-[#E2E8F0]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67]">
                          {style.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#173B67]">
                        {style.title}
                      </h3>
                      <div className="font-tamil text-xs text-[#526174]">
                        {style.titleTamil}
                      </div>

                      <p className="text-xs text-[#526174] mt-2 leading-relaxed">
                        {style.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-2.5 border-t border-[#BAE6FD] text-[11px] font-bold text-[#173B67] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Pathway Recommendation</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#173B67]">
                    We Recommend: {pathways.find(p => p.id === recommendedPathwayId)?.title}
                  </h2>
                  <div className="font-tamil text-sm text-[#526174]">
                    {pathways.find(p => p.id === recommendedPathwayId)?.titleTamil}
                  </div>
                </div>

                {/* Primary Recommendation Card */}
                {(() => {
                  const rec = pathways.find(p => p.id === recommendedPathwayId) || pathways[0];
                  return (
                    <div className="p-6 rounded-card bg-gradient-to-br from-white via-[#EAF5FC]/60 to-white border-2 border-[#62B6E8] shadow-soft space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wide text-[#173B67]">
                            {rec.category.toUpperCase()} TRACK
                          </span>
                          <h3 className="text-xl font-extrabold text-[#173B67]">
                            {rec.title}
                          </h3>
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#10B981] text-white self-start sm:self-auto shadow-xs">
                          Best Match
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#173B67] leading-relaxed">
                        {rec.description}
                      </p>

                      {/* "Why this?" collapsible rationale */}
                      <div className="p-3.5 rounded-btn bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5">
                        <div className="font-bold text-[#173B67] flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-[#62B6E8]" />
                          <span>Why this recommendation?</span>
                        </div>
                        <p className="text-[#526174] leading-relaxed">
                          Tailored for <span className="font-semibold text-[#173B67]">{learnerName || 'you'}</span> with <span className="font-semibold text-[#173B67]">{dailyMinutes} mins/day</span> availability and a primary interest in <span className="font-semibold text-[#173B67]">{workPreference}</span> work. Aligns directly with {rec.targetRoles.join(', ')}.
                        </p>
                      </div>

                      {/* Target Roles */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-[#526174] uppercase">Target Jobs:</span>
                        {rec.targetRoles.map((role, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2.5 py-0.5 rounded-full text-[11px] bg-white border border-[#E2E8F0] text-[#173B67] font-medium"
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
                  <div className="text-xs font-bold text-[#173B67] uppercase tracking-wider mb-2">
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
                          className="p-4 rounded-card bg-white border border-[#E2E8F0] hover:border-[#62B6E8] hover:shadow-soft cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase text-[#526174]">
                              {alt.category}
                            </span>
                            <span className="text-xs text-[#173B67] font-bold">
                              Switch Track →
                            </span>
                          </div>
                          <div className="font-bold text-sm text-[#173B67]">{alt.title}</div>
                          <div className="font-tamil text-[11px] text-[#526174]">{alt.titleTamil}</div>
                          <p className="text-[11px] text-[#526174] mt-1.5 line-clamp-2">{alt.tagline}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Confirm & Start Button */}
                <div className="pt-4">
                  <button
                    onClick={handleFinishOnboarding}
                    className="w-full py-3.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-extrabold text-sm shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-btn border border-[#E2E8F0] text-xs font-semibold text-[#526174] hover:text-[#173B67] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
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
              className="px-6 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] text-xs font-bold shadow-soft flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{step === 5 ? 'Generate My AI Pathway' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Prominent Privacy Note */}
      <div className="p-4 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#173B67]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No login. No phone number. Stored only on your device.</span>
        </div>
        <p className="text-[11px] text-[#526174] mt-0.5">
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
