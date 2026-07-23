import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { Diva } from "@/components/admin/Diva";
import { PrivacyShield } from "@/components/admin/PrivacyShield";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = getSession();
  // Defense-in-depth: never render the console for an unauthenticated request.
  if (!s.authed) redirect("/login");
  return (
    <div className="flex min-h-screen bg-diva-cream">
      <AdminNav perms={s.permissions} roleName={s.roleName} />
      {/* pt-14 clears the fixed mobile top bar; lg has the in-flow sidebar instead.
          PrivacyShield wraps content so the Hide-figures toggle + Ctrl/⌘+Shift+H work on every page. */}
      <PrivacyShield className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</PrivacyShield>
      <Diva roleName={s.roleName} />
    </div>
  );
}
