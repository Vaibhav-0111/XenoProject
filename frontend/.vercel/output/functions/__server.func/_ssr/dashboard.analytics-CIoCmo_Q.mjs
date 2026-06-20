import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.analytics-CIoCmo_Q.js
var $$splitComponentImporter = () => import("./dashboard.analytics-C076PM6d.mjs");
var Route = createFileRoute("/dashboard/analytics")({
	validateSearch: (search) => ({ campaignId: search.campaignId ? Number(search.campaignId) : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
