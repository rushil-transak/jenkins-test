import { useState, useEffect } from 'react';
import { Card, Badge, ProgressBar } from '@budget/ui';
import {
  CATEGORIES,
  getCategoryColor,
  getBudgets,
  getExpenses,
  formatCurrency,
  calculatePercentage,
  groupExpensesByCategory,
  getTotalBudget,
  getTotalAmount,
} from '@budget/utils';

export default function Summary() {
  const [budgets, setBudgets] = useState(() => getBudgets());
  const [expenses, setExpenses] = useState(() => getExpenses());

  // Listen for updates from sibling MFEs via custom events
  useEffect(() => {
    const onBudgets = (e) => setBudgets(e.detail);
    const onExpenses = (e) => setExpenses(e.detail);

    window.addEventListener('budget-app:budgets-updated', onBudgets);
    window.addEventListener('budget-app:expenses-updated', onExpenses);

    return () => {
      window.removeEventListener('budget-app:budgets-updated', onBudgets);
      window.removeEventListener('budget-app:expenses-updated', onExpenses);
    };
  }, []);

  // Also poll localStorage so standalone mode stays in sync
  useEffect(() => {
    const interval = setInterval(() => {
      setBudgets(getBudgets());
      setExpenses(getExpenses());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const expensesByCategory = groupExpensesByCategory(expenses);
  const totalBudget = getTotalBudget(budgets);
  const totalSpent = getTotalAmount(expenses);
  const remaining = totalBudget - totalSpent;
  const overallPct = calculatePercentage(totalSpent, totalBudget);

  const activeCategories = CATEGORIES.filter(
    (cat) => parseFloat(budgets[cat] || 0) > 0 || (expensesByCategory[cat] || 0) > 0
  );

  const isEmpty = totalBudget === 0 && expenses.length === 0;

  if (isEmpty) {
    return (
      <Card>
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#9CA3AF',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ margin: '0 0 8px', color: '#374151', fontWeight: '600' }}>
            No data yet
          </h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Go to <strong>Budget Setup</strong> to set your monthly limits, then add expenses
            in <strong>Expenses</strong>.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Overview cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <Card style={{ background: '#EFF6FF', boxShadow: 'none', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
            TOTAL BUDGET
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#1E40AF' }}>
            {formatCurrency(totalBudget)}
          </div>
          <div style={{ fontSize: '12px', color: '#3B82F6', marginTop: '4px' }}>
            {CATEGORIES.filter((c) => parseFloat(budgets[c] || 0) > 0).length} categories
          </div>
        </Card>

        <Card style={{ background: '#FFFBEB', boxShadow: 'none', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '11px', color: '#D97706', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
            TOTAL SPENT
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#92400E' }}>
            {formatCurrency(totalSpent)}
          </div>
          <div style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>
            {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
          </div>
        </Card>

        <Card
          style={{
            background: remaining >= 0 ? '#ECFDF5' : '#FEF2F2',
            boxShadow: 'none',
            border: `1px solid ${remaining >= 0 ? '#A7F3D0' : '#FECACA'}`,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: remaining >= 0 ? '#059669' : '#DC2626',
              fontWeight: '600',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}
          >
            {remaining >= 0 ? 'REMAINING' : 'OVER BUDGET'}
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: remaining >= 0 ? '#065F46' : '#991B1B',
            }}
          >
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: remaining >= 0 ? '#10B981' : '#EF4444',
              marginTop: '4px',
            }}
          >
            {remaining >= 0 ? `${100 - overallPct}% headroom` : 'exceeded limit'}
          </div>
        </Card>
      </div>

      {/* Overall progress */}
      {totalBudget > 0 && (
        <Card title="Overall Usage" style={{ marginBottom: '16px' }}>
          <ProgressBar percentage={overallPct} color="#4F46E5" />
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#6B7280' }}>
            {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudget)} budgeted (
            {overallPct}%)
          </p>
        </Card>
      )}

      {/* Per-category breakdown */}
      {activeCategories.length > 0 && (
        <Card title="Category Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeCategories.map((category) => {
              const budget = parseFloat(budgets[category] || 0);
              const spent = expensesByCategory[category] || 0;
              const pct = calculatePercentage(spent, budget);
              const color = getCategoryColor(category);
              const isOver = spent > budget && budget > 0;

              return (
                <div key={category}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge label={category} color={color} />
                      {budget === 0 && (
                        <span style={{ fontSize: '11px', color: '#D1D5DB' }}>
                          no budget set
                        </span>
                      )}
                      {isOver && (
                        <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '500' }}>
                          over budget!
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: isOver ? '#EF4444' : '#111827' }}>
                        {formatCurrency(spent)}
                      </span>
                      {budget > 0 && (
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          {' '}/{' '}{formatCurrency(budget)}
                        </span>
                      )}
                    </div>
                  </div>
                  {budget > 0 && <ProgressBar percentage={pct} color={color} />}
                  {budget === 0 && (
                    <div
                      style={{
                        height: '8px',
                        background: color + '30',
                        borderRadius: '9999px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
