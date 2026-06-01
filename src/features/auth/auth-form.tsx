"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [email, setEmail] = useState("demo@myfinassist.local");
  const [password, setPassword] = useState("demo-password");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();
  const Icon = mode === "sign-in" ? LogIn : UserPlus;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!configured) {
      setMessage("Configure Supabase environment variables to use real auth.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const result =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage(
          mode === "sign-in"
            ? "Signed in. You can open the app routes now."
            : "Account created. Check email confirmation settings in Supabase."
        );
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Icon size={18} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-slate-500">Supabase Auth structure</p>
          </div>
        </div>

        {!configured ? (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Supabase is not configured yet. Demo pages still run locally, and
            real auth will activate after environment variables are set.
          </div>
        ) : null}

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          <Icon size={16} aria-hidden="true" />
          {loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Sign up"}
        </button>

        {message ? (
          <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">
            {message}
          </p>
        ) : null}

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "sign-in" ? (
            <>
              Need an account?{" "}
              <Link className="font-medium text-slate-950" href="/sign-up">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link className="font-medium text-slate-950" href="/sign-in">
                Sign in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
