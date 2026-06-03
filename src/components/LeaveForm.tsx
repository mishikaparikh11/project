import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, Upload, File, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { LeaveType, LeaveRequest, UserProfile } from '../types';

interface LeaveFormProps {
  user: UserProfile;
  onSubmitLeave: (newLeave: Omit<LeaveRequest, 'id' | 'employeeName' | 'appliedDate' | 'status'>) => void;
  onNavigateToStatus: () => void;
}

export default function LeaveForm({ user, onSubmitLeave, onNavigateToStatus }: LeaveFormProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('sick');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [errorMess, setErrorMess] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdLeaveID, setCreatedLeaveID] = useState<string>('');

  // Calculate day values when start/end dates change
  useEffect(() => {
    if (!startDate || !endDate) {
      setTotalDays(0);
      setErrorMess('');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setTotalDays(0);
      setErrorMess('Error: End Date cannot precede the Start Date.');
      return;
    }

    // Include both start and end days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(diffDays);
    setErrorMess('');

    // Balance check
    const balance = user.leaveBalances[leaveType];
    if (diffDays > balance) {
      setErrorMess(`Warning: Requested ${diffDays} days exceeds your available ${leaveType} leave balance (${balance} remaining).`);
    }
  }, [startDate, endDate, leaveType, user.leaveBalances]);

  // Format label name nicely
  const getCategoryLabel = (type: LeaveType) => {
    switch (type) {
      case 'sick': return 'Sick Leave';
      case 'casual': return 'Casual Leave';
      case 'earned': return 'Earned Leave';
      case 'parental': return 'Parental Cover Leave';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachment(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setErrorMess('Cannot register application: Check End Date logic.');
      return;
    }

    const randomID = `LV-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedLeaveID(randomID);

    // Call submit handler
    onSubmitLeave({
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      attachmentName: attachment ? attachment.name : undefined
    });

    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    onNavigateToStatus();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 select-none">
      
      <div className="text-left mb-6">
        <h2 className="text-2xl font-black text-white font-sans tracking-tight">Apply for Intranet Leave</h2>
        <p className="text-slate-400 text-xs mt-1">
          Submit electronic holiday or sick certificates. Submissions auto-route to immediate supervisor review.
        </p>
      </div>

      <div className="bg-[#0b101c] border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left">
        {/* balance bar dashboard banner */}
        <div className="bg-slate-900/60 p-4 border-b border-slate-805 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold uppercase text-slate-300 font-sans tracking-wider">Available category balances:</span>
          </div>
          <div className="flex items-center gap-2.5">
            {Object.entries(user.leaveBalances).map(([key, bal]) => (
              <span 
                key={key} 
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors ${
                  key === leaveType ? 'bg-indigo-550/20 text-indigo-400 border border-indigo-400/40' : 'bg-slate-800 text-slate-450 border border-transparent'
                }`}
              >
                {key.toUpperCase()}: {bal}D
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleApply} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Category selection */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-450 mb-2 uppercase tracking-wide">Leave Allotment Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['sick', 'casual', 'earned', 'parental'] as LeaveType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeaveType(type)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold font-sans capitalize transition-all cursor-pointer text-center ${
                      leaveType === type
                        ? 'bg-gradient-to-r from-indigo-900/40 to-indigo-600/20 text-indigo-300 border-indigo-500 shadow-md'
                        : 'bg-slate-900 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {getCategoryLabel(type).replace(' Cover', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start-date-input" className="block text-xs font-bold text-slate-450 mb-2 uppercase tracking-wide">Start Date</label>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end-date-input" className="block text-xs font-bold text-slate-450 mb-2 uppercase tracking-wide">End Date</label>
              <input
                id="end-date-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>

            {/* Total summary days panel */}
            <div className="bg-[#080c14]/80 border border-slate-850 rounded-xl p-3 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Calculated tenure:</span>
              <span className="text-2xl font-black text-indigo-400 font-sans mt-1">{totalDays} Days</span>
              <span className="text-[9px] text-slate-500 mt-0.5">including holidays/weekends</span>
            </div>
          </div>

          {/* Reason formulation Textarea */}
          <div>
            <label htmlFor="reason-textarea" className="block text-xs font-bold text-slate-450 mb-2 uppercase tracking-wide">Reason Statement / Medical Justification</label>
            <textarea
              id="reason-textarea"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed font-sans placeholder-slate-600 resize-none"
              placeholder="Provide a clear, brief explanation of your leave reasons for supervisor review..."
              required
            />
          </div>

          {/* Custom File Attachment Area with drag & drop */}
          <div>
            <label className="block text-xs font-bold text-slate-450 mb-2 uppercase tracking-wide">Documentation Attachments (PDF/Images/DOCX)</label>
            
            {!attachment ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                  isDragOver 
                    ? 'border-indigo-500 bg-indigo-505/10 bg-indigo-950/20' 
                    : 'border-slate-800 bg-[#090e18] hover:bg-[#0c1321] hover:border-slate-700'
                }`}
              >
                <Upload className="w-8 h-8 text-slate-500 mb-3" />
                <p className="text-xs font-medium text-slate-300">
                  Drag and drop files to secure corporate storage, or{' '}
                  <label className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer select-none">
                    browse files
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                  </label>
                </p>
                <span className="text-[10px] text-slate-500 mt-1.5 uppercase font-mono">Max size: 10MB</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-[#090e1a] border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-505/10 rounded-lg flex items-center justify-center text-indigo-400">
                    <File className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-200 block truncate max-w-xs">{attachment.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">{(attachment.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Validation Warnings */}
          {errorMess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 bg-amber-955/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-normal"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{errorMess}</span>
            </motion.div>
          )}

          {/* Submit Action Block */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-550 hover:from-indigo-500 hover:to-indigo-500 text-white rounded-xl text-xs uppercase font-bold tracking-wider cursor-pointer shadow-lg shadow-indigo-600/15"
          >
            Submit Leave Application
          </button>
        </form>
      </div>

      {/* Handcrafted Success modal representation */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#000]/65 flex items-center justify-center z-50 p-4 select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-[#0c111e] border border-slate-800 rounded-2xl p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-black text-white font-sans tracking-tight">Application Filed Successfully</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Your casual/sick/earned certificate has been registered under ticket identifier <span className="font-mono text-indigo-400 font-bold">{createdLeaveID}</span>. Dynamic routing algorithms have pushed this to administrative review logs.
            </p>

            <button
              onClick={handleCloseSuccess}
              className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide uppercase cursor-pointer"
            >
              Acknowledge & Proceed
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
