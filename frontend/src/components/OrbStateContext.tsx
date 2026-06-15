import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

export type OrbState = "idle" | "thinking" | "analyzing" | "generating" | "executing" | "completed";

type Ctx = {
  state: OrbState;
  label: string;
  setState: (next: OrbState, opts?: { autoResetMs?: number; label?: string }) => void;
  /** Run a scripted lifecycle: e.g. ["thinking", "generating", "completed"] */
  runLifecycle: (
    steps: Array<{ state: OrbState; durationMs: number; label?: string }>,
  ) => Promise<void>;
};

const OrbStateContext = createContext<Ctx | null>(null);

const DEFAULT_LABELS: Record<OrbState, string> = {
  idle: "Online",
  thinking: "Thinking",
  analyzing: "Analyzing",
  generating: "Generating",
  executing: "Executing",
  completed: "Completed",
};

export function OrbStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<OrbState>("idle");
  const [label, setLabel] = useState<string>(DEFAULT_LABELS.idle);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback<Ctx["setState"]>((next, opts) => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
    setStateRaw(next);
    setLabel(opts?.label ?? DEFAULT_LABELS[next]);
    if (opts?.autoResetMs) {
      resetTimer.current = setTimeout(() => {
        setStateRaw("idle");
        setLabel(DEFAULT_LABELS.idle);
      }, opts.autoResetMs);
    }
  }, []);

  const runLifecycle = useCallback<Ctx["runLifecycle"]>(
    async (steps) => {
      for (const step of steps) {
        setState(step.state, { label: step.label });
        await new Promise((r) => setTimeout(r, step.durationMs));
      }
      setState("idle");
    },
    [setState],
  );

  return (
    <OrbStateContext.Provider value={{ state, label, setState, runLifecycle }}>
      {children}
    </OrbStateContext.Provider>
  );
}

export function useOrbState() {
  const ctx = useContext(OrbStateContext);
  if (!ctx) {
    // Allow standalone usage outside provider (landing page) with a no-op
    return {
      state: "idle" as OrbState,
      label: "Online",
      setState: () => {},
      runLifecycle: async () => {},
    } satisfies Ctx;
  }
  return ctx;
}
