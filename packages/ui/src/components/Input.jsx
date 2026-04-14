import React from 'react';

export default function Input({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  step,
  style,
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={{
          padding: '8px 12px',
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
  );
}
