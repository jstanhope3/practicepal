// src/app/login/page.tsx
"use client";

import { loginUser, registerUser } from "@/app/actions/auth";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const action = mode === "login" ? loginUser : registerUser;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🎹</span>
          <h1 className="text-2xl font-bold mt-2">Practice Pal</h1>
        </div>

        {/* TOGGLE BUTTONS */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${mode === "login" ? "bg-white shadow-sm text-practicepal-400" : "text-slate-500 hover:text-slate-700"}`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${mode === "register" ? "bg-white shadow-sm text-practicepal-400" : "text-slate-500 hover:text-slate-700"}`}
          >
            Create User
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {mode === "login" ? "Your Username" : "Choose a Username"}
            </label>
            <input
              name="username"
              type="text"
              placeholder="e.g. jazzcat22"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              minLength={3}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading
              ? "Checking..."
              : mode === "login"
                ? "Enter Dashboard"
                : "Claim Username"}
          </button>
        </form>
      </div>
    </div>
  );
}
