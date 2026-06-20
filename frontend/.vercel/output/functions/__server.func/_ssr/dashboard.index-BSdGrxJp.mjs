import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { r as useAuth } from "./auth-CHZIWgXM.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Activity, b as CircleAlert, d as MousePointerClick, i as TrendingUp, m as MailCheck, o as Sparkles, r as Users, v as Inbox, y as DollarSign } from "../_libs/lucide-react.mjs";
import { t as MotionButton } from "./MotionButton-Ceqe70vJ.mjs";
import { u as useDashboardAnalytics } from "./queries-TqOKxG5p.mjs";
import { t as Skeleton } from "./skeleton-CgFN-4B6.mjs";
import { t as AnimatedTableRow } from "./AnimatedTableRow-D0EqNtAL.mjs";
import { t as MotionCard } from "./MotionCard-Du0ZXPE-.mjs";
import { t as AnimatedNumber } from "./AnimatedNumber-D9-lwrgk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.index-BSdGrxJp.js
var import_jsx_runtime = require_jsx_runtime();
function greeting() {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}
function Overview() {
	const { user } = useAuth();
	const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();
	const firstName = (user?.name || user?.email || "there").split(/[\s@]+/)[0];
	const stats = data ? [
		{
			label: "Total Customers",
			value: data.totalCustomers,
			prefix: "",
			suffix: "",
			icon: Users
		},
		{
			label: "Total Revenue",
			value: data.totalRevenue,
			prefix: "₹",
			suffix: "",
			icon: DollarSign
		},
		{
			label: "Running Campaigns",
			value: data.runningCampaigns,
			prefix: "",
			suffix: "",
			icon: Activity
		},
		{
			label: "Open Rate",
			value: data.openRate,
			prefix: "",
			suffix: "%",
			icon: MailCheck
		},
		{
			label: "Click Rate",
			value: data.clickRate,
			prefix: "",
			suffix: "%",
			icon: MousePointerClick
		},
		{
			label: "Conversion",
			value: data.conversionRate,
			prefix: "",
			suffix: "%",
			icon: TrendingUp
		}
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: ["Mission Control", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 normal-case tracking-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), " Live"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-1 font-display text-3xl font-semibold tracking-tight",
							children: [
								greeting(),
								", ",
								firstName,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Here's what's happening across your marketing operations."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden gap-2 sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						whileHover: { y: -1 },
						whileTap: { scale: .97 },
						onClick: () => refetch(),
						className: "rounded-lg glass px-3 py-1.5 text-xs disabled:opacity-50",
						disabled: isFetching,
						children: isFetching ? "Refreshing…" : "Refresh"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/campaigns",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, { children: "+ New Campaign" })
					})]
				})]
			}),
			isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
				message: error instanceof Error ? error.message : "Failed to load dashboard data.",
				onRetry: refetch
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
				children: isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl glass p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4 rounded" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-16" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-3 w-20" })
					]
				}, i)) : stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					whileHover: { y: -4 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionCard, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-violet/20 text-foreground/90 transition-colors group-hover:from-cyan/30 group-hover:to-violet/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-3.5 w-3.5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 font-display text-2xl font-medium tracking-[-0.02em]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: s.value,
									prefix: s.prefix,
									suffix: s.suffix,
									decimals: s.suffix === "%" ? 1 : 0
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: s.label
							})
						]
					})
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .2 },
					className: "rounded-2xl glass p-6 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold",
							children: "Channel performance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Open & click-through by channel, across all campaigns"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, i))
						}) : !data || data.channelPerformance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: Inbox,
							title: "No channel activity yet",
							description: "Launch your first campaign to see delivery and open-rate performance by channel here.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/campaigns",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
									variant: "outline",
									children: "Create a campaign"
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: data.channelPerformance.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelRow, {
								channel: c,
								index: i
							}, c.channel))
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .3 },
					className: "rounded-2xl glass-strong p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold uppercase tracking-wider",
							children: "AI Insights"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-3",
						children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) : buildInsights(data).map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								x: 8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							whileHover: {
								x: 2,
								backgroundColor: "oklch(0.27 0.04 260 / 0.5)"
							},
							transition: { delay: .4 + i * .1 },
							className: "group rounded-xl bg-secondary/40 p-3 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: it.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: it.detail
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: it.to,
									className: "mt-2 inline-flex items-center gap-1 text-[10px] text-cyan hover:underline",
									children: [it.action, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
										className: "inline-block",
										initial: { x: 0 },
										whileHover: { x: 2 },
										children: "→"
									})]
								})
							]
						}, it.title))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .4 },
				className: "rounded-2xl glass overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/50 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold",
						children: "Recent campaigns"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/campaigns",
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: "View all →"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 p-5",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, i))
				}) : !data || data.recentCampaigns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Sparkles,
					title: "No campaigns yet",
					description: "Create your first AI-generated campaign and it will show up here with live performance.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/campaigns",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, { children: "Create campaign" })
					}),
					className: "border-0 p-10"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-left",
								children: "Campaign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-left",
								children: "Channel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Audience"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Open rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.recentCampaigns.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatedTableRow, {
						index: idx,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-medium",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: c.channel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right tabular-nums",
								children: c.audienceSize.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3 text-right tabular-nums",
								children: [c.openRate, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
							})
						]
					}, c.id)) })]
				})]
			})
		]
	});
}
function ChannelRow({ channel, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			x: 8
		},
		animate: {
			opacity: 1,
			x: 0
		},
		transition: { delay: index * .05 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: channel.channel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground tabular-nums",
				children: [
					channel.sent.toLocaleString(),
					" sent · ",
					channel.openRate,
					"% open"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5 flex gap-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 flex-1 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { width: 0 },
					animate: { width: `${Math.min(100, channel.openRate)}%` },
					transition: {
						duration: 1,
						delay: .2,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "h-full bg-aurora animate-aurora glow-primary"
				})
			})
		})]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-[10px] ${status === "RUNNING" ? "bg-mint/10 text-mint" : status === "DRAFT" ? "bg-cyan/10 text-cyan" : "bg-muted-foreground/10 text-muted-foreground"}`,
		children: status
	});
}
function buildInsights(data) {
	if (!data) return [];
	const insights = [];
	if (data.totalCustomers === 0) insights.push({
		title: "No customers yet",
		detail: "Add customers (and their orders) to start building audiences.",
		action: "Go to Customers",
		to: "/dashboard/customers"
	});
	if (data.totalCampaigns === 0) insights.push({
		title: "Ready to launch your first campaign",
		detail: "Use the AI Command Center to go from a goal to a ready-to-send campaign in seconds.",
		action: "Open AI Command",
		to: "/dashboard/ai"
	});
	if (data.channelPerformance.length >= 2) {
		const sorted = [...data.channelPerformance].sort((a, b) => b.openRate - a.openRate);
		const best = sorted[0];
		const worst = sorted[sorted.length - 1];
		if (best.openRate > worst.openRate) insights.push({
			title: `${best.channel} outperforming ${worst.channel}`,
			detail: `${best.channel} has a ${best.openRate}% open rate vs. ${worst.openRate}% on ${worst.channel}. Consider shifting future campaigns.`,
			action: "Build a segment",
			to: "/dashboard/segments"
		});
	}
	if (data.totalSent > 0 && data.conversionRate < 5) insights.push({
		title: "Conversion rate is low",
		detail: `Only ${data.conversionRate}% of sent messages convert. Try a more targeted segment or a stronger offer.`,
		action: "Refine a segment",
		to: "/dashboard/segments"
	});
	if (insights.length === 0) insights.push({
		title: "Everything looks healthy",
		detail: "No urgent issues detected across your customers, campaigns, or channels.",
		action: "View analytics",
		to: "/dashboard/analytics"
	});
	return insights.slice(0, 3);
}
function EmptyState({ icon: Icon, title, description, action, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid place-items-center rounded-xl border border-dashed border-border p-8 text-center ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-xs text-muted-foreground",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
function ErrorBanner({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), message]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onRetry,
			className: "text-xs underline",
			children: "Retry"
		})]
	});
}
//#endregion
export { Overview as component };
