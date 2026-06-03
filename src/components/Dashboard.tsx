import React from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  CalendarRange, 
  Clock, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { UserProfile, LeaveRequest } from '../types';

interface DashboardProps {
  user: UserProfile;
  leaves: LeaveRequest[];
  onNavigateToApply: () => void;
  onNavigateToStatus: () => void;
}

export default function Dashboard({ user, leaves, onNavigateToApply, onNavigateToStatus }: DashboardProps) {
  // Aggregate stats
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'approved').length;
  const totalDaysTaken = leaves
    .filter((l) => l.status === 'approved')
    .reduce((sum, l) => sum + l.totalDays, 0);

  const leaveBalanceItems = [
    { key: 'sick', name: 'Sick Leaves', value: user.leaveBalances.sick, max: 12, color: 'from-emerald-500 to-teal-400 bg-emerald-500/10' },
    { key: 'casual', name: 'Casual Leaves', value: user.leaveBalances.casual, max: 8, color: 'from-amber-500 to-orange-400 bg-amber-500/10' },
    { key: 'earned', name: 'Earned Leaves', value: user.leaveBalances.earned, max: 20, color: 'from-indigo-500 to-blue-400 bg-indigo-500/10' },
    { key: 'parental', name: 'Parental Leaves', value: user.leaveBalances.parental, max: 30, color: 'from-purple-500 to-fuchsia-400 bg-purple-500/10' },
  ];

  // Simulated trend data: monthly hours/days taken
  // Custom SVG Bar graph metrics representing months Jan-May 2026.
  const chartData = [
    { month: 'Jan', value: 2 },
    { month: 'Feb', value: 4 },
    { month: 'Mar', value: 1 },
    { month: 'Apr', value: 5 },
    { month: 'May', value: 3 },
  ];

  const maxChartValue = 6;
  const graphHeight = 140;
  const graphWidth = 340;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Intro section with clean layouts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white font-sans tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            You have <span className="text-indigo-400 font-semibold">{pendingLeaves} pending</span> leave request{pendingLeaves !== 1 ? 's' : ''} awaiting management evaluation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToApply}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-md shadow-indigo-600/10 cursor-pointer hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Apply for Leave
          </button>
        </div>
      </div>

      {/* Grid of Leave Balances - Horizontal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {leaveBalanceItems.map((item) => {
          const ratio = Math.min(100, Math.max(0, (item.value / item.max) * 100));
          return (
            <motion.div
              whileHover={{ y: -3 }}
              key={item.key}
              className="bg-[#0f1422] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* background vector */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />

              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 font-sans tracking-wide uppercase">{item.name}</span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-2 py-0.5 rounded">
                  Max: {item.max} days
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-slate-100 font-sans">{item.value}</span>
                <span className="text-xs text-slate-500 font-mono">days active</span>
              </div>

              {/* Custom micro filler bar */}
              <div className="space-y-1.5">
                <div className="w-full h-1.5 bg-slate-955 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{item.value} left</span>
                  <span>{Math.round(ratio)}% remaining</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Dashboard Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Custom SVG Trend Graph (6-column span or 7 on lg) */}
        <div className="lg:col-span-7 bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-1.5 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Seasonal Leave Barometer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Approved leave days consumed per month (2026)</p>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-505 border border-indigo-500/20 px-2 py-0.5 rounded">
                YTDCons.: {totalDaysTaken} days
              </span>
            </div>

            {/* Premium, Handcrafted SVG Chart */}
            <div className="w-full flex justify-center py-4 bg-[#080d16]/40 p-4 rounded-xl border border-slate-850">
              <svg 
                viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
                className="w-full max-w-sm h-auto overflow-visible select-none"
              >
                {/* Y-axis grid lines */}
                {[0, 2, 4, 6].map((gridLine, idx) => {
                  const yVal = graphHeight - 20 - (gridLine / maxChartValue) * (graphHeight - 40);
                  return (
                    <g key={gridLine} className="opacity-40">
                      <line 
                        x1="30" 
                        y1={yVal} 
                        x2={graphWidth - 10} 
                        y2={yVal} 
                        stroke="#1e293b" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                      />
                      <text 
                        x="10" 
                        y={yVal + 3} 
                        fill="#64748b" 
                        fontSize="9" 
                        fontFamily="monospace" 
                        textAnchor="right"
                      >
                        {gridLine}D
                      </text>
                    </g>
                  );
                })}

                {/* Bars along X-axis */}
                {chartData.map((data, index) => {
                  const barWidth = 24;
                  const xGap = (graphWidth - 40) / chartData.length;
                  const xPos = 40 + index * xGap;
                  const barHeight = (data.value / maxChartValue) * (graphHeight - 40);
                  const yPos = graphHeight - 20 - barHeight;

                  return (
                    <g key={data.month} className="group">
                      {/* Interactive Background Glow for active bars */}
                      <rect
                        x={xPos - 4}
                        y={20}
                        width={barWidth + 8}
                        height={graphHeight - 40}
                        fill="transparent"
                        className="hover:fill-slate-800/10 cursor-pointer rounded transition-all"
                      />

                      {/* Render SVG bar with elegant top corner radius */}
                      <rect
                        x={xPos}
                        y={yPos}
                        width={barWidth}
                        height={Math.max(2, barHeight)}
                        rx="4"
                        fill={`url(#barGradient-${index})`}
                        className="transition-all duration-300 transform origin-bottom hover:scale-y-[1.03]"
                      />

                      {/* Tooltip text showing days when hovering */}
                      <text
                        x={xPos + barWidth / 2}
                        y={yPos - 6}
                        fill="#a5b4fc"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="opacity-100 font-bold"
                      >
                        {data.value}d
                      </text>

                      {/* X-axis labels */}
                      <text
                        x={xPos + barWidth / 2}
                        y={graphHeight - 4}
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {data.month}
                      </text>

                      {/* Gradient Definitions per bar */}
                      <defs>
                        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#312e81" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex gap-4 items-center bg-slate-900/60 p-3 rounded-xl border border-slate-850 mt-4">
            <Award className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-400 leading-normal">
              <strong>Compliance Notice:</strong> Your attendance score is <strong>98.4%</strong>. Nice job! Standard leave policies dictate maintaining at least 95% attendance for quarterly appraisal eligibility.
            </p>
          </div>
        </div>

        {/* Dynamic statistics and Activity Hub (5-column span or 5 on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Leave Analytics Summary Metrics */}
          <div className="bg-[#0f1422] border border-slate-805 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-sans">Quarterly Core KPIs</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">Authorized Leaves</span>
                </div>
                <span className="text-sm font-bold text-slate-100 font-mono">{approvedLeaves} requests</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">Total Approved Days</span>
                </div>
                <span className="text-sm font-bold text-slate-100 font-mono">{totalDaysTaken} days approved</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">Intranet Approval Speed</span>
                </div>
                <span className="text-sm font-bold text-slate-100 font-mono">1.8 HR SLA</span>
              </div>
            </div>
          </div>

          {/* Activity Logs feed list */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Recent Intranet Activity</h3>
                <button 
                  onClick={onNavigateToStatus}
                  className="text-[10px] uppercase font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {leaves.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No historical leave activities found.</p>
                ) : (
                  leaves.slice(0, 3).map((l, index) => (
                    <div 
                      key={l.id || index}
                      className="text-xs flex items-center justify-between p-2.5 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl border border-slate-850/50 transition-all"
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-200 capitalize">{l.leaveType} Leave Request</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{l.startDate} to {l.endDate} ({l.totalDays}d)</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        l.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : l.status === 'rejected' 
                          ? 'bg-red-500/10 text-red-400' 
                          : 'bg-amber-500/10 text-amber-550'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic News / Info Board Widget */}
      <div className="p-6 bg-[#0c1221] border border-slate-800/80 rounded-2xl text-left">
        <h3 className="text-sm font-semibold text-white mb-2 font-sans flex items-center gap-1.5 uppercase tracking-wide">
          <CalendarRange className="w-4 h-4 text-indigo-400" /> Executive LIPIDATA Intranet bulletin board
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Effective immediately, LIPIDATA HR has enabled the new <span className="text-indigo-300 font-semibold">'Parental Cover' leave category</span> allowing extended leave allotments for caregiving events. Managers are authorized SLA speed approvals of all parental requests within 2 hours of filing.
        </p>
        <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 border-t border-slate-850/60 pt-4 font-mono">
          <span>PUBLISHED: JUNE 2026</span>
          <span className="text-indigo-400">● CATEGORY: POLICY CHANGE</span>
          <span>APPROVED BY: HR COUNCIL</span>
        </div>
      </div>

    </div>
  );
}
