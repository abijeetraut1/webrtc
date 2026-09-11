import { io } from 'socket.io-client';

const socketInstance = io('http://localhost:8080', {
  autoConnect: true,
  withCredentials: true,
});

interface JoinRequestData {
  meetingId: string;
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
  console.log('socket response: ', response);
  return response;
}

export function socketJoinResponse(onResponse: (data: unknown) => void) {
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
}

export function socketJoinAcceptanceResponse(data: JoinAcceptanceResponseData) {
  const response = socketInstance.emit('webrtc:join-acceptence-response', data);
  console.log('socket response: ', response);
  return response;
}

export default socketInstance;
