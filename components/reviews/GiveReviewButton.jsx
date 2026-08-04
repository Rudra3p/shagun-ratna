import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

export default function GiveReviewButton() {
  return (
    <Link
      href="/reviews/give-reviews"
      className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#90060c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#faf3e5] shadow-sm transition-all duration-300 hover:bg-[#6f0509] hover:shadow-lg hover:shadow-[#90060c]/20 active:scale-[0.98]"
    >
      <MessageSquarePlus size={16} className="transition-transform duration-300 group-hover:rotate-6" />
      Give Feedback
    </Link>
  );
}
