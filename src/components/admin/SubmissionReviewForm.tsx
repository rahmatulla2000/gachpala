'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2, Tag } from 'lucide-react';
import type { SubmissionWithImages, CategoryWithCount } from '@/types';

interface Props {
  submission: SubmissionWithImages;
  availableCategories: CategoryWithCount[];
}

export function SubmissionReviewForm({ submission, availableCategories }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [reviewNote, setReviewNote] = useState(submission.reviewNote || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isReviewed = submission.status !== 'PENDING';

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (action: 'APPROVE' | 'REJECT') => {
    if (action === 'APPROVE') {
      const confirm = window.confirm(
        `Approve "${submission.banglaName}" and publish it directly to the tree catalog?`
      );
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          categoryIds: selectedCategories,
          reviewNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to process submission');
      } else {
        alert(data.message || 'Submission updated!');
        router.push('/admin/submissions');
        router.refresh();
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isReviewed) {
    return (
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white">Review Status</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This submission has already been{' '}
          <strong className={submission.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>
            {submission.status.toLowerCase()}
          </strong>.
        </p>
        {submission.reviewNote && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <span className="text-xs text-gray-400 block mb-1">Note:</span>
            <p className="text-gray-700 dark:text-gray-300">{submission.reviewNote}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-forest-600" />
          Assign Categories
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
              />
              <span>{cat.icon || '🌿'}</span>
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
          Review Note (optional)
        </label>
        <textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          placeholder="Add comments or feedback..."
          rows={3}
          className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
        />
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={() => handleSubmit('APPROVE')}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Approve & Publish Tree
        </button>

        <button
          onClick={() => handleSubmit('REJECT')}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Reject Submission
        </button>
      </div>
    </div>
  );
}

export default SubmissionReviewForm;
