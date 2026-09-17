import Link from 'next/link';
import { ArrowRight, Trees, Flower2, Pill, Axe, TreePine, Palette, MapPin, Leaf, CloudSun } from 'lucide-react';
import type { CategoryWithCount } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  'fruit-trees': <Trees className="w-7 h-7" />,
  'flowering-trees': <Flower2 className="w-7 h-7" />,
  'medicinal-trees': <Pill className="w-7 h-7" />,
  'timber-trees': <Axe className="w-7 h-7" />,
  'forest-trees': <TreePine className="w-7 h-7" />,
  'ornamental-trees': <Palette className="w-7 h-7" />,
  'native-trees': <MapPin className="w-7 h-7" />,
  'evergreen-trees': <Leaf className="w-7 h-7" />,
  'deciduous-trees': <CloudSun className="w-7 h-7" />,
};

export function CategorySection({ categories }: { categories: CategoryWithCount[] }) {
  if (!categories.length) return null;

  return (
    <section className="section-spacing bg-white dark:bg-gray-900/50">
      <div className="section-container">
        <div className="text-center mb-12">
          <span className="text-forest-600 dark:text-forest-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
            Browse by Category
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Tree Categories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Explore trees organized by their characteristics and uses.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/trees?category=${category.slug}`}
              className="premium-card p-5 text-center group hover:scale-[1.03] transition-all"
            >
              <div className="w-14 h-14 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-forest-600 dark:text-forest-400 group-hover:bg-forest-200 dark:group-hover:bg-forest-800/40 transition-colors group-hover:scale-110 transition-transform">
                {categoryIcons[category.slug] || <TreePine className="w-7 h-7" />}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {category._count.trees} {category._count.trees === 1 ? 'tree' : 'trees'}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/categories" className="btn-outline text-sm">
            All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
