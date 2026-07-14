"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartSkeleton,
  FadeIn,
  InsightSkeleton,
  LockIcon,
  MetricSkeleton,
  Shimmer,
  SparklesIcon,
  TrendUpIcon,
  useCountUp,
} from "@/components/ui/animations";

type SalesBrief = {
  talking_points: string[];
  objections: { objection: string; response: string }[];
  buyer_questions: string[];
};

type Result = {
  summary: string;
  content_gaps: {
    topic: string;
    customer_need: string;
    missing_content: string;
  }[];
  next_best_actions: { action: string; priority: "high" | "medium" | "low" }[];
  sales_brief?: SalesBrief;
};

type AnalysisRow = {
  id: string;
  input_text: string;
  result: Result;
  created_at: string;
};

const priorityColor = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

const priorityLabel = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const impactLabel = {
  high: "Customer Conversion",
  medium: "Engagement Lift",
  low: "Brand Awareness",
};

const PIE_COLORS = ["#ef4444", "#f59e0b", "#94a3b8"];

const LOADING_MESSAGES = [
  "Analyzing customer feedback...",
  "Identifying content gaps...",
  "Generating AI recommendations...",
  "Building sales intelligence...",
];

function gapPriority(index: number): "high" | "medium" | "low" {
  if (index === 0) return "high";
  if (index === 1) return "medium";
  return "low";
}

