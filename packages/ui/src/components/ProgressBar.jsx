import React from 'react';

export default function ProgressBar({
  percentage,
  color = '#4F46E5',
  showLabel = true,
  style,
}) {
  const clamped = Math.min(Math.max(percentage || 0, 0), 100);
  const isOver = percentage > 100;

  return (
    <div style={{ ...style }}>
      <div
        style={{
          background: '#F3F4F6',
          borderRadius: '9999px',
          height: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: isOver ? '#EF4444' : color,
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            fontSize: '11px',
            color: isOver ? '#EF4444' : '#6B7280',
            marginTop: '3px',
            textAlign: 'right',
          }}
        >
          {Math.round(percentage || 0)}%
        </div>
      )}
    </div>
  );
}
