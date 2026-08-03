"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { deleteProductAction } from "@/app/actions/catalog";
import { Icon } from "@/components/ui/Icon";

export function DeleteProductButton({ sku, className = "", iconOnly = false }: { sku: string; className?: string; iconOnly?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!confirm(`Delete ${sku}? This permanently removes the product (or hides it if it has past orders).`)) return;
    setBusy(true);
    const fd = new FormData(); fd.set("sku", sku);
    const r = await deleteProductAction(fd);
    setBusy(false);
    toast(r.message, r.ok ? "success" : "error");
    router.refresh();
  }
  return (
    <button onClick={del} disabled={busy} title="Delete product"
      className={className || "text-muted hover:text-rose text-xs"}><span className="inline-flex items-center gap-1"><Icon name="trash" className="w-3.5 h-3.5" />{!iconOnly && "Delete"}</span></button>
  );
}
