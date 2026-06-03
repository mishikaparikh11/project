import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, CornerRightDown } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Correct credentials for admin
  const VALID_USER = 'lipidata_admin';
  const VALID_PASS = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorCode('Fields cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorCode('');

    // Simulate standard server authentication latency
    setTimeout(() => {
      if (
        (username.toLowerCase() === VALID_USER && password === VALID_PASS) ||
        (username.trim() === 'employee' && password.trim() === 'password')
      ) {
        onLoginSuccess(username);
      } else {
        setErrorCode('Mismatched intranet ID or access token passcode.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  const fillCredentialsPreset = () => {
    setUsername(VALID_USER);
    setPassword(VALID_PASS);
    setErrorCode('');
  };

  const handleGuestLogin = () => {
    onLoginSuccess('Guest User');
  };

  return (
    <div 
      id="lipidata-login-page"
      className="min-h-screen bg-[#080b11] flex flex-col md:flex-row text-slate-100 select-none overflow-hidden"
    >
      {/* Left decorative column: Lipidata Corporate Graphics */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#0f1524] to-[#070b13] relative overflow-hidden flex-col justify-between p-12 lg:p-16 border-r border-slate-800/40">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-violet-600/5 rounded-full filter blur-3xl" />
        
        {/* Core Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center rotate-45">
            <span className="text-sm font-bold tracking-wider -rotate-45">L</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-wider text-slate-100">LIPIDATA</span>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 block -mt-1 uppercase">Technologies</span>
          </div>
        </div>

        {/* Dynamic Display Graphics */}
        <div className="relative z-10 my-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono font-semibold">
              Corporate Intranet Gateway
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mt-6 mb-6 leading-tight text-white font-sans">
              Accelerate your workflow with precision tools.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Welcome to the unified Lipidata Employee cockpit. Track annual leaves, coordinate shift balances, and connect instantly with our dynamic automated support systems.
            </p>
          </motion.div>

          {/* Holographic Stats representation */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm">
            <div className="p-3 border-r border-slate-800/80">
              <span className="text-xs text-slate-500 font-mono block">Intranet Health</span>
              <span className="text-xl font-bold font-sans text-emerald-400">99.98% uptime</span>
            </div>
            <div className="p-3">
              <span className="text-xs text-slate-500 font-mono block">Data Nodes Online</span>
              <span className="text-xl font-bold font-sans text-indigo-400">6 Global hubs</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>© 2026 LIPIDATA INC.</span>
          <span>SECURE END-TO-END SYSTEM</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 sm:px-12 md:px-16 position-relative">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)] md:hidden" />
        
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center rotate-45">
            <span className="text-xs font-bold -rotate-45">L</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-slate-100">LIPIDATA</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">Security Credentials</h3>
            <p className="text-slate-400 text-xs mt-1">Please log in using your registered Lipidata Intranet account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username-field" className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
                Employee Intranet Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username-field"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  placeholder="e.g. lipidata_admin"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password-field" className="block text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Access Key Token
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Access key password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Reporting */}
            {errorCode && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorCode}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In Securely <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Quick Preset Guide Panel */}
          <div className="mt-8 p-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-2">
              <CornerRightDown className="w-3.5 h-3.5" />
              <span>Registered Profile presets:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unlock the core admin simulation by choosing the high-profile profile preset:
            </p>
            <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
              <div className="text-[11px] font-mono text-slate-300">
                <span className="text-indigo-400 font-sans font-medium">U:</span> lipidata_admin{' '}
                <span className="text-slate-600">|</span>{' '}
                <span className="text-indigo-400 font-sans font-medium">P:</span> admin123
              </div>
              <button
                type="button"
                onClick={fillCredentialsPreset}
                className="border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/10 text-indigo-300 text-[10px] uppercase font-mono px-2 py-1 rounded transition-all"
              >
                Auto Fill
              </button>
            </div>
          </div>

          {/* Alternative fast logins */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-5">
            <span>External system user?</span>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in as Guest
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
