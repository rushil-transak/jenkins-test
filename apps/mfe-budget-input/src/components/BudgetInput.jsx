import { useState } from 'react';
import { Button, Card } from '@budget/ui';
import {
  CATEGORIES,
  CATEGORY_COLORS,
  getBudgets,
  saveBudgets,
  emitBudgetUpdate,
  formatCurrency,
} from '@budget/utils';

export default function BudgetInput() {
  const [budgets, setBudgets] = useState(() => getBudgets());
  const [saved, setSaved] = useState(false);

  const handleChange = (category, value) => {
    setBudgets((prev) => ({ ...prev, [category]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    const parsed = {};
    CATEGORIES.forEach((cat) => {
      parsed[cat] = parseFloat(budgets[cat] || 0);
    });
    saveBudgets(parsed);
    emitBudgetUpdate(parsed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const empty = {};
    CATEGORIES.forEach((cat) => (empty[cat] = 0));
    setBudgets(empty);
    saveBudgets(empty);
    emitBudgetUpdate(empty);
    setSaved(false);
  };

  const totalBudget = CATEGORIES.reduce(
    (sum, cat) => sum + parseFloat(budgets[cat] || 0),
    0
  );

  return (
    <div>
      <Card
        title="Monthly Budget Setup"
        style={{ marginBottom: '16px' }}
      >
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6B7280' }}>
          Set your spending limit for each category. These budgets are shared with
          the other micro-frontends via localStorage and custom events.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          {CATEGORIES.map((category) => (
            <div key={category}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: CATEGORY_COLORS[category],
                    flexShrink: 0,
                  }}
                />
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                  {category}
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    fontSize: '14px',
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={budgets[category] || ''}
                  onChange={(e) => handleChange(category, e.target.value)}
                  placeholder="0"
                  style={{
                    padding: '8px 12px 8px 24px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#111827',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #F3F4F6',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '2px' }}>
              TOTAL MONTHLY BUDGET
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#111827' }}>
              {formatCurrency(totalBudget)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button
              onClick={handleSave}
              variant={saved ? 'success' : 'primary'}
            >
              {saved ? '✓ Saved!' : 'Save Budget'}
            </Button>
          </div>
        </div>
      </Card>

      <div
        style={{
          padding: '12px 16px',
          background: '#EFF6FF',
          borderRadius: '8px',
          border: '1px solid #BFDBFE',
          fontSize: '13px',
          color: '#1D4ED8',
        }}
      >
        Changes are broadcast to the Summary and Expense Tracker MFEs via{' '}
        <code style={{ background: '#DBEAFE', padding: '1px 5px', borderRadius: '3px' }}>
          CustomEvent
        </code>{' '}
        and persisted to{' '}
        <code style={{ background: '#DBEAFE', padding: '1px 5px', borderRadius: '3px' }}>
          localStorage
        </code>
        .
      </div>
    </div>
  );
}
