import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as motion, o as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$8 } from "./dashboard.analytics-CIoCmo_Q.mjs";
import { t as Route$9 } from "./dashboard.campaigns-vWIJChdL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DGKM6xyn.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-jExN7zsW.css";
/**
* Wraps every route's <Outlet/> in a fade + rise + blur transition keyed by
* pathname, so navigating between dashboard sections (or marketing pages)
* feels like a single continuous app rather than hard page swaps.
*/
function PageTransition() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (useReducedMotion()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
		mode: "wait",
		initial: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				y: 10,
				filter: "blur(4px)"
			},
			animate: {
				opacity: 1,
				y: 0,
				filter: "blur(0px)"
			},
			exit: {
				opacity: 0,
				y: -6,
				filter: "blur(4px)"
			},
			transition: {
				duration: .32,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		}, pathname)
	});
}
/**
* Slim aurora progress bar fixed to the top of the viewport, shown while
* TanStack Router is loading the next route (data fetches, lazy chunks).
* Mimics the Linear/Vercel "nprogress" feel.
*/
function RouteProgressBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: useRouterState({ select: (s) => s.status === "pending" }) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "fixed left-0 top-0 z-[100] h-0.5 w-full bg-aurora animate-aurora",
		initial: {
			scaleX: 0,
			opacity: 1
		},
		animate: {
			scaleX: .8,
			transition: {
				duration: .6,
				ease: "easeOut"
			}
		},
		exit: {
			scaleX: 1,
			opacity: 0,
			transition: { duration: .25 }
		},
		style: {
			transformOrigin: "left",
			boxShadow: "0 0 12px oklch(0.72 0.16 270 / 0.6)"
		}
	}) });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "XenoReach AI — Marketing Intelligence, Powered by AI" },
			{
				name: "description",
				content: "AI-native CRM for customer engagement and marketing automation."
			},
			{
				name: "author",
				content: "XenoReach"
			},
			{
				property: "og:title",
				content: "XenoReach AI"
			},
			{
				property: "og:description",
				content: "Marketing Intelligence, Powered by AI"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteProgressBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTransition, {})]
	});
}
var $$splitComponentImporter$6 = () => import("./login-DUgGGOC_.mjs");
var Route$6 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — XenoReach AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./dashboard-Bjv5v2kO.mjs");
var Route$5 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — XenoReach AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./routes-BEgZjZGU.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "XenoReach AI — Marketing Intelligence, Powered by AI" },
		{
			name: "description",
			content: "AI-native CRM for customer engagement, audience intelligence, and automated marketing campaigns."
		},
		{
			property: "og:title",
			content: "XenoReach AI"
		},
		{
			property: "og:description",
			content: "Marketing Intelligence, Powered by AI"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard.index-BSdGrxJp.mjs");
var Route$3 = createFileRoute("/dashboard/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./dashboard.segments-TBC3ONy-.mjs");
var Route$2 = createFileRoute("/dashboard/segments")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
/** Flattens a (possibly nested) rule group into a flat list of leaf conditions for the visual editor. */
var $$splitComponentImporter$1 = () => import("./dashboard.customers-DFKEKtzQ.mjs");
var Route$1 = createFileRoute("/dashboard/customers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./dashboard.ai-CSb2vlTY.mjs");
var Route = createFileRoute("/dashboard/ai")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var LoginRoute = Route$6.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$7
});
var DashboardRoute = Route$5.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$7
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var DashboardIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var DashboardSegmentsRoute = Route$2.update({
	id: "/segments",
	path: "/segments",
	getParentRoute: () => DashboardRoute
});
var DashboardCustomersRoute = Route$1.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => DashboardRoute
});
var DashboardCampaignsRoute = Route$9.update({
	id: "/campaigns",
	path: "/campaigns",
	getParentRoute: () => DashboardRoute
});
var DashboardAnalyticsRoute = Route$8.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardRoute
});
var DashboardRouteChildren = {
	DashboardAiRoute: Route.update({
		id: "/ai",
		path: "/ai",
		getParentRoute: () => DashboardRoute
	}),
	DashboardAnalyticsRoute,
	DashboardCampaignsRoute,
	DashboardCustomersRoute,
	DashboardSegmentsRoute,
	DashboardIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	LoginRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
