import React from 'react';

const variants = {
  primary: { background: '#4F46E5', color: '#fff' },
  secondary: { background: '#E5E7EB', color: '#374151' },
  danger: { background: '#EF4444', color: '#fff' },
  success: { background: '#10B981', color: '#fff' },
  ghost: { background: 'transparent', color: '#4F46E5', border: '1px solid #4F46E5' },
};

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  type = 'button',
  style,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'opacity 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        opacity: disabled ? 0.6 : 1,
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
