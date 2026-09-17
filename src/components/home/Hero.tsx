'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanLine, ArrowRight, Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
        {/* Light glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-forest-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-leaf-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Floating leaves decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-forest-400/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: ['0%', '110%'],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360 + Math.random() * 360],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: i * 2.5,
              ease: 'linear',
            }}
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: '-5%',
            }}
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative section-container py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-forest-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
              AI-Powered Tree Identification
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Know Every Tree,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-leaf-300 to-primary-300">
                One Leaf at a Time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-forest-200/80 max-w-xl leading-relaxed mb-10">
              Discover, identify and learn about trees with the power of AI.
              Explore our growing database of detailed botanical information.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/trees"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-forest-900 font-semibold rounded-xl hover:bg-forest-50 transition-all shadow-lg hover:shadow-xl group text-base"
              >
                Explore Trees
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/detect"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-forest-600/30 backdrop-blur-sm text-white font-semibold rounded-xl border border-forest-400/30 hover:bg-forest-600/50 transition-all group text-base"
              >
                <ScanLine className="w-5 h-5" />
                Identify a Tree
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Tree Species', icon: '🌳' },
            { label: 'Varieties', icon: '🌱' },
            { label: 'Categories', icon: '🏷️' },
            { label: 'Contributions', icon: '📚' },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5"
            >
              <span className="text-2xl mb-1 block">{item.icon}</span>
              <span className="text-xs text-forest-300/70 font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
