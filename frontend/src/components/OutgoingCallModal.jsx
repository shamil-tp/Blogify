import React from 'react';

const OutgoingCallModal = ({ callee, onCancel }) => {
    if (!callee) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-80 text-center shadow-2xl border border-slate-200 dark:border-gray-700">
                <div className="mb-6 relative">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-3xl">call</span>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                </div>

                <h3 className="font-['Outfit',_sans-serif] font-bold text-xl mb-2 text-slate-900 dark:text-gray-100">
                    Calling...
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-8">
                    Waiting for <span className="font-semibold text-blue-600 dark:text-blue-400">{callee.name || "Collaborator"}</span> to answer
                </p>

                <button
                    onClick={onCancel}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                >
                    <span className="material-icons-outlined text-lg">call_end</span>
                    Cancel Call
                </button>
            </div>
        </div>
    );
};

export default OutgoingCallModal;
