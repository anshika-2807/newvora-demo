export function Stars({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "md" }) {
  const full = Math.round(rating);
  const px = size === "md" ? "text-base" : "text-xs";
  return (
    <span className={`inline-flex items-center gap-1 ${px}`}>
      <span className="text-gold tracking-tight" aria-hidden>
        {"★".repeat(full)}<span className="text-sand">{"★".repeat(5 - full)}</span>
      </span>
      <span className="text-muted">{rating.toFixed(1)}{count != null ? ` (${count})` : ""}</span>
    </span>
  );
}
