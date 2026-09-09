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
    <article className="aspect-4/5 min-h-0 rounded-2xl border border-[#C5A059]/15 bg-[#fffaf2] p-6 md:p-8 flex flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              size={21}
              className={value <= Number(review.rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"}
            />
          ))}
        </div>

        <span className="font-brand text-6xl text-[#C5A059]/30 select-none block h-4 leading-none mb-4">&ldquo;</span>
        <div
          ref={reviewTextRef}
          className={`min-h-0 pr-2 italic text-sm leading-[1.8] tracking-[0.04em] text-[#5f5a53] ${
            expanded ? "max-h-52 overflow-y-auto" : "max-h-26 overflow-hidden"
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
      </div>

      <div className="shrink-0 pt-5">
        <div className="h-[1px] w-8 bg-[#C5A059]/40 mb-4" />
        <div className="flex items-center gap-3">
          <ReviewerAvatar src={review.authorImage} name={review.name} size={44} />
          <div className="min-w-0">
            <h4 className="truncate font-brand text-xl text-[#90060c] font-normal">{review.name}</h4>
            <p className="truncate text-[9px] uppercase tracking-[0.25em] text-[#C5A059] mt-2 font-bold">{review.product}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
