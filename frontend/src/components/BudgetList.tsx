import { useBudgets } from '@/features/budget/api/useBudgets';

export default function BudgetList() {
  const { data, isLoading } = useBudgets();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Budgets</h1>
      <ul className="space-y-2">
        {data?.map((b) => (
          <li key={b.id} className="border p-2 rounded">
            <span className="font-medium">{b.title}</span>: {b.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}
