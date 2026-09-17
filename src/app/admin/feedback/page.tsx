import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquareWarning, Clock, CheckCircle, XCircle, Wrench, Filter } from 'lucide-react';
import { getFeedbacks } from '@/services/feedback/feedback.service';
import { timeAgo } from '@/lib/utils';

type FeedbackItem = Awaited<ReturnType<typeof getFeedbacks>>['feedbacks'][number];

export const metadata: Metadata = { title: 'Feedback Management' };

const STATUS_STYLES: Record<string, string> = {
  PENDING:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  REVIEWED:     'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  ACTION_TAKEN: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  REJECTED:     'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING:      Clock,
  REVIEWED:     CheckCircle,
  ACTION_TAKEN: Wrench,
  REJECTED:     XCircle,
};

const ISSUE_LABELS: Record<string, string> = {
  incorrect_info:  'Incorrect Information',
  missing_info:    'Missing Information',
  wrong_image:     'Wrong Image',
  scientific_name: 'Wrong Scientific Name',
  taxonomy:        'Incorrect Taxonomy',
  other:           'Other',
};

const STATUSES = ['ALL', 'PENDING', 'REVIEWED', 'ACTION_TAKEN', 'REJECTED'];

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = (searchParams.status && searchParams.status !== 'ALL')
    ? searchParams.status as 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'REJECTED'
    : undefined;
  const page = parseInt(searchParams.page || '1', 10);

  const { feedbacks, total, totalPages } = await getFeedbacks({ status, page, limit: 20 });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Feedback &amp; Corrections
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total} total feedback submissions
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/feedback?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              (status ?? 'ALL') === s
                ? 'bg-forest-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'All' : s === 'ACTION_TAKEN' ? 'Action Taken' : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="premium-card overflow-hidden">
        {feedbacks.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquareWarning className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-400 dark:text-gray-500">No feedback found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {feedbacks.map((fb: FeedbackItem) => {
              const StatusIcon = STATUS_ICONS[fb.status];
              return (
                <Link
                  key={fb.id}
                  href={`/admin/feedback/${fb.id}`}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquareWarning className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {fb.tree.banglaName} / {fb.tree.englishName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {ISSUE_LABELS[fb.issueType] ?? fb.issueType}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {fb.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[fb.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {fb.status === 'ACTION_TAKEN' ? 'Action Taken' : fb.status.charAt(0) + fb.status.slice(1).toLowerCase()}
                        </span>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                          {timeAgo(fb.createdAt)}
                        </p>
                        {fb.submitterName && (
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            by {fb.submitterName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 p-4 border-t border-gray-100 dark:border-gray-800">
            {page > 1 && (
              <Link href={`/admin/feedback?status=${status ?? 'ALL'}&page=${page - 1}`}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Previous
              </Link>
            )}
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            {page < totalPages && (
              <Link href={`/admin/feedback?status=${status ?? 'ALL'}&page=${page + 1}`}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
