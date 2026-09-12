import { io } from 'socket.io-client';

const socketInstance = io('http://localhost:8080', {
  autoConnect: true,
  withCredentials: true,
});

interface JoinRequestData {
  meetingId: string;
}

export interface JoinResponseData {
  status: string;
  message: string;
}

export interface JoinAcceptanceRequestData {
  status: string;
  message: string;
  data: {
    socketId: string;
    userId: string;
    userName: string;
  };
}

export function socketJoinRequest(data: JoinRequestData) {
  const response = socketInstance.emit('webrtc:join-request', data);
  return response;
}

export function socketJoinResponse(onResponse: (data: JoinResponseData) => void) {
  socketInstance.on('webrtc:join-response', onResponse);

  return () => {
    socketInstance.off('webrtc:join-response', onResponse);
  };
}

export function socketJoinAcceptanceRequest(
  onAcceptance: (data: JoinAcceptanceRequestData) => void,
) {
  socketInstance.on('webrtc:join-acceptence-request', onAcceptance);

  return () => {
    socketInstance.off('webrtc:join-acceptence-request', onAcceptance);
  };
}

interface JoinAcceptanceResponseData {
  meetingId: string;
  isAccepted: boolean;
  userId: string;
  sdpOffer: RTCSessionDescriptionInit | null;
}

export function socketJoinAcceptanceResponse(data: JoinAcceptanceResponseData) {
  const response = socketInstance.emit('webrtc:join-acceptence-response', data);
  return response;
}

export function socketJoinAnswer(data: {
  meetingId: string;
  sdpAnswer: RTCSessionDescriptionInit;
}) {
  socketInstance.emit('webrtc:join-answer', data);
}

export default socketInstance;
