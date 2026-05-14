'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to your console for debugging
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h2 className="text-2xl font-serif text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-8">We’re having trouble loading the collection right now.</p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition"
        >
          Try Again
        </button>
        <a href="/" className="border border-black px-6 py-2 hover:bg-gray-50 transition">
          Go Home
        </a>
      </div>
    </div>
  );
}