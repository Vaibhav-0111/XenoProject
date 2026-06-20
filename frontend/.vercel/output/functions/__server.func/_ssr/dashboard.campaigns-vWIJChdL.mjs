import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.campaigns-vWIJChdL.js
var $$splitComponentImporter = () => import("./dashboard.campaigns-ChKSbOl9.mjs");
var Route = createFileRoute("/dashboard/campaigns")({
	validateSearch: (search) => ({ segmentId: search.segmentId ? Number(search.segmentId) : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
