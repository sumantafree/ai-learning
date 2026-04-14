"use client";

import { useState } from "react";
import { Note, UpdateNotePayload } from "@/types";
import { Sparkles, Trash2, Tag, ChevronDown, ChevronUp, Loader2, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";

interface Props {
  note: Note;
  isSummarizing: boolean;
  onSummarize: () => void;
  onDelete: () => void;
  onUpdate: (data: UpdateNotePayload) => void;
}

export default function NoteCard({ note, isSummarizing, onSummarize, onDelete, onUpdate }: Props) {
  const [showFull, setShowFull] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tags = note.tags ? note.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const saveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      onUpdate({ title: editTitle, content: editContent });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 hover:border-slate-600 rounded-xl p-5 flex flex-col gap-3 transition">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 text-sm font-semibold bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        ) : (
          <h3 className="font-semibold text-white text-sm leading-snug flex-1">{note.title}</h3>
        )}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isEditing ? (
            <>
              <button onClick={saveEdit} className="text-green-400 hover:text-green-300 transition">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-500 hover:text-purple-400 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onDelete}
                className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded transition"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-slate-500 hover:text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={4}
          className="text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none w-full"
        />
      ) : (
        <div>
          <p className={`text-sm text-slate-400 leading-relaxed ${!showFull ? "line-clamp-3" : ""}`}>
            {note.content}
          </p>
          {note.content.length > 200 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-xs text-purple-400 hover:text-purple-300 mt-1 flex items-center gap-0.5"
            >
              {showFull ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Show more</>}
            </button>
          )}
        </div>
      )}

      {/* AI Summary */}
      {note.ai_summary && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-purple-400">AI Summary</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{note.ai_summary}</p>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded-full"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
        <span className="text-xs text-slate-500">
          {format(new Date(note.updated_at), "MMM d, yyyy")}
        </span>
        <button
          onClick={onSummarize}
          disabled={isSummarizing}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSummarizing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isSummarizing ? "Summarizing..." : note.ai_summary ? "Re-summarize" : "AI Summarize"}
        </button>
      </div>
    </div>
  );
}
