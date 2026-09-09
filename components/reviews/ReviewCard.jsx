"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import ReviewerAvatar from "@/components/reviews/ReviewerAvatar";

export default function ReviewCard({ review }) {
  const reviewTextRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [canReadMore, setCanReadMore] = useState(false);

  useEffect(() => {
    const textElement = reviewTextRef.current;
    if (!textElement) return;

    setCanReadMore(textElement.scrollHeight > textElement.clientHeight + 1);
  }, [review.text]);

  return (
    <article className="aspect-4/6 min-h-0 rounded-2xl border border-[#C5A059]/15 bg-[#fffaf2] p-4 flex flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ReviewerAvatar src={review.authorImage} name={review.name} size={40} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#90060c]">{review.name}</p>
            <p className="truncate text-xs uppercase tracking-[0.18em] text-[#8d7f69]">{review.product}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              size={14}
              className={value <= Number(review.rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"}
            />
          ))}
        </div>
      </div>

      <div
        ref={reviewTextRef}
        className={`mt-3 min-h-0 overflow-y-auto pr-2 text-sm leading-6 text-[#5f5a53] ${
          expanded ? "max-h-52" : "max-h-26"
        }`}
      >
        {review.text}
      </div>
      {canReadMore && (
        <button
          type="button"
          onClick={() => setExpanded((isExpanded) => !isExpanded)}
          className="mt-2 self-start text-[10px] uppercase tracking-[0.2em] text-[#90060c] underline underline-offset-4"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </article>
  );
}
