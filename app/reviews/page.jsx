import { Star, MapPin, Sparkles, ExternalLink } from "lucide-react";
import dbConnect from "@/db/db";
import { getReviews } from "@/controllers/reviewsController";
import ReviewCard from "@/components/reviews/ReviewCard";
import PageDivider from "@/components/PageDivider";
import { GOOGLE_REVIEW_URL } from "@/lib/googleReview";
import Link from "next/link";

// Reviews are managed in the admin panel and fetched live from MongoDB.
// Revalidates every 5 minutes (matching /collection).
export const revalidate = 300;

const GoogleIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

async function getPageReviews() {
  await dbConnect();
  const response = await getReviews(
    new Request("http://internal/api/reviews?approved=true&limit=50")
  );
  const data = await response.json();

  return { reviews: data?.reviews || [], total: data?.total || 0 };
}

export const metadata = {
  title: "Patron Reviews & Experiences | Shagun Ratna",
  description: "Read genuine verified reviews from patrons of Shagun Ratna. Discover stories of bespoke bridal jewellery, certified Vedic gemstones, and artisanal craftsmanship in Ahmedabad.",
};

export default async function ReviewsPage() {
  const { reviews, total } = await getPageReviews();

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : 5.0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Shagun Ratna",
    url: "https://shagunratna.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "GF-5, Sheetal Varun, B/H Classic Gold Hotel, C.G. Road, Navrangpura",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      postalCode: "380009",
      addressCountry: "IN",
    },
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length || total || 1,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      itemReviewed: { "@type": "Product", name: review.product || "Fine Jewellery & Gemstones" },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.text,
    })),
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] pt-24 md:pt-28 pb-24 px-6 md:px-12 lg:px-20 relative">
      {/* Background luxury subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.08] pointer-events-none" />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Editorial Heading Header */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-[#C5A059]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold">
              Atelier Testimonials & Reflections
            </span>
            <span className="w-6 h-[1px] bg-[#C5A059]" />
          </div>

          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] font-normal tracking-[0.06em] uppercase leading-tight">
            Words of Our <span className="text-[#90060C] italic">Cherished Patrons</span>
          </h1>

          <p className="mt-4 font-sans text-xs sm:text-sm text-[#1a1a1a]/70 leading-relaxed tracking-wide max-w-2xl mx-auto">
            Every bespoke jewel, certified Vedic gemstone, and heirloom bridal creation carries a timeless personal journey.
            Read genuine reflections from patrons who have visited our Ahmedabad showrooms.
          </p>
        </header>

        {/* Unified Luxury Google Trust Bar */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="rounded-2xl border border-[#C5A059]/30 bg-[#FAF7F2]/90 backdrop-blur-sm p-5 sm:p-6 shadow-[0_4px_24px_rgba(197,160,89,0.06)] flex flex-col sm:flex-row items-center justify-between gap-5">
            
            {/* Left: Google Crest & Star Score */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EBE3D5] flex items-center justify-center shadow-xs shrink-0">
                <GoogleIcon size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-brand text-2xl text-[#1a1a1a] font-semibold leading-none">
                    {averageRating ? averageRating.toFixed(1) : "5.0"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={15}
                        className="fill-[#C5A059] text-[#C5A059]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#075e54] bg-[#25D366]/10 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <p className="text-[11px] font-sans text-[#7a7368] mt-1">
                  Based on <strong className="text-[#1a1a1a] font-medium">{total || reviews.length} verified reviews</strong> on Google Business Profile
                </p>
              </div>
            </div>

            {/* Right: Write Review Callout */}
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#90060C] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#faf3e5] shadow-sm transition-all duration-300 hover:bg-[#730509] hover:shadow-md hover:shadow-[#90060C]/20 active:scale-[0.98]"
            >
              <span>Review on Google</span>
              <ExternalLink size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>

          </div>
        </div>

        {/* Reviews Masonry Wall */}
        {reviews.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {reviews.map((review) => (
              <ReviewCard key={review._id || review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FAF7F2] rounded-2xl border border-[#EBE3D5] p-8">
            <Sparkles size={24} className="mx-auto text-[#C5A059] mb-3" />
            <h3 className="font-brand text-2xl text-[#1a1a1a]">Be Our First Featured Review</h3>
            <p className="font-sans text-xs text-[#7a7368] mt-2 max-w-md mx-auto">
              Have you recently visited our boutique? We would be deeply honored by your experience on our Google Business listing.
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#90060C] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#faf3e5]"
            >
              Write a Google Review →
            </a>
          </div>
        )}

        <PageDivider className="py-12 md:py-16" />

        {/* Elegant Bottom Invitation Card */}
        <section className="rounded-2xl border border-[#C5A059]/25 bg-gradient-to-b from-[#FAF7F2] to-[#FDFBF7] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
              Share Your Journey
            </span>

            <h2 className="font-brand text-3xl sm:text-4xl text-[#1a1a1a] font-normal tracking-wide">
              Have You Visited Our Ahmedabad Showroom?
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#1a1a1a]/70 leading-relaxed tracking-wide">
              Whether you consulted on an auspicious Vedic astrological gemstone or bespoke jewellery at our
              Satellite or Manek Chowk ateliers, your reflections guide fellow connoisseurs to certified authenticity and heirloom trust.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#90060C] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#faf3e5] shadow-sm hover:bg-[#730509] transition-all duration-300"
              >
                <span>Write a Google Review</span>
                <ExternalLink size={14} />
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A059]/60 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a1a1a] hover:border-[#90060C] hover:text-[#90060C] transition-all duration-300"
              >
                <MapPin size={14} className="text-[#C5A059]" />
                <span>Showroom Directions</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
