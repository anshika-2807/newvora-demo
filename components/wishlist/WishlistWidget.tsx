"use client";
import Link from "next/link";
import { useWishlist } from "./WishlistContext";

export function WishlistWidget() {
  const { count } = useWishlist();
  return (
    <Link href="/wishlist" aria-label="Wishlist" className="relative text-lg text-ink hover:text-rose transition-colors hover:scale-110">
      ♡{count > 0 && <span className="absolute -top-2 -right-2 bg-rose text-white text-[10px] h-4 min-w-4 px-1 rounded-full grid place-items-center">{count}</span>}
    </Link>
  );
}
