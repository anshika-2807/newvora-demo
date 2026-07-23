"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPaise } from "@/lib/pricing";
import { Back } from "@/components/site/Back";
import { placeOrderAction } from "@/app/actions/orders";
import { checkVoucherAction } from "@/app/actions/vouchers";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", phone: "", address: "", pincode: "", city: "" });
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ ok: boolean; discount: number; msg: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const shipping = total >= 99900 || total === 0 ? 0 : 5000;
  const discount = coupon?.ok ? coupon.discount : 0;
  const grand = Math.max(0, total - discount) + shipping;

  async function applyCode() {
    if (!code.trim()) return;
    setChecking(true);
    const res = await checkVoucherAction(code, total);
    setChecking(false);
    setCoupon({ ok: res.ok, discount: res.discountPaise, msg: res.message });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    const res = await placeOrderAction({
      items: items.map((i) => ({ sku: i.sku, qty: i.qty, color: i.color })),
      customer: f, payment,
      voucherCode: coupon?.ok ? code : undefined,
    });
    setBusy(false);
    if (!res.ok) { setErr(res.error ?? "Something went wrong"); return; }
    clear(); router.push(`/order/${res.orderId}`);
  }

  if (items.length === 0)
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-4xl text-ink">Your bag is empty</h1>
        <Link href="/shop" className="btn-primary inline-block mt-6 px-7 py-3 text-sm font-medium">Discover products</Link>
      </div>
    );

  const input = "w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-white outline-none focus:border-emerald transition-colors";
  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="mb-4"><Back label="Back to shopping" /></div>
      <h1 className="font-display text-4xl text-ink mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={submit} className="space-y-3">
          <h2 className="font-medium text-ink">Delivery details</h2>
          <input className={input} placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <input className={input} placeholder="Phone (WhatsApp)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required />
          <textarea className={input} placeholder="Full address" rows={3} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input className={input} placeholder="Pincode" value={f.pincode} onChange={(e) => setF({ ...f, pincode: e.target.value })} />
            <input className={input} placeholder="City" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          </div>
          <h2 className="font-medium text-ink pt-2">Payment</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["cod", "online"] as const).map((p) => (
              <button type="button" key={p} onClick={() => setPayment(p)}
                className={`rounded-xl border px-4 py-3 text-sm text-left transition-all ${payment === p ? "border-emerald bg-emerald-mist" : "border-sand hover:border-gold"}`}>
                <span className="font-medium block text-ink">{p === "cod" ? "Cash on Delivery" : "Pay Online"}</span>
                <span className="text-xs text-muted">{p === "cod" ? "Pay when it arrives" : "UPI / Card (demo)"}</span>
              </button>
            ))}
          </div>
          {err && <p className="text-sm text-rose">{err}</p>}
          <button disabled={busy} className="btn-primary w-full py-3.5 text-sm font-medium disabled:opacity-60">
            {busy ? "Placing order…" : `Place order · ${formatPaise(grand)}`}
          </button>
        </form>

        <div className="bg-white rounded-2xl p-6 shadow-card h-fit">
          <h2 className="font-medium text-ink mb-4">Order summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((i) => (
              <div key={i.sku + (i.color ?? "")} className="flex justify-between text-sm">
                <span className="text-ink/80">{i.name}{i.color ? ` · ${i.color}` : ""} × {i.qty}</span>
                <span className="text-ink">{formatPaise(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          {/* Coupon */}
          <div className="border-t border-sand pt-3">
            <div className="flex gap-2">
              <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setCoupon(null); }}
                placeholder="Discount code" className="flex-1 rounded-xl border border-sand px-3 py-2 text-sm uppercase bg-white outline-none focus:border-emerald" />
              <button type="button" onClick={applyCode} disabled={checking || !code.trim()}
                className="px-4 py-2 rounded-xl border border-emerald text-emerald text-sm font-medium hover:bg-emerald-mist disabled:opacity-50">
                {checking ? "…" : "Apply"}
              </button>
            </div>
            {coupon && <p className={`text-xs mt-1.5 ${coupon.ok ? "text-emerald" : "text-rose"}`}>{coupon.msg}</p>}
          </div>

          <div className="border-t border-sand pt-3 space-y-1 text-sm mt-3">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPaise(total)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald"><span>Discount {coupon?.ok ? `(${code})` : ""}</span><span>−{formatPaise(discount)}</span></div>}
            <div className="flex justify-between text-muted"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPaise(shipping)}</span></div>
            <div className="flex justify-between font-semibold text-ink pt-1"><span>Total</span><span>{formatPaise(grand)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
