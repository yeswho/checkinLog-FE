import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from './react-query/queryClient';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
