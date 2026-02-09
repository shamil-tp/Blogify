import React from 'react'

const ImageWidget = ({ url, readOnly }) => {
    return (
        <div className="w-full h-full overflow-hidden rounded-lg shadow-sm border border-slate-100 dark:border-gray-400 bg-slate-50 dark:bg-gray-300 flex items-center justify-center">
            <img
                src={url}
                alt="Post content"
                className="w-full h-full object-cover pointer-events-none"
            />
        </div>
    )
}

export default ImageWidget
