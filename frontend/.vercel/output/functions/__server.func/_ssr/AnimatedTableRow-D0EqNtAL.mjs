import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnimatedTableRow-D0EqNtAL.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Staggered fade-in table row with hover highlight + subtle inset shift.
*/
function AnimatedTableRow({ index, children, className, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.tr, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: index * .04,
			duration: .35,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		whileHover: { backgroundColor: "oklch(0.23 0.035 260 / 0.55)" },
		onClick,
		className: cn("border-t border-border/30 transition-colors", onClick && "cursor-pointer", className),
		children
	});
}
//#endregion
export { AnimatedTableRow as t };
