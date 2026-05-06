import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bug, Activity, Database, Server, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';



export function Dashboard() {
  const [otxPulses, setOtxPulses] = useState<any[]>([]);
  const [abuseIps, setAbuseIps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total_scans: 0,
    threats_prevented: 0,
    quarantined: 0,
    pie_data: [],
    recent_threats: []
  });

  // Keep static line data for visual purposes unless we track time series in DB
  const lineData = [
    { name: '00:00', threats: 2, scans: 45 },
    { name: '04:00', threats: 5, scans: 120 },
    { name: '08:00', threats: 1, scans: 340 },
    { name: '12:00', threats: 12, scans: 560 },
    { name: '16:00', threats: 8, scans: 420 },
    { name: '20:00', threats: Math.max(14, stats.threats_prevented), scans: Math.max(290, stats.total_scans) },
  ];

  useEffect(() => {
    fetch('https://backend-malware-2ak0.onrender.com/api/v1/analytics/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);

    fetch('https://backend-malware-2ak0.onrender.com/api/v1/ti/otx/pulses')
      .then(res => res.json())
      .then(data => setOtxPulses(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('https://backend-malware-2ak0.onrender.com/api/v1/ti/abuseipdb/blacklist')
      .then(res => res.json())
      .then(data => setAbuseIps(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">SOC Overview</h2>
          <p className="text-slate-400 mt-1">Real-time threat intelligence and system metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Server className="w-4 h-4" /> Node 1 Active
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Scanned" value={stats.total_scans.toString()} icon={Database} color="text-primary" />
        <MetricCard title="Threats Prevented" value={stats.threats_prevented.toString()} icon={ShieldAlert} color="neon-text-red" glow="shadow-glow-red" />
        <MetricCard title="Quarantined" value={stats.quarantined.toString()} icon={Bug} color="text-eab308" />
        <MetricCard title="System Health" value="100%" icon={Activity} color="neon-text-green" glow="shadow-glow-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-neonBlue" /> Scan Volume vs Threats
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="threats" stroke="#ff073a" strokeWidth={3} dot={{ fill: '#ff073a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6">Threat Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pie_data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.pie_data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {stats.pie_data.map((d: any) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Threats Table */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-neonRed" /> Recent Critical Threats
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="pb-3 font-medium">Incident ID</th>
                <th className="pb-3 font-medium">File Name</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Detection Engine</th>
                <th className="pb-3 font-medium text-right">Time Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {stats.recent_threats.length > 0 ? stats.recent_threats.map((threat: any) => (
                <tr key={threat.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 text-slate-300 font-mono text-xs">{threat.id}</td>
                  <td className="py-4 font-medium text-slate-200">{threat.file}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      threat.severity === 'Critical' ? 'bg-red-500/20 text-neonRed border border-red-500/30' :
                      threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{threat.engine}</td>
                  <td className="py-4 text-slate-500 text-right">{threat.time}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No threats detected yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Threat Intel Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AlienVault OTX Feed */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" /> AlienVault OTX Live IOC Feeds
          </h3>
          <div className="space-y-4">
            {otxPulses.length > 0 ? otxPulses.map((pulse) => (
              <div key={pulse.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-200 line-clamp-1" title={pulse.name}>{pulse.name}</h4>
                  <span className="text-xs text-slate-500 shrink-0">{new Date(pulse.created).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {pulse.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">Indicators: <span className="font-mono text-slate-300">{pulse.indicator_count}</span></span>
                  <span className="flex items-center gap-1">Subscribers: <span className="font-mono text-slate-300">{pulse.subscriber_count}</span></span>
                </div>
              </div>
            )) : (
              <div className="text-center p-6 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                No subscribed pulses or loading...
              </div>
            )}
          </div>
        </div>

        {/* AbuseIPDB Feed */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" /> AbuseIPDB Attacker IPs Blocklist
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-700/50">
                <tr>
                  <th className="pb-3 font-medium">Malicious IP Address</th>
                  <th className="pb-3 font-medium text-center">Abuse Score</th>
                  <th className="pb-3 font-medium text-right">Last Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {abuseIps.length > 0 ? abuseIps.map((ipObj, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 text-slate-300 font-mono text-xs">{ipObj.ipAddress}</td>
                    <td className="py-4 text-center">
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-500/20 text-neonRed border border-red-500/30">
                        {ipObj.abuseConfidenceScore}%
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-right">{new Date(ipObj.lastReportedAt).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">No IPs flagged or loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, icon: Icon, color, glow = '' }: any) {
  return (
    <div className={`glass-panel p-6 relative overflow-hidden group hover:border-slate-500 transition-colors`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white font-mono">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700 ${glow}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}
