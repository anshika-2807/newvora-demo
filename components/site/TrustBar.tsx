import { Icon, type IconName } from "@/components/ui/Icon";

const ITEMS: { icon: IconName; t: string; s: string }[] = [
  { icon: "check-circle", t: "Premium Finish", s: "Quality checked" },
  { icon: "rotate", t: "Easy 7-day Returns", s: "No questions asked" },
  { icon: "heart", t: "50,000+ Happy Customers", s: "Across India" },
  { icon: "shield", t: "COD & Secure Pay", s: "Pay your way" },
];
export function TrustBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sand/60 rounded-2xl overflow-hidden">
      {ITEMS.map((i) => (
        <div key={i.t} className="bg-ivory px-5 py-5 text-center group transition-colors hover:bg-emerald-mist">
          <div className="text-gold mb-1.5 flex justify-center transition-transform group-hover:scale-110"><Icon name={i.icon} className="w-6 h-6" /></div>
          <p className="text-sm font-medium text-ink">{i.t}</p>
          <p className="text-xs text-muted">{i.s}</p>
        </div>
      ))}
    </div>
  );
}
