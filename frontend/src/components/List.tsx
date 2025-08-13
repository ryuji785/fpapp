import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatCurrency } from '../utils/currency';
import { Edit, Trash2 } from 'lucide-react';

const sampleData = [
  { id: 1, date: '2025/01/15', type: '支出', category: '食費', method: 'クレカ', amount: 1200, memo: 'ランチ' },
  { id: 2, date: '2025/01/15', type: '支出', category: '交通', method: '電子', amount: 300, memo: '電車代' },
  { id: 3, date: '2025/01/14', type: '収入', category: '給与', method: '口座', amount: 250000, memo: '月給' },
  { id: 4, date: '2025/01/14', type: '支出', category: '食費', method: 'クレカ', amount: 3500, memo: '夕食外食' },
  { id: 5, date: '2025/01/13', type: '支出', category: '住居', method: '口座', amount: 120000, memo: '家賃' },
  { id: 6, date: '2025/01/12', type: '支出', category: '水道光熱', method: '口座', amount: 8500, memo: '電気代' },
  { id: 7, date: '2025/01/11', type: '支出', category: '通信', method: 'クレカ', amount: 6500, memo: '携帯代' },
  { id: 8, date: '2025/01/10', type: '支出', category: '食費', method: '現金', amount: 800, memo: '朝食' },
];

export function List() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  
  const totalIncome = sampleData.filter(item => item.type === '収入').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = sampleData.filter(item => item.type === '支出').reduce((sum, item) => sum + item.amount, 0);
  const difference = totalIncome - totalExpense;

  return (
    <div className="h-full p-4 space-y-4">
      {/* Month Selection */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="month">表示月</Label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Summary Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">収入合計</div>
            <div className="text-lg font-semibold text-green-700">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600">支出合計</div>
            <div className="text-lg font-semibold text-red-700">
              {formatCurrency(totalExpense)}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">差額</div>
            <div className={`text-lg font-semibold ${difference >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {formatCurrency(difference)}
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="flex-1 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">収支一覧</h3>
        </div>
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>支払手段</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead>メモ</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === '収入' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell className={`text-right font-semibold ${
                    item.type === '収入' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.type === '収入' ? '+' : '-'}{formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell className="max-w-32 truncate">{item.memo}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}