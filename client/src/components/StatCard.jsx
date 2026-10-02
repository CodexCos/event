import React from 'react';

const colors = {
  primary: { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
  accent:  { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
  emerald: { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
  cyan:    { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
  amber:   { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
  red:     { bg: 'bg-blue-50', border: 'border-[#014baa]/20', text: 'text-[#014baa]' },
};

const StatCard = ({ label, value, icon: Icon, trend, color = 'primary', subtitle }) => {
  const cfg = colors[color] || colors.primary;

  return (
    <div className={`glass-card p-5 hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-dark-50 mt-1">{value}</p>
          {subtitle && <p className="text-dark-400 text-xs mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-semibold ${trend >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
