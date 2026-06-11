export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D4AF37] rounded-full animate-spin"></div>
      
      {/* Brand Name */}
      <h2 className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-400 font-light">
        Shagun Ratna
      </h2>
    </div>
  );
}