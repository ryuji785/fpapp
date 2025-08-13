import { Menu, User, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const currentTime = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#2E7D32] text-white flex items-center px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-white hover:bg-white/10"
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <div className="flex-1 text-center">
        <h1 className="text-xl font-semibold">FPApp</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span>User</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}