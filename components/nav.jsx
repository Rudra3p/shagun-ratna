"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Sparkles } from 'lucide-react'; // Added Menu and X icons
import Image from 'next/image';
import Link from 'next/link';
import { useSurvey } from '@/components/SurveyProvider';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const { survey, openSurvey } = useSurvey();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md h-20 shadow-sm border-b border-[#C5A059]/20' 
          : 'bg-transparent h-24 border-b border-transparent'
      } flex items-center justify-between px-6 md:px-16 text-[#90060c]`}>
        
        {/* Brand Name on the Left */}
        <Link href="/" className="h-[45px] w-[90px] md:h-[55px] md:w-[110px] relative transition-transform duration-500 hover:scale-[1.03]">
          <Image 
            src="/shagunratnalogo.webp"
            alt="Shagun Ratna Logo" 
            fill 
            sizes="(max-width: 768px) 90px, 110px"
            className="object-contain"
            priority
          />
        </Link>  

        {/* Links in the Center - Hidden on Mobile */}
        <div className="hidden md:flex gap-8 lg:gap-12 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
          {['Home', 'Collection', 'About', 'Contact'].map((item) => (
            <NavLink 
              key={item} 
              label={item} 
              href={item === 'Collection' ? '/collection' : undefined}
            />
          ))}
        </div>

        {/* Actions on the Right - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 font-sans text-xs tracking-[0.2em] font-semibold">
          <button
            type="button"
            onClick={openSurvey}
            className="flex items-center gap-2 border border-[#90060c] text-[#90060c] px-5 py-2.5 rounded-full hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500 text-[11px] tracking-[0.25em] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c] focus-visible:ring-offset-2"
          >
            <Sparkles size={13} strokeWidth={2} />
            {survey ? survey.name.split(' ')[0] : 'For You'}
          </button>
          <Link
            href="/liked-collection"
            className="hover:text-[#C5A059] transition-colors duration-500 flex items-center gap-1.5"
            title="Liked Collection"
          >
            <Heart size={22} strokeWidth={1.25} />
          </Link>
        </div>

        {/* Mobile Toggle & Liked Collection Icon Container */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href="/liked-collection"
            className="hover:text-[#C5A059] transition-colors duration-500 flex items-center"
            title="Liked Collection"
          >
            <Heart size={22} strokeWidth={1.25} />
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none p-1"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[300px] z-40 bg-white/98 shadow-2xl backdrop-blur-md border-l border-[#C5A059]/10 transition-transform duration-500 ease-in-out pt-28 px-10 text-[#90060c] flex flex-col gap-8 font-sans font-semibold tracking-[0.2em] uppercase ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
          <NavLink 
            key={item} 
            label={item} 
            href={item === 'Collection' ? '/collection' : undefined}
            className="text-sm py-2 block border-b border-[#90060c]/10"
          />
        ))}
        
        <div className="mt-4 pt-4 border-t border-[#90060c]/20 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => { setIsOpen(false); openSurvey(); }}
            className="flex items-center justify-center gap-2 border border-[#90060c] text-[#90060c] px-6 py-3 rounded-full hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]"
          >
            <Sparkles size={14} strokeWidth={2} />
            {survey ? survey.name.split(' ')[0] : 'For You'}
          </button>
        </div>
      </div>
    </>
  );
};

const NavLink = ({ label, href, className, children, noUnderline }) => (
  <Link 
    href={href || `/${label?.toLowerCase() === 'home' ? '' : label?.toLowerCase() || ''}`} 
    className={`relative group flex items-center ${className || ''}`}
  >
    <span className="transition-colors duration-500 group-hover:text-[#C5A059]">{children || label}</span>
    {label && !noUnderline && (
      <span className="absolute left-1/2 -bottom-1.5 h-[1px] w-0 bg-[#C5A059] transition-all duration-500 group-hover:w-full group-hover:left-0" />
    )}
  </Link>
);

export default Navbar;