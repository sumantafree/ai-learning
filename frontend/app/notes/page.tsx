"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import Sidebar from "@/components/Sidebar";
import NoteCard from "@/components/NoteCard";
import { Plus, Search, StickyNote, Loader2, X } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { notes, isLoading, isSummarizing, createNote, updateNote, deleteNote, summarizeNote } =
    useNotes(debouncedSearch || undefined);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      if (!localStorage.getItem("access_token")) router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSaving(true);
    await createNote({ title: newTitle, content: newContent, tags: newTags || undefined });
    setNewTitle(""); setNewContent(""); setNewTags("");
    setShowNewForm(false);
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Knowledge Base</h1>
            <p className="text-slate-400 mt-0.5 text-sm">Capture and summarize your AI learnings</p>
          </div>
          <button onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New </span>Note
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New note form */}
        {showNewForm && (
          <div className="mb-5 bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">New Note</h2>
              <button onClick={() => setShowNewForm(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required
                placeholder="Note title..."
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} required rows={4}
                placeholder="Write your learnings here..."
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm" />
              <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)}
                placeholder="Tags: prompt-engineering, rag, agents"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
              <div className="flex gap-3">
                <button type="submit" disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-lg font-medium transition text-sm">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Save
                </button>
                <button type="button" onClick={() => setShowNewForm(false)}
                  className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Notes grid — 1 col mobile, 2 col tablet+ */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-44 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <StickyNote className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="mb-1">No notes yet</p>
            <p className="text-sm">Capture your AI learnings and insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} isSummarizing={isSummarizing === note.id}
                onSummarize={() => summarizeNote(note.id)}
                onDelete={() => deleteNote(note.id)}
                onUpdate={data => updateNote(note.id, data)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
