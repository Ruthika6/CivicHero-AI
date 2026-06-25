import React, { useState, useEffect } from "react";
import { Camera, Mic, MapPin, Send, Cpu, CheckCircle2, RotateCcw, Compass } from "lucide-react";

interface AiReporterProps {
  currentUserId: string;
  selectedCoordinate: { lat: number; lng: number; address: string } | null;
  onSubmitReport: (reportData: {
    title: string;
    category: string;
    description: string;
    location: { lat: number; lng: number; address: string; ward: string };
    severity: string;
    imageUrl?: string;
    voiceUrl?: string;
  }) => Promise<any>;
}

export default function AiReporter({
  currentUserId,
  selectedCoordinate,
  onSubmitReport,
}: AiReporterProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [address, setAddress] = useState("");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "running" | "completed">("idle");
  const [activeStep, setActiveStep] = useState(0);

  // Sync selected coordinate from map interaction
  useEffect(() => {
    if (selectedCoordinate) {
      setLat(selectedCoordinate.lat.toString());
      setLng(selectedCoordinate.lng.toString());
      setAddress(selectedCoordinate.address);
    }
  }, [selectedCoordinate]);

  const presetImages = [
    { name: "Pothole Pit", url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=300&q=80", cat: "Road Damage" },
    { name: "Water Leaking Stream", url: "https://images.unsplash.com/photo-1527142879015-19a4e107ad6c?auto=format&fit=crop&w=300&q=80", cat: "Water Leakage" },
    { name: "Shattered Bulb", url: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=300&q=80", cat: "Broken Streetlight" },
    { name: "Dumped Rubbish", url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=300&q=80", cat: "Garbage Dump" }
  ];

  // Simulated Voice Recorder Transcription Event
  const startRecordingVoice = () => {
    setIsRecording(true);
    setVoiceRecorded(false);
    
    // Simulate speech-to-text writing into the description after 3s
    setTimeout(() => {
      setIsRecording(false);
      setVoiceRecorded(true);
      setDescription("Recorded Voice Note: There is a massive structural leakage bursting through the main sidewalk blocks. The pavement is getting wet and eroded, people have to step onto the street to avoid it.");
      setTitle("Sidewalk Water Eruption");
      setCategory("Water Leakage");
      setSeverity("High");
    }, 3500);
  };

  const steps = [
    {
      agent: "Vision Analysis Agent",
      status: "Analyzing uploaded images using Gemini Vision embeddings...",
      result: imageUrl ? "Detected structural cement failure (pothole/crack) at 94% confidence. Assessed hazard depth of 8 inches." : "No visual image uploaded. Processing via alternative sensor metadata streams."
    },
    {
      agent: "Classification Agent",
      status: "Re-indexing irregular inputs and drafting database registers...",
      result: `Sanitized and classified as a municipal [${category}] case. Title: "${title || "Hazardous incident"}".`
    },
    {
      agent: "Duplicate Check Agent",
      status: "Pinpointing location node against adjacent registered coordinates...",
      result: "Database scan complete. No duplicates found within 500 meters of coordinates. Approved for registration."
    },
    {
      agent: "Impact Prediction Agent",
      status: "Assessing structural threat curves and citizen transit risk loads...",
      result: `High sub-grade erosion risk found. Estimated impact: ~750 residents affected. Core infrastructure collapse predicted if unresolved.`
    },
    {
      agent: "Priority Scoring Agent",
      status: "Combining severity scores, upvote structures, and risk factors...",
      result: `Calculated Priority Index: ${category === "Water Leakage" ? "95/100" : "85/100"}. Calibrated department queue targets.`
    },
    {
      agent: "Resolution Planning Agent",
      status: "Drafting material specifications and contractor costing files...",
      result: `Formulated repair blueprint. Materials: Aggregate dense cold packing. Estimated municipal cost: $350 - $550. Target: 3 days.`
    }
  ];

  // Pipeline runner simulation
  const handleReportSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please designate a location pin either manually or by clicking on the Map Canvas above first!");
      return;
    }

    setPipelineState("running");
    setActiveStep(0);

    // Slowly stagger showing the agents diagnostics
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setPipelineState("completed");
          return prev;
        }
      });
    }, 1500);

    // When done, add issue to databases
    setTimeout(async () => {
      await onSubmitReport({
        title: title || `Municipal ${category} Report`,
        category,
        description: description || "Report submitted via CivicHero smart app.",
        location: {
          lat: Number(lat) || 37.7749,
          lng: Number(lng) || -122.4194,
          address,
          ward: address.includes("Mission") ? "Ward 9 (Mission District)" : address.includes("Richmond") ? "Ward 1 (Richmond District)" : address.includes("Castro") ? "Ward 8 (Castro/Noe Valley)" : "Ward 5 (Haight-Ashbury)"
        },
        severity,
        imageUrl: imageUrl || ""
      });
    }, steps.length * 1500 + 500);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl(null);
    setVoiceRecorded(false);
    setPipelineState("idle");
    setActiveStep(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Cpu className="w-6 h-6 text-indigo-400" />
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Report Smart AI Issue</h2>
          <p className="text-xs text-slate-400">Ensemble of 6 AI Agents classify, analyze, and prioritize reported problems.</p>
        </div>
      </div>

      {pipelineState === "idle" && (
        <form onSubmit={handleReportSubmission} className="space-y-4">
          
          {/* Geolocation Hook */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Geolocation Pin Placement (Selected on Map)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  placeholder="Latitude (e.g., 37.7712)"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Longitude (e.g., -122.4285)"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Click on the Map Grid above to pin exact coordinates automatically"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350">Problem Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Road Damage">🕳️ Road Damage (Potholes, Cracks)</option>
                <option value="Water Leakage">💧 Water Leakage (Burst Pipes, Floods)</option>
                <option value="Broken Streetlight">💡 Broken Streetlight (Dark Zones)</option>
                <option value="Garbage Dump">🗑️ Garbage Dump (Illegal Rubbish Accumulation)</option>
                <option value="Environmental">🌳 Environmental & Forestry Concerns</option>
                <option value="Public Safety">🚨 General Public Safety Risk</option>
              </select>
            </div>

            {/* Severity estimation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350">Your Severity Assessment</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Low">🟢 Low (Minor aesthetic concern)</option>
                <option value="Medium">🟡 Medium (Hindering standard operations)</option>
                <option value="High">🟠 High (Vehicular threat / public nuisance)</option>
                <option value="Critical">🔴 Critical (Immediate emergency / safety hazard)</option>
              </select>
            </div>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-350">Complaint Header / Title</label>
            <input
              type="text"
              placeholder="e.g., Giant pothole on right lane lane"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-350">Details & Description</label>
            <textarea
              placeholder="Describe what happened, visible damage, risks, and how long it has been present..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-sans resize-none transition-colors"
              required
            />
          </div>

          {/* Multimodal Attachments Center */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            
            {/* Camera / Visual mock attachments selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Visual Attachments</span>
              <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
                {presetImages.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => {
                      setImageUrl(img.url);
                      setCategory(img.cat);
                    }}
                    className={`relative w-12 h-12 rounded border-2 transition-all overflow-hidden shrink-0 ${
                      imageUrl === img.url ? "border-indigo-500 scale-105" : "border-slate-800 hover:border-slate-650"
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[7px] text-center text-slate-300 py-0.5 whitespace-nowrap overflow-hidden">
                      {img.name.split(" ")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Voice transcription simulator */}
            <div className="flex flex-col justify-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Mic Transcription</span>
              <button
                type="button"
                onClick={startRecordingVoice}
                disabled={isRecording}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  isRecording 
                    ? "bg-red-500/20 border-red-500 text-red-100 animate-pulse"
                    : voiceRecorded
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${isRecording ? "text-red-500" : voiceRecorded ? "text-emerald-400" : "text-slate-400"}`} />
                {isRecording ? "Listening..." : voiceRecorded ? "Voice Note Added ✓" : "Record Complaint"}
              </button>
            </div>
          </div>

          {/* Recording simulation visualiser sound waves */}
          {isRecording && (
            <div className="flex items-center gap-1 justify-center py-2 bg-slate-950 rounded-lg border border-red-500/30">
              <div className="w-1 h-4 bg-red-500 animate-[bounce_0.6s_infinite_100ms]" />
              <div className="w-1 h-6 bg-red-400 animate-[bounce_0.6s_infinite_300ms]" />
              <div className="w-1 h-8 bg-red-500 animate-[bounce_0.6s_infinite_150ms]" />
              <div className="w-1 h-5 bg-red-400 animate-[bounce_0.6s_infinite_400ms]" />
              <div className="w-1 h-3 bg-red-500 animate-[bounce_0.6s_infinite_200ms]" />
              <span className="text-[10px] font-mono text-slate-400 ml-2">Sampling acoustic waveform... Speak now</span>
            </div>
          )}

          {/* Primary submit action button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg py-3 text-xs font-bold tracking-wider hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" /> SUBMIT COMPLAINT TO ENSEMBLE CORE AI
          </button>
        </form>
      )}

      {/* PIPELINE STREAM PROCESS DIAGNOSTICS */}
      {pipelineState === "running" && (
        <div className="space-y-4 py-4 animate-fade-in">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 mb-2 animate-pulse">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-xs text-indigo-200">
              <span className="font-bold">Agents pipeline active:</span> Synthesizing data inputs via Gemini 2.5 Flash. Running multi-agent analytics.
            </div>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-2 pl-6 space-y-6">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;
              
              return (
                <div key={step.agent} className="relative">
                  {/* Indicator Dot */}
                  <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? "bg-indigo-400 scale-125 ring-4 ring-indigo-950 animate-ping" 
                      : isPast 
                      ? "bg-indigo-600" 
                      : "bg-slate-800"
                  }`} />

                  <div className={`transition-all duration-300 ${isActive ? "text-indigo-200 scale-[1.01]" : isPast ? "text-slate-450" : "text-slate-600"}`}>
                    <h4 className="text-xs font-bold font-mono tracking-wider mb-0.5 flex items-center gap-1.5">
                      {step.agent}
                      {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 inline shrink-0" />}
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      {isActive ? step.status : isPast ? step.result : "Awaiting upstream queue sequence..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DIAGNOSTIC COMPLETED WINDOW */}
      {pipelineState === "completed" && (
        <div className="text-center py-6 animate-fade-in space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Diagnostics Completed!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your ticket has been fully categorized, risk-assessed, prioritized, and linked with resolution blueprints successfully.
            </p>
            <div className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-2 rounded-full inline-block">
              +50 Hero Points Earned!
            </div>
          </div>

          <button
            onClick={resetForm}
            className="px-5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-850 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> File Another Report
          </button>
        </div>
      )}
    </div>
  );
}
