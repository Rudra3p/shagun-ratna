"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import PageDivider from '@/components/PageDivider';

const WhatsAppIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

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
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden pt-24 md:pt-28 pb-20 px-6 md:px-12 lg:px-24">
      {/* Background luxury dotted matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none z-0" />

      {/* Decorative Rotating Gold Rings */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#C5A059]/10 pointer-events-none z-0 select-none hidden lg:block" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-dashed border-[#C5A059]/15 pointer-events-none z-0 select-none hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-4"
        >
          <span className="text-[#C5A059] font-sans font-bold tracking-[0.3em] uppercase text-[10px] mb-2 block">
            Direct Concierge & Showrooms
          </span>
          <h1 className="font-brand text-4xl md:text-5xl text-[#90060c] tracking-[0.15em] uppercase font-light leading-tight">
            Connect With Us
          </h1>
          <p className="mt-3 font-sans text-xs sm:text-sm tracking-wide text-[#1a1a1a]/70 leading-relaxed max-w-xl mx-auto">
            Connect directly with our master jewellers and certified gemstone advisors via WhatsApp, direct call, or email.
          </p>
        </motion.div>

        {/* Product Banner if navigated from a product */}
        {inquiredProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-[#90060C]/5 border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#C5A059] shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">Selected Piece Inquiry</p>
                <h4 className="font-brand text-lg text-[#90060C] font-normal">{inquiredProduct}</h4>
              </div>
            </div>
            <a
              href={`https://wa.me/919558888754?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#075e54] hover:bg-[#128C7E] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
            >
              <WhatsAppIcon size={15} />
              <span>Inquire on WhatsApp</span>
            </a>
          </motion.div>
        )}

        {/* Page Divider */}
        <PageDivider className="py-4 md:py-6" />

        {/* Primary Contact Channels Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4"
        >
          {/* Channel 1: WhatsApp (Primary) */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#25D366]/40 hover:border-[#25D366] p-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-[#25D366]/15 rounded-xl text-[#075e54] border border-[#25D366]/30">
                  <WhatsAppIcon size={24} />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#075e54] bg-[#25D366]/15 px-2.5 py-1 rounded-full">
                  Instant Reply
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-normal mb-2">WhatsApp</h3>
              <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed mb-6">
                Direct chat with our master jeweller for live photos, gemstone lab certificates, and immediate quotes.
              </p>
            </div>
            <div>
              <a
                href={`https://wa.me/919558888754?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#075e54] hover:bg-[#128C7E] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>
              <p className="text-[11px] text-center text-[#1a1a1a]/60 mt-2.5 font-medium">+91 95588 88754</p>
            </div>
          </motion.div>

          {/* Channel 2: Direct Phone Call */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C5A059]/30 hover:border-[#90060C]/50 p-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-[#90060c]/10 rounded-xl text-[#90060c] border border-[#C5A059]/30">
                  <Phone size={22} />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#90060C] bg-[#90060C]/10 px-2.5 py-1 rounded-full">
                  Direct Line
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-normal mb-2">Direct Call</h3>
              <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed mb-6">
                Speak directly with our concierge team for bridal inquiries, appointments, and showroom viewings.
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+919558888754"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-[#C5A059]/30 hover:border-[#90060C] hover:bg-[#90060C]/5 rounded-xl text-xs text-[#1a1a1a] font-medium transition-colors"
                >
                  <span>+91 95588 88754</span>
                  <ArrowUpRight size={13} className="text-[#90060C]" />
                </a>
                <a
                  href="tel:+919265682478"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-[#C5A059]/30 hover:border-[#90060C] hover:bg-[#90060C]/5 rounded-xl text-xs text-[#1a1a1a] font-medium transition-colors"
                >
                  <span>092656 82478</span>
                  <ArrowUpRight size={13} className="text-[#90060C]" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Channel 3: Email Client Services */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C5A059]/30 hover:border-[#C5A059] p-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-[#C5A059]/15 rounded-xl text-[#7a602a] border border-[#C5A059]/40">
                  <Mail size={22} />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#7a602a] bg-[#C5A059]/15 px-2.5 py-1 rounded-full">
                  Client Services
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-normal mb-2">Email</h3>
              <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed mb-6">
                Send bespoke customization blueprints, horoscope charts, or corporate gifting requirements.
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:shagunratna88@yahoo.com"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059]/5 rounded-xl text-xs text-[#1a1a1a] font-medium transition-colors truncate"
                  title="shagunratna88@yahoo.com"
                >
                  <span className="truncate">shagunratna88@yahoo.com</span>
                  <ArrowUpRight size={13} className="text-[#C5A059] shrink-0 ml-1" />
                </a>
                <a
                  href="mailto:digwa.gurjot@gmail.com"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059]/5 rounded-xl text-xs text-[#1a1a1a] font-medium transition-colors truncate"
                  title="digwa.gurjot@gmail.com"
                >
                  <span className="truncate">digwa.gurjot@gmail.com</span>
                  <ArrowUpRight size={13} className="text-[#C5A059] shrink-0 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Channel 4: Instagram & Social Media */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#E1306C]/30 hover:border-[#E1306C] p-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-gradient-to-tr from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 rounded-xl text-[#DD2A7B] border border-[#E1306C]/30">
                  <InstagramIcon size={22} />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#8134AF] bg-[#DD2A7B]/10 px-2.5 py-1 rounded-full">
                  Atelier Social
                </span>
              </div>
              <h3 className="font-brand text-2xl text-[#1a1a1a] font-normal mb-2">Social & DM</h3>
              <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed mb-6">
                Discover our newest handcrafted collections, bridal reels, and message our curators directly.
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://ig.me/m/shagunratnagemsjewellers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-opacity"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram DM</span>
                  <ArrowUpRight size={13} />
                </a>
                <a
                  href="https://www.facebook.com/SHAGUNRATNA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#C5A059]/30 hover:border-[#1877F2] hover:text-[#1877F2] rounded-xl text-xs text-[#1a1a1a] font-medium transition-colors"
                >
                  <FacebookIcon size={14} />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Boutique Location & Timings Bar */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 p-6 md:p-8 rounded-2xl bg-[#FDFBF7]/90 border border-[#C5A059]/25 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          {/* Address */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#90060c]/5 rounded-xl text-[#90060c] border border-[#C5A059]/30 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="font-sans text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">
                Satellite Boutique (Flagship)
              </h4>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                GF/9, Akshar Complex, Beside Harit Zaveri, Shivranjani Cross Road, Satellite, Ahmedabad, 380015
              </p>
            </div>
          </div>

          {/* Manek Chowk */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#90060c]/5 rounded-xl text-[#90060c] border border-[#C5A059]/30 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="font-sans text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">
                Heritage Showroom
              </h4>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Shop No. 16, Chanlla Oll, Manek Chowk Road, Old City, Ahmedabad, 380001
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#90060c]/5 rounded-xl text-[#90060c] border border-[#C5A059]/30 shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="font-sans text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">
                Boutique Hours
              </h4>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Monday – Saturday: 11:00 AM – 8:00 PM
              </p>
              <p className="text-[11px] text-[#C5A059] italic mt-0.5">
                Sunday: Private Viewings by Appointment Only
              </p>
            </div>
          </div>
        </motion.div>

        {/* Branch maps stack on mobile and sit side by side on desktop. */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-sans text-[10px] tracking-[0.3em] font-bold uppercase text-[#C5A059]">
              Showroom Locations & Navigation
            </h3>
            <div className="h-[1px] flex-1 bg-[#C5A059]/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-brand text-xl tracking-[0.1em] text-[#90060c] uppercase font-light mb-3">
                Satellite Boutique (Shivranjani)
              </h4>
              <div className="border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-sm h-[320px] md:h-[380px] relative group bg-[#FDFBF7]">
                <iframe
                  src="https://www.google.com/maps?q=Shagunratna+Gems+%26+Jewellers,+23.0245069,+72.5288626&z=17&output=embed"
                  title="Shagun Ratna Satellite boutique map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contrast-110 opacity-90 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 pointer-events-none border-[6px] border-[#FDFBF7] rounded-2xl" />
              </div>
            </div>
            <div>
              <h4 className="font-brand text-xl tracking-[0.1em] text-[#90060c] uppercase font-light mb-3">
                Manek Chowk Boutique
              </h4>
              <div className="border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-sm h-[320px] md:h-[380px] relative group bg-[#FDFBF7]">
                <iframe
                  src="https://www.google.com/maps?q=Shagun+Ratna,+Shop+No.+16,+Chanlla+Oll,+Manek+Chowk+Road,+Old+City,+Danapidth,+Khadia,+Ahmedabad,+Gujarat+380001&z=17&output=embed"
                  title="Shagun Ratna Manek Chowk boutique map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contrast-110 opacity-90 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 pointer-events-none border-[6px] border-[#FDFBF7] rounded-2xl" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
