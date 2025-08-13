import { X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function DashboardPanel({ title, children, onClose, className = '' }: DashboardPanelProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 rounded-t-lg">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </Card>
  );
}