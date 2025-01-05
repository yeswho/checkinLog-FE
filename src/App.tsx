import Bookings from 'pages/Bookings/Bookings';
import Customer from 'pages/Customer/Customer';
import Room from 'pages/Room/Room';
import RoomType from 'pages/RoomType/RoomType'
import Floor from 'pages/Floor/Floor'
import LoginPage from 'pages/Login/Login';
import Dashboard from 'pages/Dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './assets/Layout/Layout';
import { ThemeProvider } from './assets/themeProvider';
import './index.css';
import { routes } from './routes/routes';
import { createRoute } from './utils/routes';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path={createRoute([routes.ROOMS])} element={<ProtectedRoute><Layout><Room/></Layout></ProtectedRoute>} />
              <Route path={createRoute([routes.HOME])} element={<Layout><Dashboard/></Layout>} />
              <Route path={createRoute([routes.CUSTOMERS])} element={<Layout><Customer/></Layout>} />
              <Route path={createRoute([routes.BOOKINGS])} element={<Layout><Bookings/></Layout>}/>
              <Route path={createRoute([routes.ROOM_TYPE])} element={<Layout><RoomType/></Layout>}/>
              <Route path={createRoute([routes.FLOOR])} element={<Layout><Floor/></Layout>}/>
              <Route path={createRoute([routes.LOGIN])} element={<LoginPage/>}/>
            </Routes>
          </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;