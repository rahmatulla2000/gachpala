import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, TreePine, MessageSquareWarning, User,
  Mail, Calendar, Clock, Eye, CheckCircle, XCircle, Wrench, ExternalLink
} from 'lucide-react';
import { getFeedbackById } from '@/services/feedback/feedback.service';
import { formatDate } from '@/lib/utils';
import { FeedbackActionPanel } from '@/components/admin/FeedbackActionPanel';

export const metadata: Metadata = { title: 'Feedback Detail' };

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:      { label: 'Pending Review',  color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
  REVIEWED:     { label: 'Reviewed',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',         icon: Eye },
  ACTION_TAKEN: { label: 'Action Taken',    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',     icon: Wrench },
  REJECTED:     { label: 'Rejected',        color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',             icon: XCircle },
};

const ISSUE_LABELS: Record<string, string> = {
  incorrect_info:  'Incorrect Information',
  missing_info:    'Missing Information',
  wrong_image:     'Wrong Image',
  scientific_name: 'Wrong Scientific Name',
  taxonomy:        'Incorrect Taxonomy',
  other:           'Other Issue',
};

export default async function FeedbackDetailPage({ params }: { params: { id: string } }) {
  const feedback = await getFeedbackById(params.id);
  if (!feedback) notFound();

  const statusCfg = STATUS_CONFIG[feedback.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/feedback"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feedback List
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="premium-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                    Feedback: {ISSUE_LABELS[feedback.issueType] ?? feedback.issueType}
                  </h1>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusCfg.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {formatDate(feedback.createdAt.toString())}
                </p>
              </div>
            </div>
          </div>

          {/* Tree info */}
          <div className="premium-card p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Related Tree</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-forest-100 dark:bg-forest-900/20 rounded-lg flex items-center justify-center">
                  <TreePine className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {feedback.tree.banglaName} / {feedback.tree.englishName}
                  </p>
                  <p className="text-xs text-gray-400 italic">{feedback.tree.scientificName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/trees/${feedback.tree.slug}`}
                  target="_blank"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  title="View public page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/trees/${feedback.tree.id}`}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all text-xs font-medium px-3"
                >
                  Edit Tree
                </Link>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="premium-card p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {feedback.description}
            </p>
          </div>

          {/* Evidence image */}
          {feedback.evidenceImageUrl && (
            <div className="premium-card p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Evidence Image</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={feedback.evidenceImageUrl}
                  alt="Evidence"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Admin note (read from DB) */}
          {feedback.adminNote && (
            <div className="premium-card p-6 border-l-4 border-forest-500">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Note</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.adminNote}</p>
              {feedback.reviewedByName && (
                <p className="text-xs text-gray-400 mt-2">— {feedback.reviewedByName}</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Submitter info */}
          <div className="premium-card p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Submitter</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4 text-gray-400" />
                {feedback.submitterName || <span className="italic text-gray-400">Anonymous</span>}
              </div>
              {feedback.submitterEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${feedback.submitterEmail}`} className="hover:underline text-forest-600 dark:text-forest-400">
                    {feedback.submitterEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(feedback.createdAt.toString())}
              </div>
            </div>
          </div>

          {/* Action panel */}
          <div className="premium-card p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Admin Actions</h2>
            <FeedbackActionPanel feedbackId={feedback.id} currentStatus={feedback.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
