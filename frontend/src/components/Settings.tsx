import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Wallet, 
  Download, 
  Upload,
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { toast } from 'sonner';

// 収入プロファイル型定義
interface IncomeProfile {
  id: number;
  personId: number;
  personName: string;
  baseAnnualIncome: number;
  isGrossIncome: boolean; // true: 税前, false: 手取り
  annualGrowthRate: number; // %
  maxAnnualIncome?: number;
  raiseType: 'annual' | 'step';
  stepRaises?: { year: number; rate: number }[]; // ステップ昇給
  retirementAge: number;
  postRetirementIncome?: number; // 年金等
}

// 前提条件型定義
interface AssumptionSet {
  id: number;
  name: string;
  inflationRate: number;
  investmentReturn: number;
  planStartYear: number;
  planYears: number;
  isActive: boolean;
}

// 保有資産・アカウント型定義
interface Account {
  id: number;
  name: string;
  type: 'cash' | 'savings' | 'investment' | 'other';
  initialBalance: number;
  monthlyContribution: number;
  assetAllocation: {
    cash: number;
    bonds: number;
    stocks: number;
  };
  expectedReturn: number;
}

// サンプルデータ
const sampleIncomeProfiles: IncomeProfile[] = [
  {
    id: 1,
    personId: 1,
    personName: '田中 太郎',
    baseAnnualIncome: 5000000,
    isGrossIncome: false,
    annualGrowthRate: 2.0,
    maxAnnualIncome: 8000000,
    raiseType: 'annual',
    retirementAge: 65,
    postRetirementIncome: 1800000
  },
  {
    id: 2,
    personId: 2,
    personName: '田中 花子',
    baseAnnualIncome: 4000000,
    isGrossIncome: false,
    annualGrowthRate: 1.5,
    maxAnnualIncome: 6000000,
    raiseType: 'step',
    stepRaises: [
      { year: 3, rate: 10 },
      { year: 5, rate: 8 },
      { year: 10, rate: 15 }
    ],
    retirementAge: 65,
    postRetirementIncome: 1500000
  }
];

const sampleAssumptionSets: AssumptionSet[] = [
  {
    id: 1,
    name: 'ベースシナリオ',
    inflationRate: 2.0,
    investmentReturn: 3.0,
    planStartYear: 2025,
    planYears: 30,
    isActive: true
  },
  {
    id: 2,
    name: '楽観シナリオ',
    inflationRate: 1.5,
    investmentReturn: 4.0,
    planStartYear: 2025,
    planYears: 30,
    isActive: false
  },
  {
    id: 3,
    name: '悲観シナリオ',
    inflationRate: 3.0,
    investmentReturn: 2.0,
    planStartYear: 2025,
    planYears: 30,
    isActive: false
  }
];

