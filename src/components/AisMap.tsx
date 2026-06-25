import React, { useState } from "react";
import { MapPin, Shield, Layers, ZoomIn, ZoomOut, AlertOctagon, HelpCircle } from "lucide-react";
import { CommunityIssue } from "../types";

interface AisMapProps {
  issues: CommunityIssue[];
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
  onSelectCoordinate: (lat: number, lng: number, address: string) => void;
  activeFilters: {
    category: string;
    severity: string;
    status: string;
  };
}

export default function AisMap({
  issues,
  selectedIssueId,
  onSelectIssue,
  onSelectCoordinate,
  activeFilters,
}: AisMapProps) {
  const [mapMode, setMapMode] = useState<"standard" | "heatmap" | "cluster">("standard");
  const [zoom, setZoom] = useState<number>(14);
  const [toastMessage, setToastMessage] = useState<string | null>("💡 Protip: Click anywhere on the map grid to pin a new issue location!");

  // Base map boundaries (San Francisco central segment grid)
  const mapCenter = { lat: 37.768, lng: -122.44 };
  const latRange = 0.04; // height
  const lngRange = 0.08; // width

  // Filter issues according to standard criteria
  const filteredIssues = issues.filter((issue) => {
    if (activeFilters.category !== "All" && issue.category !== activeFilters.category) return false;
    if (activeFilters.severity !== "All" && issue.severity !== activeFilters.severity) return false;
    if (activeFilters.status !== "All" && issue.status !== activeFilters.status) return false;
    return true;
  });

  // Calculate coordinates in SVG dimensions (800x450 box)
  const getXY = (lat: number, lng: number) => {
    const x = ((lng - (mapCenter.lng - lngRange / 2)) / lngRange) * 800;
    const y = (1 - (lat - (mapCenter.lat - latRange / 2)) / latRange) * 450;
    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert SVG coordinates back to Latitude / Longitude
    const pctX = clickX / rect.width;
    const pctY = 1 - clickY / rect.height;

    const clickedLng = mapCenter.lng - lngRange / 2 + pctX * lngRange;
    const clickedLat = mapCenter.lat - latRange / 2 + pctY * latRange;

    // Formulate a beautiful relative mock address based on coordinates
    const streets = ["Oak Street", "Castro Street", "24th Street", "Geary Boulevard", "Cole Street", "Fell Street"];
    const blocks = Math.floor(100 + clickedLat * 10000) % 90 * 10;
    const randomStreet = streets[Math.floor((clickX + clickY) % streets.length)];
    const mockAddress = `${blocks} ${randomStreet}, San Francisco, CA 94117`;

    onSelectCoordinate(Number(clickedLat.toFixed(5)), Number(clickedLng.toFixed(5)), mockAddress);
    setToastMessage(`📍 Geolocation Saved: Added pin at "${mockAddress}"`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Helper colors for issues on maps
  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "Critical":
        return { bg: "bg-red-500", border: "border-red-300", text: "text-red-500", glow: "shadow-red-500/50" };
      case "High":
        return { bg: "bg-amber-500", border: "border-amber-300", text: "text-amber-500", glow: "shadow-amber-500/50" };
      case "Medium":
        return { bg: "bg-blue-500", border: "border-blue-300", text: "text-blue-500", glow: "shadow-blue-500/50" };
      default:
        return { bg: "bg-emerald-500", border: "border-emerald-300", text: "text-emerald-500", glow: "shadow-emerald-500/50" };
    }
  };

  return (
    <div className="relative w-full h-[480px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all select-none">
      
      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-md">
          <button
            onClick={() => setMapMode("standard")}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              mapMode === "standard"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🛰️ Incident Markers
          </button>
          <button
            onClick={() => setMapMode("heatmap")}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              mapMode === "heatmap"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 Severity Heatmap
          </button>
          <button
            onClick={() => setMapMode("cluster")}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              mapMode === "cluster"
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌐 Ward Sectors
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1 shadow-md text-xs text-slate-350">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-indigo-200">{filteredIssues.length} Incidents Pinpointed</span>
        </div>
      </div>

      {/* Grid HUD Right */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-1.5 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-lg p-1.5 shadow-md">
        <button
          onClick={() => setZoom((z) => Math.min(18, z + 1))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(12, z - 1))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Canvas Map */}
      <svg
        onClick={handleMapClick}
        viewBox="0 0 800 450"
        className="w-full h-full cursor-crosshair transform transition-all duration-300"
        style={{ backgroundColor: "#060a16" }}
        id="civic-map"
      >
        <defs>
          <radialGradient id="mapGlow">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
          {/* Glowing dot definitions */}
          <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Map Glow */}
        <rect width="800" height="450" fill="url(#mapGlow)" />

        {/* GIS Grid Intersections */}
        <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5">
          <line x1="100" y1="0" x2="100" y2="450" />
          <line x1="200" y1="0" x2="200" y2="450" />
          <line x1="300" y1="0" x2="300" y2="450" />
          <line x1="400" y1="0" x2="400" y2="450" />
          <line x1="500" y1="0" x2="500" y2="450" />
          <line x1="600" y1="0" x2="600" y2="450" />
          <line x1="700" y1="0" x2="700" y2="450" />
          <line x1="0" y1="100" x2="800" y2="100" />
          <line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="300" x2="800" y2="300" />
          <line x1="0" y1="400" x2="800" y2="400" />
        </g>

        {/* Major Water Bodies (Aesthetic SF Marina / Bay boundaries in SVG) */}
        <path
          d="M 0 50 Q 150 120 300 130 T 600 80 T 800 150 L 800 0 L 0 0 Z"
          fill="#0c1d3a"
          opacity="0.6"
        />
        <text x="450" y="40" className="fill-slate-700 font-sans tracking-widest text-[10px] uppercase font-bold">San Francisco Bay Area</text>

        {/* Major District Ward Polygons Boundaries in Vector Cluster view */}
        {mapMode === "cluster" && (
          <g opacity="0.4" stroke="#4f46e5" strokeWidth="1" fill="none">
            {/* Ward 1 Richmond */}
            <path d="M 0 50 L 250 120 L 200 450 L 0 450 Z" fill="#4f46e5" fillOpacity="0.05" />
            <text x="80" y="320" className="fill-indigo-300 font-bold font-sans text-xs">Ward 1 (Richmond)</text>
            
            {/* Ward 5 Haight */}
            <path d="M 250 120 L 500 180 L 450 450 L 200 450 Z" fill="#ec4899" fillOpacity="0.05" stroke="#ec4899" />
            <text x="290" y="360" className="fill-pink-300 font-bold font-sans text-xs">Ward 5 (Haight-Ashbury)</text>

            {/* Ward 9 Mission */}
            <path d="M 500 180 L 800 150 L 800 450 L 450 450 Z" fill="#06b6d4" fillOpacity="0.05" stroke="#06b6d4" />
            <text x="580" y="320" className="fill-cyan-300 font-bold font-sans text-xs">Ward 9 (Mission Dist)</text>
          </g>
        )}

        {/* High-Fidelity Road Network layout paths */}
        <g stroke="#334155" strokeWidth="1.5" opacity="0.6" fill="none">
          {/* Main Highway 101 Belt */}
          <path d="M 120 450 Q 240 280 430 180 T 800 160" stroke="#475569" strokeWidth="4" />
          <path d="M 120 450 Q 240 280 430 180 T 800 160" stroke="#64748b" strokeWidth="1" />
          
          {/* Oak Street / Grid Streets */}
          <line x1="0" y1="250" x2="800" y2="250" />
          <line x1="0" y1="180" x2="800" y2="180" />
          <line x1="0" y1="350" x2="800" y2="350" />

          {/* Cross avenues */}
          <line x1="200" y1="50" x2="150" y2="450" />
          <line x1="380" y1="50" x2="330" y2="450" />
          <line x1="560" y1="50" x2="520" y2="450" />
          <line x1="720" y1="50" x2="680" y2="450" />
        </g>

        {/* Heatmap Layer */}
        {mapMode === "heatmap" && (
          <g opacity="0.75">
            {filteredIssues.map((issue) => {
              const { x, y } = getXY(issue.location.lat, issue.location.lng);
              const radius = issue.severity === "Critical" ? 90 : issue.severity === "High" ? 65 : 45;
              const glowGradient = issue.severity === "Critical" ? "url(#redGlow)" : issue.severity === "High" ? "url(#amberGlow)" : "url(#blueGlow)";
              return (
                <circle
                  key={`heat-${issue.id}`}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={glowGradient}
                  className="animate-pulse"
                />
              );
            })}
          </g>
        )}

        {/* SVG Incident Markers Layer */}
        {mapMode !== "heatmap" &&
          filteredIssues.map((issue) => {
            const { x, y } = getXY(issue.location.lat, issue.location.lng);
            const size = issue.id === selectedIssueId ? 22 : 14;
            const colors = getSeverityColors(issue.severity);
            const isSelected = issue.id === selectedIssueId;

            return (
              <g
                key={`marker-${issue.id}`}
                transform={`translate(${x}, ${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIssue(isSelected ? null : issue.id);
                }}
                className="group cursor-pointer"
              >
                {/* Ping Radiation Pulse */}
                <circle
                  r={isSelected ? 24 : 12}
                  className="fill-none stroke-current opacity-80 animate-ping"
                  color={issue.severity === "Critical" ? "#ef4444" : issue.severity === "High" ? "#f59e0b" : "#3b82f6"}
                  strokeWidth="0.75"
                />

                {/* Pin base hover glow */}
                <circle
                  r={size / 2}
                  className={`fill-slate-900 stroke-2 cursor-pointer transition-all duration-300 ${colors.border}`}
                  style={{
                    filter: "drop-shadow(0px 0px 8px rgba(0,0,0,0.8))",
                  }}
                />

                {/* Center Core dot */}
                <circle
                  r={isSelected ? 6 : 4}
                  className={`${colors.bg} cursor-pointer transition-all duration-200`}
                />

                {/* Holographic Tooltip above Node */}
                <g
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  transform={`translate(0, ${isSelected ? -28 : -20})`}
                  style={{ pointerEvents: "none" }}
                >
                  <rect
                    x="-80"
                    y="-38"
                    width="160"
                    height="34"
                    rx="5"
                    className="fill-slate-900/95 stroke stroke-slate-700"
                    strokeWidth="1"
                  />
                  <text
                    y="-24"
                    className="fill-white font-sans text-[10px] font-bold text-center"
                    textAnchor="middle"
                  >
                    {issue.title.length > 25 ? `${issue.title.slice(0, 23)}...` : issue.title}
                  </text>
                  <text
                    y="-11"
                    className="fill-slate-400 font-mono text-[8px]"
                    textAnchor="middle"
                  >
                    Priority score: {issue.aiAnalysis?.priorityScore || 50}/100 • {issue.status}
                  </text>
                  <polygon points="0,0 -4,-4 4,-4" className="fill-slate-900 stroke stroke-slate-700" strokeWidth="1" />
                  <rect x="-3" y="-5" width="6" height="2" className="fill-slate-900" />
                </g>
              </g>
            );
          })}
      </svg>

      {/* Floating Bottom HUD Toast Message */}
      {toastMessage && (
        <div className="absolute bottom-4 left-4 z-10 max-w-[85%] bg-slate-900/95 backdrop-blur border border-slate-800 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold animate-bounce shadow-lg flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
