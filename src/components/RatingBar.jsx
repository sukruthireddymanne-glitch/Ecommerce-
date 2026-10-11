import React from 'react';
import { Star } from 'lucide-react';

const RatingBar = ({ star, count, percentage }) => {
  return (
    <div className="rating-bar-row">
      <div className="rating-bar-label">
        <span>{star}</span>
        <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
      </div>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${Math.min(100, percentage)}%` }} />
      </div>
      <div className="rating-bar-count">
        {count} ({percentage}%)
      </div>
    </div>
  );
};

export default RatingBar;
