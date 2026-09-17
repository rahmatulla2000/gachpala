import type { Metadata } from 'next';
import Link from 'next/link';
import { getSubmissions } from '@/services/submissions/submission.service';
import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { SubmissionActionButtons } from '@/components/admin/SubmissionActionButtons';

export const metadata: Metadata = { title: 'Submissions' };

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = (searchParams.status || 'PENDING') as 'PENDING' | 'APPROVED' | 'REJECTED';
  const page = parseInt(searchParams.page || '1');

  const result = await getSubmissions({ status, page, limit: 20 });

  const tabs = [
    { label: 'Pending', value: 'PENDING', icon: Clock },
    { label: 'Approved', value: 'APPROVED', icon: CheckCircle },
    { label: 'Rejected', value: 'REJECTED', icon: XCircle },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Submissions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Review public tree contributions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-6">
        {tabs.map(({ label, value, icon: Icon }) => (
          <Link
            key={value}
            href={`/admin/submissions?status=${value}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              status === value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="premium-card overflow-hidden">
        {result.submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No {status.toLowerCase()} submissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tree</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Scientific Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Contributor</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Submitted</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {result.submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{sub.banglaName}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{sub.englishName}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="italic text-gray-500 dark:text-gray-400">{sub.scientificName || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-600 dark:text-gray-300">{sub.contributorName || 'Anonymous'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <SubmissionActionButtons
                          submissionId={sub.id}
                          banglaName={sub.banglaName}
                          status={sub.status}
                        />
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="text-forest-600 dark:text-forest-400 hover:text-forest-700 font-medium text-xs whitespace-nowrap"
                        >
                          Review →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: result.totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/admin/submissions?status=${status}&page=${i + 1}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium ${
                page === i + 1
                  ? 'bg-forest-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
