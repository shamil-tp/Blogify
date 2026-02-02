import React from 'react'

const VideoWidget = ({ url }) => {

    const getEmbedUrl = (url) => {
        if (!url) return ''
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
        return url
    }

    return (
        <div className="w-full h-full overflow-hidden rounded-lg shadow-sm bg-black relative">
            {/* Overlay to allow dragging over the iframe without getting captured by the iframe */}
            <div className="absolute inset-0 z-10 hover:bg-black/10 transition-colors cursor-move"></div>
            <iframe
                src={getEmbedUrl(url)}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full z-0 pointer-events-none"
                title="video"
            />
        </div>
    )
}

export default VideoWidget
