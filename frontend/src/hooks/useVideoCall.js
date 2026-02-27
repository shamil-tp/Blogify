import { useEffect, useRef, useState } from "react";

const ICE = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  iceCandidatePoolSize: 10,
};

export default function useVideoCall(socket, blogId, onLeave) {
  const localVideo = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    if (!socket || !blogId) return;

    const startCall = async () => {
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideo.current) {
          localVideo.current.srcObject = localStreamRef.current;
        }
        socket.emit("call:join", blogId);
      } catch (err) {
        console.error("Failed to get media devices:", err);
        onLeave?.();
      }
    };

    /* 🔔 USER JOINED */
    socket.on("call:user-joined", async ({ socketId }) => {
      const pc = createPeer(socketId);
      peersRef.current[socketId] = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call:signal", {
        to: socketId,
        blogId,
        signal: { sdp: pc.localDescription },
      });
    });

    /* 🔁 SIGNAL HANDLER */
    socket.on("call:signal", async ({ from, signal }) => {
      let pc = peersRef.current[from];
      if (!pc) {
        pc = createPeer(from);
        peersRef.current[from] = pc;
      }

      if (signal.sdp) {
        await pc.setRemoteDescription(signal.sdp);

        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit("call:signal", {
            to: from,
            blogId,
            signal: { sdp: pc.localDescription },
          });
        }
      }

      if (signal.candidate) {
        await pc.addIceCandidate(signal.candidate);
      }
    });

    /* 👋 USER LEFT */
    socket.on("call:user-left", (socketId) => {
      peersRef.current[socketId]?.close();
      delete peersRef.current[socketId];
      setRemoteStreams((streams) => streams.filter((s) => s.socketId !== socketId));
    });

    startCall();

    return () => {
      socket.emit("call:leave", blogId);
      Object.values(peersRef.current).forEach(pc => pc.close());
      localStreamRef.current?.getTracks().forEach(t => t.stop());

      socket.off("call:user-joined");
      socket.off("call:signal");
      socket.off("call:user-left");
    };
  }, [socket, blogId]);

  /* 🧠 PEER CREATOR */
  const createPeer = (socketId) => {
    const pc = new RTCPeerConnection(ICE);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track =>
        pc.addTrack(track, localStreamRef.current)
      );
    }

    pc.ontrack = (e) => {
      const stream = e.streams[0];
      stream.socketId = socketId; // Tag the stream with its socketId

      setRemoteStreams(prev => {
        // Check if this stream already exists
        if (prev.find(s => s.id === stream.id)) {
          return prev;
        }
        return [...prev, stream];
      });
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("📡 Sending ICE Candidate to:", socketId);
        socket.emit("call:signal", {
          to: socketId,
          blogId,
          signal: { candidate: e.candidate },
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🧊 ICE State for ${socketId}:`, pc.iceConnectionState);
      if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        console.warn("⚠️ WebRTC connection failed, might need a relay (TURN). Using Google STUN for now.");
      }
    };

    return pc;
  };

  /* 🎛️ CONTROLS */
  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => {
      t.enabled = !t.enabled;
      setIsMuted(!t.enabled);
    });
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => {
      t.enabled = !t.enabled;
      setIsCameraOff(!t.enabled);
    });
  };

  const endCall = () => {
    socket.emit("call:leave", blogId);
    Object.values(peersRef.current).forEach(pc => pc.close());
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    setRemoteStreams([]);
    onLeave?.();
  };

  return {
    localVideo,
    remoteStreams,
    toggleMute,
    toggleCamera,
    endCall,
    isMuted,
    isCameraOff,
  };
}
