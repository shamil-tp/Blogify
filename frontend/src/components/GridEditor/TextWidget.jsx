import React from 'react';
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';

// Custom toolbar options
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'align': [] }], // Added Alignment
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'clean'] // Removed image/video since we have widgets for that
    ],
};

const formats = [
    'header', 'align', // Added Format
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
];

const TextWidget = ({ id, content, onChange, readOnly = false }) => {
    // Quill uses HTML strings. 
    const safeContent = Array.isArray(content) ? '' : content;

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden"
            style={{ cursor: 'text' }}
            onMouseDown={(e) => e.stopPropagation()} /* Allow clicking into editor */
        >
            <ReactQuill
                theme="snow"
                value={safeContent}
                onChange={(val) => onChange(id, val)}
                modules={readOnly ? { toolbar: false } : modules}
                formats={formats}
                readOnly={readOnly}
                className="h-full flex flex-col dark:bg-slate-800 dark:text-slate-100"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            />
            {/* Override Quill internal styles locally for flex growth and THEMING */}
            <style>{`
                .quill { display: flex; flexDirection: column; height: 100%; }
                .ql-container { flex: 1; overflow-y: auto; font-family: inherit; font-size: inherit; background-color: transparent !important; }
                .ql-editor { min-height: 100%; color: #0f172a; background-color: transparent !important; } /* Slate 900 */
                
                /* Toolbar Theming */
                .ql-toolbar { border-width: 0 0 1px 0 !important; border-color: #e2e8f0 !important; }
                .dark .ql-toolbar { border-color: #334155 !important; background: #1e293b !important; color: #f8fafc !important; }
                .dark .ql-stroke { stroke: #cbd5e1 !important; }
                .dark .ql-fill { fill: #cbd5e1 !important; }
                .dark .ql-picker { color: #cbd5e1 !important; }
                
                .dark .ql-picker-options { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important; }
                
                /* Editor Content Theming */
                .dark .ql-editor { color: #f1f5f9 !important; background-color: transparent !important; } /* Slate 100 */
                .dark .ql-editor p { color: #f1f5f9 !important; }
                .dark .ql-editor.ql-blank::before { color: #64748b !important; font-style: italic; } /* Slate 500 */
            `}</style>
        </div>
    );
};

export default TextWidget;
