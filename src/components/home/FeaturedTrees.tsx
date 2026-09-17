import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TreeCard } from '@/components/trees/TreeCard';
import type { TreeCardData } from '@/types';

export function FeaturedTrees({ trees }: { trees: (TreeCardData & { description?: string | null })[] }) {
  if (!trees.length) return null;

  return (
    <section className="section-spacing">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-forest-600 dark:text-forest-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
              Featured
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Featured Trees
            </h2>
          </div>
          <Link
            href="/trees"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 dark:text-forest-400 hover:text-forest-800 dark:hover:text-forest-300 transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} featured />
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link href="/trees" className="btn-outline">
            View All Trees
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
