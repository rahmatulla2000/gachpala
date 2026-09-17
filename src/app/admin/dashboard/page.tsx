import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TreePine, FileText, Tag,
  Clock, CheckCircle, XCircle, Image as ImageIcon, MessageSquareWarning
} from 'lucide-react';
import { getAdminStats } from '@/services/stats/stats.service';
import { getSubmissions } from '@/services/submissions/submission.service';
import { getRecentPendingFeedbacks } from '@/services/feedback/feedback.service';
import { timeAgo } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const [stats, recentSubmissions, recentFeedbacks] = await Promise.all([
    getAdminStats(),
    getSubmissions({ status: 'PENDING', limit: 5 }),
    getRecentPendingFeedbacks(5),
  ]);

  const statCards = [
    { label: 'Total Trees', value: stats.totalTrees, icon: TreePine, color: 'text-forest-600', bg: 'bg-forest-100 dark:bg-forest-900/20', href: '/admin/trees' },
    { label: 'Categories', value: stats.totalCategories, icon: Tag, color: 'text-earth-600', bg: 'bg-earth-100 dark:bg-earth-900/20', href: '/admin/categories' },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', href: '/admin/submissions' },
    { label: 'Pending Feedback', value: stats.pendingFeedbacks, icon: MessageSquareWarning, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20', href: '/admin/feedback' },
    { label: 'Approved', value: stats.approvedContributions, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', href: '/admin/submissions?status=APPROVED' },
    { label: 'Rejected', value: stats.rejectedSubmissions, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', href: '/admin/submissions?status=REJECTED' },
    { label: 'Tree Images', value: stats.totalImages, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20', href: '/admin/trees' },
    { label: 'Total Submissions', value: stats.totalSubmissions, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', href: '/admin/submissions' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Overview of your tree database
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="premium-card p-5 hover:scale-[1.02] transition-all"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-2xl font-bold ${color} mb-0.5`}>
              {value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Pending Submissions */}
      <div className="premium-card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Pending Submissions
          </h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-forest-600 dark:text-forest-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentSubmissions.submissions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p>No pending submissions</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentSubmissions.submissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/admin/submissions/${sub.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {sub.banglaName} / {sub.englishName}
                  </p>
                  {sub.scientificName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{sub.scientificName}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="badge-yellow text-xs">Pending</span>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    {timeAgo(sub.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Pending Feedback */}
      <div className="premium-card mt-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-4 h-4 text-amber-500" />
            Recent Pending Feedback
          </h2>
          <Link
            href="/admin/feedback"
            className="text-sm text-forest-600 dark:text-forest-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentFeedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p>No pending feedback</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentFeedbacks.map((fb) => (
              <Link
                key={fb.id}
                href={`/admin/feedback/${fb.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {fb.tree.englishName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fb.issueType.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    Pending
                  </span>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    {timeAgo(fb.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link
          href="/admin/trees/new"
          className="premium-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all group"
        >
          <div className="w-10 h-10 bg-forest-100 dark:bg-forest-900/20 rounded-xl flex items-center justify-center text-forest-600 group-hover:scale-110 transition-transform">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Add New Tree</p>
            <p className="text-xs text-gray-400">Create a new tree entry</p>
          </div>
        </Link>
        <Link
          href="/admin/categories/new"
          className="premium-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all group"
        >
          <div className="w-10 h-10 bg-earth-100 dark:bg-earth-900/20 rounded-xl flex items-center justify-center text-earth-600 group-hover:scale-110 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Add Category</p>
            <p className="text-xs text-gray-400">Create a new category</p>
          </div>
        </Link>
        <Link
          href="/admin/submissions"
          className="premium-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all group"
        >
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Review Submissions</p>
            <p className="text-xs text-gray-400">{stats.pendingSubmissions} pending</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
