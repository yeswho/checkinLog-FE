import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SeasonalBookingTrends: React.FC = () => {
  const seasonalData = [
    { season: 'Winter', bookings: 120, revenue: 45000 },
    { season: 'Spring', bookings: 180, revenue: 65000 },
    { season: 'Summer', bookings: 250, revenue: 95000 },
    { season: 'Autumn', bookings: 160, revenue: 55000 },
  ];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">Seasonal Booking Trends</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip  cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-default p-4 rounded-lg shadow-lg">
                      <p>Season: {data.season}</p>
                      <p>Bookings: {data.bookings}</p>
                      <p>Revenue: ${data.revenue}</p>
                    </div>
                  );
                }
                return null;
              }}/>
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="bookings" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default SeasonalBookingTrends;