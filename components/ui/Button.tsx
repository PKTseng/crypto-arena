'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'up' | 'down' | 'neutral' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  up:      'bg-green-500 hover:bg-green-400 text-white border border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  down:    'bg-red-500 hover:bg-red-400 text-white border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  neutral: 'bg-yellow-500 hover:bg-yellow-400 text-black border border-yellow-400',
  ghost:   'bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  onClick,
  variant = 'neutral',
  size = 'md',
  disabled = false,
  className,
  fullWidth = false,
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'font-bold tracking-wide transition-colors duration-150 cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
