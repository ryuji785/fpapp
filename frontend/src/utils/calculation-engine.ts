/**
 * 計算エンジン - 単一ソース（v2.4対応）
 * プレビューと本画面の数値完全連動を保証
 */

export interface FamilyMember {
  id: number;
  name: string;
  currentAge: number;
  relationship: string;
  retirementAge?: number;
  schoolStartAge?: number;
}

export interface LifeEvent {
  id: number;
  name: string;
  year: number;
  amount: number;
  person: string;
  type: 'single' | 'split' | 'recurring';
}

export interface PlanAssumptions {
  planStartYear: number;
  planYears: number;
  inflationRate: number; // % per year
  investmentReturn: number; // % per year
  initialAssets: number;
  baseIncome: number;
  baseExpense: number;
  familyMembers: FamilyMember[];
  events: LifeEvent[];
}

export interface YearData {
  year: string;
  yearNum: number;
  primaryAge: number; // 主要人物の年齢
  ageOverlay: { [name: string]: number }; // 全家族の年齢
  income: number;
  expense: number;
  eventCost: number;
  annualCashFlow: number;
  cumulativeAssets: number;
  isRealData: boolean; // 実績データかどうか
}

export interface ScenarioSnapshot {
  id: string;
  name: string;
  assumptions: PlanAssumptions;
  assumptionsHash: string;
  calculatedAt: Date;
  finalAssets: number;
  averageAnnualCashFlow: number;
  yearsUntilNegative: number | null;
  series: YearData[];
}

// ハッシュ生成（設定変更検知用）
const generateAssumptionsHash = (assumptions: PlanAssumptions): string => {
  const key = JSON.stringify({
    planStartYear: assumptions.planStartYear,
    planYears: assumptions.planYears,
    inflationRate: assumptions.inflationRate,
    investmentReturn: assumptions.investmentReturn,
    initialAssets: assumptions.initialAssets,
    baseIncome: assumptions.baseIncome,
    baseExpense: assumptions.baseExpense,
    eventsHash: assumptions.events.map(e => `${e.year}-${e.amount}`).join(',')
  });
  
  // 簡易ハッシュ
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return hash.toString(36);
};

// 年齢計算ユーティリティ
const calculateAge = (year: number, baseYear: number, baseAge: number): number => {
  return baseAge + (year - baseYear);
};

// メイン計算ロジック
const calculateScenario = (assumptions: PlanAssumptions): YearData[] => {
  const { 
    planStartYear, 
    planYears, 
    inflationRate, 
    investmentReturn, 
    initialAssets,
    baseIncome,
    baseExpense,
    familyMembers,
    events 
  } = assumptions;

  const inflationRateDecimal = inflationRate / 100;
  const investmentReturnDecimal = investmentReturn / 100;
  const primaryPerson = familyMembers.find(m => m.relationship === '本人') || familyMembers[0];
  
  let cumulativeAssets = initialAssets;
  const currentYear = new Date().getFullYear();
  
  return Array.from({ length: planYears }, (_, i) => {
    const year = planStartYear + i;
    const isRealData = year <= currentYear;
    
    // 年齢オーバーレイ計算
    const ageOverlay: { [name: string]: number } = {};
    familyMembers.forEach(member => {
      ageOverlay[member.name] = calculateAge(year, planStartYear, member.currentAge);
    });
    
    const primaryAge = primaryPerson ? ageOverlay[primaryPerson.name] : 35 + i;
    
    // 収入計算（昇給率2%/年）
    const income = Math.round(baseIncome * Math.pow(1.02, i));
    
    // 支出計算（インフレ連動）
    const baseExpenseInflated = Math.round(baseExpense * Math.pow(1 + inflationRateDecimal, i));
    
    // イベントコスト
    const yearEvents = events.filter(e => e.year === year);
    const eventCost = yearEvents.reduce((sum, e) => sum + e.amount, 0);
    
    const totalExpense = baseExpenseInflated + eventCost;
    const annualCashFlow = income - totalExpense;
    
    // 累積資産計算（投資収益含む）
    cumulativeAssets = Math.round((cumulativeAssets + annualCashFlow) * (1 + investmentReturnDecimal));
    cumulativeAssets = Math.max(cumulativeAssets, 0); // 負債は0に制限
    
    return {
      year: year.toString(),
      yearNum: year,
      primaryAge,
      ageOverlay,
      income,
      expense: totalExpense,
      eventCost,
      annualCashFlow,
      cumulativeAssets,
      isRealData
    };
  });
};

