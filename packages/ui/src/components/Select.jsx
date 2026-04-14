import React from 'react';

export default function Select({ label, id, value, onChange, options, style }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #D1D5DB',
          fontSize: '14px',
          outline: 'none',
          color: '#111827',
          background: '#fff',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
