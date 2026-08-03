import * as React from "react";

/**
 * Dependency-free line-icon set (Lucide-style, 24×24, currentColor stroke).
 * Usage: <Icon name="trash" className="w-4 h-4" />
 * Every icon inherits text colour and sizes via className (defaults to w-4 h-4).
 */

type IconName =
  | "dashboard" | "download" | "chart" | "tag" | "plus" | "folder" | "sliders"
  | "scale" | "barcode" | "boxes" | "arrows-updown" | "clock" | "calculator"
  | "receipt" | "bag" | "file" | "rotate" | "book" | "flag" | "truck" | "users"
  | "star" | "chat" | "edit" | "inbox" | "store" | "percent" | "cart" | "wrench"
  | "bell" | "check" | "check-circle" | "key" | "package" | "share" | "logout"
  | "trash" | "print" | "camera" | "sparkles" | "sun" | "moon" | "home" | "x"
  | "eye" | "eye-off" | "lock" | "heart" | "mic" | "link" | "external"
  | "chevron-right" | "chevron-down" | "search" | "phone" | "mail" | "cart-plus"
  | "party" | "handshake" | "shield" | "speaker" | "mute" | "dot";

// Each entry is the inner SVG markup (paths/shapes) for a 0 0 24 24 viewBox.
const P: Record<IconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  download: <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 21h14" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 14 3-4 3 3 4-6" /></>,
  tag: <><path d="M3 3h7l11 11-7 7L3 10V3z" /><circle cx="7" cy="7" r="1.4" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></>,
  sliders: <><path d="M4 6h10" /><path d="M18 6h2" /><circle cx="16" cy="6" r="2" /><path d="M4 12h4" /><path d="M12 12h8" /><circle cx="10" cy="12" r="2" /><path d="M4 18h10" /><path d="M18 18h2" /><circle cx="16" cy="18" r="2" /></>,
  scale: <><path d="M12 3v18" /><path d="M6 7h12" /><path d="m6 7-3 6h6l-3-6z" /><path d="m18 7-3 6h6l-3-6z" /><path d="M8 21h8" /></>,
  barcode: <><path d="M4 5v14M7 5v14M10 5v14M13 5v10M16 5v14M20 5v14" /></>,
  boxes: <><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  "arrows-updown": <><path d="M7 4v16" /><path d="m3 8 4-4 4 4" /><path d="M17 20V4" /><path d="m13 16 4 4 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" /></>,
  receipt: <><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M9 8h6M9 12h6" /></>,
  bag: <><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  file: <><path d="M6 3h8l4 4v14H6V3z" /><path d="M14 3v4h4" /><path d="M9 13h6M9 17h4" /></>,
  rotate: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>,
  book: <><path d="M5 4h13a1 1 0 0 1 1 1v15H6a2 2 0 0 1-2-2V4z" /><path d="M6 20a2 2 0 0 1 0-4h13" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  truck: <><path d="M2 6h11v10H2z" /><path d="M13 9h5l3 3v4h-8" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" /><path d="M17 14.5A6 6 0 0 1 21 20" /></>,
  star: <><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3 9.5l6.1-.9L12 3z" /></>,
  chat: <><path d="M4 5h16v11H8l-4 4V5z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M14 6l4 4" /></>,
  inbox: <><path d="M4 13l2-8h12l2 8v6H4v-6z" /><path d="M4 13h5l1 2h4l1-2h5" /></>,
  store: <><path d="M4 9V6l1-2h14l1 2v3" /><path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" /><path d="M5 10v10h14V10" /><path d="M9 20v-5h6v5" /></>,
  percent: <><path d="M19 5 5 19" /><circle cx="7.5" cy="7.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></>,
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M2 4h3l2.2 11h10l2-8H6" /></>,
  "cart-plus": <><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M2 4h3l2.2 11h10l2-8H6" /><path d="M12 3v5M9.5 5.5h5" /></>,
  wrench: <><path d="M15 3a5 5 0 0 0-4 8L4 18l2 2 7-7a5 5 0 0 0 6-6l-3 3-2-2 3-3a5 5 0 0 0-2-.9z" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  check: <><path d="m5 12 5 5 9-11" /></>,
  "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  key: <><circle cx="8" cy="8" r="4" /><path d="m11 11 9 9" /><path d="m16 16 2-2M19 19l2-2" /></>,
  package: <><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" /><path d="m3 8 9 5 9-5" /><path d="M12 13v8" /></>,
  share: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  logout: <><path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" /><path d="M10 12H3" /><path d="m6 8-4 4 4 4" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  print: <><path d="M7 8V3h10v5" /><path d="M5 8h14a2 2 0 0 1 2 2v6h-4" /><path d="M3 16v-6a2 2 0 0 1 2-2" /><rect x="7" y="14" width="10" height="7" /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" /><circle cx="12" cy="13" r="3.2" /></>,
  sparkles: <><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" /><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  moon: <><path d="M20 14a8 8 0 1 1-10-10 6 6 0 0 0 10 10z" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  x: <><path d="M6 6l12 12M18 6 6 18" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="M3 3l18 18" /><path d="M10.5 6.2A9.7 9.7 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.3 3.7" /><path d="M6.5 8.3A16.8 16.8 0 0 0 2 12s4 6 10 6a9.6 9.6 0 0 0 3.2-.5" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  heart: <><path d="M12 20s-7-4.6-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.4 12 20 12 20z" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>,
  link: <><path d="M9 15l6-6" /><path d="M8 12H6a3 3 0 0 1 0-6h3" /><path d="M16 12h2a3 3 0 0 1 0 6h-3" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  "chevron-right": <><path d="m9 5 7 7-7 7" /></>,
  "chevron-down": <><path d="m5 9 7 7 7-7" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="m20 20-5-5" /></>,
  phone: <><path d="M4 5c0-1 1-2 2-2h2l2 4-2 2a12 12 0 0 0 5 5l2-2 4 2v2c0 1-1 2-2 2A16 16 0 0 1 4 5z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  party: <><path d="M4 20 9 7l8 8-13 5z" /><path d="M14 4a3 3 0 0 1 3 3M18 9a3 3 0 0 1 3 3M15 3l1 1M20 6l1 1M20 3l-1 1" /></>,
  handshake: <><path d="m11 7-4 4a2 2 0 0 0 0 3l3 3 3-3" /><path d="m13 8 3-1 5 5-2 2-3-1" /><path d="M3 11 8 6l3 1" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" /><path d="m9 12 2 2 4-4" /></>,
  speaker: <><path d="M4 9h4l5-4v14l-5-4H4V9z" /><path d="M16 9a4 4 0 0 1 0 6" /></>,
  mute: <><path d="M4 9h4l5-4v14l-5-4H4V9z" /><path d="m17 9 4 6M21 9l-4 6" /></>,
  dot: <><circle cx="12" cy="12" r="3" /></>,
};

export function Icon({ name, className = "w-4 h-4" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name] ?? P.dot}
    </svg>
  );
}

export type { IconName };
