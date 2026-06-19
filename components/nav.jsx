"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
        ? 'bg-white/95 backdrop-blur-md h-14 border-b border-[#90060c]/20' 
        : 'bg-transparent h-16 border-b border-[#90060c]/10'
    } flex items-center justify-between px-12 text-[#90060c]`}>
      
      {/* Brand Name on the Left */}
      <div className="h-[45px] w-[90px] relative">
        <Image src="/shagunratnalogo.png" alt="Shagun Ratna Logo" fill />
      </div>  

      {/* Links in the Center */}
      <div className="flex gap-10 font-sans text-[11px] uppercase tracking-[0.25em] font-medium">
        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
          <NavLink key={item} label={item} />
        ))}
      </div>

      {/* Actions on the Right */}
      <div className="flex items-center gap-8 font-sans text-[11px] uppercase tracking-[0.25em]">
        <NavLink 
          label="Sign In"
          href="/signin" 
          className="bg-[#90060c] text-white px-5 py-2 rounded-sm hover:bg-[#90060c]/90 transition-all duration-500" 
          noUnderline 
        />
        <NavLink href="/my-inquiry" className="hover:opacity-50 transition-opacity duration-500">
          <ClipboardList size={20} strokeWidth={1.5} />
        </NavLink>
      </div>
    </nav>
  );
};

const NavLink = ({ label, href, className, children, noUnderline }) => (
  <Link 
    href={href || `/${label?.toLowerCase() || ''}`} 
    className={`relative group ${className || ''}`}
  >
    {children || label}
    {/* Underline renders only if it's text (has label) AND noUnderline is not set */}
    {label && !noUnderline && (
      <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#90060c] transition-all duration-500 group-hover:w-full" />
    )}
  </Link>
);

export default Navbar;