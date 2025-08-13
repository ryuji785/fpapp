import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/currency';

// 短期（月次）データ - 12ヶ月分
const shortTermData = [
  { month: '2025/02', income: 420000, fixedExpense: 280000, variableExpense: 35000, savings: 105000, cumulative: 105000 },
  { month: '2025/03', income: 428400, fixedExpense: 285600, variableExpense: 35700, savings: 107100, cumulative: 212100 },
  { month: '2025/04', income: 436968, fixedExpense: 291312, variableExpense: 36414, savings: 109242, cumulative: 321342 },
  { month: '2025/05', income: 445707, fixedExpense: 297138, variableExpense: 37142, savings: 111427, cumulative: 432769 },
  { month: '2025/06', income: 454621, fixedExpense: 303081, variableExpense: 37885, savings: 113655, cumulative: 546424 },
  { month: '2025/07', income: 463714, fixedExpense: 309143, variableExpense: 38643, savings: 115928, cumulative: 662352 },
  { month: '2025/08', income: 472988, fixedExpense: 315326, variableExpense: 39416, savings: 118246, cumulative: 780598 },
  { month: '2025/09', income: 482448, fixedExpense: 321632, variableExpense: 40205, savings: 120611, cumulative: 901209 },
  { month: '2025/10', income: 492097, fixedExpense: 328064, variableExpense: 41009, savings: 123024, cumulative: 1024233 },
  { month: '2025/11', income: 501939, fixedExpense: 334625, variableExpense: 41829, savings: 125485, cumulative: 1149718 },
  { month: '2025/12', income: 511978, fixedExpense: 341318, variableExpense: 42665, savings: 127995, cumulative: 1277713 },
  { month: '2026/01', income: 522218, fixedExpense: 348144, variableExpense: 43518, savings: 130556, cumulative: 1408269 },
];

// ライフイベントの定義
const lifeEvents = [
  { year: 1, name: '結婚', cost: 2500000, color: 'blue' },
  { year: 3, name: '出産', cost: 500000, color: 'green' },
  { year: 5, name: '住宅購入', cost: 40000000, color: 'purple' },
  { year: 18, name: '教育費', cost: 8000000, color: 'orange' },
];

