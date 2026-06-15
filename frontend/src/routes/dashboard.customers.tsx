import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, Plus, Search, Users } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
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
import { useCreateCustomer, useCustomers } from "@/lib/api/queries";
import type { Customer, CustomerRequest } from "@/lib/api/types";
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

  if (inactiveDays > 60) return { label: "Dormant", cls: "bg-muted-foreground/10 text-muted-foreground" };
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

function Customers() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useCustomers({ page, size: PAGE_SIZE, search });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">CRM</div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Customer Explorer</h1>
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
          <AddCustomerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
      </div>

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error instanceof Error ? error.message : "Failed to load customers."}
          </div>
          <button onClick={() => refetch()} className="text-xs underline">Retry</button>
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

      <div className="overflow-hidden rounded-2xl glass">
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
                    <div className="mt-4 flex justify-center">
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
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-border/30 hover:bg-secondary/30"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-aurora text-[11px] font-semibold text-background">
                          {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.city || "—"}</td>
                    <td className="px-5 py-3 text-right tabular-nums">₹{c.totalSpend.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{daysAgo(c.lastOrderDate)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${tier.cls}`}>{tier.label}</span>
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
    </div>
  );
}

function AddCustomerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const createCustomer = useCreateCustomer();
  const [form, setForm] = useState<CustomerRequest>({ name: "", email: "", phone: "", city: "", gender: "", age: undefined });
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
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
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
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value ? Number(e.target.value) : undefined }))}
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
