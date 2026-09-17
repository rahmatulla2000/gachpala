import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTrees } from '@/services/trees/tree.service';
import { formatDate } from '@/lib/utils';
import { Plus, CheckCircle, Eye, Edit, Star } from 'lucide-react';
import { DeleteTreeButton } from '@/components/admin/DeleteTreeButton';

export const metadata: Metadata = { title: 'Trees' };

export default async function AdminTreesPage() {
  const trees = await getAllTrees();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Trees
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage all tree entries ({trees.length} total)
          </p>
        </div>
        <Link href="/admin/trees/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add New Tree
        </Link>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tree</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Scientific Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Categories</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">Added</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {trees.map((tree) => (
                <tr key={tree.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tree.featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{tree.banglaName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{tree.englishName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="italic text-gray-500 dark:text-gray-400 text-xs">{tree.scientificName}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {tree.categories.slice(0, 2).map(({ category }) => (
                        <span key={category.id} className="text-[10px] px-2 py-0.5 bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 rounded-full">
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tree.published ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" />
                      {tree.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(tree.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/trees/${tree.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" title="View public page">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/admin/trees/${tree.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all" title="Edit tree">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteTreeButton treeId={tree.id} treeName={tree.englishName} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trees.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p>No trees yet. <Link href="/admin/trees/new" className="text-forest-600 dark:text-forest-400 hover:underline">Add your first tree.</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
