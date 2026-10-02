import React from 'react';

const SINGLE_COLOR = 'bg-blue-50 text-[#014baa] border-[#014baa]/30';

const CATEGORY_COLORS = {
  Technology: SINGLE_COLOR,
  Music:      SINGLE_COLOR,
  Sports:     SINGLE_COLOR,
  Business:   SINGLE_COLOR,
  Art:        SINGLE_COLOR,
  Food:       SINGLE_COLOR,
  default:    SINGLE_COLOR,
};

const STATUS_COLORS = {
  confirmed: SINGLE_COLOR,
  pending:   SINGLE_COLOR,
  cancelled: SINGLE_COLOR,
  attended:  SINGLE_COLOR,
  active:    SINGLE_COLOR,
  inactive:  SINGLE_COLOR,
  featured:  SINGLE_COLOR,
  trending:  SINGLE_COLOR,
  full:      SINGLE_COLOR,
  draft:     SINGLE_COLOR,
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
