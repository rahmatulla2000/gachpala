import Link from 'next/link';
import { getPublishedTrees, getFilterOptions } from '@/services/trees/tree.service';
import { getCategories } from '@/services/categories/category.service';
import { TreeCard } from '@/components/trees/TreeCard';
import { SearchBar } from '@/components/trees/SearchBar';
import { FilterPanel } from '@/components/trees/FilterPanel';
import { SortSelect } from '@/components/trees/SortSelect';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export async function TreeListContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt((searchParams.page as string) || '1');
  const search = (searchParams.search as string) || '';
  const category = (searchParams.category as string) || '';
  const family = (searchParams.family as string) || '';
  const genus = (searchParams.genus as string) || '';
  const sort = ((searchParams.sort as string) || 'date_desc') as 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'scientific';
  const hasFruit = searchParams.hasFruit === 'true' ? true : undefined;
  const hasFlower = searchParams.hasFlower === 'true' ? true : undefined;
  const isNative = searchParams.isNative === 'true' ? true : undefined;
  const hasMedicinalUse = searchParams.hasMedicinalUse === 'true' ? true : undefined;

  const [result, categories, filterOptions] = await Promise.all([
    getPublishedTrees({
      page,
      limit: 12,
      search: search || undefined,
      category: category || undefined,
      family: family || undefined,
      genus: genus || undefined,
      sort,
      hasFruit,
      hasFlower,
      isNative,
      hasMedicinalUse,
    }),
    getCategories(),
    getFilterOptions(),
  ]);

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (family) params.set('family', family);
    if (genus) params.set('genus', genus);
    if (sort !== 'date_desc') params.set('sort', sort);
    if (hasFruit) params.set('hasFruit', 'true');
    if (hasFlower) params.set('hasFlower', 'true');
    if (isNative) params.set('isNative', 'true');
    if (hasMedicinalUse) params.set('hasMedicinalUse', 'true');
    params.set('page', String(newPage));
    return `/trees?${params.toString()}`;
  };

  return (
    <div className="section-container py-6">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar defaultValue={search} />
        </div>
        <div className="flex items-center gap-3">
          <SortSelect defaultValue={sort} />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            categories={categories}
            filterOptions={filterOptions}
            activeFilters={{
              category,
              family,
              genus,
              hasFruit: hasFruit || false,
              hasFlower: hasFlower || false,
              isNative: isNative || false,
              hasMedicinalUse: hasMedicinalUse || false,
            }}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Result count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {result.total === 0 ? 'No trees found' : `Showing ${((page - 1) * 12) + 1}–${Math.min(page * 12, result.total)} of ${result.total} trees`}
          </p>

          {result.trees.length === 0 ? (
            <div className="premium-card p-12 text-center">
              <div className="text-6xl mb-4">🌳</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No trees found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filters.
              </p>
              <Link href="/trees" className="btn-outline text-sm">
                Clear all filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.trees.map((tree) => (
                  <TreeCard key={tree.id} tree={tree} />
                ))}
              </div>

              {/* Pagination */}
              {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {page > 1 && (
                    <Link
                      href={buildPageUrl(page - 1)}
                      className="btn-outline text-sm py-2 px-3"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Link>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, result.totalPages) }, (_, i) => {
                      const pageNum = page <= 3 ? i + 1 : page + i - 2;
                      if (pageNum < 1 || pageNum > result.totalPages) return null;
                      return (
                        <Link
                          key={pageNum}
                          href={buildPageUrl(pageNum)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                            pageNum === page
                              ? 'bg-forest-700 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {page < result.totalPages && (
                    <Link
                      href={buildPageUrl(page + 1)}
                      className="btn-outline text-sm py-2 px-3"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
