import { LeaveRequest, SupportTicket, UserProfile } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  username: 'lipidata_admin',
  fullName: 'Arshia Sharma',
  role: 'Senior Data Engineer',
  department: 'Data Analytics & AI',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  leaveBalances: {
    sick: 8,
    casual: 5,
    earned: 14,
    parental: 20
  }
};

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-4829',
    employeeName: 'Arshia Sharma',
    leaveType: 'earned',
    startDate: '2026-04-10',
    endDate: '2026-04-14',
    totalDays: 5,
    reason: 'Annual family vacation to Manali.',
    status: 'approved',
    appliedDate: '2026-04-01',
    attachmentName: 'flight_tickets_manali.pdf'
  },
  {
    id: 'LV-9182',
    employeeName: 'Arshia Sharma',
    leaveType: 'sick',
    startDate: '2026-05-18',
    endDate: '2026-05-19',
    totalDays: 2,
    reason: 'Suffering from acute seasonal fever and physician advised rest.',
    status: 'approved',
    appliedDate: '2026-05-18',
    attachmentName: 'medical_certificate.docx'
  },
  {
    id: 'LV-1094',
    employeeName: 'Arshia Sharma',
    leaveType: 'casual',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    totalDays: 2,
    reason: 'Urgent domestic work and personal bank appointment.',
    status: 'pending',
    appliedDate: '2026-06-01'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TC-3021',
    title: 'VPN Connection Issues',
    category: 'it',
    description: 'Unable to connect to the secondary VPN gate for LIPIDATA DB servers. Connection times out after 30 seconds.',
    status: 'resolved',
    urgency: 'high',
    date: '2026-05-25'
  },
  {
    id: 'TC-4819',
    title: 'Salary Slip Attachment Missing',
    category: 'payroll',
    description: 'May 2026 payslip list has mismatched HRA calculations on the employee dashboard breakdown.',
    status: 'open',
    urgency: 'medium',
    date: '2026-06-02'
  }
];

export const KNOWLEDGE_BASE_FAQS = [
  {
    q: "How are leave balances calculated?",
    a: "Lipidata leave balances are credited on the 1st of every month. Each employee gets 1.25 Sick Leaves, 1.5 Casual Leaves, and 2.5 Earned Leaves per month."
  },
  {
    q: "What is the policy for Earned Leaves?",
    a: "Earned Leaves must be applied at least 15 days in advance and require manager approval. A maximum of 45 unused Earned Leaves can be carried forward to the next fiscal year."
  },
  {
    q: "How do I raise a dispute on my attendance status?",
    a: "You can submit an attendance rectification form under the Support tab. Please categorize the request under 'HR' and specify the exact dates with check-in/out logs."
  },
  {
    q: "What benefits are covered under parentals?",
    a: "All maternity, paternity, or adoption leaves are grouped under 'Parental Cover' which allows up to 26 weeks of fully paid leave for primary caregivers."
  },
  {
    q: "What is Lipidata's official working hour pattern?",
    a: "Lipidata operates on a flexible 9-hour shift (including 1 hour break) from Monday to Friday, with mandatory core presence hours between 11:00 AM and 4:00 PM."
  }
];
