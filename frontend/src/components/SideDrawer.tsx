import { X, BarChart3, PlusCircle, List, TrendingUp, Calendar, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: BarChart3 },
  { id: 'data-entry', label: 'データ入力', icon: PlusCircle },
  { id: 'list', label: '一覧', icon: List },
  { id: 'future-cf', label: '将来CF', icon: TrendingUp },
  { id: 'life-events', label: 'ライフイベント', icon: Calendar },
  { id: 'settings', label: '設定', icon: Settings },
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
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        // モバイルでのみドロワーを閉じる
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-[#2E7D32] text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}