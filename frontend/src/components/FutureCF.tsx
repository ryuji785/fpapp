import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { DChartV2 } from './ui/d-chart-v2';
import { 
  TrendingUp, 
  BarChart3, 
  Calculator,
  Calendar,
  Users,
  Settings
} from 'lucide-react';
import { formatCurrencyShort } from '../utils/currency';
import { 
  snapshotManager, 
  useSnapshot, 
  getDefaultAssumptions,
  ScenarioSnapshot
} from '../utils/calculation-engine';

export function FutureCF() {
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string | null>(null);
  const [comparisonSnapshotId, setComparisonSnapshotId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'comparison'>('single');
  const [timeHorizon, setTimeHorizon] = useState<'short' | 'medium' | 'long'>('medium');

  // スナップショットの取得
  const primarySnapshot = useSnapshot(currentSnapshotId);
  const comparisonSnapshot = useSnapshot(comparisonSnapshotId);

  // 初期データ生成
  useEffect(() => {
    const assumptions = getDefaultAssumptions();
    const snapshot = snapshotManager.createSnapshot(assumptions, 'Base');
    setCurrentSnapshotId(snapshot.id);
    
    // 比較用のシナリオも生成（楽観シナリオ）
    const optimisticAssumptions = {
      ...assumptions,
      investmentReturn: assumptions.investmentReturn + 1, // +1%
      inflationRate: assumptions.inflationRate - 0.5 // -0.5%
    };
    const optimisticSnapshot = snapshotManager.createSnapshot(optimisticAssumptions, '楽観シナリオ');
    setComparisonSnapshotId(optimisticSnapshot.id);
  }, []);

  // 期間フィルタリング
  const getFilteredData = (snapshot: ScenarioSnapshot | null) => {
    if (!snapshot) return [];
    
    const totalYears = snapshot.series.length;
    let endIndex = totalYears;
    
    switch (timeHorizon) {
      case 'short':
        endIndex = Math.min(10, totalYears); // 10年
        break;
      case 'medium':
        endIndex = Math.min(20, totalYears); // 20年
        break;
      case 'long':
        endIndex = totalYears; // 全期間
        break;
    }
    
    return snapshot.series.slice(0, endIndex);
  };

  const filteredPrimaryData = getFilteredData(primarySnapshot);
  const filteredComparisonData = getFilteredData(comparisonSnapshot);

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">将来予測</h1>
            <p className="text-sm text-muted-foreground mt-1">長期の資産推移を分析し、シナリオ比較を行えます</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">D-Chart v2</Badge>
            <Badge variant="outline">分析モード</Badge>
          </div>
        </div>
      </div>

      {/* Content - 上下分割レイアウト */}
      <div className="flex-1 overflow-auto">
        {/* 上段: コントロール */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* 表示モード */}
            <Card className="p-3">
              <Label className="text-sm font-medium mb-2 block">表示モード</Label>
              <Select value={viewMode} onValueChange={(value: 'single' | 'comparison') => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">単一シナリオ</SelectItem>
                  <SelectItem value="comparison">シナリオ比較</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {/* 期間設定 */}
            <Card className="p-3">
              <Label className="text-sm font-medium mb-2 block">分析期間</Label>
              <Select value={timeHorizon} onValueChange={(value: 'short' | 'medium' | 'long') => setTimeHorizon(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">短期（10年）</SelectItem>
                  <SelectItem value="medium">中期（20年）</SelectItem>
                  <SelectItem value="long">長期（全期間）</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {/* シナリオ選択 */}
            <Card className="p-3">
              <Label className="text-sm font-medium mb-2 block">
                {viewMode === 'single' ? 'メインシナリオ' : 'ベースシナリオ'}
              </Label>
              <Select value={primarySnapshot?.name || ''} onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="シナリオを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="楽観シナリオ">楽観シナリオ</SelectItem>
                  <SelectItem value="悲観シナリオ">悲観シナリオ</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {/* 比較シナリオ選択 */}
            {viewMode === 'comparison' && (
              <Card className="p-3">
                <Label className="text-sm font-medium mb-2 block">比較シナリオ</Label>
                <Select value={comparisonSnapshot?.name || ''} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="比較対象を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="楽観シナリオ">楽観シナリオ</SelectItem>
                    <SelectItem value="悲観シナリオ">悲観シナリオ</SelectItem>
                    <SelectItem value="カスタム">カスタム</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            )}
          </div>
        </div>

        {/* 中段: 分析サマリー */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {primarySnapshot && (
              <>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatCurrencyShort(primarySnapshot.finalAssets)}
                  </div>
                  <div className="text-sm text-muted-foreground">最終資産</div>
                  {viewMode === 'comparison' && comparisonSnapshot && (
                    <div className="text-xs mt-1">
                      差分: {formatCurrencyShort(primarySnapshot.finalAssets - comparisonSnapshot.finalAssets)}
                    </div>
                  )}
                </Card>

                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrencyShort(primarySnapshot.averageAnnualCashFlow)}
                  </div>
                  <div className="text-sm text-muted-foreground">年平均収支</div>
                  {viewMode === 'comparison' && comparisonSnapshot && (
                    <div className="text-xs mt-1">
                      差分: {formatCurrencyShort(primarySnapshot.averageAnnualCashFlow - comparisonSnapshot.averageAnnualCashFlow)}
                    </div>
                  )}
                </Card>

                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-1">
                    {primarySnapshot.yearsUntilNegative ? `${primarySnapshot.yearsUntilNegative}年` : '安全'}
                  </div>
                  <div className="text-sm text-muted-foreground">マイナス転落</div>
                  {viewMode === 'comparison' && comparisonSnapshot && (
                    <div className="text-xs mt-1">
                      {comparisonSnapshot.yearsUntilNegative ? 
                        `比較: ${comparisonSnapshot.yearsUntilNegative}年` : 
                        '比較: 安全'
                      }
                    </div>
                  )}
                </Card>

                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {filteredPrimaryData.length}年
                  </div>
                  <div className="text-sm text-muted-foreground">分析期間</div>
                  <div className="text-xs mt-1 text-muted-foreground">
                    {primarySnapshot.assumptions.planStartYear}年〜
                    {primarySnapshot.assumptions.planStartYear + filteredPrimaryData.length - 1}年
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* 下段: D-Chart v2メイン分析 */}
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {viewMode === 'single' ? '長期資産推移分析' : 'シナリオ比較分析'}
              </CardTitle>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {primarySnapshot && (
                    <>
                      期間: {primarySnapshot.assumptions.planStartYear}年〜
                      {primarySnapshot.assumptions.planStartYear + filteredPrimaryData.length - 1}年
                      （{filteredPrimaryData.length}年間）
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">実績反映</Badge>
                  <Badge variant="outline">今日ライン</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {primarySnapshot ? (
                <div className="space-y-4">
                  {/* メインD-Chart v2 */}
                  <DChartV2
                    data={filteredPrimaryData}
                    height={600}
                    events={primarySnapshot.assumptions.events}
                    showControls={true}
                  />

                  {/* 比較モード時の追加チャート */}
                  {viewMode === 'comparison' && comparisonSnapshot && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        比較シナリオ: {comparisonSnapshot.name}
                      </h3>
                      <DChartV2
                        data={filteredComparisonData}
                        height={400}
                        events={comparisonSnapshot.assumptions.events}
                        showControls={false}
                      />
                    </div>
                  )}

                  {/* 分析インサイト */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">分析インサイト</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {primarySnapshot.yearsUntilNegative ? (
                        <p>⚠️ {primarySnapshot.yearsUntilNegative}年後に資産がマイナスに転落する可能性があります。</p>
                      ) : (
                        <p>✅ 計画期間中は資産が安定して増加しています。</p>
                      )}
                      
                      {primarySnapshot.averageAnnualCashFlow > 0 ? (
                        <p>📈 年平均 {formatCurrencyShort(primarySnapshot.averageAnnualCashFlow)} の黒字を維持しています。</p>
                      ) : (
                        <p>📉 年平均 {formatCurrencyShort(Math.abs(primarySnapshot.averageAnnualCashFlow))} の赤字が発生しています。</p>
                      )}
                      
                      {viewMode === 'comparison' && comparisonSnapshot && (
                        <p>🔄 比較シナリオとの最終資産差は {formatCurrencyShort(Math.abs(primarySnapshot.finalAssets - comparisonSnapshot.finalAssets))} です。</p>
                      )}
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
      </div>
    </div>
  );
}