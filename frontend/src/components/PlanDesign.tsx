import { useState, useCallback, useEffect } from 'react';
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
import { Alert, AlertDescription } from './ui/alert';
import { DChartV2 } from './ui/d-chart-v2';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Calculator,
  Home,
  Calendar,
  Settings,
  RefreshCw,
  Save,
  AlertCircle,
  Plus,
  Edit,
  Clock,
  GraduationCap,
  BarChart3,
  Coins
} from 'lucide-react';
import { formatCurrencyShort, calculateAgeFromYear } from '../utils/currency';
import { 
  snapshotManager, 
  useSnapshot, 
  getDefaultAssumptions,
  PlanAssumptions,
  ScenarioSnapshot
} from '../utils/calculation-engine';
import { toast } from 'sonner';

export function PlanDesign() {
  const [activeTab, setActiveTab] = useState('scenario');
  const [isDraft, setIsDraft] = useState(false);
  const [autoRecalc, setAutoRecalc] = useState(false);
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'design' | 'analysis'>('design');

  // 設定データ
  const [assumptions, setAssumptions] = useState<PlanAssumptions>(getDefaultAssumptions());

  // スナップショットの取得
  const snapshot = useSnapshot(currentSnapshotId);

  // 初期スナップショット生成
  useEffect(() => {
    const initialSnapshot = snapshotManager.createSnapshot(assumptions, 'Base');
    setCurrentSnapshotId(initialSnapshot.id);
  }, []);

  // 手動再計算
  const handleRecalculate = useCallback(() => {
    if (!currentSnapshotId) return;
    
    const updatedSnapshot = snapshotManager.updateSnapshot(currentSnapshotId, assumptions);
    setIsDraft(false);
    toast.success('将来予測を更新しました');
  }, [currentSnapshotId, assumptions]);

  // 自動再計算（デバウンス処理）
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleSettingChange = useCallback((field: string, value: any) => {
    setAssumptions(prev => ({ ...prev, [field]: value }));
    setIsDraft(true);

    if (autoRecalc) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const timer = setTimeout(() => {
        handleRecalculate();
      }, 1000);
      
      setDebounceTimer(timer);
    }
  }, [autoRecalc, debounceTimer, handleRecalculate]);

  // ドラフト適用
  const handleApplyDraft = () => {
    handleRecalculate();
  };

  // 家族のKPI計算
  const calculateFamilyKPIs = (member: any) => {
    const currentAge = member.currentAge;
    const endAge = calculateAgeFromYear(
      assumptions.planStartYear + assumptions.planYears - 1,
      assumptions.planStartYear,
      currentAge
    );
    
    let kpis: any = {
      currentAge,
      endAge
    };
    
    if (member.relationship === '本人' || member.relationship === '配偶者') {
      const yearsToRetirement = Math.max(0, member.retirementAge - currentAge);
      kpis.yearsToRetirement = yearsToRetirement;
      kpis.retirementAge = member.retirementAge;
    }
    
    if (member.relationship === '子') {
      const schoolStartYear = assumptions.planStartYear + (member.schoolStartAge - currentAge);
      const nextSchoolEvents = [
        { name: '小学校入学', age: member.schoolStartAge },
        { name: '中学校入学', age: member.schoolStartAge + 6 },
        { name: '高校入学', age: member.schoolStartAge + 9 },
        { name: '大学入学', age: member.schoolStartAge + 12 }
      ];
      
      const nextEvent = nextSchoolEvents.find(event => event.age > currentAge);
      if (nextEvent) {
        kpis.nextSchoolEvent = nextEvent.name;
        kpis.yearsToNextEvent = nextEvent.age - currentAge;
      }
    }
    
    return kpis;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">将来設計</h1>
            <p className="text-sm text-muted-foreground mt-1">ライフプランの設定から分析まで統合管理</p>
          </div>
          
          {/* 設計・分析切替 */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'design' ? 'default' : 'outline'}
              onClick={() => setViewMode('design')}
              size="sm"
            >
              <Calculator className="h-4 w-4 mr-2" />
              設計
            </Button>
            <Button
              variant={viewMode === 'analysis' ? 'default' : 'outline'}
              onClick={() => setViewMode('analysis')}
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              分析
            </Button>
          </div>
        </div>
        
        {/* ドラフトバナー */}
        {isDraft && (
          <Alert className="mt-3 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              設定が変更されています。再計算を実行して変更を反映してください。
              {snapshot && (
                <span className="ml-2 text-xs text-muted-foreground">
                  最終更新: {snapshot.calculatedAt.toLocaleTimeString()}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Content - 設計・分析モード切替 */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'design' ? (
          /* 設計モード - 上下分割レイアウト */
          <>
            {/* 上段: フォーム群 */}
            <div className="p-4 border-b bg-white">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="scenario">シナリオ</TabsTrigger>
                  <TabsTrigger value="family">家族</TabsTrigger>
                  <TabsTrigger value="income">収入</TabsTrigger>
                  <TabsTrigger value="assets">資産</TabsTrigger>
                  <TabsTrigger value="events">イベント</TabsTrigger>
                </TabsList>

                {/* シナリオ・前提条件タブ */}
                <TabsContent value="scenario" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          基本前提
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>計画開始年</Label>
                            <Select 
                              value={assumptions.planStartYear.toString()} 
                              onValueChange={(value) => handleSettingChange('planStartYear', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 5 }, (_, i) => 2024 + i).map(year => (
                                  <SelectItem key={year} value={year.toString()}>{year}年</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>計画年数: {assumptions.planYears}年</Label>
                            <Slider
                              value={[assumptions.planYears]}
                              onValueChange={([value]) => handleSettingChange('planYears', value)}
                              min={5}
                              max={70}
                              step={5}
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>インフレ率 (%/年)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={assumptions.inflationRate}
                              onChange={(e) => handleSettingChange('inflationRate', parseFloat(e.target.value))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>投資期待利回り (%/年)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={assumptions.investmentReturn}
                              onChange={(e) => handleSettingChange('investmentReturn', parseFloat(e.target.value))}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 家族タブ - KPI強化版 */}
                <TabsContent value="family" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        家族構成
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {assumptions.familyMembers.map((member) => {
                          const kpis = calculateFamilyKPIs(member);
                          return (
                            <div key={member.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <Badge variant="outline">{member.relationship}</Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* KPI表示 */}
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">現在年齢</span>
                                  <span className="font-medium">{kpis.currentAge}歳</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">計画終了時</span>
                                  <span className="font-medium">{kpis.endAge}歳</span>
                                </div>
                                
                                {kpis.yearsToRetirement !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">退職まで</span>
                                    <span className="font-medium flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {kpis.yearsToRetirement}年
                                    </span>
                                  </div>
                                )}
                                
                                {kpis.nextSchoolEvent && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">次の進学</span>
                                      <span className="font-medium flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {kpis.yearsToNextEvent}年後
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {kpis.nextSchoolEvent}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        家族情報を編集
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 収入タブ - 編集可能版 */}
                <TabsContent value="income" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        収入プロファイル
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>基準年収</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                            <Input
                              type="number"
                              className="pl-8"
                              value={assumptions.baseIncome}
                              onChange={(e) => handleSettingChange('baseIncome', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            現在の年収: {formatCurrencyShort(assumptions.baseIncome)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>昇給率 (%/年)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            defaultValue="2.0"
                            className="mb-2"
                          />
                          <div className="text-xs text-muted-foreground">
                            一般的な昇給率: 2.0%
                          </div>
                        </div>
                      </div>
                      
                      {/* 退職年齢設定 */}
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {assumptions.familyMembers
                            .filter(m => m.relationship === '本人' || m.relationship === '配偶者')
                            .map(member => (
                            <div key={member.id} className="space-y-2">
                              <Label>{member.name}の退職年齢</Label>
                              <Input
                                type="number"
                                value={member.retirementAge || 65}
                                onChange={(e) => {
                                  const updatedMembers = assumptions.familyMembers.map(m =>
                                    m.id === member.id ? { ...m, retirementAge: parseInt(e.target.value) } : m
                                  );
                                  handleSettingChange('familyMembers', updatedMembers);
                                }}
                              />
                              <div className="text-xs text-muted-foreground">
                                退職まで {Math.max(0, (member.retirementAge || 65) - member.currentAge)} 年
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 資産タブ - 編集可能版 */}
                <TabsContent value="assets" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        保有資産
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>初期資産</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                            <Input
                              type="number"
                              className="pl-8"
                              value={assumptions.initialAssets}
                              onChange={(e) => handleSettingChange('initialAssets', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            現在の保有資産: {formatCurrencyShort(assumptions.initialAssets)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>基準年間支出</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                            <Input
                              type="number"
                              className="pl-8"
                              value={assumptions.baseExpense}
                              onChange={(e) => handleSettingChange('baseExpense', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            年間支出: {formatCurrencyShort(assumptions.baseExpense)}
                          </div>
                        </div>
                      </div>
                      
                      {/* 投資方針 */}
                      <div className="pt-4 border-t">
                        <Label className="text-base">投資方針</Label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label className="text-sm">期待利回り (%/年)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={assumptions.investmentReturn}
                              onChange={(e) => handleSettingChange('investmentReturn', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">リスク許容度</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">保守的（1-3%）</SelectItem>
                                <SelectItem value="medium">標準的（3-5%）</SelectItem>
                                <SelectItem value="high">積極的（5-7%）</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* イベントタブ */}
                <TabsContent value="events" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        ライフイベント
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {assumptions.events.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{event.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {event.year}年 • {formatCurrencyShort(event.amount)} • {event.person}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        イベントを追加
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sticky再計算バー */}
            <div className="sticky top-0 z-10 bg-white border-y px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    シナリオ: <span className="font-medium">{snapshot?.name || 'Base'}</span>
                    {snapshot && (
                      <span className="ml-2">
                        最終計算: {snapshot.calculatedAt.toLocaleTimeString()}
                      </span>
                    )}
                    {snapshot && (
                      <span className="ml-2 text-xs">
                        ID: {snapshot.id.slice(-8)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* 自動再計算トグル */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={autoRecalc}
                      onCheckedChange={setAutoRecalc}
                      id="auto-recalc"
                    />
                    <Label htmlFor="auto-recalc" className="text-sm">自動更新</Label>
                  </div>
                  
                  {/* 手動再計算ボタン */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRecalculate} 
                    disabled={autoRecalc && !isDraft}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    再計算
                  </Button>
                  
                  {/* 適用ボタン */}
                  {isDraft && (
                    <Button size="sm" onClick={handleApplyDraft}>
                      <Save className="h-4 w-4 mr-2" />
                      適用
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 下段: D-Chart v2プレビュー */}
            <div className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    将来予測プレビュー
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    期間: {assumptions.planStartYear}年〜{assumptions.planStartYear + assumptions.planYears - 1}年
                  </div>
                </CardHeader>
                <CardContent>
                  {snapshot ? (
                    <div className="space-y-4">
                      {/* D-Chart v2統一グラフ */}
                      <DChartV2
                        data={snapshot.series}
                        height={480}
                        events={assumptions.events}
                        showControls={true}
                      />

                      {/* サマリー指標 */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">最終資産</div>
                          <div className="font-semibold text-primary">
                            {formatCurrencyShort(snapshot.finalAssets)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">年平均収支</div>
                          <div className="font-semibold text-green-600">
                            {formatCurrencyShort(snapshot.averageAnnualCashFlow)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">マイナス転落</div>
                          <div className="font-semibold text-gray-600">
                            {snapshot.yearsUntilNegative ? `${snapshot.yearsUntilNegative}年後` : 'なし'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>データを読み込み中...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* 分析モード - 将来予測統合 */
          <div className="p-4">
            <div className="space-y-6">
              {/* 分析サマリー */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {snapshot && (
                  <>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {formatCurrencyShort(snapshot.finalAssets)}
                      </div>
                      <div className="text-sm text-muted-foreground">最終資産</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrencyShort(snapshot.averageAnnualCashFlow)}
                      </div>
                      <div className="text-sm text-muted-foreground">年平均収支</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-600 mb-1">
                        {snapshot.yearsUntilNegative ? `${snapshot.yearsUntilNegative}年後` : 'なし'}
                      </div>
                      <div className="text-sm text-muted-foreground">マイナス転落</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {snapshot.series.length}年
                      </div>
                      <div className="text-sm text-muted-foreground">分析期間</div>
                    </Card>
                  </>
                )}
              </div>

              {/* メイン分析チャート */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    長期資産推移分析
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {snapshot && (
                      <>
                        期間: {snapshot.assumptions.planStartYear}年〜
                        {snapshot.assumptions.planStartYear + snapshot.series.length - 1}年
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {snapshot ? (
                    <DChartV2
                      data={snapshot.series}
                      height={600}
                      events={snapshot.assumptions.events}
                      showControls={true}
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>データを読み込み中...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}