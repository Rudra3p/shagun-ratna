import { Star } from "lucide-react";
import dbConnect from "@/db/db";
import { getReviews } from "@/controllers/reviewsController";
import GiveReviewButton from "@/components/reviews/GiveReviewButton";
import ReviewerAvatar from "@/components/reviews/ReviewerAvatar";

// Reviews are added in the admin panel, so this page has to re-render for a new one
// to appear. Without a revalidate it bakes at build time and a review added today
// wouldn't show until the next deploy. Five minutes matches /collection.
export const revalidate = 300;

async function getPageReviews() {
  await dbConnect();
  const response = await getReviews(
    new Request("http://internal/api/reviews?approved=true&limit=6")
  );
  const data = await response.json();

  return { reviews: data?.reviews || [], total: data?.total || 0 };
}

export default async function ReviewsPage() {
  const { reviews, total } = await getPageReviews();

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shagun Ratna",
    url: "https://shagunratna.com",
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      itemReviewed: { "@type": "Product", name: review.product },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.text,
    })),
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-16 md:px-10 lg:px-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-[#C5A059]/20 bg-[#fffaf2] p-8 shadow-[0_20px_80px_rgba(144,6,12,0.08)] md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C5A059]">Customer Voices</p>
            <h1 className="mt-4 text-4xl font-light tracking-[0.12em] text-[#1a1a1a] uppercase md:text-5xl">
              Customer <span className="text-[#90060c]">Reviews</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5a53] md:text-base">
              See what customers are saying about their Shagun Ratna pieces. Visited the boutique?
              Share your experience on our Google listing — it helps others find us.
            </p>
          </div>
          <GiveReviewButton />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[#C5A059]/20 bg-white p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d7f69]">Total Reviews</p>
            <p className="mt-3 text-4xl font-light text-[#90060c]">{total}</p>
          </div>

          {/* Replaced the old "Your Review" panel — that relied on a signed-in userId,
              and the site no longer has accounts. Average rating is a better use of the
              space and needs no identity. */}
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[#C5A059]/20 bg-white p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d7f69]">Average Rating</p>
            {averageRating ? (
              <>
                <p className="mt-3 text-4xl font-light text-[#90060c]">{averageRating.toFixed(1)}</p>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={14}
                      className={value <= Math.round(averageRating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-[#5f5a53]">
                No ratings yet — be the first to share your experience.
              </p>
            )}
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#C5A059]/20 bg-white p-8">
            <h2 className="text-lg font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]">What Customers Are Saying</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-2xl border border-[#C5A059]/15 bg-[#fffaf2] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ReviewerAvatar src={review.authorImage} name={review.name} size={40} />
                      <div>
                        <p className="font-semibold text-[#90060c]">{review.name}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#8d7f69]">{review.product}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star key={value} size={14} className={value <= Number(review.rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a53]">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
