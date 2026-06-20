import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { t as AIOrb } from "./AIOrb-zU3sNgLK.mjs";
import { n as useOrbState, t as OrbStateProvider } from "./OrbStateContext-CfHaYKV-.mjs";
import { r as useAuth } from "./auth-CHZIWgXM.mjs";
import { t as Magnetic } from "./Magnetic-CgpqUspU.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Bell, _ as LayoutDashboard, a as Target, c as Search, g as LoaderCircle, h as LogOut, o as Sparkles, p as Megaphone, r as Users, x as ChartColumn } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Bjv5v2kO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardRoot() {
	const navigate = useNavigate();
	const { isAuthenticated, hydrated } = useAuth();
	(0, import_react.useEffect)(() => {
		if (hydrated && !isAuthenticated) navigate({ to: "/login" });
	}, [
		hydrated,
		isAuthenticated,
		navigate
	]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	if (!isAuthenticated) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbStateProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardLayout, {}) });
}
var NAV = [
	{
		to: "/dashboard",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/dashboard/customers",
		label: "Customers",
		icon: Users
	},
	{
		to: "/dashboard/segments",
		label: "Segments",
		icon: Target
	},
	{
		to: "/dashboard/campaigns",
		label: "Campaigns",
		icon: Megaphone
	},
	{
		to: "/dashboard/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/dashboard/ai",
		label: "AI Command",
		icon: Sparkles
	}
];
function DashboardLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const initials = (user?.name || user?.email || "?").split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
	const handleSignOut = () => {
		logout();
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/60 bg-background/60 backdrop-blur-xl md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: {
							rotate: 12,
							scale: 1.08
						},
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 15
						},
						className: "grid h-7 w-7 place-items-center rounded-md bg-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-background" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-sm font-semibold tracking-tight",
							children: "XenoReach"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground",
							children: "AI Marketing OS"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-1 px-3",
					children: NAV.map((n) => {
						const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`,
							children: [
								active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "active-nav",
									className: "absolute left-0 h-5 w-0.5 rounded-r-full bg-aurora animate-aurora glow-primary",
									transition: {
										type: "spring",
										stiffness: 350,
										damping: 30
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, {
									strength: 8,
									className: "grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: `h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${active ? "text-cyan" : ""}` })
								}),
								n.label
							]
						}, n.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarOrbCard, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/70 px-6 py-3 backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Search customers, segments, campaigns…",
							className: "peer w-full rounded-lg bg-secondary/60 py-2 pl-9 pr-3 text-sm outline-none ring-1 ring-transparent placeholder:text-muted-foreground/60 transition-shadow focus:ring-primary focus:shadow-[0_0_0_4px_oklch(0.72_0.16_270_/_0.12)]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							y: -1,
							scale: 1.05
						},
						whileTap: { scale: .95 },
						className: "relative grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary",
						"aria-label": "Notifications",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pink animate-glow-pulse" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg bg-secondary/60 px-2 py-1.5 pr-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-6 w-6 place-items-center rounded-full bg-aurora text-[10px] font-semibold text-background",
								children: initials || "?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-w-[120px] truncate font-medium leading-none",
									children: user?.name || user?.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: user?.role || "Marketer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSignOut,
								title: "Sign out",
								"aria-label": "Sign out",
								className: "ml-1 grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" })
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 p-6 md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
function SidebarOrbCard() {
	const { state, label } = useOrbState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "m-3 rounded-2xl border border-border/60 bg-card/40 p-4 text-center backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-3 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOrb, {
					size: 84,
					state
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[9px] uppercase tracking-[0.22em] text-mint",
				children: state === "idle" ? "Agent" : "Agent · " + state
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard/ai",
				className: "mt-3 inline-flex w-full items-center justify-center rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background transition-transform hover:scale-[1.02]",
				children: "Open Command"
			})
		]
	});
}
//#endregion
export { DashboardRoot as component };
