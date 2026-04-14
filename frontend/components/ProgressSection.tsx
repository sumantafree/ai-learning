"use client";

import { TaskStats } from "@/types";
import { CheckCircle2, Clock, Circle, TrendingUp } from "lucide-react";

interface Props {
  stats: TaskStats | null;
}

export default function ProgressSection({ stats }: Props) {
  if (!stats) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 h-full animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-3 bg-slate-700 rounded mb-6" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const rate = stats.completion_rate;
  const barWidth = Math.min(rate, 100);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h2 className="font-semibold text-white">Progress Overview</h2>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Completion Rate</span>
          <span className="font-semibold text-white">{rate}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: Circle, color: "text-slate-400 bg-slate-700/50" },
          { label: "Pending", value: stats.pending, icon: Circle, color: "text-slate-400 bg-slate-700/50" },
          { label: "In Progress", value: stats.in_progress, icon: Clock, color: "text-blue-400 bg-blue-500/10" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-400 bg-green-500/10" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-lg p-3 ${color.split(" ")[1]}`}>
            <Icon className={`w-4 h-4 ${color.split(" ")[0]} mb-2`} />
            <p className={`text-xl font-bold ${color.split(" ")[0]}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
