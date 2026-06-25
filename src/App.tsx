import React, { useState, useEffect } from "react";
import {
  MapPin, Cpu, Award, Trophy, Activity, MessageSquare, ShieldCheck,
  Search, ShieldAlert, CheckCircle2, Heart, PlusCircle, Hammer,
  FileCheck2, ChevronDown, User, Layers, Info, ListFilter, PlayCircle
} from "lucide-react";

// Import types & mock data backups
import { CommunityIssue, LeaderboardEntry, RewardsQuest, CommunityHealthScore, UserProfile } from "./types";
import { MOCK_ISSUES, MOCK_LEADERboard, MOCK_QUESTS, MOCK_HEALTH_SCORES, MOCK_USERS } from "./data/mockData";

// Import Modular Components
import AisMap from "./components/AisMap";
import AiReporter from "./components/AiReporter";
import LeaderboardQuests from "./components/LeaderboardQuests";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<"map" | "report" | "analytics" | "rewards" | "cmd">("map");
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quests, setQuests] = useState<RewardsQuest[]>([]);
  const [healthScores, setHealthScores] = useState<CommunityHealthScore[]>([]);
  
  // Account Simulator (Enable users to test as Citizen, Verifier, or Admin)
  const [currentRole, setCurrentRole] = useState<"citizen" | "verifier" | "admin">("citizen");
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USERS.citizen1);

  // Filter conditions
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Selection & Details Sidebar
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [verificationComment, setVerificationComment] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pinCoordinate, setPinCoordinate] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Smart Search Agent
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // API Call Fallback Core Engine
  useEffect(() => {
    // Attempt to load from localStorage first for high durability
    const localIssues = localStorage.getItem("civic_issues");
    const localLeaderboard = localStorage.getItem("civic_leaderboard");
    const localQuests = localStorage.getItem("civic_quests");
    const localHealth = localStorage.getItem("civic_health");

    if (localIssues) setIssues(JSON.parse(localIssues));
    else setIssues(MOCK_ISSUES);

    if (localLeaderboard) setLeaderboard(JSON.parse(localLeaderboard));
    else setLeaderboard(MOCK_LEADERboard);

    if (localQuests) setQuests(JSON.parse(localQuests));
    else setQuests(MOCK_QUESTS);

    if (localHealth) setHealthScores(JSON.parse(localHealth));
    else setHealthScores(MOCK_HEALTH_SCORES);

    // Fetch initial databases state from Python / Node Express APIs
    fetchAPIs();
  }, []);

  // Sync user profile state depending on simulator role selection
  useEffect(() => {
    if (currentRole === "citizen") setUserProfile(MOCK_USERS.citizen1);
    else if (currentRole === "verifier") setUserProfile(MOCK_USERS.verifier1);
    else setUserProfile(MOCK_USERS.admin1);
  }, [currentRole]);

  // Persist local storage backups upon updates
  const saveLocalState = (newIssues: CommunityIssue[], newLeaderboard?: LeaderboardEntry[], newQuests?: RewardsQuest[], newHealth?: CommunityHealthScore[]) => {
    setIssues(newIssues);
    localStorage.setItem("civic_issues", JSON.stringify(newIssues));
    if (newLeaderboard) {
      setLeaderboard(newLeaderboard);
      localStorage.setItem("civic_leaderboard", JSON.stringify(newLeaderboard));
    }
    if (newQuests) {
      setQuests(newQuests);
      localStorage.setItem("civic_quests", JSON.stringify(newQuests));
    }
    if (newHealth) {
      setHealthScores(newHealth);
      localStorage.setItem("civic_health", JSON.stringify(newHealth));
    }
  };

  const fetchAPIs = async () => {
    try {
      const resIssues = await fetch("/api/issues");
      if (resIssues.ok) {
        const data = await resIssues.json();
        setIssues(data);
        localStorage.setItem("civic_issues", JSON.stringify(data));
      }
      
      const resLeader = await fetch("/api/leaderboard");
      if (resLeader.ok) {
        const data = await resLeader.json();
        setLeaderboard(data);
        localStorage.setItem("civic_leaderboard", JSON.stringify(data));
      }

      const resQuests = await fetch("/api/quests");
      if (resQuests.ok) {
        const data = await resQuests.json();
        setQuests(data);
        localStorage.setItem("civic_quests", JSON.stringify(data));
      }

      const resHealth = await fetch("/api/health-scores");
      if (resHealth.ok) {
        const data = await resHealth.json();
        setHealthScores(data);
        localStorage.setItem("civic_health", JSON.stringify(data));
      }
    } catch (err) {
      console.log("[REST BACKEND] Utilizing high-fidelity local state cache, backend offline or running client-only mode.");
    }
  };

  // Smart Search Trigger calling semantic agent
  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResponse(null);
      return;
    }

    setIsSearching(true);
    setSearchResponse(null);

    try {
      const response = await fetch("/api/ai/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const result = await response.json();
        setSearchResponse(result.aiResponse);
        
        // Highlight first matching issue card if matches found
        if (result.matchingIssueIds && result.matchingIssueIds.length > 0) {
          const firstMatchId = result.matchingIssueIds[0];
          setSelectedIssueId(firstMatchId);
          setActiveTab("map");
          
          // Clear query filters to reveal match
          setFilterCategory("All");
          setFilterSeverity("All");
          setFilterStatus("All");
        }
      } else {
        throw new Error("API Failure");
      }
    } catch (err) {
      // Local fallback keywords resolver
      const q = searchQuery.toLowerCase();
      let matchId: string | null = null;
      let text = `Showing nearest registers filtering with query '${searchQuery}'`;
      
      if (q.includes("pothole") || q.includes("oak") || q.includes("street")) {
        matchId = "issue1";
        text = "🤖 AI Semantics Match: Showing 'Hazardous Deep Pothole on Oak Street'. Recommended agency dispatch: Department of Public Works.";
      } else if (q.includes("leak") || q.includes("water") || q.includes("flood")) {
        matchId = "issue2";
        text = "🤖 AI Semantics Match: Burst utility main on 24th St found! Escalating with highest urgency priority.";
      }
      
      setSearchResponse(text);
      if (matchId) {
        setSelectedIssueId(matchId);
        setActiveTab("map");
        setFilterCategory("All");
        setFilterSeverity("All");
        setFilterStatus("All");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 1. Upvote Severity Trigger
  const handleVote = async (issueId: string) => {
    // Play sound or vibration if compatible
    try {
      const response = await fetch(`/api/issues/${issueId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userProfile.id }),
      });
      if (response.ok) {
        const updated = await response.json();
        const nextList = issues.map((i) => (i.id === issueId ? updated : i));
        saveLocalState(nextList);
      } else {
        throw new Error("Fallback Vote update local memory only");
      }
    } catch (e) {
      const nextList = issues.map((i) => {
        if (i.id === issueId) {
          const votes = [...i.votes];
          if (votes.includes(userProfile.id)) {
            votes.splice(votes.indexOf(userProfile.id), 1);
          } else {
            votes.push(userProfile.id);
          }
          return { ...i, votes };
        }
        return i;
      });
      
      // Update User profile score tally
      const nextProfile = { ...userProfile, points: userProfile.points + 5 };
      setUserProfile(nextProfile);
      saveLocalState(nextList);
    }
  };

  // 2. Submit Verification Report
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !verificationComment.trim()) return;

    try {
      const response = await fetch(`/api/issues/${selectedIssueId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile.id,
          comment: verificationComment,
          status: "verified",
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const nextList = issues.map((i) => (i.id === selectedIssueId ? updated : i));
        saveLocalState(nextList);
      } else {
        throw new Error("Core API bypass - triggering local memory simulation");
      }
    } catch (err) {
      const nextList = issues.map((i) => {
        if (i.id === selectedIssueId) {
          const detail = {
            id: `v_${Date.now()}`,
            userId: userProfile.id,
            userName: userProfile.name,
            comment: verificationComment,
            status: "verified",
            createdAt: new Date().toISOString(),
          };
          const nextVerifications = [...i.verifications, detail];
          return {
            ...i,
            verifications: nextVerifications,
            status: i.status === "reported" ? "verified" : i.status,
          };
        }
        return i;
      });

      // Award Points & Level stats
      const nextProfile = {
        ...userProfile,
        points: userProfile.points + 25,
        verificationsCount: userProfile.verificationsCount + 1,
      };
      
      // Update local quests matching "Verify"
      const nextQuests = quests.map((q) => {
        if (q.type === "verify" && !q.completed) {
          const nextCount = q.currentCount + 1;
          const completed = nextCount >= q.targetCount;
          return { ...q, currentCount: nextCount, completed };
        }
        return q;
      });

      setUserProfile(nextProfile);
      saveLocalState(nextList, undefined, nextQuests);
    } finally {
      setVerificationComment("");
      setShowVerifyModal(false);
    }
  };

  // 3. Post Commentary Logs
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !commentText.trim()) return;

    try {
      const response = await fetch(`/api/issues/${selectedIssueId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile.id,
          text: commentText,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const nextList = issues.map((i) => (i.id === selectedIssueId ? updated : i));
        saveLocalState(nextList);
      } else {
        throw new Error("Fallback local simulation");
      }
    } catch (e) {
      const nextList = issues.map((i) => {
        if (i.id === selectedIssueId) {
          const detail = {
            id: `c_${Date.now()}`,
            userId: userProfile.id,
            userName: userProfile.name,
            userRole: userProfile.role,
            text: commentText,
            createdAt: new Date().toISOString(),
          };
          return { ...i, comments: [...i.comments, detail] };
        }
        return i;
      });
      saveLocalState(nextList);
    } finally {
      setCommentText("");
    }
  };

  // 4. Submit new issues from report wizard
  const handleSubmitReport = async (reportData: any) => {
    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reportData,
          reporter: {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const nextList = [data, ...issues];
        saveLocalState(nextList);
        setSelectedIssueId(data.id);
        setActiveTab("map");
      } else {
        throw new Error("Triggering local simulation");
      }
    } catch (err) {
      // Local state simulation if server API is offline
      const customId = `issue_${Date.now()}`;
      const mockResult = {
        id: customId,
        title: reportData.title,
        category: reportData.category,
        description: reportData.description,
        location: reportData.location,
        severity: reportData.severity,
        status: "reported",
        reporter: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
        },
        votes: [userProfile.id],
        verifications: [],
        comments: [],
        imageUrl: reportData.imageUrl || "",
        assignedDepartment: "Department of Public Works",
        aiAnalysis: {
          detectedIssues: [reportData.category, "Structural fracture"],
          visionSeverity: reportData.severity,
          visionConfidence: 0.94,
          visibleDamage: "Damage verified via custom localized multi-agent pipelines.",
          recommendedDepartment: reportData.category === "Water Leakage" ? "Water Operations Team" : "Public Works Division",
          classifiedTitle: reportData.title,
          classifiedCategory: reportData.category,
          classifiedDescription: reportData.description,
          classifiedPriority: reportData.severity,
          isDuplicate: false,
          riskLevel: reportData.severity,
          affectedCitizensEstimate: 620,
          escalationProbability: 70,
          longTermRiskSummary: "Defect deterioration matches standard waterlogged subgrade erosion maps.",
          priorityScore: reportData.severity === "Critical" ? 95 : reportData.severity === "High" ? 85 : 55,
          repairApproach: "Stagger aggregate compaction core sleeves; finish overlaying with dense binder compound hot sealer mix.",
          temporaryMitigation: "Encompass defect boundary using warning reflective safety shields.",
          estimatedCost: "$350 - $650",
          estimatedResolutionDays: 3,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextList = [mockResult, ...issues];
      const nextProfile = {
        ...userProfile,
        points: userProfile.points + 50,
        reportsCount: userProfile.reportsCount + 1,
      };

      const nextQuests = quests.map((q) => {
        if (q.type === "report" && !q.completed) {
          const nextCount = q.currentCount + 1;
          const completed = nextCount >= q.targetCount;
          return { ...q, currentCount: nextCount, completed };
        }
        return q;
      });

      setUserProfile(nextProfile);
      saveLocalState(nextList, undefined, nextQuests);
      setSelectedIssueId(customId);
      setActiveTab("map");
    }
  };

  // 5. Authority status updates dispatcher
  const handleUpdateStatus = async (issueId: string, status: string, message: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          operatorId: userProfile.id,
          message,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const nextList = issues.map((i) => (i.id === issueId ? updated : i));
        saveLocalState(nextList);
      } else {
        throw new Error("Local dispatch");
      }
    } catch (err) {
      const nextList = issues.map((i) => {
        if (i.id === issueId) {
          const detail = {
            id: `sys_${Date.now()}`,
            userId: userProfile.id,
            userName: userProfile.name,
            userRole: userProfile.role,
            text: message || `Status logs updated to [${status.toUpperCase()}] by regional engineer.`,
            createdAt: new Date().toISOString(),
          };
          return {
            ...i,
            status,
            comments: [...i.comments, detail],
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      });
      saveLocalState(nextList);
    }
  };

  // 6. AI Ward analyzer diagnostic Scan
  const handleTriggerWardScan = async (wardName: string) => {
    try {
      const res = await fetch("/api/ai/health-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward_name: wardName }),
      });
      if (res.ok) {
        const updatedHealth = await res.json();
        const nextHealth = healthScores.map((h) => (h.ward === wardName ? updatedHealth : h));
        saveLocalState(issues, undefined, undefined, nextHealth);
      } else {
        throw new Error("Local calculations triggered");
      }
    } catch (err) {
      // Local simulated calculations
      const wardIssues = issues.filter((i) => i.location.ward === wardName);
      const level = Math.max(35, 95 - wardIssues.length * 9);
      const nextHealthScore: CommunityHealthScore = {
        ward: wardName,
        overall: level,
        roads: Math.max(30, level - 6),
        lighting: Math.max(40, level + 5),
        cleanliness: Math.max(35, level - 8),
        water: Math.max(45, level + 2),
        safety: Math.max(50, level + 7),
        aiDiagnostic: `PROACTIVE DIAGNOSTIC REPORT: Neighborhood sector is currently managing ${wardIssues.length} active defects. Street condition indexes and waste piling present immediate physical risks requiring local dispatch allocations. Power grids are verified normal.`,
        analyzedAt: new Date().toISOString(),
      };
      const nextHealth = healthScores.map((h) => (h.ward === wardName ? nextHealthScore : h));
      saveLocalState(issues, undefined, undefined, nextHealth);
    }
  };

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  // Derive simple class colors for statuses
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border border-blue-500/20 bg-blue-500/10 text-blue-400">Logged</span>;
      case "verified":
        return <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border border-indigo-505/20 bg-indigo-500/10 text-indigo-400 animate-pulse">Verified Site</span>;
      case "in_progress":
        return <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border border-amber-500/20 bg-amber-500/10 text-amber-500">In Progress</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">Resolved</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-12 overflow-x-hidden antialiased">
      {/* Decorative Aurora Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Panel */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("map")}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                CivicHero AI <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">ENCORE 7</span>
              </h1>
              <p className="text-[10px] text-slate-400">Hyperlocal Community Problem Solver</p>
            </div>
          </div>

          {/* Account Simulator Tool - Demo friendly switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-850 p-1 rounded-lg">
            <span className="text-[9.5px] font-mono text-slate-500 px-2 uppercase font-bold">Simulator User:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentRole("citizen")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  currentRole === "citizen" 
                    ? "bg-slate-900 text-cyan-400 border border-cyan-500/20 font-black" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => setCurrentRole("verifier")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  currentRole === "verifier" 
                    ? "bg-slate-900 text-indigo-400 border border-indigo-500/20 font-black" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Field Verifier
              </button>
              <button
                onClick={() => setCurrentRole("admin")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  currentRole === "admin" 
                    ? "bg-slate-900 text-purple-400 border border-purple-500/20 font-black" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Supervisor Admin
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Core Hero HUD and Search Hub */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-900/40 border border-slate-900 backdrop-blur-md rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="md:col-span-1 space-y-1">
            <h2 className="text-base font-black text-white flex items-center gap-1.5">
              Welcome Back, {userProfile.name}! 👋
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Class Rank Badge:</span>
              <span className="font-bold text-indigo-400 flex items-center gap-0.5">
                <Trophy className="w-3.5 h-3.5" /> {userProfile.currentBadge}
              </span>
            </div>
          </div>

          {/* Smart Semantic Search Form */}
          <form onSubmit={handleSmartSearch} className="md:col-span-2 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask Civic Search Router: 'Pothole leaks on Oak St' or 'Water floods near Ward 9'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                id="civic-search-input"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-indigo-400" />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-3 text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0"
              disabled={isSearching}
              id="civic-search-submit"
            >
              {isSearching ? "Searching..." : "Semantic Search"}
            </button>
          </form>

          {/* Floating Search advice results panel */}
          {searchResponse && (
            <div className="col-span-1 md:col-span-3 mt-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-2.5 animate-fade-in">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-indigo-300 font-mono text-[9px] uppercase tracking-wider block">Smart Router Result:</span>
                <p className="leading-relaxed">{searchResponse}</p>
                <button
                  onClick={() => setSearchResponse(null)}
                  className="text-[9.5px] font-semibold text-slate-400 hover:text-white underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tab Controls Navigation layout */}
        <nav className="flex flex-wrap gap-2 items-center mb-6 border-b border-slate-900 pb-4">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "map"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-slate-900/60 border border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            🛰️ Live GIS Map
          </button>
          <button
            onClick={() => {
              setActiveTab("report");
              setPinCoordinate(null);
            }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "report"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-slate-900/60 border border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            📋 Write AI Report
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-slate-900/60 border border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            📊 City Analytics
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "rewards"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-slate-900/60 border border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            🏆 Rewards Quests
          </button>
          <button
            onClick={() => setActiveTab("cmd")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 flex items-center gap-2 ${
              activeTab === "cmd"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-slate-900/60 border border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            🔧 Dispatch Cmd
          </button>
        </nav>

        {/* Dynamic Canvas Sections */}
        {activeTab === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GIS Map & Filters Controls Panels */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Filter controls headers */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3 flex flex-wrap gap-3 items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-350">
                  <ListFilter className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">Filter Incident Logs:</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5 items-center">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Road Damage">Road Damage</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Broken Streetlight">Broken Streetlight</option>
                    <option value="Garbage Dump">Garbage Dump</option>
                  </select>

                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="reported">Logged</option>
                    <option value="verified">Verified</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Map components */}
              <AisMap
                issues={issues}
                selectedIssueId={selectedIssueId}
                onSelectIssue={(id) => setSelectedIssueId(id)}
                activeFilters={{ category: filterCategory, severity: filterSeverity, status: filterStatus }}
                onSelectCoordinate={(lat, lng, addr) => {
                  setPinCoordinate({ lat, lng, address: addr });
                  setActiveTab("report");
                }}
              />
            </div>

            {/* Selected Complaint Detail sideboards */}
            <div className="lg:col-span-1">
              {selectedIssue ? (
                <article className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[540px] overflow-y-auto">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{selectedIssue.id}</span>
                    {getStatusBadge(selectedIssue.status)}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white leading-normal">{selectedIssue.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{selectedIssue.location.address}</span>
                    </div>
                  </div>

                  {selectedIssue.imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                      <img src={selectedIssue.imageUrl} alt={selectedIssue.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed font-sans border-b border-slate-800 pb-3 text-left">
                    "{selectedIssue.description}"
                  </p>

                  {/* Collaborative Voting & Verification details */}
                  <div className="flex items-center gap-2 justify-between border-b border-slate-800 pb-3">
                    <button
                      onClick={() => handleVote(selectedIssue.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedIssue.votes.includes(userProfile.id)
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${selectedIssue.votes.includes(userProfile.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{selectedIssue.votes.length} Upvotes</span>
                    </button>

                    {/* Enable point based verification logs */}
                    {currentRole !== "citizen" && selectedIssue.status === "reported" && (
                      <button
                        onClick={() => setShowVerifyModal(true)}
                        className="py-1.5 px-3 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs"
                      >
                        Verify Location
                      </button>
                    )}
                  </div>

                  {/* Ground Verification Logs */}
                  {selectedIssue.verifications.length > 0 && (
                    <div className="space-y-2 border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ground Verifications ({selectedIssue.verifications.length})</span>
                      {selectedIssue.verifications.map((v) => (
                        <div key={v.id} className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 flex gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="text-left">
                            <h5 className="text-[10px] font-bold text-slate-300">{v.userName}</h5>
                            <p className="text-[10.5px] text-slate-400 leading-relaxed">"{v.comment}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Advanced Multi-Agent AI Planning Insights */}
                  {selectedIssue.aiAnalysis && (
                    <details className="bg-slate-950/40 border border-slate-850/60 rounded-xl p-3.5 group cursor-pointer">
                      <summary className="flex items-center justify-between text-xs font-bold text-indigo-300 select-none list-none">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-indigo-400" /> AI Insights & Actions
                        </span>
                        <ChevronDown className="w-4 h-3.5 text-slate-500 group-open:rotate-180 transition-transform" />
                      </summary>

                      <article className="mt-3.5 space-y-4 pt-3.5 border-t border-slate-900/40 cursor-auto text-left">
                        
                        {/* Priority circle */}
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full border-4 border-indigo-500 flex items-center justify-center font-mono font-black text-xs text-indigo-200">
                            {selectedIssue.aiAnalysis.priorityScore}/100
                          </div>
                          <div>
                            <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wider block leading-none">Severity Score</span>
                            <span className="text-[11px] text-slate-300 font-semibold">{selectedIssue.aiAnalysis.visionSeverity} Hazard threat calculated</span>
                          </div>
                        </div>

                        {/* Defect logs lists */}
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block">Detected defects elements</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedIssue.aiAnalysis.detectedIssues.map((item) => (
                              <span key={item} className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Forecast parameters */}
                        <div className="space-y-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-850/60">
                          <span className="text-[9.5px] font-bold text-indigo-300 uppercase tracking-wider block">Risk & Impact Forecasts</span>
                          <p className="text-[10.5px] leading-relaxed text-slate-400">
                            {selectedIssue.aiAnalysis.longTermRiskSummary}
                          </p>
                          <div className="pt-1 text-[9.5px] font-mono text-slate-500">
                            Escalation probability: {selectedIssue.aiAnalysis.escalationProbability}% • Affected: ~{selectedIssue.aiAnalysis.affectedCitizensEstimate}
                          </div>
                        </div>

                        {/* Reconstruction Cost Estimations & Contractors blueprints */}
                        <div className="space-y-1.5">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Restoration Blueprint Specs</span>
                          <div className="grid grid-cols-2 gap-2 text-[9.5px] font-mono">
                            <div className="bg-slate-900 p-2 rounded">
                              <span className="text-slate-500 block">Est cost:</span>
                              <strong className="text-slate-200">{selectedIssue.aiAnalysis.estimatedCost}</strong>
                            </div>
                            <div className="bg-slate-900 p-2 rounded">
                              <span className="text-slate-500 block">Restoration duration:</span>
                              <strong className="text-slate-200">{selectedIssue.aiAnalysis.estimatedResolutionDays} Days target</strong>
                            </div>
                          </div>
                          
                          <div className="text-[10.5px] text-slate-400 leading-normal pl-2.5 border-l border-indigo-500/30">
                            <strong>Repair approach:</strong> {selectedIssue.aiAnalysis.repairApproach}
                          </div>
                          <div className="text-[10.5px] text-slate-400 leading-normal pl-2.5 border-l border-amber-500/30">
                            <strong>Temporary mitigation:</strong> {selectedIssue.aiAnalysis.temporaryMitigation}
                          </div>
                        </div>
                      </article>
                    </details>
                  )}

                  {/* Real-time commentary and audit timeline logs */}
                  <div className="space-y-3 pt-3 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Feed & Conversations</span>
                    
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {selectedIssue.comments.map((c) => (
                        <div key={c.id} className="text-xs bg-slate-950/20 p-2.5 rounded-xl border border-slate-850/40 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-200">{c.userName}</span>
                            <span className="text-[9px] font-mono text-slate-500">{c.userRole}</span>
                          </div>
                          <p className="text-slate-400 leading-normal">"{c.text}"</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Discuss resolution or updates..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                        required
                      />
                      <button
                        type="submit"
                        className="py-1.5 px-3 bg-slate-850 border border-slate-750 text-white rounded-lg text-xs hover:bg-slate-750"
                      >
                        Log
                      </button>
                    </form>
                  </div>
                </article>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 flex flex-col items-center justify-center min-h-[380px]">
                  <span className="text-4xl mb-3">🛰️</span>
                  <h4 className="text-sm font-bold text-slate-400 mb-1">Map Selection Pane</h4>
                  <p className="text-xs leading-relaxed max-w-[200px] mx-auto">
                    Please parse active map pins or coordinates to display dynamic analytics summaries and AI blueprints reports.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === "report" && (
          <div className="max-w-2xl mx-auto">
            <AiReporter
              currentUserId={userProfile.id}
              selectedCoordinate={pinCoordinate}
              onSubmitReport={handleSubmitReport}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <AnalyticsDashboard
            issues={issues}
            healthScores={healthScores}
            onTriggerWardScan={handleTriggerWardScan}
          />
        )}

        {activeTab === "rewards" && (
          <LeaderboardQuests
            userProfile={userProfile}
            leaderboard={leaderboard}
            quests={quests}
          />
        )}

        {activeTab === "cmd" && (
          <AdminPanel
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

      </main>

      {/* On-ground Verification Overlay Modal */}
      {showVerifyModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ground Verification Log
              </h4>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed text-left">
              Confirm your presence at <strong>"{selectedIssue.location.address}"</strong>. Provide observations of the defect to unlock <strong>+25 Hero Points</strong>.
            </p>

            <form onSubmit={handleVerify} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Observation Notes</label>
                <textarea
                  placeholder="e.g. Visited the site. Defect is about 6 inches deep next to the turn line, causing active bicycle hazards."
                  value={verificationComment}
                  onChange={(e) => setVerificationComment(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-sans resize-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="w-1/2 bg-slate-950 border border-slate-850 text-xs py-2 rounded-lg font-bold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-indigo-650 hover:bg-indigo-600 text-white text-xs py-2 rounded-lg font-bold"
                >
                  Post Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
