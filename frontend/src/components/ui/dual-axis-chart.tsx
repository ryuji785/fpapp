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
import { Users, Calendar } from 'lucide-react';
import { formatCurrencyAxis, createTooltipFormatter, calculateAgeFromYear } from '../../utils/currency';
import { AXIS } from '../charts/axis-ids';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface FamilyMember {
  id: number;
  name: string;
  currentAge: number;
  relationship: string;
}

interface DualAxisChartProps {
  data: any[];
  familyMembers: FamilyMember[];
  baseYear: number;
  primaryPersonId?: number;
  showRealData?: boolean;
  events?: Array<{
    year: number;
    name: string;
    amount?: number;
    person?: string;
  }>;
  onEventClick?: (event: any) => void;
}

// カスタムツールチップ
const CustomTooltip = ({ active, payload, label, familyMembers, baseYear, primaryPersonId }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const year = parseInt(label);
  
  // 主要人物の年齢
  const primaryPerson = familyMembers.find(m => m.id === primaryPersonId) || familyMembers[0];
  const primaryAge = calculateAgeFromYear(year, baseYear, primaryPerson.currentAge);
  
  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
      <div className="font-medium mb-2">{year}年</div>
      
      {/* 年齢表示 */}
      <div className="mb-3 p-2 bg-gray-50 rounded">
        <div className="text-sm font-medium text-gray-700 mb-1">家族年齢</div>
        <div className="space-y-1">
          {familyMembers.slice(0, 3).map(member => {
            const age = calculateAgeFromYear(year, baseYear, member.currentAge);
            return (
              <div key={member.id} className="flex justify-between text-xs">
                <span className={member.id === primaryPersonId ? 'font-medium' : ''}>{member.name}</span>
                <span>{age}歳</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* データ値表示 */}
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium">{createTooltipFormatter()(entry.value)[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function DualAxisChart({ 
  data, 
  familyMembers, 
  baseYear, 
  primaryPersonId,
  showRealData = false,
  events = [],
  onEventClick 
}: DualAxisChartProps) {
  const [selectedAgeOverlay, setSelectedAgeOverlay] = useState<number | null>(primaryPersonId || familyMembers[0]?.id);
  const [showAllAges, setShowAllAges] = useState(false);

  const primaryPerson = familyMembers.find(m => m.id === selectedAgeOverlay) || familyMembers[0];
  
  // 年齢軸のtick値を計算
  const ageAxisTicks = data.filter((_, index) => index % 5 === 0).map(item => {
    const year = parseInt(item.year);
    const age = calculateAgeFromYear(year, baseYear, primaryPerson.currentAge);
    return { year, age };
  });

  return (
    <div className="space-y-4">
      {/* コントロール */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedAgeOverlay?.toString()} onValueChange={(value) => setSelectedAgeOverlay(parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="年齢基準" />
              </SelectTrigger>
              <SelectContent>
                {familyMembers.map(member => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant={showAllAges ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllAges(!showAllAges)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            全員年齢
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">西暦/年齢</Badge>
          {showRealData && <Badge variant="outline">実績反映</Badge>}
        </div>
      </div>

      {/* グラフ */}
      <div className="h-96">
        <ErrorBoundary>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            
            {/* 下側X軸（西暦） */}
            <XAxis 
              dataKey="year"
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            
            {/* 上側X軸（年齢） - カスタム実装 */}
            <XAxis 
              xAxisId="age"
              dataKey="year"
              orientation="top"
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12 }}
              tickFormatter={(year) => {
                const age = calculateAgeFromYear(parseInt(year), baseYear, primaryPerson.currentAge);
                return `${age}歳`;
              }}
            />
            
            {/* Y軸 */}
            <YAxis
              yAxisId={AXIS.ASSETS}
              orientation="left"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrencyAxis}
            />
            <YAxis
              yAxisId={AXIS.FLOW}
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrencyAxis}
            />

            {import.meta.env.DEV && console.debug('Chart axes ready:', AXIS.ASSETS, AXIS.FLOW)}
            
            <Tooltip 
              content={
                <CustomTooltip 
                  familyMembers={familyMembers}
                  baseYear={baseYear}
                  primaryPersonId={selectedAgeOverlay}
                />
              }
            />
            <Legend />
            
            {/* 今日ライン（実績データがある場合） */}
            {showRealData && (
              <ReferenceLine 
                x={new Date().getFullYear().toString()} 
                stroke="#666" 
                strokeDasharray="2 2"
                label={{ value: "今日", position: "insideTopRight" }}
              />
            )}
            
            {/* イベント縦線 */}
            {events.map(event => (
              <ReferenceLine
                key={`${event.year}-${event.name}`}
                x={event.year.toString()}
                stroke="#ff6b6b"
                strokeDasharray="5 5"
                label={{ 
                  value: event.name, 
                  position: "insideTopRight",
                  style: { fontSize: 10 }
                }}
                onClick={() => onEventClick?.(event)}
                style={{ cursor: onEventClick ? 'pointer' : 'default' }}
              />
            ))}
            
            {/* データ系列は親コンポーネントで定義 */}
            {/* 累積資産（エリアチャート） */}
            <Area
              yAxisId={AXIS.ASSETS}
              type="monotone"
              dataKey="cumulativeAssets"
              fill="#2E7D32"
              fillOpacity={0.3}
              stroke="#1B5E20"
              strokeWidth={2}
              name="累積資産"
            />
            
            {/* 年間収支（バーチャート） */}
            <Bar
              yAxisId={AXIS.FLOW}
              dataKey="annualCashFlow"
              fill="#388E3C"
              name="年間収支"
              opacity={0.7}
            />
            
            {/* ゼロライン */}
            <ReferenceLine y={0} yAxisId={AXIS.FLOW} stroke="#666" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </ErrorBoundary>
      </div>

      {/* 年齢オーバーレイ表示 */}
      {showAllAges && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium text-sm mb-2">現在の家族年齢</div>
          <div className="grid grid-cols-3 gap-4">
            {familyMembers.map(member => {
              const currentAge = member.currentAge;
              const endAge = calculateAgeFromYear(
                baseYear + data.length - 1, 
                baseYear, 
                currentAge
              );
              return (
                <div key={member.id} className="text-sm">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-muted-foreground">
                    {currentAge}歳 → {endAge}歳
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}