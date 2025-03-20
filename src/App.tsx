import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation, useNavigation } from "react-router-dom";
import Bookings from 'pages/Bookings/Bookings';
import Customer from 'pages/Customer/Customer';
import Room from 'pages/Room/Room';
import RoomType from 'pages/RoomType/RoomType';
import Floor from 'pages/Floor/Floor';
import LoginPage from 'pages/Login/Login';
import Dashboard from 'pages/Dashboard/Dashboard';
import Complaint from 'pages/Complaint/Complaint';
import Maintenance from 'pages/Maintenance/Maintenance';
import Billings from 'pages/Billing/Billing'
import Layout from './assets/Layout/Layout';
import { ThemeProvider } from './assets/themeProvider';
import './index.css';
import { routes } from './routes/routes';
import { createRoute } from './utils/routes';
import ProtectedRoute from './components/ProtectedRoutes';
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import ProfilePage from "pages/Profile/Profile";


function AnimatedRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [location.pathname]); 

  return (
    <>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <Spinner 
            classNames={{
              base: "scale-150", 
              label: "text-foreground mt-4",
            }}
            color="primary"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path={createRoute([routes.ROOMS])} element={<Layout><Room /></Layout>}/>
            <Route path={createRoute([routes.HOME])} element={<Layout><Dashboard /></Layout>} />
            <Route path={createRoute([routes.CUSTOMERS])} element={<Layout><Customer /></Layout>} />
            <Route path={createRoute([routes.BOOKINGS])} element={<Layout><Bookings /></Layout>} />
            <Route path={createRoute([routes.ROOM_TYPE])} element={<Layout><RoomType /></Layout>} />
            <Route path={createRoute([routes.FLOOR])} element={<Layout><Floor /></Layout>} />
            <Route path={createRoute([routes.COMPLAINT])} element={<Layout><Complaint /></Layout>} />
            <Route path={createRoute([routes.MAINTENANCE])} element={<Layout><Maintenance /></Layout>} />
            <Route path={createRoute([routes.BILLINGS])} element={<Layout><Billings/></Layout>} />
            <Route path={createRoute([routes.PROFILE])} element={<Layout><ProfilePage/></Layout>} />
            <Route path={createRoute([routes.LOGIN])} element={<LoginPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;