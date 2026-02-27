import React, { useEffect, useRef } from 'react';
import useVideoCall from "../hooks/useVideoCall";

const RemoteVideo = ({ stream, index }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded text-[9px] text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        User {index + 1}
      </div>
    </div>
  );
};

const VideoCallPanel = ({ socket, blogId, onLeave }) => {
  const {
    localVideo,
    remoteStreams,
    toggleMute,
    toggleCamera,
    endCall,
    isMuted,
    isCameraOff,
  } = useVideoCall(socket, blogId, onLeave);

  return (
    <div className="fixed top-24 right-6 w-80 flex flex-col gap-4 z-[100] animate-in slide-in-from-right duration-500">

      {/* REMOTE VIDEOS - Grid layout for multiple users */}
      {remoteStreams.length > 0 && (
        <div className={`grid gap-2 ${remoteStreams.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {remoteStreams.map((stream, i) => (
            <RemoteVideo key={stream.id || i} stream={stream} index={i} />
          ))}
        </div>
      )}

      {/* LOCAL VIDEO FEED */}
      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <span className="material-icons-outlined text-white/10 text-3xl">videocam_off</span>
          </div>
        )}
        <div className="absolute bottom-1.5 left-2 px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[9px] text-white font-semibold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          You {isMuted && "• Muted"}
        </div>
      </div>

      {/* COMPACT CONTROL BAR */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur-2xl rounded-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <button
          onClick={toggleMute}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          <span className="material-icons-outlined text-xl">{isMuted ? 'mic_off' : 'mic'}</span>
        </button>

        <button
          onClick={toggleCamera}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          <span className="material-icons-outlined text-xl">{isCameraOff ? 'videocam_off' : 'videocam'}</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={endCall}
          className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/30"
        >
          <span className="material-icons-outlined text-xl">call_end</span>
        </button>
      </div>

    </div>
  );
};

export default VideoCallPanel;
