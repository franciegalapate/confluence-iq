"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  NetworkAnimation,
  BoltIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronRightIcon,
} from "@/components/ui/animations";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSignup() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left: ambient intelligence panel (hidden below lg, form still fully usable) */}
      <div className="relative hidden overflow-hidden bg-[#050912] lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3 p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30">
            <BoltIcon className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-white">
              CONFLUENCE IQ
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-400/60">
              Market Intelligence Layer
            </p>
          </div>
        </div>

        <div className="relative z-10 min-h-0 flex-1 px-8">
          <NetworkAnimation className="h-full" />
        </div>

        <div className="relative z-10 p-8">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Market Intelligence.
            <br />
            Amplified by AI.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Turn scattered CRM signals into next best actions.
          </p>
        </div>
      </div>

      {/* Right: auth form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            // Secure Access Portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your intelligence dashboard.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none ring-1 ring-transparent transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="6+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none ring-1 ring-transparent transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="animate-fade-in mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 text-sm font-semibold tracking-wide text-gray-900 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99] disabled:scale-100 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/30 border-t-gray-900" />
                Signing in...
              </>
            ) : (
              <>
                Initialize Session
                <ChevronRightIcon className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 ease-out hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50"
          >
            Create an account
          </button>

          <p className="mt-8 text-center text-xs text-gray-400">
            Confluence IQ &middot; Secure connection
          </p>
        </div>
      </div>
    </main>
  );
}