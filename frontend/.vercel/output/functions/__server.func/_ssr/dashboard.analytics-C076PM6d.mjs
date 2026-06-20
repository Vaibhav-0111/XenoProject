import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { b as CircleAlert, x as ChartColumn } from "../_libs/lucide-react.mjs";
import { a as useCampaigns, i as useCampaignAnalytics, u as useDashboardAnalytics } from "./queries-TqOKxG5p.mjs";
import { t as Route } from "./dashboard.analytics-CIoCmo_Q.mjs";
import { t as Skeleton } from "./skeleton-CgFN-4B6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.analytics-C076PM6d.js
var import_jsx_runtime = require_jsx_runtime();
function buildFunnel(d, audienceLabel) {
	const sent = "totalSent" in d ? d.totalSent : d.sent;
	const delivered = "totalDelivered" in d ? d.totalDelivered : d.delivered;
	const opened = "totalOpened" in d ? d.totalOpened : d.opened;
	const clicked = "totalClicked" in d ? d.totalClicked : d.clicked;
	const converted = "totalConverted" in d ? d.totalConverted : d.converted;
	const pct = (v) => sent > 0 ? Math.round(v / sent * 100) : 0;
	return [
		{
			stage: audienceLabel,
			value: sent,
			pct: 100
		},
		{
			stage: "Delivered",
			value: delivered,
			pct: pct(delivered)
		},
		{
			stage: "Opened",
			value: opened,
			pct: pct(opened)
		},
		{
			stage: "Clicked",
			value: clicked,
			pct: pct(clicked)
		},
		{
			stage: "Converted",
			value: converted,
			pct: pct(converted)
		}
	];
}
function Analytics() {
	const { campaignId } = Route.useSearch();
	const dashboard = useDashboardAnalytics();
	const { data: campaigns } = useCampaigns({ size: 20 });
	const campaignAnalytics = useCampaignAnalytics(campaignId);
	const isCampaignView = !!campaignId;
	const activeQuery = isCampaignView ? campaignAnalytics : dashboard;
	const data = activeQuery.data;
	const isLoading = activeQuery.isLoading;
	const isError = activeQuery.isError;
	const funnel = data ? buildFunnel(data, isCampaignView ? "Audience" : "Sent") : [];
	const hasActivity = data ? funnel[0].value > 0 : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: "Performance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold tracking-tight",
						children: isCampaignView && data && "campaignName" in data ? data.campaignName : "Analytics Center"
					}),
					isCampaignView && data && "channel" in data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							data.channel,
							" · ",
							data.status
						]
					})
				] }), campaigns && campaigns.content.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: campaignId ?? "",
					onChange: (e) => {
						const url = new URL(window.location.href);
						if (e.target.value) url.searchParams.set("campaignId", e.target.value);
						else url.searchParams.delete("campaignId");
						window.location.href = url.toString();
					},
					className: "rounded-lg bg-secondary/60 px-3 py-2 text-xs outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All campaigns (overview)"
					}), campaigns.content.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.name
					}, c.id))]
				})]
			}),
			isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), "Failed to load analytics."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-5",
				children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }, i)) : funnel.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					className: "rounded-2xl glass p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: f.stage
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-display text-2xl font-semibold tabular-nums",
							children: f.value.toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { width: 0 },
								animate: { width: `${f.pct}%` },
								transition: {
									duration: 1,
									delay: .2 + i * .1
								},
								className: "h-full bg-aurora"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [f.pct, "%"]
						})
					]
				}, f.stage))
			}),
			!isLoading && !hasActivity && !isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid place-items-center rounded-2xl border border-dashed border-border p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-6 w-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-sm font-medium",
						children: "No communications sent yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-xs text-muted-foreground",
						children: "Launch a campaign from the Campaign Studio to start seeing delivery, open and click data here."
					})
				]
			}),
			hasActivity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl glass p-6 lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "Conversion funnel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-3",
							children: funnel.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-20 text-xs text-muted-foreground",
									children: f.stage
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: { width: 0 },
										animate: { width: `${Math.max(f.pct, f.value > 0 ? 4 : 0)}%` },
										transition: {
											duration: 1.2,
											delay: i * .1,
											ease: "easeOut"
										},
										className: "h-10 rounded-r-lg bg-aurora animate-aurora glow-primary",
										style: { minWidth: f.value > 0 ? "30px" : "0px" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ml-3 text-sm tabular-nums",
										children: f.value.toLocaleString()
									})]
								})]
							}, f.stage))
						})]
					}),
					!isCampaignView && data && "channelPerformance" in data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl glass p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "By channel"
						}), data.channelPerformance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "No channel data yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-4",
							children: data.channelPerformance.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: 8
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .05 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.channel }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground tabular-nums",
										children: [c.openRate, "% open"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: { width: 0 },
										animate: { width: `${Math.min(100, c.openRate)}%` },
										transition: { delay: .2 },
										className: "h-full bg-cyan"
									})
								})]
							}, c.channel))
						})]
					}),
					isCampaignView && data && "deliveryRate" in data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl glass p-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "Rates"
						}), [
							{
								label: "Delivery rate",
								value: data.deliveryRate
							},
							{
								label: "Open rate",
								value: data.openRate
							},
							{
								label: "Click rate",
								value: data.clickRate
							},
							{
								label: "Conversion rate",
								value: data.conversionRate
							}
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground tabular-nums",
								children: [r.value, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-aurora",
								style: { width: `${Math.min(100, r.value)}%` }
							})
						})] }, r.label))]
					})
				]
			})
		]
	});
}
//#endregion
export { Analytics as component };
