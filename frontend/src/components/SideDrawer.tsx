import { X, Home, Target, GitCompare, BookOpen, Wallet, AlertTriangle, Lock, Settings, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const menuSections = [
  {
    title: 'ホーム',
    items: [
      { id: 'dashboard', label: 'ダッシュボード', icon: Home }
    ]
  },
  {
    title: 'ライフプラン',
    items: [
      { id: 'plan-design', label: '将来設計', icon: Target, description: '設計・分析統合' },
      { id: 'plan-comparison', label: 'プラン比較', icon: GitCompare, disabled: true }
    ]
  },
  {
    title: '家計管理',
    items: [
      { id: 'household-book', label: '家計簿', icon: BookOpen },
      { id: 'budget-monthly', label: '予算管理', icon: Wallet },
      { id: 'variance-center', label: '予算の見直し', icon: AlertTriangle, disabled: true },
      { id: 'monthly-close', label: '月締め', icon: Lock, disabled: true }
    ]
  },
  {
    title: 'システム',
    items: [
      { id: 'settings', label: '設定', icon: Settings },
      { id: 'data-management', label: 'データ管理', icon: Database, disabled: true }
    ]
  }
];

export function SideDrawer({ isOpen, onClose, activeRoute, onNavigate }: SideDrawerProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Drawer - 完全に固定位置 */}
      <div className={`
        fixed top-16 left-0 bottom-0 w-[280px] bg-white border-r border-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* モバイル用ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="font-semibold">メニュー</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* ナビゲーション */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {menuSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  {sectionIndex > 0 && <Separator className="mb-4" />}
                  
                  <div className="mb-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeRoute === item.id;
                      const isDisabled = item.disabled;
                      
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              if (!isDisabled) {
                                onNavigate(item.id);
                                // モバイルでのみドロワーを閉じる
                                if (window.innerWidth < 1024) {
                                  onClose();
                                }
                              }
                            }}
                            disabled={isDisabled}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                              ${isActive 
                                ? 'bg-[#2E7D32] text-white' 
                                : isDisabled 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }
                            `}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm">{item.label}</div>
                              {item.description && !isDisabled && (
                                <div className="text-xs opacity-75 truncate">{item.description}</div>
                              )}
                            </div>
                            {isDisabled && (
                              <span className="text-xs text-gray-400">開発中</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}