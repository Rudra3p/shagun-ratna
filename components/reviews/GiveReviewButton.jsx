import { ExternalLink } from "lucide-react";
import { GOOGLE_REVIEW_URL } from "@/lib/googleReview";

// Reviews are collected on the Google Business listing rather than on-site, so this
// hands the visitor straight over instead of opening an in-app form.
export default function GiveReviewButton() {
  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#90060c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#faf3e5] shadow-sm transition-all duration-300 hover:bg-[#6f0509] hover:shadow-lg hover:shadow-[#90060c]/20 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c] focus-visible:ring-offset-2"
    >
      Review Us on Google
      <ExternalLink size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}
