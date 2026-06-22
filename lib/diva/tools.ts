/**
 * DIVA tool catalogue — the operations DIVA can perform in the console.
 * Shared by the planner (server) and the widget (client). No server-only imports.
 *
 * kind: "read" = fetch/analyse data · "navigate" = move the console · "mutate" = change data.
 * permission: granular key from lib/permissions (owner has all). confirm: ask before running.
 */
export type DivaKind = "read" | "navigate" | "mutate";
export type DivaParam = { name: string; type: "string" | "number"; required?: boolean; desc: string };
export type DivaTool = { name: string; kind: DivaKind; permission?: string; confirm?: boolean; desc: string; params: DivaParam[] };

/** Friendly page names → admin routes (used by open_page). */
export const PAGE_MAP: Record<string, string> = {
  dashboard: "/admin/dashboard",
  analytics: "/admin/analytics",
  catalogue: "/admin/catalogue",
  products: "/admin/catalogue",
  "add inventory": "/admin/upload",
  upload: "/admin/upload",
  "product photos": "/admin/media",
  media: "/admin/media",
  categories: "/admin/categories",
  inventory: "/admin/inventory",
  barcodes: "/admin/barcodes",
  "ai reorder": "/admin/reorder",
  reorder: "/admin/reorder",
  billing: "/admin/billing",
  pos: "/admin/billing",
  sales: "/admin/sales",
  "sales records": "/admin/sales",
  estimates: "/admin/estimates",
  returns: "/admin/returns",
  purchases: "/admin/purchases",
  customers: "/admin/customers",
  suppliers: "/admin/suppliers",
  vendors: "/admin/suppliers",
  reviews: "/admin/reviews",
  reels: "/admin/reels",
  "abandoned carts": "/admin/abandoned",
  approvals: "/admin/approvals",
  notifications: "/admin/inbox",
  roles: "/admin/roles",
};

export const DIVA_TOOLS: DivaTool[] = [
  // READ / ANALYSE
  { name: "business_summary", kind: "read", desc: "Overall snapshot: revenue, orders, dead/low stock, top sellers for a period.", params: [{ name: "days", type: "number", desc: "look-back window in days (default 30)" }] },
  { name: "analyze_sales", kind: "read", permission: "sales.view", desc: "Sales totals and channel breakdown for a period.", params: [{ name: "days", type: "number", desc: "look-back window in days (default 30)" }] },
  { name: "inventory_status", kind: "read", permission: "inventory.view", desc: "Dead / low / healthy stock counts and the worst dead-stock items.", params: [] },
  { name: "low_stock", kind: "read", permission: "inventory.view", desc: "List products that are low or out of stock.", params: [] },
  { name: "find_product", kind: "read", permission: "catalog.view", desc: "Search the catalogue by name or SKU; returns price and stock.", params: [{ name: "query", type: "string", required: true, desc: "name or SKU to search" }] },
  { name: "product_details", kind: "read", permission: "catalog.view", desc: "Full details of one product: price, stock, status, tags, description, photos.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "product_analytics", kind: "read", permission: "sales.view", desc: "Sales analytics for one product: units sold, revenue, number of orders.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },

  // NAVIGATE
  { name: "open_page", kind: "navigate", desc: "Open a console page by name (dashboard, catalogue, inventory, billing, sales, estimates, suppliers, roles, barcodes, etc.).", params: [{ name: "page", type: "string", required: true, desc: "page name" }] },

  // MUTATE (permission-gated, confirmed)
  { name: "add_stock", kind: "mutate", permission: "inventory.add", confirm: true, desc: "Increase a product's stock by a quantity, with a source tag.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }, { name: "qty", type: "number", required: true, desc: "units to add" }, { name: "source", type: "string", desc: "reason/source" }] },
  { name: "remove_stock", kind: "mutate", permission: "inventory.remove", confirm: true, desc: "Decrease a product's stock by a quantity, with a source tag.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }, { name: "qty", type: "number", required: true, desc: "units to remove" }, { name: "source", type: "string", desc: "reason/source" }] },
  { name: "generate_ai_content", kind: "mutate", permission: "catalog.ai", confirm: true, desc: "Generate/refresh the AI product page (title, description, tags, SEO) for a SKU.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "generate_photo", kind: "mutate", permission: "catalog.ai", confirm: true, desc: "Generate the professional model photo from a product's raw photo.", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "hide_product", kind: "mutate", permission: "catalog.publish", confirm: true, desc: "Hide a product from the storefront (set to draft).", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "show_product", kind: "mutate", permission: "catalog.publish", confirm: true, desc: "Make a product visible on the storefront (publish).", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "delete_product", kind: "mutate", permission: "catalog.delete", confirm: true, desc: "Delete a product permanently (or hide it if it has past orders).", params: [{ name: "sku", type: "string", required: true, desc: "product SKU" }] },
  { name: "delete_role", kind: "mutate", permission: "roles.manage", confirm: true, desc: "Delete a staff role by name.", params: [{ name: "name", type: "string", required: true, desc: "role name" }] },
];

export function toolByName(name: string): DivaTool | undefined {
  return DIVA_TOOLS.find((t) => t.name === name);
}
