export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Entertainment: '#45B7D1',
  Health: '#96CEB4',
  Shopping: '#FFEAA7',
  Bills: '#DDA0DD',
  Other: '#B0BEC5',
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculatePercentage(spent, budget) {
  if (!budget || budget === 0) return 0;
  return Math.round((spent / budget) * 100);
}

export function groupExpensesByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + parseFloat(amount);
    return acc;
  }, {});
}

export function getTotalAmount(items) {
  return items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
}

export function getTotalBudget(budgets) {
  return Object.values(budgets).reduce((sum, val) => sum + parseFloat(val || 0), 0);
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
}

export function getBudgets() {
  try {
    return JSON.parse(localStorage.getItem('budget-app:budgets') || '{}');
  } catch {
    return {};
  }
}

export function saveBudgets(budgets) {
  localStorage.setItem('budget-app:budgets', JSON.stringify(budgets));
}

export function getExpenses() {
  try {
    return JSON.parse(localStorage.getItem('budget-app:expenses') || '[]');
  } catch {
    return [];
  }
}

export function saveExpenses(expenses) {
  localStorage.setItem('budget-app:expenses', JSON.stringify(expenses));
}

export function emitBudgetUpdate(budgets) {
  window.dispatchEvent(
    new CustomEvent('budget-app:budgets-updated', { detail: budgets })
  );
}

export function emitExpenseUpdate(expenses) {
  window.dispatchEvent(
    new CustomEvent('budget-app:expenses-updated', { detail: expenses })
  );
}
