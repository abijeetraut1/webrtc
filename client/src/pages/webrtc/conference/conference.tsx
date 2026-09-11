
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import type { Controls } from "@/pages/webrtc/conference/types/controls";
import { outGoingAudio, outGoingVideo, startCamera } from "./services/webrtc/media-devices";
import avatar from "../../../assets/avatar.png";
import socketInstance, { socketJoinAcceptanceResponse } from "@/lib/socket.instance";
import { socketJoinAcceptanceRequest } from "@/lib/socket.instance";
import { toast } from "sonner";
import { useParams } from "react-router";

export default function Conference() {
    const { id } = useParams<{ id: string }>();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const [controls, setControls] = useState<Controls>({
        isMuteEnabled: false,
        isVideoEnabled: true,
    });

    useEffect(() => {
        const handleConnect = () => {
            console.log("Connected to the signaling server");
        };
        socketInstance.on("connect", handleConnect);

        if (id) {
            socketJoinAcceptanceRequest((data) => {
                console.log("JOIN ACCEPTANCE REQUEST: ", data)
                toast("Join Request", {
                    description: `Join request from ${data.data.userName} (${data.data.userId})`,
                    action: {
                        label: "Accept",
                        onClick: () => socketJoinAcceptanceResponse({ meetingId: id, isAccepted: true, userId: data.data.userId }),
                    },
                })
            });
        }

        return () => {
            socketInstance.off("connect", handleConnect);
        };
    }, []);

    useEffect(() => {
        startCamera(
            localStreamRef,
            localVideoRef
        );
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
                        <img
                            src="#"
                            alt="Remote video"
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