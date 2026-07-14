"use client";

import { useEffect, useState } from "react";

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function useCountUp(
  target: number,
  duration = 700,
  enabled = true,
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    setValue(0);
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}

export function Shimmer({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`shimmer rounded-xl ${className}`} style={style} />
  );
}

export function TrendUpIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5 15 9l4.5 4.5L19.5 13.5"
      />
    </svg>
  );
}

export function MetricSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-pulse">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="mt-3 h-9 w-16" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-pulse">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="mt-2 h-3 w-48" />
      </div>
      <div className="mt-6 flex h-44 items-end justify-between gap-3 px-2">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <Shimmer
            key={i}
            className="w-full rounded-t-lg"
            style={{ height: `${h}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function InsightSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-pulse">
        <Shimmer className="h-4 w-36" />
        <div className="mt-4 space-y-3">
          <Shimmer className="h-16 w-full" />
          <Shimmer className="h-16 w-full" />
          <Shimmer className="h-16 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

export function SparklesIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

export function BoltIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6Z" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export function EyeIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export function EyeOffIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

const NETWORK_NODES = [
  { id: "crm", label: "CRM Data", x: 14, y: 26 },
  { id: "market", label: "Market Intel", x: 47, y: 12 },
  { id: "ai", label: "AI Engine", x: 80, y: 22 },
  { id: "lead", label: "Lead Signals", x: 21, y: 48 },
  { id: "content", label: "Content Gap", x: 55, y: 55 },
  { id: "reports", label: "Reports", x: 85, y: 63 },
  { id: "analytics", label: "Analytics", x: 16, y: 71 },
  { id: "actions", label: "Next Actions", x: 47, y: 80 },
] as const;

const NETWORK_EDGES: Array<[string, string]> = [
  ["crm", "market"],
  ["market", "ai"],
  ["market", "content"],
  ["ai", "content"],
  ["lead", "content"],
  ["lead", "analytics"],
  ["content", "reports"],
  ["content", "actions"],
  ["analytics", "actions"],
  ["actions", "reports"],
];

/**
 * Ambient network visualization: static nodes connected by dashed lines,
 * with small glowing dots that travel between them on a loop.
 * Durations/delays are derived from index (not Math.random) to stay
 * identical between server and client render and avoid hydration mismatches.
 */
export function NetworkAnimation({ className = "" }: { className?: string }) {
  const findNode = (id: string) => NETWORK_NODES.find((n) => n.id === id)!;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {NETWORK_EDGES.map(([a, b], i) => {
          const from = findNode(a);
          const to = findNode(b);
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(56,189,248,0.25)"
              strokeWidth={0.25}
              strokeDasharray="1.5 1.5"
            />
          );
        })}
      </svg>

      {NETWORK_EDGES.map(([a, b], i) => {
        const from = findNode(a);
        const to = findNode(b);
        const duration = 3.2 + (i % 4) * 0.9;
        const delay = (i * 0.55) % 3.2;
        return (
          <span
            key={`dot-${i}`}
            className="network-dot"
            style={
              {
                "--x1": `${from.x}%`,
                "--y1": `${from.y}%`,
                "--x2": `${to.x}%`,
                "--y2": `${to.y}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {NETWORK_NODES.map((n, i) => (
        <div
          key={n.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="network-node" style={{ animationDelay: `${i * 0.3}s` }} />
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
            {n.label}
          </span>
        </div>
      ))}

      <style jsx>{`
        .network-node {
          position: relative;
          display: block;
          height: 10px;
          width: 10px;
          border-radius: 9999px;
          background: #22d3ee;
          box-shadow:
            0 0 0 3px rgba(34, 211, 238, 0.15),
            0 0 14px 3px rgba(34, 211, 238, 0.6);
          animation: node-pulse 2.6s ease-in-out infinite;
        }
        .network-dot {
          position: absolute;
          left: var(--x1);
          top: var(--y1);
          height: 5px;
          width: 5px;
          border-radius: 9999px;
          background: #a5f3fc;
          box-shadow: 0 0 8px 2px rgba(165, 243, 252, 0.9);
          opacity: 0;
          transform: translate(-50%, -50%);
          animation-name: travel;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes node-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 3px rgba(34, 211, 238, 0.15),
              0 0 14px 3px rgba(34, 211, 238, 0.6);
          }
          50% {
            transform: scale(1.25);
            box-shadow:
              0 0 0 6px rgba(34, 211, 238, 0.08),
              0 0 20px 6px rgba(34, 211, 238, 0.85);
          }
        }
        @keyframes travel {
          0% {
            left: var(--x1);
            top: var(--y1);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            left: var(--x2);
            top: var(--y2);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .network-node,
          .network-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}