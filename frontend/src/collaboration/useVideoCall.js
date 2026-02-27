import { useEffect, useRef, useState } from "react";

const ICE = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useVideoCall = (socket, blogId) => {
  const localVideo = useRef(null);
  const localStreamRef = useRef(null);
  const peers = useRef({});

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsCameraOff(!track.enabled);
    });
  };

  const endCall = () => {
    socket.emit("call:leave", blogId);

    Object.values(peers.current).forEach(pc => pc.close());
    peers.current = {};

    localStreamRef.current?.getTracks().forEach(t => t.stop());
    setRemoteStreams([]);
  };

 

  useEffect(() => {
    if (!socket) return;

    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (!mounted) return;

        localStreamRef.current = stream;
        localVideo.current.srcObject = stream;

        socket.emit("call:join", blogId);

        socket.on("call:user-joined", async ({ socketId }) => {
          const pc = new RTCPeerConnection(ICE);
          peers.current[socketId] = pc;

          stream.getTracks().forEach(t => pc.addTrack(t, stream));

          pc.ontrack = e => {
            setRemoteStreams(prev => [...prev, e.streams[0]]);
          };

          pc.onicecandidate = e => {
            if (e.candidate) {
              socket.emit("call:signal", {
                blogId,
                to: socketId,
                signal: { candidate: e.candidate },
              });
            }
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit("call:signal", {
            blogId,
            to: socketId,
            signal: { sdp: offer },
          });
        });

        socket.on("call:signal", async ({ from, signal }) => {
          let pc = peers.current[from];

          if (!pc) {
            pc = new RTCPeerConnection(ICE);
            peers.current[from] = pc;

            stream.getTracks().forEach(t => pc.addTrack(t, stream));

            pc.ontrack = e => {
              setRemoteStreams(prev => [...prev, e.streams[0]]);
            };

            pc.onicecandidate = e => {
              if (e.candidate) {
                socket.emit("call:signal", {
                  blogId,
                  to: from,
                  signal: { candidate: e.candidate },
                });
              }
            };
          }

          if (signal.sdp) {
            await pc.setRemoteDescription(signal.sdp);

            if (signal.sdp.type === "offer") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              socket.emit("call:signal", {
                blogId,
                to: from,
                signal: { sdp: answer },
              });
            }
          }

          if (signal.candidate) {
            await pc.addIceCandidate(signal.candidate);
          }
        });
      });

    return () => {
      mounted = false;
      endCall();
      socket.off("call:user-joined");
      socket.off("call:signal");
    };
  }, [socket, blogId]);

  return {
    localVideo,
    remoteStreams,
    toggleMute,
    toggleCamera,
    endCall,
    isMuted,
    isCameraOff,
  };
};
