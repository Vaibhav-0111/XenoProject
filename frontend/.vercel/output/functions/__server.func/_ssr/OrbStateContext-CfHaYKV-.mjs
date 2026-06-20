import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OrbStateContext-CfHaYKV-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OrbStateContext = (0, import_react.createContext)(null);
var DEFAULT_LABELS = {
	idle: "Online",
	thinking: "Thinking",
	analyzing: "Analyzing",
	generating: "Generating",
	executing: "Executing",
	completed: "Completed"
};
function OrbStateProvider({ children }) {
	const [state, setStateRaw] = (0, import_react.useState)("idle");
	const [label, setLabel] = (0, import_react.useState)(DEFAULT_LABELS.idle);
	const resetTimer = (0, import_react.useRef)(null);
	const setState = (0, import_react.useCallback)((next, opts) => {
		if (resetTimer.current) {
			clearTimeout(resetTimer.current);
			resetTimer.current = null;
		}
		setStateRaw(next);
		setLabel(opts?.label ?? DEFAULT_LABELS[next]);
		if (opts?.autoResetMs) resetTimer.current = setTimeout(() => {
			setStateRaw("idle");
			setLabel(DEFAULT_LABELS.idle);
		}, opts.autoResetMs);
	}, []);
	const runLifecycle = (0, import_react.useCallback)(async (steps) => {
		for (const step of steps) {
			setState(step.state, { label: step.label });
			await new Promise((r) => setTimeout(r, step.durationMs));
		}
		setState("idle");
	}, [setState]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbStateContext.Provider, {
		value: {
			state,
			label,
			setState,
			runLifecycle
		},
		children
	});
}
function useOrbState() {
	const ctx = (0, import_react.useContext)(OrbStateContext);
	if (!ctx) return {
		state: "idle",
		label: "Online",
		setState: () => {},
		runLifecycle: async () => {}
	};
	return ctx;
}
//#endregion
export { useOrbState as n, OrbStateProvider as t };
