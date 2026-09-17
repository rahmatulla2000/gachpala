import Link from 'next/link';
import { PenLine, ArrowRight } from 'lucide-react';

export function ContributeSection() {
  return (
    <section className="section-spacing">
      <div className="section-container">
        <div className="premium-card p-8 md:p-12 lg:p-16 text-center bg-gradient-to-br from-forest-50 via-white to-leaf-50 dark:from-forest-950/50 dark:via-gray-900 dark:to-forest-950/30 border-forest-100 dark:border-forest-800">
          <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 text-forest-600 dark:text-forest-400">
            <PenLine className="w-8 h-8" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Your Knowledge
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 text-lg">
            Know about a tree that&apos;s not in our database? Contribute your knowledge
            and help us build the most comprehensive tree encyclopedia.
          </p>

          <Link
            href="/contribute"
            className="btn-primary text-base px-8 py-4 group"
          >
            Contribute a Tree
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            No account required. Submissions are reviewed by our team.
          </p>
        </div>
      </div>
    </section>
  );
}
