import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import MainLayout from './components/MainLayout';
import { DataEntry } from './components/DataEntry';
import { List } from './components/List';
import { FutureCF } from './components/FutureCF';
import { LifeEvents } from './components/LifeEvents';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const navigate = (route: string) => {
    setActiveRoute(route);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const renderCurrentView = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <MainLayout />;
      case 'data-entry':
        return <DataEntry />;
      case 'list':
        return <List />;
      case 'future-cf':
        return <FutureCF />;
      case 'life-events':
        return <LifeEvents />;
      case 'settings':
        return <Settings />;
        default:
          return <MainLayout />;
      }
    };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onMenuClick={toggleDrawer} />
      
      <div className="flex flex-1 pt-16 overflow-hidden relative">
        <SideDrawer 
          isOpen={isDrawerOpen} 
          onClose={closeDrawer}
          activeRoute={activeRoute}
          onNavigate={navigate}
        />
        
        {/* メインコンテンツは固定位置、サイドドロワーの影響を受けない */}
        <main className="flex-1 overflow-auto">
          <div className={`h-full transition-all duration-300 ${
            isDrawerOpen && !isMobile ? 'lg:pl-[280px]' : ''
          }`}>
            {renderCurrentView()}
          </div>
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}