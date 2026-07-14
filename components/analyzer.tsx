"use client";

import { useState } from "react";

type Result = {
  summary: string;
  content_gaps: {
    topic: string;
    customer_need: string;
    missing_content: string;
  }[];
  next_best_actions: { action: string; priority: "high" | "medium" | "low" }[];
};

type AnalysisRow = {
  input_text: string;
  result: Result;
  created_at: string;
};

const priorityColor = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-700",
};

export default function Analyzer({
  role,
  initial,
}: {
  role: string;
  initial: AnalysisRow | null;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(initial?.result ?? null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(
    initial?.created_at ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isManager = role === "general_manager";

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
      setResult(data);
      setUpdatedAt(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {isManager ? (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a customer review, sales-call transcript, or competitor page text..."
            className="h-40 w-full rounded border p-3"
          />
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Run analysis"}
          </button>
        </div>
      ) : (
        <p className="rounded border border-dashed p-4 text-gray-500">
          View-only access. Showing the latest intelligence from your General
          Manager.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          The AI is analyzing...
        </div>
      )}

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {!result && !loading && (
        <p className="text-gray-500">
          {isManager
            ? "Run an analysis to generate intelligence."
            : "No analysis available yet. Check back once a manager has run one."}
        </p>
      )}

      {result && (
        <div className="space-y-6">
          {updatedAt && (
            <p className="text-xs text-gray-400">
              Last updated {new Date(updatedAt).toLocaleString()}
            </p>
          )}

          <section>
            <h2 className="text-lg font-medium">Summary</h2>
            <p className="mt-1 text-gray-700">{result.summary}</p>
          </section>

          <section>
            <h2 className="text-lg font-medium">Content gaps</h2>
            <ul className="mt-2 space-y-2">
              {result.content_gaps.map((g, i) => (
                <li key={i} className="rounded border p-3">
                  <p className="font-medium">{g.topic}</p>
                  <p className="text-sm text-gray-600">
                    Buyers want: {g.customer_need}
                  </p>
                  <p className="text-sm text-gray-600">
                    Missing: {g.missing_content}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium">Next best actions</h2>
            <ul className="mt-2 space-y-2">
              {result.next_best_actions.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <span>{a.action}</span>
                  <span
                    className={`rounded px-2 py-1 text-xs ${priorityColor[a.priority]}`}
                  >
                    {a.priority}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
