import { Activity, Gauge, History, Sparkles, TerminalSquare, Wrench } from "lucide-react";
import ChatWindow from "../components/ChatWindow";

const toolStack = [
  { name: "Reasoner", status: "Active" },
  { name: "Retriever", status: "Standby" },
  { name: "Planner", status: "Active" },
];

const historyItems = [
  "Mission brief generated",
  "Metrics analysis completed",
  "Agent workflow optimized",
];

export default function Dashboard() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#0F172A] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#1E293B] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#334155] blur-3xl" />
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-4 md:grid-rows-[auto_auto] md:gap-6 md:p-8">
        <header className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur-2xl md:col-span-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                <Sparkles size={13} />
                Grokchat Neural Deck
              </p>
              <h1 className="text-xl font-semibold md:text-3xl">Premium Agentic Dashboard</h1>
            </div>
            <div className="hidden rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 md:block">
              React 19 + Tailwind 4
            </div>
          </div>
        </header>

        <section className="order-2 rounded-3xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl md:order-1 md:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
            <History size={16} /> Chat History
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {historyItems.map((item) => (
              <li key={item} className="rounded-xl bg-white/5 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="order-1 min-h-[60vh] md:order-2 md:col-span-2 md:row-span-2">
          <ChatWindow />
        </section>

        <section className="order-3 rounded-3xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl md:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
            <Wrench size={16} /> Active Tools
          </h3>
          <div className="space-y-2">
            {toolStack.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span>{tool.name}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    tool.status === "Active"
                      ? "bg-emerald-400/20 text-emerald-200"
                      : "bg-amber-400/20 text-amber-200"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="order-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl md:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
            <Activity size={16} /> System Status
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[{ label: "Latency", value: "128ms", icon: Gauge }, { label: "Context", value: "98%", icon: TerminalSquare }, { label: "Uptime", value: "99.99%", icon: Activity }].map(({ label, value, icon: Icon }) => (
              <article key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <Icon size={13} />
                  {label}
                </div>
                <p className="text-lg font-semibold text-cyan-100">{value}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
