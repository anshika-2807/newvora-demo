"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PASSCODE = () => process.env.OWNER_PASSCODE ?? "blythe2026";
const SESSION = () => process.env.ADMIN_SESSION_TOKEN ?? "bd-owner-session-v1";

export async function loginAction(formData: FormData) {
  const code = String(formData.get("passcode") ?? "").trim();
  const next = String(formData.get("next") ?? "/admin/dashboard");
  if (code !== PASSCODE()) redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  cookies().set("bd_session", SESSION(), { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 12 });
  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}

export async function logoutAction() {
  cookies().set("bd_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  redirect("/login");
}
