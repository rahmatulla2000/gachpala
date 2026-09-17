'use client';

import Link from 'next/link';
import { ScanLine, Upload, Cpu, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: Upload, label: 'Upload Photo', desc: 'Take or upload a tree image' },
  { icon: Cpu, label: 'AI Analyzes', desc: 'Our AI identifies the tree' },
  { icon: Eye, label: 'Get Results', desc: 'View detailed information' },
];

export function AIDetectionSection() {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-400/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-forest-400 text-sm font-semibold uppercase tracking-wider mb-3 block">
              AI-Powered
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Identify Any Tree with AI
            </h2>
            <p className="text-forest-200/70 text-lg mb-8 leading-relaxed">
              Simply upload a photo of a tree, leaf, flower, or bark, and our
              AI will identify it in seconds. Get detailed botanical information
              matched from our verified database.
            </p>

            <Link
              href="/detect"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white text-forest-900 font-semibold rounded-xl hover:bg-forest-50 transition-all shadow-lg hover:shadow-xl group"
            >
              <ScanLine className="w-5 h-5" />
              Try AI Detection
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="w-14 h-14 rounded-xl bg-forest-600/30 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-forest-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-forest-400">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-0.5">{step.label}</h3>
                  <p className="text-forest-300/70 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
