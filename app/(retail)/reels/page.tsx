export const dynamic = "force-dynamic";
import { getShoppableReels } from "@/lib/supabase/queries";
import { ReelsSection } from "@/components/site/ReelsSection";
import { Back } from "@/components/site/Back";

export const metadata = { title: "Reels — Watch & Shop", description: "Watch Newvora reels and shop the looks — tap any product to buy." };

export default async function ReelsPage() {
  const reels = await getShoppableReels();
  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-5"><Back label="Back" /></div>
      <ReelsSection reels={reels} />
    </div>
  );
}
