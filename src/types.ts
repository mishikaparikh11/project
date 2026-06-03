export type LeaveType = 'sick' | 'casual' | 'earned' | 'parental';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  attachmentName?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: 'it' | 'hr' | 'payroll' | 'facilities';
  description: string;
  status: 'open' | 'resolved';
  urgency: 'low' | 'medium' | 'high';
  date: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  role: string;
  department: string;
  avatarUrl: string;
  leaveBalances: {
    sick: number;
    casual: number;
    earned: number;
    parental: number;
  };
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  time: string;
}
