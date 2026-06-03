import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Splash from './components/Splash';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LeaveForm from './components/LeaveForm';
import StatusTracker from './components/StatusTracker';
import SupportSystem from './components/SupportSystem';

import { UserProfile, LeaveRequest, SupportTicket } from './types';
import { INITIAL_PROFILE, INITIAL_LEAVES, INITIAL_TICKETS } from './data/mockData';

export default function App() {
  const [appState, setAppState] = useState<'splash' | 'login' | 'portal'>('splash');
  const [user, setUser] = useState<UserProfile>(INITIAL_PROFILE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Sync state on load from localStorage
  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem('lipidata_user');
      const cachedLeaves = localStorage.getItem('lipidata_leaves');
      const cachedTickets = localStorage.getItem('lipidata_tickets');

      if (cachedUser) setUser(JSON.parse(cachedUser));
      if (cachedLeaves) setLeaves(JSON.parse(cachedLeaves));
      if (cachedTickets) setTickets(JSON.parse(cachedTickets));
    } catch (e) {
      console.warn("Unable to access localStorage: ", e);
    }
  }, []);

  // Save to locale storage on updates
  useEffect(() => {
    try {
      localStorage.setItem('lipidata_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('lipidata_leaves', JSON.stringify(leaves));
    } catch (e) {}
  }, [leaves]);

  useEffect(() => {
    try {
      localStorage.setItem('lipidata_tickets', JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  const handleLoginSuccess = (username: string) => {
    // Dynamic preset assignment or guest values
    if (username === 'Guest User') {
      setUser({
        username: 'guest',
        fullName: 'Guest Developer',
        role: 'Guest Architect',
        department: 'Operations',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        leaveBalances: {
          sick: 5,
          casual: 3,
          earned: 10,
          parental: 10
        }
      });
    } else {
      setUser(INITIAL_PROFILE);
    }
    setAppState('portal');
  };

  const handleLogout = () => {
    setAppState('login');
    setCurrentTab('dashboard');
  };

  // 1. Submit Leave request
  const handleSubmitLeave = (newLeave: Omit<LeaveRequest, 'id' | 'employeeName' | 'appliedDate' | 'status'>) => {
    const formatted: LeaveRequest = {
      ...newLeave,
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: user.fullName,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending' // default is pending review
    };
    setLeaves((prev) => [formatted, ...prev]);
  };

  // 2. Cancel/Withdraw Pending Leave
  const handleCancelLeave = (id: string) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  // 3. Simulator Hook: Change Leave Status and dynamically deduct balances!
  const handleSimulateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setLeaves((prev) => {
      const match = prev.find((l) => l.id === id);
      if (!match) return prev;

      // Adjust balances dynamically if newly approved
      if (newStatus === 'approved' && match.status === 'pending') {
        setUser((currentUser) => {
          const type = match.leaveType;
          const balanceKey = type as keyof typeof currentUser.leaveBalances;
          const remaining = currentUser.leaveBalances[balanceKey] - match.totalDays;

          return {
            ...currentUser,
            leaveBalances: {
              ...currentUser.leaveBalances,
              [balanceKey]: Math.max(0, remaining)
            }
          };
        });
      }

      return prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    });
  };

  // 4. Incident Tickets management
  const handleAddTicket = (newTicket: Omit<SupportTicket, 'id' | 'status' | 'date'>) => {
    const formatted: SupportTicket = {
      ...newTicket,
      id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets((prev) => [formatted, ...prev]);
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' as const } : t))
    );
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-[#060913] text-slate-200">
      <AnimatePresence mode="wait">
        
        {/* VIEW A: Animated Network Splash Sequence */}
        {appState === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Splash onComplete={() => setAppState('login')} />
          </motion.div>
        )}

        {/* VIEW B: Authentication screen */}
        {appState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {/* VIEW C: Dynamic Employee Dashboard portal */}
        {appState === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Unified Header Navigation */}
            <Header
              user={user}
              currentTab={currentTab}
              onChangeTab={setCurrentTab}
              onLogout={handleLogout}
            />

            {/* Dynamic Viewport Container */}
            <main className="flex-grow bg-[#060913]">
              <AnimatePresence mode="wait">
                
                {/* Visual Tab 1: Dashboard Analytics overview */}
                {currentTab === 'dashboard' && (
                  <motion.div
                    key="tab-dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <Dashboard
                      user={user}
                      leaves={leaves}
                      onNavigateToApply={() => setCurrentTab('apply')}
                      onNavigateToStatus={() => setCurrentTab('status')}
                    />
                  </motion.div>
                )}

                {/* Visual Tab 2: Apply for Intranet Leave Form */}
                {currentTab === 'apply' && (
                  <motion.div
                    key="tab-apply"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <LeaveForm
                      user={user}
                      onSubmitLeave={handleSubmitLeave}
                      onNavigateToStatus={() => setCurrentTab('status')}
                    />
                  </motion.div>
                )}

                {/* Visual Tab 3: Detailed Status trackers */}
                {currentTab === 'status' && (
                  <motion.div
                    key="tab-status"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <StatusTracker
                      leaves={leaves}
                      onCancelLeave={handleCancelLeave}
                      onSimulateStatus={handleSimulateStatus}
                    />
                  </motion.div>
                )}

                {/* Visual Tab 4: Corporate support / FAQ help center & AI Assistant */}
                {currentTab === 'support' && (
                  <motion.div
                    key="tab-support"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <SupportSystem
                      tickets={tickets}
                      onAddTicket={handleAddTicket}
                      onResolveTicket={handleResolveTicket}
                      onDeleteTicket={handleDeleteTicket}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </main>

            {/* Corporate sub info footer */}
            <footer className="bg-[#04060d] border-t border-slate-900 py-6 text-center select-none">
              <p className="text-[10px] text-slate-650 font-mono tracking-wide">
                LIPIDATA TECHNOLOGIES SECURE SYSTEM NETWORK ● LICENSED INTERNAL USE ONLY ● ALL ACTIONS SECURITY AUDITED
              </p>
            </footer>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
