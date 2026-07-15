import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyUserSession } from "@/lib/verifyUserSession";
import GiveReviewForm from "@/components/reviews/GiveReviewForm";

export const metadata = {
  title: "Give a Review",
  description: "Sign in to share your experience with Shagun Ratna and help us shape future collections.",
  alternates: {
    canonical: "https://shagunratna.com/reviews/give-reviews",
  },
};

export default async function GiveReviewsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const userId = await verifyUserSession(cookieHeader);
  if (!userId) {
    redirect("/auth?redirect=/reviews/give-reviews");
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <GiveReviewForm />
      </div>
    </main>
  );
}
