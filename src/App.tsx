import { useEffect, lazy, Suspense } from 'react';
import { AppLayout } from './components/AppLayout';
import { useSkillBridgeStore } from './store/useSkillBridgeStore';
import { ViewSkeleton } from './components/ViewSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GuidedDemoModal } from './components/GuidedDemo/GuidedDemoModal';

// Route Lazy-Loading for code-splitting and fast initial page loads
const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const RoadmapView = lazy(() => import('./views/RoadmapView').then(m => ({ default: m.RoadmapView })));
const SkillsView = lazy(() => import('./views/SkillsView').then(m => ({ default: m.SkillsView })));
const ChallengesView = lazy(() => import('./views/ChallengesView').then(m => ({ default: m.ChallengesView })));
const PassportView = lazy(() => import('./views/PassportView').then(m => ({ default: m.PassportView })));
const ReadinessView = lazy(() => import('./views/ReadinessView').then(m => ({ default: m.ReadinessView })));
const OpportunitiesView = lazy(() => import('./views/OpportunitiesView').then(m => ({ default: m.OpportunitiesView })));
const InterviewView = lazy(() => import('./views/InterviewView').then(m => ({ default: m.InterviewView })));
const CoachView = lazy(() => import('./views/CoachView').then(m => ({ default: m.CoachView })));
const ResumeView = lazy(() => import('./views/ResumeView').then(m => ({ default: m.ResumeView })));
const EmployerView = lazy(() => import('./views/EmployerView').then(m => ({ default: m.EmployerView })));
const InstitutionView = lazy(() => import('./views/InstitutionView').then(m => ({ default: m.InstitutionView })));
const OnboardingView = lazy(() => import('./views/OnboardingView').then(m => ({ default: m.OnboardingView })));
const GapAnalysisView = lazy(() => import('./views/GapAnalysisView').then(m => ({ default: m.GapAnalysisView })));
const ProgressView = lazy(() => import('./views/ProgressView').then(m => ({ default: m.ProgressView })));
const NotFoundView = lazy(() => import('./views/NotFoundView').then(m => ({ default: m.NotFoundView })));

const KNOWN_ROUTES = [
  'home',
  'onboarding',
  'gap-analysis',
  'roadmap',
  'skills',
  'challenges',
  'passport',
  'readiness',
  'opportunities',
  'interview',
  'coach',
  'resume',
  'employer',
  'institution',
  'progress',
  'streak'
];

export function App() {
  const { activeTab, setActiveTab, theme } = useSkillBridgeStore();

  // Listen to browser path on mount and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\//, '').split('/')[0];
        if (!path || path === '') {
          setActiveTab('home');
        } else if (path === 'onboarding') {
          setActiveTab('onboarding');
        } else if (path === 'gap-analysis') {
          setActiveTab('gap-analysis');
        } else if (path === 'challenges') {
          setActiveTab('challenges');
        } else if (path === 'streak' || path === 'progress') {
          setActiveTab('progress');
        } else if (KNOWN_ROUTES.includes(path)) {
          setActiveTab(path);
        } else {
          setActiveTab('404');
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [setActiveTab]);

  // Sync URL when tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let targetUrl = activeTab === 'home' ? '/' : `/${activeTab}`;
      if (activeTab === 'challenges' && window.location.pathname.startsWith('/challenges/')) {
        targetUrl = window.location.pathname;
      }
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingView />;
      case 'gap-analysis':
        return <GapAnalysisView />;
      case 'home':
        return <HomeView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'skills':
        return <SkillsView />;
      case 'challenges':
        return <ChallengesView />;
      case 'passport':
        return <PassportView />;
      case 'readiness':
        return <ReadinessView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'interview':
        return <InterviewView />;
      case 'resume':
        return <ResumeView />;
      case 'employer':
        return <EmployerView />;
      case 'institution':
        return <InstitutionView />;
      case 'progress':
      case 'streak':
        return <ProgressView />;
      case 'coach':
        return <CoachView />;
      case '404':
        return <NotFoundView />;
      default:
        return <NotFoundView />;
    }
  };

  return (
    <ErrorBoundary>
      <AppLayout>
        <Suspense fallback={<ViewSkeleton />}>
          {renderActiveView()}
        </Suspense>
      </AppLayout>
      <GuidedDemoModal />
    </ErrorBoundary>
  );
}

export default App;

