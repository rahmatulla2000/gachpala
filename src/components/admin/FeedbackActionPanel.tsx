'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, XCircle, Wrench, Eye, ArrowLeft,
  MessageSquareWarning, Clock, User, Mail, AlertCircle
} from 'lucide-react';

interface FeedbackActionPanelProps {
  feedbackId: string;
  currentStatus: string;
}

const ACTIONS = [
  { status: 'REVIEWED',     label: 'Mark Reviewed',    icon: Eye,          color: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { status: 'ACTION_TAKEN', label: 'Mark Action Taken', icon: Wrench,       color: 'bg-green-600 hover:bg-green-700 text-white' },
  { status: 'REJECTED',     label: 'Reject',            icon: XCircle,      color: 'bg-red-600 hover:bg-red-700 text-white' },
  { status: 'PENDING',      label: 'Re-open (Pending)', icon: Clock,        color: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
];

export function FeedbackActionPanel({ feedbackId, currentStatus }: FeedbackActionPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleAction = async (status: string) => {
    setLoading(status);
    setError('');
    try {
      const res = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note, reviewedByName: 'Admin' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Admin note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Admin Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Optional note about this feedback…"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-forest-500"
        />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.filter((a) => a.status !== currentStatus).map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.status}
              onClick={() => handleAction(action.status)}
              disabled={!!loading}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${action.color}`}
            >
              {loading === action.status ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {action.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
