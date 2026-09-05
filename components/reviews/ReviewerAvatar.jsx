"use client";

import { useState } from "react";

// Turns "Priya Sharma" into "PS" — the fallback when Google gives us no photo.
const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase() || "★";

// The circle beside a reviewer's name: their Google profile photo when the review
// was imported with one, otherwise their initials. Never a product shot — a
// jewellery thumbnail sitting in an avatar slot reads as the person who wrote it.
export default function ReviewerAvatar({ src, name, size = 44, className = "" }) {
  // Google's photo URLs do rot — fall back to initials rather than a broken image.
  const [failed, setFailed] = useState(false);

  const base = `shrink-0 rounded-full ring-1 ring-[#C5A059]/40 ${className}`;
  const dimensions = { width: size, height: size };

  if (src && !failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={name ? `${name}'s Google profile photo` : ""}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={dimensions}
        className={`${base} object-cover bg-[#f4ece0]`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...dimensions, fontSize: Math.round(size * 0.34) }}
      className={`${base} grid place-items-center bg-[#90060c]/8 font-semibold tracking-[0.05em] text-[#90060c] select-none`}
    >
      {initialsOf(name)}
    </span>
  );
}
