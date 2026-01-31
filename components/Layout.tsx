
import React from 'react';
import { Icons, COLORS } from '../constants';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, setRole }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Top Banner - Official Style */}
      <div className="bg-[#f1f5f9] border-b border-slate-200 py-1.5 px-4 text-[11px] font-medium text-slate-600 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="GOI" className="h-4 mr-2" />
            GOVERNMENT OF INDIA / भारत सरकार
          </span>
          <span className="text-slate-400">|</span>
          <span>Ministry of Electronics & Information Technology</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hover:text-blue-700 transition-colors uppercase tracking-tight">Main Content</button>
          <button className="hover:text-blue-700 transition-colors">Hindi / हिंदी</button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Icons.Logo />
          <nav className="hidden md:flex space-x-6">
            <button className="text-navy-900 font-semibold border-b-2 border-blue-900 pb-1">Dashboard</button>
            <button className="text-slate-500 hover:text-navy-900 font-medium transition-colors">Services</button>
            <button className="text-slate-500 hover:text-navy-900 font-medium transition-colors">Guidelines</button>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setRole(UserRole.USER)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${role === UserRole.USER ? 'bg-white shadow-sm text-blue-900' : 'text-slate-500'}`}
            >
              Citizen
            </button>
            <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${role === UserRole.ADMIN ? 'bg-white shadow-sm text-blue-900' : 'text-slate-500'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>

      {/* Simplified Bottom Bar */}
      <div className="bg-white border-t border-slate-100 py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
           <div className="flex items-center space-x-4">
             <span>Digital India Initiative</span>
             <span className="h-3 w-[1px] bg-slate-200"></span>
             <span>MeitY Approved</span>
           </div>
           <div className="mt-2 md:mt-0">
             Satyamev Jayate | Truth Alone Triumphs
           </div>
        </div>
      </div>
    </div>
  );
};
