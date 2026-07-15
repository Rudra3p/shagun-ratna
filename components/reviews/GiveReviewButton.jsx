"use client";

import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { goToProtectedRoute } from "@/lib/authRedirect";

export default function GiveReviewButton() {
  const router = useRouter();

  const handleClick = () => {
    goToProtectedRoute(router, "/reviews/give-reviews");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full bg-[#90060c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#faf3e5] transition hover:bg-[#6f0509]"
    >
      <MessageSquarePlus size={16} />
      Give Feedback
    </button>
  );
}
