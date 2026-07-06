"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, Star } from "lucide-react";

const emptyForm = {
  name: "",
  product: "",
  text: "",
};

export default function GiveReviewForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setIsSuccess(false);

    if (!formData.name.trim() || !formData.product.trim() || !formData.text.trim()) {
      setErrorMessage("Please fill in your name, product, and review.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          product: formData.product,
          text: formData.text,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Unable to submit review. Please try again.");
        return;
      }

      setIsSuccess(true);
      setFormData(emptyForm);
      setRating(5);
    } catch (error) {
      console.error("Review submission failed:", error);
      setErrorMessage("A network error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[#C5A059]/20 bg-[#fffaf2] p-8 shadow-[0_20px_80px_rgba(144,6,12,0.08)] md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C5A059]">Customer Voices</p>
      <h1 className="mt-4 text-4xl font-light tracking-[0.12em] text-[#1a1a1a] uppercase md:text-5xl">
        Leave a <span className="text-[#90060c]">Review</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5a53] md:text-base">
        Tell us about your experience with Shagun Ratna. Your feedback helps us shape future collections and refine the service we offer.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Your Name">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#C5A059]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#90060c]"
              placeholder="Enter your name"
            />
          </Field>

          <Field label="Product Name">
            <input
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#C5A059]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#90060c]"
              placeholder="e.g. Midnight Crimson Necklace"
            />
          </Field>
        </div>

        <Field label="Your Review">
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-2xl border border-[#C5A059]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#90060c]"
            placeholder="Share what you loved about the piece, the craftsmanship, or your experience."
          />
        </Field>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5f5a53]">Rating</p>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="rounded-full p-1 transition hover:scale-110"
                aria-label={`${value} star rating`}
              >
                <Star
                  size={26}
                  className={value <= rating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-[#5f5a53]">{rating} / 5</span>
          </div>
        </div>

        {errorMessage ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}

        {isSuccess ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            Thank you. Your review has been submitted.
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#90060c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#faf3e5] transition hover:bg-[#6f0509] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Submit Review
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-[#5f5a53]">{label}</span>
      {children}
    </label>
  );
}
