import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, Clock, LayoutDashboard, FileText, Activity, HelpCircle, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Header({ user, currentTab, onChangeTab, onLogout }: HeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'apply', name: 'Apply For Leave', icon: FileText },
    { id: 'status', name: 'My App Status', icon: Activity },
    { id: 'support', name: 'Support System', icon: HelpCircle },
  ];

  return (
    <header className="bg-[#0b101c] border-b border-slate-800 tracking-wide select-none">
      {/* Top Deck: Branding & Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand & Dynamic System Metrics */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center rotate-45 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <span className="text-base font-bold text-white -rotate-45 block">L</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">LIPIDATA</span>
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold font-mono">STAFF PORTAL</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">High-integrity enterprise intelligence system</p>
          </div>
        </div>

        {/* Live Metrics: Local Clock & User Information card */}
        <div className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center sm:justify-end">
          
          {/* Dynamic Clock Info */}
          <div className="hidden lg:flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 p-2 px-3 rounded-xl">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div className="font-mono text-xs">
              <span className="text-slate-500 mr-2.5">TIME (LOCAL):</span>
              <span className="text-slate-100 font-bold font-mono">{time}</span>
            </div>
          </div>

          {/* User profile capsule card */}
          <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-850 p-1.5 pr-4 rounded-xl">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-500/30"
            />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-100 leading-tight">{user.fullName}</h4>
              <span className="text-[10px] text-slate-400 block tracking-tight">{user.role}</span>
            </div>
          </div>

          {/* Controls (Logout) */}
          <button
            onClick={onLogout}
            title="Terminate Intranet Session"
            className="p-2.5 bg-slate-900/80 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Deck: Tabs selection list */}
      <div className="bg-[#080d16] border-t border-slate-850/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
          <nav className="flex gap-2 py-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = item.id === currentTab;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/10 scale-[1.02] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Quick status feed */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-mono tracking-tight bg-slate-900/30 px-3 py-1.5 rounded-md border border-slate-850">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node Lipi-South Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
