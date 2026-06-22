export const dynamic = "force-dynamic";
import { getRoles } from "@/lib/supabase/queries";
import { createRoleAction, updateRoleAction, deleteRoleAction } from "@/app/actions/rbac";
import { RoleForm } from "@/components/admin/RoleForm";
import { permLabel } from "@/lib/permissions";

export const metadata = { title: "Owner Console · Roles & Permissions" };

export default async function Roles() {
  const roles = await getRoles();
  return (
    <main className="p-4 sm:p-8 bg-cream/40 min-h-screen max-w-5xl">
      <h1 className="font-display text-4xl text-ink mb-1">Roles &amp; Permissions</h1>
      <p className="text-sm text-muted mb-6">Discord-style granular control. Grant exactly what a role can do — e.g. a stock clerk who can <b>add</b> stock but never <b>remove</b> it, or list products but not delete them.</p>

      <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
        <h2 className="font-medium text-ink mb-4">Create a role</h2>
        <RoleForm action={createRoleAction} submitLabel="Create role" />
      </div>

      <h2 className="font-medium text-ink mb-3">Existing roles</h2>
      <div className="space-y-4">
        {roles.length === 0 && <p className="text-sm text-muted">No roles yet.</p>}
        {roles.map((r: any) => (
          <details key={r.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
            <summary className="px-5 py-4 cursor-pointer flex items-center justify-between list-none">
              <div>
                <p className="font-medium text-ink">{r.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(r.permissions ?? []).length === 0 && <span className="text-xs text-muted">No permissions</span>}
                  {(r.permissions ?? []).slice(0, 8).map((p: string) => (
                    <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-mist text-emerald-dark">{permLabel(p)}</span>
                  ))}
                  {(r.permissions ?? []).length > 8 && <span className="text-[11px] text-muted">+{(r.permissions ?? []).length - 8} more</span>}
                </div>
              </div>
              <span className="text-muted text-sm">Edit ⌄</span>
            </summary>
            <div className="border-t border-sand px-5 py-4">
              <RoleForm action={updateRoleAction} id={r.id} initialName={r.name} initialPerms={r.permissions ?? []} submitLabel="Save changes" />
              <form action={deleteRoleAction} className="mt-3">
                <input type="hidden" name="id" value={r.id} />
                <button className="text-xs text-rose hover:underline">Delete this role</button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
