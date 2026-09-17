import Link from 'next/link';
import { TreePine, Leaf, Facebook, Twitter, Linkedin, Instagram, Sprout } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#182330] via-[#131c26] to-[#0e141c] text-gray-300 overflow-hidden">
      {/* --- Tree / Forest Vibe Background Elements --- */}
      {/* 1. Ambient Emerald & Deep Forest Glowing Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-forest-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* 2. Subtle Botanical Leaf Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C35 15, 50 20, 50 35 C50 50, 30 55, 30 55 C30 55, 10 50, 10 35 C10 20, 25 15, 30 5 Z M30 15 L30 48' stroke='%2334d399' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. Forest & Pine Tree Silhouettes Horizon */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-20 flex items-end justify-between overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full object-cover text-emerald-300 preserve-3d"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layer of trees and canopy silhouettes */}
          <path d="M0,120 L0,85 L15,70 L25,82 L40,60 L50,75 L65,50 L80,75 L95,60 L110,85 L130,55 L145,75 L165,40 L185,75 L200,60 L220,90 L240,45 L260,75 L280,55 L305,85 L330,40 L350,70 L370,50 L395,85 L420,35 L445,75 L470,55 L495,90 L520,40 L545,75 L570,50 L600,85 L625,30 L655,75 L680,50 L710,90 L735,45 L760,75 L790,35 L820,80 L845,55 L875,90 L900,40 L930,75 L955,50 L985,85 L1015,35 L1045,75 L1075,55 L1105,90 L1135,45 L1165,75 L1200,60 L1200,120 Z" opacity="0.4" />
          <path d="M0,120 L0,95 L20,80 L35,92 L55,70 L75,90 L95,65 L120,95 L150,60 L180,90 L210,75 L245,100 L275,65 L310,95 L345,60 L380,95 L415,70 L450,100 L490,65 L525,95 L565,60 L605,95 L645,70 L685,100 L730,65 L770,95 L810,60 L850,95 L890,70 L930,100 L970,65 L1010,95 L1050,60 L1090,95 L1130,70 L1170,95 L1200,80 L1200,120 Z" opacity="0.8" />
        </svg>
      </div>

      {/* Top Main Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Logos / Badges */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 items-start">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-forest-600/90 border border-emerald-400/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-lg shadow-emerald-950/50">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-wide">
                  GachPala
                </span>
                <span className="text-[11px] font-medium tracking-widest text-emerald-400">
                  গাছপালা
                </span>
              </div>
            </Link>

            {/* Sub-brand / Initiative Badges */}
            <div className="flex items-center gap-3 pt-1 border-t border-gray-700/50 sm:border-t-0 sm:border-l sm:pl-4 lg:border-l-0 lg:pl-0 lg:border-t w-full">
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="leading-tight">
                  <span className="block font-medium text-gray-200">Flora Research</span>
                  <span className="text-[10px] text-emerald-400/80">Open Tree Project</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Title & Description */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-emerald-400 font-semibold text-sm sm:text-base tracking-wide flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              GachPala — Center for Botanical AI & Flora Knowledge
            </h3>
            <p className="text-gray-300/90 text-xs sm:text-[13px] leading-relaxed">
              Founded with the mission to document and explore botanical biodiversity, GachPala is an open,
              AI-assisted flora platform. We leverage modern image recognition and community-contributed data
              to make tree discovery, plant identification, and ecological learning accessible to researchers,
              students, and nature enthusiasts across the globe.
            </p>
          </div>

          {/* Right Column: Social Media Circular Icons */}
          <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-500/60 hover:border-emerald-400 flex items-center justify-center text-gray-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all duration-200 shadow-sm"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-500/60 hover:border-emerald-400 flex items-center justify-center text-gray-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all duration-200 shadow-sm"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-500/60 hover:border-emerald-400 flex items-center justify-center text-gray-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all duration-200 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-500/60 hover:border-emerald-400 flex items-center justify-center text-gray-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all duration-200 shadow-sm"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Subtle Divider Line */}
      <div className="relative border-t border-gray-700/60" />

      {/* Bottom Bar: Copyright & Links */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">
            © {currentYear} GachPala (গাছপালা) | Open Botanical & Tree Research Platform
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/privacy"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              Privacy notice
            </Link>
            <Link
              href="/terms"
              className="hover:text-emerald-300 transition-colors duration-200"
            >
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
