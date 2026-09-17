'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

interface Props {
  submissionId: string;
  banglaName: string;
  status: string;
}

export function SubmissionActionButtons({ submissionId, banglaName, status }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status !== 'PENDING') {
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          status === 'APPROVED'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}
      >
        {status}
      </span>
    );
  }

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    let reviewNote = '';
    if (action === 'REJECT') {
      const promptRes = window.prompt(`Reject "${banglaName}"? Reason (optional):`);
      if (promptRes === null) return; // User cancelled
      reviewNote = promptRes;
    } else {
      const confirmApprove = window.confirm(`Approve "${banglaName}" and publish it as a tree in the database?`);
      if (!confirmApprove) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewNote }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to process submission');
      } else {
        router.refresh();
      }
    } catch {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => handleAction('APPROVE')}
        disabled={loading}
        title="Approve Submission"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        <span>Approve</span>
      </button>

      <button
        onClick={() => handleAction('REJECT')}
        disabled={loading}
        title="Reject Submission"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reject</span>
      </button>
    </div>
  );
}
