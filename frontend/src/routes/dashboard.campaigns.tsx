import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, Megaphone, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrbState } from "@/components/OrbStateContext";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimatedTableRow } from "@/components/motion/AnimatedTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import {
  useAiCampaign,
  useCampaigns,
  useCreateCampaign,
  useLaunchCampaign,
  useSegments,
} from "@/lib/api/queries";
import type { Campaign, Channel } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/campaigns")({
  validateSearch: (search: Record<string, unknown>) => ({
    segmentId: search.segmentId ? Number(search.segmentId) : undefined,
  }),
  component: Campaigns,
});

const CHANNELS: Channel[] = ["WHATSAPP", "EMAIL", "SMS", "RCS"];

function Campaigns() {
  const { segmentId: initialSegmentId } = Route.useSearch();
  const { setState: setOrb } = useOrbState();

  const { data: segments, isLoading: segmentsLoading } = useSegments({ size: 50 });
  const {
    data: campaigns,
    isLoading: campaignsLoading,
    isError: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaigns({ size: 10 });

  const aiCampaign = useAiCampaign();
  const createCampaign = useCreateCampaign();
  const launchCampaign = useLaunchCampaign();

  const [segmentId, setSegmentId] = useState<number | undefined>(initialSegmentId);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [cta, setCta] = useState("");
  const [channel, setChannel] = useState<Channel>("WHATSAPP");
  const [reasoning, setReasoning] = useState<string | null>(null);

  useEffect(() => {
    if (initialSegmentId) setSegmentId(initialSegmentId);
  }, [initialSegmentId]);

  // Default to the most recently created segment once segments load, if none selected
  useEffect(() => {
    if (!segmentId && segments && segments.content.length > 0) {
      setSegmentId(segments.content[0].id);
    }
  }, [segments, segmentId]);

  const selectedSegment = segments?.content.find((s) => s.id === segmentId);

  const handleGenerate = () => {
    if (!goal.trim()) return;
    setOrb("thinking", { label: "Reading your goal" });

    aiCampaign.mutate(goal.trim(), {
      onSuccess: (res) => {
        setOrb("generating", { label: "Drafting campaign copy" });
        setTimeout(() => {
          setName(res.campaignName);
          setSubject(res.subject);
          setMessage(res.message);
          setCta(res.cta);
          setChannel(res.recommendedChannel);
          setReasoning(res.channelReasoning);
          setOrb("completed", { label: "Campaign drafted", autoResetMs: 2400 });
        }, 400);
      },
      onError: (err) => {
        setOrb("idle");
        toast.error(err instanceof ApiError ? err.message : "AI campaign generation failed.");
      },
    });
  };

  const resetForm = () => {
    setName("");
    setSubject("");
    setMessage("");
    setCta("");
    setReasoning(null);
    setGoal("");
  };

  const handleCreate = (launchAfter: boolean) => {
    if (!segmentId) {
      toast.error("Select an audience segment first.");
      return;
    }
    if (!name.trim() || !message.trim()) {
      toast.error("Add a campaign name and message before creating.");
      return;
    }

    createCampaign.mutate(
      {
        name: name.trim(),
        segmentId,
        channel,
        subject: subject.trim() || undefined,
        message: message.trim(),
        cta: cta.trim() || undefined,
      },
      {
        onSuccess: (campaign) => {
          if (!launchAfter) {
            toast.success(`Campaign "${campaign.name}" saved as draft`);
            resetForm();
            return;
          }
          launchCampaign.mutate(campaign.id, {
            onSuccess: () => {
              toast.success(
                `Campaign "${campaign.name}" launched to ${campaign.audienceSize.toLocaleString()} customers`,
              );
              resetForm();
            },
            onError: (err) => {
              toast.error(
                err instanceof ApiError ? err.message : "Campaign created, but launch failed.",
              );
            },
          });
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Could not create campaign.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Engagement</div>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Campaign Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick an audience, draft content with AI, choose a channel, and launch.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Builder */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass p-6 lg:col-span-2 space-y-5"
        >
          {/* Step 1: Audience */}
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              1. Audience
            </div>
            {segmentsLoading ? (
              <Skeleton className="mt-2 h-10 w-full" />
            ) : !segments || segments.content.length === 0 ? (
              <div className="mt-2 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No segments yet.{" "}
                <Link to="/dashboard/segments" className="text-cyan hover:underline">
                  Build one in the Segment Builder →
                </Link>
              </div>
            ) : (
              <select
                value={segmentId ?? ""}
                onChange={(e) => setSegmentId(Number(e.target.value))}
                className="mt-2 w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                {segments.content.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.audienceSize.toLocaleString()} customers
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: AI generate */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan">
              <Sparkles className="h-3.5 w-3.5" /> 2. Generate with AI
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Create a Diwali campaign for premium customers"
                className="flex-1 rounded-xl bg-input/60 px-4 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <MotionButton
                onClick={handleGenerate}
                disabled={aiCampaign.isPending || !goal.trim()}
              >
                {aiCampaign.isPending ? "Thinking…" : "Generate"}
              </MotionButton>
            </div>
            {reasoning && (
              <p className="mt-2 rounded-lg bg-secondary/30 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="text-cyan">Why {channel}:</span> {reasoning}
              </p>
            )}
          </div>

          {/* Step 3: Content */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">3. Content</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campaign name"
              className="w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            {channel === "EMAIL" && (
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line"
                className="w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            )}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message — use {{first_name}} to personalize"
              rows={4}
              className="w-full resize-none rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Call to action (e.g. Shop Now)"
              className="w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Step 4: Channel */}
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">4. Channel</div>
            <div className="mt-2 flex gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    channel === c
                      ? "bg-foreground text-background"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <MotionButton
              variant="outline"
              onClick={() => handleCreate(false)}
              disabled={createCampaign.isPending}
            >
              Save as draft
            </MotionButton>
            <MotionButton
              onClick={() => handleCreate(true)}
              disabled={createCampaign.isPending || launchCampaign.isPending}
            >
              {launchCampaign.isPending ? (
                "Launching…"
              ) : (
                <>
                  <Rocket className="h-3.5 w-3.5" /> Create & Launch
                </>
              )}
            </MotionButton>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-strong p-6"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">Preview</div>
          <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {channel}
            </div>
            {channel === "EMAIL" && subject && (
              <div className="mt-2 text-sm font-semibold">{subject || "Subject line"}</div>
            )}
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {(message || "Your message will appear here…").replace(
                /\{\{first_name\}\}/g,
                "Priya",
              )}
            </p>
            {cta && (
              <div className="mt-3 inline-flex rounded-lg bg-aurora px-3 py-1.5 text-xs font-medium text-background">
                {cta}
              </div>
            )}
          </div>
          {selectedSegment && (
            <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-3 text-left">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Audience
              </div>
              <div className="mt-1 text-sm">{selectedSegment.name}</div>
              <div className="text-[11px] text-muted-foreground">
                {selectedSegment.audienceSize.toLocaleString()} customers will receive this
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Existing campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h3 className="font-display text-lg font-semibold">All campaigns</h3>
          {campaignsError && (
            <button
              onClick={() => refetchCampaigns()}
              className="text-xs text-muted-foreground underline"
            >
              Retry
            </button>
          )}
        </div>
        {campaignsLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !campaigns || campaigns.content.length === 0 ? (
          <div className="grid place-items-center p-10 text-center">
            <Megaphone className="h-6 w-6 text-muted-foreground" />
            <div className="mt-3 text-sm font-medium">No campaigns yet</div>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Build one above using the AI generator, or write your own content from scratch.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Campaign</th>
                <th className="px-5 py-3 text-left">Segment</th>
                <th className="px-5 py-3 text-left">Channel</th>
                <th className="px-5 py-3 text-right">Audience</th>
                <th className="px-5 py-3 text-right">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.content.map((c, idx) => (
                <CampaignRow
                  key={c.id}
                  campaign={c}
                  index={idx}
                  onLaunch={() =>
                    launchCampaign.mutate(c.id, {
                      onSuccess: () => toast.success(`Campaign "${c.name}" launched`),
                      onError: (err) =>
                        toast.error(err instanceof ApiError ? err.message : "Launch failed."),
                    })
                  }
                  launching={launchCampaign.isPending && launchCampaign.variables === c.id}
                />
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

function CampaignRow({
  campaign,
  index,
  onLaunch,
  launching,
}: {
  campaign: Campaign;
  index: number;
  onLaunch: () => void;
  launching: boolean;
}) {
  return (
    <AnimatedTableRow index={index}>
      <td className="px-5 py-3 font-medium">{campaign.name}</td>
      <td className="px-5 py-3 text-muted-foreground">{campaign.segmentName}</td>
      <td className="px-5 py-3 text-muted-foreground">{campaign.channel}</td>
      <td className="px-5 py-3 text-right tabular-nums">
        {campaign.audienceSize.toLocaleString()}
      </td>
      <td className="px-5 py-3 text-right">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="px-5 py-3 text-right">
        {campaign.status === "DRAFT" ? (
          <button
            onClick={onLaunch}
            disabled={launching}
            className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] hover:bg-secondary/70 disabled:opacity-50"
          >
            {launching ? "Launching…" : "Launch"}
          </button>
        ) : (
          <Link
            to="/dashboard/analytics"
            search={{ campaignId: campaign.id } as Record<string, unknown>}
            className="text-[11px] text-cyan hover:underline"
          >
            View analytics
          </Link>
        )}
      </td>
    </AnimatedTableRow>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "RUNNING"
      ? "bg-mint/10 text-mint"
      : status === "DRAFT"
        ? "bg-cyan/10 text-cyan"
        : "bg-muted-foreground/10 text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] ${cls}`}>{status}</span>;
}
