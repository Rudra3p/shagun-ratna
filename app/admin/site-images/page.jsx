"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SiteImagesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/home-page');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-300">
      <div className="w-12 h-12 rounded-full bg-[#90060c]/10 text-[#90060c] flex items-center justify-center mb-4">
        <Sparkles size={24} />
      </div>
      <h1 className="text-xl font-serif text-[#1A1A1A] mb-2 font-bold">
        Site Media is Now Inline in Page Studios
      </h1>
      <p className="text-sm font-sans text-gray-500 max-w-md mb-6">
        Images and videos are now editable directly on the mirrored Home and About pages in the admin dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/admin/home-page"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#90060c] text-white rounded-full text-xs font-sans uppercase tracking-wider font-semibold shadow hover:bg-[#730509] transition-all"
        >
          <span>Go to Home Page Studio</span>
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/admin/about-page"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-[#C5A059] text-[#1A1A1A] rounded-full text-xs font-sans uppercase tracking-wider font-semibold shadow hover:bg-[#FAF7F2] transition-all"
        >
          <span>Go to About Page Studio</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
