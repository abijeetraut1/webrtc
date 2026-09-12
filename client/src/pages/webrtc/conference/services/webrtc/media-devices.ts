import { peerConnection } from '../../config/webrtc.config';

export const startCamera = async (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  offerSDP: React.MutableRefObject<RTCSessionDescriptionInit | null>,
) => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
    audio: true,
  });
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  offerSDP.current = offer;

  localStreamRef.current = localStream;

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = localStream;
  }
};

export const _join_a_call = async (
  sdpOffer: RTCSessionDescriptionInit,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
): Promise<RTCSessionDescriptionInit> => {
  if (peerConnection.signalingState === 'have-local-offer') {
    await peerConnection.setLocalDescription({ type: 'rollback' });
  }

  peerConnection.ontrack = (event) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  await peerConnection.setRemoteDescription(sdpOffer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  return answer;
};

export const outGoingAudio = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  isMuted: boolean,
) => {
  if (localStreamRef.current) {
    localStreamRef.current.getAudioTracks()[0].enabled = !isMuted;
  }
};

export const outGoingVideo = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  isVideoEnabled: boolean,
) => {
  if (localStreamRef.current) {
    localStreamRef.current.getVideoTracks()[0].enabled = isVideoEnabled;
  }
};
