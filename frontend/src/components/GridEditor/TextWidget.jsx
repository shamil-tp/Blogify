import React from 'react';
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';

// Custom toolbar options
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'align': [] }], 
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'clean'] 
    ],
};

const formats = [
    'header', 'align', 
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
];

const TextWidget = ({ id, content, onChange, readOnly = false }) => {
    const safeContent = Array.isArray(content) ? '' : content;

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-gray-300 text-slate-900 dark:text-gray-900 overflow-hidden"
            style={{ cursor: 'text' }}
            onMouseDown={(e) => e.stopPropagation()} 
        >
            <ReactQuill
                theme="snow"
                value={safeContent}
                onChange={(val) => onChange(id, val)}
                modules={readOnly ? { toolbar: false } : modules}
                formats={formats}
                readOnly={readOnly}
                className="h-full flex flex-col dark:bg-gray-300 dark:text-gray-900"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            />
            {/* Override Quill internal styles locally for flex growth and THEMING */}
            <style>{`
                .quill { display: flex; flexDirection: column; height: 100%; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
                .dark .quill { border-color: #6b7280; border-width: 1px; }
                .ql-container { flex: 1; overflow-y: auto; font-family: inherit; font-size: inherit; background-color: transparent !important; }
                .ql-editor { min-height: 100%; color: #0f172a; background-color: transparent !important; } /* Slate 900 */
                
                /* Toolbar Theming */
                .ql-toolbar { border-width: 0 0 1px 0 !important; border-color: #e2e8f0 !important; }
                .dark .ql-toolbar { border-color: #6b7280 !important; background: #d1d5db !important; color: #1f2937 !important; border-width: 0 0 2px 0 !important; }
                .dark .ql-stroke { stroke: #4b5563 !important; }
                .dark .ql-fill { fill: #4b5563 !important; }
                .dark .ql-picker { color: #4b5563 !important; }
                
                .dark .ql-picker-options { background-color: #d1d5db !important; color: #1f2937 !important; border-color: #6b7280 !important; }
                
                /* Editor Content Theming */
                .dark .ql-editor { color: #1f2937 !important; background-color: transparent !important; } /* Gray 900 */
                .dark .ql-editor p { color: #1f2937 !important; }
                .dark .ql-editor.ql-blank::before { color: #6b7280 !important; font-style: italic; } /* Gray 500 */
            `}</style>
        </div>
    );
};

export default TextWidget;
