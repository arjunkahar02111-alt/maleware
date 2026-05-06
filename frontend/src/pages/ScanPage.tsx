import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ShieldAlert, Cpu, Globe, CheckCircle2, AlertTriangle, FileCode2 } from 'lucide-react';

export function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Call actual backend
      const response = await fetch('http://localhost:8000/api/v1/scans/scan', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Scan failed with status:', response.status);
      }
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold text-white tracking-wide">Deep Scan Engine</h2>
        <p className="text-slate-400 mt-1">Multi-layered static, heuristic, and dynamic analysis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Zone */}
        <div className="glass-panel p-8 flex flex-col justify-center">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-neonBlue bg-blue-500/10 shadow-glow-blue' 
                : 'border-slate-600 hover:border-slate-400 bg-slate-800/30'
            }`}
          >
            <UploadCloud className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-neonBlue' : 'text-slate-500'}`} />
            <h3 className="text-xl font-medium text-slate-200 mb-2">Drag & Drop file here</h3>
            <p className="text-slate-500 text-sm mb-6">Supports PE, ELF, PDF, DOCX (Max 50MB)</p>
            
            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-lg font-medium transition-colors border border-slate-600">
              Browse Files
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if(e.target.files) {
                    setFile(e.target.files[0]);
                    setResult(null);
                  }
                }} 
              />
            </label>
          </div>

          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileCode2 className="text-primary w-8 h-8" />
                <div>
                  <p className="text-sm font-bold text-slate-200 truncate w-48">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={handleScan}
                disabled={scanning}
                className="bg-primary hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : 'Launch Scan'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Results Panel */}
        <div className="glass-panel p-8 relative overflow-hidden">
          {scanning && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-slate-700 border-t-neonBlue rounded-full animate-spin mb-4" />
               <p className="text-neonBlue font-mono animate-pulse">Analyzing Entropy...</p>
            </div>
          )}

          {!result && !scanning && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
              <p>Awaiting file submission for deep analysis.</p>
            </div>
          )}

          {result && !scanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center pb-6 border-b border-white/10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
                    <circle cx="48" cy="48" r="45" fill="none" stroke={result.is_malicious ? '#ff073a' : '#39ff14'} strokeWidth="6" strokeDasharray={`${(result.results.risk_score / 100) * 283} 283`} className="transition-all duration-1000" />
                  </svg>
                  <span className="text-3xl font-bold font-mono">{result.results.risk_score}</span>
                </div>
                <h3 className={`text-2xl font-bold ${result.is_malicious ? 'neon-text-red' : 'neon-text-green'}`}>
                  {result.is_malicious ? 'CRITICAL THREAT' : 'FILE SECURE'}
                </h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Engine Breakdown</h4>
                
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode2 className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">Static Heuristics</span>
                  </div>
                  <span className="font-mono text-slate-300">{result.results.static?.static_score}/100</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">Machine Learning</span>
                  </div>
                  <span className="font-mono text-slate-300">{result.results.ml?.ml_score}/100</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">Threat Intelligence</span>
                    </div>
                    <span className="font-mono text-slate-300">
                      {Math.max(
                        result.results.vt?.vt_score || 0,
                        result.results.otx?.otx_score || 0,
                        result.results.abuseipdb?.abuse_score || 0
                      )}/100
                    </span>
                  </div>
                  <div className="space-y-1 mt-1 pl-8">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>VirusTotal:</span> 
                      <span className="font-mono">{result.results.vt?.vt_score || 0}/100</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>AlienVault OTX:</span> 
                      <span className="font-mono">{result.results.otx?.otx_score || 0}/100</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>AbuseIPDB:</span> 
                      <span className="font-mono">{result.results.abuseipdb?.abuse_score || 0}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Threat Intel Sections */}
              <div className="space-y-4 mt-8 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Detailed Threat Intelligence</h4>

                {/* VirusTotal Details */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-slate-200">VirusTotal Analysis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">Malicious Hits</p>
                      <p className="text-lg font-mono text-slate-200">
                        {result.results.vt?.malicious_hits !== undefined ? result.results.vt.malicious_hits : 'N/A'} 
                        <span className="text-sm text-slate-500"> / {result.results.vt?.total_engines || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">Confidence Score</p>
                      <p className={`text-lg font-mono ${result.results.vt?.vt_score > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {result.results.vt?.vt_score?.toFixed(1) || 0}%
                      </p>
                    </div>
                    {result.results.vt?.file_type && result.results.vt?.file_type !== 'Unknown' && (
                      <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50 col-span-2">
                        <p className="text-xs text-slate-500 mb-1">File Type Identification</p>
                        <p className="text-sm font-mono text-slate-200">{result.results.vt.file_type}</p>
                      </div>
                    )}
                    {result.results.vt?.names?.length > 0 && (
                      <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50 col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Associated File Names</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.results.vt.names.map((n: string, i: number) => (
                            <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.results.vt?.tags?.length > 0 && (
                      <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50 col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Analysis Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.results.vt.tags.map((t: string, i: number) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 capitalize">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AlienVault OTX Details */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-slate-200">AlienVault OTX Pulses</span>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Related Threat Pulses</p>
                        <p className="text-lg font-mono text-slate-200">{result.results.otx?.pulse_count !== undefined ? result.results.otx.pulse_count : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                        <p className={`text-lg font-mono ${result.results.otx?.otx_score > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                           {result.results.otx?.otx_score > 0 ? 'Elevated' : 'Clean'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {result.results.otx?.pulse_names?.length > 0 && (
                    <div className="bg-slate-900/30 rounded-md border border-slate-700/30 p-2 mt-3">
                      <p className="text-xs text-slate-500 mb-2 px-2">Associated Threat Campaigns</p>
                      {result.results.otx.pulse_names.map((name: string, i: number) => (
                         <div key={i} className="flex items-center px-2 py-2 border-t border-slate-700/30">
                           <span className="text-sm font-medium text-slate-300 truncate">{name}</span>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AbuseIPDB Details */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Cpu className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-slate-200">AbuseIPDB Network IOCs</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                      <div>
                         <p className="text-xs text-slate-500 mb-1">Extracted IPs Checked</p>
                         <p className="text-lg font-mono text-slate-200">{result.results.abuseipdb?.ips_checked !== undefined ? result.results.abuseipdb.ips_checked : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-slate-500 mb-1">Max Abuse Score</p>
                         <p className={`text-lg font-mono ${result.results.abuseipdb?.abuse_score > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                           {result.results.abuseipdb?.abuse_score || 0}%
                         </p>
                      </div>
                    </div>
                    {result.results.abuseipdb?.details && result.results.abuseipdb.details.length > 0 && (
                      <div className="bg-slate-900/30 rounded-md border border-slate-700/30 p-2">
                        <p className="text-xs text-slate-500 mb-2 px-2">IP Breakdown</p>
                        {result.results.abuseipdb.details.map((ipDetail: any, i: number) => (
                           <div key={i} className="flex justify-between items-center px-2 py-1 border-t border-slate-700/30">
                             <span className="text-sm font-mono text-slate-300">{ipDetail.ip}</span>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${ipDetail.score > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                               {ipDetail.score}% Abuse
                             </span>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {result.is_malicious ? (
                <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-neonRed flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-400">Automated Quarantine Triggered</h4>
                    <p className="text-sm text-red-200/70 mt-1">File has been encrypted and isolated. Network SOC team has been alerted.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/50 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-neonGreen flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-400">No immediate threats found</h4>
                    <p className="text-sm text-emerald-200/70 mt-1">The file is safe to execute in standard environments.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
