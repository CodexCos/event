const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`${sizes[size]} rounded-full border-dark-600 border-t-primary-500 animate-spin ${className}`}
  />
);

export default Spinner;
