import React, { Suspense, useState } from 'react';
import Header from './components/Header.jsx';

// Remote components loaded via Vite Module Federation.
// Remotes must be running (vite preview) on ports 3001-3003 before starting the shell.
const BudgetInput = React.lazy(() => import('mfeBudgetInput/BudgetInput'));
const ExpenseTracker = React.lazy(() => import('mfeExpenseTracker/ExpenseTracker'));
const Summary = React.lazy(() => import('mfeSummary/Summary'));

const tabs = [
  { id: 'summary', label: 'Dashboard', icon: '📊' },
  { id: 'budget', label: 'Budget Setup', icon: '🎯' },
  { id: 'expenses', label: 'Expenses', icon: '📋' },
];

function MfeLoader({ name }) {
  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '14px',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
      Loading {name} micro-frontend...
    </div>
  );
}

function MfeError({ name, error }) {
  return (
    <div
      style={{
        padding: '32px',
        background: '#FEF2F2',
        borderRadius: '12px',
        border: '1px solid #FECACA',
        color: '#991B1B',
      }}
    >
      <strong>Failed to load {name} MFE</strong>
      <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#B91C1C' }}>
        Make sure the remote is running:{' '}
        <code
          style={{
            background: '#FEE2E2',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          npm run build:remotes && npm run dev:servers
        </code>
      </p>
      {error && (
        <pre
          style={{
            marginTop: '12px',
            fontSize: '11px',
            color: '#9CA3AF',
            overflow: 'auto',
          }}
        >
          {error.message}
        </pre>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <MfeError name={this.props.name} error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F3F4F6',
      }}
    >
      <Header />

      <nav
        style={{
          background: '#fff',
          borderBottom: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            display: 'flex',
            padding: '0 20px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
                borderBottom: activeTab === tab.id ? '2px solid #4F46E5' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '-1px',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '28px 20px',
        }}
      >
        {activeTab === 'summary' && (
          <ErrorBoundary name="Summary">
            <Suspense fallback={<MfeLoader name="Summary" />}>
              <Summary />
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === 'budget' && (
          <ErrorBoundary name="Budget Input">
            <Suspense fallback={<MfeLoader name="Budget Input" />}>
              <BudgetInput />
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === 'expenses' && (
          <ErrorBoundary name="Expense Tracker">
            <Suspense fallback={<MfeLoader name="Expense Tracker" />}>
              <ExpenseTracker />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}
