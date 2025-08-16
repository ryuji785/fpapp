import React, { useState } from 'react';
import { 
  ComposedChart, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Button } from './button';
import { Badge } from './badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Label } from './label';
import { Users, Calendar, Eye, Wallet } from 'lucide-react';
import { formatCurrency, formatCurrencyAxis, formatCurrencyWithManyen, createTooltipFormatter } from '../../utils/currency';
import { YearData, FamilyMember, LifeEvent } from '../../utils/calculation-engine';

interface DChartV2Props {
  data: YearData[];
  height?: number;
  showControls?: boolean;
  events?: LifeEvent[];
  onEventClick?: (event: LifeEvent) => void;
  className?: string;
}

// 色覚セーフパレット（v2.4対応）
const SAFE_COLORS = {
  'assets': '#2E7D32',
  'assets-area': 'rgba(46, 125, 50, 0.3)',
  'cashflow-positive': '#4CAF50', // より明確な区別のため明度を上げる
  'cashflow-negative': '#D32F2F',
  'event-line': '#ff6b6b',
  'today-line': '#666666',
  'real-data': 'rgba(46, 125, 50, 0.1)'
};

// カスタムツールチップ
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as YearData;
  const year = parseInt(label);
  
  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
      <div className="font-medium mb-2 flex items-center gap-2">
        {year}年
        {data.isRealData && (
          <Badge variant="outline" className="text-xs">実績</Badge>
        )}
      </div>
      
      {/* 年齢表示 */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">家族年齢</div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(data.ageOverlay).slice(0, 4).map(([name, age]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span>{age}歳</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* データ値表示 - フル桁+万円併記 */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-green-600">年間収入:</span>
          <span className="font-medium text-xs">{formatCurrencyWithManyen(data.income)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-600">年間支出:</span>
          <span className="font-medium text-xs">{formatCurrencyWithManyen(data.expense)}</span>
        </div>
        {data.eventCost > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-orange-600">イベント:</span>
            <span>{formatCurrencyWithManyen(data.eventCost)}</span>
          </div>
        )}
        <div className="flex justify-between items-center border-t pt-2">
          <span className="text-blue-600">年間収支:</span>
          <span className={`font-medium text-xs ${data.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrencyWithManyen(data.annualCashFlow)}
          </span>
        </div>
        <div className="flex justify-between items-center font-medium">
          <span className="text-primary">累積資産:</span>
          <span className="text-primary text-xs">{formatCurrencyWithManyen(data.cumulativeAssets)}</span>
        </div>
      </div>
    </div>
  );
};

export function DChartV2({ 
  data, 
  height = 480, 
  showControls = true,
  events = [],
  onEventClick,
  className = ""
}: DChartV2Props) {
  const [viewMode, setViewMode] = useState<'nominal' | 'real'>('nominal');
  const [timeScale, setTimeScale] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  // 分析期間のデフォルトを「全期間」に変更
  const [analysisHorizon, setAnalysisHorizon] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  // 今日ライン
  const currentYear = new Date().getFullYear();
  const todayLineYear = currentYear.toString();

  // 実績データの範囲
  const realDataEnd = data.findIndex(d => !d.isRealData);
  const hasRealData = realDataEnd > 0;

  // 家族メンバーを抽出（年齢オーバーレイ用）
  const familyMembers = data.length > 0 ? Object.keys(data[0].ageOverlay) : [];

  // 分析期間でデータフィルタリング
  const getFilteredData = () => {
    switch (analysisHorizon) {
      case 'short':
        return data.slice(0, 10); // 10年
      case 'medium':
        return data.slice(0, 20); // 20年
      case 'long':
        return data.slice(0, 30); // 30年
      case 'all':
      default:
        return data; // 全期間
    }
  };

  const filteredData = getFilteredData();

  // X軸のtick値（5年間隔）
  const xAxisTicks = filteredData.filter((_, index) => index % 5 === 0).map(d => d.year);

  // カスタム凡例（明確化）
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex items-center justify-center gap-6 mb-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            {entry.dataKey === 'cumulativeAssets' ? (
              // 累積資産：線+エリアアイコン
              <div className="flex items-center">
                <div className="w-4 h-1 bg-green-700 mr-1"></div>
                <div className="w-4 h-2" style={{ backgroundColor: SAFE_COLORS['assets-area'] }}></div>
              </div>
            ) : (
              // 年間収支：バーアイコン
              <div className="w-3 h-4" style={{ backgroundColor: entry.color }}></div>
            )}
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* コントロール */}
      {showControls && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">表示:</Label>
              <Select value={viewMode} onValueChange={(value: 'nominal' | 'real') => setViewMode(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nominal">名目</SelectItem>
                  <SelectItem value="real">実質</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm">期間:</Label>
              <Select value={timeScale} onValueChange={(value: 'yearly' | 'monthly') => setTimeScale(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">年次</SelectItem>
                  <SelectItem value="monthly">月次</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 分析期間選択 */}
            <div className="flex items-center gap-2">
              <Label className="text-sm">分析期間:</Label>
              <Select value={analysisHorizon} onValueChange={(value: 'all' | 'short' | 'medium' | 'long') => setAnalysisHorizon(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="short">10年</SelectItem>
                  <SelectItem value="medium">20年</SelectItem>
                  <SelectItem value="long">30年</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {familyMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="年齢基準" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* 不要なラベルを削除し、実績がある場合のみ表示 */}
          {hasRealData && (
            <Badge variant="outline" className="text-xs">
              実績反映
            </Badge>
          )}
        </div>
      )}

      {/* D-Chart v2 - 二段チャート */}
      <div style={{ height: `${height}px` }} className="border rounded-lg bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={filteredData} 
            margin={{ top: 60, right: 30, left: 40, bottom: 60 }}
          >
            {/* グリッド */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            {/* 下側X軸（西暦） */}
            <XAxis 
              dataKey="year"
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
              ticks={xAxisTicks}
            />
            
            {/* 上側X軸（年齢） */}
            <XAxis 
              xAxisId="age"
              dataKey="year"
              orientation="top"
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12 }}
              tickFormatter={(year) => {
                const yearData = filteredData.find(d => d.year === year);
                if (!yearData) return '';
                
                if (selectedPerson && yearData.ageOverlay[selectedPerson]) {
                  return `${yearData.ageOverlay[selectedPerson]}歳`;
                }
                return `${yearData.primaryAge}歳`;
              }}
              ticks={xAxisTicks}
            />
            
            {/* 左側Y軸（累積資産） - 万円固定 */}
            <YAxis 
              yAxisId="assets"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrencyAxis}
              domain={['dataMin', 'dataMax']}
            />
            
            {/* 右側Y軸（年間収支） - 万円固定 */}
            <YAxis 
              yAxisId="flow"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrencyAxis}
            />
            
            {/* ツールチップ */}
            <Tooltip content={<CustomTooltip />} />
            
            {/* カスタム凡例 */}
            <Legend content={<CustomLegend />} />
            
            {/* 今日ライン */}
            {hasRealData && (
              <ReferenceLine 
                x={todayLineYear} 
                stroke={SAFE_COLORS['today-line']} 
                strokeDasharray="2 2"
                strokeWidth={1}
                label={{ 
                  value: "今日", 
                  position: "insideTopRight",
                  style: { fontSize: 10, fill: SAFE_COLORS['today-line'] }
                }}
              />
            )}
            
            {/* イベント縦線 */}
            {events.map(event => (
              <ReferenceLine
                key={`${event.year}-${event.name}`}
                x={event.year.toString()}
                stroke={SAFE_COLORS['event-line']}
                strokeDasharray="5 5"
                strokeWidth={1}
                label={{ 
                  value: event.name, 
                  position: "insideTopRight",
                  style: { fontSize: 10, fill: SAFE_COLORS['event-line'] }
                }}
                onClick={() => onEventClick?.(event)}
                style={{ cursor: onEventClick ? 'pointer' : 'default' }}
              />
            ))}
            
            {/* 上段: 累積資産（エリア+線チャート） - 明確な凡例 */}
            <Area
              yAxisId="assets"
              type="monotone"
              dataKey="cumulativeAssets"
              fill={SAFE_COLORS['assets-area']}
              stroke={SAFE_COLORS.assets}
              strokeWidth={3}
              name="累積資産（万円）"
              connectNulls={false}
            />
            
            {/* 下段: 年間収支（バーチャート） - 明確な凡例 */}
            <Bar
              yAxisId="flow"
              dataKey="annualCashFlow"
              fill={SAFE_COLORS['cashflow-positive']}
              name="年間収支（万円）"
              opacity={0.8}
            />
            
            {/* ゼロライン */}
            <ReferenceLine 
              y={0} 
              stroke="#999" 
              strokeDasharray="2 2" 
              strokeWidth={1}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 実績シェード表示（説明） */}
      {hasRealData && (
        <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
          <Eye className="h-3 w-3 inline mr-1" />
          実績データは{currentYear}年まで反映されています。
        </div>
      )}
    </div>
  );
}