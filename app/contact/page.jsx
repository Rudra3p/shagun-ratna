"use client";

import React, { useState, useEffect } from 'react';
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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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
    customizationNotes: '',
    companyWebsite: '' // honeypot — real visitors never see or fill this field
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill from a product detail page's "Inquire About This Piece" link (?product=...)
  useEffect(() => {
    const productParam = new URLSearchParams(window.location.search).get('product');
    if (productParam) {
      setFormData((prev) => ({ ...prev, productName: productParam }));
    }
  }, []);

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
          customizationNotes: formData.customizationNotes,
          companyWebsite: formData.companyWebsite
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          productName: 'General Inquiry',
          customizationNotes: '',
          companyWebsite: ''
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
          
          {/* Left Column: Contact Details */}
          <motion.div variants={itemVariants} className="lg:col-span-5">

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
                      Shagun Ratna, GF/9, Akshar Complex,<br />
                      Beside Harit Zaveri, Shivranjani Cross Road,<br />
                      Satellite, Ahmedabad, Gujarat 380015
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
                      <a href="tel:+919558888754" className="text-gray-600 hover:text-[#90060c] transition-colors">+91 95588 88754</a>
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
                    href="https://wa.me/919558888754" 
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

                    {/* Honeypot — invisible to real visitors, only bots tend to fill this in */}
                    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="companyWebsite">Website</label>
                      <input
                        type="text"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

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

        {/* Map — full width so it doesn't get squeezed into one column and leave a dead gap beside it */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-sans text-[10px] tracking-[0.3em] font-bold uppercase text-[#C5A059]">
              Find Our Boutique
            </h3>
            <div className="h-[1px] flex-1 bg-[#C5A059]/20" />
          </div>
          <div className="border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-sm h-[320px] md:h-[380px] relative group bg-[#FAF7F2]">
            <iframe
              src="https://www.google.com/maps?q=Shagunratna+Gems+%26+Jewellers,+23.0245069,+72.5288626&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contrast-110 opacity-90 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 pointer-events-none border-[6px] border-[#FAF7F2] rounded-2xl" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}