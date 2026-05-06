import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, FileSearch, Activity, FileText, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/scan', icon: FileSearch, label: 'Scan Engine' },
  { path: '/monitor', icon: Activity, label: 'Live Monitoring' },
  { path: '/reports', icon: FileText, label: 'Threat Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-64 h-screen glass-panel rounded-none border-y-0 border-l-0 fixed left-0 top-0 z-40"
    >
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <div className="relative">
          <ShieldAlert className="w-8 h-8 text-neonGreen drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
        </div>
        <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          DEFENDER
        </h1>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-medium",
                isActive 
                  ? "bg-primary/20 text-neonBlue shadow-[inset_0_0_20px_rgba(0,243,255,0.1)] border border-primary/30" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-neonBlue" : "text-slate-500 group-hover:text-slate-300")} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="absolute left-0 w-1 h-8 bg-neonBlue rounded-r-full shadow-[0_0_10px_#00f3ff]" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </motion.aside>
  );
}
