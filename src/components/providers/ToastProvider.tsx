'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-color, #1b1b1b)',
          borderRadius: '12px',
          padding: '14px 18px',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#2D6A4F',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
