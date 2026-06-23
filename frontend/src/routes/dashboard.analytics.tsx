import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, BarChart3, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionButton } from "@/components/motion/MotionButton";
import { useCampaignAnalytics, useCampaigns, useDashboardAnalytics } from "@/lib/api/queries";
import type { CampaignAnalytics, DashboardAnalytics } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/analytics")({
  validateSearch: (search: Record<string, unknown>) => ({
    campaignId: search.campaignId ? Number(search.campaignId) : undefined,
  }),
  component: Analytics,
});

function buildFunnel(d: DashboardAnalytics | CampaignAnalytics, audienceLabel: string) {
  const sent = "totalSent" in d ? d.totalSent : d.sent;
  const delivered = "totalDelivered" in d ? d.totalDelivered : d.delivered;
  const opened = "totalOpened" in d ? d.totalOpened : d.opened;
  const clicked = "totalClicked" in d ? d.totalClicked : d.clicked;
  const converted = "totalConverted" in d ? d.totalConverted : d.converted;

  const pct = (v: number) => (sent > 0 ? Math.round((v / sent) * 100) : 0);

  return [
    { stage: audienceLabel, value: sent, pct: 100 },
    { stage: "Delivered", value: delivered, pct: pct(delivered) },
    { stage: "Opened", value: opened, pct: pct(opened) },
    { stage: "Clicked", value: clicked, pct: pct(clicked) },
    { stage: "Converted", value: converted, pct: pct(converted) },
  ];
}

async function exportToPdf(element: HTMLElement, title: string) {
  const [html2canvas, jsPDF] = await Promise.all([
    import("html2canvas").then((m) => m.default),
    import("jspdf").then((m) => m.jsPDF),
  ]);

  // Capture the element
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");

  // Header
  pdf.setFontSize(18);
  pdf.setTextColor(100, 100, 100);
  pdf.text("XenoReach AI — Analytics Report", 14, 18);
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(title, 14, 25);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Divider line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, 33, 196, 33);

  // Content
  const yOffset = 38;
  let heightLeft = imgHeight;
  let position = yOffset;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - position;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const filename = `xenoreach-analytics-${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(filename);
}

function Analytics() {
  const { campaignId } = Route.useSearch();
  const dashboard = useDashboardAnalytics();
  const { data: campaigns } = useCampaigns({ size: 20 });
  const campaignAnalytics = useCampaignAnalytics(campaignId);
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const isCampaignView = !!campaignId;
  const activeQuery = isCampaignView ? campaignAnalytics : dashboard;
  const data = activeQuery.data;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  const funnel = data ? buildFunnel(data, isCampaignView ? "Audience" : "Sent") : [];
  const hasActivity = data ? funnel[0].value > 0 : false;

  const reportTitle =
    isCampaignView && data && "campaignName" in data ? data.campaignName : "All Campaigns Overview";

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    toast.loading("Generating PDF…", { id: "pdf-export" });
    try {
      await exportToPdf(reportRef.current, reportTitle);
      toast.success("PDF downloaded!", { id: "pdf-export" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: "pdf-export" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Performance
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {isCampaignView && data && "campaignName" in data
              ? data.campaignName
              : "Analytics Center"}
          </h1>
          {isCampaignView && data && "channel" in data && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.channel} · {data.status}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {campaigns && campaigns.content.length > 0 && (
            <select
              value={campaignId ?? ""}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set("campaignId", e.target.value);
                else url.searchParams.delete("campaignId");
                window.location.href = url.toString();
              }}
              className="rounded-lg bg-secondary/60 px-3 py-2 text-xs outline-none"
            >
              <option value="">All campaigns (overview)</option>
              {campaigns.content.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {hasActivity && (
            <MotionButton
              variant="outline"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {exporting ? "Exporting…" : "Export PDF"}
            </MotionButton>
          )}
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Failed to load analytics.
        </div>
      )}

      {/* Capturable report content */}
      <div ref={reportRef} className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))
            : funnel.map((f, i) => (
                <motion.div
                  key={f.stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass p-4"
                >
                  <div className="text-xs text-muted-foreground">{f.stage}</div>
                  <div className="mt-2 font-display text-2xl font-semibold tabular-nums">
                    {f.value.toLocaleString()}
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="h-full bg-aurora"
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{f.pct}%</div>
                </motion.div>
              ))}
        </div>

        {!isLoading && !hasActivity && !isError && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border p-10 text-center">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
            <div className="mt-3 text-sm font-medium">No communications sent yet</div>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Launch a campaign from the Campaign Studio to start seeing delivery, open and click data
              here.
            </p>
          </div>
        )}

        {hasActivity && (
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Funnel viz */}
            <div className="rounded-2xl glass p-6 lg:col-span-2">
              <h3 className="font-display text-lg font-semibold">Conversion funnel</h3>
              <div className="mt-6 space-y-3">
                {funnel.map((f, i) => (
                  <div key={f.stage} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-muted-foreground">{f.stage}</div>
                    <div className="flex flex-1 items-center">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(f.pct, f.value > 0 ? 4 : 0)}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                        className="h-10 rounded-r-lg bg-aurora animate-aurora glow-primary"
                        style={{ minWidth: f.value > 0 ? "30px" : "0px" }}
                      />
                      <div className="ml-3 text-sm tabular-nums">{f.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel perf -- only on overview */}
            {!isCampaignView && data && "channelPerformance" in data && (
              <div className="rounded-2xl glass p-6">
                <h3 className="font-display text-lg font-semibold">By channel</h3>
                {data.channelPerformance.length === 0 ? (
                  <p className="mt-4 text-xs text-muted-foreground">No channel data yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {data.channelPerformance.map((c, i) => (
                      <motion.div
                        key={c.channel}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span>{c.channel}</span>
                          <span className="text-muted-foreground tabular-nums">
                            {c.openRate}% open
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, c.openRate)}%` }}
                            transition={{ delay: 0.2 }}
                            className="h-full bg-cyan"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rate summary -- campaign view */}
            {isCampaignView && data && "deliveryRate" in data && (
              <div className="rounded-2xl glass p-6 space-y-4">
                <h3 className="font-display text-lg font-semibold">Rates</h3>
                {[
                  { label: "Delivery rate", value: data.deliveryRate },
                  { label: "Open rate", value: data.openRate },
                  { label: "Click rate", value: data.clickRate },
                  { label: "Conversion rate", value: data.conversionRate },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span>{r.label}</span>
                      <span className="text-muted-foreground tabular-nums">{r.value}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-aurora"
                        style={{ width: `${Math.min(100, r.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
