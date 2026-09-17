'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import type { CategoryWithCount, FilterOption } from '@/types';

interface FilterPanelProps {
  categories: CategoryWithCount[];
  filterOptions: {
    families: FilterOption[];
    genera: FilterOption[];
    kingdoms: FilterOption[];
  };
  activeFilters: {
    category: string;
    family: string;
    genus: string;
    hasFruit: boolean;
    hasFlower: boolean;
    isNative: boolean;
    hasMedicinalUse: boolean;
  };
}

export function FilterPanel({
  categories,
  filterOptions,
  activeFilters,
}: FilterPanelProps) {
  const searchParams = useSearchParams();

  const buildFilterUrl = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete('page');
    return `/trees?${params.toString()}`;
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== '');

  return (
    <div className="premium-card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Link
            href="/trees"
            className="text-xs text-forest-600 dark:text-forest-400 hover:text-forest-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </Link>
        )}
      </div>

      {/* Categories */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildFilterUrl('category', activeFilters.category === cat.slug ? '' : cat.slug)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                activeFilters.category === cat.slug
                  ? 'bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{cat._count.trees}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Family */}
      {filterOptions.families.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Family
          </h4>
          <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-hide">
            {filterOptions.families.map((fam) => (
              <Link
                key={fam.value}
                href={buildFilterUrl('family', activeFilters.family === fam.value ? '' : fam.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  activeFilters.family === fam.value
                    ? 'bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className="italic">{fam.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{fam.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Boolean Filters */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Properties
        </h4>
        {[
          { key: 'hasFruit', label: 'Fruit-bearing', active: activeFilters.hasFruit },
          { key: 'hasFlower', label: 'Flowering', active: activeFilters.hasFlower },
          { key: 'isNative', label: 'Native', active: activeFilters.isNative },
          { key: 'hasMedicinalUse', label: 'Medicinal Use', active: activeFilters.hasMedicinalUse },
        ].map(({ key, label, active }) => (
          <Link
            key={key}
            href={buildFilterUrl(key, !active)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              active
                ? 'bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                active
                  ? 'bg-forest-600 border-forest-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {active && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
