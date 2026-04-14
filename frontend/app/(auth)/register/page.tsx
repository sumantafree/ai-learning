"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Loader2 } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner — new to AI/ML" },
  { value: "intermediate", label: "Intermediate — some experience" },
  { value: "advanced", label: "Advanced — building AI products" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    goals: "",
  });

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(form);
      router.push("/dashboard");
    } catch {
      // error in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AI Learning System</span>
          </div>
          <p className="text-slate-400">Start your AI learning journey today</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Create your account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="janedoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Your Level <span className="text-red-400">*</span>
              </label>
              <select
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Learning Goals
              </label>
              <textarea
                value={form.goals}
                onChange={(e) => set("goals", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                placeholder="e.g. Build AI SaaS products, master prompt engineering..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Start Learning for Free"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
