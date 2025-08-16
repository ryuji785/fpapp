/**
 * 日本円のフォーマッタユーティリティ（万円固定対応）
 * 千万単位は削除し、万円単位に統一
 */

// フル桁表示（ツールチップ用）
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '¥0';
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

// 万円併記フォーマット（ツールチップ用）
export const formatCurrencyWithManyen = (amount: number): string => {
  const fullAmount = formatCurrency(amount);
  const manYenValue = (amount / 10000).toFixed(1);
  return `${fullAmount} (${manYenValue}万円)`;
};

// グラフ軸専用 - 万円固定
export const formatCurrencyAxis = (amount: number): string => {
  if (isNaN(amount)) return '0';
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 100000000) {
    // 1億以上 - 万円単位で表示
    const value = absAmount / 10000;
    if (value >= 1000) {
      return `${sign}${Math.round(value / 1000) * 1000}万`;
    } else {
      return `${sign}${Math.round(value)}万`;
    }
  } else if (absAmount >= 10000) {
    // 1万以上 - 万円単位
    const value = absAmount / 10000;
    if (Number.isInteger(value)) {
      return `${sign}${value}万`;
    } else {
      return `${sign}${value.toFixed(1)}万`;
    }
  } else if (absAmount >= 1000) {
    // 1000以上1万未満 - 千円単位
    const value = absAmount / 1000;
    return `${sign}${Math.round(value)}千`;
  } else {
    // 1000未満 - 円単位
    return `${sign}${Math.round(absAmount)}`;
  }
};

// 短縮表示（カード用）
export const formatCurrencyShort = (amount: number): string => {
  if (isNaN(amount)) return '¥0';
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 100000000) {
    // 1億以上
    const value = absAmount / 100000000;
    return `${sign}¥${value >= 10 ? Math.round(value) : value.toFixed(1)}億`;
  } else if (absAmount >= 10000) {
    // 1万以上 - 万円表示
    const value = absAmount / 10000;
    return `${sign}¥${value >= 100 ? Math.round(value) : value.toFixed(1)}万`;
  } else if (absAmount >= 1000) {
    // 1000以上 - 千円表示
    const value = absAmount / 1000;
    return `${sign}¥${Math.round(value)}千`;
  } else {
    // 1000未満
    return `${sign}¥${Math.round(absAmount).toLocaleString('ja-JP')}`;
  }
};

// パーセント表示
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// 年数表示
export const formatYears = (years: number): string => {
  if (years === 1) return '1年';
  return `${years}年`;
};

// 月数表示
export const formatMonths = (months: number): string => {
  if (months === 1) return '1ヶ月';
  return `${months}ヶ月`;
};

// 乖離率表示（+/-付き）
export const formatVarianceRate = (variance: number, total: number): string => {
  if (total === 0) return '0%';
  const rate = (variance / total) * 100;
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};

// 乖離金額表示（+/-付き）
export const formatVarianceAmount = (variance: number): string => {
  if (variance === 0) return '¥0';
  const sign = variance > 0 ? '+' : '';
  return `${sign}${formatCurrencyShort(Math.abs(variance))}`;
};

// グラフの数値軸用フォーマッタ（Recharts用）- 万円固定
export const createAxisFormatter = (unit: 'currency' | 'percentage' = 'currency') => {
  return (value: number) => {
    if (unit === 'percentage') {
      return formatPercentage(value);
    }
    return formatCurrencyAxis(value);
  };
};

// ツールチップ用フォーマッタ（Recharts用）- フル桁+万円併記
export const createTooltipFormatter = (name?: string) => {
  return (value: number, displayName?: string) => {
    const formattedValue = formatCurrencyWithManyen(value);
    const finalName = displayName || name || '';
    return [formattedValue, finalName];
  };
};

// 二重X軸用の年齢計算ユーティリティ
export const calculateAgeFromYear = (year: number, baseYear: number, baseAge: number): number => {
  return baseAge + (year - baseYear);
};

// 年齢オーバーレイ用のデータ変換
export const addAgeOverlay = (data: any[], baseYear: number, familyMembers: any[]) => {
  return data.map(item => {
    const year = parseInt(item.year);
    const ageOverlay: { [key: string]: number } = {};
    
    familyMembers.forEach(member => {
      ageOverlay[member.name] = calculateAgeFromYear(year, baseYear, member.currentAge);
    });
    
    return {
      ...item,
      ageOverlay
    };
  });
};