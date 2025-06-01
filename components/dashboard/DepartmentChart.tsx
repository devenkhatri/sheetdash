'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Engineering', value: 40 },
  { name: 'Marketing', value: 25 },
  { name: 'Finance', value: 15 },
  { name: 'HR', value: 10 },
  { name: 'Sales', value: 30 },
  { name: 'Operations', value: 20 },
];

export function DepartmentChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            className="text-xs fill-muted-foreground"
          />
          <YAxis 
            className="text-xs fill-muted-foreground" 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar dataKey="value" name="Employees" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}