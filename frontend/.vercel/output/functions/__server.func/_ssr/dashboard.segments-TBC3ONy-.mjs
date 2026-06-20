import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { n as useOrbState } from "./OrbStateContext-CfHaYKV-.mjs";
import { t as ApiError } from "./client-4kwFZpQp.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Target, b as CircleAlert, n as X, o as Sparkles, u as Plus } from "../_libs/lucide-react.mjs";
import { t as MotionButton } from "./MotionButton-Ceqe70vJ.mjs";
import { c as useCreateSegment, f as useSegmentPreview, p as useSegments, r as useAiSegment } from "./queries-TqOKxG5p.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-CgFN-4B6.mjs";
import { t as AnimatedNumber } from "./AnimatedNumber-D9-lwrgk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.segments-TBC3ONy-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELD_OPTIONS = [
	{
		value: "totalSpend",
		label: "Total spend (₹)"
	},
	{
		value: "inactiveDays",
		label: "Days since last order"
	},
	{
		value: "age",
		label: "Age"
	},
	{
		value: "city",
		label: "City"
	},
	{
		value: "gender",
		label: "Gender"
	}
];
var OPERATORS_NUMERIC = [
	">",
	">=",
	"<",
	"<=",
	"=",
	"!="
];
var OPERATORS_STRING = [
	"=",
	"!=",
	"contains"
];
function emptyCondition() {
	return {
		field: "totalSpend",
		operator: ">",
		value: ""
	};
}
function isStringField(field) {
	return field === "city" || field === "gender";
}
function Segments() {
	const navigate = useNavigate();
	const { setState: setOrb } = useOrbState();
	const [nlInput, setNlInput] = (0, import_react.useState)("");
	const [conditions, setConditions] = (0, import_react.useState)([{
		field: "totalSpend",
		operator: ">",
		value: 5e3
	}, {
		field: "inactiveDays",
		operator: ">",
		value: 60
	}]);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [aiNotice, setAiNotice] = (0, import_react.useState)(null);
	const preview = useSegmentPreview();
	const createSegment = useCreateSegment();
	const aiSegment = useAiSegment();
	const { data: savedSegments, isLoading: segmentsLoading, isError: segmentsError, refetch: refetchSegments } = useSegments({ size: 8 });
	const rules = {
		operator: "AND",
		conditions
	};
	(0, import_react.useEffect)(() => {
		if (!conditions.every((c) => c.value !== "" && c.value !== null) || conditions.length === 0) return;
		const timeout = setTimeout(() => {
			preview.mutate(rules, { onError: (err) => {
				if (err instanceof ApiError) toast.error(err.message);
			} });
		}, 400);
		return () => clearTimeout(timeout);
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
					setOrb("completed", {
						label: "Segment ready",
						autoResetMs: 2400
					});
					if (res.estimatedAudienceSize === 0) setAiNotice("This audience currently matches 0 customers — try broadening the rules.");
				}, 600);
			},
			onError: (err) => {
				setOrb("idle");
				toast.error(err instanceof ApiError ? err.message : "AI segment generation failed.");
			}
		});
	};
	const updateCondition = (index, patch) => {
		setConditions((prev) => prev.map((c, i) => i === index ? {
			...c,
			...patch
		} : c));
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
		createSegment.mutate({
			name: name.trim(),
			description: description.trim() || void 0,
			rules
		}, {
			onSuccess: (segment) => {
				toast.success(`Segment "${segment.name}" saved — ${segment.audienceSize.toLocaleString()} customers`);
			},
			onError: (err) => {
				toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
			}
		});
	};
	const handleLaunch = () => {
		if (!name.trim()) {
			toast.error("Save this segment first so it can be used in a campaign.");
			return;
		}
		createSegment.mutate({
			name: name.trim(),
			description: description.trim() || void 0,
			rules
		}, {
			onSuccess: (segment) => {
				navigate({
					to: "/dashboard/campaigns",
					search: (prev) => ({
						...prev,
						segmentId: segment.id
					})
				});
			},
			onError: (err) => {
				toast.error(err instanceof ApiError ? err.message : "Could not save segment.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
					children: "Audience"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-semibold tracking-tight",
					children: "Segment Builder"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Describe an audience in plain English, or compose rules visually."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "relative overflow-hidden rounded-2xl glass-strong p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aurora opacity-20 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs uppercase tracking-wider text-cyan",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " AI Segment Builder"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: nlInput,
								onChange: (e) => setNlInput(e.target.value),
								placeholder: "e.g. customers who spent over ₹5000 and haven't purchased in 60 days",
								className: "flex-1 rounded-xl bg-input/60 px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-primary",
								onKeyDown: (e) => e.key === "Enter" && handleAI()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
								onClick: handleAI,
								disabled: aiSegment.isPending || !nlInput.trim(),
								children: aiSegment.isPending ? "Thinking…" : "Generate"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: "Try: \"premium customers in Mumbai\" or \"find dormant users inactive for 90 days\""
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl glass p-6 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold",
								children: "Rules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "All conditions match (AND)"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2",
							children: [
								description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-lg bg-secondary/30 px-3 py-2 text-xs text-muted-foreground",
									children: description
								}),
								conditions.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									layout: true,
									initial: {
										opacity: 0,
										x: -8
									},
									animate: {
										opacity: 1,
										x: 0
									},
									className: "flex items-center gap-2 rounded-xl bg-secondary/40 p-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: r.field,
											onChange: (e) => {
												const field = e.target.value;
												updateCondition(i, {
													field,
													operator: isStringField(field) ? "=" : ">",
													value: ""
												});
											},
											className: "rounded-lg bg-secondary px-3 py-1.5 text-xs outline-none",
											children: FIELD_OPTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: f.value,
												children: f.label
											}, f.value))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: r.operator,
											onChange: (e) => updateCondition(i, { operator: e.target.value }),
											className: "rounded-lg bg-cyan/10 px-2 py-1.5 text-xs text-cyan outline-none",
											children: (isStringField(r.field) ? OPERATORS_STRING : OPERATORS_NUMERIC).map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: op,
												children: op
											}, op))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: r.value,
											onChange: (e) => {
												const raw = e.target.value;
												updateCondition(i, { value: isStringField(r.field) || raw === "" ? raw : Number(raw) });
											},
											placeholder: isStringField(r.field) ? "e.g. Mumbai" : "e.g. 5000",
											className: "flex-1 rounded-lg bg-secondary px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground/50"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setConditions(conditions.filter((_, j) => j !== i)),
											className: "grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground",
											"aria-label": "Remove rule",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										})
									]
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setConditions([...conditions, emptyCondition()]),
									className: "inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add rule"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Segment name (e.g. High-value dormant)",
								className: "rounded-xl bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Description (optional)",
								className: "rounded-xl bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
								variant: "outline",
								onClick: handleSave,
								disabled: createSegment.isPending,
								children: createSegment.isPending ? "Saving…" : "Save segment"
							})
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
					className: "rounded-2xl glass-strong p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mint",
							children: "Live audience"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 font-display text-5xl font-medium tracking-[-0.03em] text-gradient",
							children: preview.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mx-auto h-12 w-32" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: audienceSize })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "customers match"
						}),
						aiNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-left text-[11px] text-amber-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), aiNotice]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
							className: "mt-6 w-full",
							onClick: handleLaunch,
							disabled: createSegment.isPending || audienceSize === 0,
							children: "Use in Campaign →"
						}),
						audienceSize === 0 && !preview.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: "Adjust your rules — this audience is currently empty."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: "Saved segments"
				}), segmentsError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => refetchSegments(),
					className: "text-xs text-muted-foreground underline",
					children: "Retry"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4",
				children: segmentsLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i)) : !savedSegments || savedSegments.content.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-full grid place-items-center rounded-2xl border border-dashed border-border p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-6 w-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm font-medium",
							children: "No saved segments yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-xs text-muted-foreground",
							children: "Build a segment above and click \"Save segment\" to reuse it across campaigns."
						})
					]
				}) : savedSegments.content.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					onClick: () => setConditions(flattenConditions(s.rules)),
					className: "group relative cursor-pointer overflow-hidden rounded-2xl glass p-5 hover-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan to-violet opacity-20 blur-2xl transition-opacity group-hover:opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 font-display text-2xl",
								children: s.audienceSize.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									s.rules.conditions?.length ?? 0,
									" rule",
									(s.rules.conditions?.length ?? 0) === 1 ? "" : "s"
								]
							})
						]
					})]
				}, s.id))
			})] })
		]
	});
}
/** Flattens a (possibly nested) rule group into a flat list of leaf conditions for the visual editor. */
function flattenConditions(group) {
	const result = [];
	for (const c of group.conditions ?? []) if ("conditions" in c) result.push(...flattenConditions(c));
	else result.push(c);
	return result.length > 0 ? result : [emptyCondition()];
}
//#endregion
export { Segments as component };
