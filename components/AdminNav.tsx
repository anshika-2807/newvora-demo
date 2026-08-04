"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Icon, type IconName } from "@/components/ui/Icon";

type L = { href: string; label: string; icon: IconName; perm?: string };
type Perms = string[] | "*";
const GROUPS: { title: string; links: L[] }[] = [
  { title: "Home", links: [
    { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/reports", label: "Reports", icon: "download", perm: "sales.view" },
    { href: "/admin/analytics", label: "Analytics & SEO", icon: "chart", perm: "analytics.view" },
  ]},
  { title: "Catalogue", links: [
    { href: "/admin/catalogue", label: "Catalogue", icon: "tag", perm: "catalog.view" },
    { href: "/admin/upload", label: "Add product", icon: "plus", perm: "catalog.create" },
    { href: "/admin/categories", label: "Categories", icon: "folder", perm: "catalog.edit" },
    { href: "/admin/colours", label: "Variant Options", icon: "sliders", perm: "catalog.edit" },
    { href: "/admin/pricing", label: "Pricing formula", icon: "scale", perm: "catalog.edit" },
    { href: "/admin/barcodes", label: "Barcodes & QR", icon: "barcode", perm: "inventory.barcode" },
  ]},
  { title: "Inventory", links: [
    { href: "/admin/inventory", label: "Inventory", icon: "boxes", perm: "inventory.view" },
    { href: "/admin/stock-movements", label: "Stock Movements", icon: "arrows-updown", perm: "inventory.view" },
    { href: "/admin/backorders", label: "Backorders", icon: "clock", perm: "sales.view" },
  ]},
  { title: "Sales & Billing", links: [
    { href: "/admin/billing", label: "Billing (POS)", icon: "calculator", perm: "billing.sell" },
    { href: "/admin/sales", label: "Sales Records", icon: "receipt", perm: "sales.view" },
    { href: "/admin/orders", label: "Website Orders", icon: "bag", perm: "sales.view" },
    { href: "/admin/estimates", label: "Estimates", icon: "file", perm: "estimates.create" },
    { href: "/admin/returns", label: "Returns", icon: "rotate", perm: "billing.refund" },
  ]},
  { title: "Money", links: [
    { href: "/admin/cashbook", label: "Cashbook", icon: "book", perm: "sales.view" },
    { href: "/admin/creditors", label: "Receivables", icon: "flag", perm: "sales.view" },
    { href: "/admin/purchases", label: "Purchases", icon: "truck", perm: "purchases.view" },
  ]},
  { title: "Customers & Leads", links: [
    { href: "/admin/customers", label: "Customers", icon: "users", perm: "customers.view" },
    { href: "/admin/reviews", label: "Reviews", icon: "star", perm: "reviews.respond" },
    { href: "/admin/feedback", label: "Feedback", icon: "chat", perm: "reviews.respond" },
    { href: "/admin/quotes", label: "Quote Requests", icon: "edit", perm: "customers.view" },
    { href: "/admin/submissions", label: "Submissions", icon: "inbox", perm: "catalog.create" },
  ]},
  { title: "Wholesale & Marketing", links: [
    { href: "/admin/trade-accounts", label: "Trade Accounts", icon: "store", perm: "customers.manage" },
    { href: "/admin/vouchers", label: "Coupons", icon: "percent", perm: "marketing.manage" },
    { href: "/admin/abandoned", label: "Abandoned carts", icon: "cart", perm: "marketing.manage" },
  ]},
  { title: "Team & Settings", links: [
    { href: "/admin/employees", label: "Employees", icon: "users", perm: "customers.manage" },
    { href: "/admin/suppliers", label: "Suppliers", icon: "wrench", perm: "suppliers.manage" },
    { href: "/admin/inbox", label: "Notifications", icon: "bell" },
    { href: "/admin/approvals", label: "Approvals", icon: "check-circle", perm: "approvals.approve" },
    { href: "/admin/roles", label: "Roles", icon: "key", perm: "roles.manage" },
  ]},
];
const EXTERNAL: L[] = [
  { href: "/shop", label: "Retail store", icon: "bag" },
  { href: "/wholesale", label: "Wholesale", icon: "package" },
  { href: "/catalog", label: "Share Catalogue", icon: "share" },
];

const allow = (perms: Perms, perm?: string) => !perm || perms === "*" || perms.includes(perm);

function NavInner({ collapsed, onNavigate, perms }: { collapsed: boolean; onNavigate?: () => void; perms: Perms }) {
  const path = usePathname();
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  const groups = GROUPS.map((g) => ({ ...g, links: g.links.filter((l) => allow(perms, l.perm)) })).filter((g) => g.links.length > 0);
  const activeGroup = groups.find((g) => g.links.some((l) => isActive(l.href)))?.title;
  const [openG, setOpenG] = useState<Record<string, boolean>>({});
  useEffect(() => { if (activeGroup) setOpenG((o) => ({ ...o, [activeGroup]: true })); }, [activeGroup]);
  const toggle = (t: string) => setOpenG((o) => ({ ...o, [t]: !(o[t] ?? t === activeGroup) }));

  const linkEl = (l: L) => (
    <Link key={l.href} href={l.href} onClick={onNavigate} title={collapsed ? l.label : undefined}
      className={`group flex items-center gap-3 rounded-xl text-sm transition-all ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2 hover:translate-x-0.5"} ${isActive(l.href) ? "bg-white/10 text-onnight" : "text-onnight/85 hover:bg-white/5"}`}>
      <span className="text-gold-light shrink-0"><Icon name={l.icon} className="w-[18px] h-[18px]" /></span>
      {!collapsed && <span className="truncate">{l.label}</span>}
    </Link>
  );

  const storefront = (
    <div className="mt-6">
      {!collapsed && <p className="px-3 mb-1 text-[10px] uppercase tracking-widest text-onnight/35">View storefront</p>}
      <div className="space-y-0.5">
        {EXTERNAL.map((l) => (
          <Link key={l.href} href={l.href} target="_blank" onClick={onNavigate} title={collapsed ? l.label : undefined}
            className={`group flex items-center gap-3 rounded-xl text-sm text-onnight/70 hover:bg-white/5 transition-all ${collapsed ? "justify-center py-2.5" : "px-3 py-2"}`}>
            <span className="text-gold-light/70 shrink-0"><Icon name={l.icon} className="w-[18px] h-[18px]" /></span>
            {!collapsed && <><span className="truncate">{l.label}</span><span className="ml-auto opacity-0 group-hover:opacity-100"><Icon name="external" className="w-3.5 h-3.5" /></span></>}
          </Link>
        ))}
      </div>
    </div>
  );

  const logout = (
    <form action={logoutAction} className="mt-6">
      <button className={`w-full flex items-center gap-2 text-sm text-onnight/70 hover:text-white transition-colors ${collapsed ? "justify-center" : "px-3"}`} title="Sign out">
        <Icon name="logout" className="w-[18px] h-[18px]" />{!collapsed && <span>Sign out</span>}
      </button>
    </form>
  );

  // Collapsed rail → flat icon list (no headers).
  if (collapsed) {
    return (<>
      <nav className="space-y-0.5">{groups.flatMap((g) => g.links).map(linkEl)}</nav>
      {storefront}{logout}
    </>);
  }

  // Expanded → collapsible dropdown groups (active group open by default).
  return (<>
    <nav className="space-y-1">
      {groups.map((g) => {
        const isOpen = openG[g.title] ?? (g.title === activeGroup);
        return (
          <div key={g.title}>
            <button type="button" onClick={() => toggle(g.title)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-widest text-onnight/45 hover:text-onnight/80 transition-colors">
              <span>{g.title}</span>
              <Icon name="chevron-right" className={`w-3.5 h-3.5 text-onnight/40 transition-transform ${isOpen ? "rotate-90" : ""}`} />
            </button>
            {isOpen && <div className="space-y-0.5 mb-1">{g.links.map(linkEl)}</div>}
          </div>
        );
      })}
    </nav>
    {storefront}{logout}
  </>);
}

export function AdminNav({ perms = "*", roleName = "Owner" }: { perms?: Perms; roleName?: string }) {
  const [open, setOpen] = useState(false);       // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop rail
  const path = usePathname();

  useEffect(() => { try { setCollapsed(localStorage.getItem("bd_nav_collapsed") === "1"); } catch {} }, []);
  useEffect(() => { setOpen(false); }, [path]); // close drawer on navigation
  function toggleCollapsed() { setCollapsed((c) => { const n = !c; try { localStorage.setItem("bd_nav_collapsed", n ? "1" : "0"); } catch {} return n; }); }

  return (
    <>
      {/* Mobile top bar */}
      <header className="no-print lg:hidden fixed top-0 inset-x-0 h-14 bg-night text-onnight z-40 flex items-center gap-3 px-4 shadow-card">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex flex-col gap-[5px] p-1">
          <span className="block h-0.5 w-6 bg-onnight rounded" /><span className="block h-0.5 w-6 bg-onnight rounded" /><span className="block h-0.5 w-6 bg-onnight rounded" />
        </button>
        <Link href="/" className="font-display text-xl text-onnight leading-none">Newvora</Link>
        <span className="ml-auto text-[10px] tracking-widest uppercase text-gold-light">{roleName}</span>
      </header>

      {/* Mobile drawer + overlay */}
      {open && <div className="no-print lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}
      <aside className={`no-print lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-night text-onnight/90 z-50 px-4 py-6 overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <Link href="/" className="font-display text-2xl text-onnight leading-none">Newvora</Link>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold-light mt-1">Owner Console</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-onnight/70 px-2"><Icon name="x" className="w-5 h-5" /></button>
        </div>
        <NavInner collapsed={false} onNavigate={() => setOpen(false)} perms={perms} />
      </aside>

      {/* Desktop sidebar — sticky & self-scrolling, independent of the page scroll */}
      <aside className={`no-print hidden lg:flex shrink-0 lg:sticky lg:top-0 h-screen bg-night text-onnight/90 px-3 py-6 flex-col transition-[width] duration-200 ${collapsed ? "w-[4.75rem]" : "w-60"}`}>
        <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
          {!collapsed && <div>
            <Link href="/" className="font-display text-2xl text-onnight leading-none">Newvora</Link>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold-light mt-1">{roleName === "Owner" ? "Owner Console" : roleName}</p>
          </div>}
          <button onClick={toggleCollapsed} aria-label="Collapse menu" className="text-onnight/60 hover:text-white"><Icon name={collapsed ? "chevron-right" : "chevron-down"} className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavInner collapsed={collapsed} perms={perms} />
        </div>
        {!collapsed && (
          <div className="px-3 pt-4">
            <div className="flex items-center gap-2 text-[11px] text-onnight/50">
              <span className="h-2 w-2 rounded-full bg-emerald-light animate-pulse" /> Live · Delhi, India
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
