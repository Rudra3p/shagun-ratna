"use client";

export default function PhilosophySection() {
  const pillars = [
    { title: "Purity", desc: "Every piece is a testament to the highest standard of 22K gold and certified stones." },
    { title: "Artistry", desc: "Our designs blend ancient Indian heritage with modern, sophisticated sensibilities." },
    { title: "Trust", desc: "Four decades of transparency have made us a name synonymous with Ahmedabad's elite." }
  ];

  return (
    <section className="py-24 px-6 bg-[#1a1a1a] text-[#faf3e5]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
        {pillars.map((pillar, i) => (
          <div key={i} className="text-center border-t border-[#C5A059]/20 pt-10">
            <h4 className="text-[#C5A059] uppercase text-xs tracking-[0.2em] mb-4">{pillar.title}</h4>
            <p className="text-sm opacity-70 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}