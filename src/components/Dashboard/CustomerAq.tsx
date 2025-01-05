import React from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomerAcquisitionGraph: React.FC = () => {
  const customerData = [
    { 
      month: 'Jan', 
      newCustomers: 50, 
      returningCustomers: 30, 
      frequentCustomers: 20 
    },
    { 
      month: 'Feb', 
      newCustomers: 45, 
      returningCustomers: 35, 
      frequentCustomers: 25 
    },
    { 
      month: 'Mar', 
      newCustomers: 60, 
      returningCustomers: 40, 
      frequentCustomers: 30 
    },
    { 
      month: 'Apr', 
      newCustomers: 55, 
      returningCustomers: 45, 
      frequentCustomers: 35 
    },
  ];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-lg font-bold text-default-800">Customer Acquisition Lifecycle</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={customerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" stackId="a" fill="#3B82F6" />
            <Bar dataKey="returningCustomers" stackId="a" fill="#10B981" />
            <Bar dataKey="frequentCustomers" stackId="a" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default CustomerAcquisitionGraph;