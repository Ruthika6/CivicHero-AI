import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Activity, ShieldCheck, Zap, Droplet, Trash, HeartPulse, Sparkles, RefreshCw } from "lucide-react";
import { CommunityHealthScore, CommunityIssue } from "../types";

interface AnalyticsDashboardProps {
  issues: CommunityIssue[];
  healthScores: CommunityHealthScore[];
  onTriggerWardScan: (wardName: string) => Promise<any>;
}

export default function AnalyticsDashboard({
  issues,
  healthScores,
  onTriggerWardScan,
}: AnalyticsDashboardProps) {
  const [selectedWard, setSelectedWard] = useState(healthScores[0]?.ward || "Ward 5 (Haight-Ashbury)");
  const [isScanning, setIsScanning] = useState(false);

  // Derive charts coordinates datasets in real-time
  // Category Breakdown distribution
  const categoriesList = ["Road Damage", "Water Leakage", "Broken Streetlight", "Garbage Dump", "Environmental", "Public Safety"];
  const barChartData = categoriesList.map((cat) => {
    const rawCount = issues.filter((i) => i.category === cat).length;
    return {
      name: cat.split(" ")[0] || cat,
      issues: rawCount,
    };
  });

  // Monthly reporting trends line simulation (Recharts AreaChart)
  const areaChartData = [
    { month: "Jan", reported: 12, resolved: 8 },
    { month: "Feb", reported: 18, resolved: 14 },
    { month: "Mar", reported: 22, resolved: 17 },
    { month: "Apr", reported: 29, resolved: 23 },
    { month: "May", reported: 35, resolved: 31 },
    { month: "Jun", reported: issues.length, resolved: issues.filter((i) => i.status === "resolved").length },
  ];

  const currentWardScore = healthScores.find((h) => h.ward === selectedWard) || healthScores[0];

  const handleRunWardScan = async () => {
    setIsScanning(true);
    try {
      await onTriggerWardScan(selectedWard);
    } catch (err) {
      console.error(err);
    } finally {
      // Small timeout for user experience
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  const getPillarColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Locality Health Agent Diagnostics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden xl:col-span-1 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">AI Locality Health Audit</h3>
              </div>
              <button
                onClick={handleRunWardScan}
                disabled={isScanning}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white transition-all text-slate-400 active:scale-95 disabled:opacity-40"
                title="Run Gemini Core Ward Scan"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>

            {/* Select Ward Dropdown */}
            <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
              <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-widest block">Choose Sector Node</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full bg-slate-900 text-xs text-slate-200 outline-none border-none py-1 cursor-pointer font-semibold"
              >
                {healthScores.map((h) => (
                  <option key={h.ward} value={h.ward}>
                    {h.ward}
                  </option>
                ))}
              </select>
            </div>

            {/* Comprehensive overall rating score gauge center */}
            <div className="text-center py-3 bg-slate-950/20 rounded-xl border border-slate-850/60 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Community Health score</span>
              <div className="text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                {currentWardScore?.overall || 75}%
              </div>
              <span className="text-[9.5px] text-slate-500 font-mono">
                Last updated: {new Date(currentWardScore?.analyzedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Dynamic Diagnostics Text Card */}
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Gemini Diagnostic Summary</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                {isScanning 
                  ? "Re-compiling structural complaints in sector network... Running high-dimensional diagnostic patterns..." 
                  : currentWardScore?.aiDiagnostic || "Diagnostic audit data loaded."}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed font-sans mt-3 border-t border-slate-800/80 pt-3">
            Health grades are compiled on-demand utilizing spatial incident density filters and resolved history parameters.
          </div>
        </div>

        {/* 5 Health Pillars Indicators Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative xl:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Infrastructure Health Indicators</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-450">Ward Breakdown Matrix</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              
              {/* Roads */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-center flex flex-col items-center justify-between h-[110px] hover:border-slate-800 transition-colors">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Street Surfaces</span>
                <span className={`text-xl font-mono font-black ${getPillarColor(currentWardScore?.roads)}`}>
                  {currentWardScore?.roads}%
                </span>
              </div>

              {/* Lighting */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-center flex flex-col items-center justify-between h-[110px] hover:border-slate-800 transition-colors">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Electric Grid</span>
                <span className={`text-xl font-mono font-black ${getPillarColor(currentWardScore?.lighting)}`}>
                  {currentWardScore?.lighting}%
                </span>
              </div>

              {/* Cleanliness */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-center flex flex-col items-center justify-between h-[110px] hover:border-slate-800 transition-colors">
                <Trash className="w-5 h-5 text-purple-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sanitation</span>
                <span className={`text-xl font-mono font-black ${getPillarColor(currentWardScore?.cleanliness)}`}>
                  {currentWardScore?.cleanliness}%
                </span>
              </div>

              {/* Water */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-center flex flex-col items-center justify-between h-[110px] hover:border-slate-800 transition-colors">
                <Droplet className="w-5 h-5 text-cyan-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Water Utility</span>
                <span className={`text-xl font-mono font-black ${getPillarColor(currentWardScore?.water)}`}>
                  {currentWardScore?.water}%
                </span>
              </div>

              {/* Safety */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1 flex flex-col items-center justify-between h-[110px] hover:border-slate-800 transition-colors">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Public Safety</span>
                <span className={`text-xl font-mono font-black ${getPillarColor(currentWardScore?.safety)}`}>
                  {currentWardScore?.safety}%
                </span>
              </div>

            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 hover:bg-indigo-505/10 transition-colors border border-indigo-500/10 rounded-xl flex items-center gap-3 mt-4">
            <span className="shrink-0 text-xl">💡</span>
            <p className="text-[10.5px] text-indigo-200">
              <span className="font-bold">AI Proactive Target Suggestion:</span> Based on recent lighting blackouts near 18th Ave, public safety indexes will drop to 72% within 14 days if bulb sockets are not cleared.
            </p>
          </div>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category breakdown (Bar) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Complaint Volume by Category</h4>
          </div>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff", fontSize: "11px" }}
                />
                <Bar dataKey="issues" fill="url(#purpleGlow)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume trend reported vs resolved (Area) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Municipal Resolution Trend lines</h4>
          </div>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity="0.3" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="reported" stroke="#3b82f6" fillOpacity={0.1} fill="url(#blueGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={0.06} fill="url(#greenGrad)" strokeWidth={2.5} />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
