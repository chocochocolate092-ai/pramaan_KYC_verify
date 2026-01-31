
import React from 'react';

export const COLORS = {
  SAFFRON: '#FF9933',
  WHITE: '#FFFFFF',
  GREEN: '#138808',
  NAVY: '#000080',
};

export const Icons = {
  CheckMark: () => (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Processing: () => (
    <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  Logo: () => (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 border-2 border-navy-800 rounded-full flex items-center justify-center p-1 bg-white">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight tracking-tight text-[#000080]">Pramaan</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">National KYC Portal</span>
      </div>
    </div>
  )
};
