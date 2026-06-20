import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Particles-CwGrVhk2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Particles({ count = 50 }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		let w = canvas.width = canvas.offsetWidth * devicePixelRatio;
		let h = canvas.height = canvas.offsetHeight * devicePixelRatio;
		const particles = Array.from({ length: count }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			vx: (Math.random() - .5) * .3,
			vy: (Math.random() - .5) * .3,
			r: Math.random() * 1.5 + .5,
			a: Math.random() * .5 + .2
		}));
		const onResize = () => {
			w = canvas.width = canvas.offsetWidth * devicePixelRatio;
			h = canvas.height = canvas.offsetHeight * devicePixelRatio;
		};
		window.addEventListener("resize", onResize);
		const tick = () => {
			ctx.clearRect(0, 0, w, h);
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > w) p.vx *= -1;
				if (p.y < 0 || p.y > h) p.vy *= -1;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(180, 220, 255, ${p.a})`;
				ctx.fill();
			}
			raf = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onResize);
		};
	}, [count]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "absolute inset-0 h-full w-full"
	});
}
//#endregion
export { Particles as t };