// スナップショット生成
export const generateSnapshot = (
  assumptions: PlanAssumptions, 
  name: string = 'Base'
): ScenarioSnapshot => {
  const assumptionsHash = generateAssumptionsHash(assumptions);
  const series = calculateScenario(assumptions);
  
  const finalAssets = series[series.length - 1]?.cumulativeAssets || 0;
  const totalCashFlow = series.reduce((sum, d) => sum + d.annualCashFlow, 0);
  const averageAnnualCashFlow = Math.round(totalCashFlow / series.length);
  
  // マイナス転落年を検索
  const negativeYear = series.find(d => d.cumulativeAssets <= 0);
  const yearsUntilNegative = negativeYear ? negativeYear.yearNum - assumptions.planStartYear : null;
  
  return {
    id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    assumptions,
    assumptionsHash,
    calculatedAt: new Date(),
    finalAssets,
    averageAnnualCashFlow,
    yearsUntilNegative,
    series
  };
};

// スナップショット管理
class SnapshotManager {
  private snapshots: Map<string, ScenarioSnapshot> = new Map();
  private listeners: Set<(snapshot: ScenarioSnapshot) => void> = new Set();

  subscribe(listener: (snapshot: ScenarioSnapshot) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(snapshot: ScenarioSnapshot) {
    this.listeners.forEach(listener => listener(snapshot));
  }

  getSnapshot(id: string): ScenarioSnapshot | null {
    return this.snapshots.get(id) || null;
  }

  updateSnapshot(id: string, assumptions: PlanAssumptions, name?: string): ScenarioSnapshot {
    const snapshot = generateSnapshot(assumptions, name);
    this.snapshots.set(id, snapshot);
    this.notify(snapshot);
    return snapshot;
  }

  createSnapshot(assumptions: PlanAssumptions, name?: string): ScenarioSnapshot {
    const snapshot = generateSnapshot(assumptions, name);
    this.snapshots.set(snapshot.id, snapshot);
    this.notify(snapshot);
    return snapshot;
  }

  needsRecalculation(id: string, assumptions: PlanAssumptions): boolean {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) return true;
    
    const currentHash = generateAssumptionsHash(assumptions);
    return snapshot.assumptionsHash !== currentHash;
  }
}

// シングルトンインスタンス
export const snapshotManager = new SnapshotManager();

// React Hook
import { useState, useEffect } from 'react';

export const useSnapshot = (snapshotId: string | null) => {
  const [snapshot, setSnapshot] = useState<ScenarioSnapshot | null>(null);

  useEffect(() => {
    if (!snapshotId) {
      setSnapshot(null);
      return;
    }

    const currentSnapshot = snapshotManager.getSnapshot(snapshotId);
    setSnapshot(currentSnapshot);

    const unsubscribe = snapshotManager.subscribe((updatedSnapshot) => {
      if (updatedSnapshot.id === snapshotId) {
        setSnapshot(updatedSnapshot);
      }
    });

    return unsubscribe;
  }, [snapshotId]);

  return snapshot;
};

// デフォルト前提条件
export const getDefaultAssumptions = (): PlanAssumptions => ({
  planStartYear: 2025,
  planYears: 30,
  inflationRate: 2.0,
  investmentReturn: 3.0,
  initialAssets: 1000000,
  baseIncome: 5000000,
  baseExpense: 3500000,
  familyMembers: [
    { id: 1, name: '田中 太郎', currentAge: 35, relationship: '本人', retirementAge: 65 },
    { id: 2, name: '田中 花子', currentAge: 33, relationship: '配偶者', retirementAge: 65 },
    { id: 3, name: '田中 一郎', currentAge: 5, relationship: '子', schoolStartAge: 6 }
  ],
  events: [
    { id: 1, name: '住宅購入', year: 2027, amount: 5000000, person: '田中 太郎', type: 'single' },
    { id: 2, name: '大学入学', year: 2038, amount: 2000000, person: '田中 一郎', type: 'single' }
  ]
});