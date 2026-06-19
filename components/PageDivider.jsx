"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PageDivider() {
  return (
    <div className="w-full py-20 flex justify-center items-center gap-6 overflow-hidden">
      <motion.div 
        initial={{ width: "0%", opacity: 0 }}
        whileInView={{ width: "35%", opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: 45 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-2.5 h-2.5 border border-[#C5A059] bg-[#FDFBF7] relative flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-[#90060c] rounded-full" />
      </motion.div>
      <motion.div 
        initial={{ width: "0%", opacity: 0 }}
        whileInView={{ width: "35%", opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]"
      />
    </div>
  );
}