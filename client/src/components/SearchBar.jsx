import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search...', onSearch, className = '' }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
        id="search-bar"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
