import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { formatCurrency } from '../utils/currency';
import { Calendar, Plus, Baby, Home, GraduationCap, Heart, Car, MapPin, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// ライフイベントのサンプルデータ
const lifeEvents = [
  {
    id: 1,
    name: '結婚',
    date: '2026/06',
    cost: 2500000,
    paymentType: '単発',
    memo: '結婚式・新婚旅行費用',
    category: 'personal',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700'
  },
  {
    id: 2,
    name: '第一子出産',
    date: '2028/03',
    cost: 500000,
    paymentType: '単発',
    memo: '出産費用・ベビー用品',
    category: 'family',
    icon: Baby,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 3,
    name: 'マイホーム購入',
    date: '2030/04',
    cost: 40000000,
    paymentType: '分割',
    memo: '頭金・諸費用（35年ローン）',
    category: 'property',
    icon: Home,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 4,
    name: '車買い替え',
    date: '2032/09',
    cost: 3500000,
    paymentType: '単発',
    memo: 'ファミリーカーに買い替え',
    category: 'asset',
    icon: Car,
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: 5,
    name: '子どもの大学進学',
    date: '2043/04',
    cost: 8000000,
    paymentType: '分割',
    memo: '入学金・授業料（4年間）',
    category: 'education',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 6,
    name: '海外旅行',
    date: '2035/08',
    cost: 1200000,
    paymentType: '単発',
    memo: '家族でヨーロッパ旅行',
    category: 'leisure',
    icon: MapPin,
    color: 'bg-indigo-100 text-indigo-700'
  }
];

const eventCategories = [
  { value: 'personal', label: '個人・結婚' },
  { value: 'family', label: '家族・出産' },
  { value: 'property', label: '住宅・不動産' },
  { value: 'education', label: '教育' },
  { value: 'asset', label: '資産・車' },
  { value: 'leisure', label: '旅行・娯楽' },
  { value: 'other', label: 'その他' }
];

export function LifeEvents() {
  const [events, setEvents] = useState(lifeEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<typeof lifeEvents[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    cost: '',
    paymentType: '',
    memo: '',
    category: ''
  });

  // イベントを年月順でソート
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  // 年別にグループ化
  const eventsByYear = sortedEvents.reduce((acc, event) => {
    const year = event.date.split('/')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.date || !formData.cost || !formData.paymentType || !formData.category) {
      toast.error('必須項目を入力してください');
      return;
    }

    const categoryData = eventCategories.find(cat => cat.value === formData.category);
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      name: formData.name,
      date: formData.date,
      cost: parseInt(formData.cost),
      paymentType: formData.paymentType,
      memo: formData.memo,
      category: formData.category,
      icon: Calendar, // デフォルトアイコン
      color: 'bg-gray-100 text-gray-700' // デフォルト色
    };

    if (editingEvent) {
      setEvents(prev => prev.map(event => event.id === editingEvent.id ? newEvent : event));
      toast.success('ライフイベントを更新しました');
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast.success('ライフイベントを追加しました');
    }

    handleCloseDialog();
  };

  const handleEdit = (event: typeof lifeEvents[0]) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      cost: event.cost.toString(),
      paymentType: event.paymentType,
      memo: event.memo,
      category: event.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('ライフイベントを削除しました');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      date: '',
      cost: '',
      paymentType: '',
      memo: '',
      category: ''
    });
  };

  // 総コスト計算
  const totalCost = events.reduce((sum, event) => sum + event.cost, 0);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">ライフイベント</h1>
            <p className="text-sm text-muted-foreground mt-1">将来の大きな支出を計画・管理できます</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                イベント追加
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'ライフイベント編集' : '新規ライフイベント追加'}</DialogTitle>
                <DialogDescription>
                  将来の大きな支出イベントを追加して、長期的な資金計画を立てましょう。
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">イベント名 *</Label>
                  <Input
                    id="eventName"
                    placeholder="例: マイホーム購入"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">年月 *</Label>
                  <Input
                    id="eventDate"
                    type="month"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventCost">費用 *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                    <Input
                      id="eventCost"
                      type="number"
                      className="pl-8"
                      placeholder="0"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentType">支払タイプ *</Label>
                  <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="支払タイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="単発">単発</SelectItem>
                      <SelectItem value="分割">分割</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventMemo">メモ</Label>
                  <Textarea
                    id="eventMemo"
                    placeholder="詳細情報やメモを入力（任意）"
                    className="resize-none"
                    rows={3}
                    value={formData.memo}
                    onChange={(e) => handleInputChange('memo', e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  キャンセル
                </Button>
                <Button onClick={handleSave}>
                  {editingEvent ? '更新' : '追加'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側: サマリ情報 */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">概要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">総イベント数</div>
                  <div className="text-2xl font-semibold text-blue-700">{events.length}</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-600 mb-1">今後の予定</div>
                  <div className="text-2xl font-semibold text-orange-700">{upcomingEvents}</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">総費用予定</div>
                  <div className="text-lg font-semibold text-purple-700">
                    {formatCurrency(totalCost)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* カテゴリ別集計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">カテゴリ別</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {eventCategories.map(category => {
                    const categoryEvents = events.filter(e => e.category === category.value);
                    const categoryTotal = categoryEvents.reduce((sum, e) => sum + e.cost, 0);
                    
                    if (categoryEvents.length === 0) return null;
                    
                    return (
                      <div key={category.value} className="flex justify-between items-center text-sm">
                        <span>{category.label}</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(categoryTotal)}</div>
                          <div className="text-xs text-muted-foreground">{categoryEvents.length}件</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: タイムライン */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  ライフイベントタイムライン
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(eventsByYear)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([year, yearEvents]) => (
                      <div key={year}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {year}年
                          </div>
                          <div className="flex-1 h-px bg-border"></div>
                        </div>
                        
                        <div className="space-y-3 ml-4">
                          {yearEvents.map((event) => {
                            const Icon = event.icon;
                            const isUpcoming = new Date(event.date) > new Date();
                            
                            return (
                              <div 
                                key={event.id} 
                                className={`flex items-start gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow ${
                                  isUpcoming ? 'bg-white' : 'bg-gray-50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium">{event.name}</h4>
                                      <p className="text-sm text-muted-foreground">{event.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">
                                        {event.paymentType}
                                      </Badge>
                                      <div className="text-right">
                                        <div className="font-semibold">{formatCurrency(event.cost)}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {event.memo && (
                                    <p className="text-sm text-muted-foreground mb-2">{event.memo}</p>
                                  )}
                                  
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  
                  {events.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>ライフイベントが登録されていません</p>
                      <p className="text-sm">「イベント追加」ボタンから追加してください</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}