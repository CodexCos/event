import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs shadow-card bg-white border border-dark-700">
      <p className="font-semibold text-dark-100">{payload[0].name}</p>
      <p className="text-dark-400">{payload[0].value} events ({payload[0].payload.percent}%)</p>
    </div>
  );
};

const CategoryPieChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const enriched = data.map(d => ({ ...d, percent: Math.round((d.count / total) * 100) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={enriched}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={3}
        >
          {enriched.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#57534e', fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
