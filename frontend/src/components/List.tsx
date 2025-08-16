import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatCurrency } from '../utils/currency';
import { ChevronLeft, ChevronRight, Edit, Trash2, Filter, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// サンプル取引データ
const transactionData = [
  { id: 1, date: '2025/02/13', type: 'expense', category: '食費', paymentMethod: 'クレジットカード', amount: 2500, memo: 'スーパーでの買い物' },
  { id: 2, date: '2025/02/13', type: 'income', category: '給与', paymentMethod: '銀行振込', amount: 420000, memo: '2月分給与' },
  { id: 3, date: '2025/02/12', type: 'expense', category: '交通費', paymentMethod: '現金', amount: 800, memo: '電車代' },
  { id: 4, date: '2025/02/12', type: 'expense', category: '娯楽費', paymentMethod: 'デビットカード', amount: 1500, memo: '映画鑑賞' },
  { id: 5, date: '2025/02/11', type: 'expense', category: '食費', paymentMethod: 'クレジットカード', amount: 3200, memo: 'ランチ' },
  { id: 6, date: '2025/02/10', type: 'expense', category: '住居費', paymentMethod: '銀行振込', amount: 120000, memo: '家賃' },
  { id: 7, date: '2025/02/09', type: 'expense', category: '通信費', paymentMethod: 'クレジットカード', amount: 12000, memo: '携帯料金' },
  { id: 8, date: '2025/02/08', type: 'expense', category: '食費', paymentMethod: '現金', amount: 1800, memo: '夕食' },
  { id: 9, date: '2025/02/07', type: 'income', category: '副業', paymentMethod: '銀行振込', amount: 50000, memo: 'フリーランス収入' },
  { id: 10, date: '2025/02/06', type: 'expense', category: '娯楽費', paymentMethod: 'クレジットカード', amount: 4500, memo: '書籍購入' }
];

export function List() {
  const [selectedMonth, setSelectedMonth] = useState('2025/02');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // 月別データの計算
  const monthlyData = transactionData.filter(transaction => 
    transaction.date.startsWith(selectedMonth)
  );

  const totalIncome = monthlyData
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyData
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // フィルタリングとソート
  const filteredData = monthlyData
    .filter(transaction => {
      if (filterType === 'all') return true;
      return transaction.type === filterType;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (id: number) => {
    toast.info(`編集機能は未実装です（ID: ${id}）`);
  };

  const handleDelete = (id: number) => {
    toast.info(`削除機能は未実装です（ID: ${id}）`);
  };

  const handleExport = () => {
    toast.info('エクスポート機能は未実装です');
  };

  // 月の選択肢を生成（過去12ヶ月）
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      options.push({
        value: yearMonth,
        label: `${date.getFullYear()}年${date.getMonth() + 1}月`
      });
    }
    return options;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('/').map(Number);
    const currentDate = new Date(year, month - 1, 1);
    
    if (direction === 'prev') {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    const newYearMonth = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedMonth(newYearMonth);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">一覧</h1>
            <p className="text-sm text-muted-foreground mt-1">収入・支出の履歴を確認できます</p>
          </div>
          <Button variant="outline" onClick={handleExport} className="hidden md:flex">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* 月選択と操作 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* 月選択 */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* フィルタとソート */}
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="income">収入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">日付</SelectItem>
                <SelectItem value="amount">金額</SelectItem>
                <SelectItem value="category">カテゴリ</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* サマリカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">収入合計</p>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">支出合計</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">差額</p>
                  <p className={`text-xl font-semibold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 取引テーブル */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedMonth.replace('/', '年')}月の取引履歴</CardTitle>
            <p className="text-sm text-muted-foreground">{filteredData.length}件の取引</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日付</TableHead>
                    <TableHead>種別</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>支払い方法</TableHead>
                    <TableHead className="text-right">金額</TableHead>
                    <TableHead>メモ</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        データがありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">
                          {transaction.date}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                            {transaction.type === 'income' ? '収入' : '支出'}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-sm">{transaction.paymentMethod}</TableCell>
                        <TableCell className={`text-right font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="max-w-32 truncate text-sm">
                          {transaction.memo || '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transaction.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}