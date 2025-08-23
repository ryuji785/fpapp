import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/client';

export interface BudgetPlan {
  id: string;
  title: string;
  totalAmount: number;
}

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await apiClient.get<BudgetPlan[]>('/budgets');
      return res.data;
    },
  });
}