export function FutureCF() {
  const [activeTab, setActiveTab] = useState('short-term');
  const [planYears, setPlanYears] = useState(20); // 可変年数設定
  const [settings, setSettings] = useState({
    fixedIncome: '420000',
    fixedExpense: '280000',
    variableExpense: '35000',
    inflationRate: '1.8',
    incomeGrowthRate: '2.0'
  });

  // 動的に長期データを生成
  const longTermData = useMemo(() => {
    return Array.from({ length: planYears }, (_, i) => {
      const year = 2025 + i;
      const baseIncome = 5000000;
      const baseExpense = 3500000;
      
      // ライフイベントコストを計算（設定年数内のイベントのみ）
      const lifeEventCost = lifeEvents
        .filter(event => event.year === i + 1 && event.year <= planYears)
        .reduce((sum, event) => sum + event.cost, 0);
      
      const income = Math.round(baseIncome * Math.pow(1.02, i));
      const expense = Math.round(baseExpense * Math.pow(1.018, i));
      const savings = income - expense - lifeEventCost;
      
      // 累積資産を計算
      const cumulative = Array.from({ length: i + 1 }, (_, j) => {
        const yearIncome = baseIncome * Math.pow(1.02, j);
        const yearExpense = baseExpense * Math.pow(1.018, j);
        const yearLifeEvent = lifeEvents
          .filter(event => event.year === j + 1 && event.year <= planYears)
          .reduce((sum, event) => sum + event.cost, 0);
        return yearIncome - yearExpense - yearLifeEvent;
      }).reduce((sum, val) => sum + val, 0);
      
      return {
        year: year.toString(),
        income,
        livingExpense: expense,
        lifeEvent: lifeEventCost,
        savings,
        cumulative: Math.round(cumulative)
      };
    });
  }, [planYears]);

  // 累積資産表示用の区切り点を動的に計算
  const assetMilestones = useMemo(() => {
    const intervals = [];
    const quarter = Math.floor(planYears / 4);
    
    if (planYears >= 4) {
      intervals.push({ 
        label: `${quarter}年後`, 
        index: quarter - 1, 
        value: longTermData[quarter - 1]?.cumulative || 0 
      });
    }
    if (planYears >= 8) {
      intervals.push({ 
        label: `${quarter * 2}年後`, 
        index: quarter * 2 - 1, 
        value: longTermData[quarter * 2 - 1]?.cumulative || 0 
      });
    }
    if (planYears >= 12) {
      intervals.push({ 
        label: `${quarter * 3}年後`, 
        index: quarter * 3 - 1, 
        value: longTermData[quarter * 3 - 1]?.cumulative || 0 
      });
    }
    intervals.push({ 
      label: `${planYears}年後`, 
      index: planYears - 1, 
      value: longTermData[planYears - 1]?.cumulative || 0 
    });
    
    return intervals;
  }, [planYears, longTermData]);

  const handleSettingChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleYearsChange = (value: string) => {
    setPlanYears(parseInt(value));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-foreground">将来キャッシュフロー</h1>
        <p className="text-sm text-muted-foreground mt-1">短期・長期の資金計画をシミュレーションできます</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="short-term">月次CF（1年）</TabsTrigger>
            <TabsTrigger value="long-term">ライフプラン（{planYears}年）</TabsTrigger>
          </TabsList>

          {/* 短期キャッシュフロー */}
          <TabsContent value="short-term" className="flex-1 space-y-4">
            {/* Settings Panel */}
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4 text-foreground">月次前提条件設定</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fixedIncome">月収（固定）</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                    <Input
                      id="fixedIncome"
                      type="number"
                      className="pl-8"
                      value={settings.fixedIncome}
                      onChange={(e) => handleSettingChange('fixedIncome', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fixedExpense">固定費</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                    <Input
                      id="fixedExpense"
                      type="number"
                      className="pl-8"
                      value={settings.fixedExpense}
                      onChange={(e) => handleSettingChange('fixedExpense', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variableExpense">変動費</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                    <Input
                      id="variableExpense"
                      type="number"
                      className="pl-8"
                      value={settings.variableExpense}
                      onChange={(e) => handleSettingChange('variableExpense', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inflationRate">インフレ率</Label>
                  <div className="relative">
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.1"
                      className="pr-8"
                      value={settings.inflationRate}
                      onChange={(e) => handleSettingChange('inflationRate', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incomeGrowthRate">収入上昇率</Label>
                  <div className="relative">
                    <Input
                      id="incomeGrowthRate"
                      type="number"
                      step="0.1"
                      className="pr-8"
                      value={settings.incomeGrowthRate}
                      onChange={(e) => handleSettingChange('incomeGrowthRate', e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chart Panel */}
            <Card className="flex-1 p-4">
              <h3 className="text-lg font-medium mb-4 text-foreground">月次キャッシュフロー予測</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shortTermData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(label) => `月: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="income" stackId="a" fill="#2E7D32" name="収入" />
                    <Bar dataKey="fixedExpense" stackId="b" fill="#D32F2F" name="固定費" />
                    <Bar dataKey="variableExpense" stackId="b" fill="#FF9800" name="変動費" />
                    <Bar dataKey="savings" stackId="c" fill="#1976D2" name="貯蓄" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          {/* 長期ライフプランニング */}
          <TabsContent value="long-term" className="flex-1 space-y-4">
            {/* 年数設定とライフイベント設定 */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-foreground">ライフプランニング設定</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="planYears" className="text-sm">計画年数:</Label>
                    <Select value={planYears.toString()} onValueChange={handleYearsChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 46 }, (_, i) => i + 5).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}年
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm">
                    イベント追加
                  </Button>
                </div>
              </div>
              
              {/* ライフイベント表示（設定年数以内のもののみ） */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {lifeEvents
                  .filter(event => event.year <= planYears)
                  .map(event => (
                    <div key={event.year} className={`p-3 rounded-lg border ${
                      event.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                      event.color === 'green' ? 'bg-green-50 border-green-200' :
                      event.color === 'purple' ? 'bg-purple-50 border-purple-200' :
                      'bg-orange-50 border-orange-200'
                    }`}>
                      <div className={`text-sm mb-1 ${
                        event.color === 'blue' ? 'text-blue-600' :
                        event.color === 'green' ? 'text-green-600' :
                        event.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`}>
                        {2025 + event.year - 1}年 {event.name}
                      </div>
                      <div className={`font-medium ${
                        event.color === 'blue' ? 'text-blue-700' :
                        event.color === 'green' ? 'text-green-700' :
                        event.color === 'purple' ? 'text-purple-700' :
                        'text-orange-700'
                      }`}>
                        {formatCurrency(event.cost)}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* 長期Chart Panel */}
            <Card className="flex-1 p-4">
              <h3 className="text-lg font-medium mb-4 text-foreground">{planYears}年間キャッシュフロー予測</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={longTermData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(label) => `年: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="income" stackId="a" fill="#2E7D32" name="年収" />
                    <Bar dataKey="livingExpense" stackId="b" fill="#D32F2F" name="生活費" />
                    <Bar dataKey="lifeEvent" stackId="b" fill="#FF9800" name="ライフイベント" />
                    <Bar dataKey="savings" stackId="c" fill="#1976D2" name="年間貯蓄" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 累積資産推移 */}
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4 text-foreground">累積資産推移</h3>
              <div className={`grid gap-4 ${
                assetMilestones.length === 2 ? 'grid-cols-2' :
                assetMilestones.length === 3 ? 'grid-cols-3' :
                'grid-cols-2 md:grid-cols-4'
              }`}>
                {assetMilestones.map((milestone, index) => (
                  <div key={index} className={`text-center p-4 rounded-lg border ${
                    index === 0 ? 'bg-green-50 border-green-200' :
                    index === 1 ? 'bg-blue-50 border-blue-200' :
                    index === 2 ? 'bg-purple-50 border-purple-200' :
                    'bg-orange-50 border-orange-200'
                  }`}>
                    <div className={`text-sm mb-1 ${
                      index === 0 ? 'text-green-600' :
                      index === 1 ? 'text-blue-600' :
                      index === 2 ? 'text-purple-600' :
                      'text-orange-600'
                    }`}>
                      {milestone.label}
                    </div>
                    <div className={`font-semibold ${
                      index === 0 ? 'text-green-700' :
                      index === 1 ? 'text-blue-700' :
                      index === 2 ? 'text-purple-700' :
                      'text-orange-700'
                    }`}>
                      {formatCurrency(milestone.value)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}