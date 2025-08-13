import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { formatCurrency, formatDate } from '../utils/currency';
import { toast } from 'sonner@2.0.3';

const categories = [
  '食費', '住居', '水道光熱', '通信', '教育', '医療', '税金', '保険', '投資', 'その他'
];

const paymentMethods = [
  '現金', '口座', 'クレカ', '電子'
];

const recentEntries = [
  { id: 1, date: '2025/01/12', type: '支出', category: '食費', amount: 1200, method: 'クレカ', memo: 'ランチ' },
  { id: 2, date: '2025/01/12', type: '支出', category: '交通', amount: 300, method: '電子', memo: '電車代' },
  { id: 3, date: '2025/01/11', type: '収入', category: '給与', amount: 250000, method: '口座', memo: '月給' },
  { id: 4, date: '2025/01/10', type: '支出', category: '食費', amount: 3500, method: 'クレカ', memo: '夕食' },
  { id: 5, date: '2025/01/10', type: '支出', category: '住居', amount: 120000, method: '口座', memo: '家賃' },
];

export function DataEntry() {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    amount: '',
    category: '',
    method: '',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.type || !formData.date || !formData.amount || !formData.category || !formData.method) {
      toast.error('必須項目を入力してください');
      return;
    }

    toast.success('データを保存しました');
    
    // Reset form
    setFormData({
      type: '',
      date: '',
      amount: '',
      category: '',
      method: '',
      memo: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-foreground">データ入力</h1>
        <p className="text-sm text-muted-foreground mt-1">収支データを記録してください</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Entry Form */}
          <div className="xl:col-span-2">
            <Card className="p-6 h-full">
              <h2 className="text-lg font-medium mb-6 text-foreground">収支入力</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">種別 *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">収入</SelectItem>
                        <SelectItem value="expense">支出</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">日付 *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">金額 *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        className="pl-8 text-right"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">カテゴリ *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">支払手段 *</Label>
                  <Select value={formData.method} onValueChange={(value) => handleChange('method', value)}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">メモ</Label>
                  <Textarea
                    id="memo"
                    placeholder="備考やメモを入力"
                    value={formData.memo}
                    onChange={(e) => handleChange('memo', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    保存
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setFormData({
                    type: '', date: '', amount: '', category: '', method: '', memo: ''
                  })}>
                    クリア
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Recent Entries */}
          <div className="xl:col-span-1">
            <Card className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-medium mb-4 text-foreground">直近の入力（5件）</h3>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="p-3 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-muted-foreground">{entry.date}</div>
                      <div className={`text-sm font-medium ${
                        entry.type === '収入' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === '収入' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">{entry.category}</span>
                      <span className="text-muted-foreground ml-2">({entry.method})</span>
                    </div>
                    {entry.memo && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">{entry.memo}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}