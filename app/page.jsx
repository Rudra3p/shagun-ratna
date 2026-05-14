import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gray-100">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-4">
            Shagun Ratna
          </h1>
          <p className="text-lg md:text-xl text-gray-600 uppercase tracking-[0.2em] mb-8">
            Exquisite Handcrafted Jewelry
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800 transition">
            Explore Collection
          </button>
        </div>
        {/* Placeholder for a high-quality jewelry background image */}
        <div className="absolute inset-0 opacity-40">
           {/* <Image src="/hero-jewelry.jpg" fill className="object-cover" alt="Hero" /> */}
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES (The Shop Part) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-12">Our Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-200 mb-4 overflow-hidden relative">
              {/* Image goes here */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </div>
            <h3 className="text-xl font-medium text-center">Gold Rings</h3>
          </div>

          <div className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-200 mb-4 overflow-hidden relative">
              {/* Image goes here */}
            </div>
            <h3 className="text-xl font-medium text-center">Diamond Necklaces</h3>
          </div>

          <div className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-200 mb-4 overflow-hidden relative">
              {/* Image goes here */}
            </div>
            <h3 className="text-xl font-medium text-center">Premium Earrings</h3>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION FOR ADMIN (Only for you) */}
      <footer className="py-10 border-t text-center text-gray-400 text-sm">
        <p>© 2026 Shagun Ratna. Powered by Texnox.</p>
        <a href="/admin" className="mt-2 inline-block hover:underline">Staff Login</a>
      </footer>
    </main>
  );
}