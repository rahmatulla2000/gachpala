import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TreeListContent } from '@/components/trees/TreeListContent';

export const metadata: Metadata = {
  title: 'All Trees',
  description: 'Browse our comprehensive collection of trees. Search, filter, and explore detailed botanical information.',
};

export default function TreesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-forest-50 to-transparent dark:from-forest-950/30 dark:to-transparent pt-8 pb-4">
          <div className="section-container">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tree Database
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Explore our growing collection of trees with detailed botanical information.
            </p>
          </div>
        </section>

        <Suspense fallback={
          <div className="section-container py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="premium-card overflow-hidden">
                  <div className="aspect-[4/3] skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 skeleton w-3/4" />
                    <div className="h-4 skeleton w-1/2" />
                    <div className="h-3 skeleton w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <TreeListContent searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
