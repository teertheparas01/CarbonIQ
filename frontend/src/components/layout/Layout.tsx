import { Outlet, useOutletContext, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Header } from './Header';
import { PageContainer } from './PageContainer';
import { AnimatedGradientBackground } from '../AnimatedGradientBackground';

const PAGE_META: Record<string, { title: string; description?: string }> = {
  '/': { title: 'Dashboard', description: 'Overview of your carbon footprint and forecasts' },
  '/electricity': { title: 'Electricity', description: 'Electricity consumption, forecasting, and CO₂ estimation' },
  '/lpg': { title: 'LPG', description: 'LPG consumption and context (CO₂ calculation not available)' },
  '/water': { title: 'Water', description: 'Water consumption and context (CO₂ calculation not available)' },
  '/food': { title: 'Food', description: 'Food consumption and context (CO₂ calculation not available)' },
  '/transport': { title: 'Transport', description: 'Vehicle ownership data (no CO₂ calculation — insufficient travel data)' },
  '/forecast': { title: 'Forecast', description: 'Next-month electricity forecast and carbon estimation' },
  '/todo-not-todo': { title: "Do's & Don'ts", description: 'Actionable recommendations for reducing emissions' },
  '/settings': { title: 'Settings', description: 'View model and emission factor configuration' },
};

function getPageMeta(pathname: string) {
  return PAGE_META[pathname] || { title: 'CarbonIQ' };
}

function PageHeader() {
  const { location } = useOutletContext<{ location: { pathname: string } }>();
  const { title, description } = getPageMeta(location?.pathname || '/');

  return <Header title={title} description={description} />;
}


export function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col relative">
      <AnimatedGradientBackground />
      <TopNav />
      <div className={`flex-1 flex flex-col min-w-0 ${isLanding ? 'pt-0' : 'pt-24'}`}>
        {isLanding ? (
          <Outlet />
        ) : (
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
}

export function PageLayout() {
  return (
    <>
      <PageHeader />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}