export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* A simple, elegant gold-colored spinner */}
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
      <h2 className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-light">
        Shagun Ratna
      </h2>
    </div>
  );
}