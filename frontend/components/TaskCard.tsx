"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types";
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  Zap,
  Wrench,
  BookOpen,
  Rocket,
  Trophy,
  SkipForward,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  task: Task;
  expanded?: boolean;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", color: "text-slate-400", icon: Circle },
  in_progress: { label: "In Progress", color: "text-blue-400", icon: Clock },
  completed: { label: "Completed", color: "text-green-400", icon: CheckCircle2 },
  skipped: { label: "Skipped", color: "text-slate-500", icon: SkipForward },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function TaskCard({ task, expanded = false, onStatusChange, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { label, color, icon: StatusIcon } = STATUS_CONFIG[task.status];

  return (
    <div
      className={`bg-slate-800/60 border rounded-xl overflow-hidden transition ${
        task.status === "completed"
          ? "border-green-500/20 opacity-80"
          : "border-slate-700 hover:border-slate-600"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          {/* Status toggle */}
          <button
            onClick={() =>
              onStatusChange(task.status === "completed" ? "pending" : "completed")
            }
            className={`mt-0.5 flex-shrink-0 ${color} hover:scale-110 transition`}
            title={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
          >
            <StatusIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold text-white leading-snug ${
                  task.status === "completed" ? "line-through text-slate-400" : ""
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                    DIFFICULTY_COLOR[task.difficulty] || DIFFICULTY_COLOR.beginner
                  }`}
                >
                  {task.difficulty}
                </span>
                <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                  <Zap className="w-3 h-3" />
                  {task.xp_reward} XP
                </span>
              </div>
            </div>

            {task.topic && (
              <span className="text-xs text-purple-400 font-medium">{task.topic}</span>
            )}

            {task.description && !isExpanded && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3 pl-9">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-medium ${color} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {label}
            </span>
            <span className="text-xs text-slate-500">
              {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick status buttons */}
            {task.status === "pending" && (
              <button
                onClick={() => onStatusChange("in_progress")}
                className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition"
              >
                Start
              </button>
            )}
            {task.status === "in_progress" && (
              <button
                onClick={() => onStatusChange("completed")}
                className="text-xs px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition"
              >
                Complete
              </button>
            )}

            {/* Expand */}
            {(task.concept || task.ai_task || task.mini_project) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white transition"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}

            {/* Delete */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Delete?</span>
                <button
                  onClick={onDelete}
                  className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded hover:bg-slate-600 transition"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-slate-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded AI content */}
      {isExpanded && (
        <div className="border-t border-slate-700 px-5 py-5 space-y-4">
          {task.description && (
            <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
          )}

          {task.concept && (
            <Section icon={BookOpen} label="Concept" color="text-blue-400">
              {task.concept}
            </Section>
          )}
          {task.ai_task && (
            <Section icon={CheckCircle2} label="Task" color="text-purple-400">
              {task.ai_task}
            </Section>
          )}
          {task.mini_project && (
            <Section icon={Rocket} label="Mini Project" color="text-green-400">
              {task.mini_project}
            </Section>
          )}
          {task.tools && (
            <Section icon={Wrench} label="Tools" color="text-yellow-400">
              {task.tools}
            </Section>
          )}
          {task.challenge && (
            <Section icon={Trophy} label="Stretch Challenge" color="text-orange-400">
              {task.challenge}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  color,
  children,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed pl-6">{children}</p>
    </div>
  );
}
