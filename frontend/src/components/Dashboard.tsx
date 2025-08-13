import { useState } from 'react';
import { DashboardPanel } from './DashboardPanel';
import { formatCurrency } from '../utils/currency';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const monthlyData = {
  income: 420000,
  expense: 310000,
  difference: 110000,
  budget: 350000,
  budgetUsed: 310000
};

const categoryData = [
  { name: '食費', value: 68200, percentage: 22, color: '#2E7D32' },
  { name: '住居', value: 93000, percentage: 30, color: '#388E3C' },
  { name: '水道光熱', value: 24800, percentage: 8, color: '#43A047' },
  { name: '通信', value: 18600, percentage: 6, color: '#4CAF50' },
  { name: '保険', value: 21700, percentage: 7, color: '#66BB6A' },
  { name: '教育', value: 31000, percentage: 10, color: '#81C784' },
  { name: 'その他', value: 52700, percentage: 17, color: '#A5D6A7' }
];

const creditCardData = [
  { name: '楽天カード', amount: 58240, paymentDate: '27日' },
  { name: '三井住友', amount: 42110, paymentDate: '04日' }
];

export function Dashboard() {
  const [panels, setPanels] = useState({
    summary: true,
    category: true,
    credit: true
  });

  const closePanel = (panelName: keyof typeof panels) => {
    setPanels(prev => ({ ...prev, [panelName]: false }));
  };

  const budgetProgress = (monthlyData.budgetUsed / monthlyData.budget) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-foreground">ダッシュボード</h1>
        <p className="text-sm text-muted-foreground mt-1">今月の収支状況をご確認いただけます</p>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Summary Panel */}
          {panels.summary && (
            <div className="lg:col-span-1">
              <DashboardPanel 
                title="今月のサマリ" 
                onClose={() => closePanel('summary')}
                className="h-full"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">収入</div>
                      <div className="text-xl font-semibold text-green-700">
                        {formatCurrency(monthlyData.income)}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm text-red-600 mb-1">支出</div>
                      <div className="text-xl font-semibold text-red-700">
                        {formatCurrency(monthlyData.expense)}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">差額</div>
                      <div className="text-xl font-semibold text-blue-700">
                        {formatCurrency(monthlyData.difference)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">予算進捗</div>
                    <Progress value={budgetProgress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{formatCurrency(monthlyData.budgetUsed)}</span>
                      <span>{budgetProgress.toFixed(1)}%</span>
                      <span>{formatCurrency(monthlyData.budget)}</span>
                    </div>
                  </div>
                </div>
              </DashboardPanel>
            </div>
          )}

          {/* Category Breakdown Panel */}
          {panels.category && (
            <div className="lg:col-span-1">
              <DashboardPanel 
                title="カテゴリ内訳" 
                onClose={() => closePanel('category')}
                className="h-full"
              >
                <div className="space-y-4">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="truncate">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-muted-foreground">{category.percentage}%</span>
                          <span className="font-medium min-w-[80px]">{formatCurrency(category.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DashboardPanel>
            </div>
          )}

          {/* Credit Card Panel */}
          {panels.credit && (
            <div className="lg:col-span-1">
              <DashboardPanel 
                title="今月のクレカ請求" 
                onClose={() => closePanel('credit')}
                className="h-full"
              >
                <div className="space-y-4">
                  {creditCardData.map((card) => (
                    <Card key={card.name} className="p-4 border">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-foreground">{card.name}</div>
                          <div className="text-sm text-muted-foreground">支払日: {card.paymentDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">
                            {formatCurrency(card.amount)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">合計請求額</span>
                      <span className="font-semibold text-lg text-red-600">
                        {formatCurrency(creditCardData.reduce((sum, card) => sum + card.amount, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </DashboardPanel>
            </div>
          )}
        </div>

        {/* Responsive fallback for closed panels */}
        {(!panels.summary && !panels.category && !panels.credit) && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>すべてのパネルが閉じられています</p>
              <p className="text-sm mt-1">パネルを復元するには、設定から有効にしてください</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}