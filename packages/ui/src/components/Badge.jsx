import React from 'react';

export default function Badge({ label, color = '#4F46E5', style }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        background: color + '22',
        color: color,
        border: `1px solid ${color}44`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </span>
  );
}
