import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Square, FolderSearch } from 'lucide-react';

// Mock live logs
const MOCK_LOGS = [
  "[SYS] Scanning /var/www/html/uploads/avatar.png ... CLEAN",
  "[SYS] Scanning /etc/passwd ... CLEAN",
  "[WARN] High entropy detected in /tmp/installer.sh",
  "[ALERT] YARA match 'suspicious_packer' in /tmp/installer.sh",
  "[ACTION] /tmp/installer.sh sent to sandbox for dynamic analysis",
  "[SYS] Scanning /usr/bin/python3 ... CLEAN",
];

export function Monitoring() {
  const [logs, setLogs] = useState<string[]>(["[SYS] Monitoring engine initialized."]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
        setLogs(prev => [randomLog, ...prev].slice(0, 50));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            Real-Time Monitor 
            {isActive && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-neonGreen"></span></span>}
          </h2>
          <p className="text-slate-400 mt-1">Live filesystem watching and log streaming.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 transition-colors">
            <FolderSearch className="w-4 h-4" /> Watch Folder
          </button>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
              isActive ? 'bg-red-500/20 text-neonRed border border-red-500/50 shadow-glow-red hover:bg-red-500/30' : 'bg-primary text-white hover:bg-blue-600'
            }`}
          >
            {isActive ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start Engine</>}
          </button>
        </div>
      </header>

      <div className="glass-panel p-1 rounded-2xl border border-slate-700/50 bg-[#0a0f18] h-[600px] flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-800/30 rounded-t-2xl">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">Live Terminal Output</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 flex flex-col-reverse">
          <AnimatePresence>
            {logs.map((log, i) => {
              let colorClass = "text-slate-300";
              if (log.includes("[WARN]")) colorClass = "text-yellow-400";
              if (log.includes("[ALERT]")) colorClass = "neon-text-red font-bold";
              if (log.includes("[ACTION]")) colorClass = "text-blue-400";
              if (log.includes("CLEAN")) colorClass = "text-emerald-400";

              return (
                <motion.div 
                  key={`${i}-${log}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${colorClass} py-1 border-b border-white/5`}
                >
                  <span className="text-slate-600 mr-4">{new Date().toLocaleTimeString()}</span>
                  {log}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
