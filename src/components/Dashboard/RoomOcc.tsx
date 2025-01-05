import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RoomOccupancyHeatmap: React.FC = () => {
  const generateOccupancyData = () => {
    const roomTypes = ['Standard', 'Deluxe', 'Suite'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const data: any[] = [];
    
    roomTypes.forEach((roomType, typeIndex) => {
      days.forEach((day, dayIndex) => {
        // Simulate occupancy with some randomness
        const occupancy = Math.floor(Math.random() * 100);
        data.push({
          x: dayIndex,
          y: typeIndex,
          roomType,
          day,
          occupancy
        });
      });
    });
    
    return data;
  };

  const occupancyData = generateOccupancyData();

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">Room Occupancy Heatmap</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis 
              type="category" 
              dataKey="day" 
              interval={0} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="roomType" 
              interval={0} 
              tick={{ fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="occupancy" range={[0, 1000]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <p>Room Type: {data.roomType}</p>
                      <p>Day: {data.day}</p>
                      <p>Occupancy: {data.occupancy}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              data={occupancyData} 
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default RoomOccupancyHeatmap;