import React from 'react';

const CATEGORY_COLORS = {
  Technology: 'bg-blue-50 text-[#014baa] border-[#014baa]/30',
  Music:       'bg-purple-50 text-purple-700 border-purple-200',
  Sports:      'bg-cyan-50 text-cyan-700 border-cyan-200',
  Business:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  Art:         'bg-amber-50 text-amber-800 border-amber-200',
  Food:        'bg-red-50 text-red-700 border-red-200',
  default:     'bg-stone-100 text-stone-600 border-stone-200',
};

const STATUS_COLORS = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending:   'bg-amber-50 text-amber-800 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  attended:  'bg-blue-50 text-[#014baa] border-[#014baa]/20',
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive:  'bg-stone-100 text-stone-500 border-stone-200',
  featured:  'bg-blue-50 text-[#014baa] border-[#014baa]/40 font-semibold',
  trending:  'bg-orange-50 text-orange-700 border-orange-200',
  full:      'bg-red-50 text-red-700 border-red-200',
  draft:     'bg-stone-800 text-stone-300 border-stone-700',
};

const Badge = ({ children, category, status, className = '' }) => {
  let colorClass = CATEGORY_COLORS.default;
  if (category) colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  if (status) colorClass = STATUS_COLORS[status] || STATUS_COLORS.confirmed;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
