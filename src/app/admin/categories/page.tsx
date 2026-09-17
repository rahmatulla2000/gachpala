import type { Metadata } from 'next';
import { getCategories } from '@/services/categories/category.service';
import { Tag, FolderTree } from 'lucide-react';

export const metadata: Metadata = { title: 'Categories' };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage tree categories and classification ({categories.length} total)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-400 flex items-center justify-center text-xl">
                {cat.icon || '🌿'}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300">
                {cat._count?.trees ?? 0} Trees
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              {cat.name}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
              /{cat.slug}
            </p>
            {cat.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {cat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
