import GiveReviewForm from "@/components/reviews/GiveReviewForm";

export const metadata = {
  title: "Give a Review",
  description: "Share your experience with Shagun Ratna and help us shape future collections — no account needed.",
  alternates: {
    canonical: "https://shagunratna.com/reviews/give-reviews",
  },
};

export default function GiveReviewsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <GiveReviewForm />
      </div>
    </main>
  );
}
