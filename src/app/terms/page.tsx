import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Scale, ArrowLeft, CheckCircle2, AlertTriangle, Copyright, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | GachPala',
  description: 'Simple and transparent terms of use for GachPala.',
};

export default function TermsPage() {
  const points = [
    {
      icon: CheckCircle2,
      title: 'Permitted Use',
      desc: 'GachPala is a free educational platform. You may browse, search, and identify trees for study, agriculture, and nature exploration.',
    },
    {
      icon: AlertTriangle,
      title: 'AI Identification Notice',
      desc: 'Species predictions are AI-assisted visual estimates. Never use app predictions for medical, herbal ingestion, or toxicity decisions.',
    },
    {
      icon: Copyright,
      title: 'Photo Copyright',
      desc: 'You retain full ownership of photos you take and submit. You grant GachPala permission to display them for educational biodiversity awareness.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#07100c] text-gray-900 dark:text-gray-100 py-12 lg:py-16">
        <div className="section-container max-w-2xl">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-forest-600 dark:text-emerald-400 hover:underline mb-8 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-3">
              <Scale className="w-3.5 h-3.5" />
              Terms of Use
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Terms of Use
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Simple, fair, and clear guidelines for using GachPala.
            </p>
          </div>

          {/* Minimal High-Priority Points */}
          <div className="space-y-4 mb-8">
            {points.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white dark:bg-[#0d1813] border border-gray-200 dark:border-emerald-500/20 shadow-sm flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                      {pt.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Contact Footer Box */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Questions? Email us at <strong className="text-gray-800 dark:text-gray-200">terms@gachpala.org</strong></span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:inline">Effective Sept 2026</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
