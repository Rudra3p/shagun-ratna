"use client";

import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to detect scroll and add blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-[#faf3e5]/80 backdrop-blur-md py-4' : 'bg-transparent py-6'} flex items-center justify-between px-12`}>
      {/* Brand */}
      <div className="font-serif text-lg font-bold text-[#90060c]">SR</div>

      {/* Primary Navigation */}
      <div className="flex gap-10 font-sans text-[11px] uppercase tracking-[0.25em] text-[#90060c]">
        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
          <NavLink key={item} label={item} />
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-8 font-sans text-[11px] uppercase tracking-[0.25em] text-[#90060c]">
        <button className="hover:opacity-50 transition-opacity duration-500">Sign In</button>
        <button className="hover:opacity-50 transition-opacity duration-500">Cart</button>
      </div>
    </nav>
  );
};

// Helper component for consistent link styling
const NavLink = ({ label }) => (
  <a href="#" className="hover:opacity-50 transition-opacity duration-500">
    {label}
  </a>
);

export default Navbar;