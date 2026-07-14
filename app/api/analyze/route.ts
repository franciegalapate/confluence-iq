import { NextResponse } from "next/server";
import { getUserWithRole } from "@/lib/supabase/roles";
import { createClient } from "@/lib/supabase/server";

const schema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    content_gaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          topic: { type: "string" },
          customer_need: { type: "string" },
          missing_content: { type: "string" },
        },
        required: ["topic", "customer_need", "missing_content"],
      },
    },
    next_best_actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["action", "priority"],
      },
    },
  },
  required: ["summary", "content_gaps", "next_best_actions"],
};

export async function POST(request: Request) {
  const { user, role } = await getUserWithRole();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (role !== "general_manager") {
    return NextResponse.json(
      { error: "Only General Managers can run analysis" },
      { status: 403 },
    );
  }

  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const ollamaRes = await fetch(`${process.env.OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        format: schema,
        options: { temperature: 0 },
        messages: [
          {
            role: "system",
            content:
              "You are a market intelligence analyst for a Ford car dealership. " +
              "Analyze the provided text (customer feedback, reviews, competitor content) " +
              "to find content gaps between what buyers want and what the dealership website offers. " +
              "Base your findings only on the provided text. Return your answer as JSON.",
          },
          { role: "user", content: text },
        ],
      }),
    });

    if (!ollamaRes.ok) {
      return NextResponse.json(
        { error: "The AI model failed to respond" },
        { status: 502 },
      );
    }

    const data = await ollamaRes.json();
    const parsed = JSON.parse(data.message.content);

    // Persist so Sales Reps (and later sessions) can view it
    const supabase = await createClient();
    await supabase.from("analyses").insert({
      input_text: text,
      result: parsed,
      created_by: user.id,
    });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Could not process the analysis" },
      { status: 500 },
    );
  }
}
