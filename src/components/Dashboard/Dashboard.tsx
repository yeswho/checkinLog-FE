import React from 'react';
import { Card, CardBody, CardHeader, Chip, Divider, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  useRoomOccupancy,
  useBookingTrends,
  useCustomerDemographics,
  useTodaysSnapshot,
  useRoomAvailability,
  useUpcomingReservations,
  useRecentBookings,
  useCancellations,
  useNotifications,
  useWeather
} from '../../hooks/useDashboard';
import DateRangeSelector from './DateRangeSelector';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ChartCard = ({ title, children, className = '' }: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={`h-full ${className}`}>
    <CardHeader className="flex flex-col items-start gap-2 pb-0">
      <h3 className="text-lg font-semibold">{title}</h3>
    </CardHeader>
    <CardBody className="pt-2">
      <div className="h-full w-full">
        {children}
      </div>
    </CardBody>
  </Card>
);

const StatCard = ({ title, value, icon, trend }: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="h-full">
    <CardBody className="flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <p className="text-sm text-default-500">{title}</p>
        {icon && <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && (
          <Chip
            color={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'default'}
            variant="flat"
            size="sm"
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </Chip>
        )}
      </div>
    </CardBody>
  </Card>
);

const TodaysSnapshot = () => {
  const { data, isLoading } = useTodaysSnapshot();

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Check-ins Today"
        value={data?.checkInsToday || 0}
        icon={<span>🏨</span>}
      />
      <StatCard
        title="Check-outs Today"
        value={data?.checkOutsToday || 0}
        icon={<span>🚪</span>}
      />
      <StatCard
        title="Occupancy Rate"
        value={`${Math.round(data?.occupancyRate || 0)}%`}
        icon={<span>📊</span>}
      />
      <StatCard
        title="Expected Arrivals"
        value={data?.expectedArrivals || 0}
        icon={<span>🛎️</span>}
      />
      <StatCard
        title="Expected Departures"
        value={data?.expectedDepartures || 0}
        icon={<span>🧳</span>}
      />
    </div>
  );
};

