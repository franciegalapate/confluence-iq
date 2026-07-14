import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <p className="mt-2 text-gray-600">Signed in as {data.user?.email}</p>
      <form action={signOut} className="mt-6">
        <button className="rounded bg-gray-900 px-4 py-2 text-white">
          Sign out
        </button>
      </form>
    </main>
  );
}
