import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, Plus, Sparkles, Target, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrbState } from "@/components/OrbStateContext";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { useCreateSegment, useSegmentPreview, useSegments, useAiSegment } from "@/lib/api/queries";
import type { SegmentCondition, SegmentRuleGroup } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/segments")({
  component: Segments,
});

const FIELD_OPTIONS = [
  { value: "totalSpend", label: "Total spend (₹)" },
  { value: "inactiveDays", label: "Days since last order" },
  { value: "age", label: "Age" },
  { value: "city", label: "City" },
  { value: "gender", label: "Gender" },
];

const OPERATORS_NUMERIC = [">", ">=", "<", "<=", "=", "!="];
const OPERATORS_STRING = ["=", "!=", "contains"];

function emptyCondition(): SegmentCondition {
  return { field: "totalSpend", operator: ">", value: "" };
}

function isStringField(field: string) {
  return field === "city" || field === "gender";
}

function Segments() {
  const navigate = useNavigate();
  const { setState: setOrb } = useOrbState();

  const [nlInput, setNlInput] = useState("");
  const [conditions, setConditions] = useState<SegmentCondition[]>([
    { field: "totalSpend", operator: ">", value: 5000 },
    { field: "inactiveDays", operator: ">", value: 60 },
  ]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const preview = useSegmentPreview();
  const createSegment = useCreateSegment();
  const aiSegment = useAiSegment();
  const {
    data: savedSegments,
    isLoading: segmentsLoading,
    isError: segmentsError,
    refetch: refetchSegments,
  } = useSegments({ size: 8, search });

  const rules: SegmentRuleGroup = { operator: "AND", conditions };

  // Live preview whenever rules change
  useEffect(() => {
    const valid = conditions.every((c) => c.value !== "" && c.value !== null);
    if (!valid || conditions.length === 0) return;

    const timeout = setTimeout(() => {
      preview.mutate(rules, {
        onError: (err) => {
          if (err instanceof ApiError) toast.error(err.message);
        },
      });
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(conditions)]);

  const audienceSize = preview.data?.audienceSize ?? 0;

  const handleAI = () => {
    if (!nlInput.trim()) return;
    setAiNotice(null);
    setOrb("thinking", { label: "Parsing natural language" });

    aiSegment.mutate(nlInput.trim(), {
      onSuccess: (res) => {
        setOrb("analyzing", { label: "Scoring customer fit" });
        setTimeout(() => setOrb("generating", { label: "Compiling rules" }), 300);
        setTimeout(() => {
          setConditions(flattenConditions(res.rules));
          setName(res.segmentName);
          setDescription(res.description);
          setOrb("completed", { label: "Segment ready", autoResetMs: 2400 });

          if (res.estimatedAudienceSize === 0) {
            setAiNotice("This audience currently matches 0 customers — try broadening the rules.");
          }
        }, 600);
      },
      onError: (err) => {
        setOrb("idle");
        toast.error(err instanceof ApiError ? err.message : "AI segment generation failed.");
      },
    });
  };

  const updateCondition = (index: number, patch: Partial<SegmentCondition>) => {
    setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Give this segment a name before saving.");
      return;
    }
    if (conditions.length === 0) {
      toast.error("Add at least one rule.");
      return;
    }

    createSegment.mutate(
      { name: name.trim(), description: description.trim() || undefined, rules },
      {
        onSuccess: (segment) => {
          toast.success(
            `Segment "${segment.name}" saved — ${segment.audienceSize.toLocaleString()} customers`,
          );
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
        },
      },
    );
  };

  const handleLaunch = () => {
    if (!name.trim()) {
      toast.error("Save this segment first so it can be used in a campaign.");
      return;
    }
    createSegment.mutate(
      { name: name.trim(), description: description.trim() || undefined, rules },
      {
        onSuccess: (segment) => {
          navigate({
            to: "/dashboard/campaigns",
            search: (prev) => ({ ...prev, segmentId: segment.id }) as Record<string, unknown>,
          });
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Audience</div>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Segment Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe an audience in plain English, or compose rules visually.
        </p>
      </div>

      {/* NL Builder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl glass-strong p-6"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aurora opacity-20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan">
            <Sparkles className="h-3.5 w-3.5" /> AI Segment Builder
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              placeholder="e.g. customers who spent over ₹5000 and haven't purchased in 60 days"
              className="flex-1 rounded-xl bg-input/60 px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && handleAI()}
            />
            <MotionButton onClick={handleAI} disabled={aiSegment.isPending || !nlInput.trim()}>
              {aiSegment.isPending ? "Thinking…" : "Generate"}
            </MotionButton>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Try: "premium customers in Mumbai" or "find dormant users inactive for 90 days"
          </p>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Rule canvas */}
        <div className="rounded-2xl glass p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold">Rules</h3>
              <p className="text-xs text-muted-foreground">All conditions match (AND)</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {description && (
              <p className="rounded-lg bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {conditions.map((r, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-xl bg-secondary/40 p-2"
              >
                <select
                  value={r.field}
                  onChange={(e) => {
                    const field = e.target.value;
                    updateCondition(i, {
                      field,
                      operator: isStringField(field) ? "=" : ">",
                      value: "",
                    });
                  }}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs outline-none"
                >
                  {FIELD_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={r.operator}
                  onChange={(e) => updateCondition(i, { operator: e.target.value })}
                  className="rounded-lg bg-cyan/10 px-2 py-1.5 text-xs text-cyan outline-none"
                >
                  {(isStringField(r.field) ? OPERATORS_STRING : OPERATORS_NUMERIC).map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <input
                  value={r.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const value = isStringField(r.field) || raw === "" ? raw : Number(raw);
                    updateCondition(i, { value });
                  }}
                  placeholder={isStringField(r.field) ? "e.g. Mumbai" : "e.g. 5000"}
                  className="flex-1 rounded-lg bg-secondary px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={() => setConditions(conditions.filter((_, j) => j !== i))}
                  className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Remove rule"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
            <button
              onClick={() => setConditions([...conditions, emptyCondition()])}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Add rule
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Segment name (e.g. High-value dormant)"
              className="rounded-xl bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-xl bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <MotionButton variant="outline" onClick={handleSave} disabled={createSegment.isPending}>
              {createSegment.isPending ? "Saving…" : "Save segment"}
            </MotionButton>
          </div>
        </div>

        {/* Audience size */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-strong p-6 text-center"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
            Live audience
          </div>
          <div className="mt-4 font-display text-5xl font-medium tracking-[-0.03em] text-gradient">
            {preview.isPending ? (
              <Skeleton className="mx-auto h-12 w-32" />
            ) : (
              <AnimatedNumber value={audienceSize} />
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">customers match</div>

          {aiNotice && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-left text-[11px] text-amber-300">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {aiNotice}
            </div>
          )}

          <MotionButton
            className="mt-6 w-full"
            onClick={handleLaunch}
            disabled={createSegment.isPending || audienceSize === 0}
          >
            Use in Campaign →
          </MotionButton>
          {audienceSize === 0 && !preview.isPending && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Adjust your rules — this audience is currently empty.
            </p>
          )}
        </motion.div>
      </div>

      {/* Saved segments */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">Saved segments</h3>
          <div className="flex items-center gap-3">
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }} className="relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search segments…"
                className="w-48 rounded-lg bg-secondary/60 py-1.5 pl-3 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
            {segmentsError && (
              <button
                onClick={() => refetchSegments()}
                className="text-xs text-muted-foreground underline"
              >
                Retry
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {segmentsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          ) : !savedSegments || savedSegments.content.length === 0 ? (
            <div className="col-span-full grid place-items-center rounded-2xl border border-dashed border-border p-8 text-center">
              <Target className="h-6 w-6 text-muted-foreground" />
              <div className="mt-3 text-sm font-medium">No saved segments yet</div>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Build a segment above and click "Save segment" to reuse it across campaigns.
              </p>
            </div>
          ) : (
            savedSegments.content.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setConditions(flattenConditions(s.rules))}
                className="group relative cursor-pointer overflow-hidden rounded-2xl glass p-5 hover-lift"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan to-violet opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
                <div className="relative">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="mt-3 font-display text-2xl">
                    {s.audienceSize.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.rules.conditions?.length ?? 0} rule
                    {(s.rules.conditions?.length ?? 0) === 1 ? "" : "s"}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** Flattens a (possibly nested) rule group into a flat list of leaf conditions for the visual editor. */
function flattenConditions(group: SegmentRuleGroup): SegmentCondition[] {
  const result: SegmentCondition[] = [];
  for (const c of group.conditions ?? []) {
    if ("conditions" in c) {
      result.push(...flattenConditions(c));
    } else {
      result.push(c);
    }
  }
  return result.length > 0 ? result : [emptyCondition()];
}
