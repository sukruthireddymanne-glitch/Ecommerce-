import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  value = 0,
  onChange = null,
  readOnly = false,
  size = 20,
  showLabel = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="star-rating-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            className={`star-btn ${isFilled ? 'filled' : ''}`}
            disabled={readOnly}
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              background: 'none',
              border: 'none',
              padding: '2px',
              color: isFilled ? '#f59e0b' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              stroke={isFilled ? '#f59e0b' : '#94a3b8'}
              strokeWidth={1.75}
            />
          </button>
        );
      })}
      {showLabel && (
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginLeft: '6px' }}>
          {value ? Number(value).toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
