"use client";

import Skeleton from 'react-loading-skeleton';

// Mirrors the real product card's own layout classes (same aspect ratio,
// alignment, line count) so the placeholder is always the exact size of the
// content it's standing in for — no hand-tuned pixel heights/widths per page.
export default function ProductCardSkeleton({
  aspectClassName = 'aspect-[4/5]',
  centered = false,
  showCategoryLine = false,
}) {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : ''}`}>
      <div className={`${aspectClassName} w-full rounded-2xl overflow-hidden`}>
        <Skeleton height="100%" className="!block" />
      </div>
      <div className={`pt-4 w-full ${centered ? 'flex flex-col items-center' : ''}`}>
        {showCategoryLine && (
          <div className="w-1/4 mb-2">
            <Skeleton height={10} />
          </div>
        )}
        <div className={centered ? 'w-2/3' : 'w-3/4'}>
          <Skeleton height={centered ? 20 : 18} />
        </div>
        <div className="w-1/3 mt-2">
          <Skeleton height={14} />
        </div>
      </div>
    </div>
  );
}
