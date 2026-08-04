"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, Sparkles, Star } from "lucide-react";

const emptyForm = {
  name: "",
  product: "",
  text: "",
};

const MAX_REVIEW_LENGTH = 500;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function GiveReviewForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "text" && value.length > MAX_REVIEW_LENGTH) return;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

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
    } catch (error) {
      console.error("Review submission failed:", error);
      setErrorMessage("A network error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setRating(5);
    setHoverRating(0);
    setIsSuccess(false);
    setErrorMessage("");
  };

  const displayRating = hoverRating || rating;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#C5A059]/20 bg-[#fffaf2] p-8 shadow-[0_20px_80px_rgba(144,6,12,0.08)] md:p-12">
      {/* Decorative luxury dotted matrix, echoing the Contact page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full border border-[#C5A059]/15" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full border border-dashed border-[#C5A059]/15" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <span className="rounded-full border border-[#C5A059]/40 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            No Account Needed
          </span>
          <Sparkles size={14} className="text-[#C5A059]" />
        </motion.div>

        <motion.p variants={itemVariants} className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
          Customer Voices
        </motion.p>
        <motion.h1 variants={itemVariants} className="mt-4 text-4xl font-light tracking-[0.12em] text-[#1a1a1a] uppercase md:text-5xl">
          Leave a <span className="text-[#90060c]">Review</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5a53] md:text-base">
          Tell us about your experience with Shagun Ratna. Your feedback helps us shape future collections and refine the service we offer.
        </motion.p>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center justify-center py-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6 text-[#90060c]"
              >
                <CheckCircle2 size={64} strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-2xl font-light uppercase tracking-[0.12em] text-[#1a1a1a]">
                Thank You for Sharing
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5f5a53]">
                Your review has been received and will appear here once approved. We appreciate you taking the time.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-8 rounded-full border border-[#C5A059]/40 px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] transition-all duration-300 hover:bg-[#C5A059]/5"
              >
                Write Another Review
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Your Name">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#C5A059]/30 bg-[#FDFBF7]/65 px-4 py-3 text-sm text-[#2D2926] placeholder-gray-400 outline-none transition-all focus:border-[#90060c] focus:bg-white"
                    placeholder="Enter your name"
                  />
                </Field>

                <Field label="Product Name">
                  <input
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#C5A059]/30 bg-[#FDFBF7]/65 px-4 py-3 text-sm text-[#2D2926] placeholder-gray-400 outline-none transition-all focus:border-[#90060c] focus:bg-white"
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
                  maxLength={MAX_REVIEW_LENGTH}
                  className="w-full resize-none rounded-xl border border-[#C5A059]/30 bg-[#FDFBF7]/65 px-4 py-3 text-sm leading-relaxed text-[#2D2926] placeholder-gray-400 outline-none transition-all focus:border-[#90060c] focus:bg-white"
                  placeholder="Share what you loved about the piece, the craftsmanship, or your experience."
                />
                <span className="mt-1.5 block text-right text-[11px] text-[#A8A196]">
                  {formData.text.length}/{MAX_REVIEW_LENGTH}
                </span>
              </Field>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5f5a53]">Rating</p>
                <div
                  className="mt-3 flex items-center gap-1.5"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      className="rounded-full p-1 transition-transform duration-150 hover:scale-125 cursor-pointer"
                      aria-label={`${value} star rating`}
                    >
                      <Star
                        size={28}
                        className={`transition-colors duration-150 ${
                          value <= displayRating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#d8cbb4]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-[#5f5a53]">{rating} / 5</span>
                </div>
              </div>

              {errorMessage ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#90060c] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#faf3e5] shadow-sm transition-all duration-300 hover:bg-[#6f0509] hover:shadow-lg hover:shadow-[#90060c]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Submit Review
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
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
