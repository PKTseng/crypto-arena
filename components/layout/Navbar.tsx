'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConnectButton from '@/components/wallet/ConnectButton';

const navLinks = [
  { href: '/',            label: 'Home' },
  { href: '/arena',       label: '⚡ Arena' },
  { href: '/game',        label: 'Play' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: '#00D4FF', fontFamily: 'var(--font-orbitron)' }}
          >
            ₿ CryptoArena
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                pathname === href
                  ? 'text-[#00D4FF] bg-[#00D4FF12]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop: Connect Wallet */}
        <div className="hidden sm:block shrink-0">
          <ConnectButton />
        </div>

        {/* Mobile: Connect (icon only) + Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ConnectButton />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sm:hidden overflow-hidden border-t border-gray-800 bg-gray-950"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === href
                      ? 'text-[#00D4FF] bg-[#00D4FF10]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
