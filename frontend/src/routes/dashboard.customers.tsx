import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  MousePointerClick,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Upload,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo, useState, useRef, type FormEvent } from "react";
import { toast } from "sonner";
import { MotionButton } from "@/components/motion/MotionButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/api/client";
import { useCreateCustomer, useCustomers, useCustomerTimeline, useImportCustomers } from "@/lib/api/queries";
import type { Customer, CustomerRequest, TimelineEntry } from "@/lib/api/types";
import type { ReactNode } from "react";

export const Route = createFileRoute("/dashboard/customers")({
  component: Customers,
});

const PAGE_SIZE = 10;

function tierFor(customer: Customer): { label: string; cls: string } {
  const spend = customer.totalSpend;
  const inactiveDays = customer.lastOrderDate
    ? (Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  if (inactiveDays > 60)
    return { label: "Dormant", cls: "bg-muted-foreground/10 text-muted-foreground" };
  if (spend > 15000) return { label: "VIP", cls: "bg-pink/10 text-pink" };
  if (spend > 5000) return { label: "Loyal", cls: "bg-cyan/10 text-cyan" };
  return { label: "Active", cls: "bg-emerald-400/10 text-emerald-400" };
}

function daysAgo(dateStr?: string | null) {
  if (!dateStr) return "—";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1d";
  return `${days}d`;
}

const TIMELINE_ICONS: Record<string, typeof Send> = {
  CAMPAIGN_SENT: Send,
  DELIVERED: CheckCircle2,
  OPENED: Eye,
  CLICKED: MousePointerClick,
  FAILED: XCircle,
  CONVERTED: Zap,
  ORDER: ShoppingBag,
};

const TIMELINE_COLORS: Record<string, string> = {
  CAMPAIGN_SENT: "text-cyan border-cyan/30 bg-cyan/10",
  DELIVERED: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  OPENED: "text-violet border-violet/30 bg-violet/10",
  CLICKED: "text-pink border-pink/30 bg-pink/10",
  FAILED: "text-destructive border-destructive/30 bg-destructive/10",
  CONVERTED: "text-mint border-mint/30 bg-mint/10",
  ORDER: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

function formatTimelineDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Customers() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importCustomers = useImportCustomers();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    toast.loading("Importing customers...", { id: "import" });
    importCustomers.mutate(file, {
      onSuccess: (res) => {
        toast.success(`Imported ${res.imported} customers successfully!`, { id: "import" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to import customers", { id: "import" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useCustomers({
    page,
    size: PAGE_SIZE,
    search,
  });

  const tierCounts = useMemo(() => {
    const counts = { VIP: 0, Loyal: 0, Active: 0, Dormant: 0 };
    data?.content.forEach((c) => {
      const t = tierFor(c).label as keyof typeof counts;
      counts[t] += 1;
    });
    return counts;
  }, [data]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  const selectedCustomer = data?.content.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">CRM</div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            Customer Explorer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.totalElements.toLocaleString()} customers` : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-56 rounded-lg bg-secondary/60 py-2 pl-8 pr-3 text-xs outline-none ring-1 ring-transparent placeholder:text-muted-foreground/60 focus:ring-primary"
            />
          </form>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <MotionButton 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={importCustomers.isPending}
          >
            <Upload className="h-3.5 w-3.5" /> 
            {importCustomers.isPending ? "Importing…" : "Import CSV"}
          </MotionButton>
          <AddCustomerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
      </div>

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error instanceof Error ? error.message : "Failed to load customers."}
          </div>
          <button onClick={() => refetch()} className="text-xs underline">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "VIP", v: tierCounts.VIP, c: "text-pink" },
          { l: "Loyal", v: tierCounts.Loyal, c: "text-cyan" },
          { l: "Active", v: tierCounts.Active, c: "text-emerald-400" },
          { l: "Dormant", v: tierCounts.Dormant, c: "text-muted-foreground" },
        ].map((t, i) => (
          <motion.div
            key={t.l}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass p-4"
          >
            <div className="text-xs text-muted-foreground">{t.l} (this page)</div>
            <div className={`mt-2 font-display text-2xl font-semibold ${t.c}`}>
              {isLoading ? <Skeleton className="h-7 w-12" /> : t.v}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Customer Table */}
        <div className={`overflow-hidden rounded-2xl glass transition-all duration-300 ${selectedCustomerId ? "flex-1 min-w-0" : "w-full"}`}>
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">City</th>
                <th className="px-5 py-3 text-right">Spend</th>
                <th className="px-5 py-3 text-right">Last order</th>
                <th className="px-5 py-3 text-left">Tier</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="px-5 py-3" colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : !data || data.content.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Users className="mx-auto h-6 w-6 text-muted-foreground" />
                    <div className="mt-3 text-sm font-medium">
                      {search ? "No customers match your search" : "No customers yet"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {search
                        ? "Try a different name, email, or phone number."
                        : "Add your first customer to start building segments and campaigns."}
                    </p>
                    {!search && (
                      <div className="mt-4 flex justify-center gap-2">
                        <MotionButton 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={importCustomers.isPending}
                        >
                          <Upload className="h-3.5 w-3.5" /> Import CSV
                        </MotionButton>
                        <MotionButton onClick={() => setDialogOpen(true)}>
                          <Plus className="h-3.5 w-3.5" /> Add customer
                        </MotionButton>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                data.content.map((c, i) => {
                  const tier = tierFor(c);
                  const isSelected = selectedCustomerId === c.id;
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedCustomerId(isSelected ? undefined : c.id)}
                      className={`border-t border-border/30 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                          : "hover:bg-secondary/30"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-aurora text-[11px] font-semibold text-background">
                            {c.name
                              .split(" ")
                              .map((s) => s[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-[11px] text-muted-foreground">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{c.city || "—"}</td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        ₹{c.totalSpend.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">
                        {daysAgo(c.lastOrderDate)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${tier.cls}`}>
                          {tier.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/30 px-5 py-3 text-xs text-muted-foreground">
              <span>
                Page {data.page + 1} of {data.totalPages}
                {isFetching && " · refreshing…"}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={data.page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-md px-2 py-1 hover:bg-secondary disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={data.last}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md px-2 py-1 hover:bg-secondary disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Slide Panel */}
        <AnimatePresence>
          {selectedCustomerId && selectedCustomer && (
            <motion.div
              key="timeline-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="h-full w-[380px] rounded-2xl glass overflow-y-auto max-h-[calc(100vh-220px)]">
                {/* Header */}
                <div className="sticky top-0 z-10 glass-strong px-5 py-4 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-aurora text-xs font-bold text-background">
                        {selectedCustomer.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-display font-semibold text-sm">{selectedCustomer.name}</div>
                        <div className="text-[11px] text-muted-foreground">{selectedCustomer.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomerId(undefined)}
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-secondary text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="rounded-lg bg-secondary/60 px-2.5 py-1 text-[10px]">
                      <span className="text-muted-foreground">Spend </span>
                      <span className="font-semibold tabular-nums">₹{selectedCustomer.totalSpend.toLocaleString()}</span>
                    </div>
                    {selectedCustomer.city && (
                      <div className="rounded-lg bg-secondary/60 px-2.5 py-1 text-[10px]">
                        <span className="text-muted-foreground">{selectedCustomer.city}</span>
                      </div>
                    )}
                    <div className={`rounded-lg px-2.5 py-1 text-[10px] ${tierFor(selectedCustomer).cls}`}>
                      {tierFor(selectedCustomer).label}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">Activity Timeline</span>
                  </div>
                  <TimelineContent customerId={selectedCustomerId} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TimelineContent({ customerId }: { customerId: number }) {
  const { data, isLoading, isError } = useCustomerTimeline(customerId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Failed to load timeline.
      </div>
    );
  }

  if (!data || data.timeline.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-5 w-5 text-muted-foreground" />
        <div className="mt-2 text-xs text-muted-foreground">
          No activity yet. This customer hasn't been part of any campaigns or placed orders.
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/50" />

      <div className="space-y-1">
        {data.timeline.map((entry, i) => (
          <TimelineEntryCard key={`${entry.type}-${entry.occurredAt}-${i}`} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntryCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const Icon = TIMELINE_ICONS[entry.type] || Mail;
  const colorClass = TIMELINE_COLORS[entry.type] || "text-muted-foreground border-border bg-secondary/50";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative flex gap-3 py-2 group"
    >
      {/* Icon dot */}
      <div
        className={`relative z-10 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border ${colorClass} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium truncate">{entry.title}</span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
            {formatTimelineDate(entry.occurredAt)}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed truncate">
          {entry.description}
        </p>
        {entry.channel && (
          <span className="mt-1 inline-block rounded-md bg-secondary/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            {entry.channel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function AddCustomerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const createCustomer = useCreateCustomer();
  const [form, setForm] = useState<CustomerRequest>({
    name: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
    age: undefined,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setForm({ name: "", email: "", phone: "", city: "", gender: "", age: undefined });
    setFieldErrors({});
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    createCustomer.mutate(
      {
        ...form,
        age: form.age ? Number(form.age) : undefined,
      },
      {
        onSuccess: () => {
          toast.success(`${form.name} added to your customers`);
          reset();
          onOpenChange(false);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.fieldErrors) setFieldErrors(err.fieldErrors);
            else toast.error(err.message);
          } else {
            toast.error("Could not add customer. Please try again.");
          }
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <MotionButton>
          <Plus className="h-3.5 w-3.5" /> Add customer
        </MotionButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a customer</DialogTitle>
          <DialogDescription>
            They'll immediately be eligible for segments and campaigns based on the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Name" error={fieldErrors.name}>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Priya Sharma"
            />
          </Field>
          <Field label="Email" error={fieldErrors.email}>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="priya@example.com"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" error={fieldErrors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="+91…"
              />
            </Field>
            <Field label="City" error={fieldErrors.city}>
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="Mumbai"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Gender" error={fieldErrors.gender}>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">—</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Age" error={fieldErrors.age}>
              <input
                type="number"
                min={0}
                max={150}
                value={form.age ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    age: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full rounded-lg bg-secondary/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </Field>
          </div>
          <DialogFooter className="pt-2">
            <MotionButton type="submit" disabled={createCustomer.isPending} className="w-full">
              {createCustomer.isPending ? "Adding…" : "Add customer"}
            </MotionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
