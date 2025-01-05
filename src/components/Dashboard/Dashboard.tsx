import React from 'react';
import { 
  Tabs, 
  Tab, 
  Card, 
  CardBody, 
  Button 
} from "@nextui-org/react";
import LineGraph from './LineGraph';
import BarGraph from './BarGraph';
import PieChart from './PieChart';
import CustomerAcquisitionGraph from './CustomerAq';
import RoomOccupancyHeatmap from './RoomOcc';
import SeasonalBookingTrends from './SeasonalTrend';
import RoomMaintenanceTracker from './MaintenanceData';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 10000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 1200 },
  { name: 'Aug', value: 7000 },
  { name: 'Sept', value: 5500 },
  { name: 'Oct', value: 8000 },
  { name: 'Nov', value: 2000 },
  { name: 'Dec', value: 10000 },
];

const roomOccupancyData = [
  { name: 'Standard', value: 65 },
  { name: 'Deluxe', value: 80 },
  { name: 'Suite', value: 55 },
];

const bookingTrendsData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 50 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 60 },
  { name: 'Sat', value: 70 },
  { name: 'Sun', value: 55 },
];

const customerDemographicsData = [
  { name: '18-24', value: 150 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 250 },
  { name: '45-54', value: 120 },
  { name: '55+', value: 80 },
];

const HotelDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-default-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-default-900">Dashboard</h1>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      <Tabs 
        aria-label="Dashboard Tabs" 
        color="primary" 
        variant="bordered"
        className="w-full"
      >
        <Tab key="overview" title="Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChart 
              title="Room Occupancy by Type" 
              data={roomOccupancyData} 
            />
            <CustomerAcquisitionGraph/>
            <RoomOccupancyHeatmap/>
          </div>
        </Tab>

        <Tab key="bookings" title="Bookings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarGraph 
              title="Weekly Booking Trends" 
              data={bookingTrendsData} 
              xKey="name" 
              barKey="value" 
              color="#10B981"
            />
            <PieChart 
              title="Customer Age Distribution" 
              data={customerDemographicsData} 
            />
            <SeasonalBookingTrends/>
          </div>
        </Tab>

        <Tab key="revenue" title="Revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LineGraph 
              title="Monthly Revenue Trend" 
              data={revenueData} 
              xKey="name" 
              lineKey="value" 
              color="#3B82F6"
            />
            <BarGraph 
              title="Revenue by Room Type" 
              data={roomOccupancyData.map(item => ({
                name: item.name,
                value: item.value * 100
              }))} 
              xKey="name" 
              barKey="value" 
              color="#8B5CF6"
            />
          </div>
        </Tab>

        <Tab key="hotel" title="Hotel Health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoomMaintenanceTracker/>
          </div>
        </Tab>

        
      </Tabs>
    </div>
  );
};

export default HotelDashboard;