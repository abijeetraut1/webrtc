export const startCamera = async (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  localVideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const localStream =
    await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });

  localStreamRef.current = localStream;

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = localStream;
  }
};

export const outGoingAudio = (localStreamRef: React.MutableRefObject<MediaStream | null>, isMuted: boolean) => {
  if (localStreamRef.current) {
    localStreamRef.current.getAudioTracks()[0].enabled = !isMuted;
  }
};

export const outGoingVideo = (localStreamRef: React.MutableRefObject<MediaStream | null>, isVideoEnabled: boolean) => {
  if (localStreamRef.current) {
    localStreamRef.current.getVideoTracks()[0].enabled = isVideoEnabled;
  }
};
