import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  MailCheck,
  MousePointerClick,
  Activity,
  Sparkles,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { MotionCard } from "@/components/motion/MotionCard";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { AnimatedTableRow } from "@/components/motion/AnimatedTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useDashboardAnalytics } from "@/lib/api/queries";
import type { ReactNode } from "react";
import type { ChannelPerformance } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Overview() {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();

  const firstName = (user?.name || user?.email || "there").split(/[\s@]+/)[0];

  const stats = data
    ? [
        { label: "Total Customers", value: data.totalCustomers, prefix: "", suffix: "", icon: Users },
        { label: "Total Revenue", value: data.totalRevenue, prefix: "₹", suffix: "", icon: DollarSign },
        { label: "Running Campaigns", value: data.runningCampaigns, prefix: "", suffix: "", icon: Activity },
        { label: "Open Rate", value: data.openRate, prefix: "", suffix: "%", icon: MailCheck },
        { label: "Click Rate", value: data.clickRate, prefix: "", suffix: "%", icon: MousePointerClick },
        { label: "Conversion", value: data.conversionRate, prefix: "", suffix: "%", icon: TrendingUp },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Mission Control
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 normal-case tracking-normal">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {greeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your marketing operations.
          </p>
        </motion.div>
        <div className="hidden gap-2 sm:flex">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => refetch()}
            className="rounded-lg glass px-3 py-1.5 text-xs disabled:opacity-50"
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </motion.button>
          <Link to="/dashboard/campaigns">
            <MotionButton>+ New Campaign</MotionButton>
          </Link>
        </div>
      </div>

      {isError && (
        <ErrorBanner
          message={error instanceof Error ? error.message : "Failed to load dashboard data."}
          onRetry={refetch}
        />
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl glass p-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="mt-3 h-7 w-16" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))
          : stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <MotionCard className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-violet/20 text-foreground/90 transition-colors group-hover:from-cyan/30 group-hover:to-violet/30">
                      <s.icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 font-display text-2xl font-medium tracking-[-0.02em]">
                    <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "%" ? 1 : 0} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{s.label}</div>
                </MotionCard>
              </motion.div>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Channel performance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Channel performance</h3>
              <p className="text-xs text-muted-foreground">Open & click-through by channel, across all campaigns</p>
            </div>
          </div>
          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !data || data.channelPerformance.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No channel activity yet"
                description="Launch your first campaign to see delivery and open-rate performance by channel here."
                action={<Link to="/dashboard/campaigns"><MotionButton variant="outline">Create a campaign</MotionButton></Link>}
              />
            ) : (
              <div className="space-y-4">
                {data.channelPerformance.map((c, i) => (
                  <ChannelRow key={c.channel} channel={c} index={i} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* AI insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass-strong p-6"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider">AI Insights</h3>
          </div>
          <div className="mt-5 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
            ) : (
              buildInsights(data).map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 2, backgroundColor: "oklch(0.27 0.04 260 / 0.5)" }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="group rounded-xl bg-secondary/40 p-3 transition-colors"
                >
                  <div className="text-xs font-medium">{it.title}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{it.detail}</div>
                  <Link to={it.to} className="mt-2 inline-flex items-center gap-1 text-[10px] text-cyan hover:underline">
                    {it.action}
                    <motion.span className="inline-block" initial={{ x: 0 }} whileHover={{ x: 2 }}>
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl glass overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h3 className="font-display text-lg font-semibold">Recent campaigns</h3>
          <Link to="/dashboard/campaigns" className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data || data.recentCampaigns.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No campaigns yet"
            description="Create your first AI-generated campaign and it will show up here with live performance."
            action={<Link to="/dashboard/campaigns"><MotionButton>Create campaign</MotionButton></Link>}
            className="border-0 p-10"
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Campaign</th>
                <th className="px-5 py-3 text-left">Channel</th>
                <th className="px-5 py-3 text-right">Audience</th>
                <th className="px-5 py-3 text-right">Open rate</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCampaigns.map((c, idx) => (
                <AnimatedTableRow key={c.id} index={idx}>
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.channel}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.audienceSize.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.openRate}%</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={c.status} />
                  </td>
                </AnimatedTableRow>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

function ChannelRow({ channel, index }: { channel: ChannelPerformance; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{channel.channel}</span>
        <span className="text-muted-foreground tabular-nums">
          {channel.sent.toLocaleString()} sent · {channel.openRate}% open
        </span>
      </div>
      <div className="mt-1.5 flex gap-1">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, channel.openRate)}%` }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-aurora animate-aurora glow-primary"
          />
        </div>
      </div>
    </motion.div>
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

function buildInsights(data: ReturnType<typeof useDashboardAnalytics>["data"]) {
  if (!data) return [];

  const insights: Array<{ title: string; detail: string; action: string; to: string }> = [];

  if (data.totalCustomers === 0) {
    insights.push({
      title: "No customers yet",
      detail: "Add customers (and their orders) to start building audiences.",
      action: "Go to Customers",
      to: "/dashboard/customers",
    });
  }

  if (data.totalCampaigns === 0) {
    insights.push({
      title: "Ready to launch your first campaign",
      detail: "Use the AI Command Center to go from a goal to a ready-to-send campaign in seconds.",
      action: "Open AI Command",
      to: "/dashboard/ai",
    });
  }

  if (data.channelPerformance.length >= 2) {
    const sorted = [...data.channelPerformance].sort((a, b) => b.openRate - a.openRate);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (best.openRate > worst.openRate) {
      insights.push({
        title: `${best.channel} outperforming ${worst.channel}`,
        detail: `${best.channel} has a ${best.openRate}% open rate vs. ${worst.openRate}% on ${worst.channel}. Consider shifting future campaigns.`,
        action: "Build a segment",
        to: "/dashboard/segments",
      });
    }
  }

  if (data.totalSent > 0 && data.conversionRate < 5) {
    insights.push({
      title: "Conversion rate is low",
      detail: `Only ${data.conversionRate}% of sent messages convert. Try a more targeted segment or a stronger offer.`,
      action: "Refine a segment",
      to: "/dashboard/segments",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Everything looks healthy",
      detail: "No urgent issues detected across your customers, campaigns, or channels.",
      action: "View analytics",
      to: "/dashboard/analytics",
    });
  }

  return insights.slice(0, 3);
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: typeof Inbox;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid place-items-center rounded-xl border border-dashed border-border p-8 text-center ${className}`}>
      <Icon className="h-6 w-6 text-muted-foreground" />
      <div className="mt-3 text-sm font-medium">{title}</div>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {message}
      </div>
      <button onClick={onRetry} className="text-xs underline">Retry</button>
    </div>
  );
}
