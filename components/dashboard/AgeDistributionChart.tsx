'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { age: '18-24', count: 15 },
  { age: '25-29', count: 30 },
  { age: '30-34', count: 40 },
  { age: '35-39', count: 25 },
  { age: '40-44', count: 20 },
  { age: '45-49', count: 15 },
  { age: '50+', count: 10 },
];

export function AgeDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="age" 
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
          <Area 
            type="monotone" 
            dataKey="count" 
            name="Employees" 
            stroke="hsl(var(--chart-4))" 
            fill="hsl(var(--chart-4))" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}