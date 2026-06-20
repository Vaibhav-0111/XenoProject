import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as AIOrb } from "./AIOrb-zU3sNgLK.mjs";
import { n as useOrbState } from "./OrbStateContext-CfHaYKV-.mjs";
import { t as ApiError } from "./client-4kwFZpQp.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Rocket, o as Sparkles, s as Send } from "../_libs/lucide-react.mjs";
import { t as MotionButton } from "./MotionButton-Ceqe70vJ.mjs";
import { c as useCreateSegment, d as useLaunchCampaign, n as useAiCommand, o as useCreateCampaign } from "./queries-TqOKxG5p.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.ai-CSb2vlTY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTIONS = [
	"Create a Diwali campaign for premium customers",
	"Find dormant users who spent over ₹5000",
	"Bring back inactive customers with a win-back offer",
	"Increase revenue from customers in Mumbai"
];
function formatPlan(plan) {
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
		plan.campaign.cta ? `CTA: ${plan.campaign.cta}` : ""
	].filter(Boolean).join("\n");
}
function AICommand() {
	const navigate = useNavigate();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [localOrbState, setLocalOrbState] = (0, import_react.useState)("idle");
	const { setState: setGlobalOrb } = useOrbState();
	const scrollRef = (0, import_react.useRef)(null);
	const aiCommand = useAiCommand();
	const createSegment = useCreateSegment();
	const createCampaign = useCreateCampaign();
	const launchCampaign = useLaunchCampaign();
	const [launchingId, setLaunchingId] = (0, import_react.useState)(null);
	const updateOrb = (next, opts) => {
		setLocalOrbState(next);
		setGlobalOrb(next, opts);
	};
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: 9e9,
			behavior: "smooth"
		});
	}, [messages]);
	const streamText = (aiId, fullText, onDone) => {
		let i = 0;
		const interval = setInterval(() => {
			i += 6;
			setMessages((m) => m.map((msg) => msg.id === aiId ? {
				...msg,
				text: fullText.slice(0, i)
			} : msg));
			if (i >= fullText.length) {
				clearInterval(interval);
				setMessages((m) => m.map((msg) => msg.id === aiId ? {
					...msg,
					text: fullText,
					streaming: false
				} : msg));
				onDone?.();
			}
		}, 16);
	};
	const send = (text) => {
		if (!text.trim() || aiCommand.isPending) return;
		const userMsg = {
			id: Date.now(),
			role: "user",
			text
		};
		setMessages((m) => [...m, userMsg]);
		setInput("");
		updateOrb("thinking", { label: "Reasoning about your request" });
		setTimeout(() => updateOrb("analyzing", { label: "Scanning customer data" }), 300);
		aiCommand.mutate(text, {
			onSuccess: (plan) => {
				updateOrb("generating", { label: "Drafting plan" });
				const aiId = Date.now() + 1;
				setMessages((m) => [...m, {
					id: aiId,
					role: "ai",
					text: "",
					streaming: true,
					plan
				}]);
				streamText(aiId, formatPlan(plan), () => {
					updateOrb("executing", { label: "Compiling delivery plan" });
					setTimeout(() => {
						updateOrb("completed", {
							label: "Plan ready",
							autoResetMs: 2400
						});
						setTimeout(() => setLocalOrbState("idle"), 2400);
					}, 500);
				});
			},
			onError: (err) => {
				updateOrb("idle");
				const message = err instanceof ApiError ? err.message : "Something went wrong reaching the AI engine.";
				const aiId = Date.now() + 1;
				setMessages((m) => [...m, {
					id: aiId,
					role: "ai",
					text: message,
					error: true
				}]);
			}
		});
	};
	const launchPlan = (msgId, plan) => {
		setLaunchingId(msgId);
		createSegment.mutate({
			name: plan.segment.segmentName,
			description: plan.segment.description,
			rules: plan.segment.rules
		}, {
			onSuccess: (segment) => {
				if (segment.audienceSize === 0) {
					toast.error("This audience matches 0 customers right now -- adjust the segment before launching.");
					setLaunchingId(null);
					navigate({ to: "/dashboard/segments" });
					return;
				}
				createCampaign.mutate({
					name: plan.campaign.campaignName,
					segmentId: segment.id,
					channel: plan.campaign.recommendedChannel,
					subject: plan.campaign.subject || void 0,
					message: plan.campaign.message,
					cta: plan.campaign.cta || void 0
				}, {
					onSuccess: (campaign) => {
						launchCampaign.mutate(campaign.id, {
							onSuccess: () => {
								toast.success(`Launched "${campaign.name}" to ${campaign.audienceSize.toLocaleString()} customers`);
								setLaunchingId(null);
								navigate({
									to: "/dashboard/analytics",
									search: { campaignId: campaign.id }
								});
							},
							onError: (err) => {
								setLaunchingId(null);
								toast.error(err instanceof ApiError ? err.message : "Campaign created but launch failed.");
							}
						});
					},
					onError: (err) => {
						setLaunchingId(null);
						toast.error(err instanceof ApiError ? err.message : "Could not create campaign.");
					}
				});
			},
			onError: (err) => {
				setLaunchingId(null);
				toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100vh-7rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
				children: "AI Agent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-semibold tracking-tight",
				children: "Command Center"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), localOrbState === "idle" ? "Online" : localOrbState.charAt(0).toUpperCase() + localOrbState.slice(1) + "…"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 gap-4 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col rounded-2xl glass-strong overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scrollRef,
					className: "flex-1 overflow-y-auto p-6",
					children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOrb, {
								size: 180,
								state: localOrbState === "idle" ? "idle" : localOrbState,
								className: "mx-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-8 font-display text-2xl font-semibold tracking-tight",
								children: "How can I help you grow today?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Describe a goal and I'll build the audience, draft the campaign, and pick the best channel."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid max-w-2xl gap-2 sm:grid-cols-2",
								children: SUGGESTIONS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
									initial: {
										opacity: 0,
										y: 8
									},
									animate: {
										opacity: 1,
										y: 0
									},
									whileHover: {
										y: -2,
										borderColor: "oklch(0.82 0.16 180 / 0.5)"
									},
									whileTap: { scale: .98 },
									transition: { delay: .1 + i * .05 },
									onClick: () => send(s),
									className: "rounded-xl border border-border/60 bg-card/30 p-3 text-left text-xs transition-colors hover:bg-card/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mb-1.5 h-3.5 w-3.5 text-mint" }), s]
								}, s))
							})
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-3xl space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: `flex gap-3 ${m.role === "user" ? "justify-end" : ""}`,
							children: [m.role === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOrb, {
									size: 28,
									state: m.streaming ? "generating" : "idle"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-aurora animate-aurora text-background" : m.error ? "border border-destructive/30 bg-destructive/10 text-destructive" : "text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedText, { text: m.text }),
									m.streaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-cyan align-middle" }),
									!m.streaming && m.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
											onClick: () => launchPlan(m.id, m.plan),
											disabled: launchingId === m.id,
											className: "text-xs",
											children: launchingId === m.id ? "Launching…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-3.5 w-3.5" }), " Launch this campaign"] })
										})
									})
								]
							})]
						}, m.id)) })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border/50 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-3xl items-end gap-2 rounded-2xl bg-input/60 p-2 ring-1 ring-border focus-within:ring-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: input,
							onChange: (e) => setInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									send(input);
								}
							},
							placeholder: "Ask the AI agent…",
							rows: 1,
							className: "flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
							onClick: () => send(input),
							disabled: !input.trim() || aiCommand.isPending,
							variant: "primary",
							className: "!px-0 h-9 w-9 !p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden w-72 flex-col gap-3 lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl glass p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOrb, {
							size: 120,
							state: localOrbState,
							className: "mx-auto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-sm font-medium",
							children: "Agent state"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground capitalize",
							children: localOrbState
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 rounded-2xl glass p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: "Capabilities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-xs",
						children: [
							"Audience generation",
							"Campaign drafting",
							"Channel recommendation",
							"One-click launch"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-cyan" }),
								" ",
								c
							]
						}, c))
					})]
				})]
			})]
		})]
	});
}
function FormattedText({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-pre-wrap",
		children: text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => p.startsWith("**") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "text-gradient font-semibold",
			children: p.slice(2, -2)
		}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p }, i))
	});
}
//#endregion
export { AICommand as component };
