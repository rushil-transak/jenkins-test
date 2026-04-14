import React from 'react';

export default function Card({ children, title, style }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
