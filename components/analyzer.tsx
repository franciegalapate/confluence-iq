"use client";

import { useState } from "react";

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
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-700",
};

const cardClass = "flex h-full flex-col gap-1 rounded border p-3";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Empty() {
  return (
    <p className="rounded border border-dashed p-3 text-sm text-gray-400">
      None identified for this analysis.
    </p>
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

  const isManager = role === "general_manager";
  const selected = historyList.find((h) => h.id === selectedId) ?? null;
  const result = selected?.result ?? null;

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
      setText("");
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
          Sales brief — the latest guidance from your General Manager for buyer
          conversations.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          The AI is analyzing...
        </div>
      )}

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {historyList.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-gray-500">Past reports</h2>
          <ul className="mt-2 divide-y rounded border">
            {historyList.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => setSelectedId(h.id)}
                  className={`flex w-full flex-col items-start gap-0.5 p-3 text-left hover:bg-gray-50 ${
                    h.id === selectedId ? "bg-gray-50" : ""
                  }`}
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
        </section>
      )}

      {!result && !loading && (
        <p className="text-gray-500">
          {isManager
            ? "Run an analysis to generate intelligence."
            : "No analysis available yet. Check back once a manager has run one."}
        </p>
      )}

      {result && (
        <div className="space-y-6">
          <Section title="Summary">
            <div className="min-h-[72px] rounded border p-3 text-gray-700">
              {result.summary || (
                <span className="text-gray-400">No summary.</span>
              )}
            </div>
          </Section>

          {isManager ? (
            <>
              <Section title="Content gaps">
                {result.content_gaps.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {result.content_gaps.map((g, i) => (
                      <div key={i} className={cardClass}>
                        <p className="font-medium">{g.topic}</p>
                        <p className="text-sm text-gray-600">
                          Buyers want: {g.customer_need}
                        </p>
                        <p className="text-sm text-gray-600">
                          Missing: {g.missing_content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty />
                )}
              </Section>

              <Section title="Next best actions">
                {result.next_best_actions.length ? (
                  <ul className="space-y-2">
                    {result.next_best_actions.map((a, i) => (
                      <li
                        key={i}
                        className="flex min-h-[52px] items-center justify-between rounded border p-3"
                      >
                        <span>{a.action}</span>
                        <span
                          className={`shrink-0 rounded px-2 py-1 text-xs ${priorityColor[a.priority]}`}
                        >
                          {a.priority}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty />
                )}
              </Section>
            </>
          ) : result.sales_brief ? (
            <>
              <Section title="Talking points">
                {result.sales_brief.talking_points.length ? (
                  <ul className="list-disc space-y-1 rounded border p-3 pl-8 text-gray-700">
                    {result.sales_brief.talking_points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <Empty />
                )}
              </Section>

              <Section title="Objections to prepare for">
                {result.sales_brief.objections.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {result.sales_brief.objections.map((o, i) => (
                      <div key={i} className={cardClass}>
                        <p className="font-medium">“{o.objection}”</p>
                        <p className="text-sm text-gray-600">
                          Suggested response: {o.response}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty />
                )}
              </Section>

              <Section title="Questions buyers are asking">
                {result.sales_brief.buyer_questions.length ? (
                  <ul className="list-disc space-y-1 rounded border p-3 pl-8 text-gray-700">
                    {result.sales_brief.buyer_questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                ) : (
                  <Empty />
                )}
              </Section>
            </>
          ) : (
            <p className="text-gray-500">
              This analysis predates the sales brief feature. Ask a manager to
              run a new analysis to generate one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
