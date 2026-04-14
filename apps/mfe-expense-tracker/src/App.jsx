
import ExpenseTracker from './components/ExpenseTracker.jsx';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F3F4F6',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px 20px',
      }}
    >
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>📋</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#111827' }}>
              Expense Tracker
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
              mfe-expense-tracker · running standalone
            </p>
          </div>
        </div>
      </header>
      <div style={{ maxWidth: '800px' }}>
        <ExpenseTracker />
      </div>
    </div>
  );
}
