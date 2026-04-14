"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import GenerateTaskButton from "@/components/GenerateTaskButton";
import { TaskStatus } from "@/types";
import { Brain } from "lucide-react";

const STATUS_FILTERS = [
  { label: "All",         value: undefined        },
  { label: "Pending",     value: "pending"        },
  { label: "In Progress", value: "in_progress"    },
  { label: "Completed",   value: "completed"      },
];

export default function TasksPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { tasks, isLoading, isGenerating, generateTask, updateTask, deleteTask } = useTasks(statusFilter);
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      if (!localStorage.getItem("access_token")) router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Tasks</h1>
            <p className="text-slate-400 mt-0.5 text-sm">Manage your AI learning tasks</p>
          </div>
          <div className="flex gap-2">
            <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)}
              placeholder="Topic (optional)"
              className="flex-1 sm:w-44 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <GenerateTaskButton onGenerate={() => generateTask({ topic: topicInput || undefined })}
              isGenerating={isGenerating} compact />
          </div>
        </div>

        {/* Filter tabs — scrollable on mobile */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button key={f.label} onClick={() => setStatusFilter(f.value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                statusFilter === f.value
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Brain className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="mb-2">No tasks found</p>
            <p className="text-sm mb-6">{statusFilter ? `No ${statusFilter.replace("_"," ")} tasks` : "Generate your first task below"}</p>
            <GenerateTaskButton onGenerate={generateTask} isGenerating={isGenerating} />
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} expanded
                onStatusChange={(status: TaskStatus) => updateTask(task.id, { status })}
                onDelete={() => deleteTask(task.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
