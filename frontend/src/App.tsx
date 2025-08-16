import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { Dashboard } from './components/Dashboard';
import { PlanDesign } from './components/PlanDesign';
import { DataEntry } from './components/DataEntry';
import { List } from './components/List';
import { LifeEvents } from './components/LifeEvents';
import { FamilyManagement } from './components/FamilyManagement';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';

// 開発中のコンポーネント用プレースホルダー
const UnderDevelopment = ({ title }: { title: string }) => (
  <div className="h-full flex flex-col">
    <div className="p-4 border-b bg-white">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">この機能は開発中です</p>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">この機能は現在開発中です。<br />しばらくお待ちください。</p>
      </div>
    </div>
  </div>
);

// 家計簿（データ入力＋履歴統合）コンポーネント - 3分類対応
const HouseholdBook = () => {
  const [activeTab, setActiveTab] = useState('entry');
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-foreground">家計簿</h1>
        <p className="text-sm text-muted-foreground mt-1">収入・支出・貯蓄の取引入力と履歴管理</p>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="border-b">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('entry')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'entry'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              入力
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              履歴
            </button>
          </nav>
        </div>
        
        <div className="flex-1">
          {activeTab === 'entry' ? <DataEntry /> : <List />}
        </div>
      </div>
    </div>
  );
};

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
        return <Dashboard />;
      case 'plan-design':
        return <PlanDesign />;
      // 将来予測画面は削除 - 将来設計に統合済み
      case 'plan-comparison':
        return <UnderDevelopment title="プラン比較" />;
      case 'household-book':
        return <HouseholdBook />;
      case 'budget-monthly':
        return <UnderDevelopment title="予算管理" />;
      case 'variance-center':
        return <UnderDevelopment title="予算の見直し" />;
      case 'monthly-close':
        return <UnderDevelopment title="月締め" />;
      case 'settings':
        return <Settings />;
      case 'data-management':
        return <UnderDevelopment title="データ管理" />;
      // 旧メニューとの互換性維持
      case 'family':
        return <FamilyManagement />;
      case 'data-entry':
        return <DataEntry />;
      case 'list':
        return <List />;
      case 'future-cf': // 旧将来予測画面へのアクセスは将来設計へリダイレクト
        navigate('plan-design');
        return <PlanDesign />;
      case 'life-events':
        return <LifeEvents />;
      default:
        return <Dashboard />;
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