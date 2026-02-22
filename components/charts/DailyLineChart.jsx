'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function getLast7DaysData(complaints = []) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: d,
      count: 0,
    });
  }

  complaints.forEach((c) => {
    const created = new Date(c.createdAt);
    created.setHours(0, 0, 0, 0);
    const day = days.find((d) => d.fullDate.getTime() === created.getTime());
    if (day) day.count++;
  });

  return days.map(({ date, count }) => ({ date, count }));
}

export default function DailyLineChart({ data = [] }) {
  const chartData = getLast7DaysData(data);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
