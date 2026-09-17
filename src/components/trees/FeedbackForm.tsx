'use client';

import { useState } from 'react';
import { MessageSquareWarning, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

interface FeedbackFormProps {
  treeId: string;
  treeName: string;
}

const ISSUE_TYPES = [
  { value: 'incorrect_info', label: 'Incorrect Information' },
  { value: 'missing_info', label: 'Missing Information' },
  { value: 'wrong_image', label: 'Wrong / Inappropriate Image' },
  { value: 'scientific_name', label: 'Wrong Scientific Name' },
  { value: 'taxonomy', label: 'Incorrect Taxonomy' },
  { value: 'other', label: 'Other Issue' },
];

export function FeedbackForm({ treeId, treeName }: FeedbackFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    issueType: '',
    description: '',
    submitterName: '',
    submitterEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issueType || !form.description.trim()) {
      setError('Please select an issue type and describe the problem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeId, ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSuccess(true);
      setForm({ issueType: '', description: '', submitterName: '', submitterEmail: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card overflow-hidden">
      {/* Header — toggles the form */}
      <button
        id="feedback-toggle"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <MessageSquareWarning className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              Report a Correction
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Help us improve the information about <span className="font-medium">{treeName}</span>
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible form body */}
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800">
          {success ? (
            <div className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Thank you for your feedback!</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our team will review your correction and update the information if needed.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm text-forest-600 dark:text-forest-400 hover:underline mt-1"
              >
                Submit another correction
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-5 space-y-4">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="feedback-issue-type"
                  value={form.issueType}
                  onChange={(e) => setForm((f) => ({ ...f, issueType: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                  required
                >
                  <option value="">Select issue type…</option>
                  {ISSUE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Please describe the issue in detail. Include what is incorrect and what the correct information should be…"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Submitter info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={form.submitterName}
                    onChange={(e) => setForm((f) => ({ ...f, submitterName: e.target.value }))}
                    placeholder="Anonymous"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={form.submitterEmail}
                    onChange={(e) => setForm((f) => ({ ...f, submitterEmail: e.target.value }))}
                    placeholder="we'll notify you when resolved"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/10 px-3 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                id="feedback-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Correction
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
