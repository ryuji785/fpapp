import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatCurrency } from '../utils/currency';
import { Calendar, DollarSign, Plus } from 'lucide-react';
import { toast } from 'sonner';

const sampleEvents = [
  {
    id: 1,
    name: '結婚',
    date: '2025/06',
    cost: 2500000,
    type: '単発',
    memo: '結婚式、新婚旅行費用',
    category: 'ライフイベント'
  },
  {
    id: 2,
    name: '車購入',
    date: '2025/09',
    cost: 3000000,
    type: '単発',
    memo: 'ファミリーカー購入',
    category: '交通'
  },
  {
    id: 3,
    name: '第一子出産',
    date: '2026/04',
    cost: 500000,
    type: '単発',
    memo: '出産費用、ベビー用品',
    category: 'ライフイベント'
  },
  {
    id: 4,
    name: '住宅購入',
    date: '2027/03',
    cost: 40000000,
    type: '分割',
    memo: 'マンション購入（住宅ローン）',
    category: '住居'
  },
  {
    id: 5,
    name: '子供の大学進学',
    date: '2044/04',
    cost: 8000000,
    type: '分割',
    memo: '私立大学4年間の学費',
    category: '教育'
  }
];

export function LifeEvents() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    cost: '',
    type: '',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.cost || !formData.type) {
      toast.error('必須項目を入力してください');
      return;
    }

    toast.success('ライフイベントを追加しました');
    
    // Reset form
    setFormData({
      name: '',
      date: '',
      cost: '',
      type: '',
      memo: ''
    });
    setIsAddingEvent(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sortedEvents = [...sampleEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-full p-4 space-y-4">
      {/* Add Event Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ライフイベント管理</h2>
        <Button 
          onClick={() => setIsAddingEvent(!isAddingEvent)}
          className="bg-[#2E7D32] hover:bg-[#1B5E20]"
        >
          <Plus className="h-4 w-4 mr-2" />
          イベント追加
        </Button>
      </div>

      {/* Add Event Form */}
      {isAddingEvent && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">新しいライフイベント</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventName">イベント名 *</Label>
                <Input
                  id="eventName"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="例: 結婚、住宅購入"
                />
              </div>
              
              <div>
                <Label htmlFor="eventDate">時期 *</Label>
                <Input
                  id="eventDate"
                  type="month"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventCost">費用 *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="eventCost"
                    type="number"
                    className="pl-8"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="eventType">支払タイプ *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">単発</SelectItem>
                    <SelectItem value="installment">分割</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="eventMemo">メモ</Label>
              <Textarea
                id="eventMemo"
                value={formData.memo}
                onChange={(e) => handleChange('memo', e.target.value)}
                placeholder="詳細や備考を入力"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                追加
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingEvent(false)}>
                キャンセル
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Timeline */}
      <Card className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-6">ライフイベントタイムライン</h3>
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index !== sortedEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300" />
              )}
              
              {/* Event card */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2E7D32] rounded-full flex items-center justify-center text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                
                <Card className="flex-1 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{event.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(event.date).toLocaleDateString('ja-JP', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600">費用</div>
                      <div className="font-semibold text-lg text-red-600">
                        {formatCurrency(event.cost)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({event.type})
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600">メモ</div>
                      <div className="text-sm mt-1">{event.memo}</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}