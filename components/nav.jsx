"use client";

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react'; // Importing the cart icon

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-[#faf3e5]/90 backdrop-blur-md py-4 border-b border-[#90060c]/20' 
        : 'bg-transparent py-6 border-b border-transparent'
    } flex items-center justify-between px-12 text-[#90060c]`}>
      
      {/* Left Links */}
      <div className="flex gap-8 font-sans text-[11px] uppercase tracking-[0.25em] font-medium">
        <NavLink label="Home" />
        <NavLink label="Collection" />
      </div>

      {/* Center Brand Name */}
      <div className="font-serif text-2xl font-bold tracking-tight">
        ShagunRatna
      </div>

      {/* Right Links & Actions */}
      <div className="flex items-center gap-8 font-sans text-[11px] uppercase tracking-[0.25em]">
        <NavLink label="About" />
        <NavLink label="Contact" />
        
        {/* Sign In Button with Maroon BG and White text */}
        <button className="bg-[#90060c] text-white px-5 py-2 rounded-sm hover:bg-[#90060c]/90 transition-all duration-500">
          Sign In
        </button>

        {/* Cart Icon only */}
        <button className="hover:opacity-50 transition-opacity duration-500">
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ label }) => (
  <a href={`/${label.toLowerCase()}`} className="hover:opacity-50 transition-opacity duration-500">
    {label}
  </a>
);

export default Navbar;