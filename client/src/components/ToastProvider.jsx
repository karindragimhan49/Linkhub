// client/src/components/ToastProvider.jsx

'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e293b', // bg-slate-800
          color: '#f1f5f9',     // text-slate-100
          border: '1px solid #334155', // border-slate-700
        },
      }}
    />
  );
};

export default ToastProvider;