"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, X, ChevronUp } from 'lucide-react';

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

export default function FloatingInquiry() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappMessage = encodeURIComponent("Namaste Shagun Ratna, I would like to inquire about your certified gemstone and luxury jewelry collections.");
  const smsBody = encodeURIComponent("Inquiry regarding Shagun Ratna jewelry collection.");

  return (
    <aside aria-label="Direct inquiry concierge" className="fixed bottom-6 right-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-72 rounded-2xl bg-[#FDFBF7]/95 backdrop-blur-md border border-[#C5A059]/40 p-4 shadow-[0_12px_40px_rgba(144,6,12,0.18)]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/20 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5A059]">Boutique Concierge</p>
                <h4 className="font-brand text-lg text-[#90060C] font-light leading-tight">Direct Inquiry</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-[#A8A196] hover:text-[#90060C] hover:bg-[#90060C]/5 transition-colors"
                aria-label="Close concierge menu"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#5f5a53] mb-3 leading-relaxed">
              Connect directly with our master jeweller via your preferred channel:
            </p>

            <div className="space-y-2">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/919558888754?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#25D366]/10 text-[#075e54] hover:bg-[#25D366]/20 transition-all group font-medium text-xs border border-[#25D366]/20"
              >
                <span className="p-1.5 rounded-lg bg-[#25D366] text-white">
                  <WhatsAppIcon size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1a1a1a]">WhatsApp Chat</span>
                  <span className="text-[10px] text-[#075e54]/80">+91 95588 88754 (Instant)</span>
                </div>
              </a>

              {/* Instagram DM */}
              <a
                href="https://ig.me/m/shagunratnagemsjewellers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#E1306C]/10 text-[#833AB4] hover:bg-[#E1306C]/20 transition-all group font-medium text-xs border border-[#E1306C]/20"
              >
                <span className="p-1.5 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                  <InstagramIcon size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1a1a1a]">Instagram DM</span>
                  <span className="text-[10px] text-[#833AB4]/80">@shagunratnagemsjewellers</span>
                </div>
              </a>

              {/* Direct Call */}
              <a
                href="tel:+919558888754"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#90060C]/5 text-[#90060C] hover:bg-[#90060C]/10 transition-all group font-medium text-xs border border-[#90060C]/20"
              >
                <span className="p-1.5 rounded-lg bg-[#90060C] text-white">
                  <Phone size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1a1a1a]">Direct Call</span>
                  <span className="text-[10px] text-[#90060C]/80">+91 95588 88754</span>
                </div>
              </a>

              {/* SMS Direct */}
              <a
                href={`sms:+919558888754?&body=${smsBody}`}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#C5A059]/10 text-[#7a602a] hover:bg-[#C5A059]/20 transition-all group font-medium text-xs border border-[#C5A059]/30"
              >
                <span className="p-1.5 rounded-lg bg-[#C5A059] text-white">
                  <MessageSquare size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1a1a1a]">Send SMS</span>
                  <span className="text-[10px] text-[#7a602a]/80">+91 95588 88754</span>
                </div>
              </a>
            </div>

            <div className="mt-3 pt-2 text-center border-t border-[#C5A059]/15">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#A8A196]">
                Shivranjani Boutique • Ahmedabad
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#90060C] to-[#730509] text-white px-4 py-3 shadow-[0_8px_30px_rgba(144,6,12,0.35)] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all cursor-pointer"
        aria-label="Direct Inquiry via WhatsApp, Instagram, or Call"
      >
        <span className="relative flex items-center justify-center">
          <WhatsAppIcon size={20} className="text-[#25D366] drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
        </span>
        <span className="font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[#faf3e5] hidden sm:inline">
          Inquire Now
        </span>
        <ChevronUp size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
    </aside>
  );
}

