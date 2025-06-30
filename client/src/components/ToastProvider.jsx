'use client';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                style: {
                    background: '#334155', // bg-slate-700
                    color: '#F1F5F9',     // text-slate-100
                },
            }}
        />
    );
};

export default ToastProvider;