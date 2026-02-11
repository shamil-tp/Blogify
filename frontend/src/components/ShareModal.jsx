import React, { useState } from 'react';

const ShareModal = ({ open, onClose, docId }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const shareLink = `${window.location.origin}/edit/${docId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-[420px] rounded-xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-200">
          Share document
        </h2>

        {/* Share Link Section */}
        <div className="mb-6">
          <label className="text-sm text-slate-600 dark:text-gray-400 mb-2 block">
            Share link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 border border-slate-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-200"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition whitespace-nowrap text-sm"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
            Anyone with this link can edit this document
          </p>
        </div>

        {/* Invite Section */}
        <div className="mb-6">
          <label className="text-sm text-slate-600 dark:text-gray-400 mb-2 block">
            Invite people
          </label>
          <input
            type="email"
            placeholder="Add email address"
            className="w-full border border-slate-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-200 placeholder:text-slate-400"
          />
        </div>

        {/* Active Collaborators */}
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-gray-700">
          <label className="text-sm text-slate-600 dark:text-gray-400 mb-2 block">
            Active collaborators
          </label>
          <div className="text-sm text-slate-600 dark:text-gray-400">
            <p>Connect to server to see live collaborators</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-900 dark:text-gray-200 rounded font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
