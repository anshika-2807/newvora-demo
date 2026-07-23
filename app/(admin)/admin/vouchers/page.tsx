export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";
import { createVoucherAction, toggleVoucherAction, deleteVoucherAction } from "@/app/actions/vouchers";
import { formatPaise } from "@/lib/pricing";

export const metadata = { title: "Owner Console · Coupons" };

export default async function AdminVouchers() {
  if (!(await requirePerm("marketing.manage"))) {
    return <main className="p-8"><p className="text-muted">You don't have permission to manage coupons.</p></main>;
  }
  const { data } = await supabaseServer().from("vouchers").select("*").order("created_at", { ascending: false });
  const vouchers = (data as any[]) ?? [];
  const input = "w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-white outline-none focus:border-emerald";

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-1">Coupons &amp; Discount Codes</h1>
      <p className="text-sm text-muted mb-6">Create codes customers apply at checkout. Discounts are re-checked on the server and flow through to totals, GST and the day-book automatically.</p>

      {/* Create */}
      <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-medium text-ink mb-3">Create a coupon</h2>
        <form action={createVoucherAction} className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm text-muted">Code
            <input name="code" placeholder="WELCOME10" className={`${input} mt-1 uppercase`} required />
          </label>
          <label className="text-sm text-muted">Type
            <select name="kind" className={`${input} mt-1`}>
              <option value="percent">Percent off (%)</option>
              <option value="flat">Flat amount off (₹)</option>
            </select>
          </label>
          <label className="text-sm text-muted">Value <span className="text-xs">(% for percent, ₹ for flat)</span>
            <input name="value" type="number" min="1" placeholder="10" className={`${input} mt-1`} required />
          </label>
          <label className="text-sm text-muted">Min order (₹) <span className="text-xs">optional</span>
            <input name="min_order" type="number" min="0" placeholder="999" className={`${input} mt-1`} />
          </label>
          <label className="text-sm text-muted">Max discount cap (₹) <span className="text-xs">percent only</span>
            <input name="cap" type="number" min="0" placeholder="500" className={`${input} mt-1`} />
          </label>
          <label className="text-sm text-muted">Applies to
            <select name="channel" className={`${input} mt-1`}>
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="all">Both</option>
            </select>
          </label>
          <label className="text-sm text-muted">Usage limit <span className="text-xs">blank = unlimited</span>
            <input name="usage_limit" type="number" min="0" placeholder="100" className={`${input} mt-1`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-muted">Starts
              <input name="starts_at" type="date" className={`${input} mt-1`} />
            </label>
            <label className="text-sm text-muted">Ends
              <input name="ends_at" type="date" className={`${input} mt-1`} />
            </label>
          </div>
          <div className="sm:col-span-2">
            <button className="btn-primary px-6 py-2.5 text-sm font-medium">Create coupon</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Discount</th>
              <th className="text-left px-4 py-3">Rules</th>
              <th className="text-left px-4 py-3">Used</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No coupons yet — create one above.</td></tr>
            )}
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t border-sand/70">
                <td className="px-4 py-3 font-mono font-semibold text-ink">{v.code}</td>
                <td className="px-4 py-3 text-ink">
                  {v.kind === "flat" ? `${formatPaise(v.value)} off` : `${v.value}% off`}
                  {v.kind === "percent" && v.cap ? <span className="text-muted"> · max {formatPaise(v.cap)}</span> : null}
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {v.min_order ? `Min ${formatPaise(v.min_order)} · ` : ""}{v.channel}
                  {v.ends_at ? ` · till ${new Date(v.ends_at).toLocaleDateString("en-IN")}` : ""}
                </td>
                <td className="px-4 py-3 text-muted">{v.used_count}{v.usage_limit != null ? ` / ${v.usage_limit}` : ""}</td>
                <td className="px-4 py-3">
                  <form action={toggleVoucherAction}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="active" value={v.active ? "0" : "1"} />
                    <button className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.active ? "bg-emerald-mist text-emerald" : "bg-sand text-muted"}`}>
                      {v.active ? "Active" : "Paused"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteVoucherAction}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="text-xs text-rose hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
