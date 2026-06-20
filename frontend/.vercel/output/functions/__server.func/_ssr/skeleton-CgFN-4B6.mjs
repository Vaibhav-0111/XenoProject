import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-CgFN-4B6.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Shimmer skeleton: a soft diagonal highlight sweeps across the block,
* layered on top of the base pulse for a more premium loading feel.
*/
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative overflow-hidden rounded-md bg-primary/10", "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer", "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent", className),
		...props
	});
}
//#endregion
export { Skeleton as t };
