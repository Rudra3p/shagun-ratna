"use client";

import Skeleton from 'react-loading-skeleton';

// Mirrors app/collection/[id]/page.jsx's real two-column layout exactly.
export default function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden">
        <Skeleton height="100%" className="!block" />
      </div>
      <div className="pt-2 space-y-4">
        <div className="w-1/3">
          <Skeleton height={12} />
        </div>
        <div className="w-2/3">
          <Skeleton height={36} />
        </div>
        <div className="w-1/4">
          <Skeleton height={24} />
        </div>
      </div>
    </div>
  );
}
