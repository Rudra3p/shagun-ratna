"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState(null);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check localStorage for active session
    const name = localStorage.getItem("shagun_user_name");
    if (name) {
      setUserName(name);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md h-20 shadow-sm border-b border-[#C5A059]/20' 
        : 'bg-transparent h-24 border-b border-transparent'
    } flex items-center justify-between px-16 text-[#90060c]`}>
      
      {/* Brand Name on the Left */}
      <Link href="/" className="h-[55px] w-[110px] relative transition-transform duration-500 hover:scale-[1.03]">
        <Image 
          src="/shagunratnalogo.png" 
          alt="Shagun Ratna Logo" 
          fill 
          sizes="110px"
          className="object-contain"
          priority
        />
      </Link>  

      {/* Links in the Center */}
      <div className="flex gap-12 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
          <NavLink 
            key={item} 
            label={item} 
            href={item === 'Collection' && userName ? '/my-collection' : undefined}
          />
        ))}
      </div>

      {/* Actions on the Right */}
      <div className="flex items-center gap-10 font-sans text-xs tracking-[0.2em] font-semibold">
        {userName ? (
          <NavLink 
            label="Profile"
            href="/my-profile" 
            className="border border-[#90060c] text-[#90060c] px-6 py-2.5 rounded-full hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500 text-[11px] tracking-[0.25em]" 
            noUnderline 
          />
        ) : (
          <NavLink 
            label="Sign In"
            href="/signin" 
            className="border border-[#90060c] text-[#90060c] px-6 py-2.5 rounded-full hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500 text-[11px] tracking-[0.25em]" 
            noUnderline 
          />
        )}
        <Link 
          href="/my-inquiry" 
          className="hover:text-[#C5A059] transition-colors duration-500 flex items-center gap-1.5"
          title="My Inquiries"
        >
          <ClipboardList size={22} strokeWidth={1.25} />
        </Link>
      </div>
    </nav>
  );
};

const NavLink = ({ label, href, className, children, noUnderline }) => (
  <Link 
    href={href || `/${label?.toLowerCase() === 'home' ? '' : label?.toLowerCase() || ''}`} 
    className={`relative group flex items-center ${className || ''}`}
  >
    <span className="transition-colors duration-500 group-hover:text-[#C5A059]">{children || label}</span>
    {/* Underline renders only if it's text (has label) AND noUnderline is not set */}
    {label && !noUnderline && (
      <span className="absolute left-1/2 -bottom-1.5 h-[1px] w-0 bg-[#C5A059] transition-all duration-500 group-hover:w-full group-hover:left-0" />
    )}
  </Link>
);

export default Navbar;