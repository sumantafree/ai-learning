"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStats, GenerateTaskPayload, UpdateTaskPayload } from "@/types";
import { tasksApi, aiApi } from "@/lib/api";
import toast from "react-hot-toast";

export function useTasks(statusFilter?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const [taskList, taskStats] = await Promise.all([
        tasksApi.list(statusFilter),
        tasksApi.stats(),
      ]);
      setTasks(taskList);
      setStats(taskStats);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const generateTask = async (payload: GenerateTaskPayload = {}) => {
    setIsGenerating(true);
    try {
      const newTask = await aiApi.generateTask(payload);
      setTasks((prev) => [newTask, ...prev]);
      setStats((prev) =>
        prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev
      );
      toast.success("New learning task generated!");
      return newTask;
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      const msg = detail?.includes("RESOURCE_EXHAUSTED")
        ? "Gemini quota exceeded. Get a free key at aistudio.google.com/apikey"
        : detail?.includes("429")
        ? "API rate limit hit. Please wait a moment and try again."
        : "AI generation failed. Check your Gemini API key in backend/.env";
      toast.error(msg, { duration: 6000 });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const updateTask = async (id: number, data: UpdateTaskPayload) => {
    try {
      const updated = await tasksApi.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (data.status === "completed") {
        toast.success(`Task completed! +${updated.xp_reward} XP`);
        await fetchTasks(); // refresh stats
      }
      return updated;
    } catch {
      toast.error("Failed to update task");
      return null;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return { tasks, stats, isLoading, isGenerating, generateTask, updateTask, deleteTask, refetch: fetchTasks };
}
