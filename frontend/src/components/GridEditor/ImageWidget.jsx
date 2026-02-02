import React from 'react'

const ImageWidget = ({ url, readOnly }) => {
    return (
        <div className="w-full h-full overflow-hidden rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-center">
            <img
                src={url}
                alt="Post content"
                className="w-full h-full object-cover pointer-events-none"
            // pointer-events-none is important so the drag handler of the grid works on the item body if needed, 
            // but usually RGL uses a handle. 
            // If we want to drag by the image content, we might need to disable pointer events or handle them carefully.
            />
        </div>
    )
}

export default ImageWidget
