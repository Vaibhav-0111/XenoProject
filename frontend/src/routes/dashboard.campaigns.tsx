import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Calendar, Clock, ExternalLink, FileText, Megaphone, Rocket, Save, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrbState } from "@/components/OrbStateContext";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimatedTableRow } from "@/components/motion/AnimatedTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ApiError } from "@/lib/api/client";
import {
  useAiCampaign,
  useCampaigns,
  useCampaignStats,
  useCreateCampaign,
  useCreateTemplate,
  useDeleteTemplate,
  useLaunchCampaign,
  useSegments,
  useTemplates,
} from "@/lib/api/queries";
import type { Campaign, CampaignTemplate, Channel } from "@/lib/api/types";

/**
 * Build a WhatsApp Web / wa.me link with a pre-filled message.
 * This opens WhatsApp Web (or the native app on mobile) ready to send.
 */
function buildWhatsAppLink(messageBody: string, cta?: string): string {
  let text = messageBody.replace(/\{\{first_name\}\}/g, "").trim();
  if (cta) text += `\n\n${cta}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(messageBody: string, cta?: string) {
  window.open(buildWhatsAppLink(messageBody, cta), "_blank");
}

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
  } = useCampaigns({ size: 10, search });

  const aiCampaign = useAiCampaign();
  const createCampaign = useCreateCampaign();
  const launchCampaign = useLaunchCampaign();

  const [segmentId, setSegmentId] = useState<number | undefined>(initialSegmentId);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [cta, setCta] = useState("");
  const [channel, setChannel] = useState<Channel>("WHATSAPP");
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [variantBSubject, setVariantBSubject] = useState("");
  const [variantBMessage, setVariantBMessage] = useState("");
  const [variantBCta, setVariantBCta] = useState("");
  const [previewVariant, setPreviewVariant] = useState<"A" | "B">("A");

  const { data: templates } = useTemplates();
  const createTemplate = useCreateTemplate();
  const deleteTemplate = useDeleteTemplate();

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
    setScheduledFor("");
    setAbTestingEnabled(false);
    setVariantBSubject("");
    setVariantBMessage("");
    setVariantBCta("");
    setPreviewVariant("A");
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
        scheduledFor: scheduledFor || undefined,
        abTestingEnabled,
        variantBSubject: variantBSubject.trim() || undefined,
        variantBMessage: variantBMessage.trim() || undefined,
        variantBCta: variantBCta.trim() || undefined,
      },
      {
        onSuccess: (campaign) => {
          if (!launchAfter) {
            if (scheduledFor) {
              toast.success(`Campaign "${campaign.name}" scheduled for ${new Date(scheduledFor).toLocaleString()}`);
            } else {
              toast.success(`Campaign "${campaign.name}" saved as draft`);
            }
            resetForm();
            return;
          }
          launchCampaign.mutate(campaign.id, {
            onSuccess: () => {
              toast.success(
                `Campaign "${campaign.name}" launched to ${campaign.audienceSize.toLocaleString()} customers`,
              );
              // Open WhatsApp Web with the campaign message when channel is WHATSAPP
              if (channel === "WHATSAPP" && message.trim()) {
                openWhatsApp(message, cta);
              }
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
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">A/B Testing</div>
              <Switch checked={abTestingEnabled} onCheckedChange={setAbTestingEnabled} />
            </div>
            
            {abTestingEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 rounded-xl border border-dashed border-border bg-card/50 space-y-3"
              >
                <div className="text-xs font-semibold text-cyan mb-2">Variant B (50% of audience)</div>
                {channel === "EMAIL" && (
                  <input
                    value={variantBSubject}
                    onChange={(e) => setVariantBSubject(e.target.value)}
                    placeholder="Variant B Subject line"
                    className="w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
                <textarea
                  value={variantBMessage}
                  onChange={(e) => setVariantBMessage(e.target.value)}
                  placeholder="Variant B Message"
                  rows={4}
                  className="w-full resize-none rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  value={variantBCta}
                  onChange={(e) => setVariantBCta(e.target.value)}
                  placeholder="Variant B Call to action"
                  className="w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </motion.div>
            )}
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

          {/* Step 5: Schedule */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> 5. Schedule (optional)
            </div>
            <div className="mt-2">
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              {scheduledFor && (
                <button
                  onClick={() => setScheduledFor("")}
                  className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
              {scheduledFor && (
                <p className="mt-1 text-[11px] text-cyan">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Will auto-launch at {new Date(scheduledFor).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <MotionButton
              variant="outline"
              onClick={() => handleCreate(false)}
              disabled={createCampaign.isPending}
            >
              {scheduledFor ? (
                <><Calendar className="h-3.5 w-3.5" /> Schedule</>
              ) : (
                "Save as draft"
              )}
            </MotionButton>
            {!scheduledFor && (
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
            )}
            <MotionButton
              variant="outline"
              onClick={() => {
                if (!message.trim()) { toast.error("Write a message first."); return; }
                createTemplate.mutate(
                  { name: name.trim() || "Untitled Template", channel, subject: subject.trim() || undefined, message: message.trim(), cta: cta.trim() || undefined },
                  { onSuccess: () => toast.success("Template saved!") }
                );
              }}
              disabled={createTemplate.isPending}
            >
              <Save className="h-3.5 w-3.5" /> Save Template
            </MotionButton>
            <MotionButton
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FileText className="h-3.5 w-3.5" /> {showTemplates ? "Hide" : "Load"} Templates
            </MotionButton>
          </div>

          {/* Templates panel */}
          <AnimatePresence>
            {showTemplates && templates && templates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-border/60 bg-card/30 p-3 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved Templates</div>
                  {templates.map((t: CampaignTemplate) => (
                    <div
                      key={t.id}
                      className="group flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 text-xs cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => {
                        setChannel(t.channel);
                        setSubject(t.subject || "");
                        setMessage(t.message);
                        setCta(t.cta || "");
                        setName(t.name);
                        setShowTemplates(false);
                        toast.success(`Loaded template "${t.name}"`);
                      }}
                    >
                      <div>
                        <span className="font-medium">{t.name}</span>
                        <span className="ml-2 text-muted-foreground">{t.channel}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate.mutate(t.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-strong p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">Preview</div>
            {abTestingEnabled && (
               <div className="flex gap-1 text-[10px]">
                 <button onClick={() => setPreviewVariant("A")} className={`px-2 py-1 rounded transition-colors ${previewVariant === "A" ? "bg-mint text-background" : "bg-secondary text-muted-foreground hover:bg-secondary/70"}`}>Variant A</button>
                 <button onClick={() => setPreviewVariant("B")} className={`px-2 py-1 rounded transition-colors ${previewVariant === "B" ? "bg-mint text-background" : "bg-secondary text-muted-foreground hover:bg-secondary/70"}`}>Variant B</button>
               </div>
            )}
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {channel}
            </div>
            {channel === "EMAIL" && (subject || variantBSubject) && (
              <div className="mt-2 text-sm font-semibold">{previewVariant === "A" ? (subject || "Subject line") : (variantBSubject || "Variant B Subject")}</div>
            )}
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {((previewVariant === "A" ? message : variantBMessage) || "Your message will appear here…").replace(
                /\{\{first_name\}\}/g,
                "Priya",
              )}
            </p>
            {(previewVariant === "A" ? cta : variantBCta) && (
              <div className="mt-3 inline-flex rounded-lg bg-aurora px-3 py-1.5 text-xs font-medium text-background">
                {previewVariant === "A" ? cta : variantBCta}
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 p-5">
          <h3 className="font-display text-lg font-semibold">All campaigns</h3>
          <div className="flex items-center gap-3">
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }} className="relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search campaigns…"
                className="w-48 rounded-lg bg-secondary/60 py-1.5 pl-3 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
            {campaignsError && (
              <button
                onClick={() => refetchCampaigns()}
                className="text-xs text-muted-foreground underline"
              >
                Retry
              </button>
            )}
          </div>
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
  const isRunning = campaign.status === "RUNNING";
  const { data: stats } = useCampaignStats(campaign.id, isRunning);

  // Toast on delivery milestones
  useEffect(() => {
    if (!stats || !isRunning) return;
    if (stats.total > 0 && stats.delivered + stats.opened + stats.clicked >= stats.total) {
      toast.success(
        `Campaign "${stats.campaignName}": ${stats.deliveryRate}% delivered, ${stats.openRate}% opened`,
        { id: `campaign-done-${campaign.id}` }
      );
    }
  }, [stats, isRunning, campaign.id]);

  return (
    <>
      <AnimatedTableRow index={index}>
        <td className="px-5 py-3">
          <div className="font-medium">{campaign.name}</div>
          {campaign.scheduledFor && campaign.status === "SCHEDULED" && (
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-cyan">
              <Clock className="h-3 w-3" />
              {new Date(campaign.scheduledFor).toLocaleString()}
            </div>
          )}
        </td>
        <td className="px-5 py-3 text-muted-foreground">{campaign.segmentName}</td>
        <td className="px-5 py-3 text-muted-foreground">{campaign.channel}</td>
        <td className="px-5 py-3 text-right tabular-nums">
          {campaign.audienceSize.toLocaleString()}
        </td>
        <td className="px-5 py-3 text-right">
          <StatusBadge status={campaign.status} />
        </td>
        <td className="px-5 py-3 text-right">
          {campaign.status === "DRAFT" || campaign.status === "SCHEDULED" ? (
            <button
              onClick={onLaunch}
              disabled={launching}
              className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] hover:bg-secondary/70 disabled:opacity-50"
            >
              {launching ? "Launching…" : "Launch Now"}
            </button>
          ) : (
            <div className="flex items-center justify-end gap-2">
              {campaign.channel === "WHATSAPP" && (
                <button
                  onClick={() => openWhatsApp(campaign.message, campaign.cta)}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/15 px-2.5 py-1 text-[11px] text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                  title="Open in WhatsApp"
                >
                  <WhatsAppIcon />
                  Send
                </button>
              )}
              <Link
                to="/dashboard/analytics"
                search={{ campaignId: campaign.id } as Record<string, unknown>}
                className="text-[11px] text-cyan hover:underline"
              >
                View analytics
              </Link>
            </div>
          )}
        </td>
      </AnimatedTableRow>
      {/* Live delivery tracker bar for RUNNING campaigns */}
      {isRunning && stats && stats.total > 0 && (
        <tr>
          <td colSpan={6} className="px-5 pb-3">
            <div className="rounded-lg bg-secondary/30 p-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                <span>Delivery Progress</span>
                <span className="tabular-nums">
                  {stats.delivered + stats.opened + stats.clicked}/{stats.total} delivered · {stats.openRate}% opened
                </span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                <motion.div
                  className="rounded-full bg-gradient-to-r from-cyan to-mint"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.deliveryRate, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="mt-1.5 flex gap-4 text-[10px]">
                <span className="text-cyan">Sent {stats.sent}</span>
                <span className="text-mint">Delivered {stats.delivered}</span>
                <span className="text-violet">Opened {stats.opened}</span>
                <span className="text-pink">Clicked {stats.clicked}</span>
                {stats.failed > 0 && <span className="text-destructive">Failed {stats.failed}</span>}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "RUNNING"
      ? "bg-mint/10 text-mint"
      : status === "SCHEDULED"
        ? "bg-violet/10 text-violet"
        : status === "DRAFT"
          ? "bg-cyan/10 text-cyan"
          : "bg-muted-foreground/10 text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] ${cls}`}>{status}</span>;
}

function WhatsAppIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

