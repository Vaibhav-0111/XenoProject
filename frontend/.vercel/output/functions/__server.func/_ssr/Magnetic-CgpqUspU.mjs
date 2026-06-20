import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as motion, i as useMotionValue, n as useSpring, t as useReducedMotion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Magnetic-CgpqUspU.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Wraps any element so it subtly "magnets" toward the cursor on hover --
* a small translate that springs back on mouse leave. Used for nav icons,
* the AI Orb card, and other small interactive targets to add a premium,
* tactile feel without being distracting.
*/
function Magnetic({ children, strength = 14, className }) {
	const reduceMotion = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, {
		stiffness: 200,
		damping: 15,
		mass: .3
	});
	const springY = useSpring(y, {
		stiffness: 200,
		damping: 15,
		mass: .3
	});
	if (reduceMotion) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children
	});
	const handleMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const relX = e.clientX - rect.left - rect.width / 2;
		const relY = e.clientY - rect.top - rect.height / 2;
		x.set(relX / rect.width * strength);
		y.set(relY / rect.height * strength);
	};
	const handleLeave = () => {
		x.set(0);
		y.set(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		onMouseMove: handleMove,
		onMouseLeave: handleLeave,
		style: {
			x: springX,
			y: springY
		},
		children
	});
}
//#endregion
export { Magnetic as t };
