export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { getSession, can } from "@/lib/auth";
import { formatPaise } from "@/lib/pricing";
import { upsertEmployeeAction, setEmployeeActiveAction } from "@/app/actions/employees";

export const metadata = { title: "Owner Console · Employees" };

export default async function EmployeesPage() {
  const canManage = can(getSession(), "customers.manage");
  const sb = supabaseServer();

  const { data: roster } = await sb.from("employees").select("*").order("active", { ascending: false }).order("name");
  const employees = (roster as any[]) ?? [];

  // Sales attributed to each employee this calendar month.
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const { data: sales } = await sb.from("orders")
    .select("sales_employee_id,total,created_at")
    .not("sales_employee_id", "is", null)
    .gte("created_at", monthStart);
  const perf = new Map<string, { count: number; total: number }>();
  for (const o of (sales as any[]) ?? []) {
    const cur = perf.get(o.sales_employee_id) ?? { count: 0, total: 0 };
    cur.count += 1; cur.total += o.total ?? 0;
    perf.set(o.sales_employee_id, cur);
  }

  const inp = "rounded-xl border border-sand bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-emerald";

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Employees</h1>
      <p className="text-sm text-muted mb-6">Your team, and how much each has sold this month. Sales are attributed at billing, so you can reward performance.</p>

      {canManage && (
        <form action={upsertEmployeeAction} className="bg-surface rounded-2xl border border-sand p-5 shadow-card mb-6 flex flex-wrap items-end gap-3">
          <label className="text-[11px] text-muted">Name<input name="name" required placeholder="Full name" className={`${inp} block mt-0.5 w-48`} /></label>
          <label className="text-[11px] text-muted">Phone<input name="phone" placeholder="Optional" className={`${inp} block mt-0.5 w-40`} /></label>
          <label className="text-[11px] text-muted">Role / title<input name="title" placeholder="e.g. Counter sales" className={`${inp} block mt-0.5 w-44`} /></label>
          <button className="btn-primary px-5 py-2.5 text-sm font-medium">Add employee</button>
        </form>
      )}

      <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-right px-4 py-3">Sales (this month)</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No employees yet — add your first team member above.</td></tr>
            )}
            {employees.map((e) => {
              const p = perf.get(e.id) ?? { count: 0, total: 0 };
              return (
                <tr key={e.id} className="border-t border-sand/70">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{e.name}</p>
                    {e.phone && <p className="text-xs text-muted">{e.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted">{e.title || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-ink">{formatPaise(p.total)}</span>
                    <span className="text-xs text-muted"> · {p.count} {p.count === 1 ? "sale" : "sales"}</span>
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <form action={setEmployeeActiveAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="active" value={e.active ? "false" : "true"} />
                        <button className={`px-2.5 py-1 rounded-full text-xs font-medium ${e.active ? "bg-emerald-mist text-emerald" : "bg-sand text-muted"}`}>
                          {e.active ? "Active" : "Inactive"}
                        </button>
                      </form>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${e.active ? "bg-emerald-mist text-emerald" : "bg-sand text-muted"}`}>{e.active ? "Active" : "Inactive"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
