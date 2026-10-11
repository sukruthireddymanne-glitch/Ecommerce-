import React from 'react';

const StatCard = ({ icon: Icon, color = 'blue', label, value, subtext }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={26} strokeWidth={2.2} />}
      </div>
      <div style={{ flex: 1 }}>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