function Card({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-md transition-all duration-300 ease-out ${
        hover
          ? "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Ensures at least 2 points so the sparkline has something to draw. */
function padSeries(data: number[]): number[] {
  if (data.length === 0) return [0, 0];
  if (data.length === 1) return [data[0], data[0]];
  return data;
}

function TrendIndicator({
  tone,
  text,
}: {
  tone: "positive" | "warning" | "neutral";
  text: string;
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : "text-gray-400";

  return (
    <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${toneClass}`}>
      {tone !== "neutral" && <TrendUpIcon className="h-3 w-3" />}
      {text}
    </p>
  );
}

function MetricCard({
  label,
  value,
  icon,
  iconBg,
  color,
  data,
  trendText,
  trendTone = "neutral",
  delay = 0,
  animate = true,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  color: string;
  data: number[];
  trendText: string;
  trendTone?: "positive" | "warning" | "neutral";
  delay?: number;
  animate?: boolean;
}) {
  const display = useCountUp(value, 700, animate);
  const sparkData = useMemo(
    () => padSeries(data).map((v, i) => ({ i, v })),
    [data],
  );
  const gradientId = `spark-${slugify(label)}`;

  return (
    <FadeIn delay={delay}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {label}
            </p>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}
            >
              {icon}
            </div>
          </div>
          <p className="mt-2 text-4xl font-bold tabular-nums text-gray-900">
            {display}
          </p>
          <TrendIndicator tone={trendTone} text={trendText} />
        </div>
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </FadeIn>
  );
}

function Empty({ message = "None identified for this analysis." }) {
  return (
    <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-400">{message}</p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
  );
}

function AnalysisLoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <FadeIn>
        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-soft rounded-full bg-indigo-100" />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                <SparklesIcon className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                AI Intelligence Engine
              </p>
              <p
                key={messageIndex}
                className="mt-0.5 animate-fade-in text-sm text-gray-500"
              >
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          </div>
        </Card>
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricSkeleton delay={80} />
        <MetricSkeleton delay={140} />
        <MetricSkeleton delay={200} />
        <MetricSkeleton delay={260} />
      </div>

      <ChartSkeleton delay={320} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightSkeleton delay={400} />
        <InsightSkeleton delay={480} />
      </div>
    </div>
  );
}

function ActivityIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12h4.5l2.25-7.5 3 15 2.25-7.5h7.5"
      />
    </svg>
  );
}

export default function Analyzer({
  role,
  history,
}: {
  role: string;
  history: AnalysisRow[];
}) {
  const [historyList, setHistoryList] = useState<AnalysisRow[]>(history);
  const [selectedId, setSelectedId] = useState<string | null>(
    history[0]?.id ?? null,
  );
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartKey, setChartKey] = useState(0);

  const isManager = role === "general_manager";
  const selected = historyList.find((h) => h.id === selectedId) ?? null;
  const result = loading ? null : selected?.result ?? null;

  const gapChartData =
    result?.content_gaps.map((g, i) => ({
      name: g.topic.length > 18 ? `${g.topic.slice(0, 18)}…` : g.topic,
      value: 1,
      priority: gapPriority(i),
    })) ?? [];

  const actionChartData = ["high", "medium", "low"].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value:
      result?.next_best_actions.filter((a) => a.priority === p).length ?? 0,
  }));

  const highPriorityCount =
    result?.next_best_actions.filter((a) => a.priority === "high").length ?? 0;

  // Chronological (oldest -> newest) view of history, capped for readable sparklines
  const chronological = useMemo(
    () => [...historyList].reverse(),
    [historyList],
  );
  const recentChrono = useMemo(
    () => chronological.slice(-12),
    [chronological],
  );

  const contentGapsSeries = useMemo(
    () => recentChrono.map((h) => h.result.content_gaps.length),
    [recentChrono],
  );
  const highPrioritySeries = useMemo(
    () =>
      recentChrono.map(
        (h) =>
          h.result.next_best_actions.filter((a) => a.priority === "high")
            .length,
      ),
    [recentChrono],
  );
  const cumulativeReportsSeries = useMemo(
    () => chronological.map((_, i) => i + 1).slice(-12),
    [chronological],
  );
  const talkingPointsSeries = useMemo(
    () =>
      recentChrono.map((h) => h.result.sales_brief?.talking_points.length ?? 0),
    [recentChrono],
  );
  const objectionsSeries = useMemo(
    () => recentChrono.map((h) => h.result.sales_brief?.objections.length ?? 0),
    [recentChrono],
  );
  const buyerQuestionsSeries = useMemo(
    () =>
      recentChrono.map(
        (h) => h.result.sales_brief?.buyer_questions.length ?? 0,
      ),
    [recentChrono],
  );

  // Real daily bucket for the last 7 days (today included)
  const thisWeekSeries = useMemo(() => {
    const days: number[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const key = day.toDateString();
      const count = historyList.filter(
        (h) => new Date(h.created_at).toDateString() === key,
      ).length;
      days.push(count);
    }
    return days;
  }, [historyList]);
  const thisWeekTotal = thisWeekSeries.reduce((a, b) => a + b, 0);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      const newRow: AnalysisRow = {
        id: crypto.randomUUID(),
        input_text: text,
        result: data,
        created_at: new Date().toISOString(),
      };
      setHistoryList((prev) => [newRow, ...prev]);
      setSelectedId(newRow.id);
      setChartKey((k) => k + 1);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectReport(id: string) {
    setSelectedId(id);
    setChartKey((k) => k + 1);
  }

  return (
    <div className="space-y-8">
      {isManager ? (
        <FadeIn>
          <Card
            hover={false}
            className="animate-highlight-ring bg-gradient-to-br from-blue-50/80 to-indigo-50/60"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Data Ingestion
            </p>
            <SectionTitle>Run Analysis</SectionTitle>
            <p className="mt-1 text-sm text-gray-600">
              Paste customer reviews, call transcripts, or competitor content to
              generate intelligence.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a customer review, sales-call transcript, or competitor page text..."
              disabled={loading}
              className="mt-4 h-36 w-full resize-none rounded-xl bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
            <button
              onClick={analyze}
              disabled={loading || !text.trim()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Analyze Intelligence
                </>
              )}
            </button>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn>
          <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <LockIcon />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Sales Brief
                  </p>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    View Only Mode
                  </span>
                </div>
                <SectionTitle>Buyer Conversation Guide</SectionTitle>
                <p className="mt-2 text-sm text-gray-600">
                  You have read-only access to the latest AI-generated guidance
                  from your General Manager. Select a report below to view
                  talking points and objection handling.
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {loading && <AnalysisLoadingState />}

      {error && (
        <FadeIn>
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        </FadeIn>
      )}

      {result && !loading && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isManager ? (
              <>
                <MetricCard
                  label="Content Gaps"
                  value={result.content_gaps.length}
                  data={contentGapsSeries}
                  iconBg="bg-red-100 text-red-600"
                  color="#ef4444"
                  trendText="Trend across recent reports"
                  trendTone="neutral"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                      />
                    </svg>
                  }
                  delay={80}
                />
                <MetricCard
                  label="High Priority"
                  value={highPriorityCount}
                  data={highPrioritySeries}
                  iconBg="bg-amber-100 text-amber-600"
                  color="#f59e0b"
                  trendText={highPriorityCount > 0 ? "Action needed" : "All clear"}
                  trendTone={highPriorityCount > 0 ? "warning" : "positive"}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                      />
                    </svg>
                  }
                  delay={140}
                />
                <MetricCard
                  label="Total Reports"
                  value={historyList.length}
                  data={cumulativeReportsSeries}
                  iconBg="bg-blue-100 text-blue-600"
                  color="#3b82f6"
                  trendText="All time"
                  trendTone="neutral"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  }
                  delay={200}
                />
                <MetricCard
                  label="This Week"
                  value={thisWeekTotal}
                  data={thisWeekSeries}
                  iconBg="bg-violet-100 text-violet-600"
                  color="#8b5cf6"
                  trendText={
                    thisWeekTotal > 0
                      ? `${thisWeekTotal} in last 7 days`
                      : "No runs yet this week"
                  }
                  trendTone={thisWeekTotal > 0 ? "positive" : "neutral"}
                  icon={<ActivityIcon className="h-5 w-5" />}
                  delay={260}
                />
              </>
            ) : (
              <>
                <MetricCard
                  label="Talking Points"
                  value={result.sales_brief?.talking_points.length ?? 0}
                  data={talkingPointsSeries}
                  iconBg="bg-blue-100 text-blue-600"
                  color="#3b82f6"
                  trendText="Trend across recent briefs"
                  trendTone="neutral"
                  icon={<SparklesIcon />}
                  delay={80}
                />
                <MetricCard
                  label="Objections"
                  value={result.sales_brief?.objections.length ?? 0}
                  data={objectionsSeries}
                  iconBg="bg-amber-100 text-amber-600"
                  color="#f59e0b"
                  trendText="Prepared responses"
                  trendTone="neutral"
                  icon={<LockIcon />}
                  delay={140}
                />
                <MetricCard
                  label="Buyer Questions"
                  value={result.sales_brief?.buyer_questions.length ?? 0}
                  data={buyerQuestionsSeries}
                  iconBg="bg-indigo-100 text-indigo-600"
                  color="#6366f1"
                  trendText="Common asks"
                  trendTone="neutral"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                      />
                    </svg>
                  }
                  delay={200}
                />
                <MetricCard
                  label="Reports Available"
                  value={historyList.length}
                  data={cumulativeReportsSeries}
                  iconBg="bg-blue-100 text-blue-600"
                  color="#3b82f6"
                  trendText="Visible to you"
                  trendTone="neutral"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  }
                  delay={260}
                />
              </>
            )}
          </div>

          <FadeIn delay={320}>
            <Card>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
                Overview
              </p>
              <SectionTitle>Summary</SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {result.summary || "No summary available."}
              </p>
              {isManager && gapChartData.length > 0 && (
                <div key={`overview-${chartKey}`} className="mt-6 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gapChartData} barCategoryGap="20%">
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a5b4fc" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f3f4f6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        isAnimationActive
                        animationDuration={900}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </FadeIn>

          {isManager ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={400}>
                <Card>
                  <SectionTitle>Content Gaps</SectionTitle>
                  <p className="mt-1 text-xs text-gray-500">
                    AI-detected opportunities ranked by priority
                  </p>
                  {result.content_gaps.length ? (
                    <>
                      {gapChartData.length > 0 && (
                        <div key={`gaps-${chartKey}`} className="mt-4 h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={gapChartData}
                              layout="vertical"
                              barCategoryGap="25%"
                            >
                              <defs>
                                <linearGradient
                                  id="hBarGradient"
                                  x1="0"
                                  y1="0"
                                  x2="1"
                                  y2="0"
                                >
                                  <stop offset="0%" stopColor="#818cf8" />
                                  <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                                horizontal={false}
                              />
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                tick={{ fontSize: 11, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: "12px",
                                  border: "none",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                }}
                              />
                              <Bar
                                dataKey="value"
                                fill="url(#hBarGradient)"
                                radius={[0, 8, 8, 0]}
                                isAnimationActive
                                animationDuration={800}
                                animationEasing="ease-out"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                      <div className="mt-4 space-y-3">
                        {result.content_gaps.map((g, i) => {
                          const priority = gapPriority(i);
                          return (
                            <FadeIn key={i} delay={480 + i * 60}>
                              <div className="rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-indigo-50/50">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-gray-900">
                                    {g.topic}
                                  </p>
                                  <span
                                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor[priority]}`}
                                  >
                                    {priorityLabel[priority]}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                  Buyers want: {g.customer_need}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Missing: {g.missing_content}
                                </p>
                              </div>
                            </FadeIn>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="mt-3">
                      <Empty />
                    </div>
                  )}
                </Card>
              </FadeIn>

              <FadeIn delay={480}>
                <Card>
                  <SectionTitle>Next Best Actions</SectionTitle>
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended actions ranked by business impact
                  </p>
                  {result.next_best_actions.length ? (
                    <>
                      <div key={`pie-${chartKey}`} className="mt-4 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={actionChartData.filter((d) => d.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                              isAnimationActive
                              animationDuration={1000}
                              animationEasing="ease-out"
                            >
                              {actionChartData.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Legend
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{
                                fontSize: "12px",
                                color: "#6b7280",
                              }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {result.next_best_actions.map((a, i) => (
                          <FadeIn key={i} delay={560 + i * 50}>
                            <li className="flex gap-3 rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100/80">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-600">
                                {i + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {a.action}
                                </p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor[a.priority]}`}
                                  >
                                    {priorityLabel[a.priority]}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Impact: {impactLabel[a.priority]}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </FadeIn>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="mt-3">
                      <Empty />
                    </div>
                  )}
                </Card>
              </FadeIn>
            </div>
          ) : result.sales_brief ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={400}>
                <Card>
                  <SectionTitle>Talking Points</SectionTitle>
                  {result.sales_brief.talking_points.length ? (
                    <ul className="mt-4 space-y-2">
                      {result.sales_brief.talking_points.map((p, i) => (
                        <FadeIn key={i} delay={460 + i * 40}>
                          <li className="flex gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 transition-all duration-300 hover:bg-blue-50/50">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                              {i + 1}
                            </span>
                            {p}
                          </li>
                        </FadeIn>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3">
                      <Empty />
                    </div>
                  )}
                </Card>
              </FadeIn>

              <FadeIn delay={480}>
                <Card>
                  <SectionTitle>Objections to Prepare For</SectionTitle>
                  {result.sales_brief.objections.length ? (
                    <div className="mt-4 space-y-3">
                      {result.sales_brief.objections.map((o, i) => (
                        <FadeIn key={i} delay={520 + i * 40}>
                          <div className="rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-amber-50/50">
                            <p className="font-medium text-gray-900">
                              &ldquo;{o.objection}&rdquo;
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {o.response}
                            </p>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Empty />
                    </div>
                  )}
                </Card>
              </FadeIn>

              <FadeIn delay={560} className="lg:col-span-2">
                <Card>
                  <SectionTitle>Questions Buyers Are Asking</SectionTitle>
                  {result.sales_brief.buyer_questions.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {result.sales_brief.buyer_questions.map((q, i) => (
                        <FadeIn key={i} delay={600 + i * 30}>
                          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 transition-all duration-300 hover:bg-indigo-50/50">
                            {q}
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Empty />
                    </div>
                  )}
                </Card>
              </FadeIn>
            </div>
          ) : (
            <FadeIn delay={400}>
              <Card>
                <p className="text-sm text-gray-500">
                  This analysis predates the sales brief feature. Ask a manager
                  to run a new analysis to generate one.
                </p>
              </Card>
            </FadeIn>
          )}
        </>
      )}

      {!result && !loading && (
        <FadeIn delay={160}>
          <Card hover={false}>
            <p className="text-sm text-gray-500">
              {isManager
                ? "Run an analysis to generate intelligence."
                : "No analysis available yet. Check back once a manager has run one."}
            </p>
          </Card>
        </FadeIn>
      )}

      {historyList.length > 0 && !loading && (
        <FadeIn delay={result ? 640 : 240}>
          <Card>
            <SectionTitle>History</SectionTitle>
            <p className="mt-1 text-sm text-gray-500">Past reports</p>
            <ul className="mt-4 space-y-2">
              {historyList.map((h, i) => (
                <li key={h.id}>
                  <button
                    onClick={() => selectReport(h.id)}
                    className={`flex w-full flex-col items-start gap-1 rounded-xl p-4 text-left transition-all duration-300 ${
                      h.id === selectedId
                        ? "bg-indigo-50 shadow-sm ring-1 ring-indigo-100"
                        : "bg-gray-50 hover:bg-gray-100/80 hover:shadow-sm"
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <span className="text-xs text-gray-400">
                      {new Date(h.created_at).toLocaleString()}
                    </span>
                    <span className="line-clamp-1 text-sm text-gray-700">
                      {h.input_text.slice(0, 80)}
                      {h.input_text.length > 80 ? "…" : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}