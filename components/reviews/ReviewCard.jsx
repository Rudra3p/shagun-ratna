"use client";

import { Star, ExternalLink } from "lucide-react";
import ReviewerAvatar from "@/components/reviews/ReviewerAvatar";

const GoogleIcon = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

function cleanReviewText(rawText = "") {
  // Strip leading star emojis like "⭐⭐⭐⭐⭐\n\n" that some reviewers type manually
  return rawText.replace(/^[⭐\s*]+/, "").trim();
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function ReviewCard({ review }) {
  const cleanedText = cleanReviewText(review.text);
  const formattedDate = formatDate(review.reviewDate || review.createdAt);

  return (
    <article className="break-inside-avoid mb-6 rounded-2xl border border-[#C5A059]/25 bg-[#FAF7F2]/90 backdrop-blur-sm p-6 sm:p-7 shadow-[0_2px_12px_rgba(144,6,12,0.03)] hover:shadow-md hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header: Stars & Google Badge */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EBE3D5]/80">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                size={15}
                className={value <= Number(review.rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#A8A196]">
            <GoogleIcon size={12} />
            <span>Verified</span>
            {formattedDate && (
              <>
                <span>•</span>
                <span>{formattedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Review Text */}
        <p className="font-sans text-xs sm:text-[13px] leading-[1.8] text-[#2D2926]/85 tracking-[0.02em] whitespace-pre-line mb-6">
          &ldquo;{cleanedText}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-3 border-t border-[#EBE3D5]/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ReviewerAvatar src={review.authorImage} name={review.name} size={40} />
          <div className="min-w-0">
            <h4 className="truncate font-brand text-lg text-[#1a1a1a] font-normal leading-tight">
              {review.name}
            </h4>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#C5A059] font-semibold mt-0.5">
              Patron • Ahmedabad
            </p>
          </div>
        </div>

        {review.reviewUrl && (
          <a
            href={review.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#A8A196] hover:text-[#90060C] hover:bg-[#90060C]/5 transition-colors shrink-0"
            title="View original review on Google Maps"
            aria-label="View original review on Google Maps"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
