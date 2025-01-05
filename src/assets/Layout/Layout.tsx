import React from 'react';
import { AppNavbar } from '../../components/Navigation/Navigation';
import { Toaster } from 'sonner';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div>
        <Toaster richColors />
        <AppNavbar/>
        <main>{children}</main>
    </div>
  );
};

export default Layout;