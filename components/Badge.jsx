import { Tag, Sparkles, Star, Clock } from 'lucide-react';

const NEW_ARRIVAL_DAYS = 14;

// A product counts as "New" for its first 14 days in the catalog.
export function isNewArrival(product) {
  if (!product?.createdAt) return false;
  const ageInDays = (Date.now() - new Date(product.createdAt).getTime()) / 86400000;
  return ageInDays >= 0 && ageInDays <= NEW_ARRIVAL_DAYS;
}

const VARIANTS = {
  discount: {
    icon: Tag,
    wrap: 'bg-gradient-to-r from-[#90060C] to-[#B5121B] text-white shadow-[0_4px_14px_rgba(144,6,12,0.35)]',
  },
  recommended: {
    icon: Star,
    wrap: 'bg-gradient-to-r from-[#C5A059] to-[#DEC58B] text-[#3A2C0F] shadow-[0_4px_14px_rgba(197,160,89,0.4)]',
  },
  new: {
    icon: Sparkles,
    wrap: 'bg-[#1a1a1a] text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]',
  },
  urgency: {
    icon: Clock,
    wrap: 'bg-[#3A2C0F] text-[#F5EFE6] shadow-[0_4px_14px_rgba(58,44,15,0.35)]',
  },
  category: {
    icon: null,
    wrap: 'bg-gray-50 text-[#888888] border border-gray-100',
  },
};

export default function Badge({ variant = 'discount', children, size = 'sm', className = '' }) {
  const config = VARIANTS[variant] || VARIANTS.discount;
  const Icon = config.icon;
  const isCompact = size === 'sm';

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-sans font-bold uppercase tracking-widest ${
        isCompact ? 'gap-1 px-2.5 py-1 text-[9px] sm:text-[10px]' : 'gap-1.5 px-3 py-1.5 text-[11px]'
      } ${config.wrap} ${className}`}
    >
      {Icon && <Icon size={isCompact ? 10 : 12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
