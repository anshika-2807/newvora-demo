import { Icon } from "@/components/ui/Icon";

export function Stars({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "md" }) {
  const full = Math.round(rating);
  const px = size === "md" ? "text-base" : "text-xs";
  const star = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <span className={`inline-flex items-center gap-1 ${px}`}>
      <span className="inline-flex items-center" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" className={`${star} ${i < full ? "text-gold" : "text-sand"}`} />
        ))}
      </span>
      <span className="text-muted">{rating.toFixed(1)}{count != null ? ` (${count})` : ""}</span>
    </span>
  );
}
