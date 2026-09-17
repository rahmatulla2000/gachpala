import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCategories } from '@/services/categories/category.service';
import { TreePine, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tree Categories',
  description: 'Browse trees by category — fruit trees, flowering trees, medicinal trees, timber trees, and more.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-forest-50 to-transparent dark:from-forest-950/30 dark:to-transparent pt-8 pb-4">
          <div className="section-container">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tree Categories
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Browse our tree database organized by type and use.
            </p>
          </div>
        </section>

        <div className="section-container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/trees?category=${category.slug}`}
                className="premium-card p-6 group hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {category.icon || '🌳'}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category._count.trees} {category._count.trees === 1 ? 'tree' : 'trees'}
                    </p>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-sm font-medium text-forest-700 dark:text-forest-400 group-hover:text-forest-800 dark:group-hover:text-forest-300">
                  <TreePine className="w-4 h-4" />
                  Browse Trees
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
