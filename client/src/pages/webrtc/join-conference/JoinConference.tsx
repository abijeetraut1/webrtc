import { Link2, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  _create_meetings,
  _get_meeting_details,
} from './services/create-meetings.service';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import { socketJoinRequest } from '@/lib/socket.instance';

export default function JoinConference() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');

  const handleCreateMeeting = async () => {
    const meeting = await _create_meetings();

    if (meeting.status === 201) {
      toast.success('Meeting created successfully');
      socketJoinRequest({
        meetingId: meeting.data.data.meetingCode,
      })
      navigate(`/webrtc/conference/${meeting.data.data.meetingCode}`);
    }
  };

  const _handle_join_meeting = async () => {
    const _meeting_details = await _get_meeting_details(meetingCode);

    if (_meeting_details.status === 200) {
      navigate(`/webrtc/waiting-area/${meetingCode}`);
    }
  };

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div>
          <FieldGroup>
            <div className="flex flex-col items-center gap-3 text-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Join a meeting
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Enter a meeting link or code to join your video meeting.
                </p>
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="meeting-link">Meeting code</FieldLabel>

              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="meeting-link"
                  placeholder="Enter meeting link or code"
                  className="pl-9"
                  onChange={(el) => setMeetingCode(el.target.value)}
                />
              </div>
            </Field>

            <Field>
              <Button onClick={_handle_join_meeting} className="w-full">
                Join meeting
              </Button>
            </Field>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Field>
              <Button
                variant="outline"
                onClick={handleCreateMeeting}
                type="button"
                className="w-full"
              >
                <Video className="size-4" />
                Start an instant meeting
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
