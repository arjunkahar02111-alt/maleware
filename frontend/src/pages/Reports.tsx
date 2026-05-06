import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'SCN-1049', date: '2026-05-05 14:32', file: 'update_v4.exe', status: 'Clean', score: 12 },
  { id: 'SCN-1048', date: '2026-05-05 13:10', file: 'payload.dll', status: 'Malicious', score: 95 },
  { id: 'SCN-1047', date: '2026-05-04 09:45', file: 'report.pdf', status: 'Clean', score: 2 },
  { id: 'SCN-1046', date: '2026-05-04 08:20', file: 'keygen.zip', status: 'Suspicious', score: 55 },
];

export function Reports() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Threat Reports</h2>
          <p className="text-slate-400 mt-1">Historical scan data and compliance exports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </header>

      <div className="glass-panel p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Hash, or Filename..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-neonBlue"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 transition-colors text-slate-300">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="pb-3 font-medium">Scan ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">File Name</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-slate-300 font-mono text-xs">{report.id}</td>
                  <td className="py-4 text-slate-400">{report.date}</td>
                  <td className="py-4 font-medium text-slate-200">{report.file}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      report.status === 'Malicious' ? 'bg-red-500/20 text-neonRed border border-red-500/30' :
                      report.status === 'Suspicious' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${report.score > 60 ? 'bg-neonRed' : report.score > 40 ? 'bg-yellow-400' : 'bg-emerald-400'}`} 
                          style={{ width: `${report.score}%` }} 
                        />
                      </div>
                      <span className="font-mono text-slate-400 text-xs">{report.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
