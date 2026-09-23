import React from 'react';

const CATEGORIES = ['All', 'Technology', 'Music', 'Sports', 'Business', 'Art', 'Food'];

const FilterBar = ({ activeCategory, onCategoryChange, className = '' }) => (
  <div className={`flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible gap-2 pb-2 sm:pb-0 scrollbar-none ${className}`}>
    {CATEGORIES.map(cat => (
      <button
        key={cat}
        id={`filter-${cat.toLowerCase()}`}
        onClick={() => onCategoryChange(cat)}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shrink-0 ${
          activeCategory === cat
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'bg-dark-800 border-dark-700 text-dark-400 hover:text-primary-600 hover:border-primary-600/30'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default FilterBar;
