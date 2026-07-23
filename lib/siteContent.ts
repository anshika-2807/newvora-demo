export type Section = { h?: string; p: string };
export type Page = { title: string; intro: string; sections: Section[] };

export const PAGES: Record<string, Page> = {
  about: {
    title: "About Newvora",
    intro: "A live demo of Newvora — one system that runs your entire store, from the shopfront to the back office.",
    sections: [
      { h: "What this is", p: "This is a working demo store built on Newvora's commerce + operations platform. Everything you see — the catalogue, cart, checkout, reviews, and the owner console behind it — is fully functional, so you can experience exactly how it would run your own business." },
      { h: "Built for any product business", p: "Whether you sell apparel, accessories, home goods, wellness products, electronics or anything else, the same system adapts to your catalogue. Add products, set retail and wholesale prices, and start selling — online and at the counter." },
      { h: "Retail & wholesale", p: "Serve the customer who wants a single item and the retailer sourcing in bulk from one platform. Approved retailers unlock trade pricing with minimum order quantities, while every shopper enjoys honest pricing, real reviews, and easy returns." },
    ],
  },
  contact: {
    title: "Contact Us",
    intro: "We're here to help — reach out any time.",
    sections: [
      { h: "WhatsApp & Orders", p: "Message us on WhatsApp at +91 83770 62790 for orders, stock checks, and wholesale enquiries — it's the fastest way to reach us." },
      { h: "Call", p: "Phone: +91 95820 02623, Monday to Saturday, 10:00 AM – 8:00 PM IST." },
      { h: "Visit", p: "Newvora, Delhi, India." },
      { h: "Wholesale", p: "Retailers can apply for a trade account from the Wholesale page; the owner approves each account before trade pricing is unlocked." },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Fast, tracked delivery across India.",
    sections: [
      { h: "Charges", p: "Free shipping on all orders above ₹999. A flat ₹50 applies below that. Cash on Delivery is available across serviceable pincodes." },
      { h: "Dispatch & delivery", p: "Orders are dispatched within 1–2 business days. Delivery typically takes 3–7 business days depending on your location. You'll receive tracking details on WhatsApp once your order ships." },
      { h: "Serviceability", p: "We ship pan-India through our logistics partners. If a pincode is not serviceable, our team will contact you with alternatives." },
    ],
  },
  returns: {
    title: "Returns & Cancellation",
    intro: "Shop with confidence — easy 7-day returns.",
    sections: [
      { h: "7-day returns", p: "If you're not happy with your purchase, you can request a return within 7 days of delivery. The item must be unused and in its original condition and packaging." },
      { h: "How to return", p: "Message us on WhatsApp with your order number and reason. We'll arrange a pickup or guide you through the process and process your refund once the item is received and inspected." },
      { h: "Cancellation", p: "Orders can be cancelled before they are dispatched. Once shipped, the return policy applies. Refunds are issued to the original payment method or as store credit for COD orders." },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    intro: "Quick answers to common questions.",
    sections: [
      { h: "Is this a real store?", p: "This is a live demo built on the Newvora platform. The storefront and owner console are fully functional so you can try the complete experience — browsing, checkout, billing and inventory — before setting up your own." },
      { h: "What kinds of products can it sell?", p: "Any product catalogue — apparel, accessories, home goods, wellness, electronics and more. You add your categories and products, set prices, and the store adapts to what you sell." },
      { h: "Do you offer Cash on Delivery?", p: "Yes, COD is available across serviceable pincodes, alongside online payment options." },
      { h: "Can I order in bulk / for my shop?", p: "Yes. Apply for a wholesale account on the Wholesale page; once approved by the owner, you'll see trade rates and minimum order quantities." },
      { h: "How do I track my order?", p: "You'll receive tracking details on WhatsApp once your order is dispatched." },
    ],
  },
  "size-guide": {
    title: "Product & Buying Guide",
    intro: "Everything you need to choose with confidence.",
    sections: [
      { h: "Product details", p: "Each product page lists the key details — variants, options, availability and pricing. Check the specifications section for exact information before you order." },
      { h: "Variants & options", p: "Where a product comes in multiple options (such as colour or size), pick your choice on the product page. Live stock is shown per option so you always know what's available." },
      { h: "Pricing", p: "Every item shows its retail price, with any discount and savings highlighted. Approved wholesale buyers see trade pricing after signing in." },
      { h: "Need help choosing?", p: "Message us on WhatsApp with your question and we'll help you pick the right product for your needs." },
    ],
  },
};
