import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Target,
  Megaphone,
  BarChart3,
  Sparkles,
  Bell,
  Search,
  LogOut,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { AIOrb } from "@/components/AIOrb";
import { OrbStateProvider, useOrbState } from "@/components/OrbStateContext";
import { Magnetic } from "@/components/motion/Magnetic";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — XenoReach AI" }] }),
  component: DashboardRoot,
});

function DashboardRoot() {
  const navigate = useNavigate();
  const { isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect effect above will fire; render nothing in the meantime.
    return null;
  }

  return (
    <OrbStateProvider>
      <DashboardLayout />
    </OrbStateProvider>
  );
}

const NAV: Array<{ to: string; label: string; icon: typeof Users; exact?: boolean }> = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/customers", label: "Customers", icon: Users },
  { to: "/dashboard/segments", label: "Segments", icon: Target },
  { to: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/ai", label: "AI Command", icon: Sparkles },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || user?.email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const handleSignOut = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/60 bg-background/60 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="grid h-7 w-7 place-items-center rounded-md bg-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-background" />
          </motion.div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight">XenoReach</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">AI Marketing OS</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute left-0 h-5 w-0.5 rounded-r-full bg-aurora animate-aurora glow-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Magnetic strength={8} className="grid place-items-center">
                  <n.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${active ? "text-cyan" : ""}`} />
                </Magnetic>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <SidebarOrbCard />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/70 px-6 py-3 backdrop-blur-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-cyan" />
            <input
              placeholder="Search customers, segments, campaigns…"
              className="peer w-full rounded-lg bg-secondary/60 py-2 pl-9 pr-3 text-sm outline-none ring-1 ring-transparent placeholder:text-muted-foreground/60 transition-shadow focus:ring-primary focus:shadow-[0_0_0_4px_oklch(0.72_0.16_270_/_0.12)]"
            />
          </div>
          <motion.button
            whileHover={{ y: -1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pink animate-glow-pulse" />
          </motion.button>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2 py-1.5 pr-2">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-aurora text-[10px] font-semibold text-background">
              {initials || "?"}
            </div>
            <div className="text-xs">
              <div className="max-w-[120px] truncate font-medium leading-none">{user?.name || user?.email}</div>
              <div className="text-muted-foreground">{user?.role || "Marketer"}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="ml-1 grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarOrbCard() {
  const { state, label } = useOrbState();
  return (
    <div className="m-3 rounded-2xl border border-border/60 bg-card/40 p-4 text-center backdrop-blur-xl">
      <div className="mx-auto mb-3 flex justify-center">
        <AIOrb size={84} state={state} />
      </div>
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mint">
        {state === "idle" ? "Agent" : "Agent · " + state}
      </div>
      <div className="mt-1 text-xs font-medium">{label}</div>
      <Link
        to="/dashboard/ai"
        className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background transition-transform hover:scale-[1.02]"
      >
        Open Command
      </Link>
    </div>
  );
}
