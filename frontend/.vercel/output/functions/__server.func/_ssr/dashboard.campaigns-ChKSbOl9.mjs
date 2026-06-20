import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { n as useOrbState } from "./OrbStateContext-CfHaYKV-.mjs";
import { t as ApiError } from "./client-4kwFZpQp.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Rocket, o as Sparkles, p as Megaphone } from "../_libs/lucide-react.mjs";
import { t as MotionButton } from "./MotionButton-Ceqe70vJ.mjs";
import { a as useCampaigns, d as useLaunchCampaign, o as useCreateCampaign, p as useSegments, t as useAiCampaign } from "./queries-TqOKxG5p.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-CgFN-4B6.mjs";
import { t as Route } from "./dashboard.campaigns-vWIJChdL.mjs";
import { t as AnimatedTableRow } from "./AnimatedTableRow-D0EqNtAL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.campaigns-ChKSbOl9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHANNELS = [
	"WHATSAPP",
	"EMAIL",
	"SMS",
	"RCS"
];
function Campaigns() {
	const { segmentId: initialSegmentId } = Route.useSearch();
	const { setState: setOrb } = useOrbState();
	const { data: segments, isLoading: segmentsLoading } = useSegments({ size: 50 });
	const { data: campaigns, isLoading: campaignsLoading, isError: campaignsError, refetch: refetchCampaigns } = useCampaigns({ size: 10 });
	const aiCampaign = useAiCampaign();
	const createCampaign = useCreateCampaign();
	const launchCampaign = useLaunchCampaign();
	const [segmentId, setSegmentId] = (0, import_react.useState)(initialSegmentId);
	const [goal, setGoal] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [cta, setCta] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("WHATSAPP");
	const [reasoning, setReasoning] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (initialSegmentId) setSegmentId(initialSegmentId);
	}, [initialSegmentId]);
	(0, import_react.useEffect)(() => {
		if (!segmentId && segments && segments.content.length > 0) setSegmentId(segments.content[0].id);
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
					setOrb("completed", {
						label: "Campaign drafted",
						autoResetMs: 2400
					});
				}, 400);
			},
			onError: (err) => {
				setOrb("idle");
				toast.error(err instanceof ApiError ? err.message : "AI campaign generation failed.");
			}
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
	const handleCreate = (launchAfter) => {
		if (!segmentId) {
			toast.error("Select an audience segment first.");
			return;
		}
		if (!name.trim() || !message.trim()) {
			toast.error("Add a campaign name and message before creating.");
			return;
		}
		createCampaign.mutate({
			name: name.trim(),
			segmentId,
			channel,
			subject: subject.trim() || void 0,
			message: message.trim(),
			cta: cta.trim() || void 0
		}, {
			onSuccess: (campaign) => {
				if (!launchAfter) {
					toast.success(`Campaign "${campaign.name}" saved as draft`);
					resetForm();
					return;
				}
				launchCampaign.mutate(campaign.id, {
					onSuccess: () => {
						toast.success(`Campaign "${campaign.name}" launched to ${campaign.audienceSize.toLocaleString()} customers`);
						resetForm();
					},
					onError: (err) => {
						toast.error(err instanceof ApiError ? err.message : "Campaign created, but launch failed.");
					}
				});
			},
			onError: (err) => {
				toast.error(err instanceof ApiError ? err.message : "Could not create campaign.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
					children: "Engagement"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-semibold tracking-tight",
					children: "Campaign Studio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Pick an audience, draft content with AI, choose a channel, and launch."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					className: "rounded-2xl glass p-6 lg:col-span-2 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: "1. Audience"
						}), segmentsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-10 w-full" }) : !segments || segments.content.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground",
							children: [
								"No segments yet.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/segments",
									className: "text-cyan hover:underline",
									children: "Build one in the Segment Builder →"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: segmentId ?? "",
							onChange: (e) => setSegmentId(Number(e.target.value)),
							className: "mt-2 w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary",
							children: segments.content.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [
									s.name,
									" · ",
									s.audienceSize.toLocaleString(),
									" customers"
								]
							}, s.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs uppercase tracking-wider text-cyan",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " 2. Generate with AI"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: goal,
									onChange: (e) => setGoal(e.target.value),
									placeholder: "e.g. Create a Diwali campaign for premium customers",
									className: "flex-1 rounded-xl bg-input/60 px-4 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary",
									onKeyDown: (e) => e.key === "Enter" && handleGenerate()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
									onClick: handleGenerate,
									disabled: aiCampaign.isPending || !goal.trim(),
									children: aiCampaign.isPending ? "Thinking…" : "Generate"
								})]
							}),
							reasoning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 rounded-lg bg-secondary/30 px-3 py-2 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-cyan",
										children: [
											"Why ",
											channel,
											":"
										]
									}),
									" ",
									reasoning
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: "3. Content"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Campaign name",
									className: "w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
								}),
								channel === "EMAIL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: subject,
									onChange: (e) => setSubject(e.target.value),
									placeholder: "Subject line",
									className: "w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: message,
									onChange: (e) => setMessage(e.target.value),
									placeholder: "Message — use {{first_name}} to personalize",
									rows: 4,
									className: "w-full resize-none rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: cta,
									onChange: (e) => setCta(e.target.value),
									placeholder: "Call to action (e.g. Shop Now)",
									className: "w-full rounded-xl bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: "4. Channel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: CHANNELS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setChannel(c),
								className: `rounded-lg px-3 py-1.5 text-xs transition-colors ${channel === c ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`,
								children: c
							}, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
								variant: "outline",
								onClick: () => handleCreate(false),
								disabled: createCampaign.isPending,
								children: "Save as draft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
								onClick: () => handleCreate(true),
								disabled: createCampaign.isPending || launchCampaign.isPending,
								children: launchCampaign.isPending ? "Launching…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-3.5 w-3.5" }), " Create & Launch"] })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					className: "rounded-2xl glass-strong p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mint",
							children: "Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-border/60 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground",
									children: channel
								}),
								channel === "EMAIL" && subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-sm font-semibold",
									children: subject || "Subject line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 whitespace-pre-wrap text-sm",
									children: (message || "Your message will appear here…").replace(/\{\{first_name\}\}/g, "Priya")
								}),
								cta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 inline-flex rounded-lg bg-aurora px-3 py-1.5 text-xs font-medium text-background",
									children: cta
								})
							]
						}),
						selectedSegment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-border/60 bg-card/40 p-3 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
									children: "Audience"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm",
									children: selectedSegment.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [selectedSegment.audienceSize.toLocaleString(), " customers will receive this"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "rounded-2xl glass overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/50 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold",
						children: "All campaigns"
					}), campaignsError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => refetchCampaigns(),
						className: "text-xs text-muted-foreground underline",
						children: "Retry"
					})]
				}), campaignsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 p-5",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, i))
				}) : !campaigns || campaigns.content.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid place-items-center p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-6 w-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm font-medium",
							children: "No campaigns yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-xs text-muted-foreground",
							children: "Build one above using the AI generator, or write your own content from scratch."
						})
					]
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
								children: "Segment"
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
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: campaigns.content.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignRow, {
						campaign: c,
						index: idx,
						onLaunch: () => launchCampaign.mutate(c.id, {
							onSuccess: () => toast.success(`Campaign "${c.name}" launched`),
							onError: (err) => toast.error(err instanceof ApiError ? err.message : "Launch failed.")
						}),
						launching: launchCampaign.isPending && launchCampaign.variables === c.id
					}, c.id)) })]
				})]
			})
		]
	});
}
function CampaignRow({ campaign, index, onLaunch, launching }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatedTableRow, {
		index,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 font-medium",
				children: campaign.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 text-muted-foreground",
				children: campaign.segmentName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 text-muted-foreground",
				children: campaign.channel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 text-right tabular-nums",
				children: campaign.audienceSize.toLocaleString()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: campaign.status })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-3 text-right",
				children: campaign.status === "DRAFT" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onLaunch,
					disabled: launching,
					className: "rounded-lg bg-secondary px-2.5 py-1 text-[11px] hover:bg-secondary/70 disabled:opacity-50",
					children: launching ? "Launching…" : "Launch"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/analytics",
					search: { campaignId: campaign.id },
					className: "text-[11px] text-cyan hover:underline",
					children: "View analytics"
				})
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-[10px] ${status === "RUNNING" ? "bg-mint/10 text-mint" : status === "DRAFT" ? "bg-cyan/10 text-cyan" : "bg-muted-foreground/10 text-muted-foreground"}`,
		children: status
	});
}
//#endregion
export { Campaigns as component };
