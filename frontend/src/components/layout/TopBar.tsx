import { Search, Bell, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/scans/search?q=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 ml-0 md:ml-64 px-8 flex items-center justify-between glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-30"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <ShieldCheck className="w-4 h-4 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          <span className="text-sm font-semibold tracking-wide">SYSTEM SECURE</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block z-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hashes, files..." 
            className="w-72 bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-10 text-sm text-slate-200 focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-all placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
            </button>
          )}
          
          <AnimatePresence>
            {searchQuery.length >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-96 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-3 border-b border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Search Results</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((res: any) => (
                      <div key={res.id} className="p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-200 truncate w-48">{res.file_name}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${res.is_malicious ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {res.overall_risk_score}/100
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 truncate">{res.file_hash}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-400">No results found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neonRed shadow-[0_0_8px_#ff073a] animate-pulse" />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">Arjun Kahar</p>
            <p className="text-xs text-slate-500">Tier 3 Analyst</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-neonBlue p-[2px]">
            <div className="w-full h-full rounded-full bg-darkBg flex items-center justify-center">
              <span className="text-sm font-bold text-white">AK</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
