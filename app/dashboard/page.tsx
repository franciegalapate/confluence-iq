import { getUserWithRole } from "@/lib/supabase/roles";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import Analyzer from "@/components/analyzer";

export default async function DashboardPage() {
  const { user, role } = await getUserWithRole();

  const supabase = await createClient();
  const { data: history } = await supabase
    .from("analyses")
    .select("id, input_text, result, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const isManager = role === "general_manager";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="animate-fade-in-up mb-8 flex flex-wrap items-center justify-between gap-4">        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 ${
              isManager
                ? "bg-indigo-100 text-indigo-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isManager ? "General Manager" : "Sales Rep"}
          </span>
          {!isManager && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              View Only Mode
            </span>
          )}
          <form action={signOut}>
            <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <Analyzer role={role ?? "sales_rep"} history={history ?? []} />
    </main>
  );
}
