import React from 'react';
import 'react-quill-new/dist/quill.snow.css'; // Import styles for consistent text formatting

const BlogRenderer = ({ content }) => {
    if (!content || !Array.isArray(content)) return null;

    // We rely on CSS Grid to replicate the 12-column layout.
    // RGL config was: rowHeight={30}, margin={[10, 10]}
    // CSS Grid gap should be 20px (10px * 2) to approximate RGL margins.

    return (
        <div className="w-full max-w-[1200px] mx-auto p-4">
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridAutoRows: '30px', // Matches the Editor's rowHeight
                    gap: '10px 20px', // Row gap 10px, Col gap 20px
                }}
            >
                {content.map((widget) => {
                    const { x, y, w, h } = widget.layout;

                    const style = {
                        gridColumnStart: x + 1,
                        gridColumnEnd: `span ${w}`,
                        gridRowStart: y + 1,
                        gridRowEnd: `span ${h}`,
                    };

                    return (
                        <div key={widget.id} style={style} className="overflow-hidden">
                            {/* TEXT WIDGET RENDERER */}
                            {widget.type === 'text' && (
                                <div
                                    className="ql-editor p-0 h-full w-full"
                                    // Using dangerouslySetInnerHTML to render the HTML string from Quill
                                    // In production, consider using DOMPurify.sanitize(widget.content)
                                    dangerouslySetInnerHTML={{ __html: widget.content }}
                                    style={{ color: 'inherit', overflowY: 'auto' }}
                                />
                            )}

                            {/* IMAGE WIDGET RENDERER */}
                            {widget.type === 'image' && (
                                <img
                                    src={widget.content}
                                    alt="Blog Content"
                                    className="w-full h-full object-cover rounded-lg shadow-sm"
                                />
                            )}

                            {/* VIDEO WIDGET RENDERER */}
                            {widget.type === 'video' && (
                                <div className="w-full h-full rounded-lg overflow-hidden shadow-sm bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={widget.content}
                                        title="Video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BlogRenderer;
