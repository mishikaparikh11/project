import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  Ticket, 
  Search, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Trash2,
  Bookmark
} from 'lucide-react';
import { SupportTicket, SupportChatMessage } from '../types';
import { KNOWLEDGE_BASE_FAQS, INITIAL_TICKETS } from '../data/mockData';

interface SupportSystemProps {
  onAddTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'date'>) => void;
  tickets: SupportTicket[];
  onResolveTicket: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}

export default function SupportSystem({ onAddTicket, tickets, onResolveTicket, onDeleteTicket }: SupportSystemProps) {
  // Tabs: Chat assistant or ticket logs
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'tickets' | 'faqs'>('chat');
  
  // FAQs states
  const [faqSearch, setFaqSearch] = useState<string>('');
  
  // Ticket Creator states
  const [ticketTitle, setTicketTitle] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<'it' | 'hr' | 'payroll' | 'facilities'>('it');
  const [ticketUrgency, setTicketUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  
  // Chat States
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am LipiBot, your virtual Lipidata HR & IT compliance specialist. Ask me about leaving quotas, vacation roll-over rules, VPN portals, or employee policy guides.",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dynamic chatbot responses
  const generateBotResponse = (prompt: string): string => {
    const q = prompt.toLowerCase();
    
    if (q.includes('leave') || q.includes('balance') || q.includes('quota') || q.includes('earned') || q.includes('sick')) {
      return `**Lipidata Leave Entitlements Briefing:**\n\n1. **Sick Leaves**: Credited at **1.25 days/month** (maximum 15/year).\n2. **Casual Leaves**: Credited at **1.5 days/month** (max 18/year).\n3. **Earned Leaves**: Vacation time accrued at **2.5 days/month** (max 30/year).\n\n*Important*: Earned leaves must receive manager level speed-authorization at least **15 days prior** to departure.`;
    }
    
    if (q.includes('vpn') || q.includes('it') || q.includes('computer') || q.includes('credentials') || q.includes('db')) {
      return `**LIPIDATA Secure System Protocols:**\n\nIf you are seeing gateway failures while connecting to db instances:\n- Ensure you are utilizing the secondary **Gate-B VPN configuration**.\n- Check if your biometric hash needs token reactivation in the **Settings panel**.\n- IT help desk ticket logs have an average closure response SLA of **1.8 hours**!`;
    }

    if (q.includes('salary') || q.includes('payslip') || q.includes('payroll') || q.includes('hra') || q.includes('tax')) {
      return `**Payroll & HRA Allowances Guide:**\n\n- Monthly salary payouts are initialized on the **24th of each month**.\n- Mismatched HRA or tax deductions are compiled under HR/Payroll audit calendars. Please open a support ticket under the **Payroll** category to trigger immediate compliance audit checking.`;
    }

    if (q.includes('work') || q.includes('hours') || q.includes('shift') || q.includes('mon') || q.includes('flex')) {
      return `**Operating Shifts Notice:**\n\nLipidata runs a fully fluid hybrid schedule. A baseline of **9 hours/day** (inclusive of a 1-hour lunch break) is required.\n\nAll staff are expected to maintain presence during our core working window between **11:00 AM and 4:00 PM** daily.`;
    }

    return `I received your query: "${prompt}". \n\nI am currently operating as an intranet guide. To address this query, you can submit an official compliance request by filing a ticket in our **Tickets dashboard** tab or category group.`;
  };

  const handleSendChatMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: SupportChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateBotResponse(textToSend);
      const botMsg: SupportChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleFileTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDesc.trim()) return;

    onAddTicket({
      title: ticketTitle,
      category: ticketCategory,
      urgency: ticketUrgency,
      description: ticketDesc
    });

    setTicketTitle('');
    setTicketDesc('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setActiveSubTab('tickets');
  };

  const filteredFaqs = KNOWLEDGE_BASE_FAQS.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Support Tab Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-left font-sans">
          <h2 className="text-2xl font-black text-white tracking-tight">Support & Assistance Hub</h2>
          <p className="text-slate-400 text-xs mt-1">
            Browse knowledge databases, chat with helpdesk AI, or file certified IT/HR issue tickets.
          </p>
        </div>

        {/* Dynamic sub nav selection triggers */}
        <div className="flex bg-[#0b101c] border border-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase rounded-lg transition-all cursor-pointer ${activeSubTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> LipiBot Chat
          </button>
          <button 
            onClick={() => setActiveSubTab('tickets')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase rounded-lg transition-all cursor-pointer ${activeSubTab === 'tickets' ? 'bg-indigo-600 text-white shadow' : 'text-slate-405 hover:text-slate-205'}`}
          >
            <Ticket className="w-3.5 h-3.5" /> Issue Tickets
          </button>
          <button 
            onClick={() => setActiveSubTab('faqs')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase rounded-lg transition-all cursor-pointer ${activeSubTab === 'faqs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-450 hover:text-slate-250'}`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Selected Sub-Tab Active Workspace View (8 of 12 columns span) */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b101c] border border-slate-800 rounded-2xl min-h-[500px] overflow-hidden shadow-xl text-left">
          
          <AnimatePresence mode="wait">
            
            {/* SUB-VIEW 1: Interactive Chat Assistant */}
            {activeSubTab === 'chat' && (
              <motion.div 
                key="chat-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between h-full bg-gradient-to-b from-[#0e1424]/40 to-[#0b101c]/60"
              >
                {/* Bot Profile bar */}
                <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-slate-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8.5 h-8.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">LipiBot Specialist</h3>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-indigo-400 block -mt-0.5 font-bold">Auto Guide Agent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                    ONLINE
                  </div>
                </div>

                {/* Message Speech Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px] min-h-[280px]">
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'bot';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs text-left leading-relaxed ${
                          isBot 
                            ? 'bg-[#0e1322] border border-slate-800 text-slate-200' 
                            : 'bg-indigo-650 text-white rounded-br-none shadow shadow-indigo-600/10'
                        }`}>
                          <div className="whitespace-pre-line font-sans font-medium">
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-2 block text-right">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#0e1322] border border-slate-800 rounded-2xl p-3 px-4 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Built-in Chat prompt shortcuts */}
                <div className="p-3 bg-slate-900/30 border-t border-slate-850 flex flex-wrap gap-2 justify-start">
                  <span className="text-[10px] text-slate-500 uppercase font-mono py-1.5 mr-2">FAQS:</span>
                  {[
                    'Leavebalances',
                    'How is work shift flexed?',
                    'Check VPN gate connection'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => handleSendChatMessage(undefined, phrase)}
                      className="text-[10px] bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 rounded-lg p-1.5 px-3 transition-colors cursor-pointer select-none"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* Typing input bar */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-850 flex gap-2 bg-[#090e18]">
                  <input
                    id="chat-input"
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type questions to query our Intranet Bot..."
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer shadow-indigo-600/10 hover:shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </motion.div>
            )}

            {/* SUB-VIEW 2: Ticket Logs & Active tickets list */}
            {activeSubTab === 'tickets' && (
              <motion.div 
                key="tickets-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-6 flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                    <Ticket className="w-4 h-4 text-indigo-400" /> Active Intranet logs
                  </h3>
                  <span className="text-[9px] bg-slate-900 border border-slate-805 text-slate-550 px-2 py-0.5 rounded font-mono font-bold">
                    ACTIVE: {tickets.length}
                  </span>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12 flex-1 flex flex-col justify-center items-center">
                    <CheckCircle className="w-10 h-10 text-slate-700 mb-3" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase">All systems running smoothly</h3>
                    <p className="text-[11px] text-slate-600 mt-1 max-w-xs leading-relaxed">No custom issue ticketslogged. Fill out the Ticket Creator form to submit an incident.</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px]">
                    {tickets.map((t) => (
                      <div 
                        key={t.id}
                        className="bg-[#080d16]/80 border border-slate-850 p-4 rounded-xl flex items-start gap-4 hover:border-slate-800 transition-colors"
                      >
                        {/* icon identifier indicator based on category */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-black ${
                          t.category === 'it' ? 'bg-indigo-505/10 text-indigo-400 border border-indigo-500/20' :
                          t.category === 'hr' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          t.category === 'payroll' ? 'bg-amber-500/10 text-amber-550 border border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {t.category.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Title and descriptions details */}
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{t.title}</span>
                            <span className="text-[9px] font-mono text-indigo-300 font-bold bg-indigo-505 border border-indigo-500/15 py-0.5 px-2 rounded">
                              {t.id}
                            </span>
                          </div>

                          <p className="text-xs text-slate-450 leading-relaxed mt-1.5 font-sans font-medium break-words">
                            {t.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] text-slate-500 font-mono">
                            <span>SUBMITTED: {t.date}</span>
                            <span>● URGENCY: <strong className="uppercase">{t.urgency}</strong></span>
                            <span className="flex items-center gap-1">
                              ● STATUS: 
                              <span className={`uppercase font-bold tracking-tight ${t.status === 'open' ? 'text-amber-500' : 'text-emerald-400'}`}>
                                {t.status}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* action items panels: cancel or mark resolved */}
                        <div className="flex flex-col gap-1.5">
                          {t.status === 'open' ? (
                            <button
                              onClick={() => onResolveTicket(t.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-sans text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
                            >
                              RESOLVE
                            </button>
                          ) : (
                            <button
                              onClick={() => onDeleteTicket(t.id)}
                              className="p-1.5 hover:bg-red-500/10 hover:border-red-500/30 text-slate-500 hover:text-red-400 border border-transparent rounded-lg transition-colors cursor-pointer"
                              title="Delete Archive Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SUB-VIEW 3: FAQS list searcher */}
            {activeSubTab === 'faqs' && (
              <motion.div 
                key="faqs-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-5"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="faq-search"
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search standard intranet compliance articles..."
                    className="block w-full pl-9 pr-3 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#080d16]/60 border border-slate-850 p-4 rounded-xl text-left">
                      <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono font-bold uppercase mb-1">
                        <Bookmark className="w-3 h-3 text-indigo-400 fill-indigo-400" /> Article {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200">{faq.q}</h4>
                      <p className="text-xs text-slate-450 leading-relaxed mt-2 font-mono">{faq.a}</p>
                    </div>
                  ))}
                  {filteredFaqs.length === 0 && (
                    <p className="text-xs text-slate-600 text-center py-6">No matching compliance articles found.</p>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Side: Ticket Creator form (4 of 12 columns span) */}
        <div className="lg:col-span-4 bg-[#0b101c] border border-slate-800 rounded-2xl p-6 text-left shadow-xl flex flex-col justify-between">
          <form onSubmit={handleFileTicket} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide pb-1.5 border-b border-slate-850">
              <Ticket className="w-4 h-4 text-indigo-400" /> Incident Creator
            </h3>

            {/* Category selection */}
            <div>
              <label htmlFor="ticket-category-select" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department Target</label>
              <select
                id="ticket-category-select"
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as any)}
                className="block w-full px-3 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-350 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer text-left"
              >
                <option value="it">IT & VPN Infrastructure</option>
                <option value="hr">HR Council / Compliance</option>
                <option value="payroll">Payroll Verification</option>
                <option value="facilities">Corporate Facility Access</option>
              </select>
            </div>

            {/* Priority Urgency */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Incident Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setTicketUrgency(urg as any)}
                    className={`py-2 rounded-lg border text-[10px] uppercase font-bold tracking-wider font-mono transition-all text-center cursor-pointer ${
                      ticketUrgency === urg
                        ? urg === 'high' 
                          ? 'bg-red-950/20 border-red-500 text-red-400 font-bold font-mono'
                          : urg === 'medium'
                          ? 'bg-amber-955/20 border-amber-500 text-amber-500 font-bold font-mono'
                          : 'bg-emerald-950/20 border-emerald-500 text-emerald-400 font-bold font-mono'
                        : 'bg-[#080c14] border-slate-805 text-slate-450 hover:text-slate-300'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Subject title */}
            <div>
              <label htmlFor="ticket-subject" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject Heading</label>
              <input
                id="ticket-subject"
                type="text"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                placeholder="e.g. Broken office access card, payslip correction..."
                className="block w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Detail description */}
            <div>
              <label htmlFor="ticket-description" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Detailed Description</label>
              <textarea
                id="ticket-description"
                rows={4}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="Describe your request in details so auditing staff can initiate resolution faster..."
                className="block w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 text-xs focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                required
              />
            </div>

            {/* Submit ticket action */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs uppercase font-extrabold tracking-widest shadow shadow-indigo-600/15 cursor-pointer mt-2"
            >
              File Incident Ticket
            </button>
          </form>

          {/* Toast Notification message */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="mt-4 flex items-center gap-2 p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ticket registered successfully. Check Logs!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
