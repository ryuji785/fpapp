import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CreditCard, 
  Plus,
  Eye,
  Calculator,
  Calendar,
  Wallet,
  Target,
  Settings,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatCurrencyShort, formatVarianceRate, formatVarianceAmount, createTooltipFormatter } from '../utils/currency';

// 色覚セーフパレット（v2.4対応）
const SAFE_COLORS = {
  'pie-1': '#2E7D32', // 基準緑
  'pie-2': '#1B9E77', // 青緑  
  'pie-3': '#66A61E', // 黄緑
  'pie-4': '#E6AB02', // 黄
  'pie-5': '#7570B3', // 紫
  'pie-6': '#E7298A', // 桃
  'pie-7': '#A6761D', // 茶
  'pie-8': '#66C2A5', // 淡青緑
  'warning': '#D97706',
  'danger': '#DC2626',
  'over-budget': '#DC2626' // 予算超過時の枠線色
};

// サンプルデータ
const currentMonthSummary = {
  income: 420000,
  expense: 315000,
  difference: 105000,
  budgetProgress: 78, // %
  remainingDays: 12
};

const futureCFSnapshot = {
  nextYearAssets: 2650000,
  yearsUntilNegative: null, // 転落年なし
  trend: 'positive', // positive, negative, neutral
  recommendedActions: [
    { type: 'budget', label: '予算の見直し' },
    { type: 'plan', label: '将来設計を編集' }
  ]
};

// 乖離データ（上位3件）- 強化版
const topVariances = [
  {
    category: '食費',
    planned: 80000,
    actual: 92000,
    variance: 12000,
    varianceRate: 15,
    severity: 'warning',
    suggestion: '外食回数の見直しを検討してください',
    trend: [75000, 78000, 82000, 85000, 92000], // 過去5ヶ月の推移
    remaining: 68000,
    isOverBudget: true
  },
  {
    category: '交通費',
    planned: 25000,
    actual: 31000,
    variance: 6000,
    varianceRate: 24,
    severity: 'danger',
    suggestion: '定期券の見直しを検討してください',
    trend: [22000, 24000, 28000, 29000, 31000],
    remaining: 19000,
    isOverBudget: true
  },
  {
    category: '光熱費',  
    planned: 15000,
    actual: 21000,
    variance: 6000,
    varianceRate: 40,
    severity: 'danger',
    suggestion: '節電対策を実施してください',
    trend: [12000, 14000, 16000, 18000, 21000],
    remaining: 9000,
    isOverBudget: true
  }
];

// カテゴリ内訳データ - 色覚セーフパレット適用
const categoryData = [
  { name: '食費', value: 92000, color: SAFE_COLORS['pie-1'], isOverBudget: true },
  { name: '住居費', value: 120000, color: SAFE_COLORS['pie-2'], isOverBudget: false },
  { name: '交通費', value: 31000, color: SAFE_COLORS['pie-3'], isOverBudget: true },
  { name: '光熱費', value: 21000, color: SAFE_COLORS['pie-4'], isOverBudget: true },
  { name: '通信費', value: 12000, color: SAFE_COLORS['pie-5'], isOverBudget: false },
  { name: '保険', value: 25000, color: SAFE_COLORS['pie-6'], isOverBudget: false },
  { name: 'その他', value: 14000, color: SAFE_COLORS['pie-7'], isOverBudget: false }
];

// クレジットカード請求データ
const creditCardData = [
  {
    cardName: '楽天カード',
    amount: 85000,
    dueDate: '2025/02/27',
    closingDate: '2025/01/31',
    status: 'confirmed'
  },
  {
    cardName: 'イオンカード',
    amount: 42000,
    dueDate: '2025/02/10',
    closingDate: '2025/01/10',
    status: 'confirmed'
  },
  {
    cardName: 'Amazon Mastercard',
    amount: 28000,
    dueDate: '2025/02/15',
    closingDate: '2025/01/15',
    status: 'pending'
  }
];

