import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AIOrb } from "@/components/AIOrb";
import { Particles } from "@/components/Particles";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — XenoReach AI" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const goToDashboard = () => navigate({ to: "/dashboard" });

  const handleGoogle = async () => {
    setError(null);
    setLoading("google");
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      goToDashboard();
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      const cancelled =
        (err instanceof ApiError && err.status === 0 && err.message === "Sign-in cancelled") ||
        e?.code === "auth/popup-closed-by-user" ||
        e?.code === "auth/cancelled-popup-request";

      if (!cancelled) {
        const message =
          err instanceof ApiError
            ? err.message
            : e?.message || "Could not sign in. Please try again.";
        setError(message);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }
    setError(null);
    setLoading("email");
    try {
      await signInWithEmail(email.trim(), name.trim() || undefined);
      toast.success("Signed in");
      goToDashboard();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not reach XenoReach. Is the backend running?";
      setError(message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <Link
        to="/"
        className="absolute left-6 top-6 z-50 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Left visual */}
      <div className="relative hidden flex-1 items-center justify-center lg:flex">
        <Particles count={80} />
        <div
          className="absolute inset-0 bg-grid opacity-30"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
        <div className="relative">
          <AIOrb size={400} state="idle" />
        </div>
        <div className="absolute bottom-12 left-12 max-w-sm">
          <div className="text-xs uppercase tracking-[0.25em] text-primary">XenoReach AI</div>
          <p className="mt-3 font-display text-2xl tracking-tight">
            Your marketing team's <span className="text-gradient">intelligent core.</span>
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex w-full flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl glass-strong p-8 shadow-2xl"
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-aurora animate-aurora">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
            <span className="font-display text-lg font-semibold">XenoReach</span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your marketing intelligence hub.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading !== null}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full rounded-xl bg-input px-4 py-3 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              autoComplete="name"
              className="w-full rounded-xl bg-input px-4 py-3 text-sm outline-none ring-1 ring-border placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading !== null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aurora animate-aurora px-4 py-3 text-sm font-medium text-background glow-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "email" && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in with email
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-2 1.4-4.4 2.2-6.9 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.6 5C9.5 39.5 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5c4.2-3.9 6.8-9.6 6.8-16 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
