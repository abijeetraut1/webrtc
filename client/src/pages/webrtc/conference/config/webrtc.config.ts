const iceConfiguration = {
    iceServers: [
        {
            urls: import.meta.env.VITE_PUBLIC_STURN_SERVER,
        }
    ]
}

export const peerConnection = new RTCPeerConnection(iceConfiguration);