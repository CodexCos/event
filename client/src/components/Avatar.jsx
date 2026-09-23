import React from 'react';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const AVATAR_COLORS = [
  'bg-[#014baa] text-white',
  'bg-[#4f46e5] text-white',
  'bg-[#7c3aed] text-white',
  'bg-[#0d9488] text-white',
  'bg-[#059669] text-white',
  'bg-[#e11d48] text-white',
  'bg-[#d97706] text-white',
];

const Avatar = ({ name, size = 'md', className = '' }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const colorClass = React.useMemo(() => {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }, [name]);

  return (
    <div className={`${sizes[size]} rounded-full shrink-0 flex items-center justify-center font-bold tracking-wider ${colorClass} ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
