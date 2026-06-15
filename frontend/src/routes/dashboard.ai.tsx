import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AIOrb } from "@/components/AIOrb";
import { useOrbState, type OrbState } from "@/components/OrbStateContext";
import { MotionButton } from "@/components/motion/MotionButton";
import { ApiError } from "@/lib/api/client";
import {
  useAiCommand,
  useCreateCampaign,
  useCreateSegment,
  useLaunchCampaign,
} from "@/lib/api/queries";
import type { AiCommandResponse } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/ai")({
  component: AICommand,
});

type Msg = {
  id: number;
  role: "user" | "ai";
  text: string;
  streaming?: boolean;
  plan?: AiCommandResponse;
  error?: boolean;
};

const SUGGESTIONS = [
  "Create a Diwali campaign for premium customers",
  "Find dormant users who spent over ₹5000",
  "Bring back inactive customers with a win-back offer",
  "Increase revenue from customers in Mumbai",
];

function formatPlan(plan: AiCommandResponse): string {
  return [
    plan.summary,
    "",
    `**Audience** — ${plan.segment.segmentName} (~${plan.audienceSize.toLocaleString()} customers)`,
    plan.segment.description ? plan.segment.description : "",
    "",
    `**Channel** — ${plan.recommendedChannel}`,
    plan.campaign.channelReasoning,
    "",
    `**Campaign** — ${plan.campaign.campaignName}`,
    plan.campaign.subject ? `Subject: ${plan.campaign.subject}` : "",
    plan.campaign.message,
    plan.campaign.cta ? `CTA: ${plan.campaign.cta}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function AICommand() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [localOrbState, setLocalOrbState] = useState<OrbState>("idle");
  const { setState: setGlobalOrb } = useOrbState();
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiCommand = useAiCommand();
  const createSegment = useCreateSegment();
  const createCampaign = useCreateCampaign();
  const launchCampaign = useLaunchCampaign();
  const [launchingId, setLaunchingId] = useState<number | null>(null);

  const updateOrb = (next: OrbState, opts?: { autoResetMs?: number; label?: string }) => {
    setLocalOrbState(next);
    setGlobalOrb(next, opts);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages]);

  const streamText = (aiId: number, fullText: string, onDone?: () => void) => {
    let i = 0;
    const interval = setInterval(() => {
      i += 6;
      setMessages((m) =>
        m.map((msg) => (msg.id === aiId ? { ...msg, text: fullText.slice(0, i) } : msg)),
      );
      if (i >= fullText.length) {
        clearInterval(interval);
        setMessages((m) =>
          m.map((msg) => (msg.id === aiId ? { ...msg, text: fullText, streaming: false } : msg)),
        );
        onDone?.();
      }
    }, 16);
  };

  const send = (text: string) => {
    if (!text.trim() || aiCommand.isPending) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    updateOrb("thinking", { label: "Reasoning about your request" });

    setTimeout(() => updateOrb("analyzing", { label: "Scanning customer data" }), 300);

    aiCommand.mutate(text, {
      onSuccess: (plan) => {
        updateOrb("generating", { label: "Drafting plan" });
        const aiId = Date.now() + 1;
        setMessages((m) => [...m, { id: aiId, role: "ai", text: "", streaming: true, plan }]);

        streamText(aiId, formatPlan(plan), () => {
          updateOrb("executing", { label: "Compiling delivery plan" });
          setTimeout(() => {
            updateOrb("completed", { label: "Plan ready", autoResetMs: 2400 });
            setTimeout(() => setLocalOrbState("idle"), 2400);
          }, 500);
        });
      },
      onError: (err) => {
        updateOrb("idle");
        const message =
          err instanceof ApiError ? err.message : "Something went wrong reaching the AI engine.";
        const aiId = Date.now() + 1;
        setMessages((m) => [...m, { id: aiId, role: "ai", text: message, error: true }]);
      },
    });
  };

  const launchPlan = (msgId: number, plan: AiCommandResponse) => {
    setLaunchingId(msgId);
    createSegment.mutate(
      {
        name: plan.segment.segmentName,
        description: plan.segment.description,
        rules: plan.segment.rules,
      },
      {
        onSuccess: (segment) => {
          if (segment.audienceSize === 0) {
            toast.error(
              "This audience matches 0 customers right now -- adjust the segment before launching.",
            );
            setLaunchingId(null);
            navigate({ to: "/dashboard/segments" });
            return;
          }
          createCampaign.mutate(
            {
              name: plan.campaign.campaignName,
              segmentId: segment.id,
              channel: plan.campaign.recommendedChannel,
              subject: plan.campaign.subject || undefined,
              message: plan.campaign.message,
              cta: plan.campaign.cta || undefined,
            },
            {
              onSuccess: (campaign) => {
                launchCampaign.mutate(campaign.id, {
                  onSuccess: () => {
                    toast.success(
                      `Launched "${campaign.name}" to ${campaign.audienceSize.toLocaleString()} customers`,
                    );
                    setLaunchingId(null);
                    navigate({
                      to: "/dashboard/analytics",
                      search: { campaignId: campaign.id } as Record<string, unknown>,
                    });
                  },
                  onError: (err) => {
                    setLaunchingId(null);
                    toast.error(
                      err instanceof ApiError ? err.message : "Campaign created but launch failed.",
                    );
                  },
                });
              },
              onError: (err) => {
                setLaunchingId(null);
                toast.error(err instanceof ApiError ? err.message : "Could not create campaign.");
              },
            },
          );
        },
        onError: (err) => {
          setLaunchingId(null);
          toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
        },
      },
    );
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">AI Agent</div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            Command Center
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {localOrbState === "idle"
            ? "Online"
            : localOrbState.charAt(0).toUpperCase() + localOrbState.slice(1) + "…"}
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Chat */}
        <div className="flex flex-1 flex-col rounded-2xl glass-strong overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <AIOrb
                    size={180}
                    state={localOrbState === "idle" ? "idle" : localOrbState}
                    className="mx-auto"
                  />
                  <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight">
                    How can I help you grow today?
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Describe a goal and I'll build the audience, draft the campaign, and pick the
                    best channel.
                  </p>
                  <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2, borderColor: "oklch(0.82 0.16 180 / 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => send(s)}
                        className="rounded-xl border border-border/60 bg-card/30 p-3 text-left text-xs transition-colors hover:bg-card/60"
                      >
                        <Sparkles className="mb-1.5 h-3.5 w-3.5 text-mint" />
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-6">
                <AnimatePresence>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                    >
                      {m.role === "ai" && (
                        <div className="mt-1">
                          <AIOrb size={28} state={m.streaming ? "generating" : "idle"} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-aurora animate-aurora text-background"
                            : m.error
                              ? "border border-destructive/30 bg-destructive/10 text-destructive"
                              : "text-foreground"
                        }`}
                      >
                        <FormattedText text={m.text} />
                        {m.streaming && (
                          <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-cyan align-middle" />
                        )}
                        {!m.streaming && m.plan && (
                          <div className="mt-3">
                            <MotionButton
                              onClick={() => launchPlan(m.id, m.plan!)}
                              disabled={launchingId === m.id}
                              className="text-xs"
                            >
                              {launchingId === m.id ? (
                                "Launching…"
                              ) : (
                                <>
                                  <Rocket className="h-3.5 w-3.5" /> Launch this campaign
                                </>
                              )}
                            </MotionButton>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/50 p-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl bg-input/60 p-2 ring-1 ring-border focus-within:ring-primary">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask the AI agent…"
                rows={1}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <MotionButton
                onClick={() => send(input)}
                disabled={!input.trim() || aiCommand.isPending}
                variant="primary"
                className="!px-0 h-9 w-9 !p-0"
              >
                <Send className="h-4 w-4" />
              </MotionButton>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="hidden w-72 flex-col gap-3 lg:flex">
          <div className="rounded-2xl glass p-5 text-center">
            <AIOrb size={120} state={localOrbState} className="mx-auto" />
            <div className="mt-4 text-sm font-medium">Agent state</div>
            <div className="text-xs text-muted-foreground capitalize">{localOrbState}</div>
          </div>
          <div className="flex-1 rounded-2xl glass p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Capabilities
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              {[
                "Audience generation",
                "Campaign drafting",
                "Channel recommendation",
                "One-click launch",
              ].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cyan" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  // Render simple **bold** + line breaks
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="text-gradient font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}
