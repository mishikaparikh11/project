import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  const steps = [
    { text: 'Establishing secure network bridge...', icon: Server },
    { text: 'Resolving Lipidata encrypted databases...', icon: Database },
    { text: 'Synchronizing biometric intranet sessions...', icon: ShieldCheck }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setProgress(0);
    setCurrentStep(0);

    if (!isOnline) return;

    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const runProgress = () => {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            setTimeout(() => {
              onComplete();
            }, 500);
            return 100;
          }
          return prev + 1;
        });
      }, 35);
    };

    const runSteps = () => {
      stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepTimer);
          return prev;
        });
      }, 1000);
    };

    runProgress();
    runSteps();

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [isOnline, retryTrigger, onComplete]);

  const handleRetry = () => {
    setIsOnline(navigator.onLine);
    setRetryTrigger((prev) => prev + 1);
  };

  return (
    <div 
      id="lipidata-splash-screen"
      className="fixed inset-0 bg-[#0c0f17] flex flex-col items-center justify-center text-white overflow-hidden select-none"
    >
      {/* Background visual graphics */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center">
        {/* Animated Lipidata Hex Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center mb-8"
        >
          {/* Pulsing ring outer */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute w-24 h-24 border border-dashed border-indigo-500/40 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute w-32 h-32 border border-indigo-500/10 rounded-full"
          />
          
          {/* Center Hex Emblem representing lipids/data network */}
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] rotate-45 transform">
            <span className="text-2xl font-bold font-sans tracking-wider text-white -rotate-45 block">L</span>
          </div>
        </motion.div>

        {/* Company Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 font-sans text-center mb-2"
        >
          L I P I D A T A
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs tracking-[0.25em] text-indigo-300 font-sans uppercase font-medium mb-12 text-center"
        >
          Secure Employee Hub
        </motion.p>

        {/* Network State UI */}
        <AnimatePresence mode="wait">
          {!isOnline ? (
            <motion.div
              key="offline-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center p-6 bg-red-950/20 border border-red-500/30 rounded-2xl w-full"
            >
              <WifiOff className="w-10 h-10 text-red-400 mb-3 animate-pulse" />
              <h3 className="text-base font-semibold text-red-200 mb-1">Network Hub Unavailable</h3>
              <p className="text-xs text-red-400/80 max-w-xs mb-4">
                Lipidata secure services require an active internet connection. Please check your network and retry.
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium text-xs tracking-wider uppercase transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reconnect
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="connecting-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="w-full flex items-center justify-between text-[11px] text-indigo-300/80 px-1 mb-8 font-mono">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Secure Link Active
                </span>
                <span>{progress}% Loaded</span>
              </div>

              {/* Steps Progress Checklist */}
              <div className="w-full space-y-3 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                {steps.map((step, idx) => {
                  const IconComponent = step.icon;
                  const isActive = idx === currentStep;
                  const isDone = idx < currentStep;

                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-3 transition-opacity duration-300 ${isDone ? 'opacity-50' : isActive ? 'opacity-100' : 'opacity-20'}`}
                    >
                      <div className="flex-shrink-0">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <span className="text-[10px] font-bold">✓</span>
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-spin">
                            <RefreshCw className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <IconComponent className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-sans font-medium text-slate-300">{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corporate Signatures */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-[11px] tracking-wide text-slate-600 font-mono">
          Powered by Lipidata Intranet System v4.19 (SSL Compliant)
        </p>
      </div>
    </div>
  );
}
