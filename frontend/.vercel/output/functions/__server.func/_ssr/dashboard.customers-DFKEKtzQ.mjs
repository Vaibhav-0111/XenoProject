import { o as __toESM } from "../_runtime.mjs";
import { r as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { t as ApiError } from "./client-4kwFZpQp.mjs";
import { a as Portal, c as Trigger, i as Overlay, n as Content, o as Root, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { b as CircleAlert, c as Search, n as X, r as Users, u as Plus } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as MotionButton } from "./MotionButton-Ceqe70vJ.mjs";
import { l as useCustomers, s as useCreateCustomer } from "./queries-TqOKxG5p.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-CgFN-4B6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.customers-DFKEKtzQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Root;
var DialogTrigger = Trigger;
var DialogPortal = Portal;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = Overlay.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = Title.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = Description.displayName;
var PAGE_SIZE = 10;
function tierFor(customer) {
	const spend = customer.totalSpend;
	if ((customer.lastOrderDate ? (Date.now() - new Date(customer.lastOrderDate).getTime()) / (1e3 * 60 * 60 * 24) : Infinity) > 60) return {
		label: "Dormant",
		cls: "bg-muted-foreground/10 text-muted-foreground"
	};
	if (spend > 15e3) return {
		label: "VIP",
		cls: "bg-pink/10 text-pink"
	};
	if (spend > 5e3) return {
		label: "Loyal",
		cls: "bg-cyan/10 text-cyan"
	};
	return {
		label: "Active",
		cls: "bg-emerald-400/10 text-emerald-400"
	};
}
function daysAgo(dateStr) {
	if (!dateStr) return "—";
	const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1e3 * 60 * 60 * 24));
	if (days <= 0) return "today";
	if (days === 1) return "1d";
	return `${days}d`;
}
function Customers() {
	const [page, setPage] = (0, import_react.useState)(0);
	const [searchInput, setSearchInput] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data, isLoading, isError, error, refetch, isFetching } = useCustomers({
		page,
		size: PAGE_SIZE,
		search
	});
	const tierCounts = (0, import_react.useMemo)(() => {
		const counts = {
			VIP: 0,
			Loyal: 0,
			Active: 0,
			Dormant: 0
		};
		data?.content.forEach((c) => {
			const t = tierFor(c).label;
			counts[t] += 1;
		});
		return counts;
	}, [data]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setPage(0);
		setSearch(searchInput.trim());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: "CRM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold tracking-tight",
						children: "Customer Explorer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: data ? `${data.totalElements.toLocaleString()} customers` : "Loading…"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearchSubmit,
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: searchInput,
							onChange: (e) => setSearchInput(e.target.value),
							placeholder: "Search name, email, phone…",
							className: "w-56 rounded-lg bg-secondary/60 py-2 pl-8 pr-3 text-xs outline-none ring-1 ring-transparent placeholder:text-muted-foreground/60 focus:ring-primary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCustomerDialog, {
						open: dialogOpen,
						onOpenChange: setDialogOpen
					})]
				})]
			}),
			isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), error instanceof Error ? error.message : "Failed to load customers."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => refetch(),
					className: "text-xs underline",
					children: "Retry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					{
						l: "VIP",
						v: tierCounts.VIP,
						c: "text-pink"
					},
					{
						l: "Loyal",
						v: tierCounts.Loyal,
						c: "text-cyan"
					},
					{
						l: "Active",
						v: tierCounts.Active,
						c: "text-emerald-400"
					},
					{
						l: "Dormant",
						v: tierCounts.Dormant,
						c: "text-muted-foreground"
					}
				].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					className: "rounded-2xl glass p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [t.l, " (this page)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-2 font-display text-2xl font-semibold ${t.c}`,
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-12" }) : t.v
					})]
				}, t.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl glass",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-left",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-left",
								children: "City"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Spend"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Last order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-left",
								children: "Tier"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-t border-border/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-3",
							colSpan: 5,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-full" })
						})
					}, i)) : !data || data.content.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						colSpan: 5,
						className: "px-5 py-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-6 w-6 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-sm font-medium",
								children: search ? "No customers match your search" : "No customers yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: search ? "Try a different name, email, or phone number." : "Add your first customer to start building segments and campaigns."
							}),
							!search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
									onClick: () => setDialogOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add customer"]
								})
							})
						]
					}) }) : data.content.map((c, i) => {
						const tier = tierFor(c);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.tr, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: i * .04 },
							className: "border-t border-border/30 hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-8 w-8 place-items-center rounded-full bg-aurora text-[11px] font-semibold text-background",
											children: c.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: c.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: c.email
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground",
									children: c.city || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3 text-right tabular-nums",
									children: ["₹", c.totalSpend.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right text-muted-foreground",
									children: daysAgo(c.lastOrderDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] ${tier.cls}`,
										children: tier.label
									})
								})
							]
						}, c.id);
					}) })]
				}), data && data.totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border/30 px-5 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Page ",
						data.page + 1,
						" of ",
						data.totalPages,
						isFetching && " · refreshing…"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: data.page === 0,
							onClick: () => setPage((p) => Math.max(0, p - 1)),
							className: "rounded-md px-2 py-1 hover:bg-secondary disabled:opacity-40",
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: data.last,
							onClick: () => setPage((p) => p + 1),
							className: "rounded-md px-2 py-1 hover:bg-secondary disabled:opacity-40",
							children: "Next"
						})]
					})]
				})]
			})
		]
	});
}
function AddCustomerDialog({ open, onOpenChange }) {
	const createCustomer = useCreateCustomer();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		city: "",
		gender: "",
		age: void 0
	});
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	const reset = () => {
		setForm({
			name: "",
			email: "",
			phone: "",
			city: "",
			gender: "",
			age: void 0
		});
		setFieldErrors({});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setFieldErrors({});
		createCustomer.mutate({
			...form,
			age: form.age ? Number(form.age) : void 0
		}, {
			onSuccess: () => {
				toast.success(`${form.name} added to your customers`);
				reset();
				onOpenChange(false);
			},
			onError: (err) => {
				if (err instanceof ApiError) if (err.fieldErrors) setFieldErrors(err.fieldErrors);
				else toast.error(err.message);
				else toast.error("Could not add customer. Please try again.");
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (v) => {
			onOpenChange(v);
			if (!v) reset();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add customer"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a customer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "They'll immediately be eligible for segments and campaigns based on the details below." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						error: fieldErrors.name,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary",
							placeholder: "Priya Sharma"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						error: fieldErrors.email,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							value: form.email,
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							})),
							className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary",
							placeholder: "priya@example.com"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							error: fieldErrors.phone,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.phone,
								onChange: (e) => setForm((f) => ({
									...f,
									phone: e.target.value
								})),
								className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary",
								placeholder: "+91…"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							error: fieldErrors.city,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.city,
								onChange: (e) => setForm((f) => ({
									...f,
									city: e.target.value
								})),
								className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary",
								placeholder: "Mumbai"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Gender",
							error: fieldErrors.gender,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.gender,
								onChange: (e) => setForm((f) => ({
									...f,
									gender: e.target.value
								})),
								className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "MALE",
										children: "Male"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "FEMALE",
										children: "Female"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "OTHER",
										children: "Other"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Age",
							error: fieldErrors.age,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								max: 150,
								value: form.age ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									age: e.target.value ? Number(e.target.value) : void 0
								})),
								className: "w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
							type: "submit",
							disabled: createCustomer.isPending,
							className: "w-full",
							children: createCustomer.isPending ? "Adding…" : "Add customer"
						})
					})
				]
			})]
		})]
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11px] text-destructive",
				children: error
			})
		]
	});
}
//#endregion
export { Customers as component };
