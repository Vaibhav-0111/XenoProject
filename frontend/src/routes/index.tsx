import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, BarChart3, Users, MessageSquare, Brain } from "lucide-react";
import { AIOrb } from "@/components/AIOrb";
import { AmbientGlow } from "@/components/AmbientGlow";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Magnetic } from "@/components/motion/Magnetic";
import { MotionCard } from "@/components/motion/MotionCard";
import { Particles } from "@/components/Particles";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XenoReach AI — Marketing Intelligence, Powered by AI" },
      {
        name: "description",
        content:
          "AI-native CRM for customer engagement, audience intelligence, and automated marketing campaigns.",
      },
      { property: "og:title", content: "XenoReach AI" },
      { property: "og:description", content: "Marketing Intelligence, Powered by AI" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Nav */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 z-50 w-full"
      >
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass-strong px-6 py-3">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-aurora animate-aurora"
            >
              <Sparkles className="h-4 w-4 text-background" />
            </motion.div>
            <span className="font-display text-lg font-semibold tracking-tight">XenoReach</span>
            <span className="ml-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              AI
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {[
              { href: "#features", label: "Features" },
              { href: "#intelligence", label: "Intelligence" },
              { href: "#analytics", label: "Analytics" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="group relative transition-colors hover:text-foreground">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Launch
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-32">
        <AmbientGlow />
        <div className="absolute inset-0 bg-grid opacity-40" style={{
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }} />
        <Particles count={60} />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            New · Autonomous Marketing Agent
          </motion.div>

          <AnimatedHeadline
            delay={0.15}
            className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.035em]"
          >
            {"Marketing intelligence,"}
            <br />
            <span className="font-serif italic font-normal text-gradient">re-imagined</span>{" "}
            <span className="text-muted-foreground/80">for AI.</span>
          </AnimatedHeadline>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-muted-foreground"
          >
            Segment customers, generate campaigns, and orchestrate delivery across channels —
            through a marketing operating system that reasons, drafts, and ships on its own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic strength={10}>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_oklch(0.72_0.16_270_/_0.7)] transition-transform hover:scale-[1.02]"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={8}>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-sm text-foreground/90 transition-colors hover:border-foreground/40"
              >
                See how it works
              </a>
            </Magnetic>
          </motion.div>

          {/* Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative mx-auto mt-20 flex items-center justify-center"
          >
            <AIOrb size={320} state="thinking" />
            {/* Floating panels */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { delay: 0.6, duration: 0.5 }, scale: { type: "spring", stiffness: 300, damping: 20 } }}
              className="absolute -left-8 top-12 hidden w-56 rounded-xl glass-strong p-4 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.72_0.16_270/0.6)] md:block"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Segment</div>
              <div className="mt-1 text-sm font-medium">High-value dormant</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full bg-aurora animate-aurora glow-primary"
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">2,847 customers</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }, opacity: { delay: 0.75, duration: 0.5 }, scale: { type: "spring", stiffness: 300, damping: 20 } }}
              className="absolute -right-4 top-4 hidden w-52 rounded-xl glass-strong p-4 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.78_0.14_220/0.6)] md:block"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-cyan" />
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Recommends</div>
              </div>
              <div className="mt-1.5 text-sm font-medium">WhatsApp · 74% open rate</div>
              <div className="mt-1 text-xs text-muted-foreground">+₹42K predicted lift</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }, opacity: { delay: 0.9, duration: 0.5 }, scale: { type: "spring", stiffness: 300, damping: 20 } }}
              className="absolute -bottom-2 right-10 hidden w-44 rounded-xl glass-strong p-3 text-left transition-shadow hover:shadow-[0_12px_40px_-12px_oklch(0.82_0.16_180/0.6)] lg:block"
            >
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Live</div>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="mt-1 text-sm font-medium">12,439 delivered</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} className="bg-background/60 p-6 text-center backdrop-blur-sm sm:p-8">
                  <div className="font-display text-3xl font-medium tracking-[-0.02em] text-gradient sm:text-4xl">
                    <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-mint">— The Platform</div>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
              An operating system for{" "}
              <span className="font-serif italic font-normal text-gradient">modern</span> marketing teams.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <MotionCard className="h-full rounded-none border-0 bg-background p-8 hover:bg-card/60" lift={false}>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-6 bg-mint/60 transition-all duration-300 group-hover:w-10 group-hover:bg-cyan" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mint">
                      0{i + 1}
                    </span>
                  </div>
                  <motion.div
                    whileHover={{ rotate: -6, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mt-6 grid h-9 w-9 place-items-center rounded-lg bg-secondary/70 text-foreground/90"
                  >
                    <f.icon className="h-4 w-4" />
                  </motion.div>
                  <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </MotionCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence band */}
      <section id="intelligence" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl rounded-3xl glass-strong p-10 md:p-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Reveal direction="right">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-mint">— AI Agent</div>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                Tell it a goal.
                <br />
                <span className="font-serif italic font-normal text-gradient">Watch</span> it work.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground leading-relaxed">
                "Increase revenue from inactive users." The agent builds the segment, drafts the
                campaign, picks the channel, and predicts the lift — in seconds.
              </p>
              <Magnetic strength={8} className="mt-8 inline-block">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
                >
                  Try the Agent <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
            </Reveal>
            <div className="space-y-2">
              {AGENT_STEPS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                  className="flex items-center gap-3 rounded-xl glass px-4 py-3 transition-shadow hover:shadow-[0_8px_24px_-12px_oklch(0.72_0.16_270/0.5)]"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-aurora animate-aurora text-[11px] font-semibold text-background"
                  >
                    {i + 1}
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.detail}</div>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="grid h-6 w-6 place-items-center rounded-md bg-aurora animate-aurora"
            >
              <Sparkles className="h-3 w-3 text-background" />
            </motion.div>
            <span>XenoReach AI © 2026</span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((label) => (
              <a key={label} href="#" className="group relative hover:text-foreground">
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

const STATS = [
  { label: "Messages delivered", value: 128400, suffix: "+" },
  { label: "Avg. open rate lift", value: 32, suffix: "%" },
  { label: "Campaigns automated", value: 4200, suffix: "+" },
  { label: "Channels supported", value: 4 },
];

const FEATURES = [
  {
    icon: Users,
    title: "Customer Intelligence",
    desc: "Unified profiles with spend patterns, engagement history, and AI-derived signals.",
  },
  {
    icon: Brain,
    title: "Natural-Language Segments",
    desc: "Describe your audience in plain English. The AI compiles it into precise rules.",
  },
  {
    icon: MessageSquare,
    title: "Generative Campaigns",
    desc: "Auto-write subject lines, body copy and CTAs tuned to each segment's behavior.",
  },
  {
    icon: Zap,
    title: "Channel Simulator",
    desc: "Production-grade delivery pipeline with realistic open, click and read events.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    desc: "Forecast revenue lift, open rates, and cohort behavior before you press send.",
  },
  {
    icon: Sparkles,
    title: "Autonomous Agent",
    desc: "Goal-to-execution loop. The agent reasons end-to-end across the entire stack.",
  },
];

const AGENT_STEPS = [
  { label: "Analyze inactive cohort", detail: "Identified 2,847 dormant high-value customers" },
  { label: "Draft win-back message", detail: "Personalized offers with 15% discount + free shipping" },
  { label: "Select channel", detail: "WhatsApp — 74% predicted open rate" },
  { label: "Forecast outcome", detail: "+₹42,400 expected revenue lift" },
];
