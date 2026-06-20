import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as gsapWithCSS } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnimatedNumber-D9-lwrgk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* GSAP-powered count-up that smoothly tweens between value changes.
* Reuses a single tween so consecutive updates feel continuous (e.g. live audience size).
*/
function AnimatedNumber({ value, durationMs = 900, decimals, prefix = "", suffix = "", className }) {
	const obj = (0, import_react.useRef)({ n: 0 });
	const tweenRef = (0, import_react.useRef)(null);
	const [display, setDisplay] = (0, import_react.useState)(0);
	const isFloat = decimals !== void 0 ? decimals > 0 : value % 1 !== 0;
	const fixed = isFloat ? decimals ?? 1 : 0;
	(0, import_react.useEffect)(() => {
		tweenRef.current?.kill();
		tweenRef.current = gsapWithCSS.to(obj.current, {
			n: value,
			duration: durationMs / 1e3,
			ease: "power3.out",
			onUpdate: () => setDisplay(obj.current.n)
		});
		return () => {
			tweenRef.current?.kill();
		};
	}, [value, durationMs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className,
		children: [
			prefix,
			isFloat ? display.toFixed(fixed) : Math.round(display).toLocaleString(),
			suffix
		]
	});
}
//#endregion
export { AnimatedNumber as t };
