import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  colors?: string[];
}

const CustomPieChart: React.FC<PieChartProps> = ({
  title,
  data,
  colors = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384'
  ]
}) => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">{title}</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="40%"
              outerRadius="70%"
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px", 
                border: "1px solid #e0e0e0" 
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default CustomPieChart;