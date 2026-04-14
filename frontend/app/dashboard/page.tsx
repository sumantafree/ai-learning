"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { aiApi } from "@/lib/api";
import { LearningPath } from "@/types";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import ProgressSection from "@/components/ProgressSection";
import GenerateTaskButton from "@/components/GenerateTaskButton";
import { Brain, BookOpen, Target, Zap, TrendingUp, Map } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuth();
  const { tasks, stats, isLoading, isGenerating, generateTask, updateTask, deleteTask } = useTasks();
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [showPath, setShowPath] = useState(false);

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      if (!localStorage.getItem("access_token")) router.push("/login");
    }
  }, [user, router]);

  const fetchLearningPath = async () => {
    try {
      const path = await aiApi.learningPath();
      setLearningPath(path);
      setShowPath(true);
    } catch { toast.error("Failed to load learning path"); }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      {/* Main — offset for desktop sidebar, full width on mobile */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Good morning, {user.full_name || user.username}! 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Level: <span className="text-purple-400 font-medium capitalize">{user.level}</span>
            {user.goals && <> · <span className="text-slate-300">{user.goals}</span></>}
          </p>
        </div>

        {/* Stats Row — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "XP Points",  value: user.xp_points,           icon: Zap,         color: "text-yellow-400" },
            { label: "Streak",     value: `${user.streak} days`,     icon: TrendingUp,  color: "text-green-400"  },
            { label: "Completed",  value: stats?.completed ?? 0,     icon: Target,      color: "text-purple-400" },
            { label: "Total Tasks",value: stats?.total ?? 0,         icon: BookOpen,    color: "text-blue-400"   },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress + Generate — stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ProgressSection stats={stats} />
          </div>
          <div className="flex flex-row lg:flex-col gap-3">
            <div className="flex-1">
              <GenerateTaskButton onGenerate={generateTask} isGenerating={isGenerating} />
            </div>
            <button onClick={fetchLearningPath}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-purple-500/50 transition text-sm font-medium">
              <Map className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">View </span>Learning Path
            </button>
          </div>
        </div>

        {/* Learning Path */}
        {showPath && learningPath && (
          <div className="mb-6 bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-semibold text-white">
                  Learning Path — <span className="capitalize">{learningPath.level}</span>
                </h2>
              </div>
              <button onClick={() => setShowPath(false)} className="text-slate-400 hover:text-white text-sm">Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learningPath.path.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/40 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full text-xs text-white flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Tasks</h2>
            <button onClick={() => router.push("/tasks")} className="text-sm text-purple-400 hover:text-purple-300">View all →</button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-4 text-sm">No tasks yet. Generate your first AI learning task!</p>
              <GenerateTaskButton onGenerate={generateTask} isGenerating={isGenerating} />
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task}
                  onStatusChange={status => updateTask(task.id, { status })}
                  onDelete={() => deleteTask(task.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
