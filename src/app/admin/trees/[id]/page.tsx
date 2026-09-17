import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getTreeById } from '@/services/trees/tree.service';
import { getCategories } from '@/services/categories/category.service';
import { TreeEditForm } from '@/components/admin/TreeEditForm';

export const metadata: Metadata = { title: 'Edit Tree' };

export default async function EditTreePage({
  params,
}: {
  params: { id: string };
}) {
  const [tree, categories] = await Promise.all([
    getTreeById(params.id),
    getCategories(),
  ]);

  if (!tree) notFound();

  const allCategories = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/trees"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Trees
        </Link>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Edit Tree
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {tree.banglaName} / {tree.englishName}
          {tree.scientificName && (
            <span className="italic ml-1">({tree.scientificName})</span>
          )}
        </p>
      </div>

      <TreeEditForm
        tree={{
          id: tree.id,
          banglaName: tree.banglaName ?? '',
          englishName: tree.englishName ?? '',
          scientificName: tree.scientificName ?? '',
          commonName: tree.commonName ?? '',
          description: tree.description ?? '',
          characteristics: tree.characteristics ?? '',
          habitat: tree.habitat ?? '',
          distribution: tree.distribution ?? '',
          height: tree.height ?? '',
          lifespan: tree.lifespan ?? '',
          bark: tree.bark ?? '',
          leaves: tree.leaves ?? '',
          benefits: tree.benefits ?? '',
          uses: tree.uses ?? '',
          environmentalImportance: tree.environmentalImportance ?? '',
          culturalImportance: tree.culturalImportance ?? '',
          kingdom: tree.kingdom ?? '',
          phylum: tree.phylum ?? '',
          taxClass: tree.taxClass ?? '',
          order: tree.order ?? '',
          family: tree.family ?? '',
          genus: tree.genus ?? '',
          species: tree.species ?? '',
          sources: tree.sources ?? '',
          published: tree.published ?? false,
          featured: tree.featured ?? false,
          hasFruit: tree.hasFruit ?? false,
          hasFlower: tree.hasFlower ?? false,
          isNative: tree.isNative ?? false,
          hasMedicinalUse: tree.hasMedicinalUse ?? false,
          categories: tree.categories.map((c) => ({
            category: { id: c.category.id, name: c.category.name },
          })),
          images: tree.images.map((img) => ({
            id: img.id,
            url: img.url,
            type: img.type,
            altText: img.altText,
            isPrimary: img.isPrimary,
          })),
        }}
        allCategories={allCategories}
      />
    </div>
  );
}
