import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (col.sortable === false) return;
    if (sortCol === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col.key); setSortDir('asc'); }
  };

  const sorted = sortCol
    ? [...data].sort((a, b) => {
        const aVal = a[sortCol]; const bVal = b[sortCol];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-700/50">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                className={`px-4 py-3 text-left font-bold text-dark-400 ${
                  col.sortable !== false ? 'cursor-pointer hover:text-primary-600 select-none' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortCol === col.key && (
                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-dark-700/30">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 shimmer bg-dark-700 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-16 text-center text-dark-400">{emptyMessage}</td></tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={row.id || i} className="border-b border-dark-700/30 hover:bg-dark-800/40 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4 text-dark-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
