"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles,
  Send,
  CheckCircle2
} from 'lucide-react';
import PageDivider from '@/components/PageDivider';

const InstagramIcon = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.75"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.75"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.764.462 3.486 1.341 5.011l-1.428 5.215 5.337-1.4a9.96 9.96 0 0 0 4.754 1.178c5.524 0 10.004-4.48 10.004-10.004C22.012 6.48 17.528 2 12.004 2zm0 1.636c4.615 0 8.368 3.753 8.368 8.368 0 4.615-3.753 8.368-8.368 8.368-1.573 0-3.04-.438-4.305-1.196l-.309-.184-3.197.839.854-3.118-.202-.32a8.318 8.318 0 0 1-1.209-4.389c0-4.615 3.753-8.368 8.368-8.368zm-3.693 4.148c-.143 0-.36.054-.548.26-.188.207-.718.702-.718 1.711s.735 1.986.837 2.124c.102.138 1.447 2.21 3.506 3.097.49.21.872.337 1.17.432.493.156.942.134 1.296.082.395-.058 1.21-.495 1.38-.973.058-.09.207-.09.384-.141-.475-.052-.09-.188-.144-.395-.248-.207-.103-1.21-.597-1.397-.666-.188-.069-.324-.103-.46.103-.137.207-.53.666-.649.803-.12.138-.24.155-.447.052-.207-.103-.874-.322-1.664-1.026-.615-.549-1.03-1.226-1.15-1.433-.12-.207-.013-.32.09-.422.094-.092.207-.242.31-.362.104-.12.138-.207.207-.345.069-.138.035-.259-.017-.363-.052-.103-.46-1.109-.63-1.517-.165-.4-.347-.346-.46-.352-.105-.005-.226-.006-.347-.006z" />
  </svg>
);


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    productName: 'General Inquiry',
    customizationNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Quick validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name and phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          productName: formData.productName,
          customizationNotes: formData.customizationNotes
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          productName: 'General Inquiry',
          customizationNotes: ''
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('A network error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden pt-28 pb-20 px-6 md:px-12 lg:px-24">
      {/* Background luxury dotted matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none z-0" />

      {/* Decorative Rotating Gold Ring */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#C5A059]/10 pointer-events-none z-0 select-none hidden lg:block" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-dashed border-[#C5A059]/15 pointer-events-none z-0 select-none hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] font-bold">
              EST. 1980
            </span>
            <div className="h-[1px] w-8 bg-[#90060c]/30" />
            <Sparkles size={12} className="text-[#C5A059] animate-pulse" />
          </div>
          <h1 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] uppercase font-light leading-tight mb-4">
            Contact Our <span className="text-[#90060c] font-normal">Concierge</span>
          </h1>
          <p className="font-brand text-md md:text-lg text-[#C5A059] tracking-[0.1em] italic font-light">
            Schedule a private boutique viewing or coordinate a bespoke commission.
          </p>
        </motion.div>

        {/* Page Divider */}
        <PageDivider />

        {/* Main Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-8"
        >
          
          {/* Left Column: Contact Details & Map */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-10">
            
            {/* Contact Details Card */}
            <div className="bg-[#FAF7F2]/80 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#C5A059]/5 to-transparent rounded-full pointer-events-none" />
              
              <h2 className="font-brand text-2xl tracking-[0.12em] text-[#90060c] uppercase font-light mb-8 pb-3 border-b border-[#C5A059]/20">
                Boutique Details
              </h2>
              
              <div className="space-y-6 font-sans text-xs tracking-[0.08em] text-[#333]">
                {/* Location */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#90060c]/5 rounded-full text-[#90060c] border border-[#C5A059]/30">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">Flagship Boutique</h4>
                    <p className="leading-relaxed text-gray-600">
                      Shagun Ratna, 102 Heritage Mansion,<br />
                      MG Road, Kala Ghoda, Fort,<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#90060c]/5 rounded-full text-[#90060c] border border-[#C5A059]/30">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">Direct Lines</h4>
                    <p className="leading-relaxed">
                      <a href="tel:+912222829800" className="text-gray-600 hover:text-[#90060c] transition-colors">+91 22 2282 9800</a>
                    </p>
                    <p className="leading-relaxed">
                      <a href="tel:+919876543210" className="text-gray-600 hover:text-[#90060c] transition-colors">+91 98765 43210</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#90060c]/5 rounded-full text-[#90060c] border border-[#C5A059]/30">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">Client Services</h4>
                    <p className="leading-relaxed">
                      <a href="mailto:concierge@shagunratna.com" className="text-gray-600 hover:text-[#90060c] transition-colors">concierge@shagunratna.com</a>
                    </p>
                    <p className="leading-relaxed">
                      <a href="mailto:info@shagunratna.com" className="text-gray-600 hover:text-[#90060c] transition-colors">info@shagunratna.com</a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#90060c]/5 rounded-full text-[#90060c] border border-[#C5A059]/30">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] uppercase tracking-[0.15em] mb-1">Boutique Hours</h4>
                    <p className="leading-relaxed text-gray-600">Monday – Saturday: 11:00 AM – 8:00 PM</p>
                    <p className="leading-relaxed text-[#C5A059] italic mt-0.5">Sunday: Private Viewings by Appointment Only</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-8 border-t border-[#C5A059]/20">
                <h4 className="font-sans text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A059] mb-4">
                  Follow Our Journey
                </h4>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 border border-[#C5A059]/30 rounded-full text-[#90060c] hover:bg-[#90060c] hover:text-[#faf3e5] hover:border-[#90060c] transition-all duration-300 flex items-center justify-center"
                    title="Instagram"
                  >
                    <InstagramIcon size={18} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 border border-[#C5A059]/30 rounded-full text-[#90060c] hover:bg-[#90060c] hover:text-[#faf3e5] hover:border-[#90060c] transition-all duration-300 flex items-center justify-center"
                    title="Facebook"
                  >
                    <FacebookIcon size={18} />
                  </a>
                  <a 
                    href="https://wa.me/919876543210" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 border border-[#C5A059]/30 rounded-full text-[#90060c] hover:bg-[#90060c] hover:text-[#faf3e5] hover:border-[#90060c] transition-all duration-300 flex items-center justify-center"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Map Frame Card */}
            <div className="border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-sm h-[260px] relative group bg-[#FAF7F2]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.8427506979207!2d72.8302061759654!3d18.927318056965457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c253d865ab%3A0xe349db82a937a00f!2sKala%20Ghoda%2C%20Fort%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1718784000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-110 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 pointer-events-none border-[6px] border-[#FAF7F2] rounded-2xl" />
            </div>

          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="bg-[#FAF7F2]/80 backdrop-blur-md border border-[#C5A059]/20 p-8 md:p-10 rounded-2xl shadow-sm">
              <h2 className="font-brand text-2xl tracking-[0.12em] text-[#90060c] uppercase font-light mb-2">
                Send An Inquiry
              </h2>
              <p className="font-sans text-xs tracking-wide text-gray-500 mb-8">
                Our advisors will connect with you via call or WhatsApp within 24 business hours.
              </p>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="text-[#90060c] mb-6"
                    >
                      <CheckCircle2 size={64} strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="font-brand text-2xl tracking-wider text-[#1a1a1a] uppercase font-light mb-4">
                      Thank You, Beloved Client
                    </h3>
                    <p className="font-sans text-xs leading-relaxed text-gray-600 max-w-sm mb-8">
                      Your inquiry has been logged securely in our registers. A dedicated concierge advisor will contact you shortly.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="font-sans text-[10px] tracking-[0.25em] text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059]/5 px-8 py-3 rounded-full uppercase transition-all duration-300 font-semibold"
                    >
                      Send Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="contact-form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {errorMessage && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg font-sans">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="block font-sans text-[10px] tracking-[0.2em] font-bold text-[#C5A059] uppercase">
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Lord/Lady Name" 
                          required
                          className="w-full bg-[#FDFBF7]/65 border border-[#C5A059]/30 rounded-xl px-4 py-3 text-xs tracking-wider text-gray-800 focus:outline-none focus:border-[#90060c] focus:bg-white transition-all font-sans placeholder-gray-400"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block font-sans text-[10px] tracking-[0.2em] font-bold text-[#C5A059] uppercase">
                          Phone Number *
                        </label>
                        <input 
                          type="tel" 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX" 
                          required
                          className="w-full bg-[#FDFBF7]/65 border border-[#C5A059]/30 rounded-xl px-4 py-3 text-xs tracking-wider text-gray-800 focus:outline-none focus:border-[#90060c] focus:bg-white transition-all font-sans placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Inquiry Interest Dropdown */}
                    <div className="space-y-2">
                      <label htmlFor="productName" className="block font-sans text-[10px] tracking-[0.2em] font-bold text-[#C5A059] uppercase">
                        Jewelry Interest *
                      </label>
                      <select 
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full bg-[#FDFBF7]/65 border border-[#C5A059]/30 rounded-xl px-4 py-3 text-xs tracking-wider text-gray-800 focus:outline-none focus:border-[#90060c] focus:bg-white transition-all font-sans cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Bridal & Wedding Sets">Bridal & Wedding Sets</option>
                        <option value="Gold Heirlooms & Necklaces">Gold Heirlooms & Necklaces</option>
                        <option value="Solitaire Diamonds & Rings">Solitaire Diamonds & Rings</option>
                        <option value="Astrological & Rashi Gems">Astrological & Rashi Gems</option>
                        <option value="Bespoke Commission Design">Bespoke Commission Design</option>
                      </select>
                    </div>

                    {/* Customization Notes / Message */}
                    <div className="space-y-2">
                      <label htmlFor="customizationNotes" className="block font-sans text-[10px] tracking-[0.2em] font-bold text-[#C5A059] uppercase">
                        Your Message / Customization Request
                      </label>
                      <textarea 
                        id="customizationNotes"
                        name="customizationNotes"
                        value={formData.customizationNotes}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe details, metal type preferences, or appointment requests..."
                        className="w-full bg-[#FDFBF7]/65 border border-[#C5A059]/30 rounded-xl px-4 py-3 text-xs tracking-wider text-gray-800 focus:outline-none focus:border-[#90060c] focus:bg-white transition-all font-sans placeholder-gray-400 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full relative font-sans px-8 py-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_25px_rgba(144,6,12,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? 'Sending...' : 'Transmit Inquiry'}
                          {!isSubmitting && <Send size={12} />}
                        </span>
                        <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-0" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}