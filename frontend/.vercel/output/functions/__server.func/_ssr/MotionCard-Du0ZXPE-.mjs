import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion, i as useMotionValue, r as useMotionTemplate } from "../_libs/framer-motion.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MotionCard-Du0ZXPE-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Card with cursor-tracked spotlight (Framer Motion values) + lift transition.
* Tuned for the dark editorial palette.
*/
var MotionCard = (0, import_react.forwardRef)(({ children, className, spotlight = true, lift = true, onClick }, ref) => {
	const mx = useMotionValue(-200);
	const my = useMotionValue(-200);
	const bg = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, oklch(0.82 0.16 180 / 0.18), transparent 60%)`;
	const handleMove = (e) => {
		if (!spotlight) return;
		const rect = e.currentTarget.getBoundingClientRect();
		mx.set(e.clientX - rect.left);
		my.set(e.clientY - rect.top);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		ref,
		onMouseMove: handleMove,
		onClick,
		whileHover: lift ? { y: -3 } : void 0,
		transition: {
			type: "spring",
			stiffness: 320,
			damping: 26
		},
		className: cn("group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-colors", onClick && "cursor-pointer", className),
		children: [spotlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
			style: { background: bg }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children
		})]
	});
});
MotionCard.displayName = "MotionCard";
//#endregion
export { MotionCard as t };
