import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSubmissionById } from '@/services/submissions/submission.service';
import { getCategories } from '@/services/categories/category.service';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, User, Mail, Calendar, Info, Leaf, Image as ImageIcon } from 'lucide-react';
import { SubmissionReviewForm } from '@/components/admin';

export const metadata: Metadata = { title: 'Review Submission' };

export default async function SubmissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [submission, categories] = await Promise.all([
    getSubmissionById(params.id),
    getCategories(),
  ]);

  if (!submission) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {submission.banglaName}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                submission.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : submission.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}
            >
              {submission.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {submission.englishName} • <span className="italic">{submission.scientificName || 'No scientific name'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {submission.images && submission.images.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 text-forest-600" />
                Submitted Images ({submission.images.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {submission.images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img
                      src={img.url}
                      alt={img.altText || submission.englishName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] rounded bg-black/60 text-white font-mono">
                      {img.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Characteristics */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-forest-600" />
              Botanical & Physical Details
            </h2>
            {submission.description && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Description</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{submission.description}</p>
              </div>
            )}
            {submission.characteristics && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Characteristics</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{submission.characteristics}</p>
              </div>
            )}
            {submission.habitat && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Habitat</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{submission.habitat}</p>
              </div>
            )}
            {submission.distribution && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Distribution</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{submission.distribution}</p>
              </div>
            )}
            {submission.benefits && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Benefits</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{submission.benefits}</p>
              </div>
            )}
            {submission.uses && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Uses</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{submission.uses}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Contributor info + Approval Form */}
        <div className="space-y-6">
          {/* Contributor Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-forest-600" />
              Contributor Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 text-gray-400" />
                <span>{submission.contributorName || 'Anonymous'}</span>
              </div>
              {submission.contributorEmail && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-xs">{submission.contributorEmail}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Submitted {formatDate(submission.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <SubmissionReviewForm
              submission={submission}
              availableCategories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
