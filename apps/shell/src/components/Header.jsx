

export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        color: '#fff',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>💰</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.3px' }}>
              Budget Calculator
            </h1>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.75, letterSpacing: '0.5px' }}>
              MICRO-FRONTEND ARCHITECTURE
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['Budget Input', 'Expenses', 'Summary'].map((mfe) => (
            <span
              key={mfe}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '500',
              }}
            >
              {mfe}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
