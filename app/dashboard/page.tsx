import { getUserWithRole } from "@/lib/supabase/roles";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import Analyzer from "@/components/analyzer";

export default async function DashboardPage() {
  const { user, role } = await getUserWithRole();

  const supabase = await createClient();
  const { data: latest } = await supabase
    .from("analyses")
    .select("input_text, result, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <p className="text-sm text-gray-600">
            {user?.email} ·{" "}
            {role === "general_manager" ? "General Manager" : "Sales Rep"}
          </p>
        </div>
        <form action={signOut}>
          <button className="rounded border px-4 py-2">Sign out</button>
        </form>
      </div>

      <Analyzer role={role ?? "sales_rep"} initial={latest ?? null} />
    </main>
  );
}