const sampleAccounts: Account[] = [
  {
    id: 1,
    name: '生活費口座',
    type: 'savings',
    initialBalance: 1500000,
    monthlyContribution: 50000,
    assetAllocation: { cash: 100, bonds: 0, stocks: 0 },
    expectedReturn: 0.1
  },
  {
    id: 2,
    name: 'つみたてNISA',
    type: 'investment',
    initialBalance: 800000,
    monthlyContribution: 33333,
    assetAllocation: { cash: 10, bonds: 30, stocks: 60 },
    expectedReturn: 4.0
  },
  {
    id: 3,
    name: '緊急資金',
    type: 'savings',
    initialBalance: 1000000,
    monthlyContribution: 0,
    assetAllocation: { cash: 100, bonds: 0, stocks: 0 },
    expectedReturn: 0.1
  }
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('income');
  const [incomeProfiles, setIncomeProfiles] = useState<IncomeProfile[]>(sampleIncomeProfiles);
  const [assumptionSets, setAssumptionSets] = useState<AssumptionSet[]>(sampleAssumptionSets);
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('田中 太郎');
  const [userEmail, setUserEmail] = useState('tanaka@example.com');

  const handleExportData = () => {
    const exportData = {
      incomeProfiles,
      assumptionSets,
      accounts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fpapp-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('設定データをエクスポートしました');
  };

  const handleImportData = () => {
    toast.info('インポート機能は開発中です');
  };

  const activateScenario = (scenarioId: number) => {
    setAssumptionSets(prev => prev.map(scenario => ({
      ...scenario,
      isActive: scenario.id === scenarioId
    })));
    toast.success('シナリオを切り替えました');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-foreground">設定</h1>
        <p className="text-sm text-muted-foreground mt-1">収入プロファイル、前提条件、保有資産を管理します</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="income">収入設定</TabsTrigger>
            <TabsTrigger value="assumptions">前提条件</TabsTrigger>
            <TabsTrigger value="accounts">保有資産</TabsTrigger>
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="data">データ管理</TabsTrigger>
          </TabsList>

          {/* 収入プロファイル設定 */}
          <TabsContent value="income" className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">収入プロファイル</h3>
                <p className="text-sm text-muted-foreground">家族それぞれの収入計画を設定します</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                プロファイル追加
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {incomeProfiles.map((profile) => (
                <Card key={profile.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {profile.personName}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">基準年収</Label>
                        <p className="font-semibold">{formatCurrency(profile.baseAnnualIncome)}</p>
                        <Badge variant="outline" className="mt-1">
                          {profile.isGrossIncome ? '税前' : '手取り'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">年収上昇率</Label>
                        <p className="font-semibold">{profile.annualGrowthRate}%/年</p>
                        <Badge variant="outline" className="mt-1">
                          {profile.raiseType === 'annual' ? '毎年' : 'ステップ'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">最大年収</Label>
                        <p className="font-semibold">
                          {profile.maxAnnualIncome ? formatCurrency(profile.maxAnnualIncome) : '上限なし'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">退職年齢</Label>
                        <p className="font-semibold">{profile.retirementAge}歳</p>
                      </div>
                    </div>

                    {profile.postRetirementIncome && (
                      <div>
                        <Label className="text-sm text-muted-foreground">退職後収入（年金等）</Label>
                        <p className="font-semibold">{formatCurrency(profile.postRetirementIncome)}</p>
                      </div>
                    )}

                    {profile.raiseType === 'step' && profile.stepRaises && (
                      <div>
                        <Label className="text-sm text-muted-foreground">ステップ昇給</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.stepRaises.map((raise, index) => (
                            <Badge key={index} variant="secondary">
                              {raise.year}年目: +{raise.rate}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 前提条件・シナリオ設定 */}
          <TabsContent value="assumptions" className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">前提条件・シナリオ</h3>
                <p className="text-sm text-muted-foreground">複数のシナリオを作成・比較できます</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                シナリオ追加
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {assumptionSets.map((scenario) => (
                <Card key={scenario.id} className={scenario.isActive ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        {scenario.name}
                      </div>
                      <div className="flex gap-1">
                        {scenario.isActive && (
                          <Badge>アクティブ</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">インフレ率</Label>
                        <span className="font-semibold">{scenario.inflationRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">投資期待利回り</Label>
                        <span className="font-semibold">{scenario.investmentReturn}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">計画開始年</Label>
                        <span className="font-semibold">{scenario.planStartYear}年</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">計画年数</Label>
                        <span className="font-semibold">{scenario.planYears}年</span>
                      </div>
                    </div>

                    {!scenario.isActive && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => activateScenario(scenario.id)}
                      >
                        このシナリオを適用
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 保有資産・アカウント設定 */}
          <TabsContent value="accounts" className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">保有資産・アカウント</h3>
                <p className="text-sm text-muted-foreground">口座・投資先ごとの資産を管理します</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                アカウント追加
              </Button>
            </div>

            {/* 総資産サマリ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  資産概要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm text-primary mb-1">総資産</div>
                    <div className="font-semibold text-primary">
                      {formatCurrency(accounts.reduce((sum, acc) => sum + acc.initialBalance, 0))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">月次積立</div>
                    <div className="font-semibold text-green-700">
                      {formatCurrency(accounts.reduce((sum, acc) => sum + acc.monthlyContribution, 0))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">現金比率</div>
                    <div className="font-semibold text-blue-700">
                      {Math.round(accounts.reduce((sum, acc) => sum + (acc.initialBalance * acc.assetAllocation.cash / 100), 0) / accounts.reduce((sum, acc) => sum + acc.initialBalance, 0) * 100)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">株式比率</div>
                    <div className="font-semibold text-purple-700">
                      {Math.round(accounts.reduce((sum, acc) => sum + (acc.initialBalance * acc.assetAllocation.stocks / 100), 0) / accounts.reduce((sum, acc) => sum + acc.initialBalance, 0) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* アカウント一覧 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        {account.name}
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline">
                          {account.type === 'cash' ? '現金' :
                           account.type === 'savings' ? '預金' :
                           account.type === 'investment' ? '投資' : 'その他'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">現在残高</Label>
                        <p className="font-semibold">{formatCurrency(account.initialBalance)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">月次積立</Label>
                        <p className="font-semibold">{formatCurrency(account.monthlyContribution)}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">アセット配分</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">現金</div>
                          <div className="font-semibold">{account.assetAllocation.cash}%</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-xs text-blue-600">債券</div>
                          <div className="font-semibold">{account.assetAllocation.bonds}%</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-xs text-green-600">株式</div>
                          <div className="font-semibold">{account.assetAllocation.stocks}%</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">期待利回り</Label>
                      <p className="font-semibold">{account.expectedReturn}%/年</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* プロフィール設定 */}
          <TabsContent value="profile" className="flex-1 space-y-4">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  ユーザープロフィール
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">ユーザー名</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">メールアドレス</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">表示設定</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">ダークモード</Label>
                    <Switch
                      id="darkMode"
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>通貨</Label>
                    <Select value="JPY" disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JPY">日本円（¥）</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      v1.0では日本円のみサポートしています
                    </p>
                  </div>
                </div>

                <Button className="w-full">
                  プロフィールを保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* データ管理 */}
          <TabsContent value="data" className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    データエクスポート
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    すべての設定データ（収入プロファイル、前提条件、保有資産等）をJSONファイルとしてダウンロードできます。
                  </p>
                  <Button onClick={handleExportData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    設定をエクスポート
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    データインポート
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    エクスポートしたJSONファイルまたは取引CSVファイルをインポートして設定を復元できます。
                  </p>
                  <Button onClick={handleImportData} variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    ファイルをインポート
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  データ管理について
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">データの保存について</h4>
                  <p className="text-sm text-muted-foreground">
                    現在、データはブラウザのローカルストレージに保存されています。
                    ブラウザのデータを削除するとすべての情報が失われますので、
                    定期的にエクスポート機能でバックアップを取ることをお勧めします。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">プライバシーについて</h4>
                  <p className="text-sm text-muted-foreground">
                    このアプリは個人情報を最小限に抑えて設計されています。
                    生年月日は計算のためのみ使用され、表示は年齢のみとなります。
                    機密性の高い財務データについては、適切なセキュリティ対策を講じてください。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}