export function Dashboard() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const totalExpense = categoryData.reduce((sum, item) => sum + item.value, 0);
  const totalCardAmount = creditCardData.reduce((sum, card) => sum + card.amount, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 強化されたスパークライン
  const SparkLine = ({ data, color = SAFE_COLORS['pie-1'], isOverBudget = false }: { 
    data: number[], 
    color?: string,
    isOverBudget?: boolean 
  }) => (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((value, index) => ({ value, index }))}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={isOverBudget ? SAFE_COLORS.danger : color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // カスタムツールチップ（ドーナツ用）
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <div className="font-medium mb-1">{data.name}</div>
        <div className="text-sm">
          <div>金額: {formatCurrency(data.value)}</div>
          <div>割合: {((data.value / totalExpense) * 100).toFixed(1)}%</div>
          {data.isOverBudget && (
            <div className="text-red-600 text-xs mt-1">⚠️ 予算超過</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header with Quick Add */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">ダッシュボード</h1>
            <p className="text-sm text-muted-foreground mt-1">今月の状況と1年先の見通しを確認できます</p>
          </div>
          
          {/* クイック追加 */}
          <DropdownMenu open={quickAddOpen} onOpenChange={setQuickAddOpen}>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                クイック追加
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Wallet className="h-4 w-4 mr-2" />
                取引を追加
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                イベントを追加
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Target className="h-4 w-4 mr-2" />
                積立を変更
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {/* ヒーロー帯 - 2カード構成 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ①今月サマリ */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  今月のサマリー
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">収入</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrencyShort(currentMonthSummary.income)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">支出</div>
                    <div className="font-semibold text-red-600">
                      {formatCurrencyShort(currentMonthSummary.expense)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">差額</div>
                    <div className={`font-semibold ${
                      currentMonthSummary.difference > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentMonthSummary.difference > 0 ? '+' : ''}
                      {formatCurrencyShort(currentMonthSummary.difference)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">予算進捗</span>
                    <span className="text-sm font-medium">{currentMonthSummary.budgetProgress}%</span>
                  </div>
                  <Progress value={currentMonthSummary.budgetProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    月末まで{currentMonthSummary.remainingDays}日
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ②将来CFスナップ - 強化版 */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  将来の見通し
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">来年末の累積資産</div>
                  <div className="text-2xl font-semibold text-blue-700 mb-2">
                    {formatCurrencyShort(futureCFSnapshot.nextYearAssets)}
                  </div>
                  
                  {futureCFSnapshot.yearsUntilNegative ? (
                    <Badge variant="destructive" className="mb-2">
                      転落まで{futureCFSnapshot.yearsUntilNegative}年
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700">
                      資産増加傾向
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm mb-4">
                  {futureCFSnapshot.trend === 'positive' ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">順調に資産形成中</span>
                    </>
                  ) : futureCFSnapshot.trend === 'negative' ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">資産減少の可能性</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">要注意</span>
                    </>
                  )}
                </div>

                {/* 対策CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    予算の見直し
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    将来設計
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attentionカード - 強化版 */}
          {topVariances.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  要注意項目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topVariances.map((variance, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{variance.category}</span>
                          <Badge 
                            variant={variance.severity === 'danger' ? 'destructive' : 'secondary'}
                            className={variance.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}
                          >
                            {formatVarianceAmount(variance.variance)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatVarianceRate(variance.variance, variance.planned)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-sm text-muted-foreground">
                            予算: {formatCurrencyShort(variance.planned)} → 
                            実績: {formatCurrencyShort(variance.actual)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            残額: {formatCurrencyShort(variance.remaining)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">推移:</span>
                          <SparkLine 
                            data={variance.trend} 
                            color={variance.severity === 'danger' ? SAFE_COLORS.danger : SAFE_COLORS.warning}
                            isOverBudget={variance.isOverBudget}
                          />
                          <p className="text-sm text-muted-foreground flex-1">{variance.suggestion}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-4">
                        対策 <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    予算の見直し
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    将来設計
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* カテゴリ内訳（ドーナツ） - 色覚セーフパレット対応 */}
            <Card>
              <CardHeader>
                <CardTitle>支出内訳</CardTitle>
                <div className="text-sm text-muted-foreground">
                  今月の支出合計: {formatCurrency(totalExpense)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={(data) => setHoveredCategory(data.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke={entry.isOverBudget ? SAFE_COLORS['over-budget'] : 'none'}
                            strokeWidth={entry.isOverBudget ? 2 : 0}
                            style={{
                              transform: hoveredCategory === entry.name ? 'scale(1.05)' : 'scale(1)',
                              transformOrigin: 'center'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 色覚セーフティ情報 */}
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  <Badge variant="outline" className="text-xs">色覚セーフパレット</Badge>
                  <span className="ml-2">予算超過項目は赤枠で表示</span>
                </div>
              </CardContent>
            </Card>

            {/* クレジットカード請求 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  クレジットカード請求
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  合計請求額: {formatCurrency(totalCardAmount)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creditCardData.map((card, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{card.cardName}</span>
                          <Badge 
                            variant={card.status === 'confirmed' ? 'secondary' : 'outline'}
                            className={card.status === 'pending' ? 'border-orange-300 text-orange-700' : ''}
                          >
                            {card.status === 'confirmed' ? '確定' : '未確定'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          支払日: {card.dueDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrencyShort(card.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}