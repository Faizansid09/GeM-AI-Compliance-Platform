import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4500,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid #a7f3d0',
                  background: '#f0fdf4',
                  color: '#064e3b',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#7f1d1d',
                },
              },
            }}
          />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
