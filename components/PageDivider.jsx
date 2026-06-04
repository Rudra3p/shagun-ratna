"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PageDivider() {
  return (
    <div className="w-full py-16 flex justify-center items-center overflow-hidden">
      <motion.div 
        initial={{ width: "20%", opacity: 0 }}
        whileInView={{ width: "80%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent bg-no-repeat"
        style={{ 
          backgroundSize: "100% 1px", // Forces the gradient to stay exactly 1px tall
          backgroundPosition: "center"
        }}
      />
    </div>
  );
}