import React from 'react';
import { AppNavbar } from '../../components/Navigation/Navigation';
import { Toaster } from 'sonner';
import { useLocation } from 'react-router-dom';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
        <Toaster richColors />
       {!isLoginPage && <AppNavbar />}
        <main>{children}</main>
    </div>
  );
};

export default Layout;