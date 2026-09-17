'use client';

import { useState, useEffect } from 'react';
import {
  PlusCircle, Edit3, Image as ImageIcon, Trash2,
  Eye, EyeOff, Star, StarOff, MessageSquareWarning,
  Clock, ChevronDown, ChevronUp, User
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  fieldName?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
  performedByName: string;
  createdAt: string;
}

interface AuditTimelineProps {
  treeSlug: string;
}

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  TREE_CREATED:    { icon: PlusCircle,           color: 'text-green-500 bg-green-100 dark:bg-green-900/20',  label: 'Tree Added' },
  TREE_UPDATED:    { icon: Edit3,                color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',     label: 'Information Updated' },
  IMAGE_ADDED:     { icon: ImageIcon,            color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20', label: 'Image Added' },
  IMAGE_REMOVED:   { icon: Trash2,              color: 'text-red-500 bg-red-100 dark:bg-red-900/20',         label: 'Image Removed' },
  FEEDBACK_APPLIED:{ icon: MessageSquareWarning, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/20',  label: 'Correction Applied' },
  PUBLISHED:       { icon: Eye,                 color: 'text-green-500 bg-green-100 dark:bg-green-900/20',   label: 'Published' },
  UNPUBLISHED:     { icon: EyeOff,              color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',          label: 'Unpublished' },
  FEATURED:        { icon: Star,                color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20', label: 'Marked as Featured' },
  UNFEATURED:      { icon: StarOff,             color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',          label: 'Removed from Featured' },
};

const FIELD_LABELS: Record<string, string> = {
  banglaName: 'Bangla Name', englishName: 'English Name', commonName: 'Common Name',
  scientificName: 'Scientific Name', kingdom: 'Kingdom', phylum: 'Phylum',
  taxClass: 'Class', order: 'Order', family: 'Family', genus: 'Genus', species: 'Species',
  description: 'Description', characteristics: 'Characteristics', habitat: 'Habitat',
  distribution: 'Distribution', height: 'Height', lifespan: 'Lifespan',
  bark: 'Bark', leaves: 'Leaves', benefits: 'Benefits', uses: 'Uses',
  environmentalImportance: 'Environmental Importance', culturalImportance: 'Cultural Importance',
  sources: 'Sources',
};

function AuditEntry({ log }: { log: AuditLog }) {
  const [expanded, setExpanded] = useState(false);
  const config = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.TREE_UPDATED;
  const Icon = config.icon;
  const hasDetail = log.fieldName || log.previousValue || log.newValue || log.reason;

  return (
    <div className="flex gap-4 group">
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-5 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              {config.label}
              {log.fieldName && (
                <span className="ml-1.5 text-gray-500 dark:text-gray-400 font-normal">
                  — {FIELD_LABELS[log.fieldName] ?? log.fieldName}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {log.performedByName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(log.createdAt)}
              </span>
            </div>
          </div>

          {hasDetail && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 flex-shrink-0 mt-0.5"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Hide' : 'Details'}
            </button>
          )}
        </div>

        {/* Expandable diff */}
        {expanded && hasDetail && (
          <div className="mt-3 space-y-2 text-xs">
            {log.previousValue && (
              <div className="flex gap-2">
                <span className="text-red-500 font-medium w-16 flex-shrink-0">Before:</span>
                <span className="text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-lg line-clamp-3">
                  {log.previousValue}
                </span>
              </div>
            )}
            {log.newValue && (
              <div className="flex gap-2">
                <span className="text-green-500 font-medium w-16 flex-shrink-0">After:</span>
                <span className="text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-lg line-clamp-3">
                  {log.newValue}
                </span>
              </div>
            )}
            {log.reason && (
              <div className="flex gap-2">
                <span className="text-amber-500 font-medium w-16 flex-shrink-0">Reason:</span>
                <span className="text-gray-600 dark:text-gray-300">{log.reason}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuditTimeline({ treeSlug }: AuditTimelineProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trees/${treeSlug}/audit?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data.logs);
          setTotalPages(data.data.totalPages);
        } else {
          setError('Could not load activity history.');
        }
      })
      .catch(() => setError('Could not load activity history.'))
      .finally(() => setLoading(false));
  }, [treeSlug, page]);

  if (loading) {
    return (
      <div className="premium-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card p-6 text-center text-gray-400 text-sm">{error}</div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="premium-card p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="premium-card p-6 md:p-8">
      <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-forest-600 dark:text-forest-400" />
        Activity History
        <span className="text-xs font-normal text-gray-400 ml-1">(read-only)</span>
      </h3>

      <div className="space-y-0">
        {logs.map((log) => (
          <AuditEntry key={log.id} log={log} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
