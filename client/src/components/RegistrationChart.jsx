import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs shadow-card bg-white border border-dark-700">
      <p className="font-semibold text-dark-100 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export const RegistrationsAreaChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>

      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
      <XAxis dataKey="date" tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
      <YAxis tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="cumulative" name="Total Registrations" stroke="#014baa" fill="#014baa" fillOpacity={0.1} strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export const DailyBarChart = ({ data, dataKey = 'registrations', name = 'Daily Registrations', color = '#014baa' }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
      <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} />
      <YAxis tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey={dataKey} name={name} fill={color} radius={[4,4,0,0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const MonthlyLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
      <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} />
      <YAxis tick={{ fill: '#78716c', fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', color: '#57534e' }} />
      <Line type="monotone" dataKey="registrations" name="Registrations" stroke="#014baa" strokeWidth={2} dot={false} />
      <Line type="monotone" dataKey="events" name="Events" stroke="#7c3aed" strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);