const RoomAvailabilityChart = () => {
  const { data, isLoading } = useRoomAvailability();

  if (isLoading) return <Spinner />;

  // Transform data: convert string counts to numbers and ensure data exists
  const chartData = data?.map((item: { count: string; }) => ({
    ...item,
    count: parseInt(item.count, 10)
  })) || [];

  if (chartData.length === 0) {
    return (
      <ChartCard title="Room Availability">
        <div className="h-full flex items-center justify-center">
          <p className="text-default-500">No room data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Room Availability">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderColor: 'hsl(var(--nextui-default-200))',
              borderRadius: 'var(--nextui-radius-medium)',
              color: 'hsl(var(--nextui-foreground))'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const UpcomingReservations = () => {
  const { data, isLoading } = useUpcomingReservations();

  if (isLoading) return <Spinner />;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Upcoming Reservations (Next 7 Days)</h3>
      </CardHeader>
      <CardBody>
        <Table removeWrapper aria-label="Upcoming reservations">
          <TableHeader>
            <TableColumn>GUEST</TableColumn>
            <TableColumn>ROOM TYPE</TableColumn>
            <TableColumn>CHECK-IN</TableColumn>
            <TableColumn>CHECK-OUT</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {data?.map((reservation: any) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.guestName}</TableCell>
                <TableCell>{reservation.roomType}</TableCell>
                <TableCell>{new Date(reservation.check_in).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(reservation.check_out).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    color={reservation.status === 'BOOKED' ? 'primary' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {reservation.status}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

// Add this component above the Dashboard component
const RoomOccupancyChart = () => {
  const { data, isLoading } = useRoomOccupancy();

  if (isLoading) return <Spinner />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          stroke="#888"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          height={100}
          width={100}
          dataKey="roomType"
          type="category"
          stroke="#888"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--nextui-default-100))',
            borderColor: 'hsl(var(--nextui-default-200))',
            borderRadius: 'var(--nextui-radius-medium)',
            color: 'hsl(var(--nextui-foreground))'
          }}
        />
        <Legend />
        <Bar
          dataKey="available"
          stackId="a"
          fill="hsl(var(--nextui-success))"
          name="Available"
          radius={[0, 4, 4, 0]}
        />
        <Bar
          dataKey="occupied"
          stackId="a"
          fill="hsl(var(--nextui-primary))"
          name="Occupied"
          radius={[0, 4, 4, 0]}
        />
        <Bar
          dataKey="maintenance"
          stackId="a"
          fill="hsl(var(--nextui-warning))"
          name="Maintenance"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};


const RecentBookings = () => {
  const { data, isLoading } = useRecentBookings();

  if (isLoading) return <Spinner />;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Bookings</h3>
      </CardHeader>
      <CardBody>
        <Table removeWrapper aria-label="Recent bookings">
          <TableHeader>
            <TableColumn>GUEST</TableColumn>
            <TableColumn>ROOM TYPE</TableColumn>
            <TableColumn>DATES</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {data?.map((booking: any) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.guestName}</TableCell>
                <TableCell>{booking.roomTypes}</TableCell>
                <TableCell>
                  {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    color={booking.status === 'BOOKED' ? 'primary' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {booking.status}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

const NotificationsPanel = () => {
  const { data, isLoading } = useNotifications();
  const weather = useWeather('hotel-location');

  if (isLoading) return <Spinner />;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Notifications & Alerts</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Weather Widget */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold">Weather</h4>
              <p className="text-sm">{weather.data?.current.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{weather.data?.current.temp}°C</p>
              <p className="text-sm">Forecast: {weather.data?.forecast[0].high}° / {weather.data?.forecast[0].low}°</p>
            </div>
          </div>
        </div>

        {/* Upcoming Check-ins */}
        <div>
          <h4 className="font-medium mb-2">Upcoming Check-ins (Next 24h)</h4>
          {data?.checkInAlerts?.length > 0 ? (
            <div className="space-y-2">
              {data.checkInAlerts.slice(0, 3).map((alert: any) => (
                <div key={alert.id} className="flex justify-between items-center p-2 bg-default-100 rounded">
                  <div>
                    <p className="font-medium">{alert.guestName}</p>
                    <p className="text-sm text-default-500">1:00:00 PM</p>
                  </div>
                  <Chip size="sm" variant="flat">{alert.roomType}</Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">No upcoming check-ins</p>
          )}
        </div>

        {/* Upcoming Check-outs */}
        <div>
          <h4 className="font-medium mb-2">Upcoming Check-outs (Next 24h)</h4>
          {data?.checkOutAlerts?.length > 0 ? (
            <div className="space-y-2">
              {data.checkOutAlerts.slice(0, 3).map((alert: any) => (
                <div key={alert.id} className="flex justify-between items-center p-2 bg-default-100 rounded">
                  <div>
                    <p className="font-medium">{alert.guestName}</p>
                    <p className="text-sm text-default-500">11:00:00 AM</p>
                  </div>
                  <Chip size="sm" variant="flat">{alert.roomType}</Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">No upcoming check-outs</p>
          )}
        </div>

        {/* Sources */}
        <div>
          <h4 className="font-medium mb-2">Sources</h4>
          {data?.sources?.length > 0 ? (
            <div className="space-y-2">
              {data.sources.slice(0, 3).map((request: any) => (
                <div key={request.id} className="p-2 bg-default-100 rounded">
                  <p className="font-medium">{request.guestName}</p>
                  <p className="text-sm text-default-500">{request.source}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">Source unavailable</p>
          )}
        </div>
        <div>
          <h4 className="font-medium mb-2">Unpaid Bills</h4>
          {data?.unpaidBills?.length > 0 ? (
            <div className="space-y-2">
              {data.unpaidBills.slice(0, 3).map((request: any) => (
                <div key={request.id} className="p-2 bg-default-100 rounded">
                  <p className="font-medium">{request.guestName}</p>
                  <p className="text-sm text-default-500">{request.amountDue}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">Bill unavailable</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Today's Dashboard: {new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kathmandu' })}
        </h1>
      </div>

      {/* Today's Snapshot */}
      <TodaysSnapshot />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Availability */}
        <RoomAvailabilityChart />

        {/* Upcoming Reservations */}
        <UpcomingReservations />

        {/* Notifications */}
        <NotificationsPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[600px] col-span-1">
          <RecentBookings />
        </div>

        <div className="h-[600px] col-span-1">
          <ChartCard title="Room Occupancy by Type" className="h-full w-full">
            <RoomOccupancyChart />
          </ChartCard>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;