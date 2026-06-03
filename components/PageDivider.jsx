"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PageDivider() {
  return (
    <div className="w-full py-16 px-6 flex justify-center">
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "40%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"
      />
    </div>
  );
}