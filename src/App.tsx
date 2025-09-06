/* eslint-disable import/first */
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation, useNavigation } from "react-router-dom";
import React, { Suspense, useEffect, useState } from 'react';
import Layout from './assets/Layout/Layout';
import { ThemeProvider } from './assets/themeProvider';
import './index.css';
import { routes } from './routes/routes';
import { createRoute } from './utils/routes';
import ProtectedRoute from './components/ProtectedRoutes';
import { Spinner } from "@heroui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy-loaded components
const Bookings = React.lazy(() => import('pages/Bookings/Bookings'));
const Customer = React.lazy(() => import('pages/Customer/Customer'));
const Room = React.lazy(() => import('pages/Room/Room'));
const RoomType = React.lazy(() => import('pages/RoomType/RoomType'));
const Floor = React.lazy(() => import('pages/Floor/Floor'));
const LoginPage = React.lazy(() => import('pages/Login/Login'));
const Dashboard = React.lazy(() => import('pages/Dashboard/Dashboard'));
const Complaint = React.lazy(() => import('pages/Complaint/Complaint'));
const Maintenance = React.lazy(() => import('pages/Maintenance/Maintenance'));
const Billings = React.lazy(() => import('pages/Billing/Billing'));
const Expense = React.lazy(() => import('pages/Expense/Expense'));
const ProfilePage = React.lazy(() => import("pages/Profile/Profile"));
const Employee = React.lazy(() => import("pages/Employee/Employee"));
const Salary = React.lazy(() => import("pages/Salary/Salary"));
const Revenue = React.lazy(() => import("pages/Revenue/Revenue"));
const CalendarBooking = React.lazy(() => import('./components/BookingCalendar/CalendarBooking')); // Lazy load CalendarBooking

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 400); 
  //   return () => clearTimeout(timer);
  // }, [location.pathname]); 

  return (
    <>
      {/* {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <Spinner 
            classNames={{
              base: "scale-150", 
              label: "text-foreground mt-4",
            }}
            color="primary"
          />
        </div>
      )} */}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <Spinner 
                classNames={{
                  base: "scale-150", 
                  label: "text-foreground mt-4",
                }}
                color="primary"
              />
            </div>
          }>
            <Routes location={location}>
              <Route path={createRoute([routes.ROOMS])} element={<Room />} />
              <Route path={createRoute([routes.HOME])} element={<Dashboard />} />
              <Route path={createRoute([routes.CUSTOMERS])} element={<Customer />} />
              <Route path={createRoute([routes.BOOKINGS])} element={<Bookings />} />
              <Route path={createRoute([routes.ROOM_TYPE])} element={<RoomType />} />
              <Route path={createRoute([routes.FLOOR])} element={<Floor />} />
              <Route path={createRoute([routes.COMPLAINT])} element={<Complaint />} />
              <Route path={createRoute([routes.MAINTENANCE])} element={<Maintenance />} />
              <Route path={createRoute([routes.BILLINGS])} element={<Billings />} />
              <Route path={createRoute([routes.EMPLOYEE])} element={<Employee />} />
              <Route path={createRoute([routes.PROFILE])} element={<ProfilePage />} />
              <Route path={createRoute([routes.SALARY])} element={<Salary />} />
              <Route path={createRoute([routes.EXPENSE])} element={<Expense />} />
              <Route path={createRoute([routes.REVENUE])} element={<Revenue />} />
              <Route path={createRoute([routes.CALENDAR_BOOKING])} element={<CalendarBooking />} />
              <Route path={createRoute([routes.LOGIN])} element={<LoginPage />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

    </>
  );
}

function App() {
  return (
     <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;