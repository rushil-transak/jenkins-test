import { useState } from 'react';
import { Button, Card, Input, Select, Badge } from '@budget/ui';
import {
  CATEGORIES,
  getCategoryColor,
  getExpenses,
  saveExpenses,
  emitExpenseUpdate,
  formatCurrency,
  formatDate,
} from '@budget/utils';

const blankForm = () => ({
  category: CATEGORIES[0],
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
});

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(() => getExpenses());
  const [form, setForm] = useState(blankForm);
  const [filter, setFilter] = useState('All');

  const updateForm = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;

    const newExpense = {
      id: Date.now().toString(),
      category: form.category,
      amount,
      description: form.description.trim(),
      date: form.date,
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    emitExpenseUpdate(updated);
    setForm(blankForm);
  };

  const handleDelete = (id) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
    emitExpenseUpdate(updated);
  };

  const categoryOptions = ['All', ...CATEGORIES];
  const filtered =
    filter === 'All' ? expenses : expenses.filter((e) => e.category === filter);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      {/* Add expense form */}
      <Card title="Add Expense" style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => updateForm('category', e.target.value)}
            options={CATEGORIES}
          />
          <Input
            label="Amount ($)"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => updateForm('amount', e.target.value)}
            placeholder="0.00"
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            placeholder="What did you spend on?"
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => updateForm('date', e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={!form.amount || parseFloat(form.amount) <= 0}
        >
          + Add Expense
        </Button>
      </Card>

      {/* Expense list */}
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Expenses
            <span
              style={{
                marginLeft: '8px',
                fontSize: '13px',
                fontWeight: '400',
                color: '#9CA3AF',
              }}
            >
              ({filtered.length})
            </span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {filter !== 'All' && (
              <span style={{ fontSize: '13px', color: '#374151' }}>
                {formatCurrency(totalFiltered)}
              </span>
            )}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                fontSize: '13px',
                color: '#374151',
                background: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#D1D5DB',
              fontSize: '14px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
            {expenses.length === 0 ? 'No expenses yet. Add your first one above.' : 'No expenses in this category.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((expense) => (
              <div
                key={expense.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge
                    label={expense.category}
                    color={getCategoryColor(expense.category)}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {expense.description || expense.category}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      lineHeight: 1,
                    }}
                    title="Delete expense"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {/* Total row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '10px 14px 0',
                borderTop: '1px solid #F3F4F6',
                marginTop: '4px',
                fontSize: '14px',
                color: '#374151',
              }}
            >
              <span>
                Total:{' '}
                <strong style={{ color: '#111827' }}>
                  {formatCurrency(totalFiltered)}
                </strong>
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
