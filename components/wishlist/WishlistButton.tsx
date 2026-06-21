"use client";
import { useWishlist, type WishItem } from "./WishlistContext";
import { useToast } from "@/components/ui/Toast";

export function WishlistButton({ item, className = "" }: { item: WishItem; className?: string }) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const active = has(item.sku);
  return (
    <button aria-label="Wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item); toast(active ? "Removed from wishlist" : "Saved to wishlist", active ? "info" : "success"); }}
      className={`${className} ${active ? "bg-rose text-white" : "bg-white/85 text-rose hover:bg-rose hover:text-white"}`}>
      {active ? "♥" : "♡"}
    </button>
  );
}
