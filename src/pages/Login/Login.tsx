import React from 'react';
import Login from '../../components/Login/Login';
import { Toaster } from 'sonner';
import { isAuthenticated } from '../../utils/authHelpers';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
}
  return (
    <div className='p-8'>
        <Toaster richColors />
        <Login/>
    </div>
  );
};

export default LoginPage;