"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import PageDivider from '@/components/PageDivider';

const WhatsAppIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Contact() {
  const [inquiredProduct, setInquiredProduct] = useState('');

  useEffect(() => {
    const productParam = new URLSearchParams(window.location.search).get('product');
    if (productParam) {
      setInquiredProduct(productParam);
    }
  }, []);

  const whatsappMessage = inquiredProduct 
    ? `Namaste Shagun Ratna, I would like to inquire about "${inquiredProduct}". Please share piece availability, specifications, and certified gemstone details.`
    : `Namaste Shagun Ratna, I would like to inquire about your certified gemstone and luxury jewelry collections.`;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] pt-24 md:pt-28 pb-24 px-6 md:px-12 lg:px-20 relative">
      {/* Background luxury subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.08] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Editorial Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-4"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-3">
            Atelier Directory & Salons • Ahmedabad
          </span>
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl text-[#90060C] font-light tracking-[0.08em] uppercase leading-tight">
            Connect With Us
          </h1>
          <p className="mt-4 font-sans text-xs sm:text-sm text-[#1a1a1a]/70 leading-relaxed tracking-wide max-w-xl mx-auto">
            Direct access to our master jewellers and certified gemstone advisors for bespoke creations, Vedic astrology consultations, or private showroom visits.
          </p>
        </motion.div>

        {/* Selected Product Ribbon if navigated from a piece */}
        {inquiredProduct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-[#C5A059] shrink-0" />
              <p className="text-xs text-[#1a1a1a]">
                <span className="text-[#A8A196] uppercase tracking-wider text-[10px] mr-2">Inquiring About:</span>
                <strong className="font-brand text-base text-[#90060C] font-normal">{inquiredProduct}</strong>
              </p>
            </div>
            <a
              href={`https://wa.me/919558888754?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-[#075e54] hover:text-[#90060C] font-semibold transition-colors"
            >
              <WhatsAppIcon size={16} className="text-[#25D366]" />
              <span>Continue on WhatsApp →</span>
            </a>
          </motion.div>
        )}

        <PageDivider className="py-4 md:py-6" />

        {/* Editorial 2-Column Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-6">
          
          {/* Left Column: Direct Atelier Concierge */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                Immediate Channels
              </span>
              <h2 className="font-brand text-2xl md:text-3xl text-[#1a1a1a] font-normal tracking-wide">
                Direct Atelier Inquiries
              </h2>
            </div>

            {/* Ledger Item: WhatsApp */}
            <div className="pb-8 border-b border-[#EBE3D5]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[#25D366]"><WhatsAppIcon size={17} /></span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#A8A196]">
                  WhatsApp Concierge • Fastest Response
                </span>
              </div>
              <p className="font-brand text-2xl text-[#90060C] mb-3 font-light">
                +91 95588 88754
              </p>
              <a
                href={`https://wa.me/919558888754?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#90060C] hover:text-[#730509] font-semibold group"
              >
                <span>Initiate WhatsApp Conversation</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Ledger Item: Direct Phone */}
            <div className="pb-8 border-b border-[#EBE3D5]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[#90060C]"><Phone size={16} /></span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#A8A196]">
                  Telephone Consultations
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-4">
                <a 
                  href="tel:+919558888754" 
                  className="font-brand text-2xl text-[#1a1a1a] hover:text-[#90060C] font-light transition-colors"
                >
                  +91 95588 88754
                </a>
                <span className="text-[#C5A059]">•</span>
                <a 
                  href="tel:+919265682478" 
                  className="font-brand text-2xl text-[#1a1a1a] hover:text-[#90060C] font-light transition-colors"
                >
                  092656 82478
                </a>
              </div>
            </div>

            {/* Ledger Item: Email */}
            <div className="pb-8 border-b border-[#EBE3D5]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[#C5A059]"><Mail size={16} /></span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#A8A196]">
                  Client Services & Appraisals
                </span>
              </div>
              <div className="space-y-1">
                <p>
                  <a 
                    href="mailto:shagunratna88@yahoo.com" 
                    className="font-sans text-sm text-[#1a1a1a] hover:text-[#90060C] transition-colors underline underline-offset-4 decoration-[#C5A059]/50"
                  >
                    shagunratna88@yahoo.com
                  </a>
                </p>
                <p>
                  <a 
                    href="mailto:digwa.gurjot@gmail.com" 
                    className="font-sans text-sm text-[#1a1a1a] hover:text-[#90060C] transition-colors underline underline-offset-4 decoration-[#C5A059]/50"
                  >
                    digwa.gurjot@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Ledger Item: Social Media */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#DD2A7B]"><InstagramIcon size={16} /></span>
                  <span className="text-[#1877F2]"><FacebookIcon size={16} /></span>
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#A8A196]">
                  Atelier Media & Direct Message
                </span>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://ig.me/m/shagunratnagemsjewellers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.18em] text-[#90060C] hover:text-[#730509] font-semibold"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram DM</span>
                </a>
                <a
                  href="https://www.facebook.com/SHAGUNRATNA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.18em] text-[#1a1a1a]/80 hover:text-[#1877F2] font-semibold"
                >
                  <FacebookIcon size={14} className="text-[#1877F2]" />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Salons, Hours & Invitation */}
          <div className="lg:col-span-6 space-y-10 lg:pl-6 lg:border-l lg:border-[#EBE3D5]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                Showroom Salons
              </span>
              <h2 className="font-brand text-2xl md:text-3xl text-[#1a1a1a] font-normal tracking-wide">
                Boutique Locations
              </h2>
            </div>

            {/* Flagship Salon: Satellite */}
            <div className="pb-8 border-b border-[#EBE3D5]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#90060C]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#90060C]">
                  Flagship Boutique
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-light mb-2">
                Satellite Salon
              </h3>
              <address className="not-italic font-sans text-xs text-[#1a1a1a]/80 leading-relaxed mb-3">
                Shagun Ratna, GF/9, Akshar Complex,<br />
                Beside Harit Zaveri, Shivranjani Cross Road,<br />
                Satellite, Ahmedabad, Gujarat 380015
              </address>
              <div className="flex items-center gap-2 text-xs text-[#A8A196]">
                <Clock size={13} className="text-[#C5A059]" />
                <span>Mon – Sat: 11:00 AM – 8:00 PM</span>
              </div>
            </div>

            {/* Heritage Salon: Manek Chowk */}
            <div className="pb-8 border-b border-[#EBE3D5]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#C5A059]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#A8A196]">
                  Historic Gem Quarter
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-light mb-2">
                Manek Chowk Salon
              </h3>
              <address className="not-italic font-sans text-xs text-[#1a1a1a]/80 leading-relaxed mb-3">
                Shagun Ratna, Shop No. 16, Chanlla Oll,<br />
                Manek Chowk Road, Old City, Danapidth, Khadia,<br />
                Ahmedabad, Gujarat 380001
              </address>
              <div className="flex items-center gap-2 text-xs text-[#A8A196]">
                <Clock size={13} className="text-[#C5A059]" />
                <span>Mon – Sat: 11:00 AM – 8:00 PM</span>
              </div>
            </div>

            {/* Private Appointment Luxury Note */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none rounded-full" />
              <h4 className="font-brand text-lg text-[#90060C] font-normal mb-2">
                Private Viewing by Appointment
              </h4>
              <p className="font-sans text-xs text-[#1a1a1a]/75 leading-relaxed mb-4">
                We warmly welcome patrons for one-on-one Jyotish astrological consultations and private bridal viewings on Sundays or after showroom hours. Please notify us in advance so our senior gemmologist is personally available for you.
              </p>
              <a
                href={`https://wa.me/919558888754?text=${encodeURIComponent("Namaste Shagun Ratna, I would like to schedule a private appointment for a gemstone consultation.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-[#90060C] font-semibold hover:text-[#730509]"
              >
                <span>Reserve An Appointment →</span>
              </a>
            </div>

          </div>

        </div>

        {/* Showroom Interactive Maps */}
        <div className="mt-16 pt-8 border-t border-[#EBE3D5]">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-sans text-[10px] tracking-[0.3em] font-bold uppercase text-[#C5A059]">
              Showroom Directions & Interactive Maps
            </h3>
            <div className="h-[1px] flex-1 bg-[#C5A059]/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-brand text-xl tracking-[0.08em] text-[#90060c] uppercase font-light">
                  Satellite Boutique (Shivranjani)
                </h4>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Shagunratna%20Gems%20%26%20Jewellers&query_place_id=ChIJCXuSoJGbXjkRpYb16Lvjb4o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-sans uppercase tracking-widest text-[#A8A196] hover:text-[#90060C] transition-colors"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-sm h-[320px] md:h-[380px] relative bg-[#FAF7F2]">
                <iframe
                  src="https://www.google.com/maps?q=Shagunratna+Gems+%26+Jewellers,+23.0245069,+72.5288626&z=17&output=embed"
                  title="Shagun Ratna Satellite boutique map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contrast-105 opacity-95 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-brand text-xl tracking-[0.08em] text-[#90060c] uppercase font-light">
                  Manek Chowk Boutique
                </h4>
                <a
                  href="https://www.google.com/maps?q=Shagun+Ratna,+Shop+No.+16,+Chanlla+Oll,+Manek+Chowk+Road,+Old+City,+Danapidth,+Khadia,+Ahmedabad,+Gujarat+380001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-sans uppercase tracking-widest text-[#A8A196] hover:text-[#90060C] transition-colors"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-sm h-[320px] md:h-[380px] relative bg-[#FAF7F2]">
                <iframe
                  src="https://www.google.com/maps?q=Shagun+Ratna,+Shop+No.+16,+Chanlla+Oll,+Manek+Chowk+Road,+Old+City,+Danapidth,+Khadia,+Ahmedabad,+Gujarat+380001&z=17&output=embed"
                  title="Shagun Ratna Manek Chowk boutique map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contrast-105 opacity-95 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
