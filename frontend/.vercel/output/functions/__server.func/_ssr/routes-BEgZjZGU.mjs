import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion, t as useReducedMotion } from "../_libs/framer-motion.mjs";
import { t as AIOrb } from "./AIOrb-zU3sNgLK.mjs";
import { t as Magnetic } from "./Magnetic-CgpqUspU.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Brain, f as MessageSquare, o as Sparkles, r as Users, t as Zap, w as ArrowRight, x as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as MotionCard } from "./MotionCard-Du0ZXPE-.mjs";
import { t as AnimatedNumber } from "./AnimatedNumber-D9-lwrgk.mjs";
import { t as Particles } from "./Particles-CwGrVhk2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BEgZjZGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Large, soft, slowly-drifting gradient blobs used behind hero/section
* content for depth. Purely decorative -- aria-hidden, pointer-events none.
*/
function AmbientGlow({ className = "" }) {
	const reduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
		children: [
			{
				color: "oklch(0.62 0.18 270 / 0.35)",
				size: 480,
				top: "5%",
				left: "8%",
				duration: 22
			},
			{
				color: "oklch(0.78 0.14 220 / 0.3)",
				size: 420,
				top: "40%",
				left: "70%",
				duration: 26
			},
			{
				color: "oklch(0.82 0.16 180 / 0.25)",
				size: 360,
				top: "70%",
				left: "15%",
				duration: 30
			}
		].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "absolute rounded-full blur-3xl",
			style: {
				width: b.size,
				height: b.size,
				top: b.top,
				left: b.left,
				background: b.color
			},
			animate: reduceMotion ? void 0 : {
				x: [
					0,
					40,
					-20,
					0
				],
				y: [
					0,
					-30,
					20,
					0
				],
				scale: [
					1,
					1.08,
					.96,
					1
				]
			},
			transition: {
				duration: b.duration,
				repeat: Infinity,
				ease: "easeInOut"
			}
		}, i))
	});
}
/**
* Splits its text children into words and staggers them in with a soft
* blur + rise, for hero-grade headline entrances. Non-text children (e.g.
* <br/>, <span> accents) are rendered as their own staggered block so
* styling like .text-gradient on inline spans still works.
*/
function AnimatedHeadline({ children, className, delay = 0, stagger = .05 }) {
	if (useReducedMotion()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className,
		children
	});
	let wordIndex = 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className,
		children: import_react.Children.toArray(children).map((child, i) => {
			if (typeof child === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: child.split(/(\s+)/).filter(Boolean).map((word, j) => {
				if (/^\s+$/.test(word)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: word }, j);
				const idx = wordIndex++;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					className: "inline-block",
					initial: {
						opacity: 0,
						y: 18,
						filter: "blur(6px)"
					},
					animate: {
						opacity: 1,
						y: 0,
						filter: "blur(0px)"
					},
					transition: {
						duration: .6,
						delay: delay + idx * stagger,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					children: word
				}, j);
			}) }, i);
			const idx = wordIndex++;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "inline-block",
				initial: {
					opacity: 0,
					y: 18,
					filter: "blur(6px)"
				},
				animate: {
					opacity: 1,
					y: 0,
					filter: "blur(0px)"
				},
				transition: {
					duration: .6,
					delay: delay + idx * stagger,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				children: child
			}, i);
		})
	});
}
var OFFSETS = {
	up: { y: 1 },
	down: { y: -1 },
	left: { x: 1 },
	right: { x: -1 },
	none: {}
};
/**
* Scroll-into-view reveal: fades, rises/slides and un-blurs content once it
* enters the viewport. Used across landing page sections for a layered,
* "things arrive as you scroll" feel without re-triggering on every scroll
* (animates once).
*/
function Reveal({ children, className, delay = 0, direction = "up", distance = 24, as = "div" }) {
	const reduceMotion = useReducedMotion();
	const offset = OFFSETS[direction];
	const variants = {
		hidden: {
			opacity: 0,
			y: offset.y ? offset.y * distance : 0,
			x: offset.x ? offset.x * distance : 0,
			filter: "blur(6px)"
		},
		visible: {
			opacity: 1,
			y: 0,
			x: 0,
			filter: "blur(0px)",
			transition: {
				duration: .6,
				delay,
				ease: [
					.22,
					1,
					.36,
					1
				]
			}
		}
	};
	if (reduceMotion) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(as, {
		className,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(as === "span" ? motion.span : motion.div, {
		className,
		initial: "hidden",
		whileInView: "visible",
		viewport: {
			once: true,
			margin: "0px 0px -80px 0px"
		},
		variants,
		children
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.header, {
				initial: {
					opacity: 0,
					y: -16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .6,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "fixed top-0 z-50 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass-strong px-6 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									whileHover: {
										rotate: 15,
										scale: 1.08
									},
									transition: {
										type: "spring",
										stiffness: 300,
										damping: 15
									},
									className: "grid h-8 w-8 place-items-center rounded-lg bg-aurora animate-aurora",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-background" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg font-semibold tracking-tight",
									children: "XenoReach"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary",
									children: "AI"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-8 text-sm text-muted-foreground md:flex",
							children: [
								{
									href: "#features",
									label: "Features"
								},
								{
									href: "#intelligence",
									label: "Intelligence"
								},
								{
									href: "#analytics",
									label: "Analytics"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: item.href,
								className: "group relative transition-colors hover:text-foreground",
								children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" })]
							}, item.href))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "hidden text-sm text-muted-foreground hover:text-foreground sm:block",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								className: "group inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors",
								children: ["Launch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" })]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative flex min-h-screen items-center justify-center px-6 pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientGlow, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-grid opacity-40",
						style: {
							maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
							WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, { count: 60 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto max-w-5xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 16
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .6 },
								className: "mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-1.5 w-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" })]
								}), "New · Autonomous Marketing Agent"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatedHeadline, {
								delay: .15,
								className: "font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.035em]",
								children: [
									"Marketing intelligence,",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif italic font-normal text-gradient",
										children: "re-imagined"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/80",
										children: "for AI."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
								initial: {
									opacity: 0,
									y: 16
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .6,
									delay: .3
								},
								className: "mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-muted-foreground",
								children: "Segment customers, generate campaigns, and orchestrate delivery across channels — through a marketing operating system that reasons, drafts, and ships on its own."
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
								transition: {
									duration: .6,
									delay: .45
								},
								className: "mt-10 flex flex-wrap items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, {
									strength: 10,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/dashboard",
										className: "group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_oklch(0.72_0.16_270_/_0.7)] transition-transform hover:scale-[1.02]",
										children: ["Launch Dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, {
									strength: 8,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#features",
										className: "inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-sm text-foreground/90 transition-colors hover:border-foreground/40",
										children: "See how it works"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									scale: .8
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								transition: {
									duration: 1,
									delay: .6
								},
								className: "relative mx-auto mt-20 flex items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOrb, {
										size: 320,
										state: "thinking"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										animate: { y: [
											0,
											-10,
											0
										] },
										initial: {
											opacity: 0,
											scale: .9
										},
										whileInView: {
											opacity: 1,
											scale: 1
										},
										whileHover: {
											scale: 1.04,
											y: -4
										},
										transition: {
											y: {
												duration: 5,
												repeat: Infinity,
												ease: "easeInOut"
											},
											opacity: {
												delay: .6,
												duration: .5
											},
											scale: {
												type: "spring",
												stiffness: 300,
												damping: 20
											}
										},
										className: "absolute -left-8 top-12 hidden w-56 rounded-xl glass-strong p-4 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.72_0.16_270/0.6)] md:block",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: "Segment"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-sm font-medium",
												children: "High-value dormant"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 h-1.5 overflow-hidden rounded-full bg-secondary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													initial: { width: 0 },
													animate: { width: "72%" },
													transition: {
														duration: 1.5,
														delay: 1
													},
													className: "h-full bg-aurora animate-aurora glow-primary"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 text-xs text-muted-foreground",
												children: "2,847 customers"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										animate: { y: [
											0,
											10,
											0
										] },
										initial: {
											opacity: 0,
											scale: .9
										},
										whileInView: {
											opacity: 1,
											scale: 1
										},
										whileHover: {
											scale: 1.04,
											y: -4
										},
										transition: {
											y: {
												duration: 6,
												repeat: Infinity,
												ease: "easeInOut",
												delay: 1
											},
											opacity: {
												delay: .75,
												duration: .5
											},
											scale: {
												type: "spring",
												stiffness: 300,
												damping: 20
											}
										},
										className: "absolute -right-4 top-4 hidden w-52 rounded-xl glass-strong p-4 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.78_0.14_220/0.6)] md:block",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground",
													children: "AI Recommends"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1.5 text-sm font-medium",
												children: "WhatsApp · 74% open rate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs text-muted-foreground",
												children: "+₹42K predicted lift"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										animate: { y: [
											0,
											-8,
											0
										] },
										initial: {
											opacity: 0,
											scale: .9
										},
										whileInView: {
											opacity: 1,
											scale: 1
										},
										whileHover: {
											scale: 1.04,
											y: -4
										},
										transition: {
											y: {
												duration: 5.5,
												repeat: Infinity,
												ease: "easeInOut",
												delay: .5
											},
											opacity: {
												delay: .9,
												duration: .5
											},
											scale: {
												type: "spring",
												stiffness: 300,
												damping: 20
											}
										},
										className: "absolute -bottom-2 right-10 hidden w-44 rounded-xl glass-strong p-3 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.82_0.16_180/0.6)] lg:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: "Live"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-sm font-medium",
											children: "12,439 delivered"
										})]
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-4",
						children: STATS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-background/60 p-6 text-center backdrop-blur-sm sm:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-3xl font-medium tracking-[-0.02em] text-gradient sm:text-4xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: s.value,
									prefix: s.prefix,
									suffix: s.suffix,
									decimals: s.decimals ?? 0
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs text-muted-foreground",
								children: s.label
							})]
						}, s.label))
					}) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "features",
				className: "relative px-6 py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "mb-16 max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.24em] text-mint",
							children: "— The Platform"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl",
							children: [
								"An operating system for",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif italic font-normal text-gradient",
									children: "modern"
								}),
								" marketing teams."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-3",
						children: FEATURES.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 24
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: {
								duration: .5,
								delay: i * .06
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionCard, {
								className: "h-full rounded-none border-0 bg-background p-8 hover:bg-card/60",
								lift: false,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-6 bg-mint/60 transition-all duration-300 group-hover:w-10 group-hover:bg-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] uppercase tracking-[0.2em] text-mint",
											children: ["0", i + 1]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: {
											rotate: -6,
											scale: 1.08
										},
										transition: {
											type: "spring",
											stiffness: 300,
											damping: 15
										},
										className: "mt-6 grid h-9 w-9 place-items-center rounded-lg bg-secondary/70 text-foreground/90",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 font-display text-lg font-medium tracking-tight",
										children: f.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: f.desc
									})
								]
							})
						}, f.title))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "intelligence",
				className: "relative px-6 py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl rounded-3xl glass-strong p-10 md:p-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-center gap-12 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							direction: "right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] uppercase tracking-[0.24em] text-mint",
									children: "— AI Agent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl",
									children: [
										"Tell it a goal.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif italic font-normal text-gradient",
											children: "Watch"
										}),
										" it work."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-md text-muted-foreground leading-relaxed",
									children: "\"Increase revenue from inactive users.\" The agent builds the segment, drafts the campaign, picks the channel, and predicts the lift — in seconds."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, {
									strength: 8,
									className: "mt-8 inline-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/dashboard",
										className: "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background",
										children: ["Try the Agent ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: AGENT_STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: 20
								},
								whileInView: {
									opacity: 1,
									x: 0
								},
								whileHover: {
									x: 4,
									scale: 1.01
								},
								viewport: { once: true },
								transition: {
									delay: i * .1,
									type: "spring",
									stiffness: 300,
									damping: 24
								},
								className: "flex items-center gap-3 rounded-xl glass px-4 py-3 transition-shadow hover:shadow-[0_8px_24px_-12px_oklch(0.72_0.16_270/0.5)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: {
											rotate: 8,
											scale: 1.1
										},
										className: "grid h-7 w-7 place-items-center rounded-lg bg-aurora animate-aurora text-[11px] font-semibold text-background",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: s.detail
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" })
								]
							}, s.label))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/50 px-6 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							whileHover: { rotate: 15 },
							className: "grid h-6 w-6 place-items-center rounded-md bg-aurora animate-aurora",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-background" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "XenoReach AI © 2026" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-6",
						children: [
							"Privacy",
							"Terms",
							"Contact"
						].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#",
							className: "group relative hover:text-foreground",
							children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" })]
						}, label))
					})]
				})
			})
		]
	});
}
var STATS = [
	{
		label: "Messages delivered",
		value: 128400,
		suffix: "+"
	},
	{
		label: "Avg. open rate lift",
		value: 32,
		suffix: "%"
	},
	{
		label: "Campaigns automated",
		value: 4200,
		suffix: "+"
	},
	{
		label: "Channels supported",
		value: 4
	}
];
var FEATURES = [
	{
		icon: Users,
		title: "Customer Intelligence",
		desc: "Unified profiles with spend patterns, engagement history, and AI-derived signals."
	},
	{
		icon: Brain,
		title: "Natural-Language Segments",
		desc: "Describe your audience in plain English. The AI compiles it into precise rules."
	},
	{
		icon: MessageSquare,
		title: "Generative Campaigns",
		desc: "Auto-write subject lines, body copy and CTAs tuned to each segment's behavior."
	},
	{
		icon: Zap,
		title: "Channel Simulator",
		desc: "Production-grade delivery pipeline with realistic open, click and read events."
	},
	{
		icon: ChartColumn,
		title: "Predictive Analytics",
		desc: "Forecast revenue lift, open rates, and cohort behavior before you press send."
	},
	{
		icon: Sparkles,
		title: "Autonomous Agent",
		desc: "Goal-to-execution loop. The agent reasons end-to-end across the entire stack."
	}
];
var AGENT_STEPS = [
	{
		label: "Analyze inactive cohort",
		detail: "Identified 2,847 dormant high-value customers"
	},
	{
		label: "Draft win-back message",
		detail: "Personalized offers with 15% discount + free shipping"
	},
	{
		label: "Select channel",
		detail: "WhatsApp — 74% predicted open rate"
	},
	{
		label: "Forecast outcome",
		detail: "+₹42,400 expected revenue lift"
	}
];
//#endregion
export { Landing as component };
