"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";
import { notesApi } from "@/lib/api";
import toast from "react-hot-toast";

export function useNotes(search?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState<number | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await notesApi.list(search);
      setNotes(data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (data: CreateNotePayload) => {
    try {
      const note = await notesApi.create(data);
      setNotes((prev) => [note, ...prev]);
      toast.success("Note saved!");
      return note;
    } catch {
      toast.error("Failed to save note");
      return null;
    }
  };

  const updateNote = async (id: number, data: UpdateNotePayload) => {
    try {
      const updated = await notesApi.update(id, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      toast.success("Note updated");
      return updated;
    } catch {
      toast.error("Failed to update note");
      return null;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const summarizeNote = async (id: number) => {
    setIsSummarizing(id);
    try {
      const updated = await notesApi.summarize(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      toast.success("AI summary generated!");
      return updated;
    } catch {
      toast.error("Failed to generate summary");
      return null;
    } finally {
      setIsSummarizing(null);
    }
  };

  return { notes, isLoading, isSummarizing, createNote, updateNote, deleteNote, summarizeNote, refetch: fetchNotes };
}
