'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 SSR hydration mismatch（next-themes 需要 client-side 才知道 theme）
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '切換淺色模式' : '切換深色模式'}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150
                 text-slate-500 hover:text-slate-900 hover:bg-slate-100
                 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
