export const PERMISSIONS = ["product_editing", "inventory", "billing", "purchases", "analytics", "user_management", "approvals"] as const;
export type Permission = (typeof PERMISSIONS)[number];
