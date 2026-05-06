import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <header>
        <h2 className="text-3xl font-bold text-white tracking-wide">System Settings</h2>
        <p className="text-slate-400 mt-1">Configure detection engines and API integrations.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Detection Engine Settings */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-neonBlue" /> Detection Engines
          </h3>
          <div className="space-y-4">
            <ToggleOption title="Machine Learning Inference" desc="Use local Scikit-Learn models for predictive heuristics." enabled={true} />
            <ToggleOption title="YARA Signature Matching" desc="Scan files against the custom YARA rule repository." enabled={true} />
            <ToggleOption title="Dynamic Sandboxing (Docker)" desc="Execute untrusted files in isolated containers." enabled={false} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function ToggleOption({ title, desc, enabled }: { title: string, desc: string, enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
      <div>
        <p className="font-medium text-slate-200">{title}</p>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-slate-700'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7 shadow-glow-blue' : 'left-1'}`} />
      </div>
    </div>
  );
}
