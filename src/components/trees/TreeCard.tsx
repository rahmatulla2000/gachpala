import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, User, ShieldCheck, Camera } from 'lucide-react';
import type { TreeCardData } from '@/types';

interface TreeCardProps {
  tree: TreeCardData & { description?: string | null };
  featured?: boolean;
}

export function TreeCard({ tree, featured = false }: TreeCardProps) {
  const primaryImage = tree.images?.[0];
  const categoryName = tree.categories?.[0]?.category?.name;
  const createdByName = typeof tree.createdByName === 'string' ? tree.createdByName : null;
  const isAdmin = !createdByName || createdByName.toLowerCase() === 'admin';
  const authorName = isAdmin ? 'Admin' : createdByName;

  return (
    <Link
      href={`/trees/${tree.slug}`}
      className={`premium-card group overflow-hidden flex flex-col h-full ${featured ? 'hover:scale-[1.02]' : 'hover:scale-[1.01]'} transition-all duration-300`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || tree.englishName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 22V8M12 8C14.5 8 18 4 18 4H6C6 4 9.5 8 12 8ZM7 22H17" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {categoryName && (
          <div className="absolute top-3 left-3">
            <span className="badge-green text-[11px] backdrop-blur-sm bg-green-100/90 dark:bg-green-900/80">
              {categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Bangla Name */}
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
          {tree.banglaName}
        </h3>

        {/* English Name */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {tree.englishName}
        </p>

        {/* Scientific Name */}
        <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-3">
          {tree.scientificName}
        </p>

        {/* Description for featured */}
        {featured && tree.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {tree.description}
          </p>
        )}

        {/* Card Footer: Added by (Author / Admin) & View details */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400 text-[11px] truncate">
            Added by: <span className="font-semibold text-forest-700 dark:text-forest-400">{isAdmin ? 'Admin' : authorName}</span>
          </span>

          <div className="flex items-center gap-1 font-medium text-forest-700 dark:text-forest-400 group-hover:text-forest-800 dark:group-hover:text-forest-300 text-xs shrink-0">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
