'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/trees?${params.toString()}`);
  }, [value, router, searchParams]);

  const clearSearch = () => {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    router.push(`/trees?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name, scientific name, family..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="input-field pl-11 pr-20"
        aria-label="Search trees"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button
            onClick={clearSearch}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-700 text-white text-xs font-medium rounded-lg transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
}
