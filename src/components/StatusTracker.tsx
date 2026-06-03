import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XSquare, 
  Clock, 
  CornerDownRight,
  ShieldCheck,
  Zap,
  Tag,
  Paperclip
} from 'lucide-react';
import { LeaveRequest, LeaveType, LeaveStatus } from '../types';

interface StatusTrackerProps {
  leaves: LeaveRequest[];
  onCancelLeave: (id: string) => void;
  onSimulateStatus: (id: string, status: LeaveStatus) => void;
}

export default function StatusTracker({ leaves, onCancelLeave, onSimulateStatus }: StatusTrackerProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [simTargetID, setSimTargetID] = useState<string>('');

  // Filtering lists
  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch = leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          leave.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-500 border border-red-500/30';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
    }
  };

  const getCategoryLabel = (type: LeaveType) => {
    switch (type) {
      case 'sick': return 'Sick';
      case 'casual': return 'Casual';
      case 'earned': return 'Earned';
      case 'parental': return 'Parental Cover';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Tracker Headers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-left">
          <h2 className="text-2xl font-black text-white font-sans tracking-tight">Leave Application Status Logs</h2>
          <p className="text-slate-400 text-xs mt-1">
            Real-time tracking of historical applications, remaining quotas, and supervisor authorizations.
          </p>
        </div>

        {/* Dynamic simulator tag highlight */}
        <div className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 font-mono">Simulators Unlocked</span>
        </div>
      </div>

      {/* Filter and search utilities bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#0b101c] border border-slate-800 rounded-2xl mb-6">
        
        {/* Live Search by ID or description details */}
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500"
            placeholder="Search by request ID, code, or reason details..."
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-350 text-xs focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="all">Statuses (All)</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Leave Type Filter */}
        <div className="relative">
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full px-3 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-350 text-xs focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="all">Leave Types (All)</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="earned">Earned Leave</option>
            <option value="parental">Parental Cover</option>
          </select>
        </div>

      </div>

      {/* Main logs display */}
      <div className="bg-[#0b101c] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-16 px-6">
            <FileCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-400">No applications matched.</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">Try clarifying your category selections or searching different query terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-850">
                  <th className="py-4 px-5 font-mono">ID</th>
                  <th className="py-4 px-4">Leave Category</th>
                  <th className="py-4 px-4">Tenure Period</th>
                  <th className="py-4 px-4">Reason Details</th>
                  <th className="py-4 px-4">Status Verdict</th>
                  <th className="py-4 px-5 text-right">Action Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                <AnimatePresence mode="popLayout">
                  {filteredLeaves.map((leave) => (
                    <motion.tr 
                      key={leave.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-900/15 group"
                    >
                      {/* Ticket ID */}
                      <td className="py-4 px-5 font-mono font-bold text-indigo-400 mt-0.5">{leave.id}</td>

                      {/* Category Label */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-slate-200 capitalize">{getCategoryLabel(leave.leaveType)}</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Applied: {leave.appliedDate}</span>
                        </div>
                      </td>

                      {/* Date span */}
                      <td className="py-4 px-4 font-mono text-slate-350">
                        <div className="flex flex-col">
                          <span>{leave.startDate} to {leave.endDate}</span>
                          <span className="text-[10px] text-indigo-400/90 font-semibold mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Total {leave.totalDays} Days
                          </span>
                        </div>
                      </td>

                      {/* Reason Description context */}
                      <td className="py-4 px-4 max-w-xs text-slate-400 leading-relaxed font-sans font-medium">
                        <p className="truncate group-hover:whitespace-normal group-hover:line-clamp-none line-clamp-1 py-1">
                          {leave.reason}
                        </p>
                        {leave.attachmentName && (
                          <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 mt-1.5 font-mono bg-indigo-505/10 inline-flex p-1 px-2 border border-indigo-500/20 rounded-md">
                            <Paperclip className="w-3 h-3" /> {leave.attachmentName}
                          </div>
                        )}
                      </td>

                      {/* Status design */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${getStatusStyle(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>

                      {/* Submitting controls & Simulator triggers */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* ONLY ALLOW SIMULATION & DELETION FOR PENDING LEAVES */}
                          {leave.status === 'pending' ? (
                            <>
                              {/* Simulate supervisor trigger */}
                              <button
                                onClick={() => setSimTargetID(leave.id)}
                                title="Admin Sandbox Simulator: Approve/Reject"
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-550/15 border border-indigo-400/25 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors"
                              >
                                <ShieldCheck className="w-3 h-3 text-indigo-400" /> SIMULATE
                              </button>

                              {/* Delete/Cancel Application */}
                              <button
                                onClick={() => onCancelLeave(leave.id)}
                                title="Permanently withdraw request"
                                className="p-2 bg-slate-900 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono italic">Decision Locked</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supervisor simulation dialog */}
      {simTargetID && (
        <div className="fixed inset-0 bg-[#000]/70 flex items-center justify-center z-50 p-4 select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-[#0b101c] border border-slate-800 rounded-2xl p-6 text-left"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <Zap className="text-indigo-400 w-5 h-5 animate-pulse" />
              <h3 className="text-base font-black text-white font-sans tracking-tight uppercase">Admin Simulator Engine</h3>
            </div>
            
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Test how the intranet portal responds to real-time administrative actions. Approve or reject request ID <strong className="font-mono text-indigo-400">{simTargetID}</strong> and watch your balances and trackers react instantly!
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3.5">
              <button
                onClick={() => {
                  onSimulateStatus(simTargetID, 'approved');
                  setSimTargetID('');
                }}
                className="flex items-center justify-center gap-2.5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold leading-none cursor-pointer uppercase shadow-lg shadow-emerald-600/10 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve Leave
              </button>
              
              <button
                onClick={() => {
                  onSimulateStatus(simTargetID, 'rejected');
                  setSimTargetID('');
                }}
                className="flex items-center justify-center gap-2.5 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold leading-none cursor-pointer uppercase shadow-lg shadow-red-600/10 transition-colors"
              >
                <XSquare className="w-4 h-4" /> Reject Leave
              </button>
            </div>

            <button
              onClick={() => setSimTargetID('')}
              className="w-full mt-4 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel simulation
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
