import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
        }}
      >
        <p 
          className="text-md font-bold" 
          style={{ 
            color: '#3B82F6',
            marginBottom: '8px'
          }}
        >
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p 
            key={`item-${index}`} 
            className="text-sm"
            style={{ 
              color: entry.color,
              marginTop: '4px'
            }}
          >
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface LineGraphProps {
  title: string;
  data: Array<{
    [key: string]: string | number;
  }>;
  xKey: string;
  lineKey: string;
  color?: string;
}

const LineGraph: React.FC<LineGraphProps> = ({
  title,
  data,
  xKey,
  lineKey,
  color = "#8884d8"
}) => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">{title}</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={lineKey} 
              stroke={color} 
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default LineGraph;