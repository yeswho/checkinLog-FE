import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RoomMaintenanceTracker: React.FC = () => {
  const maintenanceData = [
    { 
      floor: 'Ground', 
      totalRooms: 20, 
      availableRooms: 20, 
      maintenanceRooms: 0 
    },
    { 
      floor: '1st', 
      totalRooms: 25, 
      availableRooms: 20, 
      maintenanceRooms: 5 
    },
    { 
      floor: '2nd', 
      totalRooms: 30, 
      availableRooms: 25, 
      maintenanceRooms: 5 
    },
  ];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">Room Maintenance & Availability</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={maintenanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="floor" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="availableRooms" stackId="a" fill="#10B981" />
            <Bar dataKey="maintenanceRooms" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default RoomMaintenanceTracker;