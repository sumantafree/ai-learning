"use client";

import { GenerateTaskPayload } from "@/types";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  onGenerate: (payload?: GenerateTaskPayload) => void;
  isGenerating: boolean;
  compact?: boolean;
}

export default function GenerateTaskButton({ onGenerate, isGenerating, compact = false }: Props) {
  if (compact) {
    return (
      <button
        onClick={() => onGenerate()}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    );
  }

  return (
    <button
      onClick={() => onGenerate()}
      disabled={isGenerating}
      className="w-full flex flex-col items-center gap-3 px-6 py-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/50 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition group"
    >
      <div className="p-3 bg-purple-600 group-hover:bg-purple-500 rounded-full transition">
        {isGenerating ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Sparkles className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-white text-sm">
          {isGenerating ? "AI Mentor is thinking..." : "Generate Today's Task"}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {isGenerating ? "Creating your personalized plan" : "AI-powered daily learning plan"}
        </p>
      </div>
    </button>
  );
}
