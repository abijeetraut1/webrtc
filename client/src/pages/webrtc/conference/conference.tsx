
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import type { Controls } from "@/pages/webrtc/conference/types/controls";
import { _join_a_call, outGoingAudio, outGoingVideo, startCamera } from "./services/webrtc/media-devices";
import avatar from "../../../assets/avatar.png";
import socketInstance, { socketJoinAcceptanceResponse, socketJoinAnswer, socketJoinRequest, socketJoinResponse } from "@/lib/socket.instance";
import { socketJoinAcceptanceRequest } from "@/lib/socket.instance";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import { _get_meeting_details } from "./services/api/api.service";
import { peerConnection } from "./config/webrtc.config";

export default function Conference() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const [controls, setControls] = useState<Controls>({
        isMuteEnabled: false,
        isVideoEnabled: true,
    });
    const offerSDP = useRef<RTCSessionDescriptionInit | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!id) {
            toast.error("No meeting ID provided.");
            return;
        }

        const fetchMeetingDetails = async () => {
            const meeting_details = await _get_meeting_details(id);

            if (meeting_details.data.status === "NOT_FOUND") {
                toast.error(meeting_details.data.message);
                navigate('/webrtc/join-conference', { replace: true });
                return;
            } else if (meeting_details.data.status === "EXPIRED") {
                toast.error(meeting_details.data.message);
                navigate('/webrtc/join-conference', { replace: true });
                return;
            }

            if (meeting_details.data.data.isAdmin) {
                toast.success("You are the admin of this meeting. You can start the call.");
                navigate(`/webrtc/conference/${id}`, { replace: true });
            } else {
                if (meeting_details.data.data.isPrivate) {
                    socketJoinRequest({ meetingId: id });
                }

                socketJoinResponse((data) => {
                    if (data.status === 'NOT_FOUND') {
                        toast.error(data.message);
                    } else if (data.status === 'REQUEST_SUCCESS') {
                        // navigate(`/webrtc/conference/${id}`, { replace: true });
                        toast.success('Join request successful. Waiting for approval.');
                    }
                    console.log('Join meeting response:', data);
                });

            }


            console.log("Meeting Details: ", meeting_details);

        }
        fetchMeetingDetails();

    }, [id, navigate]);


    useEffect(() => {
        const handleConnect = () => {
            console.log("Connected to the signaling server");
        };
        const handleTrack = (event: RTCTrackEvent) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        socketInstance.on("connect", handleConnect);
        peerConnection.ontrack = handleTrack;

        if (id) {
            const handleAcceptanceResult = async (data: { message: { isAccepted: boolean; sdpOffer: RTCSessionDescriptionInit } }) => {
                console.log('Join acceptance result: ', data);

                if (data.message.isAccepted === true) {
                    try {
                        const sdpAnswer = await _join_a_call(data.message.sdpOffer, remoteVideoRef);
                        socketJoinAnswer({ meetingId: id, sdpAnswer });
                    } catch (error) {
                        console.error('Error joining the conference call:', error);
                        toast.error('Unable to join the conference call.');
                        return;
                    }

                    toast.success('Joining the conference call ...');
                }
            };

            socketInstance.on("webrtc:join-acceptence-result", handleAcceptanceResult);

            const handleJoinAnswer = async (data: { sdpAnswer: RTCSessionDescriptionInit }) => {
                try {
                    await peerConnection.setRemoteDescription(data.sdpAnswer);
                } catch (error) {
                    console.error('Error applying the join answer:', error);
                }
            };

            socketInstance.on("webrtc:join-answer", handleJoinAnswer);


            const removeAcceptanceListener = socketJoinAcceptanceRequest((data) => {
                console.log("JOIN ACCEPTANCE REQUEST: ", data)
                toast("Join Request", {
                    description: `Join request from ${data.data.userName} (${data.data.userId})`,
                    action: {
                        label: "Accept",
                        onClick: () => {
                            if (!offerSDP.current) {
                                toast.error('Call setup is still in progress. Please try again.');
                                return;
                            }

                            socketJoinAcceptanceResponse({ meetingId: id, isAccepted: true, userId: data.data.userId, sdpOffer: offerSDP.current });
                        },
                    },
                })
            });

            return () => {
                removeAcceptanceListener();
                socketInstance.off("webrtc:join-acceptence-result", handleAcceptanceResult);
                socketInstance.off("webrtc:join-answer", handleJoinAnswer);
                socketInstance.off("connect", handleConnect);
                peerConnection.ontrack = null;
            };
        }

        return () => {
            socketInstance.off("connect", handleConnect);
            peerConnection.ontrack = null;
        };
    }, [id]);

    useEffect(() => {

        const initializeCall = async () => {
            try {
                await startCamera(localStreamRef, localVideoRef, offerSDP);
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === "NotReadableError") {
                    toast.error("Camera is already in use by another application. Please close that application and try again.");
                } else {
                    toast.error("Error accessing camera and microphone. Please check your device settings.");
                }
            }
        };

        void initializeCall();
    }, []);

    useEffect(() => {
        outGoingAudio(localStreamRef, controls.isMuteEnabled);
    }, [controls.isMuteEnabled]);

    useEffect(() => {
        outGoingVideo(localStreamRef, controls.isVideoEnabled);
    }, [controls.isVideoEnabled]);

    return (
        <div className="relative w-full max-w-7xl overflow-hidden border-0 bg-black shadow-2xl">
            <div className="relative">
                <AspectRatio ratio={16 / 9}>
                    <div className="relative h-full w-full bg-muted">
                        <video
                            id="remote-video"
                            ref={remoteVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                        />
                        <div
                            className="absolute bottom-4 right-4 w-48 overflow-hidden border border-white/20 bg-muted shadow-xl sm:w-56 md:w-64">
                            <AspectRatio ratio={16 / 9}>
                                <div className="relative h-full w-full">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className={`h-full w-full object-cover ${controls.isVideoEnabled ? "block" : "hidden"}`}
                                    />

                                    {!controls.isVideoEnabled && (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Avatar size="lg">
                                                <AvatarImage src={avatar} />
                                                <AvatarFallback>DF</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}
                                </div>
                            </AspectRatio>
                        </div>
                    </div>
                </AspectRatio>
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-3 p-3">
                <div>
                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-12 w-12 rounded-full ${controls.isMuteEnabled ? 'bg-red-500' : 'bg-muted'}`}
                        onClick={() => setControls(prev => ({ ...prev, isMuteEnabled: !prev.isMuteEnabled }))}
                    >
                        {controls.isMuteEnabled ? (
                            <MicOff className="h-5 w-5" />
                        ) : (
                            <Mic className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                <div>
                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-12 w-12 rounded-full ${controls.isVideoEnabled ? 'bg-muted' : 'bg-red-500'}`}
                        onClick={() => setControls(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))}
                    >
                        {controls.isVideoEnabled ? (
                            <Video className="h-5 w-5" />
                        ) : (
                            <VideoOff className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                <Button
                    size="icon"
                    variant="destructive"
                    className="h-12 w-12 rounded-full"
                >
                    <PhoneOff className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}