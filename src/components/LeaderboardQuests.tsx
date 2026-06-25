import React from "react";
import { Trophy, Star, Shield, Award, Sparkles, CheckCircle2, UserCheck, HelpCircle } from "lucide-react";
import { LeaderboardEntry, RewardsQuest, UserProfile } from "../types";

interface LeaderboardQuestsProps {
  userProfile: UserProfile;
  leaderboard: LeaderboardEntry[];
  quests: RewardsQuest[];
}

export default function LeaderboardQuests({
  userProfile,
  leaderboard,
  quests,
}: LeaderboardQuestsProps) {
  // Determine level threshold based on points (simple progression logic)
  const currentLevel = Math.floor(userProfile.points / 250) + 1;
  const pointsOnCurrentLevel = userProfile.points % 250;
  const levelProgressPercent = Math.min((pointsOnCurrentLevel / 250) * 100, 100);

  // Styling helper for rankings
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-slate-300 fill-slate-300" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600 fill-amber-600" />;
      default:
        return <span className="text-xs font-mono font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getBadgeColors = (badge: string) => {
    if (badge.includes("Champion")) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    if (badge.includes("Hero")) return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    if (badge.includes("Guardian")) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gamification Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-650/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-650 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              {userProfile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{userProfile.name}</h3>
              <p className="text-xs text-indigo-400 font-medium">{userProfile.currentBadge}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-1.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Level {currentLevel} Guardian</span>
              <span className="font-mono text-indigo-300 text-[11px] font-semibold">{userProfile.points} / {currentLevel * 250} Hero Pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-[1px]">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-450 italic">
              {250 - pointsOnCurrentLevel} points needed to reach level {currentLevel + 1}!
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <div className="bg-slate-950/35 border border-slate-850 p-2.5 rounded-lg text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">My Reports</span>
              <span className="text-sm font-mono font-black text-rose-400">{userProfile.reportsCount} filed</span>
            </div>
            <div className="bg-slate-950/35 border border-slate-850 p-2.5 rounded-lg text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Verifications</span>
              <span className="text-sm font-mono font-black text-emerald-400">{userProfile.verificationsCount} validated</span>
            </div>
          </div>
        </div>

        {/* Claimed Badges List */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Unlocked Badges</span>
          <div className="flex flex-wrap gap-1.5">
            {userProfile.badges.map((badge) => (
              <span
                key={badge}
                className="text-[9px] font-bold px-2 py-1 rounded-full border bg-slate-950/60 text-indigo-300 border-indigo-500/10 flex items-center gap-1"
              >
                <Award className="w-2.5 h-2.5 text-indigo-400" /> {badge}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Community Quests Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Active Quests</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
              Earn Points
            </span>
          </div>

          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className={`p-3 rounded-xl border transition-colors ${
                  quest.completed 
                    ? "bg-slate-950/60 border-indigo-500/10 opacity-70"
                    : "bg-slate-950/20 border-slate-850 hover:bg-slate-950/45"
                }`}
              >
                <div className="flex justify-between items-start gap-1 mb-1">
                  <h4 className={`text-xs font-bold leading-tight ${quest.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {quest.title}
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-amber-400 shrink-0">
                    +{quest.points} pts
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans mb-2">
                  {quest.description}
                </p>

                {/* Progress Mini Bar */}
                <div className="flex justify-between items-center text-[9px] font-mono font-semibold text-slate-400 mb-1">
                  <span>Current Tracker:</span>
                  <span>{quest.currentCount} / {quest.targetCount}</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${quest.completed ? "bg-indigo-500" : "bg-amber-500"}`}
                    style={{ width: `${(quest.currentCount / quest.targetCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 leading-relaxed font-sans border-t border-slate-800 pt-3">
          💡 Earn huge bonus items and increase civic rankings by doing active verifications near high severity zone lines.
        </div>
      </div>

      {/* Leaderboard Chart Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Locality Leaderboard</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-450">San Francisco Ward 5</span>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {leaderboard.map((entry) => {
              const matchesProfile = entry.id === userProfile.id;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    matchesProfile
                      ? "bg-indigo-500/10 border-indigo-500/25"
                      : "bg-slate-950/20 border-slate-850/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 w-6 flex justify-center">
                      {getRankBadge(entry.rank)}
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className={`text-xs font-semibold truncate ${matchesProfile ? "text-indigo-200" : "text-slate-200"}`}>
                        {entry.name} {matchesProfile && <span className="text-[9px] font-bold text-indigo-400">(You)</span>}
                      </h4>
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${getBadgeColors(entry.badge)}`}>
                        {entry.badge.split(" ")[1] || entry.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-black text-slate-100">{entry.points} p</span>
                    <span className="text-[9px] block text-slate-500 font-sans">{entry.reportsCount} Reps • {entry.verificationsCount} Vers</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
