'use client';
import { useEffect } from 'react';

export default function Toast({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-24 right-8 z-[100] animate-in fade-in slide-in-from-top-5 duration-300 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-white ${isSuccess ? 'border-emerald-500' : 'border-rose-500'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shrink-0 shadow-inner ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}>
        {isSuccess ? '✓' : '✗'}
      </div>
      <p className="text-sm font-semibold text-gray-800 break-words max-w-sm">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
        ✕
      </button>
    </div>
  );
}
