'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  TreePine,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Search,
  ScanLine,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/trees', label: 'Trees' },
  { href: '/categories', label: 'Categories' },
  { href: '/detect', label: 'AI Detection' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIdx = themes.indexOf(theme);
    setTheme(themes[(currentIdx + 1) % themes.length]);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-soft border-b border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="GachPala - Home"
            >
              <div className="w-9 h-9 rounded-xl bg-forest-700 dark:bg-forest-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-forest-900 dark:text-forest-100">
                  GachPala
                </span>
                <span className="text-[10px] font-medium tracking-wider text-forest-600 dark:text-forest-400">
                  গাছপালা
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-900/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-forest-700 dark:hover:text-forest-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-forest-700 dark:hover:text-forest-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
                aria-label={`Switch theme (current: ${theme})`}
                title={`Theme: ${theme}`}
              >
                <ThemeIcon className="w-4.5 h-4.5" />
              </button>

              {/* CTA Button */}
              <Link
                href="/detect"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <ScanLine className="w-4 h-4" />
                Identify a Tree
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-900/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-forest-700 dark:hover:text-forest-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3">
                <Link
                  href="/detect"
                  className="btn-primary w-full text-sm"
                >
                  <ScanLine className="w-4 h-4" />
                  Identify a Tree
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}
