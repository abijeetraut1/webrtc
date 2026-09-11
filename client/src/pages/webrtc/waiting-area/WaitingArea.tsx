import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { _get_meeting_details } from './services/waiting-area.service';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import buildingwaitingArea from '../../../assets/image.png';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { socketJoinRequest, socketJoinResponse } from '@/lib/socket.instance';
import { toast } from 'sonner';

interface MeetingDetails {
  meetingCode: string;
  meetingName: string;
  isPrivate: boolean;
  expiresAt: null;
}

export default function WaitingArea() {
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(
    null,
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/webrtc/join-conference', { replace: true });
      return;
    }

    const fetchMeetingDetails = async () => {
      const _meeting_details = await _get_meeting_details(id);
      setMeetingDetails(_meeting_details.data.data);
    };

    fetchMeetingDetails();
  }, [id, navigate]);

  useEffect(() => {
    return socketJoinResponse((data) => {
      if (data.status === 'NOT_FOUND') {
        toast.error(data.message);
      } else if (data.status === 'REQUEST_SUCCESS') {
        // navigate(`/webrtc/conference/${id}`, { replace: true });
        toast.success('Join request successful. Waiting for approval.');
      }
      console.log('Join meeting response:', data);
    });
  }, []);

  function joinMeetingRequest() {
    if (!id) {
      navigate('/webrtc/join-conference', { replace: true });
      return;
    }

    const joinMeetingRequestObject = {
      meetingId: id,
      userId: '1',
      userName: 'User One',
      isCreator: false,
    };

    console.log('Join Meeting Request');
    socketJoinRequest(joinMeetingRequestObject);
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="space-y-6 p-6 md:p-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Join Meeting</h2>

                  <p className="text-sm text-muted-foreground">
                    Enter the meeting code to join an existing meeting.
                  </p>
                </div>

                <FieldGroup>
                  <label htmlFor="meeting-code" className="text-sm font-medium">
                    Acceptance Note
                  </label>

                  <Textarea
                    id="meeting-code"
                    placeholder="Enter meeting code"
                    className="min-h-24 resize-none"
                  />
                </FieldGroup>

                <Button className="w-full" onClick={joinMeetingRequest}>
                  Request Join
                </Button>
              </div>

              <div className="relative hidden  bg-muted md:block">
                <img
                  src={buildingwaitingArea}
                  className="absolute inset-0 h-full w-full object-cover blur-xs grayscale"
                  alt=""
                />

                {meetingDetails && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full max-w-md p-6 text-white">
                      <div className="space-y-3">
                        <div>
                          <h2 className="mt-2 text-2xl font-bold capitalize">
                            {meetingDetails.meetingName}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-xs text-white/60">
                              This meeting is{' '}
                              <span className="font-semibold text-white/80">
                                {meetingDetails.isPrivate
                                  ? 'private'
                                  : 'public'}
                              </span>{' '}
                              and will expire on{' '}
                              <span className="font-semibold text-white/80">
                                {meetingDetails.expiresAt
                                  ? new Date(
                                    meetingDetails.expiresAt,
                                  ).toLocaleString()
                                  : 'no expiry date'}
                              </span>{' '}
                              with the joining of{' '}
                              <span className="font-semibold text-white/80">
                                {1}
                              </span>{' '}
                              participants.
                            </p>
                          </div>
                        </div>
                        <div>
                          <AspectRatio
                            ratio={16 / 9}
                            className="w-full max-w-sm bg-muted"
                          >
                            <img
                              src="https://avatar.vercel.sh/shadcn1"
                              alt="Photo"
                              className="object-cover grayscale dark:brightness-20"
                            />
                          </AspectRatio>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            .asdasdas
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
