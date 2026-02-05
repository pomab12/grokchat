import { AnimatePresence, motion } from "framer-motion";
import { Bot, SendHorizonal, Sparkles, UserRound, Wrench } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

type ChartPoint = {
  label: string;
  value: number;
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function TypingText({ content }: { content: string }) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
    if (!content) return;

    let active = true;
    const tick = () => {
      if (!active) return;
      setVisibleLength((prev) => {
        if (prev >= content.length) return content.length;
        const burst = 1 + Math.floor(Math.random() * 3);
        return Math.min(content.length, prev + burst);
      });
    };

    const timer = setInterval(tick, 22 + Math.floor(Math.random() * 90));

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [content]);

  return <p className="leading-relaxed whitespace-pre-wrap">{content.slice(0, visibleLength)}</p>;
}

function parseStructuredContent(content: string): { list: string[]; chart: ChartPoint[] } {
  const trimmed = content.trim();

  try {
    const json = JSON.parse(trimmed) as { items?: string[]; chart?: ChartPoint[] };
    return {
      list: Array.isArray(json.items) ? json.items : [],
      chart: Array.isArray(json.chart) ? json.chart : [],
    };
  } catch {
    const list = trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- ") || /^\d+\.\s/.test(line))
      .map((line) => line.replace(/^(-\s|\d+\.\s)/, ""));

    return { list, chart: [] };
  }
}

function AssistantPayload({ content }: { content: string }) {
  const { list, chart } = useMemo(() => parseStructuredContent(content), [content]);

  if (!list.length && !chart.length) {
    return <TypingText content={content} />;
  }

  return (
    <div className="space-y-4">
      <TypingText content={content} />

      {!!list.length && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h5 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-300">
            <Sparkles size={14} className="text-cyan-300" />
            Insight List
          </h5>
          <ul className="space-y-2">
            {list.map((item) => (
              <li key={item} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!chart.length && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-300">Signal Chart</h5>
          <div className="space-y-2">
            {chart.map((point) => (
              <div key={point.label} className="grid grid-cols-[1fr_3fr_auto] items-center gap-2 text-xs">
                <span className="text-slate-300">{point.label}</span>
                <div className="h-2 rounded-full bg-slate-800">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, point.value))}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="text-slate-200">{point.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThinkingShimmer() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="h-3 w-20 rounded-full bg-slate-800 text-[10px] uppercase tracking-widest text-slate-400" />
      <div className="mt-4 space-y-2">
        {["w-5/6", "w-full", "w-4/6"].map((width) => (
          <div
            key={width}
            className={`h-3 ${width} overflow-hidden rounded-full bg-slate-800 relative`}
          >
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent"
              animate={{ x: ["-120%", "350%"] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.1, ease: "linear" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const message = input.trim();
    if (!message || isThinking) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: message,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = (await response.json()) as { reply: string };

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: data.reply,
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 md:text-xl">Agent Console</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Realtime orchestration</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
          Online
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`max-w-[88%] rounded-2xl border border-white/10 p-4 ${
                msg.role === "user"
                  ? "ml-auto bg-blue-500/20 text-slate-100"
                  : "bg-slate-950/70 text-slate-200"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                {msg.role === "user" ? <UserRound size={13} /> : <Bot size={13} />}
                {msg.role}
              </div>
              {msg.role === "assistant" ? (
                <AssistantPayload content={msg.content} />
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && <ThinkingShimmer />}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="prompt-input">
          Message the AI
        </label>
        <input
          id="prompt-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the agent to analyze, plan, or execute..."
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-cyan-300/40 transition focus:ring"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/50 bg-cyan-400/20 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <SendHorizonal size={16} />
          Send
        </button>
      </form>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Wrench size={12} />
        Structured payloads render as cards and charts automatically.
      </div>
    </div>
  );
}
