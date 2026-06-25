import React, { useState } from "react";
import { Hammer, CircleEllipsis, CheckCircle, ShieldAlert, FileEdit, Users, HelpCircle } from "lucide-react";
import { CommunityIssue } from "../types";

interface AdminPanelProps {
  issues: CommunityIssue[];
  onUpdateStatus: (issueId: string, status: string, message: string) => Promise<any>;
}

export default function AdminPanel({ issues, onUpdateStatus }: AdminPanelProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("in_progress");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId) return;

    setIsSubmitting(true);
    try {
      await onUpdateStatus(selectedIssueId, newStatus, statusMessage);
      setStatusMessage("");
      setSelectedIssueId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusIcons: Record<string, any> = {
    reported: <CircleEllipsis className="w-4.5 h-4.5 text-blue-400" />,
    verified: <ShieldAlert className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />,
    in_progress: <Hammer className="w-4.5 h-4.5 text-amber-500" />,
    resolved: <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />,
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return { label: "Logged", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      case "verified":
        return { label: "Verified Site", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
      case "in_progress":
        return { label: "Work Assigned", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
      default:
        return { label: "Resolved", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Issues Administrative Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl lg:col-span-2 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center bg-transparent">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Municipal Command Center</h3>
              <p className="text-xs text-slate-400">Review community issues logs and dispatch municipal crews.</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> Admin Channel
            </span>
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {issues.map((issue) => {
              const matchesSelected = issue.id === selectedIssueId;
              const meta = statusLabel(issue.status);
              return (
                <div
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setNewStatus(issue.status === "reported" ? "verified" : "in_progress");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    matchesSelected
                      ? "bg-slate-950 border-indigo-500 ring-1 ring-indigo-500/20"
                      : "bg-slate-950/20 border-slate-850 hover:bg-slate-950/45"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-white text-left leading-tight truncate max-w-[280px]">
                        {issue.title}
                      </h4>
                      <span className="text-[9.5px] text-slate-450 font-mono italic">
                        {issue.location.address}
                      </span>
                    </div>
                    
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border shrink-0 ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed line-clamp-2 text-left">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2 border-t border-slate-900/40 pt-2">
                    <span>Severity Rank: <strong className="text-amber-400 font-bold">{issue.severity}</strong></span>
                    <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dispatch Operations / Action Center Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        {selectedIssue ? (
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h4 className="text-xs font-bold text-indigo-300 tracking-wider uppercase flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-indigo-400" /> Dispatch Ticket
              </h4>
            </div>

            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
              <div className="text-xs font-bold text-white truncate">{selectedIssue.title}</div>
              <div className="text-[10px] text-slate-500 leading-normal truncate">{selectedIssue.location.address}</div>
              <div className="text-[10.5px] text-slate-400 leading-tight line-clamp-2 italic pt-1 border-t border-slate-900/60 mt-1">
                "{selectedIssue.description}"
              </div>
            </div>

            {/* Change Status select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350">Admit Status Transition</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 cursor-pointer font-sans"
              >
                <option value="reported">🔵 Reported (Pending check)</option>
                <option value="verified">🟣 Verified (On-site confirmed)</option>
                <option value="in_progress">🟡 In Progress (Dispatch Crews)</option>
                <option value="resolved">🟢 Resolved (Fix checked complete)</option>
              </select>
            </div>

            {/* Update message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350">Log Official Supervisor updates</label>
              <textarea
                placeholder="e.g. Sent Public Works team with road surface patch machine block PW-882. Completion estimate 4 hours."
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-sans resize-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-lg py-2.5 text-xs font-bold tracking-wider hover:brightness-110 active:scale-[0.99] transition-all"
            >
              {isSubmitting ? "Updating ticket..." : "COMMIT WORK DISPATCH CHANNEL"}
            </button>
          </form>
        ) : (
          <div className="text-center py-16 text-slate-500 flex flex-col justify-center items-center h-full">
            <span className="text-4xl mb-2">📋</span>
            <p className="text-xs leading-relaxed max-w-[200px] mx-auto">
              Please click on any active complaint ticket in the Municipal list panel to initiate administrative audits or dispatch action.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
