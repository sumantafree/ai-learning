// ── User ─────────────────────────────────────────────────────────────────────

export type UserLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  level: UserLevel;
  goals: string | null;
  streak: number;
  total_tasks_completed: number;
  xp_points: number;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  level: UserLevel;
  goals?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ── Task ──────────────────────────────────────────────────────────────────────

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";
export type TaskType = "concept" | "exercise" | "project" | "challenge" | "daily_plan";

export interface Task {
  id: number;
  owner_id: number;
  title: string;
  description: string | null;
  concept: string | null;
  ai_task: string | null;
  mini_project: string | null;
  tools: string | null;
  challenge: string | null;
  task_type: TaskType;
  status: TaskStatus;
  difficulty: string;
  topic: string | null;
  xp_reward: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  topic?: string;
  task_type?: TaskType;
  difficulty?: string;
  xp_reward?: number;
}

export interface UpdateTaskPayload {
  status?: TaskStatus;
  title?: string;
  description?: string;
}

export interface GenerateTaskPayload {
  topic?: string;
  level?: string;
  goals?: string;
  provider?: "openai" | "gemini";
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
  completion_rate: number;
}

// ── Note ──────────────────────────────────────────────────────────────────────

export interface Note {
  id: number;
  owner_id: number;
  title: string;
  content: string;
  ai_summary: string | null;
  tags: string | null;
  task_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags?: string;
  task_id?: number;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  tags?: string;
}

// ── Learning Path ─────────────────────────────────────────────────────────────

export interface LearningPath {
  level: UserLevel;
  goals: string | null;
  path: string[];
  xp_points: number;
  streak: number;
}
