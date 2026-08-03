"use client";
import { Icon } from "@/components/ui/Icon";
export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary px-5 py-2.5 text-sm font-medium no-print">
      <Icon name="print" className="w-4 h-4 inline mr-1.5" />Download / Print PDF
    </button>
  );
}
