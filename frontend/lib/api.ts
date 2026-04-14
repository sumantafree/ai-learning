import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  User,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  GenerateTaskPayload,
  TaskStats,
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  LearningPath,
} from "@/types";

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach JWT on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: RegisterPayload): Promise<AuthResponse> =>
    api.post("/auth/register", data).then((r) => r.data),

  login: (data: LoginPayload): Promise<AuthResponse> =>
    api.post("/auth/login", data).then((r) => r.data),

  me: (): Promise<User> =>
    api.get("/auth/me").then((r) => r.data),

  updateMe: (data: Partial<User>): Promise<User> =>
    api.put("/auth/me", data).then((r) => r.data),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (status?: string): Promise<Task[]> =>
    api.get("/tasks/", { params: status ? { status } : {} }).then((r) => r.data),

  get: (id: number): Promise<Task> =>
    api.get(`/tasks/${id}`).then((r) => r.data),

  create: (data: CreateTaskPayload): Promise<Task> =>
    api.post("/tasks/", data).then((r) => r.data),

  update: (id: number, data: UpdateTaskPayload): Promise<Task> =>
    api.put(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/tasks/${id}`).then(() => undefined),

  stats: (): Promise<TaskStats> =>
    api.get("/tasks/stats").then((r) => r.data),
};

// ── Notes ─────────────────────────────────────────────────────────────────────

export const notesApi = {
  list: (search?: string): Promise<Note[]> =>
    api.get("/notes/", { params: search ? { search } : {} }).then((r) => r.data),

  get: (id: number): Promise<Note> =>
    api.get(`/notes/${id}`).then((r) => r.data),

  create: (data: CreateNotePayload): Promise<Note> =>
    api.post("/notes/", data).then((r) => r.data),

  update: (id: number, data: UpdateNotePayload): Promise<Note> =>
    api.put(`/notes/${id}`, data).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/notes/${id}`).then(() => undefined),

  summarize: (id: number): Promise<Note> =>
    api.post(`/notes/${id}/summarize`, { note_id: id }).then((r) => r.data),
};

// ── AI ────────────────────────────────────────────────────────────────────────

export const aiApi = {
  generateTask: (data: GenerateTaskPayload): Promise<Task> =>
    api.post("/ai/generate-task", data).then((r) => r.data),

  learningPath: (): Promise<LearningPath> =>
    api.get("/ai/learning-path").then((r) => r.data),
};

export default api;
